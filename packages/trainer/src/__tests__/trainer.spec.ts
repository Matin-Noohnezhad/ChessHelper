import { describe, expect, it } from 'vitest';
import { OpeningTrainer } from '../trainer.js';
import { buildRepertoire, countLines, trainableOpenings } from '../repertoire.js';
import { MASTERY_STREAK, blankProgress, chooseLine, recordRun } from '../scheduler.js';
import type { ProgressMap } from '../types.js';

const SICILIAN = ['e4', 'c5'];
/** A prefix, not a leaf: the book may grow deeper beneath it at any time. */
const NAJDORF = 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6';

/** A clock we control, so spacing behaviour is testable rather than flaky. */
function clock(start = 1_000_000) {
  let t = start;
  return { now: () => t, advance: (ms: number) => (t += ms) };
}

/**
 * Plays the user's side of the current line to the end. Driving the test from
 * the line itself means deepening the book cannot silently break these tests.
 */
function playThrough(trainer: OpeningTrainer): string[] {
  const played: string[] = [];
  const line = trainer.line!;
  while (trainer.status === 'playing') {
    const san = line.moves[trainer.ply];
    if (!san) break;
    const outcome = trainer.submit(san);
    if (outcome.status !== 'correct' && outcome.status !== 'transposition') break;
    played.push(san);
  }
  return played;
}

describe('repertoire', () => {
  it('collects the deepest lines under an opening', () => {
    const names = buildRepertoire(SICILIAN).map((l) => l.name);
    for (const family of ['Najdorf', 'Dragon', 'Alapin', 'Rossolimo']) {
      expect(names.some((n) => n.includes(family)), `no ${family} line`).toBe(true);
    }
    expect(names.length).toBeGreaterThan(5);
  });

  it('drops lines that another line extends', () => {
    const ids = buildRepertoire(SICILIAN).map((l) => l.id);
    // Waypoints are not practisable lines: 'e4 c5 Nf3 d6' only leads onward,
    // and the Najdorf itself is now a waypoint to the English Attack.
    expect(ids).not.toContain('e4 c5 Nf3 d6');
    expect(ids).not.toContain(NAJDORF);
    expect(ids.some((id) => id.startsWith(`${NAJDORF} `))).toBe(true);
  });

  it('leaves out lines too short to be worth drilling', () => {
    const lines = buildRepertoire(SICILIAN);
    expect(lines.every((l) => l.moves.length >= 6)).toBe(true);
    // ...unless that is all an opening has, in which case a short drill beats none.
    expect(buildRepertoire(['b3']).length).toBeGreaterThan(0);
  });

  it('inherits theory so every line can teach something', () => {
    for (const line of buildRepertoire(SICILIAN)) {
      expect(line.theory, `${line.name} has no theory to fall back on`).toBeDefined();
    }
  });

  it('offers trainable openings and counts their lines', () => {
    expect(countLines(SICILIAN)).toBe(buildRepertoire(SICILIAN).length);
    const trainable = trainableOpenings();
    expect(trainable.some((o) => o.name === 'Sicilian Defence')).toBe(true);
    expect(trainable.every((o) => o.theory)).toBe(true);
  });
});

describe('sparring', () => {
  it('plays the other side of the line while you play yours', () => {
    const trainer = new OpeningTrainer({ root: SICILIAN, side: 'black' });
    const start = trainer.startLine(NAJDORF)!;

    // Playing Black, the trainer owes the first move.
    expect(start.reply).toBe('e4');
    expect(trainer.isUsersTurn).toBe(true);
    expect(trainer.expectedSan).toBe('c5');

    const outcome = trainer.submit('c5');
    expect(outcome.status).toBe('correct');
    if (outcome.status === 'correct') expect(outcome.reply).toBe('Nf3');
    expect(trainer.game.history()).toEqual(['e4', 'c5', 'Nf3']);
  });

  it('runs a whole line to completion and records a clean run', () => {
    const time = clock();
    const trainer = new OpeningTrainer({ root: SICILIAN, side: 'black', now: time.now });
    const started = trainer.startLine(NAJDORF)!;
    expect(started.line.name).toContain('Najdorf');

    const played = playThrough(trainer);
    expect(played[0]).toBe('c5');
    expect(trainer.status).toBe('complete');
    expect(trainer.mistakesThisRun).toBe(0);

    const progress = trainer.progressOf(started.line.id);
    expect(progress.attempts).toBe(1);
    expect(progress.cleanRuns).toBe(1);
    expect(progress.streak).toBe(1);
    expect(progress.dueAt).toBeGreaterThan(time.now());
  });

  it('rejects an off-book move without moving the pieces', () => {
    const trainer = new OpeningTrainer({ root: SICILIAN, side: 'black' });
    trainer.startLine(NAJDORF);
    trainer.submit('c5');

    const before = trainer.game.fen();
    // Found rather than hardcoded: with the full ECO tables loaded, most sane
    // second moves are named lines, and which ones are changes as the book grows.
    const played = trainer.game.history();
    const bookHere = new Set(
      trainer.lines
        .filter((l) => played.every((san, i) => l.moves[i] === san))
        .map((l) => l.moves[played.length]),
    );
    const offBook = trainer.game.sanMoves().find((san) => !bookHere.has(san))!;
    expect(offBook, 'every legal move is in the book here?').toBeDefined();

    const outcome = trainer.submit(offBook);
    expect(outcome.status).toBe('off-book');
    if (outcome.status === 'off-book') {
      expect(outcome.expected).toBe('d6');
      expect(outcome.message).toContain('d6');
      expect(outcome.context.name).toContain('Sicilian');
    }
    expect(trainer.game.fen()).toBe(before);
    expect(trainer.mistakesThisRun).toBe(1);

    // The correct move still works afterwards — mistakes are retryable.
    expect(trainer.submit('d6').status).toBe('correct');
  });

  it('follows you into another book line instead of calling it wrong', () => {
    const trainer = new OpeningTrainer({ root: SICILIAN, side: 'black' });
    trainer.startLine(NAJDORF);
    trainer.submit('c5');

    // 2...e6 heads for the Scheveningen/Kan rather than the Najdorf.
    const outcome = trainer.submit('e6');
    expect(outcome.status).toBe('transposition');
    if (outcome.status === 'transposition') {
      expect(outcome.switchedFrom.name).toContain('Najdorf');
      expect(outcome.line.moves[3]).toBe('e6');
    }
  });

  it('refuses illegal moves and moves out of turn', () => {
    const trainer = new OpeningTrainer({ root: SICILIAN, side: 'black' });
    trainer.startLine(NAJDORF);
    expect(trainer.submit('Qh4').status).toBe('illegal');

    const idle = new OpeningTrainer({ root: SICILIAN, side: 'black' });
    expect(idle.submit('c5').status).toBe('not-your-turn');
  });

  it('counts a revealed answer as a mistake', () => {
    const trainer = new OpeningTrainer({ root: SICILIAN, side: 'black' });
    trainer.startLine(NAJDORF);
    expect(trainer.revealAnswer()).toBe('c5');
    expect(trainer.mistakesThisRun).toBe(1);
    expect(trainer.playExpected().status).toBe('correct');
  });

  it('plays the white side when you choose white', () => {
    const trainer = new OpeningTrainer({ root: SICILIAN, side: 'white' });
    const start = trainer.startLine(NAJDORF)!;
    expect(start.reply).toBeUndefined(); // White moves first — that is you
    expect(trainer.expectedSan).toBe('e4');

    const outcome = trainer.submit('e4');
    expect(outcome.status).toBe('correct');
    if (outcome.status === 'correct') expect(outcome.reply).toBe('c5');
  });
});

