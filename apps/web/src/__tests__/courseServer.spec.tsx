import { createServer } from 'node:http';
import type { Server } from 'node:http';
import { mkdtemp, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { courseRequestHandler } from '../../server/courseApi.js';

const course = { id: 'najdorf', name: 'Najdorf', pgn: '1. e4 c5 *', side: 'black', importedAt: 1 };
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
  await new Promise((resolve) => server.close(resolve));
  await rm(dir, { recursive: true, force: true });
});

const api = (path: string, init?: RequestInit) => fetch(`${base}/api/${path}`, init);
const json = (method: string, body: unknown): RequestInit =>
  ({ method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

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
