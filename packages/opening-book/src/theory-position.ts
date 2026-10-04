import { Chess } from '@coh/chess-core';

/** Same legal position across move orders; clocks never determine book membership. */
export function theoryPositionKey(fen: string): string {
  const fields = fen.split(' ').slice(0, 4);
  // FEN writers disagree about non-capturable en-passant targets. Preserve it
  // only when it changes the legal moves (including the pinned-pawn case).
  if (fields[3] !== '-' && !new Chess(fen).legalMoves().some((move) => move.isEnPassant)) {
    fields[3] = '-';
  }
  return fields.join(' ');
}
