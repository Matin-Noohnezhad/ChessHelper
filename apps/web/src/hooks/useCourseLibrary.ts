import { useCallback, useEffect, useState } from 'react';
import { buildCourse, courseStats, progressKeys } from '@coh/course';
import type { Course, CourseProgress, CourseSide, CourseStats } from '@coh/course';
import {
  clearProgress,
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
const built = new Map<string, Course>();

function courseFor(stored: StoredCourse): Course {
  const key = `${stored.id}:${stored.side}:${stored.pgn.length}`;
  let course = built.get(key);
  if (!course) {
    // A course saved before its name could be worked out sits in storage as `?`;
    // drop that so the builder falls back to its own guess rather than showing it.
    const name = stored.name?.trim();
    course = buildCourse(stored.pgn, {
      id: stored.id,
      ...(name && name !== '?' ? { name } : {}),
      side: stored.side,
    });
    built.set(key, course);
  }
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
  refresh: () => Promise<void>;
  importPgn: (pgn: string, options?: { name?: string; side?: CourseSide }) => Promise<string | null>;
  remove: (id: string) => Promise<void>;
  resetProgress: (id: string) => Promise<void>;
  /** Wipe progress for just some chapters or lines, leaving the rest of the course. */
  resetScope: (
    id: string,
    scope: { chapterIds?: string[]; lineIds?: string[] },
  ) => Promise<void>;
  setSide: (id: string, side: CourseSide) => Promise<void>;
  /** Writes a session's progress back and refreshes the stats built on it. */
  commitProgress: (id: string, progress: CourseProgress) => void;
}

export function useCourseLibrary(): CourseLibrary {
  const [entries, setEntries] = useState<LibraryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const stored = await listCourses();
      const loaded = await Promise.all(
        stored.map(async (course) => entryFrom(course, await loadProgress(course.id))),
      );
      setEntries(loaded);
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const importPgn = useCallback(
    async (pgn: string, options: { name?: string; side?: CourseSide } = {}) => {
      const name = options.name?.trim();
      const course = buildCourse(pgn, {
        ...(name ? { name } : {}),
        ...(options.side ? { side: options.side } : {}),
      });
      if (!course.chapters.length) {
        setError('No games in that PGN.');
        return null;
      }

      const taken = (await listCourses()).map((entry) => entry.id);
      const stored: StoredCourse = {
        id: uniqueCourseId(course.id, taken),
        name: course.name,
        pgn,
        side: course.side,
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
    refresh,
    importPgn,
    remove,
    resetProgress,
    resetScope,
    setSide,
    commitProgress,
  };
}
