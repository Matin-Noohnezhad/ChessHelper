/**
 * Standard Algebraic Notation.
 *
 * SAN is context-sensitive (disambiguation, check marks), so both directions
 * work off the legal move list of the position they are given. Callers that
 * already have that list should pass it in — walking an opening book calls this
 * on every node.
 */

import { KING, PAWN, PIECE_SYMBOLS, pieceType } from './types.js';
import { algebraic, fileOf, rankOf } from './squares.js';
import { Position } from './position.js';
import { generateLegalMoves, hasLegalMoves } from './movegen.js';
import {
  isCapture,
  isCastle,
  isPromotion,
  moveFrom,
  movePromotion,
  moveTo,
  moveToUci,
} from './move.js';
import type { Move } from './move.js';
import {
  FLAG_KING_CASTLE,
  moveFlags,
} from './move.js';

const FILE_CHARS = 'abcdefgh';

export function moveToSan(pos: Position, move: Move, legal?: Move[]): string {
  const from = moveFrom(move);
  const to = moveTo(move);
  const piece = pos.board[from]!;
  const type = pieceType(piece);

  let san: string;
  if (isCastle(move)) {
    san = moveFlags(move) & FLAG_KING_CASTLE ? 'O-O' : 'O-O-O';
  } else if (type === PAWN) {
    san = isCapture(move) ? `${FILE_CHARS[fileOf(from)]}x${algebraic(to)}` : algebraic(to);
    if (isPromotion(move)) san += '=' + PIECE_SYMBOLS[movePromotion(move)]!.toUpperCase();
  } else {
    const moves = legal ?? generateLegalMoves(pos);
    san =
      PIECE_SYMBOLS[type]!.toUpperCase() +
      disambiguate(pos, move, moves) +
      (isCapture(move) ? 'x' : '') +
      algebraic(to);
  }

  pos.make(move);
  if (pos.inCheck()) san += hasLegalMoves(pos) ? '+' : '#';
  pos.unmake();
  return san;
}

function disambiguate(pos: Position, move: Move, legal: Move[]): string {
  const from = moveFrom(move);
  const to = moveTo(move);
  const type = pieceType(pos.board[from]!);
  if (type === KING) return ''; // only ever one king per side

  let ambiguous = false;
  let sameFile = false;
  let sameRank = false;
  for (const other of legal) {
    if (other === move) continue;
    const otherFrom = moveFrom(other);
    if (moveTo(other) !== to) continue;
    if (pieceType(pos.board[otherFrom]!) !== type) continue;
    ambiguous = true;
    if (fileOf(otherFrom) === fileOf(from)) sameFile = true;
    if (rankOf(otherFrom) === rankOf(from)) sameRank = true;
  }
  if (!ambiguous) return '';
  if (!sameFile) return FILE_CHARS[fileOf(from)]!;
  if (!sameRank) return String(rankOf(from) + 1);
  return algebraic(from);
}

/** Strips decoration so `Nf3!?`, `Nf3+` and `Nf3` all compare equal. */
export function normalizeSan(san: string): string {
  return san
    .replace(/[+#?!]+/g, '')
    .replace(/–|—/g, '-')
    .replace(/e\.p\./i, '')
    .replace(/^0-0-0$/i, 'O-O-O')
    .replace(/^0-0$/i, 'O-O')
    .replace(/^O-O-O$/i, 'O-O-O')
    .replace(/^O-O$/i, 'O-O')
    .trim();
}

/**
 * Resolves SAN against the position. Returns `null` when the text is not a
 * legal move here, so callers can report a bad book line instead of crashing.
 */
export function parseSan(pos: Position, san: string, legal?: Move[]): Move | null {
  const moves = legal ?? generateLegalMoves(pos);
  const wanted = normalizeSan(san);
  for (const move of moves) {
    if (normalizeSan(moveToSan(pos, move, moves)) === wanted) return move;
  }
  // Tolerate promotions written without '=' (e8Q) and lazy long algebraic.
  const loose = wanted.replace('=', '');
  for (const move of moves) {
    if (normalizeSan(moveToSan(pos, move, moves)).replace('=', '') === loose) return move;
    if (moveToUci(move) === wanted.toLowerCase()) return move;
  }
  return null;
}

/** Resolves `e2e4` / `e7e8q` against the position. */
export function parseUci(pos: Position, uci: string, legal?: Move[]): Move | null {
  const moves = legal ?? generateLegalMoves(pos);
  const text = uci.trim().toLowerCase();
  for (const move of moves) if (moveToUci(move) === text) return move;
  return null;
}
