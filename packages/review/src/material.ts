/**
 * Material questions the classifier needs: what a move invests, and how much
 * is left on the board.
 *
 * Both are answered by replaying moves through the rules engine rather than by
 * pattern matching, so pins, overloaded defenders and illegal king recaptures
 * fall out of legal move generation for free.
 */

import { Chess } from '@coh/chess-core';
import type { PieceSymbol } from '@coh/chess-core';

export const PIECE_VALUE: Record<PieceSymbol, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20_000,
};

/**
 * Static exchange evaluation on one square: what the side to move wins by
 * starting a capture sequence there, always taking with the cheapest attacker
 * and stopping as soon as continuing would lose material.
 */
export function staticExchange(game: Chess, square: string): number {
  const captures = game.legalMoves().filter((move) => move.to === square && move.isCapture);
  if (!captures.length) return 0;

  captures.sort((a, b) => PIECE_VALUE[a.piece] - PIECE_VALUE[b.piece]);
  const capture = captures[0]!;
  const gained =
    PIECE_VALUE[capture.captured ?? 'p'] +
    (capture.promotion ? PIECE_VALUE[capture.promotion] - PIECE_VALUE.p : 0);

  const next = game.clone();
  if (!next.move(capture.uci)) return 0;
  // Taking is optional, so a sequence that would lose material simply is not played.
  return Math.max(0, gained - staticExchange(next, square));
}

/**
 * Material the move puts at risk, in centipawns — positive means the mover gave
 * something up. Compares what the move wins outright against what the opponent
 * can win back on the square the piece landed on, which covers both the "leaves
 * a piece en prise" and the "captures into a losing exchange" shapes of a
 * sacrifice. A deflection that hangs a piece somewhere else is not detected.
 */
export function materialInvested(fenBefore: string, uci: string): number {
  const game = new Chess(fenBefore);
  const info = game.move(uci);
  if (!info) return 0;

  const won = info.captured ? PIECE_VALUE[info.captured] : 0;
  const promoted = info.promotion ? PIECE_VALUE[info.promotion] - PIECE_VALUE.p : 0;
  const recovered = staticExchange(game, info.to);
  return recovered - won - promoted;
}

/** Total non-pawn, non-king material on the board, both sides, in centipawns. */
export function nonPawnMaterial(game: Chess): number {
  let total = 0;
  for (const square of game.board()) {
    if (!square || square.type === 'p' || square.type === 'k') continue;
    total += PIECE_VALUE[square.type];
  }
  return total;
}