describe('rotation and spacing', () => {
  it('does not hand you the same line twice in a row', () => {
    const trainer = new OpeningTrainer({ root: SICILIAN, side: 'black' });
    const first = trainer.startLine()!;
    const second = trainer.nextLine()!;
    const third = trainer.nextLine()!;
    expect(second.line.id).not.toBe(first.line.id);
    expect(third.line.id).not.toBe(second.line.id);
  });

  it('works through unseen lines before repeating any', () => {
    const trainer = new OpeningTrainer({ root: SICILIAN, side: 'black' });
    const seen = new Set<string>();
    for (let i = 0; i < trainer.lines.length; i++) {
      const start = trainer.nextLine();
      if (!start) break;
      seen.add(start.line.id);
    }
    expect(seen.size).toBe(trainer.lines.length);
  });

  it('brings a mistaken line back sooner than a clean one', () => {
    const time = clock();
    const clean = recordRun(blankProgress('a', time.now()), { mistakes: 0, now: time.now() });
    const messy = recordRun(blankProgress('b', time.now()), { mistakes: 2, now: time.now() });
    expect(messy.dueAt).toBeLessThan(clean.dueAt);
    expect(messy.streak).toBe(0);
    expect(clean.streak).toBe(1);
  });

  it('stretches the interval as a line is repeated cleanly', () => {
    const time = clock();
    let progress = blankProgress('x', time.now());
    const intervals: number[] = [];
    for (let i = 0; i < 4; i++) {
      progress = recordRun(progress, { mistakes: 0, now: time.now() });
      intervals.push(progress.dueAt - time.now());
      time.advance(progress.dueAt - time.now());
    }
    expect(intervals).toEqual([...intervals].sort((a, b) => a - b));
    expect(progress.mastered).toBe(true);
    expect(progress.streak).toBeGreaterThanOrEqual(MASTERY_STREAK);
  });

  it('prefers the most overdue line once everything has been seen', () => {
    const time = clock();
    const lines = buildRepertoire(SICILIAN).slice(0, 3);
    const progress: ProgressMap = {};
    lines.forEach((line, i) => {
      progress[line.id] = {
        ...blankProgress(line.id, time.now()),
        attempts: 1,
        lastSeenAt: time.now(),
        dueAt: time.now() - (i + 1) * 1000, // the last one is the most overdue
      };
    });
    const picked = chooseLine(lines, progress, { now: time.now() });
    expect(picked?.id).toBe(lines[2]!.id);
  });

  it('reports progress across the repertoire', () => {
    const trainer = new OpeningTrainer({ root: SICILIAN, side: 'black' });
    const before = trainer.summary();
    expect(before.seen).toBe(0);
    expect(before.total).toBe(trainer.lines.length);

    trainer.startLine(NAJDORF);
    playThrough(trainer);

    const after = trainer.summary();
    expect(after.seen).toBe(1);
    expect(after.mistakes).toBe(0);
  });

  it('round-trips progress so a session can be saved and resumed', () => {
    const time = clock();
    const first = new OpeningTrainer({ root: SICILIAN, side: 'black', now: time.now });
    const line = first.startLine(NAJDORF)!.line;
    playThrough(first);

    const saved = JSON.parse(JSON.stringify(first.exportProgress()));
    const resumed = new OpeningTrainer({
      root: SICILIAN,
      side: 'black',
      progress: saved,
      now: time.now,
    });
    expect(resumed.progressOf(line.id).cleanRuns).toBe(1);
    expect(resumed.summary().seen).toBe(1);
  });
});
