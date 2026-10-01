/**
 * Where imported courses live.
 *
 * `localStorage` is the wrong shelf for this. A real repertoire course is a
 * megabyte or two of PGN and people own several, which is the whole of the
 * five-megabyte budget shared with everything else the app keeps — and the way
 * you find out is an import that silently fails. IndexedDB has no such ceiling
 * and costs about eighty lines to talk to directly, which is cheaper than a
 * dependency.
 *
 * What is stored is the PGN as it was imported, not the tree built from it: the
 * tree is rebuilt on open, so a fix to the importer reaches courses somebody
 * imported last month.
 *
 * There is a memory-backed fallback for when `indexedDB` is missing — private
 * modes block it, and the render tests run under Node with no browser storage at
 * all. The app then works for the session and forgets afterwards, which is a far
 * better failure than a blank page.
 */

import type { CourseProgress, CourseSide } from '@coh/course';

const DB_NAME = 'coh-courses';
const DB_VERSION = 1;
const COURSES = 'courses';
const PROGRESS = 'progress';

export interface StoredCourse {
  id: string;
  name: string;
  pgn: string;
  side: CourseSide;
  importedAt: number;
}

interface ProgressRecord {
  courseId: string;
  moves: CourseProgress;
}

/* --------------------------------------------------------- the fallback --- */

const memoryCourses = new Map<string, StoredCourse>();
const memoryProgress = new Map<string, CourseProgress>();

let dbPromise: Promise<IDBDatabase> | null = null;
let memoryOnly = false;
let storageWarning: string | null = null;
const listeners = new Set<() => void>();
export const getCourseStorageWarning = () => storageWarning;
export function subscribeCourseStorage(listener: () => void): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
function useMemory(): void {
  memoryOnly = true;
  storageWarning = 'Browser storage is unavailable. Course changes and progress are kept only for this tab; they will be lost when you close or reload it.';
  for (const listener of listeners) listener();
}

function openDb(): Promise<IDBDatabase> | null {
  if (memoryOnly) return null;
  if (typeof indexedDB === 'undefined') { useMemory(); return null; }
  dbPromise ??= new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(COURSES)) db.createObjectStore(COURSES, { keyPath: 'id' });
      if (!db.objectStoreNames.contains(PROGRESS)) {
        db.createObjectStore(PROGRESS, { keyPath: 'courseId' });
      }
    };
    request.onsuccess = () => {
      const database = request.result;
      if (memoryOnly) { database.close(); return; }
      database.onversionchange = () => { database.close(); dbPromise = null; };
      resolve(database);
    };
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('Course storage is blocked by another tab'));
  }).catch((error: unknown) => {
    dbPromise = null;
    throw error;
  });
  return dbPromise;
}

/** Runs one transaction, resolving with whatever the request produced. */
function run<T>(
  store: string,
  mode: IDBTransactionMode,
  work: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> | null {
  const db = openDb();
  if (!db) return null;
  return db.then(
    (database) =>
      new Promise<T>((resolve, reject) => {
        const transaction = database.transaction(store, mode);
        const request = work(transaction.objectStore(store));
        // Request success is provisional: quota errors can still abort commit.
        transaction.oncomplete = () => resolve(request.result);
        transaction.onabort = () => reject(transaction.error ?? new Error('Course save was aborted'));
        transaction.onerror = () => reject(transaction.error ?? request.error);
      }),
  ).catch((error: unknown) => { useMemory(); throw error; });
}

/* ------------------------------------------------------------- courses --- */

export async function listCourses(): Promise<StoredCourse[]> {
  const remembered = () => [...memoryCourses.values()];
  const pending = run<StoredCourse[]>(COURSES, 'readonly', (store) => store.getAll());
  const courses = pending ? await pending.catch(remembered) : remembered();
  for (const course of courses) memoryCourses.set(course.id, course);
  return courses.sort((a, b) => b.importedAt - a.importedAt);
}

export async function saveCourse(course: StoredCourse): Promise<void> {
  memoryCourses.set(course.id, course);
  await run(COURSES, 'readwrite', (store) => store.put(course))?.catch(() => {});
}

export async function deleteCourse(id: string): Promise<void> {
  memoryCourses.delete(id);
  memoryProgress.delete(id);
  await run(COURSES, 'readwrite', (store) => store.delete(id))?.catch(() => {});
  await run(PROGRESS, 'readwrite', (store) => store.delete(id))?.catch(() => {});
}

/* ------------------------------------------------------------ progress --- */

export async function loadProgress(courseId: string): Promise<CourseProgress> {
  const pending = run<ProgressRecord | undefined>(PROGRESS, 'readonly', (store) =>
    store.get(courseId),
  );
  if (!pending) return memoryProgress.get(courseId) ?? {};
  const record = await pending.catch(() => undefined);
  if (record) memoryProgress.set(courseId, record.moves);
  return record?.moves ?? memoryProgress.get(courseId) ?? {};
}

export async function saveProgress(courseId: string, moves: CourseProgress): Promise<void> {
  memoryProgress.set(courseId, moves);
  await run(PROGRESS, 'readwrite', (store) => store.put({ courseId, moves }))?.catch(() => {});
}

export async function clearProgress(courseId: string): Promise<void> {
  memoryProgress.delete(courseId);
  await run(PROGRESS, 'readwrite', (store) => store.delete(courseId))?.catch(() => {});
}

/**
 * An id that will not collide with a course already on the shelf. Names repeat —
 * two exports of the same repertoire a month apart are two courses, and the
 * second must not overwrite the progress of the first.
 */
export function uniqueCourseId(base: string, taken: readonly string[]): string {
  const existing = new Set(taken);
  if (!existing.has(base)) return base;
  for (let n = 2; ; n++) {
    const candidate = `${base}-${n}`;
    if (!existing.has(candidate)) return candidate;
  }
}
