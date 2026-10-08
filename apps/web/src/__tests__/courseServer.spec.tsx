import { createServer } from 'node:http';
import type { Server } from 'node:http';
import { mkdtemp, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { courseRequestHandler } from '../../server/courseApi.js';
import type { StoredCourse } from '../storage/courseStore.js';

const course: StoredCourse = { id: 'najdorf', name: 'Najdorf', pgn: '1. e4 c5 *', side: 'black', importedAt: 1 };
const progress = { key: { key: 'key', level: 1, dueAt: 5, lastSeenAt: 1, correct: 1, wrong: 0 } };

let dir: string;
let server: Server;
let base: string;

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'coh-courses-'));
  const handle = courseRequestHandler(dir);
  server = createServer((req, res) => {
    if (!req.url?.startsWith('/api/')) { res.statusCode = 404; res.end(); return; }
    req.url = req.url.slice('/api'.length);
    handle(req, res, () => { res.statusCode = 404; res.end(); });
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  base = `http://127.0.0.1:${typeof address === 'object' && address ? address.port : 0}`;
});

afterEach(async () => {
  vi.unstubAllGlobals();
  vi.resetModules();
  await new Promise((resolve) => server.close(resolve));
  await rm(dir, { recursive: true, force: true });
});

const api = (path: string, init?: RequestInit) => fetch(`${base}/api/${path}`, init);
const json = (method: string, body: unknown): RequestInit =>
  ({ method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

/** The page's relative `/api/...` requests, sent to the test server. */
function serveThePage(): void {
  const realFetch = globalThis.fetch;
  vi.stubGlobal('fetch', (input: string, init?: RequestInit) => realFetch(new URL(input, base), init));
}

/** Just enough IndexedDB for the store to read and clear what a browser kept. */
function browserDatabase(courses: StoredCourse[], records: { courseId: string; moves: unknown }[]) {
  const stores: Record<string, Map<string, unknown>> = {
    courses: new Map(courses.map((entry) => [entry.id, entry])),
    progress: new Map(records.map((record) => [record.courseId, record])),
  };
  const database = {
    transaction: (name: string) => {
      const store = stores[name]!;
      const tx = {
        error: null,
        oncomplete: undefined as (() => void) | undefined,
        objectStore: () => ({
          getAll: () => done([...store.values()]),
          get: (key: string) => done(store.get(key)),
          delete: (key: string) => { store.delete(key); return done(undefined); },
        }),
      };
      const done = (result: unknown) => { queueMicrotask(() => tx.oncomplete?.()); return { result }; };
      return tx;
    },
  };
  vi.stubGlobal('indexedDB', {
    open: () => {
      const request = { result: database, onsuccess: undefined as (() => void) | undefined };
      queueMicrotask(() => request.onsuccess?.());
      return request;
    },
  });
  return stores;
}

describe('course server', () => {
  it('keeps courses and their progress on disk', async () => {
    expect(await (await api('health')).json()).toEqual({ ok: true });
    expect((await api('courses/najdorf', json('PUT', course))).status).toBe(204);
    expect((await api('progress/najdorf', json('PUT', progress))).status).toBe(204);
    expect(await (await api('courses')).json()).toEqual([course]);
    expect(await (await api('progress/najdorf')).json()).toEqual(progress);

    expect((await api('courses/najdorf', { method: 'DELETE' })).status).toBe(204);
    expect(await (await api('courses')).json()).toEqual([]);
    expect(await (await api('progress/najdorf')).json()).toEqual({});
  });

  it('refuses ids that are not plain slugs and bodies that are not courses', async () => {
    expect((await api('courses/..%2F..%2Fescape', json('PUT', { ...course, id: '../../escape' }))).status).toBe(400);
    expect((await api('courses/other', json('PUT', course))).status).toBe(400);
    expect((await api('courses/najdorf', json('PUT', { id: 'najdorf' }))).status).toBe(400);
    expect((await api('courses/najdorf', { method: 'PUT', body: JSON.stringify(course) })).status).toBe(415);
    expect(await readdir(dir)).toEqual([]);
  });
});

describe('course store on the server', () => {
  it('shows a course imported in one browser in another', async () => {
    serveThePage();
    const chrome = await import('../storage/courseStore.js');
    await chrome.saveCourse(course);
    await chrome.saveProgress(course.id, progress);

    vi.resetModules();
    const firefox = await import('../storage/courseStore.js');
    expect(await firefox.listCourses()).toEqual([course]);
    expect(await firefox.loadProgress(course.id)).toEqual(progress);
    expect(firefox.getCourseStorageWarning()).toBeNull();
  });

  it('hands courses a browser kept for itself to the server, once', async () => {
    serveThePage();
    const clash = { ...course, pgn: '1. e4 c5 2. Nf3 *', importedAt: 2 };
    await api('courses/najdorf', json('PUT', clash));
    const local = browserDatabase([course], [{ courseId: course.id, moves: progress }]);

    const chrome = await import('../storage/courseStore.js');
    const shelf = await chrome.listCourses();
    // Same id, different import: the browser's copy moves in beside it.
    expect(shelf).toEqual([clash, { ...course, id: 'najdorf-2' }]);
    expect(await chrome.loadProgress('najdorf-2')).toEqual(progress);
    expect(local.courses!.size).toBe(0);
    expect(local.progress!.size).toBe(0);

    vi.resetModules();
    const again = await import('../storage/courseStore.js');
    expect(await again.listCourses()).toHaveLength(2);
  });

  it('falls back to browser storage when nothing answers on /api', async () => {
    vi.stubGlobal('fetch', () => Promise.resolve(new Response('<!doctype html>', { status: 200 })));
    vi.stubGlobal('indexedDB', undefined);
    const store = await import('../storage/courseStore.js');
    await store.saveCourse(course);
    expect(await store.listCourses()).toEqual([course]);
    expect(store.getCourseStorageWarning()).toContain('only for this tab');
    expect(await readdir(dir)).toEqual([]);
  });
});
