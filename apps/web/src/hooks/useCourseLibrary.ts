import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { buildCourse, courseStats, progressKeys } from '@coh/course';
import type { Course, CourseProgress, CourseSide, CourseStats, SectionHeader } from '@coh/course';
import {
  clearProgress,
  getCourseStorageWarning,
  subscribeCourseStorage,
  deleteCourse,
  listCourses,
  loadProgress,
  saveCourse,
  saveProgress,
  uniqueCourseId,
} from '../storage/courseStore.js';
import type { StoredCourse } from '../storage/courseStore.js';

/**
 * Built courses, keyed by everything that would change one. Rebuilding a course
 * is a replay of every line in it, which is fast but not free, and the library
 * asks for one every time you step back out of a session.
 */
const built = new Map<string, { stored: StoredCourse; course: Course }>();

function courseFor(stored: StoredCourse): Course {
  const cached = built.get(stored.id);
  if (cached && cached.stored.name === stored.name && cached.stored.side === stored.side &&
      cached.stored.pgn === stored.pgn && cached.stored.sectionHeader === stored.sectionHeader) return cached.course;
  const course = buildCourse(stored.pgn, { id: stored.id, name: stored.name, side: stored.side, sectionHeader: stored.sectionHeader ?? 'White' });
  built.set(stored.id, { stored, course });
  return course;
}

export interface LibraryEntry {
  stored: StoredCourse;
  course: Course;
  progress: CourseProgress;
  stats: CourseStats;
}

/** Everything a course needs to be listed and opened, from the raw PGN up. */
export function entryFrom(stored: StoredCourse, progress: CourseProgress): LibraryEntry {
  const course = courseFor(stored);
  return { stored, course, progress, stats: courseStats(course, progress) };
}

export interface CourseLibrary {
  entries: LibraryEntry[];
  loading: boolean;
  error: string | null;
  storageWarning: string | null;
  refresh: () => Promise<void>;
  importPgn: (pgn: string, options?: { name?: string; side?: CourseSide; sectionHeader?: SectionHeader }) => Promise<string | null>;
  remove: (id: string) => Promise<void>;
  resetProgress: (id: string) => Promise<void>;
  /** Wipe progress for just some chapters or lines, leaving the rest of the course. */
  resetScope: (
    id: string,
    scope: { chapterIds?: string[]; lineIds?: string[] },
  ) => Promise<void>;
  setSide: (id: string, side: CourseSide) => Promise<void>;
  setSectionHeader: (id: string, sectionHeader: SectionHeader) => Promise<void>;
  /** Writes a session's progress back and refreshes the stats built on it. */
  commitProgress: (id: string, progress: CourseProgress) => void;
}

export function useCourseLibrary(): CourseLibrary {
  const storageWarning = useSyncExternalStore(subscribeCourseStorage, getCourseStorageWarning, () => null);
  const [entries, setEntries] = useState<LibraryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const stored = await listCourses();
      const loaded = await Promise.allSettled(
        stored.map(async (course) => entryFrom(course, await loadProgress(course.id))),
      );
      setEntries(loaded.flatMap((result) => result.status === 'fulfilled' ? [result.value] : []));
      const failed = loaded.flatMap((result, index) => result.status === 'rejected' ? [stored[index]!.name] : []);
      setError(failed.length ? `Could not open: ${failed.join(', ')}. Other courses are still available.` : null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Keep due counts current while the shelf stays open or the tab resumes.
  useEffect(() => {
    const updateDue = () => setEntries((current) => current.map((entry) => ({
      ...entry, stats: courseStats(entry.course, entry.progress),
    })));
    const timer = setInterval(updateDue, 30_000);
    window.addEventListener('focus', updateDue);
    return () => { clearInterval(timer); window.removeEventListener('focus', updateDue); };
  }, []);

  const importPgn = useCallback(
    async (pgn: string, options: { name?: string; side?: CourseSide; sectionHeader?: SectionHeader } = {}) => {
      const name = options.name?.trim();
      const course = buildCourse(pgn, {
        sectionHeader: options.sectionHeader ?? 'White',
        ...(name ? { name } : {}),
        ...(options.side ? { side: options.side } : {}),
      });
      if (!courseStats(course, {}).total) {
        setError('No trainable moves for the selected side in that PGN.');
        return null;
      }

      const taken = (await listCourses()).map((entry) => entry.id);
      const stored: StoredCourse = {
        id: uniqueCourseId(course.id, taken),
        name: course.name,
        pgn,
        side: course.side,
        sectionHeader: options.sectionHeader ?? 'White',
        importedAt: Date.now(),
      };
      await saveCourse(stored);
      await refresh();
      return stored.id;
    },
    [refresh],
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteCourse(id);
      built.delete(id);
      await refresh();
    },
    [refresh],
  );

  const resetProgress = useCallback(
    async (id: string) => {
      await clearProgress(id);
      await refresh();
    },
    [refresh],
  );

  const resetScope = useCallback(
    async (id: string, scope: { chapterIds?: string[]; lineIds?: string[] }) => {
      const entry = entries.find((item) => item.stored.id === id);
      if (!entry) return;
      const drop = progressKeys(entry.course, scope);
      if (!drop.size) return;
      const current = await loadProgress(id);
      const kept: CourseProgress = {};
      for (const [key, value] of Object.entries(current)) {
        if (!drop.has(key)) kept[key] = value;
      }
      await saveProgress(id, kept);
      await refresh();
    },
    [entries, refresh],
  );

  const setSide = useCallback(
    async (id: string, side: CourseSide) => {
      const stored = entries.find((entry) => entry.stored.id === id)?.stored;
      if (!stored) return;
      await saveCourse({ ...stored, side });
      await refresh();
    },
    [entries, refresh],
  );

  const setSectionHeader = useCallback(
    async (id: string, sectionHeader: SectionHeader) => {
      const stored = entries.find((entry) => entry.stored.id === id)?.stored;
      if (!stored) return;
      await saveCourse({ ...stored, sectionHeader });
      await refresh();
    },
    [entries, refresh],
  );

  // Cheap and synchronous: a session that has just graded a move should be
  // reflected in the counts the moment you step back out to the library, and
  // waiting on a round trip to IndexedDB to redraw a number is silly.
  const commitProgress = useCallback((id: string, progress: CourseProgress) => {
    setEntries((current) =>
      current.map((entry) =>
        entry.stored.id === id ? entryFrom(entry.stored, progress) : entry,
      ),
    );
  }, []);

  return {
    entries,
    loading,
    error,
    storageWarning,
    refresh,
    importPgn,
    remove,
    resetProgress,
    resetScope,
    setSide,
    setSectionHeader,
    commitProgress,
  };
}
