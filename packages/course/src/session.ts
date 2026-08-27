/**
 * What to practise right now.
 *
 * Three shapes, and they are not three settings on the same thing.
 *
 * *Learn* meets a move for the first time. It plays the moves out for you first
 * — one at a time, with what the author wrote about each — and only then asks
 * for them back. A long variation is not shown once and asked for once: it is
 * broken into parts, each part watched and then recalled, and when the parts are
 * done the whole line is asked from the first move. Watching a line is not
 * knowing it, and playing it in four-move instalments is not knowing it either;
 * the run from move one at the end is the only part that tests anything.
 *
 * *Review* replays a variation you have met before with nothing shown — the move
 * is only named after you have failed to produce it. *Random* skips the replay
 * entirely and drops you into the position the due move sits in, which is the
 * difference between an hour of review and ten minutes of it on a course of any
 * size.
 */

import { isDue, progressFor } from './scheduler.js';
import { moveKey, quizIndices, variationsOf } from './tree.js';
import type { Variation } from './tree.js';
import type {
  Course,
  CourseNode,
  CourseProgress,
  SessionMode,
  SessionPlan,
  SessionTask,
} from './types.js';

/** New moves a learn session takes on before it stops. */
export const DEFAULT_NEW_MOVES = 10;

/**
 * Most of your own moves a learn session will teach in one part.
 *
 * Four is a guess at where a sequence stops being a shape and starts being a
 * list, and it is deliberately below the famous seven: you are not memorising
 * digits, you are memorising them *and* what they are for, from a position that
 * changes under you at every one.
 */
export const DEFAULT_CHUNK = 4;

/**
 * The most leading plies a first part will recap.
 *
 * When a variation opens with moves another line already taught this session,
 * those moves are replayed quickly at the top of the first part instead of
 * being dropped on the board — but a deep transposition can share twenty-odd
 * plies, and past a point a "recap" is just the screensaver the instant set-up
 * was there to avoid. Beyond this, the recap starts partway in.
 */
export const RECAP_MAX_PLIES = 24;

/**
 * The shortest shared opening worth recapping.
 *
 * One or two moves in common is every line in the chapter; materialising them
 * on the board in one go, the way an unshared opening is, costs nothing. It is
 * a genuine run of theory — a whole system played the same way — that is worth
 * carrying you back through rather than skipping to the end of.
 */
export const RECAP_MIN_PLIES = 4;

/** Times the whole line is asked for, from move one, once the parts are done. */
export const DEFAULT_FULL_PASSES = 1;

/** Due moves a review session covers before it stops. */
export const DEFAULT_DUE_MOVES = 30;

export interface SessionOptions {
  mode: SessionMode;
  now?: number;
  /** Restricts the session to these chapters. All of them when absent. */
  chapterIds?: readonly string[];
  /**
   * Restricts the session to these variations, by {@link Variation.id}. A learn
   * session narrowed this way teaches the whole of each picked line even when
   * every move in it has been met — this is "study this line" on the variation
   * list, not the new-move queue.
   */
  lineIds?: readonly string[];
  newMoves?: number;
  /** Your moves per part. 0 or less teaches the line in one go. */
  chunk?: number;
  fullPasses?: number;
  dueMoves?: number;
  /** Injectable so a test gets the same session twice. */
  shuffle?: <T>(items: T[]) => T[];
}

function defaultShuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

function scope(
  course: Course,
  chapterIds?: readonly string[],
  lineIds?: readonly string[],
): Variation[] {
  const chapters = chapterIds?.length ? new Set(chapterIds) : null;
  const lines = lineIds?.length ? new Set(lineIds) : null;
  return course.chapters
    .filter((chapter) => !chapters || chapters.has(chapter.id))
    .flatMap((chapter) => variationsOf(chapter, course.side))
    .filter((variation) => !lines || lines.has(variation.id));
}

/** Builds the queue of runs a session walks. */
export function buildSession(
  course: Course,
  progress: CourseProgress,
  options: SessionOptions,
): SessionPlan {
  const now = options.now ?? Date.now();
  const variations = scope(course, options.chapterIds, options.lineIds);

  switch (options.mode) {
    case 'learn':
      return learnPlan(course, progress, variations, options, now);
    case 'review':
      return reviewPlan(course, progress, variations, options, now);
    case 'random':
      return randomPlan(course, progress, variations, options, now);
  }
}

