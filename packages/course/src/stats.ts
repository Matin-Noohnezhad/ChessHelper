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
import { colorOf, moveKey, trainableMoves, variationsOf } from './tree.js';
import type { Variation } from './tree.js';
import type {
  Chapter,
  ChapterStats,
  Course,
  CourseNode,
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

/* --------------------------------------------------------- outline --- */

/**
 * Where a variation stands, for the dot next to it in a list.
 *
 * `new` is a line not one move of which you have met; `started` is somewhere in
 * between; `learned` is every move in it past the first day of the ladder — the
 * line has been produced cold and has survived a night.
 */
export type VariationState = 'new' | 'started' | 'learned';

/** One line of a chapter, with how much of it you have actually retained. */
export interface VariationStats {
  /** The id {@link variationsOf} gave it — what a session's `lineIds` filters on. */
  id: string;
  chapterId: string;
  chapterName: string;
  /** Root to leaf, in order — for drawing the line and its move numbers. */
  line: CourseNode[];
  /** Distinct moves this line asks you to produce. */
  moves: number;
  seen: number;
  learned: number;
  /**
   * Moves you have met whose date has come round again — a line with a `due`
   * above zero is one review would replay. Never-met moves are not counted:
   * those are what the empty ring already says.
   */
  due: number;
  /**
   * How much of the line you have worked through — seen moves over its moves,
   * 0 when the line asks nothing of you. This is what the ring fills by; the
   * tick is {@link state} reaching `learned`.
   */
  completion: number;
  state: VariationState;
}

/** A chapter and every line in it, for a Chessable-style course browser. */
export interface OutlineChapter {
  chapterId: string;
  name: string;
  /** Distinct trainable moves across the whole chapter. */
  moves: number;
  seen: number;
  learned: number;
  due: number;
  /**
   * How far through the chapter you have worked — seen moves over its distinct
   * moves, 0 when empty. The share that has actually *stuck* is `learned / moves`.
   */
  completion: number;
  variations: VariationStats[];
}

function variationStats(
  variation: Variation,
  side: CourseSide,
  progress: CourseProgress,
  now: number,
): VariationStats {
  const userColor = colorOf(side);
  const keys = new Set<string>();
  for (const node of variation.line) {
    if (node.side === userColor) keys.add(moveKey(node));
  }
  const counts = countKeys(keys, progress, now);
  // Review-due, not learn-due: a move you have never met is not "due", it is
  // unstarted, and the ring says that already.
  let dueReview = 0;
  for (const key of keys) {
    const entry = progress[key];
    if (entry && entry.level > 0 && isDue(entry, now)) dueReview++;
  }
  const state: VariationState =
    counts.total > 0 && counts.learned === counts.total
      ? 'learned'
      : counts.seen > 0
        ? 'started'
        : 'new';
  return {
    id: variation.id,
    chapterId: variation.chapterId,
    chapterName: variation.chapterName,
    line: variation.line,
    moves: counts.total,
    seen: counts.seen,
    learned: counts.learned,
    due: dueReview,
    completion: counts.total ? counts.seen / counts.total : 0,
    state,
  };
}

/**
 * The course as a list of chapters, each with its lines and how far into each
 * of them you have got. The unit of the percentage is the move, not the line —
 * a chapter's figure is its seen moves over its distinct moves — and the lines
 * are listed so one can be picked out and drilled on its own.
 */
export function courseOutline(
  course: Course,
  progress: CourseProgress,
  now: number = Date.now(),
): OutlineChapter[] {
  return course.chapters.map((chapter) => {
    const variations = variationsOf(chapter, course.side).map((variation) =>
      variationStats(variation, course.side, progress, now),
    );
    const counts = countKeys(trainableMoves([chapter], course.side).keys(), progress, now);
    return {
      chapterId: chapter.id,
      name: chapter.name,
      moves: counts.total,
      seen: counts.seen,
      learned: counts.learned,
      due: counts.due,
      completion: counts.total ? counts.seen / counts.total : 0,
      variations,
    };
  });
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
