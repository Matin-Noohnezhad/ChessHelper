import { buildCourse } from '@coh/course';
import type { Course } from '@coh/course';
import type { StoredCourse } from './storage/courseStore.js';

const built = new Map<string, { stored: StoredCourse; course: Course }>();
const pending = new Map<string, { stored: StoredCourse; promise: Promise<Course> }>();
const requests = new Map<number, { resolve: (course: Course) => void; reject: (error: Error) => void }>();
let worker: Worker | undefined;
let nextRequest = 0;

function sameSource(a: StoredCourse, b: StoredCourse): boolean {
  return a.id === b.id && a.name === b.name && a.side === b.side && a.pgn === b.pgn &&
    (a.sectionHeader ?? 'White') === (b.sectionHeader ?? 'White');
}

export function forgetCourse(id: string): void { built.delete(id); pending.delete(id); }

/** Synchronous callers/tests reuse the same tree as the asynchronous library. */
export function courseFor(stored: StoredCourse): Course {
  const cached = built.get(stored.id);
  if (cached && sameSource(cached.stored, stored)) return cached.course;
  const course = buildCourse(stored.pgn, { id: stored.id, name: stored.name, side: stored.side,
    sectionHeader: stored.sectionHeader ?? 'White' });
  built.set(stored.id, { stored, course });
  return course;
}

function buildInWorker(stored: StoredCourse): Promise<Course> {
  if (typeof Worker === 'undefined') return Promise.resolve(courseFor(stored));
  if (!worker) {
    worker = new Worker(new URL('./courseBuild.worker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = (event: MessageEvent<{ requestId: number; course: Course; error?: string }>) => {
      const request = requests.get(event.data.requestId);
      requests.delete(event.data.requestId);
      if (event.data.error) request?.reject(new Error(event.data.error));
      else request?.resolve(event.data.course);
    };
    worker.onerror = () => {
      worker?.terminate();
      worker = undefined;
      for (const request of requests.values()) request.reject(new Error('Could not prepare the course. Please try again.'));
      requests.clear();
    };
  }
  const requestId = ++nextRequest;
  return new Promise((resolve, reject) => {
    requests.set(requestId, { resolve, reject });
    worker!.postMessage({ requestId, stored });
  });
}

export async function loadCourse(stored: StoredCourse): Promise<Course> {
  const cached = built.get(stored.id);
  if (cached && sameSource(cached.stored, stored)) return cached.course;
  const existing = pending.get(stored.id);
  if (existing && sameSource(existing.stored, stored)) return existing.promise;
  const promise = buildInWorker(stored);
  const request = { stored, promise };
  pending.set(stored.id, request);
  try {
    const course = await promise;
    if (pending.get(stored.id) === request) built.set(stored.id, { stored, course });
    return course;
  } finally {
    if (pending.get(stored.id) === request) pending.delete(stored.id);
  }
}
