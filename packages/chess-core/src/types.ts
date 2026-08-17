/**
 * Core value types.
 *
 * A piece is packed into one small integer: `type | color << 3`.
 * That keeps the board an Int8Array and makes colour/type checks single ops,
 * which is what the search in @coh/engine will want later on.
 */

export type Color = 0 | 1;
export const WHITE = 0 as Color;
export const BLACK = 1 as Color;

export type PieceType = 1 | 2 | 3 | 4 | 5 | 6;
export const PAWN = 1 as PieceType;
export const KNIGHT = 2 as PieceType;
export const BISHOP = 3 as PieceType;
export const ROOK = 4 as PieceType;
export const QUEEN = 5 as PieceType;
export const KING = 6 as PieceType;

/** 0 means "empty square"; otherwise `type | color << 3`. */
export type Piece = number;
export const EMPTY = 0;

export const makePiece = (type: PieceType, color: Color): Piece => type | (color << 3);
export const pieceType = (p: Piece): PieceType => (p & 7) as PieceType;
export const pieceColor = (p: Piece): Color => ((p >> 3) & 1) as Color;
export const other = (c: Color): Color => (c ^ 1) as Color;

/** Castling rights bitmask. */
export const CASTLE_WK = 1;
export const CASTLE_WQ = 2;
export const CASTLE_BK = 4;
export const CASTLE_BQ = 8;

export const PIECE_SYMBOLS = '.pnbrqk';

/** `'P'`, `'n'`, … for FEN/SAN. Returns `'.'` for an empty square. */
export function pieceToChar(p: Piece): string {
  if (p === EMPTY) return '.';
  const ch = PIECE_SYMBOLS[pieceType(p)]!;
  return pieceColor(p) === WHITE ? ch.toUpperCase() : ch;
}

/** Inverse of {@link pieceToChar}; returns `EMPTY` for anything unrecognised. */
export function charToPiece(ch: string): Piece {
  const lower = ch.toLowerCase();
  const type = PIECE_SYMBOLS.indexOf(lower);
  if (type <= 0) return EMPTY;
  return makePiece(type as PieceType, ch === lower ? BLACK : WHITE);
}
