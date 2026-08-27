import { describe, expect, it } from 'vitest';
import { buildCourse } from '../import.js';
import { buildSession, evenParts } from '../session.js';
import { moveKey, trainableMoves, variationsOf } from '../tree.js';
import type { Course, CourseProgress } from '../types.js';
import { COURSE_PGN } from './fixture.js';

const NOW = 1_700_000_000_000;
const HOUR = 60 * 60_000;
const course = buildCourse(COURSE_PGN);

/** Everything in the course at one level, due at one time. */
function progressAt(target: Course, level: number, dueAt: number): CourseProgress {
  const out: CourseProgress = {};
  for (const key of trainableMoves(target.chapters, target.side).keys()) {
    out[key] = { key, level, dueAt, lastSeenAt: NOW - HOUR, correct: level, wrong: 0 };
  }
  return out;
}

const sans = (line: readonly { san: string }[]): string => line.map((node) => node.san).join(' ');

describe('learn sessions', () => {
  const najdorf = 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6';
  const plan = buildSession(course, {}, { mode: 'learn', now: NOW, newMoves: 1 });

  it('breaks a line into parts, and says which part is which', () => {
    // Five moves of your own, four to a part: three then two, rather than four
    // then a part with one move in it.
    expect(plan.tasks.map((task) => task.part ?? null)).toEqual([
      { index: 0, total: 2 },
      { index: 1, total: 2 },
      null,
    ]);
  });

  it('plays a part out for you before it asks for it', () => {
    const first = plan.tasks[0]!;
    expect(first.watch).toEqual({ from: 0, to: 6 });
    expect(first.quiz).toEqual([0, 2, 4]);
    // The demonstration covers the opponent's replies too — they are what the
    // moves are answering.
    expect(first.line.slice(0, 6).map((n) => n.san)).toEqual(
      ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4'],
    );
  });

  it('starts the next part where the last one stopped', () => {
    const second = plan.tasks[1]!;
    expect(second.startIndex).toBe(6);
    expect(second.watch).toEqual({ from: 6, to: 10 });
    expect(second.quiz).toEqual([6, 8]);
  });

  it('ends by asking for the whole line from the first move', () => {
    const last = plan.tasks[plan.tasks.length - 1]!;
    expect(last.startIndex).toBe(0);
    expect(last.watch).toBeUndefined();
    expect(last.quiz).toEqual([0, 2, 4, 6, 8]);
    expect(sans(last.line)).toBe(najdorf);
  });

  it('teaches a short line in one go, with no part to label', () => {
    const short = buildSession(course, {}, { mode: 'learn', now: NOW, newMoves: 1, chunk: 8 });
    expect(short.tasks).toHaveLength(2);
    expect(short.tasks[0]!.part).toBeUndefined();
    expect(short.tasks[0]!.watch).toEqual({ from: 0, to: 10 });
    expect(short.tasks[1]!.watch).toBeUndefined();
  });

  it('starts teaching at the first move you have not met', () => {
    const moves = trainableMoves(course.chapters, course.side);
    const known: CourseProgress = {};
    for (const [key, node] of moves) {
      if (node.san === 'e4' || node.san === 'Nf3') {
        known[key] = { key, level: 4, dueAt: NOW + 100 * HOUR, lastSeenAt: NOW, correct: 4, wrong: 0 };
      }
    }
    const learn = buildSession(course, known, { mode: 'learn', now: NOW, newMoves: 1, chunk: 8 });
    // 1.e4 and 2.Nf3 go on the board in one go; the lesson starts at 3.d4.
    expect(learn.tasks[0]!.watch).toEqual({ from: 4, to: 10 });
    expect(learn.tasks[0]!.quiz).toEqual([4, 6, 8]);
    // The run from move one still asks for everything, known moves included.
    expect(learn.tasks[1]!.quiz).toEqual([0, 2, 4, 6, 8]);
  });

  it('honours the number of runs from the top', () => {
    const thorough = buildSession(course, {}, {
      mode: 'learn',
      now: NOW,
      newMoves: 1,
      chunk: 8,
      fullPasses: 3,
    });
    expect(thorough.tasks.filter((task) => !task.watch).map((task) => task.pass)).toEqual([0, 1, 2]);
  });

  it('stops once it has taken on enough new moves', () => {
    const small = buildSession(course, {}, { mode: 'learn', now: NOW, newMoves: 2 });
    const lines = new Set(small.tasks.map((task) => sans(task.line)));
    expect(lines.size).toBe(1);
    expect(small.newMoves).toBeGreaterThanOrEqual(2);
  });

  it('has nothing to offer when every move has been met', () => {
    const done = buildSession(course, progressAt(course, 1, NOW), { mode: 'learn', now: NOW });
    expect(done.tasks).toEqual([]);
    expect(done.newMoves).toBe(0);
  });
});

