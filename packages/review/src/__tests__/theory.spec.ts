import { describe, expect, it } from 'vitest';
import { Chess } from '@coh/chess-core';
import { bookPlies } from '../phases.js';
import { reviewPgn, keyMoments } from '../review.js';
import type { PositionEvaluator } from '../types.js';

const MARSHALL = 'e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 O-O c3 d5 exd5 Nxd5 Nxe5 Nxe5 Rxe5 c6 d3 Bd6 Re1 Bf5 Qf3 Qh4 g3 Qh3 Nd2 Rae8 Ne4 Bg4 Qg2 Qxg2+ Kxg2 f5 Bf4 Bxf4 gxf4 fxe4 dxe4 Bf3+ Kxf3 Rxf4+ Kg3 Rfxe4 Rxe4 Rxe4';
const evaluator: PositionEvaluator = async (fen, ply) => ({
  fen, depth: 12,
  // Deliberate swings: book classification must win even over engine disagreement.
  candidates: new Chess(fen).legalMoves().slice(0, 2).map((move) => ({
    uci: move.uci, san: move.san, score: { cp: ply % 2 ? -350 : 350, mate: null },
  })),
});

describe('theory classification and totals', () => {
  it('reports the searched depth even when the game ends in an unsearched mate', async () => {
    const review = await reviewPgn('f3 e5 g4 Qh4#', {
      evaluator: async (fen, ply) => {
        const position = await evaluator(fen, ply);
        return { ...position, depth: position.candidates.length ? 12 : 0 };
      },
    });
    expect(review.depth).toBe(12);
  });

  it('counts a full 25-move book line only as Theory for each side and phase', async () => {
    const review = await reviewPgn(MARSHALL, { evaluator });
    expect(review.moves).toHaveLength(50);
    expect(bookPlies(MARSHALL.split(' '))).toBe(50);
    expect(review.moves.every((move) => move.quality === 'book')).toBe(true);
    expect(review.moves[41]!.openingName).toContain('Marshall');
    for (const side of [review.white, review.black]) {
      expect(side.counts.book).toBe(25);
      expect(Object.values(side.counts).reduce((a, b) => a + b, 0)).toBe(side.moves);
      expect(Object.entries(side.counts).filter(([key]) => key !== 'book').every(([, n]) => n === 0)).toBe(true);
      for (const phase of Object.values(side.phases)) {
        expect(phase.counts.book).toBe(phase.moves);
      }
    }
    expect(keyMoments(review)).toEqual([]);
  });

  it('recognizes book moves from a FEN beyond move 21 with correct side numbering', async () => {
    const board = new Chess();
    const moves = MARSHALL.split(' ');
    for (const san of moves.slice(0, 41)) board.move(san);
    const review = await reviewPgn(`[SetUp "1"]\n[FEN "${board.fen()}"]\n\n${moves.slice(41).join(' ')}`, { evaluator });
    expect(review.moves[0]!.moveNumber).toBe(21);
    expect(review.moves[0]!.color).toBe('b');
    expect(review.white.counts.book).toBe(4);
    expect(review.black.counts.book).toBe(5);
    expect(review.moves.every((move) => move.quality === 'book')).toBe(true);
  });

  it('does not relabel unknown moves on a return to book', async () => {
    const review = await reviewPgn('Nf3 Nf6 Ng1 Ng8 e4 e5', { evaluator });
    expect(review.moves.slice(2, 4).every((move) => move.quality !== 'book')).toBe(true);
    expect(review.moves.slice(4).every((move) => move.quality === 'book')).toBe(true);
    expect(review.white.counts.book).toBe(2);
    expect(review.black.counts.book).toBe(2);
  });
});
