import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => { vi.unstubAllGlobals(); vi.resetModules(); });

const course = { id: 'test', name: 'Test', pgn: '1. e4 *', side: 'white' as const, importedAt: 1 };

function controlledDatabase() {
  const transactions: { oncomplete?: () => void; onabort?: () => void; error: Error | null }[] = [];
  const database = {
    transaction: () => {
      const tx = {
        error: null as Error | null,
        oncomplete: undefined as (() => void) | undefined,
        onabort: undefined as (() => void) | undefined,
        objectStore: () => ({ put: () => ({ result: 'test' }) }),
      };
      transactions.push(tx);
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
  return transactions;
}

describe('course persistence', () => {
  it('waits for the transaction to commit before reporting a saved course', async () => {
    const transactions = controlledDatabase();
    const store = await import('../storage/courseStore.js');
    let saved = false;
    const pending = store.saveCourse(course).then(() => { saved = true; });
    await vi.waitFor(() => expect(transactions).toHaveLength(1));
    expect(saved).toBe(false);
    transactions[0]!.oncomplete?.();
    await pending;
    expect(saved).toBe(true);
    expect(store.getCourseStorageWarning()).toBeNull();
  });

  it('keeps an aborted import visible in memory and reports the loss of persistence', async () => {
    const transactions = controlledDatabase();
    const store = await import('../storage/courseStore.js');
    const notified = vi.fn();
    const unsubscribe = store.subscribeCourseStorage(notified);
    const pending = store.saveCourse(course);
    await vi.waitFor(() => expect(transactions).toHaveLength(1));
    transactions[0]!.error = new Error('Quota exceeded');
    transactions[0]!.onabort?.();
    await pending;
    expect(store.getCourseStorageWarning()).toContain('only for this tab');
    expect(notified).toHaveBeenCalled();
    expect(await store.listCourses()).toEqual([course]);
    unsubscribe();
  });

  it('supports progress, reset and removal when storage is unavailable', async () => {
    vi.stubGlobal('indexedDB', undefined);
    const store = await import('../storage/courseStore.js');
    await store.saveCourse(course);
    const progress = { key: { key: 'key', level: 1, dueAt: 5, lastSeenAt: 1, correct: 0, wrong: 1 } };
    await store.saveProgress(course.id, progress);
    expect(await store.loadProgress(course.id)).toEqual(progress);
    await store.clearProgress(course.id);
    expect(await store.loadProgress(course.id)).toEqual({});
    await store.deleteCourse(course.id);
    expect(await store.listCourses()).toEqual([]);
    expect(store.getCourseStorageWarning()).toContain('only for this tab');
  });
});
