/**
 * 0x88 square helpers.
 *
 * The board is a 16x8 mailbox: `square = rank * 16 + file`, with rank 0 = rank 1
 * and file 0 = the a-file. Any square whose `& 0x88` is non-zero is off the board,
 * which makes "did that ray leave the board?" a single test instead of two
 * comparisons. a1 = 0, h1 = 7, a8 = 112, h8 = 119.
 */

export type Square = number;

export const OFF_BOARD = -1;

export const rankOf = (sq: Square): number => sq >> 4;
export const fileOf = (sq: Square): number => sq & 7;
export const isOnBoard = (sq: Square): boolean => (sq & 0x88) === 0;
export const squareAt = (file: number, rank: number): Square => rank * 16 + file;

/** 0x88 index -> 0..63 index, ordered a8..h1 (handy for rendering). */
export const to64 = (sq: Square): number => (7 - rankOf(sq)) * 8 + fileOf(sq);
/** 0..63 index (a8..h1) -> 0x88 index. */
export const from64 = (i: number): Square => (7 - ((i / 8) | 0)) * 16 + (i % 8);

const FILE_CHARS = 'abcdefgh';

export function algebraic(sq: Square): string {
  return FILE_CHARS[fileOf(sq)]! + String(rankOf(sq) + 1);
}

/** Parses `'e4'`; returns {@link OFF_BOARD} if the string is not a square. */
export function parseSquare(name: string): Square {
  if (name.length !== 2) return OFF_BOARD;
  const file = FILE_CHARS.indexOf(name[0]!);
  const rank = name.charCodeAt(1) - 49; // '1'
  if (file < 0 || rank < 0 || rank > 7) return OFF_BOARD;
  return squareAt(file, rank);
}

export const A1 = 0,
  B1 = 1,
  C1 = 2,
  D1 = 3,
  E1 = 4,
  F1 = 5,
  G1 = 6,
  H1 = 7;
export const A8 = 112,
  B8 = 113,
  C8 = 114,
  D8 = 115,
  E8 = 116,
  F8 = 117,
  G8 = 118,
  H8 = 119;

/** Every on-board square, a1 -> h8. */
export const SQUARES: Square[] = (() => {
  const out: Square[] = [];
  for (let sq = 0; sq <= H8; sq++) if (isOnBoard(sq)) out.push(sq);
  return out;
})();
