/**
 * Move generation.
 *
 * Generation is pseudo-legal (it ignores pins and moving into check); legality
 * is settled by making the move and asking whether our king is attacked. That
 * costs a little speed and buys a lot of certainty — and make/unmake is already
 * the operation the engine will lean on hardest.
 */

import {
  BISHOP,
  CASTLE_BK,
  CASTLE_BQ,
  CASTLE_WK,
  CASTLE_WQ,
  EMPTY,
  KING,
  KNIGHT,
  PAWN,
  QUEEN,
  ROOK,
  WHITE,
  other,
  pieceColor,
  pieceType,
} from './types.js';
import type { PieceType } from './types.js';
import { SQUARES, isOnBoard, rankOf } from './squares.js';
import type { Square } from './squares.js';
import {
  BISHOP_OFFSETS,
  KING_OFFSETS,
  KNIGHT_OFFSETS,
  Position,
  ROOK_OFFSETS,
} from './position.js';
import {
  FLAG_CAPTURE,
  FLAG_DOUBLE_PUSH,
  FLAG_EP,
  FLAG_KING_CASTLE,
  FLAG_PROMOTION,
  FLAG_QUEEN_CASTLE,
  FLAG_QUIET,
  encodeMove,
} from './move.js';
import type { Move } from './move.js';

export const PROMOTION_PIECES: PieceType[] = [QUEEN, ROOK, BISHOP, KNIGHT];

const SLIDER_OFFSETS: Record<number, readonly number[]> = {
  [BISHOP]: BISHOP_OFFSETS,
  [ROOK]: ROOK_OFFSETS,
  [QUEEN]: KING_OFFSETS,
};

/** Appends pseudo-legal moves for the side to move onto `out`. */
export function generatePseudoLegal(pos: Position, out: Move[], capturesOnly = false): Move[] {
  const board = pos.board;
  const us = pos.turn;
  const them = other(us);

  for (const from of SQUARES) {
    const piece = board[from]!;
    if (piece === EMPTY || pieceColor(piece) !== us) continue;
    const type = pieceType(piece);

    if (type === PAWN) {
      genPawn(pos, from, out, capturesOnly);
      continue;
    }

    if (type === KNIGHT || type === KING) {
      const offsets = type === KNIGHT ? KNIGHT_OFFSETS : KING_OFFSETS;
      for (const off of offsets) {
        const to = from + off;
        if (!isOnBoard(to)) continue;
        const target = board[to]!;
        if (target === EMPTY) {
          if (!capturesOnly) out.push(encodeMove(from, to, FLAG_QUIET));
        } else if (pieceColor(target) === them) {
          out.push(encodeMove(from, to, FLAG_CAPTURE, target));
        }
      }
      continue;
    }

    for (const off of SLIDER_OFFSETS[type]!) {
      for (let to = from + off; isOnBoard(to); to += off) {
        const target = board[to]!;
        if (target === EMPTY) {
          if (!capturesOnly) out.push(encodeMove(from, to, FLAG_QUIET));
          continue;
        }
        if (pieceColor(target) === them) out.push(encodeMove(from, to, FLAG_CAPTURE, target));
        break;
      }
    }
  }

  if (!capturesOnly) genCastles(pos, out);
  return out;
}

function genPawn(pos: Position, from: Square, out: Move[], capturesOnly: boolean): void {
  const board = pos.board;
  const us = pos.turn;
  const them = other(us);
  const up = us === WHITE ? 16 : -16;
  const startRank = us === WHITE ? 1 : 6;
  const lastRank = us === WHITE ? 7 : 0;

  const one = from + up;
  if (!capturesOnly && isOnBoard(one) && board[one] === EMPTY) {
    if (rankOf(one) === lastRank) {
      for (const promo of PROMOTION_PIECES) {
        out.push(encodeMove(from, one, FLAG_PROMOTION, EMPTY, promo));
      }
    } else {
      out.push(encodeMove(from, one, FLAG_QUIET));
      const two = from + up * 2;
      if (rankOf(from) === startRank && board[two] === EMPTY) {
        out.push(encodeMove(from, two, FLAG_DOUBLE_PUSH));
      }
    }
  }

  for (const side of [-1, 1]) {
    const to = one + side;
    if (!isOnBoard(to)) continue;
    const target = board[to]!;
    if (target !== EMPTY && pieceColor(target) === them) {
      if (rankOf(to) === lastRank) {
        for (const promo of PROMOTION_PIECES) {
          out.push(encodeMove(from, to, FLAG_PROMOTION | FLAG_CAPTURE, target, promo));
        }
      } else {
        out.push(encodeMove(from, to, FLAG_CAPTURE, target));
      }
    } else if (target === EMPTY && to === pos.ep) {
      out.push(encodeMove(from, to, FLAG_EP | FLAG_CAPTURE));
    }
  }
}

function genCastles(pos: Position, out: Move[]): void {
  const board = pos.board;
  const us = pos.turn;
  const them = other(us);
  const king = pos.kings[us];
  if (king < 0) return;
  const home = us === WHITE ? 4 : 116; // e1 / e8
  if (king !== home) return;
  // A king in check can't castle; the other two squares are checked per side.
  if (pos.isSquareAttacked(king, them)) return;

  const kingSide = us === WHITE ? CASTLE_WK : CASTLE_BK;
  const queenSide = us === WHITE ? CASTLE_WQ : CASTLE_BQ;

  if (
    pos.castling & kingSide &&
    board[home + 1] === EMPTY &&
    board[home + 2] === EMPTY &&
    !pos.isSquareAttacked(home + 1, them) &&
    !pos.isSquareAttacked(home + 2, them)
  ) {
    out.push(encodeMove(home, home + 2, FLAG_KING_CASTLE));
  }

  if (
    pos.castling & queenSide &&
    board[home - 1] === EMPTY &&
    board[home - 2] === EMPTY &&
    board[home - 3] === EMPTY &&
    !pos.isSquareAttacked(home - 1, them) &&
    !pos.isSquareAttacked(home - 2, them)
  ) {
    out.push(encodeMove(home, home - 2, FLAG_QUEEN_CASTLE));
  }
}

/** Every fully legal move for the side to move. */
export function generateLegalMoves(pos: Position, capturesOnly = false): Move[] {
  const pseudo: Move[] = [];
  generatePseudoLegal(pos, pseudo, capturesOnly);
  const legal: Move[] = [];
  const us = pos.turn;
  for (const move of pseudo) {
    pos.make(move);
    if (!pos.isKingAttacked(us)) legal.push(move);
    pos.unmake();
  }
  return legal;
}

export function hasLegalMoves(pos: Position): boolean {
  const pseudo: Move[] = [];
  generatePseudoLegal(pos, pseudo);
  const us = pos.turn;
  for (const move of pseudo) {
    pos.make(move);
    const ok = !pos.isKingAttacked(us);
    pos.unmake();
    if (ok) return true;
  }
  return false;
}
