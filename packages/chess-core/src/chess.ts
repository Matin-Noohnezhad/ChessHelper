/**
 * The friendly facade.
 *
 * UI code, the opening book and the trainer all talk to this class in strings
 * (`'e4'`, `'e2e4'`, squares like `'g1'`) and never touch packed moves. The raw
 * {@link Position} stays reachable via `.position` for the engine.
 */

import { Position } from './position.js';
import { START_FEN, loadFen, toFen } from './fen.js';
import { generateLegalMoves, hasLegalMoves } from './movegen.js';
import { moveToSan, parseSan, parseUci } from './san.js';
import {
  isCapture,
  isCastle,
  isEnPassant,
  isPromotion,
  moveCaptured,
  moveFrom,
  movePromotion,
  moveTo,
  moveToUci,
} from './move.js';
import type { Move } from './move.js';
import {
  BISHOP,
  EMPTY,
  KING,
  KNIGHT,
  PIECE_SYMBOLS,
  WHITE,
  pieceColor,
  pieceToChar,
  pieceType,
} from './types.js';
import type { Color, PieceType } from './types.js';
import { SQUARES, algebraic, fileOf, from64, parseSquare, rankOf } from './squares.js';
import type { Square } from './squares.js';

export type ColorName = 'w' | 'b';
export type PieceSymbol = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';

export interface MoveInfo {
  /** Packed move, for handing back to the core without re-parsing. */
  raw: Move;
  san: string;
  uci: string;
  from: string;
  to: string;
  piece: PieceSymbol;
  color: ColorName;
  captured?: PieceSymbol;
  promotion?: PieceSymbol;
  isCapture: boolean;
  isEnPassant: boolean;
  isCastle: boolean;
  isPromotion: boolean;
  /** FEN *before* the move — the trainer keys positions on this. */
  before: string;
}

export interface SquareContents {
  square: string;
  type: PieceSymbol;
  color: ColorName;
}

export type MoveInput = string | { from: string; to: string; promotion?: PieceSymbol };

export type GameResult = '1-0' | '0-1' | '1/2-1/2' | '*';

const colorName = (c: Color): ColorName => (c === WHITE ? 'w' : 'b');
const symbolOf = (t: PieceType): PieceSymbol => PIECE_SYMBOLS[t] as PieceSymbol;

export class Chess {
  readonly position: Position;
  private sanStack: string[] = [];

  constructor(fen: string = START_FEN) {
    this.position = new Position();
    loadFen(this.position, fen);
  }

  load(fen: string): void {
    loadFen(this.position, fen);
    this.sanStack = [];
  }

  reset(): void {
    this.load(START_FEN);
  }

  clone(): Chess {
    const copy = new Chess(this.fen());
    copy.sanStack = [...this.sanStack];
    return copy;
  }

  fen(): string {
    return toFen(this.position);
  }

  /** Position identity without the clocks — what a book or a cache keys on. */
  fenKey(): string {
    return this.fen().split(' ').slice(0, 4).join(' ');
  }

  turn(): ColorName {
    return colorName(this.position.turn);
  }

  moveNumber(): number {
    return this.position.fullmoves;
  }

  pieceAt(square: string): SquareContents | null {
    const sq = parseSquare(square);
    if (sq < 0) return null;
    return this.contentsAt(sq);
  }

  private contentsAt(sq: Square): SquareContents | null {
    const piece = this.position.board[sq]!;
    if (piece === EMPTY) return null;
    return {
      square: algebraic(sq),
      type: symbolOf(pieceType(piece)),
      color: colorName(pieceColor(piece)),
    };
  }

  /** 64 entries in reading order a8 -> h1, ready to map onto a grid. */
  board(): (SquareContents | null)[] {
    const out: (SquareContents | null)[] = [];
    for (let i = 0; i < 64; i++) out.push(this.contentsAt(from64(i)));
    return out;
  }

  legalMoves(): MoveInfo[] {
    const before = this.fen();
    const moves = generateLegalMoves(this.position);
    return moves.map((m) => this.describe(m, moves, before));
  }

  /** Legal destination squares from `square` — what the board UI highlights. */
  movesFrom(square: string): MoveInfo[] {
    const sq = parseSquare(square);
    if (sq < 0) return [];
    const before = this.fen();
    const moves = generateLegalMoves(this.position);
    return moves.filter((m) => moveFrom(m) === sq).map((m) => this.describe(m, moves, before));
  }

  /** SAN strings only — cheaper when you just need a list of replies. */
  sanMoves(): string[] {
    const moves = generateLegalMoves(this.position);
    return moves.map((m) => moveToSan(this.position, m, moves));
  }

