/**
 * Moves are packed into one 32-bit integer so that move lists are plain
 * number arrays (no allocation per move in the future search).
 *
 *   bits  0-7   from square (0x88)
 *   bits  8-15  to square (0x88)
 *   bits 16-21  flags
 *   bits 22-24  promotion piece type
 *   bits 25-28  captured piece (0 when nothing was captured)
 */

import type { Piece, PieceType } from './types.js';
import type { Square } from './squares.js';
import { algebraic } from './squares.js';
import { PIECE_SYMBOLS } from './types.js';

export type Move = number;

export const FLAG_QUIET = 0;
export const FLAG_CAPTURE = 1;
export const FLAG_EP = 2;
export const FLAG_DOUBLE_PUSH = 4;
export const FLAG_PROMOTION = 8;
export const FLAG_KING_CASTLE = 16;
export const FLAG_QUEEN_CASTLE = 32;
export const FLAG_CASTLE = FLAG_KING_CASTLE | FLAG_QUEEN_CASTLE;

export function encodeMove(
  from: Square,
  to: Square,
  flags: number,
  captured: Piece = 0,
  promotion = 0,
): Move {
  return from | (to << 8) | (flags << 16) | (promotion << 22) | (captured << 25);
}

export const moveFrom = (m: Move): Square => m & 0xff;
export const moveTo = (m: Move): Square => (m >> 8) & 0xff;
export const moveFlags = (m: Move): number => (m >> 16) & 0x3f;
export const movePromotion = (m: Move): PieceType => ((m >> 22) & 7) as PieceType;
export const moveCaptured = (m: Move): Piece => (m >> 25) & 0xf;

export const isCapture = (m: Move): boolean => (m & (FLAG_CAPTURE << 16)) !== 0;
export const isEnPassant = (m: Move): boolean => (m & (FLAG_EP << 16)) !== 0;
export const isPromotion = (m: Move): boolean => (m & (FLAG_PROMOTION << 16)) !== 0;
export const isCastle = (m: Move): boolean => (m & (FLAG_CASTLE << 16)) !== 0;

export const NO_MOVE = 0;

/**
 * Long algebraic / UCI form, e.g. `e2e4`, `e7e8q`. This is the wire format we
 * use between packages (and eventually to talk to any UCI engine).
 */
export function moveToUci(m: Move): string {
  const promo = isPromotion(m) ? PIECE_SYMBOLS[movePromotion(m)] : '';
  return algebraic(moveFrom(m)) + algebraic(moveTo(m)) + promo;
}
