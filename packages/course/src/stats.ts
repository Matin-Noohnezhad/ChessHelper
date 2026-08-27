/**
 * How much of a course you actually know.
 *
 * Counted in *moves*, not variations, because that is the unit the schedule
 * works in: a chapter of forty variations built out of sixty distinct moves is
 * sixty things to remember, and reporting forty would flatter you by a third.
 *
 * Chapter figures are counted per chapter, so a move taught in two chapters is
 * counted in both. The course total counts it once. The two therefore do not add
 * up, and should not: a chapter's percentage is about that chapter.
 */

import { LEARNED_LEVEL, MAX_LEVEL, isDue, progressFor } from './scheduler.js';
import { moveKey, trainableMoves, variationsOf } from './tree.js';
import type {
  Chapter,
  ChapterStats,
  Course,
  CourseProgress,
  CourseSide,
  CourseStats,
  MoveCounts,
} from './types.js';

function countKeys(keys: Iterable<string>, progress: CourseProgress, now: number): MoveCounts {
  const levels = new Array<number>(MAX_LEVEL + 1).fill(0);
  let total = 0;
  let seen = 0;
  let learned = 0;
  let due = 0;

  for (const key of keys) {
    const entry = progressFor(progress, key, now);
    total++;
    levels[Math.min(entry.level, MAX_LEVEL)]!++;
    if (entry.level > 0) seen++;
    if (entry.level >= LEARNED_LEVEL) learned++;
    if (isDue(entry, now)) due++;
  }

  return { total, seen, learned, due, levels };
}

export function chapterStats(
  chapter: Chapter,
  side: CourseSide,
  progress: CourseProgress,
  now: number = Date.now(),
): ChapterStats {
  const moves = trainableMoves([chapter], side);
  return {
    chapterId: chapter.id,
    name: chapter.name,
    variations: variationsOf(chapter, side).length,
    ...countKeys(moves.keys(), progress, now),
  };
}

export function courseStats(
  course: Course,
  progress: CourseProgress,
  now: number = Date.now(),
): CourseStats {
  const chapters = course.chapters.map((chapter) =>
    chapterStats(chapter, course.side, progress, now),
  );
  const moves = trainableMoves(course.chapters, course.side);
  return {
    chapters,
    variations: chapters.reduce((sum, chapter) => sum + chapter.variations, 0),
    ...countKeys(moves.keys(), progress, now),
  };
}

/** The next time anything in the course falls due, or null when nothing has been learned. */
export function nextDueAt(course: Course, progress: CourseProgress): number | null {
  let soonest = Infinity;
  for (const node of trainableMoves(course.chapters, course.side).values()) {
    const entry = progress[moveKey(node)];
    if (!entry || entry.level === 0) continue;
    if (entry.dueAt < soonest) soonest = entry.dueAt;
  }
  return Number.isFinite(soonest) ? soonest : null;
}
