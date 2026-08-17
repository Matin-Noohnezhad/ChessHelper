/** FEN parsing and serialisation. */

import {
  BLACK,
  CASTLE_BK,
  CASTLE_BQ,
  CASTLE_WK,
  CASTLE_WQ,
  EMPTY,
  WHITE,
  charToPiece,
  pieceToChar,
} from './types.js';
import { Position } from './position.js';
import { algebraic, parseSquare, squareAt } from './squares.js';

export const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export class FenError extends Error {}

export function parseFen(fen: string): Position {
  const pos = new Position();
  loadFen(pos, fen);
  return pos;
}

export function loadFen(pos: Position, fen: string): void {
  const parts = fen.trim().split(/\s+/);
  if (parts.length < 4) throw new FenError(`FEN needs at least 4 fields: "${fen}"`);
  const [placement, side, castling, ep] = parts as [string, string, string, string];

  pos.clear();

  const rows = placement.split('/');
  if (rows.length !== 8) throw new FenError(`FEN board must have 8 ranks: "${placement}"`);
  for (let i = 0; i < 8; i++) {
    const rank = 7 - i; // FEN starts at rank 8
    let file = 0;
    for (const ch of rows[i]!) {
      if (ch >= '1' && ch <= '8') {
        file += ch.charCodeAt(0) - 48;
        continue;
      }
      const piece = charToPiece(ch);
      if (piece === EMPTY) throw new FenError(`Unknown piece "${ch}" in FEN`);
      if (file > 7) throw new FenError(`Rank ${rank + 1} overflows in FEN`);
      pos.put(squareAt(file, rank), piece);
      file++;
    }
    if (file !== 8) throw new FenError(`Rank ${rank + 1} does not describe 8 squares`);
  }

  pos.turn = side === 'b' ? BLACK : WHITE;

  if (castling !== '-') {
    for (const ch of castling) {
      if (ch === 'K') pos.castling |= CASTLE_WK;
      else if (ch === 'Q') pos.castling |= CASTLE_WQ;
      else if (ch === 'k') pos.castling |= CASTLE_BK;
      else if (ch === 'q') pos.castling |= CASTLE_BQ;
    }
  }

  pos.ep = ep === '-' ? -1 : parseSquare(ep);
  pos.halfmoves = parts[4] ? parseInt(parts[4], 10) || 0 : 0;
  pos.fullmoves = parts[5] ? parseInt(parts[5], 10) || 1 : 1;

  pos.computeHash();
}

export function toFen(pos: Position): string {
  let placement = '';
  for (let rank = 7; rank >= 0; rank--) {
    let empty = 0;
    for (let file = 0; file < 8; file++) {
      const piece = pos.board[squareAt(file, rank)]!;
      if (piece === EMPTY) {
        empty++;
        continue;
      }
      if (empty) {
        placement += empty;
        empty = 0;
      }
      placement += pieceToChar(piece);
    }
    if (empty) placement += empty;
    if (rank > 0) placement += '/';
  }

  let castling = '';
  if (pos.castling & CASTLE_WK) castling += 'K';
  if (pos.castling & CASTLE_WQ) castling += 'Q';
  if (pos.castling & CASTLE_BK) castling += 'k';
  if (pos.castling & CASTLE_BQ) castling += 'q';

  return [
    placement,
    pos.turn === WHITE ? 'w' : 'b',
    castling || '-',
    pos.ep >= 0 ? algebraic(pos.ep) : '-',
    pos.halfmoves,
    pos.fullmoves,
  ].join(' ');
}
