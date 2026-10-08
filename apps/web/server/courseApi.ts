/**
 * The course shelf, kept on disk by the server that serves the app.
 *
 * IndexedDB belongs to one browser profile: a course imported in Chrome is not
 * there when the same page opens in Firefox. So the dev server (and `vite
 * preview`) keep the shelf instead — one JSON file per course and one per
 * course's progress — and every browser that opens the app reads the same one.
 *
 *   GET    /api/health         → { ok: true }, how the page knows the shelf is here
 *   GET    /api/courses        → every stored course
 *   PUT    /api/courses/:id    ← one course; DELETE removes it and its progress
 *   GET    /api/progress/:id   → that course's progress, {} when there is none
 *   PUT    /api/progress/:id   ← the whole progress map; DELETE clears it
 *
 * Writes go to a temporary file renamed over the old one, so a crash mid-save
 * leaves the previous version rather than half a course.
 */

import { mkdir, readdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Connect, Plugin } from 'vite';

/** A big repertoire is a few megabytes of PGN; this is generous headroom. */
const MAX_BODY = 64 * 1024 * 1024;

/** Course ids are slugs (`najdorf`, `najdorf-2`), which keeps them safe as file names. */
const VALID_ID = /^[A-Za-z0-9][A-Za-z0-9_-]{0,199}$/;

class HttpError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
  }
}

export function courseApi(dir: string): Plugin {
  const handle = courseRequestHandler(dir);
  return {
    name: 'coh-course-api',
    configureServer: (server) => { server.middlewares.use('/api', handle); },
    configurePreviewServer: (server) => { server.middlewares.use('/api', handle); },
  };
}

/** The `/api` middleware on its own, mounted by the plugin and driven directly by the tests. */
export function courseRequestHandler(dir: string): Connect.NextHandleFunction {
  const coursesDir = join(dir, 'courses');
  const progressDir = join(dir, 'progress');
  const courseFile = (id: string) => join(coursesDir, `${id}.json`);
  const progressFile = (id: string) => join(progressDir, `${id}.json`);

  async function route(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
    const path = new URL(req.url ?? '/', 'http://localhost').pathname;
    const [kind, rawId, ...rest] = path.split('/').filter(Boolean);
    const method = req.method ?? 'GET';

    if (kind === 'health' && !rawId && method === 'GET') return send(res, 200, { ok: true });
    if (kind !== 'courses' && kind !== 'progress') return false;
    if (rest.length) throw new HttpError(404, 'Not found');

    if (!rawId) {
      if (kind === 'courses' && method === 'GET') return send(res, 200, await listCourses());
      throw new HttpError(405, 'Method not allowed');
    }

    const id = decodeURIComponent(rawId);
    if (!VALID_ID.test(id)) throw new HttpError(400, `Not a course id: ${id}`);

    if (kind === 'courses') {
      if (method === 'PUT') {
        const course = await readJson(req);
        if (!isCourse(course) || course.id !== id) throw new HttpError(400, 'Not a course');
        await writeJson(courseFile(id), course);
        return send(res, 204);
      }
      if (method === 'DELETE') {
        await rm(courseFile(id), { force: true });
        await rm(progressFile(id), { force: true });
        return send(res, 204);
      }
      throw new HttpError(405, 'Method not allowed');
    }

    if (method === 'GET') return send(res, 200, (await readJsonFile(progressFile(id))) ?? {});
    if (method === 'PUT') {
      const progress = await readJson(req);
      if (!progress || typeof progress !== 'object' || Array.isArray(progress)) {
        throw new HttpError(400, 'Not a progress map');
      }
      await writeJson(progressFile(id), progress);
      return send(res, 204);
    }
    if (method === 'DELETE') {
      await rm(progressFile(id), { force: true });
      return send(res, 204);
    }
    throw new HttpError(405, 'Method not allowed');
  }

  async function listCourses(): Promise<unknown[]> {
    const names = await readdir(coursesDir).catch(() => [] as string[]);
    const courses = await Promise.all(
      names.filter((name) => name.endsWith('.json')).map((name) => readJsonFile(join(coursesDir, name))),
    );
    // A file somebody broke by hand is skipped rather than taking the shelf down with it.
    return courses.filter(isCourse);
  }

  return (req, res, next) => {
    route(req, res).then(
      (handled) => { if (!handled) next(); },
      (error: unknown) => {
        const status = error instanceof HttpError ? error.status : 500;
        send(res, status, { error: error instanceof Error ? error.message : String(error) });
      },
    );
  };
}

/* ------------------------------------------------------------- helpers --- */

function isCourse(value: unknown): value is { id: string } {
  if (!value || typeof value !== 'object') return false;
  const course = value as Record<string, unknown>;
  return typeof course.id === 'string' && VALID_ID.test(course.id) &&
    typeof course.name === 'string' && typeof course.pgn === 'string' &&
    typeof course.side === 'string' && typeof course.importedAt === 'number';
}

function send(res: ServerResponse, status: number, body?: unknown): true {
  res.statusCode = status;
  if (body === undefined) {
    res.end();
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(body));
  }
  return true;
}

async function readJson(req: IncomingMessage): Promise<unknown> {
  if (!req.headers['content-type']?.startsWith('application/json')) {
    throw new HttpError(415, 'Expected application/json');
  }
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req as AsyncIterable<Buffer>) {
    size += chunk.length;
    if (size > MAX_BODY) throw new HttpError(413, 'Too large');
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new HttpError(400, 'Not JSON');
  }
}

async function readJsonFile(file: string): Promise<unknown> {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch {
    return undefined;
  }
}

let tempCounter = 0;
async function writeJson(file: string, value: unknown): Promise<void> {
  await mkdir(join(file, '..'), { recursive: true });
  const temp = `${file}.${process.pid}.${++tempCounter}.tmp`;
  await writeFile(temp, JSON.stringify(value));
  await rename(temp, file);
}
