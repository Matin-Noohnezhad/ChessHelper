import { describe, expect, it } from 'vitest';
import { buildCourse } from '../import.js';
import { LEVELS } from '../scheduler.js';
import { buildSession } from '../session.js';
import { CourseTrainer } from '../trainer.js';
import { moveKey, trainableMoves } from '../tree.js';
import type { Course, CourseProgress } from '../types.js';
import { COURSE_PGN } from './fixture.js';

const NOW = 1_700_000_000_000;
const HOUR = 60 * 60_000;
const course = buildCourse(COURSE_PGN);

function progressAt(target: Course, level: number, dueAt: number): CourseProgress {
  const out: CourseProgress = {};
  for (const key of trainableMoves(target.chapters, target.side).keys()) {
    out[key] = { key, level, dueAt, lastSeenAt: NOW - HOUR, correct: level, wrong: 0 };
  }
  return out;
}

/**
 * A trainer on the Najdorf line, taught in one part, with the demonstration
 * skipped — watching is exercised on its own below, and every other test here
 * is about what happens once you are being asked.
 */
function najdorfTrainer(progress: CourseProgress = {}) {
  const plan = buildSession(course, progress, {
    mode: 'learn',
    now: NOW,
    newMoves: 1,
    chunk: 0,
  });
  const trainer = new CourseTrainer({ course, plan, progress, now: () => NOW });
  trainer.skipWatch();
  return trainer;
}

describe('answering', () => {
  it('opens on your move, with the board in the chapter’s start position', () => {
    const trainer = najdorfTrainer();
    expect(trainer.status).toBe('asking');
    expect(trainer.isUsersTurn).toBe(true);
    expect(trainer.current?.san).toBe('e4');
    expect(trainer.game.history()).toEqual([]);
  });

  it('plays the opponent’s answer for you and stops at the next question', () => {
    const trainer = najdorfTrainer();
    const outcome = trainer.submit('e4');
    expect(outcome.status).toBe('correct');
    expect(outcome).toMatchObject({ reply: { san: 'c5' } });
    expect(trainer.game.history()).toEqual(['e4', 'c5']);
    expect(trainer.current?.san).toBe('Nf3');
  });

  it('leaves the board where it was when the answer is wrong', () => {
    const trainer = najdorfTrainer();
    trainer.submit('e4');
    const before = trainer.game.fen();
    const outcome = trainer.submit('h4');
    expect(outcome.status).toBe('wrong');
    expect(outcome).toMatchObject({ san: 'h4', message: 'The course plays Nf3 here.' });
    expect(trainer.game.fen()).toBe(before);
    expect(trainer.current?.san).toBe('Nf3');
  });

  it('names the move once you have missed it, the way review is meant to work', () => {
    const trainer = najdorfTrainer();
    // Even in a learn session, being asked means being asked: you have just
    // watched the line, so nothing is on display until you get one wrong.
    expect(trainer.revealed).toBe(false);
    const review = new CourseTrainer({
      course,
      plan: buildSession(course, progressAt(course, 2, NOW - HOUR), { mode: 'review', now: NOW }),
      progress: progressAt(course, 2, NOW - HOUR),
      now: () => NOW,
    });
    expect(review.revealed).toBe(false);
    review.submit('h4');
    expect(review.revealed).toBe(true);
  });

  it('refuses a move that is not legal without calling it an error', () => {
    const trainer = najdorfTrainer();
    expect(trainer.submit({ from: 'e1', to: 'e5' })).toEqual({ status: 'illegal', san: 'e1e5' });
    expect(trainer.current?.san).toBe('e4');
  });
});

describe('the moves either side of the one being taught', () => {
  /** Walks to the position after 1.e4 c5 2.Nf3 d6, where the branch is. */
  function atThirdMove() {
    const trainer = najdorfTrainer();
    trainer.submit('e4');
    trainer.submit('Nf3');
    return trainer;
  }

  it('accepts a move the author showed and dropped, and plays on with theirs', () => {
    const trainer = atThirdMove();
    const outcome = trainer.submit('Be2');
    expect(outcome.status).toBe('alternative');
    expect(outcome).toMatchObject({ san: 'Be2', expected: { san: 'd4' } });
    // Be2 is playable; the line the author wrote runs through d4, so that is
    // what goes on the board.
    expect(trainer.game.history()).toEqual(['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4']);
  });

  it('counts an alternative as knowing the move', () => {
    const trainer = atThirdMove();
    trainer.submit('Be2');
    expect(trainer.scoreboard().wrong).toBe(0);
    expect(trainer.scoreboard().right).toBe(3);
  });

  it('holds the board when you wander into another line of the course', () => {
    const trainer = atThirdMove();
    const outcome = trainer.submit('Bb5+');
    expect(outcome.status).toBe('other-line');
    expect(outcome).toMatchObject({
      message: 'Bb5+ is in the course, but in another line. Here it is d4.',
    });
    expect(trainer.game.history()).toEqual(['e4', 'c5', 'Nf3', 'd6']);
  });

  it('gives the author’s reason when you play a move they warned against', () => {
    const trainer = atThirdMove();
    const outcome = trainer.submit('c3');
    expect(outcome.status).toBe('rejected');
    expect(outcome).toMatchObject({ san: 'c3' });
    expect(outcome.status === 'rejected' && outcome.message).toContain('Too slow');
    expect(trainer.game.history()).toEqual(['e4', 'c5', 'Nf3', 'd6']);
  });
});

