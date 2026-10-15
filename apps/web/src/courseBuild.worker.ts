import { compileCourse } from './courseBuildCache.js';
import type { StoredCourse } from './storage/courseStore.js';

// Queue builds so several large courses do not compete for memory/CPU at once.
let queue = Promise.resolve();
self.onmessage = (event: MessageEvent<{ requestId: number; stored: StoredCourse }>) => {
  const { requestId, stored } = event.data;
  queue = queue.then(async () => {
    try {
      self.postMessage({ requestId, course: await compileCourse(stored) });
    } catch (error) {
      self.postMessage({ requestId, error: error instanceof Error ? error.message : String(error) });
    }
  });
};
