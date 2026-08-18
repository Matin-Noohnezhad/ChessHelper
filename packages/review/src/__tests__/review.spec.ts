import { describe, expect, it } from 'vitest';
import { ReviewAbortedError, keyMoments, reviewPgn } from '../review.js';
import { materialEvaluator } from './fake-engine.js';

const evaluator = materialEvaluator();

const SCHOLARS_MATE = `[Event "Club night"]
[White "Alice"]
[Black "Bob"]
[WhiteElo "1520"]
[BlackElo "1480"]
[Result "1-0"]

1. e4 e5 2. Bc4 Bc5 3. Qh5 Nf6 4. Qxf7# 1-0`;

describe('reviewing a game', () => {
  it('reviews every move and names the players', async () => {
    const review = await reviewPgn(SCHOLARS_MATE, { evaluator });

    expect(review.moves).toHaveLength(7);
    expect(review.result).toBe('1-0');
    expect(review.white.name).toBe('Alice');
    expect(review.black.elo).toBe(1480);
    expect(review.white.moves).toBe(4);
    expect(review.black.moves).toBe(3);
  });

  it('marks the opening moves as theory and names the line', async () => {
    const review = await reviewPgn(SCHOLARS_MATE, { evaluator });
    expect(review.moves[0]!.quality).toBe('book');
    expect(review.moves[0]!.openingName).toBeTruthy();
    expect(review.opening?.eco).toMatch(/^C/);
  });

  it('catches the move that allowed mate', async () => {
    const review = await reviewPgn(SCHOLARS_MATE, { evaluator });
    const blunder = review.moves[5]!;

    expect(blunder.san).toBe('Nf6');
    expect(blunder.color).toBe('b');
    expect(blunder.quality).toBe('blunder');
    expect(blunder.winAfter).toBe(0);
    expect(blunder.accuracy).toBeLessThan(30);
    expect(blunder.explanation).toContain('Blunder');
    expect(review.black.counts.blunder).toBe(1);
  });

  it('scores the side that did not get mated higher', async () => {
    const review = await reviewPgn(SCHOLARS_MATE, { evaluator });
    expect(review.white.accuracy!).toBeGreaterThan(review.black.accuracy!);
    expect(review.white.accuracy!).toBeLessThanOrEqual(100);
    expect(review.black.averageCentipawnLoss!).toBeGreaterThan(review.white.averageCentipawnLoss!);
  });

  it('sees the mate on the board in the final position', async () => {
    const review = await reviewPgn(SCHOLARS_MATE, { evaluator });
    const mate = review.moves[6]!;
    expect(mate.san).toBe('Qxf7#');
    expect(mate.scoreAfter.mate).toBe(1);
    expect(mate.quality).toBe('best');
  });

  it('puts a short game entirely in the opening', async () => {
    const review = await reviewPgn(SCHOLARS_MATE, { evaluator });
    expect(review.moves.every((move) => move.phase === 'opening')).toBe(true);
    expect(review.white.phases.opening.moves).toBe(4);
    expect(review.white.phases.middlegame.moves).toBe(0);
    expect(review.white.phases.middlegame.accuracy).toBeNull();
  });

  it('lists the blunder among the key moments', async () => {
    const review = await reviewPgn(SCHOLARS_MATE, { evaluator });
    const moments = keyMoments(review);
    expect(moments[0]!.san).toBe('Nf6');
  });

  it('reports progress once per position, including the final one', async () => {
    const seen: number[] = [];
    const review = await reviewPgn(SCHOLARS_MATE, {
      evaluator,
      onProgress: (done, total) => {
        seen.push(done);
        expect(total).toBe(8);
      },
    });
    expect(seen).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(review.depth).toBeGreaterThan(0);
  });
});

describe('clock-annotated games', () => {
  const WITH_CLOCKS = `[Event "Rated blitz"]
[TimeControl "180+2"]
[Result "*"]

1. e4 {[%clk 0:02:58]} e5 {[%clk 0:02:55]} 2. Bc4 {[%clk 0:02:50]} Bc5 {[%clk 0:02:20]} *`;

  it('turns clocks into time spent per move', async () => {
    const review = await reviewPgn(WITH_CLOCKS, { evaluator });
    // 180s start, 2s increment: 180 + 2 - 178 = 4 seconds on the first move.
    expect(review.moves[0]!.secondsSpent).toBeCloseTo(4, 5);
    expect(review.moves[1]!.secondsSpent).toBeCloseTo(7, 5);
    expect(review.moves[3]!.secondsSpent).toBeCloseTo(37, 5);
    expect(review.moves[3]!.clockSeconds).toBe(140);
  });

  it('summarises each side’s clock usage', async () => {
    const review = await reviewPgn(WITH_CLOCKS, { evaluator });
    const black = review.black.time!;
    expect(black.initialSeconds).toBe(180);
    expect(black.incrementSeconds).toBe(2);
    expect(black.slowest!.san).toBe('Bc5');
    expect(black.averageSeconds).toBeCloseTo(22, 5);
    expect(review.white.time!.medianSeconds).toBeCloseTo(7, 5);
    expect(review.white.time!.hastyMoves).toBe(0);
  });

  it('leaves the time report empty for a game without clocks', async () => {
    const review = await reviewPgn(SCHOLARS_MATE, { evaluator });
    expect(review.white.time).toBeNull();
    expect(review.moves[0]!.secondsSpent).toBeNull();
  });
});

describe('awkward input', () => {
  it('reviews what it can and says where the PGN stopped making sense', async () => {
    const review = await reviewPgn('1. e4 e5 2. Nf6 Nc6 *', { evaluator });
    expect(review.moves).toHaveLength(2);
    expect(review.truncated).toContain('Nf6');
  });

  it('refuses a PGN with nothing playable in it', async () => {
    await expect(reviewPgn('[Event "Empty"]\n\n*', { evaluator })).rejects.toThrow(/no legal moves/);
  });

  it('stops when the caller cancels', async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(
      reviewPgn(SCHOLARS_MATE, { evaluator, signal: controller.signal }),
    ).rejects.toBeInstanceOf(ReviewAbortedError);
  });

  it('starts from a [FEN] header and treats a bare ending as an endgame throughout', async () => {
    const study = `[SetUp "1"]
[FEN "8/5k2/8/8/8/4K3/4P3/8 w - - 0 1"]

1. Kd4 Ke6 2. e4 Kd6 *`;
    const review = await reviewPgn(study, { evaluator });
    expect(review.moves).toHaveLength(4);
    expect(review.moves.every((move) => move.phase === 'endgame')).toBe(true);
    expect(review.bounds.endgameStartPly).toBe(1);
  });
});