describe('grading', () => {
  it('puts a move you answered right onto the first rung', () => {
    const trainer = najdorfTrainer();
    trainer.submit('e4');
    const key = moveKey(trainer.plan.tasks[0]!.line[0]!);
    expect(trainer.exportProgress()[key]).toMatchObject({ level: 1, correct: 1, wrong: 0 });
    expect(trainer.exportProgress()[key]!.dueAt).toBe(NOW + LEVELS[0]!);
  });

  it('remembers a miss even when the retry is right', () => {
    const trainer = najdorfTrainer();
    trainer.submit('e4');
    trainer.submit('h4');
    trainer.submit('Nf3');
    const key = moveKey(trainer.plan.tasks[0]!.line[2]!);
    expect(trainer.exportProgress()[key]).toMatchObject({ level: 1, correct: 0, wrong: 1 });
  });

  it('treats a move you had to be told as a move you did not know', () => {
    const review = buildSession(course, progressAt(course, 4, NOW - HOUR), {
      mode: 'review',
      now: NOW,
    });
    const trainer = new CourseTrainer({
      course,
      plan: review,
      progress: progressAt(course, 4, NOW - HOUR),
      now: () => NOW,
    });
    expect(trainer.reveal()).toBe('e4');
    trainer.submit('e4');
    const key = moveKey(trainer.plan.tasks[0]!.line[0]!);
    expect(trainer.exportProgress()[key]).toMatchObject({ level: 1, wrong: 1 });
  });

  it('does not count watching the line against you', () => {
    const plan = buildSession(course, {}, { mode: 'learn', now: NOW, newMoves: 1, chunk: 0 });
    const trainer = new CourseTrainer({ course, plan, now: () => NOW });
    while (trainer.watching) trainer.advanceWatch();
    trainer.submit('e4');
    const key = moveKey(plan.tasks[0]!.line[0]!);
    expect(trainer.exportProgress()[key]).toMatchObject({ level: 1, wrong: 0 });
  });

  it('grades a move once a session, however many times the session asks it', () => {
    const plan = buildSession(course, {}, {
      mode: 'learn',
      now: NOW,
      newMoves: 1,
      chunk: 0,
      fullPasses: 3,
    });
    const trainer = new CourseTrainer({ course, plan, now: () => NOW });
    const line = 'e4 Nf3 d4 Nxd4 Nc3'.split(' ');

    // One part plus three runs from the top: four times through the same line.
    for (let run = 0; run < 4; run++) {
      trainer.skipWatch();
      for (const san of line) trainer.submit(san);
      if (trainer.status === 'task-complete') trainer.nextTask();
    }

    expect(trainer.status).toBe('complete');
    const key = moveKey(plan.tasks[0]!.line[0]!);
    // Four clean run-throughs in one sitting is not four days of retention.
    expect(trainer.exportProgress()[key]).toMatchObject({ level: 1, correct: 1 });
    expect(trainer.scoreboard()).toMatchObject({ graded: 5, right: 5, wrong: 0 });
  });

  it('takes back a pass when the same move fails on the run from the top', () => {
    const plan = buildSession(course, {}, { mode: 'learn', now: NOW, newMoves: 1, chunk: 0 });
    const trainer = new CourseTrainer({ course, plan, now: () => NOW });
    const line = 'e4 Nf3 d4 Nxd4 Nc3'.split(' ');

    trainer.skipWatch();
    for (const san of line) trainer.submit(san);
    expect(trainer.scoreboard()).toMatchObject({ right: 5, wrong: 0 });

    // Now the whole line from move one, and this time 3.d4 will not come.
    trainer.nextTask();
    trainer.submit('e4');
    trainer.submit('Nf3');
    trainer.submit('h3');
    trainer.submit('d4');
    for (const san of ['Nxd4', 'Nc3']) trainer.submit(san);

    const key = moveKey(plan.tasks[0]!.line[4]!);
    expect(plan.tasks[0]!.line[4]!.san).toBe('d4');
    // Producing it mid-line and then losing it from the top is not knowing it.
    expect(trainer.exportProgress()[key]).toMatchObject({ level: 1, wrong: 1 });
    expect(trainer.scoreboard()).toMatchObject({ graded: 5, right: 4, wrong: 1 });
  });

  it('shares a move between the chapters that teach it', () => {
    const plan = buildSession(course, {}, { mode: 'learn', now: NOW, newMoves: 1, chunk: 0 });
    const trainer = new CourseTrainer({ course, plan, now: () => NOW });
    trainer.skipWatch();
    trainer.submit('e4');
    const progress = trainer.exportProgress();

    // The other chapter opens 1.e4 from the same position. It is one move to
    // know, not two, and it is already known.
    const chapterTwo = trainableMoves([course.chapters[1]!], course.side);
    const key = [...chapterTwo.keys()].find((k) => chapterTwo.get(k)!.san === 'e4')!;
    expect(progress[key]).toMatchObject({ level: 1 });
  });
});