/* --------------------------------------------------------------- learn --- */

/**
 * Splits `count` items into parts of at most `max`, as evenly as the division
 * allows. Nine moves in parts of four is 3-3-3, not 4-4-1: a trailing part with
 * one move in it is a part in name only, and the lopsided version is harder to
 * hold than the even one.
 */
export function evenParts(count: number, max: number): number[] {
  if (count <= 0) return [];
  if (max <= 0 || count <= max) return [count];
  const parts = Math.ceil(count / max);
  const base = Math.floor(count / parts);
  const extra = count % parts;
  return Array.from({ length: parts }, (_, i) => base + (i < extra ? 1 : 0));
}

/** How many leading plies two lines share, matched on the move and its position. */
function sharedPrefix(a: readonly CourseNode[], b: readonly CourseNode[]): number {
  const max = Math.min(a.length, b.length);
  let i = 0;
  while (i < max && moveKey(a[i]!) === moveKey(b[i]!)) i++;
  return i;
}

function learnPlan(
  course: Course,
  progress: CourseProgress,
  variations: readonly Variation[],
  options: SessionOptions,
  now: number,
): SessionPlan {
  const budget = options.newMoves ?? DEFAULT_NEW_MOVES;
  const chunk = options.chunk ?? DEFAULT_CHUNK;
  const fullPasses = Math.max(1, options.fullPasses ?? DEFAULT_FULL_PASSES);
  // Lines picked by name are taught in full, met or not; the new-move budget and
  // the "skip lines with nothing fresh" rule are for the open-ended learn queue.
  const picked = Boolean(options.lineIds?.length);
  const tasks: SessionTask[] = [];
  const taken = new Set<string>();
  // Lines that have generated tasks, to spot the next one that opens the same way.
  const taught: CourseNode[][] = [];

  for (const variation of variations) {
    if (!picked && taken.size >= budget) break;

    const { line } = variation;
    const quiz = quizIndices(line, course.side);
    if (!quiz.length) continue;

    // Leading plies this line shares with one already taught this session, once
    // that run is long enough to be worth replaying. A picked line is exempt:
    // "study this line" means from the top, every time.
    const shared = picked
      ? 0
      : taught.reduce((most, prev) => Math.max(most, sharedPrefix(prev, line)), 0);
    const recap = shared >= RECAP_MIN_PLIES ? shared : 0;

    // Which of this line's moves you have never met, and are not part of the
    // recap. Everything else in it is context: it still gets asked on the run
    // from move one, because you cannot reach move 12 without playing moves 1 to
    // 11, but it is not what the session spends its budget on or the parts teach.
    const fresh = quiz.filter(
      (index) =>
        index >= recap && progressFor(progress, moveKey(line[index]!), now).level === 0,
    );
    if (!picked && !fresh.length) continue;

    for (const index of fresh) taken.add(moveKey(line[index]!));
    taught.push(line);

    // Teaching starts at the first move you have not met — or at the top, for a
    // line you asked to study again. Everything before the start is put on the
    // board in one go: being walked slowly through six moves you already know is
    // how a lesson turns into a screensaver. The exception is a shared opening,
    // which the first part replays quickly rather than skipping outright.
    const from = fresh.length ? fresh[0]! : (quiz.find((index) => index >= recap) ?? quiz[0]!);
    const teach = quiz.filter((index) => index >= from);
    const sizes = evenParts(teach.length, chunk);

    let cut = 0;
    sizes.forEach((size, part) => {
      const mine = teach.slice(cut, cut + size);
      cut += size;
      const start = mine[0]!;
      // A part owns every ply from its first move up to the next part's first —
      // the opponent's replies in between included, since they are what makes
      // the moves make sense.
      const next = teach[cut];
      const end = next ?? line.length;

      // The first part rewinds to before the shared opening and plays it through
      // as a recap; every other part opens where its own moves begin.
      const recapFrom = part === 0 && recap > 0 ? Math.max(0, start - RECAP_MAX_PLIES) : start;

      tasks.push({
        id: `${variation.id}~${part}`,
        mode: 'learn',
        lineId: variation.id,
        chapterId: variation.chapterId,
        chapterName: variation.chapterName,
        line,
        startIndex: start,
        quiz: mine,
        watch: {
          from: recapFrom,
          to: end,
          ...(recapFrom < start ? { recap: start } : {}),
        },
        ...(sizes.length > 1 ? { part: { index: part, total: sizes.length } } : {}),
        pass: 0,
      });
    });

    // And then the whole thing, from the first move, with nothing shown. This
    // is the only task in a learn session that asks the question the board will
    // ask you: not "can you continue this", but "do you know this line".
    for (let pass = 0; pass < fullPasses; pass++) {
      tasks.push({
        id: `${variation.id}#${pass}`,
        mode: 'learn',
        lineId: variation.id,
        chapterId: variation.chapterId,
        chapterName: variation.chapterName,
        line,
        startIndex: 0,
        quiz,
        pass,
      });
    }
  }

  return { mode: 'learn', tasks, newMoves: taken.size, dueMoves: 0 };
}

