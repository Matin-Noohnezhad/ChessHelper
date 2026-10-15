import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildCourse } from '@coh/course';
import type { StoredCourse } from '../storage/courseStore.js';
import { courseFingerprint, compileCourse } from '../courseBuildCache.js';

const stored: StoredCourse = { id: 'cache-test', name: 'Cache test', pgn: '1. e4 e5 2. Nf3 *', side: 'white', importedAt: 1 };
afterEach(() => vi.unstubAllGlobals());

describe('compiled course cache', () => {
  it('invalidates for every import option, while ignoring unrelated timestamps', async () => {
    const original = await courseFingerprint(stored);
    expect(await courseFingerprint({ ...stored, importedAt: 20, sectionHeader: 'White' })).toBe(original);
    for (const patch of [{ id: 'other' }, { name: 'Renamed' }, { side: 'black' as const },
      { sectionHeader: 'Black' as const }, { pgn: '1. d4 d5 *' }]) {
      expect(await courseFingerprint({ ...stored, ...patch })).not.toBe(original);
    }
  });

  it('still compiles accurately when persistent cache storage is unavailable', async () => {
    vi.stubGlobal('indexedDB', undefined);
    expect(await compileCourse(stored)).toEqual(buildCourse(stored.pgn, { ...stored, sectionHeader: 'White' }));
  });
});

describe('background course loading', () => {
  it('deduplicates in-flight work and invalidates changed course sources', async () => {
    vi.resetModules();
    const sent: { requestId: number; stored: StoredCourse }[] = [];
    let instance: FakeWorker;
    class FakeWorker {
      onmessage?: (event: { data: unknown }) => void;
      constructor() { instance = this; }
      postMessage(message: typeof sent[number]) { sent.push(message); }
      reply(index: number) {
        const request = sent[index]!;
        this.onmessage?.({ data: { requestId: request.requestId,
          course: buildCourse(request.stored.pgn, request.stored) } });
      }
    }
    vi.stubGlobal('Worker', FakeWorker);
    const { loadCourse, courseFor, forgetCourse } = await import('../courseLoader.js');
    const first = loadCourse(stored);
    const second = loadCourse({ ...stored });
    expect(sent).toHaveLength(1);
    instance!.reply(0);
    const course = await first;
    expect(await second).toBe(course);
    expect(await loadCourse(stored)).toBe(course);
    expect(courseFor(stored)).toBe(course);
    const changed = { ...stored, side: 'black' as const };
    const third = loadCourse(changed);
    expect(sent).toHaveLength(2);
    instance!.reply(1);
    expect((await third).side).toBe('black');
    forgetCourse(stored.id);
    const fourth = loadCourse(changed);
    expect(sent).toHaveLength(3);
    instance!.reply(2);
    await fourth;
  });
});
