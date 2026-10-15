import { buildCourse } from '@coh/course';
import type { Course } from '@coh/course';
import type { StoredCourse } from './storage/courseStore.js';

// Bump when the importer changes the meaning/shape of a compiled course.
export const COURSE_BUILD_VERSION = 1;
const DATABASE = 'coh-compiled-courses';
const STORE = 'compiled';
interface CompiledCourse { id: string; fingerprint: string; course: Course }

export async function courseFingerprint(stored: StoredCourse): Promise<string> {
  const source = JSON.stringify([COURSE_BUILD_VERSION, stored.id, stored.name, stored.side,
    stored.sectionHeader ?? 'White', stored.pgn]);
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(source));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function openCache(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === 'undefined') return Promise.resolve(null);
  return new Promise((resolve) => {
    const request = indexedDB.open(DATABASE, 1);
    let finished = false;
    const finish = (db: IDBDatabase | null) => {
      if (finished) { db?.close(); return; }
      finished = true;
      clearTimeout(timer);
      resolve(db);
    };
    const timer = setTimeout(() => finish(null), 1500);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: 'id' });
    request.onsuccess = () => finish(request.result);
    request.onerror = request.onblocked = () => finish(null);
  });
}

async function cached(db: IDBDatabase, id: string): Promise<CompiledCourse | undefined> {
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE).objectStore(STORE).get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function save(db: IDBDatabase, value: CompiledCourse): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE, 'readwrite');
    transaction.objectStore(STORE).put(value);
    transaction.oncomplete = () => resolve();
    transaction.onerror = transaction.onabort = () => reject(transaction.error);
  });
}

/** Runs in a worker. This cache is disposable; the original PGN remains authoritative. */
export async function compileCourse(stored: StoredCourse): Promise<Course> {
  let db: IDBDatabase | null = null;
  let fingerprint: string | undefined;
  try {
    try {
      fingerprint = await courseFingerprint(stored);
      db = await openCache();
      const record = db ? await cached(db, stored.id) : undefined;
      if (record?.fingerprint === fingerprint && Array.isArray(record.course?.chapters)) return record.course;
    } catch {
      // Private browsing, quota limits, or a broken cache must not hide courses.
    }
    const course = buildCourse(stored.pgn, { id: stored.id, name: stored.name, side: stored.side,
      sectionHeader: stored.sectionHeader ?? 'White' });
    if (db && fingerprint) await save(db, { id: stored.id, fingerprint, course }).catch(() => {});
    return course;
  } finally {
    db?.close();
  }
}