/* -------------------------------------------------------------- review --- */

/**
 * A variation is chosen because something in it is due, and then *every* one of
 * your moves in it is asked and graded — not only the due one. That is the
 * bargain whole-variation review makes: you are replaying the line anyway, and a
 * move you produce cold from move one is a move you have shown you know, whether
 * or not its date had come round.
 */
function reviewPlan(
  course: Course,
  progress: CourseProgress,
  variations: readonly Variation[],
  options: SessionOptions,
  now: number,
): SessionPlan {
  const budget = options.dueMoves ?? DEFAULT_DUE_MOVES;

  // Most overdue first: a move a week past its date is closer to forgotten than
  // one that came due this morning.
  const candidates = variations
    .map((variation) => {
      const quiz = quizIndices(variation.line, course.side);
      const due = quiz.filter((index) => {
        const entry = progressFor(progress, moveKey(variation.line[index]!), now);
        return entry.level > 0 && isDue(entry, now);
      });
      const oldest = due.length
        ? Math.min(...due.map((i) => progressFor(progress, moveKey(variation.line[i]!), now).dueAt))
        : Infinity;
      return { variation, quiz, due, oldest };
    })
    .filter((entry) => entry.due.length)
    .sort((a, b) => a.oldest - b.oldest);

  const tasks: SessionTask[] = [];
  const covered = new Set<string>();

  for (const { variation, quiz, due } of candidates) {
    if (covered.size >= budget) break;
    // A variation whose due moves have all been covered by an earlier one is
    // still worth nothing extra, and replaying it is the slow half of review.
    if (due.every((index) => covered.has(moveKey(variation.line[index]!)))) continue;
    for (const index of due) covered.add(moveKey(variation.line[index]!));

    tasks.push({
      id: `${variation.id}#0`,
      mode: 'review',
      lineId: variation.id,
      chapterId: variation.chapterId,
      chapterName: variation.chapterName,
      line: variation.line,
      startIndex: 0,
      quiz,
      pass: 0,
    });
  }

  return { mode: 'review', tasks, newMoves: 0, dueMoves: covered.size };
}

/* -------------------------------------------------------------- random --- */

function randomPlan(
  course: Course,
  progress: CourseProgress,
  variations: readonly Variation[],
  options: SessionOptions,
  now: number,
): SessionPlan {
  const budget = options.dueMoves ?? DEFAULT_DUE_MOVES;
  const shuffle = options.shuffle ?? defaultShuffle;

  // One question per due move. The first variation that reaches it supplies the
  // moves before it, which are replayed onto the board rather than asked.
  const seen = new Set<string>();
  const questions: SessionTask[] = [];

  for (const variation of variations) {
    for (const index of quizIndices(variation.line, course.side)) {
      const key = moveKey(variation.line[index]!);
      if (seen.has(key)) continue;
      const entry = progressFor(progress, key, now);
      if (entry.level === 0 || !isDue(entry, now)) continue;
      seen.add(key);
      questions.push({
        id: `${variation.id}@${index}`,
        mode: 'random',
        // Each randomised question stands alone: two drawn from the same
        // variation are two things to answer, not one line seen twice.
        lineId: `${variation.id}@${index}`,
        chapterId: variation.chapterId,
        chapterName: variation.chapterName,
        line: variation.line,
        startIndex: index,
        quiz: [index],
        pass: 0,
      });
    }
  }

  const tasks = shuffle(questions).slice(0, budget);
  return { mode: 'random', tasks, newMoves: 0, dueMoves: tasks.length };
}