  private describe(move: Move, legal: Move[], before: string): MoveInfo {
    const from = moveFrom(move);
    const piece = this.position.board[from]!;
    const captured = moveCaptured(move);
    const info: MoveInfo = {
      raw: move,
      san: moveToSan(this.position, move, legal),
      uci: moveToUci(move),
      from: algebraic(from),
      to: algebraic(moveTo(move)),
      piece: symbolOf(pieceType(piece)),
      color: colorName(pieceColor(piece)),
      isCapture: isCapture(move),
      isEnPassant: isEnPassant(move),
      isCastle: isCastle(move),
      isPromotion: isPromotion(move),
      before,
    };
    if (captured !== EMPTY) info.captured = symbolOf(pieceType(captured));
    else if (isEnPassant(move)) info.captured = 'p';
    if (isPromotion(move)) info.promotion = symbolOf(movePromotion(move));
    return info;
  }

  /**
   * Plays a move given as SAN (`'Nf3'`), UCI (`'g1f3'`) or an object from a
   * drag-and-drop board. Returns `null` — never throws — if it is not legal,
   * because "the user dropped a piece somewhere silly" is not exceptional.
   */
  move(input: MoveInput): MoveInfo | null {
    const legal = generateLegalMoves(this.position);
    let move: Move | null = null;

    if (typeof input === 'string') {
      move = parseSan(this.position, input, legal) ?? parseUci(this.position, input, legal);
    } else {
      const from = parseSquare(input.from);
      const to = parseSquare(input.to);
      const wantPromo = input.promotion ? PIECE_SYMBOLS.indexOf(input.promotion) : 0;
      for (const candidate of legal) {
        if (moveFrom(candidate) !== from || moveTo(candidate) !== to) continue;
        if (isPromotion(candidate)) {
          // Default to a queen when the UI has not asked the user yet.
          if (movePromotion(candidate) !== (wantPromo || 5)) continue;
        }
        move = candidate;
        break;
      }
    }
    if (move === null) return null;

    const info = this.describe(move, legal, this.fen());
    this.position.make(move);
    this.sanStack.push(info.san);
    return info;
  }

  /** True if the move would be legal, without playing it. */
  isLegal(input: MoveInput): boolean {
    const probe = this.clone();
    return probe.move(input) !== null;
  }

  undo(): string | null {
    if (!this.position.history.length) return null;
    this.position.unmake();
    return this.sanStack.pop() ?? null;
  }

  history(): string[] {
    return [...this.sanStack];
  }

  isCheck(): boolean {
    return this.position.inCheck();
  }

  isCheckmate(): boolean {
    return this.position.inCheck() && !hasLegalMoves(this.position);
  }

  isStalemate(): boolean {
    return !this.position.inCheck() && !hasLegalMoves(this.position);
  }

  isFiftyMoveRule(): boolean {
    return this.position.halfmoves >= 100;
  }

  isThreefoldRepetition(): boolean {
    return this.position.countRepetitions() >= 3;
  }

  isInsufficientMaterial(): boolean {
    const bishopSquareColors = new Set<number>();
    let knights = 0;
    for (const sq of SQUARES) {
      const piece = this.position.board[sq]!;
      if (piece === EMPTY) continue;
      const type = pieceType(piece);
      if (type === KING) continue;
      if (type === BISHOP) bishopSquareColors.add((fileOf(sq) + rankOf(sq)) & 1);
      else if (type === KNIGHT) knights++;
      else return false; // a pawn, rook or queen is always enough
    }
    const minors = knights + bishopSquareColors.size;
    if (minors <= 1) return true; // bare kings, or king + one minor
    // Bishops all on one colour can never mate, however many there are.
    return knights === 0 && bishopSquareColors.size === 1;
  }

  isDraw(): boolean {
    return (
      this.isStalemate() ||
      this.isFiftyMoveRule() ||
      this.isThreefoldRepetition() ||
      this.isInsufficientMaterial()
    );
  }

  isGameOver(): boolean {
    return this.isCheckmate() || this.isDraw();
  }

  result(): GameResult {
    if (this.isCheckmate()) return this.position.turn === WHITE ? '0-1' : '1-0';
    if (this.isDraw()) return '1/2-1/2';
    return '*';
  }

  /** Text board, for tests and quick debugging in the console. */
  ascii(): string {
    const rows: string[] = [];
    for (let rank = 7; rank >= 0; rank--) {
      let row = `${rank + 1} `;
      for (let file = 0; file < 8; file++) {
        row += pieceToChar(this.position.board[rank * 16 + file]!) + ' ';
      }
      rows.push(row.trimEnd());
    }
    rows.push('  a b c d e f g h');
    rows.push(`${this.turn() === 'w' ? 'White' : 'Black'} to move`);
    return rows.join('\n');
  }
}
