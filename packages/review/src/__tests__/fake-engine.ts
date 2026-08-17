/**
 * A two-ply material engine, so the review pipeline can be tested end to end
 * without Stockfish. It is strong enough for the only thing the tests ask of
 * it: noticing that a piece hangs, and seeing mate on the board.
 */

import { Chess } from '@coh/chess-core';
import { PIECE_VALUE } from '../material.js';
import type { EvaluatedPosition, PositionEvaluator, Score } from '../types.js';

const MATE = 100_000;

function material(game: Chess): number {
  let total = 0;
  for (const square of game.board()) {
    if (!square || square.type === 'k') continue;
    total += square.color === 'w' ? PIECE_VALUE[square.type] : -PIECE_VALUE[square.type];
  }
  return total;
}

/** Negamax in White's units: White maximises, Black minimises. */
function search(game: Chess, depth: number): number {
  if (game.isCheckmate()) return game.turn() === 'w' ? -MATE : MATE;
  if (game.isDraw()) return 0;
  if (depth === 0) return material(game);

  const white = game.turn() === 'w';
  let best = white ? -Infinity : Infinity;
  for (const move of game.legalMoves()) {
    const next = game.clone();
    next.move(move.uci);
    const value = search(next, depth - 1);
    best = white ? Math.max(best, value) : Math.min(best, value);
  }
  return best;
}

function toScore(value: number): Score {
  if (Math.abs(value) >= MATE) return { cp: null, mate: value > 0 ? 1 : -1 };
  return { cp: value, mate: null };
}

export function materialEvaluator(depth = 2, multipv = 4): PositionEvaluator {
  // Cached across calls: the specs review the same games repeatedly, and a
  // brute-force search is slow enough for that to matter.
  const cache = new Map<string, EvaluatedPosition>();

  return async (fen: string): Promise<EvaluatedPosition> => {
    const hit = cache.get(fen);
    if (hit) return hit;

    const game = new Chess(fen);
    const scored = game.legalMoves().map((move) => {
      const next = game.clone();
      next.move(move.uci);
      return { uci: move.uci, san: move.san, value: search(next, depth - 1) };
    });

    const white = game.turn() === 'w';
    scored.sort((a, b) => (white ? b.value - a.value : a.value - b.value));

    const evaluation: EvaluatedPosition = {
      fen,
      depth,
      candidates: scored.slice(0, multipv).map((entry) => ({
        uci: entry.uci,
        san: entry.san,
        score: toScore(entry.value),
      })),
    };
    cache.set(fen, evaluation);
    return evaluation;
  };
}