describe('splitting a line into parts', () => {
  it('divides as evenly as the count allows', () => {
    expect(evenParts(3, 4)).toEqual([3]);
    expect(evenParts(4, 4)).toEqual([4]);
    // Not 4 and 1: a part with one move in it is a part in name only.
    expect(evenParts(5, 4)).toEqual([3, 2]);
    expect(evenParts(7, 4)).toEqual([4, 3]);
    expect(evenParts(9, 4)).toEqual([3, 3, 3]);
    expect(evenParts(12, 4)).toEqual([4, 4, 4]);
  });

  it('teaches the line in one go when asked to', () => {
    expect(evenParts(20, 0)).toEqual([20]);
    expect(evenParts(0, 4)).toEqual([]);
  });
});

describe('review sessions', () => {
  it('replays whole variations that hold a due move', () => {
    const plan = buildSession(course, progressAt(course, 2, NOW - HOUR), {
      mode: 'review',
      now: NOW,
    });
    expect(plan.tasks.length).toBeGreaterThan(0);
    // Review never demonstrates: the move is only named once you have missed it.
    expect(plan.tasks.every((task) => task.startIndex === 0 && !task.watch)).toBe(true);
    expect(sans(plan.tasks[0]!.line)).toBe('e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6');
  });

  it('leaves a course alone until something falls due', () => {
    const plan = buildSession(course, progressAt(course, 2, NOW + HOUR), {
      mode: 'review',
      now: NOW,
    });
    expect(plan.tasks).toEqual([]);
  });

  it('never asks for a move it has not met — that is what learning is for', () => {
    const plan = buildSession(course, {}, { mode: 'review', now: NOW });
    expect(plan.tasks).toEqual([]);
  });

  it('puts the most overdue line first', () => {
    const progress = progressAt(course, 2, NOW - HOUR);
    const moves = trainableMoves(course.chapters, course.side);
    // 5.Bb5 belongs to the last variation in the file and nowhere else. Left a
    // week past its date, it should be the first thing the session asks about.
    const key = [...moves.keys()].find((k) => moves.get(k)!.san === 'Bb5')!;
    progress[key] = { ...progress[key]!, dueAt: NOW - 7 * 24 * HOUR };
    const plan = buildSession(course, progress, { mode: 'review', now: NOW });
    expect(sans(plan.tasks[0]!.line)).toBe('e4 e5 Nf3 Nc6 Bb5');
  });

  it('does not replay a line whose due moves an earlier line already covered', () => {
    const plan = buildSession(course, progressAt(course, 2, NOW - HOUR), {
      mode: 'review',
      now: NOW,
    });
    // Chapter two is 1.e4 c5 2.Nf3 Nc6 3.d4 …, every move of which chapter one
    // already asked for. Replaying it teaches nothing and costs eight moves.
    expect(plan.tasks.map((task) => task.chapterId)).not.toContain(course.chapters[1]!.id);
  });
});

