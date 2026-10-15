import { startTransition, useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
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

import { courseFor, forgetCourse, loadCourse } from '../courseLoader.js';

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

  const refreshVersion = useRef(0);

  const refresh = useCallback(async () => {
    const version = ++refreshVersion.current;
    setLoading(true);
    try {
      const stored = await listCourses();
      if (version !== refreshVersion.current) return;
      const available = new Map<string, LibraryEntry>();
      // Let smaller courses become usable promptly; shelf order stays unchanged.
      const loadingOrder = [...stored].sort((a, b) => a.pgn.length - b.pgn.length);
      const loaded = await Promise.allSettled(loadingOrder.map(async (record) => {
        const [course, progress] = await Promise.all([loadCourse(record), loadProgress(record.id)]);
        const entry = { stored: record, course, progress, stats: courseStats(course, progress) };
        available.set(record.id, entry);
        if (version === refreshVersion.current) {
          setEntries((current) => {
            // Other courses may still be building while the user learns an
            // already-ready course. Preserve that course's newest progress.
            const latest = new Map(current.map((item) => [item.stored.id, item]));
            latest.set(record.id, entry);
            return stored.flatMap((item) => latest.has(item.id) ? [latest.get(item.id)!] : []);
          });
        }
        return entry;
      }));
      if (version !== refreshVersion.current) return;
      setEntries((current) => current.filter((entry) => available.has(entry.stored.id)));
      const failed = loaded.flatMap((result, index) => result.status === 'rejected' ? [loadingOrder[index]!.name] : []);
      setError(failed.length ? `Could not open: ${failed.join(', ')}. Other courses are still available.` : null);
    } catch (cause) {
      if (version === refreshVersion.current) setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      if (version === refreshVersion.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    return () => { refreshVersion.current++; };
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
      forgetCourse(id);
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

  // Paint the dropped piece first. Course-wide counters/outline updates are
  // secondary work; persistence still happens immediately in useCourseSession.
  const commitProgress = useCallback((id: string, progress: CourseProgress) => {
    startTransition(() => {
      setEntries((current) =>
        current.map((entry) =>
          entry.stored.id === id ? entryFrom(entry.stored, progress) : entry,
        ),
      );
    });
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