describe('walking a session', () => {
  it('replays the moves before a randomised question instead of asking them', () => {
    const progress = progressAt(course, 3, NOW - HOUR);
    const plan = buildSession(course, progress, {
      mode: 'random',
      now: NOW,
      shuffle: (items) => items,
    });
    const trainer = new CourseTrainer({ course, plan, progress, now: () => NOW });
    // The first question is 1.e4, so skip to one with a line in front of it.
    while (trainer.task && trainer.task.startIndex === 0) trainer.nextTask();

    const task = trainer.task!;
    expect(trainer.context).toEqual(task.line.slice(0, task.startIndex).map((n) => n.san));
    expect(trainer.game.history()).toEqual(trainer.context);
    expect(trainer.current?.san).toBe(task.line[task.startIndex]!.san);
  });

  it('finishes a randomised question after the one move it asked', () => {
    const progress = progressAt(course, 3, NOW - HOUR);
    const plan = buildSession(course, progress, {
      mode: 'random',
      now: NOW,
      shuffle: (items) => items,
    });
    const trainer = new CourseTrainer({ course, plan, progress, now: () => NOW });
    const outcome = trainer.submit(trainer.current!.san);
    expect(outcome).toMatchObject({ status: 'correct', taskComplete: true });
    expect(trainer.status).toBe('task-complete');
  });

  it('reports the session finished once the last task is answered', () => {
    const progress = progressAt(course, 3, NOW - HOUR);
    const plan = buildSession(course, progress, {
      mode: 'random',
      now: NOW,
      dueMoves: 2,
      shuffle: (items) => items,
    });
    const trainer = new CourseTrainer({ course, plan, progress, now: () => NOW });
    trainer.submit(trainer.current!.san);
    trainer.nextTask();
    const last = trainer.submit(trainer.current!.san);
    expect(last).toMatchObject({ sessionComplete: true });
    expect(trainer.status).toBe('complete');
    expect(trainer.current).toBeNull();
  });
});

