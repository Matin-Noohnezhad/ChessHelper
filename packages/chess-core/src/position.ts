/**
 * The mutable board state, plus make/unmake.
 *
 * Everything above this file (move generation, SAN, the trainer, the future
 * engine) works by making a move, looking, and taking it back — so make/unmake
 * has to restore state *exactly*, including the Zobrist hash and the halfmove
 * clock. That invariant is what the perft tests are really checking.
 */

import {
  BISHOP,
  BLACK,
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
  makePiece,
  other,
  pieceColor,
  pieceType,
} from './types.js';
import type { Color, Piece } from './types.js';
import {
  A1,
  A8,
  E1,
  E8,
  H1,
  H8,
  SQUARES,
  isOnBoard,
} from './squares.js';
import type { Square } from './squares.js';
import {
  FLAG_DOUBLE_PUSH,
  FLAG_EP,
  FLAG_KING_CASTLE,
  FLAG_PROMOTION,
  FLAG_QUEEN_CASTLE,
  moveCaptured,
  moveFlags,
  moveFrom,
  movePromotion,
  moveTo,
} from './move.js';
import type { Move } from './move.js';
import {
  Z_CASTLING_HI,
  Z_CASTLING_LO,
  Z_EP_HI,
  Z_EP_LO,
  Z_PIECE_HI,
  Z_PIECE_LO,
  Z_SIDE_HI,
  Z_SIDE_LO,
  hashKey,
} from './zobrist.js';

export const KNIGHT_OFFSETS = [-33, -31, -18, -14, 14, 18, 31, 33] as const;
export const BISHOP_OFFSETS = [-17, -15, 15, 17] as const;
export const ROOK_OFFSETS = [-16, -1, 1, 16] as const;
export const KING_OFFSETS = [-17, -16, -15, -1, 1, 15, 16, 17] as const;

/**
 * ANDed into the castling rights whenever a square is vacated or landed on.
 * Covers king moves, rook moves, and rooks being captured on their home square
 * in one table lookup.
 */
const CASTLE_MASK = (() => {
  const m = new Int8Array(128).fill(15);
  m[A1] = 15 & ~CASTLE_WQ;
  m[E1] = 15 & ~(CASTLE_WK | CASTLE_WQ);
  m[H1] = 15 & ~CASTLE_WK;
  m[A8] = 15 & ~CASTLE_BQ;
  m[E8] = 15 & ~(CASTLE_BK | CASTLE_BQ);
  m[H8] = 15 & ~CASTLE_BK;
  return m;
})();

interface Undo {
  move: Move;
  castling: number;
  ep: Square;
  halfmoves: number;
  hashLo: number;
  hashHi: number;
}

export class Position {
  readonly board = new Int8Array(128);
  turn: Color = WHITE;
  castling = 0;
  /** Target square a pawn could capture on, or -1. */
  ep: Square = -1;
  halfmoves = 0;
  fullmoves = 1;
  /** King square per colour, kept current so check tests are O(1) to start. */
  readonly kings: [Square, Square] = [-1, -1];
  hashLo = 0;
  hashHi = 0;

  readonly history: Undo[] = [];

  clear(): void {
    this.board.fill(EMPTY);
    this.turn = WHITE;
    this.castling = 0;
    this.ep = -1;
    this.halfmoves = 0;
    this.fullmoves = 1;
    this.kings[0] = -1;
    this.kings[1] = -1;
    this.hashLo = 0;
    this.hashHi = 0;
    this.history.length = 0;
  }

  clone(): Position {
    const p = new Position();
    p.board.set(this.board);
    p.turn = this.turn;
    p.castling = this.castling;
    p.ep = this.ep;
    p.halfmoves = this.halfmoves;
    p.fullmoves = this.fullmoves;
    p.kings[0] = this.kings[0];
    p.kings[1] = this.kings[1];
    p.hashLo = this.hashLo;
    p.hashHi = this.hashHi;
    for (const u of this.history) p.history.push({ ...u });
    return p;
  }

