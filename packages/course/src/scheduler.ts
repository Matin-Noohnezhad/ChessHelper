/**
 * When a move comes back.
 *
 * One ladder, climbed a rung per correct answer and fallen off entirely by a
 * wrong one. The intervals are the ones MoveTrainer uses, and the shape matters
 * more than the exact numbers: the first three rungs all land inside the first
 * few days, because that is where forgetting happens, and the top of the ladder
 * is half a year, because a move you have produced correctly eight times over
 * six months is not what is losing you games.
 *
 * The unit is one move. Get four moves of a variation right and the fifth wrong,
 * and only the fifth drops — the other four go on climbing.
 */

import type { CourseProgress, MoveProgress } from './types.js';

const HOUR = 60 * 60_000;
const DAY = 24 * HOUR;

/** Interval after the nth correct answer in a row, n being the index plus one. */
export const LEVELS = [4 * HOUR, DAY, 3 * DAY, 7 * DAY, 14 * DAY, 30 * DAY, 90 * DAY, 180 * DAY];

export const MAX_LEVEL = LEVELS.length;

/**
 * The rung at which a move counts as learned rather than merely seen: it has
 * come back after four hours *and* after a night, which is the gap most of what
 * you "know" after one session fails to survive.
 */
export const LEARNED_LEVEL = 3;

export function blankProgress(key: string, now: number): MoveProgress {
  return { key, level: 0, dueAt: now, lastSeenAt: 0, correct: 0, wrong: 0 };
}

export function progressFor(progress: CourseProgress, key: string, now: number): MoveProgress {
  return progress[key] ?? blankProgress(key, now);
}

/** Never-learned moves are always due; that is what makes them the learn queue. */
export const isDue = (entry: MoveProgress, now: number): boolean =>
  entry.level === 0 || entry.dueAt <= now;

export const isLearned = (entry: MoveProgress): boolean => entry.level >= LEARNED_LEVEL;

/** How long a move at `level` waits before it is asked again. */
export const intervalFor = (level: number): number =>
  LEVELS[Math.min(Math.max(level, 1), MAX_LEVEL) - 1]!;

/**
 * Folds one answer into a move's history.
 *
 * A wrong answer goes back to the first rung rather than down one: half-knowing
 * a move is how you play it in a game and then cannot remember why, and the
 * cheapest fix is to see it again this afternoon.
 */
export function recordAnswer(
  previous: MoveProgress,
  options: { correct: boolean; now: number },
): MoveProgress {
  const { correct, now } = options;
  const level = correct ? Math.min(previous.level + 1, MAX_LEVEL) : 1;
  return {
    ...previous,
    level,
    dueAt: now + intervalFor(level),
    lastSeenAt: now,
    correct: previous.correct + (correct ? 1 : 0),
    wrong: previous.wrong + (correct ? 0 : 1),
  };
}
