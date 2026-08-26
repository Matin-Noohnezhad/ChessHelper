import { describe, expect, it } from 'vitest';
import { Chess } from '@coh/chess-core';
import { QUALITY_ORDER } from '../classify.js';
import { ReviewAbortedError, keyMoments, reviewPgn } from '../review.js';
import type { PositionEvaluator } from '../types.js';
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

  /**
   * A bishop thrown at h7 and, two plies later, a queen dropped on h5 where the
   * knight on f6 simply takes it. Both moves invest material — the difference
   * between them is whether the position survives, which is the whole of the
   * sacrifice rule. The evaluations are scripted rather than searched: a
   * two-ply material engine has no notion of compensation, so it could never
   * call any sacrifice sound.
   */
  const GREEK_GIFT =
    '1. d4 d5 2. Nf3 Nf6 3. e3 e6 4. Bd3 Be7 5. Nbd2 O-O 6. Ne5 c5 7. Bxh7+ Kxh7 8. Qh5+ Kg8 *';

  /** Every position is worth `cps[ply]` to White, whatever is standing on it. */
  const scripted = (cps: Record<number, number>): PositionEvaluator => async (fen, ply) => {
    const game = new Chess(fen);
    const cp = cps[ply] ?? 30;
    return {
      fen,
      depth: 12,
      candidates: game.legalMoves().slice(0, 3).map((move) => ({
        uci: move.uci,
        san: move.san,
        score: { cp, mate: null },
        pv: [move.san],
      })),
    };
  };

  it('calls a sacrifice the sacrifice it is, and counts it', async () => {
    const review = await reviewPgn(GREEK_GIFT, { evaluator: scripted({ 15: -800, 16: -800 }) });
    const bishop = review.moves[12]!;

    expect(bishop.san).toBe('Bxh7+');
    // A bishop for the h-pawn, measured by static exchange, not by guesswork.
    expect(bishop.investedCp).toBe(230);
    expect(bishop.quality).toBe('sacrifice');
    expect(bishop.explanation).toContain('sacrifice');
    expect(review.white.counts.sacrifice).toBe(1);
  });

  it('will not call a piece dropped for nothing a sacrifice', async () => {
    const review = await reviewPgn(GREEK_GIFT, { evaluator: scripted({ 15: -800, 16: -800 }) });
    const queen = review.moves[14]!;

    // Nxh5 is available, so the queen really is being given away — but the
    // position falls out of the band it was in, and that is a blunder.
    expect(queen.san).toBe('Qh5+');
    expect(queen.investedCp).toBeGreaterThan(0);
    expect(queen.quality).toBe('blunder');
    expect(queen.tags).toContain('sacrifice');
  });

  it('holds the label when a winning position stays winning', async () => {
    // The same bishop, thrown from +7 and landing on +2: still a sacrifice.
    const review = await reviewPgn(GREEK_GIFT, {
      evaluator: scripted({ 12: 700, 13: 200, 14: 200, 15: -800, 16: -800 }),
    });
    expect(review.moves[12]!.quality).toBe('sacrifice');
  });

  it('does not call shedding material in a lost position a sacrifice', async () => {
    const review = await reviewPgn(GREEK_GIFT, {
      evaluator: scripted({ 12: -700, 13: -700, 14: -700, 15: -900, 16: -900 }),
    });
    const bishop = review.moves[12]!;
    expect(bishop.quality).not.toBe('sacrifice');
    expect(bishop.tags).toContain('sacrifice');
  });

  it('lists every category in the counts, scored or not', async () => {
    const review = await reviewPgn(SCHOLARS_MATE, { evaluator });
    // The report carries a number for each label rather than only the ones that
    // happened, so the summary table can be read the same way every game.
    expect(Object.keys(review.white.counts).sort()).toEqual(
      [...QUALITY_ORDER].sort(),
    );
    expect(review.white.counts.sacrifice).toBe(0);
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