  put(sq: Square, piece: Piece): void {
    this.board[sq] = piece;
    if (piece !== EMPTY && pieceType(piece) === KING) this.kings[pieceColor(piece)] = sq;
  }

  /** Recomputes the hash from scratch. Used after FEN loads and by tests. */
  computeHash(): void {
    let lo = 0;
    let hi = 0;
    for (const sq of SQUARES) {
      const p = this.board[sq]!;
      if (p !== EMPTY) {
        lo ^= Z_PIECE_LO[p * 128 + sq]!;
        hi ^= Z_PIECE_HI[p * 128 + sq]!;
      }
    }
    lo ^= Z_CASTLING_LO[this.castling]!;
    hi ^= Z_CASTLING_HI[this.castling]!;
    if (this.ep >= 0) {
      lo ^= Z_EP_LO[this.ep & 7]!;
      hi ^= Z_EP_HI[this.ep & 7]!;
    }
    if (this.turn === BLACK) {
      lo ^= Z_SIDE_LO;
      hi ^= Z_SIDE_HI;
    }
    this.hashLo = lo;
    this.hashHi = hi;
  }

  key(): string {
    return hashKey(this.hashLo, this.hashHi);
  }

  private xorPiece(sq: Square, piece: Piece): void {
    const i = piece * 128 + sq;
    this.hashLo ^= Z_PIECE_LO[i]!;
    this.hashHi ^= Z_PIECE_HI[i]!;
  }

  /** True if `sq` is attacked by any piece of colour `by`. */
  isSquareAttacked(sq: Square, by: Color): boolean {
    const board = this.board;

    // Pawns: look backwards along the capture diagonals of the attacker.
    const pawn = makePiece(PAWN, by);
    const back = by === WHITE ? -16 : 16;
    for (const side of [-1, 1]) {
      const from = sq + back + side;
      if (isOnBoard(from) && board[from] === pawn) return true;
    }

    const knight = makePiece(KNIGHT, by);
    for (const off of KNIGHT_OFFSETS) {
      const from = sq + off;
      if (isOnBoard(from) && board[from] === knight) return true;
    }

    const king = makePiece(KING, by);
    for (const off of KING_OFFSETS) {
      const from = sq + off;
      if (isOnBoard(from) && board[from] === king) return true;
    }

    // Sliders: walk each ray until it hits a piece or leaves the board.
    for (const off of BISHOP_OFFSETS) {
      for (let s = sq + off; isOnBoard(s); s += off) {
        const p = board[s]!;
        if (p === EMPTY) continue;
        if (pieceColor(p) === by) {
          const t = pieceType(p);
          if (t === BISHOP || t === QUEEN) return true;
        }
        break;
      }
    }
    for (const off of ROOK_OFFSETS) {
      for (let s = sq + off; isOnBoard(s); s += off) {
        const p = board[s]!;
        if (p === EMPTY) continue;
        if (pieceColor(p) === by) {
          const t = pieceType(p);
          if (t === ROOK || t === QUEEN) return true;
        }
        break;
      }
    }
    return false;
  }

  isKingAttacked(color: Color): boolean {
    const k = this.kings[color];
    return k >= 0 && this.isSquareAttacked(k, other(color));
  }

  inCheck(): boolean {
    return this.isKingAttacked(this.turn);
  }

