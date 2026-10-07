/**
 * Where imported courses live.
 *
 * On the server that serves the app, when there is one: `npm run dev` and
 * `vite preview` keep the shelf on disk (see `server/courseApi.ts`), so a course
 * imported in Chrome is there when the app opens in Firefox. Courses a browser
 * kept for itself before that are handed over the first time it finds the
 * server, then dropped locally — otherwise a course deleted elsewhere would come
 * back from the browser that still had a copy.
 *
 * Served as plain static files there is no server to ask, and the shelf falls
 * back to this browser's IndexedDB. `localStorage` is the wrong shelf for this. A real repertoire course is a
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

import type { CourseProgress, CourseSide, SectionHeader } from '@coh/course';

const DB_NAME = 'coh-courses';
const DB_VERSION = 1;
const COURSES = 'courses';
const PROGRESS = 'progress';

export interface StoredCourse {
  id: string;
  name: string;
  pgn: string;
  side: CourseSide;
  sectionHeader?: SectionHeader;
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
function warn(message: string): void {
  storageWarning = message;
  for (const listener of listeners) listener();
}
function useMemory(): void {
  memoryOnly = true;
  warn('Browser storage is unavailable. Course changes and progress are kept only for this tab; they will be lost when you close or reload it.');
}

/* ----------------------------------------------------------- the server --- */

const API = `${import.meta.env.BASE_URL}api`;
let serverPromise: Promise<boolean> | null = null;

/** Whether the app is served with the shared shelf. Asked once per page load. */
function onServer(): Promise<boolean> {
  serverPromise ??= (async () => {
    try {
      const response = await fetch(`${API}/health`);
      // A static host answers unknown paths with index.html, hence the body check.
      const body = response.ok ? await response.json() as { ok?: unknown } : null;
      if (body?.ok !== true) return false;
    } catch {
      return false;
    }
    await adoptBrowserCourses().catch(() => {
      warn('Some courses saved only in this browser could not be moved to the shared course shelf. They will be tried again the next time the page loads.');
    });
    return true;
  })();
  return serverPromise;
}

async function remote<T = void>(method: string, path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${API}/${path}`, body === undefined ? { method } : {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`The course server answered ${response.status}`);
  return (response.status === 204 ? undefined : await response.json()) as T;
}

function serverDown(): void {
  warn('The course server is not answering, so recent course changes are kept only in this tab. Make sure `npm run dev` is still running, then reload.');
}

/**
 * Writes for one course, sent one after another. Progress is saved after every
 * move, and two saves racing over separate connections could land in the wrong
 * order and put an older map on disk.
 */
const writes = new Map<string, Promise<void>>();
function inOrder(courseId: string, work: () => Promise<void>): Promise<void> {
  const next = (writes.get(courseId) ?? Promise.resolve()).then(work).catch(serverDown);
  writes.set(courseId, next);
  void next.then(() => { if (writes.get(courseId) === next) writes.delete(courseId); });
  return next;
}

const path = (kind: 'courses' | 'progress', id: string) => `${kind}/${encodeURIComponent(id)}`;

/** Moves the courses this browser kept in IndexedDB onto the server's shelf. */
async function adoptBrowserCourses(): Promise<void> {
  // A browser whose IndexedDB will not open has nothing to hand over.
  const local = await transact<StoredCourse[]>(COURSES, 'readonly', (store) => store.getAll())
    ?.catch(() => undefined);
  if (!local?.length) return;
  const shelf = await remote<StoredCourse[]>('GET', 'courses');
  const taken = shelf.map((course) => course.id);
  for (const course of local) {
    const twin = shelf.find((other) => other.id === course.id);
    // The same import, already handed over by another tab of this browser.
    if (!twin || twin.pgn !== course.pgn || twin.importedAt !== course.importedAt) {
      const id = uniqueCourseId(course.id, taken);
      taken.push(id);
      const record = await transact<ProgressRecord | undefined>(PROGRESS, 'readonly', (store) =>
        store.get(course.id),
      );
      // Progress first: a course on the shelf is taken as fully moved.
      if (record) await remote('PUT', path('progress', id), record.moves);
      await remote('PUT', path('courses', id), { ...course, id });
    }
    await transact(PROGRESS, 'readwrite', (store) => store.delete(course.id));
    await transact(COURSES, 'readwrite', (store) => store.delete(course.id));
  }
}

/* ---------------------------------------------------------- IndexedDB --- */

function openDb(): Promise<IDBDatabase> | null {
  if (typeof indexedDB === 'undefined') return null;
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
function transact<T>(
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
  );
}

/** A transaction on the shelf itself, where failing means falling back to memory. */
function run<T>(
  store: string,
  mode: IDBTransactionMode,
  work: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> | null {
  if (memoryOnly) return null;
  const pending = transact(store, mode, work);
  if (!pending) { useMemory(); return null; }
  return pending.catch((error: unknown) => { useMemory(); throw error; });
}

/* ------------------------------------------------------------- courses --- */

export async function listCourses(): Promise<StoredCourse[]> {
  const remembered = () => [...memoryCourses.values()];
  let courses: StoredCourse[];
  if (await onServer()) {
    courses = await remote<StoredCourse[]>('GET', 'courses').catch(() => { serverDown(); return remembered(); });
  } else {
    const pending = run<StoredCourse[]>(COURSES, 'readonly', (store) => store.getAll());
    courses = pending ? await pending.catch(remembered) : remembered();
  }
  for (const course of courses) memoryCourses.set(course.id, course);
  return courses.sort((a, b) => b.importedAt - a.importedAt);
}

export async function saveCourse(course: StoredCourse): Promise<void> {
  memoryCourses.set(course.id, course);
  if (await onServer()) return inOrder(course.id, () => remote('PUT', path('courses', course.id), course));
  await run(COURSES, 'readwrite', (store) => store.put(course))?.catch(() => {});
}

export async function deleteCourse(id: string): Promise<void> {
  memoryCourses.delete(id);
  memoryProgress.delete(id);
  if (await onServer()) return inOrder(id, () => remote('DELETE', path('courses', id)));
  await run(COURSES, 'readwrite', (store) => store.delete(id))?.catch(() => {});
  await run(PROGRESS, 'readwrite', (store) => store.delete(id))?.catch(() => {});
}

/* ------------------------------------------------------------ progress --- */

export async function loadProgress(courseId: string): Promise<CourseProgress> {
  if (await onServer()) {
    const moves = await remote<CourseProgress>('GET', path('progress', courseId)).catch(() => {
      serverDown();
      return undefined;
    });
    if (moves) memoryProgress.set(courseId, moves);
    return moves ?? memoryProgress.get(courseId) ?? {};
  }
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
  if (await onServer()) return inOrder(courseId, () => remote('PUT', path('progress', courseId), moves));
  await run(PROGRESS, 'readwrite', (store) => store.put({ courseId, moves }))?.catch(() => {});
}

export async function clearProgress(courseId: string): Promise<void> {
  memoryProgress.delete(courseId);
  if (await onServer()) return inOrder(courseId, () => remote('DELETE', path('progress', courseId)));
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
