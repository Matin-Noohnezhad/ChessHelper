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

import { LEARNED_LEVEL, MAX_LEVEL, isDue } from './scheduler.js';
import { colorOf, moveKey, readingLinesOf } from './tree.js';
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

// Imported course trees are immutable. Index their main lines once; grading a
// move only changes progress, so it must not walk and allocate the tree again.
const indexes = new WeakMap<Chapter, Map<CourseSide, {
  variations: { variation: Variation; keys: Set<string> }[];
  keys: Set<string>;
}>>();

function chapterIndex(chapter: Chapter, side: CourseSide) {
  let sides = indexes.get(chapter);
  if (!sides) { sides = new Map(); indexes.set(chapter, sides); }
  let index = sides.get(side);
  if (!index) {
    const keys = new Set<string>();
    const variations = readingLinesOf(chapter).map((variation) => {
      const lineKeys = new Set<string>();
      for (const node of variation.line) {
        if (node.side !== colorOf(side)) continue;
        const key = moveKey(node);
        lineKeys.add(key);
        keys.add(key);
      }
      return { variation, keys: lineKeys };
    });
    index = { variations, keys };
    sides.set(side, index);
  }
  return index;
}

const courseKeys = new WeakMap<Course, { side: CourseSide; keys: Set<string> }>();
function keysForCourse(course: Course): Set<string> {
  let cached = courseKeys.get(course);
  if (!cached || cached.side !== course.side) {
    cached = { side: course.side, keys: new Set(course.chapters.flatMap((chapter) => [...chapterIndex(chapter, course.side).keys])) };
    courseKeys.set(course, cached);
  }
  return cached.keys;
}

function countKeys(keys: Set<string>, progress: CourseProgress, now: number, savedKeys: string[]): MoveCounts {
  const levels = new Array<number>(MAX_LEVEL + 1).fill(0);
  const total = keys.size;
  levels[0] = total;
  let seen = 0;
  let learned = 0;
  let due = 0;

  // New courses may have thousands of keys and only a handful of answers.
  // Visit the smaller set rather than looking up every unlearned move.
  for (const key of savedKeys.length < keys.size ? savedKeys : keys) {
    if (!keys.has(key)) continue;
    const entry = progress[key];
    if (!entry) continue;
    levels[0]--;
    levels[Math.min(entry.level, MAX_LEVEL)]!++;
    if (entry.level > 0) seen++;
    if (entry.level >= LEARNED_LEVEL) learned++;
    if (entry.level > 0 && isDue(entry, now)) due++;
  }

  return { total, seen, learned, due, levels };
}

export function chapterStats(
  chapter: Chapter,
  side: CourseSide,
  progress: CourseProgress,
  now: number = Date.now(),
  savedKeys: string[] = Object.keys(progress),
): ChapterStats {
  const index = chapterIndex(chapter, side);
  return {
    chapterId: chapter.id,
    name: chapter.name,
    variations: index.variations.length,
    ...countKeys(index.keys, progress, now, savedKeys),
  };
}

export function courseStats(
  course: Course,
  progress: CourseProgress,
  now: number = Date.now(),
): CourseStats {
  const savedKeys = Object.keys(progress);
  const chapters = course.chapters.map((chapter) =>
    chapterStats(chapter, course.side, progress, now, savedKeys),
  );
  return {
    chapters,
    variations: chapters.reduce((sum, chapter) => sum + chapter.variations, 0),
    ...countKeys(keysForCourse(course), progress, now, savedKeys),
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
  /** The source-game id from {@link readingLinesOf}, also used by sessions. */
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
  section?: string;
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
  keys: Set<string>,
  progress: CourseProgress,
  now: number,
  savedKeys: string[],
): VariationStats {
  const counts = countKeys(keys, progress, now, savedKeys);
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
    due: counts.due,
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
  const savedKeys = Object.keys(progress);
  return course.chapters.map((chapter) => {
    const index = chapterIndex(chapter, course.side);
    const variations = index.variations.map(({ variation, keys }) =>
      variationStats(variation, keys, progress, now, savedKeys),
    );
    const counts = countKeys(index.keys, progress, now, savedKeys);
    return {
      chapterId: chapter.id,
      name: chapter.name,
      ...(chapter.section ? { section: chapter.section } : {}),
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
  const keys = keysForCourse(course);
  for (const [key, entry] of Object.entries(progress)) {
    if (entry.level === 0 || !keys.has(key)) continue;
    if (entry.dueAt < soonest) soonest = entry.dueAt;
  }
  return Number.isFinite(soonest) ? soonest : null;
}