  make(move: Move): void {
    const from = moveFrom(move);
    const to = moveTo(move);
    const flags = moveFlags(move);
    const captured = moveCaptured(move);
    const us = this.turn;
    const them = other(us);
    const piece = this.board[from]!;
    const type = pieceType(piece);

    this.history.push({
      move,
      castling: this.castling,
      ep: this.ep,
      halfmoves: this.halfmoves,
      hashLo: this.hashLo,
      hashHi: this.hashHi,
    });

    if (flags & FLAG_EP) {
      const capSq = us === WHITE ? to - 16 : to + 16;
      this.xorPiece(capSq, this.board[capSq]!);
      this.board[capSq] = EMPTY;
    } else if (captured !== EMPTY) {
      this.xorPiece(to, captured);
    }

    this.xorPiece(from, piece);
    this.board[from] = EMPTY;
    const placed = flags & FLAG_PROMOTION ? makePiece(movePromotion(move), us) : piece;
    this.board[to] = placed;
    this.xorPiece(to, placed);

    if (type === KING) {
      this.kings[us] = to;
      if (flags & FLAG_KING_CASTLE) this.moveRook(to + 1, to - 1, us);
      else if (flags & FLAG_QUEEN_CASTLE) this.moveRook(to - 2, to + 1, us);
    }

    const nextCastling = this.castling & CASTLE_MASK[from]! & CASTLE_MASK[to]!;
    this.hashLo ^= Z_CASTLING_LO[this.castling]! ^ Z_CASTLING_LO[nextCastling]!;
    this.hashHi ^= Z_CASTLING_HI[this.castling]! ^ Z_CASTLING_HI[nextCastling]!;
    this.castling = nextCastling;

    if (this.ep >= 0) {
      this.hashLo ^= Z_EP_LO[this.ep & 7]!;
      this.hashHi ^= Z_EP_HI[this.ep & 7]!;
    }
    if (flags & FLAG_DOUBLE_PUSH) {
      this.ep = us === WHITE ? from + 16 : from - 16;
      this.hashLo ^= Z_EP_LO[this.ep & 7]!;
      this.hashHi ^= Z_EP_HI[this.ep & 7]!;
    } else {
      this.ep = -1;
    }

    this.halfmoves = type === PAWN || captured !== EMPTY ? 0 : this.halfmoves + 1;
    if (us === BLACK) this.fullmoves++;
    this.turn = them;
    this.hashLo ^= Z_SIDE_LO;
    this.hashHi ^= Z_SIDE_HI;
  }

  unmake(): Move {
    const undo = this.history.pop();
    if (!undo) return 0;

    const move = undo.move;
    const from = moveFrom(move);
    const to = moveTo(move);
    const flags = moveFlags(move);
    const captured = moveCaptured(move);
    const us = other(this.turn);

    this.turn = us;
    this.castling = undo.castling;
    this.ep = undo.ep;
    this.halfmoves = undo.halfmoves;
    this.hashLo = undo.hashLo;
    this.hashHi = undo.hashHi;
    if (us === BLACK) this.fullmoves--;

    const moved = flags & FLAG_PROMOTION ? makePiece(PAWN, us) : this.board[to]!;
    this.board[from] = moved;
    this.board[to] = EMPTY;
    if (pieceType(moved) === KING) {
      this.kings[us] = from;
      // Put the rook back before restoring anything on `to`.
      if (flags & FLAG_KING_CASTLE) this.unmoveRook(to - 1, to + 1, us);
      else if (flags & FLAG_QUEEN_CASTLE) this.unmoveRook(to + 1, to - 2, us);
    }

    if (flags & FLAG_EP) {
      const capSq = us === WHITE ? to - 16 : to + 16;
      this.board[capSq] = makePiece(PAWN, other(us));
    } else if (captured !== EMPTY) {
      this.board[to] = captured;
    }
    return move;
  }

  private moveRook(from: Square, to: Square, us: Color): void {
    const rook = makePiece(ROOK, us);
    this.board[from] = EMPTY;
    this.board[to] = rook;
    this.xorPiece(from, rook);
    this.xorPiece(to, rook);
  }

  private unmoveRook(from: Square, to: Square, us: Color): void {
    this.board[from] = EMPTY;
    this.board[to] = makePiece(ROOK, us);
  }

  /**
   * How many times the current position has occurred in this game, including
   * now. Only the reversible tail can contain repetitions, so we stop at the
   * last capture or pawn move.
   */
  countRepetitions(): number {
    let count = 1;
    const stop = Math.max(0, this.history.length - this.halfmoves);
    for (let i = this.history.length - 1; i >= stop; i--) {
      const u = this.history[i]!;
      if (u.hashLo === this.hashLo && u.hashHi === this.hashHi) count++;
    }
    return count;
  }
}