describe('watching the line first', () => {
  /** The Najdorf in two parts: three moves taught, then two. */
  function learning() {
    const plan = buildSession(course, {}, { mode: 'learn', now: NOW, newMoves: 1 });
    return new CourseTrainer({ course, plan, now: () => NOW });
  }

  it('opens by playing the moves rather than asking for them', () => {
    const trainer = learning();
    expect(trainer.status).toBe('watching');
    expect(trainer.watching).toBe(true);
    // Nothing is on the board and nothing is being asked yet.
    expect(trainer.game.history()).toEqual([]);
    expect(trainer.current).toBeNull();
    expect(trainer.watchNext?.san).toBe('e4');
    expect(trainer.watched).toBeNull();
  });

  it('plays one move per step, the opponent’s replies included', () => {
    const trainer = learning();
    const played: string[] = [];
    for (let i = 0; i < 6; i++) played.push(trainer.advanceWatch()!.san);

    expect(played).toEqual(['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4']);
    // The last move of a part stays on the board to be looked at. It is the
    // step *after* it that rewinds and starts asking, so the position the part
    // arrives at gets a beat of its own rather than vanishing on landing.
    expect(trainer.game.history()).toEqual(played);
    expect(trainer.watching).toBe(true);

    expect(trainer.advanceWatch()).toBeNull();
    expect(trainer.status).toBe('asking');
  });

  it('hands you the note the author wrote as each move lands', () => {
    const trainer = learning();
    trainer.skipWatch();
    for (const san of ['e4', 'Nf3', 'd4']) trainer.submit(san);
    trainer.nextTask();

    // Part two plays 4.Nxd4 Nf6 5.Nc3 a6, and a6 is where the author wrote.
    for (let i = 0; i < 4; i++) trainer.advanceWatch();
    expect(trainer.watched?.san).toBe('a6');
    expect(trainer.watched?.comment).toContain('The Najdorf');
  });

  it('reports how far through the demonstration it is', () => {
    const trainer = learning();
    expect(trainer.watchCompletion).toBe(0);
    trainer.advanceWatch();
    trainer.advanceWatch();
    trainer.advanceWatch();
    expect(trainer.watchCompletion).toBeCloseTo(0.5);
  });

  it('rewinds and asks for the same moves once the demonstration ends', () => {
    const trainer = learning();
    while (trainer.watching) trainer.advanceWatch();
    expect(trainer.status).toBe('asking');
    // Back to where the part began, waiting for the first of the moves it just
    // played. Watching a line is not knowing it.
    expect(trainer.game.history()).toEqual([]);
    expect(trainer.current?.san).toBe('e4');
    expect(trainer.isUsersTurn).toBe(true);
  });

  it('can be cut short', () => {
    const trainer = learning();
    trainer.advanceWatch();
    trainer.skipWatch();
    expect(trainer.status).toBe('asking');
    expect(trainer.game.history()).toEqual([]);
    expect(trainer.current?.san).toBe('e4');
  });

  it('stops a part where the part stops', () => {
    const trainer = learning();
    trainer.skipWatch();
    // Part one is 1.e4, 2.Nf3 and 3.d4 — and then it ends, rather than running
    // on through moves the session has not taught yet.
    for (const san of ['e4', 'Nf3', 'd4']) trainer.submit(san);
    expect(trainer.status).toBe('task-complete');
    expect(trainer.game.history()).toEqual(['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4']);
  });

  it('starts the next part on the board the last one left', () => {
    const trainer = learning();
    trainer.skipWatch();
    for (const san of ['e4', 'Nf3', 'd4']) trainer.submit(san);
    trainer.nextTask();

    expect(trainer.part).toEqual({ index: 1, total: 2 });
    expect(trainer.status).toBe('watching');
    expect(trainer.game.history()).toEqual(['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4']);
    expect(trainer.watchNext?.san).toBe('Nxd4');
    expect(trainer.context).toEqual(['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4']);
  });

  it('finishes with the whole line from the first move, nothing shown', () => {
    const trainer = learning();
    trainer.skipWatch();
    for (const san of ['e4', 'Nf3', 'd4']) trainer.submit(san);
    trainer.nextTask();
    trainer.skipWatch();
    for (const san of ['Nxd4', 'Nc3']) trainer.submit(san);
    trainer.nextTask();

    expect(trainer.part).toBeNull();
    expect(trainer.status).toBe('asking');
    expect(trainer.watching).toBe(false);
    expect(trainer.game.history()).toEqual([]);
    expect(trainer.current?.san).toBe('e4');

    for (const san of ['e4', 'Nf3', 'd4', 'Nxd4', 'Nc3']) trainer.submit(san);
    expect(trainer.status).toBe('complete');
  });
});

describe('where the session has got to', () => {
  it('counts in lines, and says which run at the line this is', () => {
    const plan = buildSession(course, {}, { mode: 'learn', now: NOW, newMoves: 100 });
    const trainer = new CourseTrainer({ course, plan, now: () => NOW });

    // The first line: three runs at it — two parts and then the whole thing.
    expect(trainer.run).toEqual({ line: 0, lines: expect.any(Number), index: 0, total: 3 });
    const lines = trainer.run!.lines;
    expect(lines).toBeLessThan(plan.tasks.length);

    trainer.nextTask();
    expect(trainer.run).toMatchObject({ line: 0, index: 1, total: 3 });
    trainer.nextTask();
    expect(trainer.run).toMatchObject({ line: 0, index: 2, total: 3 });
    // And then a new line, back to the first run at it.
    trainer.nextTask();
    expect(trainer.run).toMatchObject({ line: 1, index: 0 });
  });

  it('offers the moves on the board to be read back through', () => {
    const plan = buildSession(course, {}, { mode: 'learn', now: NOW, newMoves: 1, chunk: 0 });
    const trainer = new CourseTrainer({ course, plan, now: () => NOW });
    trainer.skipWatch();
    trainer.submit('e4');
    trainer.submit('Nf3');

    expect(trainer.ply).toBe(4);
    expect(trainer.played.map((node) => node.san)).toEqual(['e4', 'c5', 'Nf3', 'd6']);
    // Notes hang off the nodes, which is what makes the trail worth walking.
    expect(trainer.played[3]!.san).toBe('d6');
  });

  it('hands out the position a line starts from, so part of it can be replayed', () => {
    const fen = '8/8/8/4k3/8/8/4P3/4K3 w - - 0 1';
    const ending = buildCourse(`[Event "Endings: Opposition"]\n[FEN "${fen}"]\n\n1. Kd2 Kd4 2. Ke2 *`);
    const plan = buildSession(ending, {}, { mode: 'learn', now: NOW });
    const trainer = new CourseTrainer({ course: ending, plan, now: () => NOW });
    expect(trainer.startFen).toBe(fen);
  });
});