describe('randomised review', () => {
  const plan = buildSession(course, progressAt(course, 3, NOW - HOUR), {
    mode: 'random',
    now: NOW,
    shuffle: (items) => items,
  });

  it('asks one question per due move, from the position it sits in', () => {
    expect(plan.tasks.every((task) => task.quiz.length === 1)).toBe(true);
    expect(plan.tasks.every((task) => task.quiz[0] === task.startIndex)).toBe(true);
    expect(plan.dueMoves).toBe(plan.tasks.length);
  });

  it('covers every due move exactly once', () => {
    const total = trainableMoves(course.chapters, course.side).size;
    expect(plan.tasks).toHaveLength(total);
    const keys = plan.tasks.map((task) => moveKey(task.line[task.startIndex]!));
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('caps the session where it is told to', () => {
    const short = buildSession(course, progressAt(course, 3, NOW - HOUR), {
      mode: 'random',
      now: NOW,
      dueMoves: 3,
      shuffle: (items) => items,
    });
    expect(short.tasks).toHaveLength(3);
  });
});

describe('counting a session in lines', () => {
  it('groups the runs at one line under one line', () => {
    const plan = buildSession(course, {}, { mode: 'learn', now: NOW, newMoves: 100 });
    const lines = new Set(plan.tasks.map((task) => task.lineId));
    // Many more tasks than lines: each line is watched in parts and then asked
    // for from the top.
    expect(plan.tasks.length).toBeGreaterThan(lines.size);
    for (const id of lines) {
      const runs = plan.tasks.filter((task) => task.lineId === id);
      // The runs at one line are contiguous — a session finishes with a line
      // before it starts the next.
      const first = plan.tasks.indexOf(runs[0]!);
      expect(plan.tasks.slice(first, first + runs.length)).toEqual(runs);
    }
  });

  it('keeps each randomised question a line of its own', () => {
    const plan = buildSession(course, progressAt(course, 3, NOW - HOUR), {
      mode: 'random',
      now: NOW,
      shuffle: (items) => items,
    });
    // Several questions can come from one variation; each is still one thing to
    // answer, not one line asked repeatedly.
    const lines = new Set(plan.tasks.map((task) => task.lineId));
    expect(lines.size).toBe(plan.tasks.length);
  });
});

describe('a single variation, picked off the list', () => {
  const chapter = course.chapters[0]!;
  const najdorf = variationsOf(chapter, 'white')[0]!;
  const moscow = variationsOf(chapter, 'white')[1]!;

  it('confines a learn session to the line asked for', () => {
    const plan = buildSession(course, {}, { mode: 'learn', now: NOW, lineIds: [najdorf.id] });
    expect(new Set(plan.tasks.map((task) => task.lineId))).toEqual(new Set([najdorf.id]));
    const top = plan.tasks[plan.tasks.length - 1]!;
    expect(sans(top.line)).toBe('e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6');
  });

  it('teaches a picked line in full even when every move in it is known', () => {
    // Nothing is fresh: the open-ended queue would skip this line entirely.
    const known = progressAt(course, 5, NOW + 1_000 * HOUR);
    const queue = buildSession(course, known, { mode: 'learn', now: NOW });
    expect(queue.tasks).toHaveLength(0);

    const picked = buildSession(course, known, { mode: 'learn', now: NOW, lineIds: [najdorf.id] });
    expect(picked.tasks.length).toBeGreaterThan(0);
    // Taught from the very first move, not from some later "first unmet" one.
    expect(picked.tasks[0]!.watch?.from).toBe(0);
    expect(picked.tasks[picked.tasks.length - 1]!.startIndex).toBe(0);
  });

  it('narrows a review session to the picked line too', () => {
    const due = progressAt(course, 3, NOW - HOUR);
    const plan = buildSession(course, due, { mode: 'review', now: NOW, lineIds: [moscow.id] });
    expect(new Set(plan.tasks.map((task) => task.lineId))).toEqual(new Set([moscow.id]));
  });
});
