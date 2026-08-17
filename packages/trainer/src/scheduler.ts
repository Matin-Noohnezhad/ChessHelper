/**
 * Which line to practise next, and when to bring it back.
 *
 * Two jobs. Rotation makes sure you never get the same variation twice in a
 * row, so the opening is learned as a whole rather than as one memorised path.
 * Spaced repetition makes sure the lines you get wrong come back soon and the
 * ones you know drift out to weeks.
 */

import type { LineProgress, ProgressMap, RepertoireLine } from './types.js';

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** Clean runs in a row before a line counts as learned. */
export const MASTERY_STREAK = 2;

/** Interval after the nth consecutive clean run. */
const INTERVALS = [10 * MINUTE, 4 * HOUR, DAY, 3 * DAY, 7 * DAY, 21 * DAY, 60 * DAY];

/** Mistaken lines come back almost immediately — that is the point of them. */
const RETRY_INTERVAL = 2 * MINUTE;

export function blankProgress(lineId: string, now: number): LineProgress {
  return {
    lineId,
    attempts: 0,
    cleanRuns: 0,
    streak: 0,
    mistakes: 0,
    lastSeenAt: 0,
    dueAt: now,
    mastered: false,
  };
}

export function progressFor(progress: ProgressMap, lineId: string, now: number): LineProgress {
  return progress[lineId] ?? blankProgress(lineId, now);
}

/** Folds one completed run-through into a line's progress. */
export function recordRun(
  previous: LineProgress,
  options: { mistakes: number; now: number },
): LineProgress {
  const { mistakes, now } = options;
  const clean = mistakes === 0;
  const streak = clean ? previous.streak + 1 : 0;
  const interval = clean
    ? INTERVALS[Math.min(streak - 1, INTERVALS.length - 1)]!
    : RETRY_INTERVAL;

  return {
    ...previous,
    attempts: previous.attempts + 1,
    cleanRuns: previous.cleanRuns + (clean ? 1 : 0),
    streak,
    mistakes: previous.mistakes + mistakes,
    lastSeenAt: now,
    dueAt: now + interval,
    mastered: streak >= MASTERY_STREAK,
  };
}

export interface ChooseOptions {
  now: number;
  /**
   * Lines already shown this session. They are skipped while anything else is
   * available, so a session walks the whole opening before repeating a
   * variation — including lines you abandoned rather than finished.
   */
  recent?: readonly string[];
}

/**
 * Picks the next line: anything never seen, then whatever is most overdue,
 * then the weakest. Deterministic, so a session is reproducible in tests.
 */
export function chooseLine(
  lines: readonly RepertoireLine[],
  progress: ProgressMap,
  options: ChooseOptions,
): RepertoireLine | null {
  if (!lines.length) return null;
  const { now, recent } = options;

  const skip = new Set(recent ?? []);
  const candidates = lines.filter((l) => !skip.has(l.id));
  // Once everything is recent the session has come full circle; start over.
  const pool = candidates.length ? candidates : [...lines];

  const unseen = pool.filter((l) => (progress[l.id]?.attempts ?? 0) === 0);
  if (unseen.length) return unseen[0]!;

  const due = pool
    .filter((l) => progressFor(progress, l.id, now).dueAt <= now)
    .sort((a, b) => progressFor(progress, a.id, now).dueAt - progressFor(progress, b.id, now).dueAt);
  if (due.length) return due[0]!;

  return [...pool].sort((a, b) => {
    const pa = progressFor(progress, a.id, now);
    const pb = progressFor(progress, b.id, now);
    return pa.streak - pb.streak || pa.lastSeenAt - pb.lastSeenAt;
  })[0]!;
}
