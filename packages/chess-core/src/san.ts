/**
 * Standard Algebraic Notation.
 *
 * SAN is context-sensitive (disambiguation, check marks), so both directions
 * work off the legal move list of the position they are given. Callers that
 * already have that list should pass it in — walking an opening book calls this
 * on every node.
 */

import { KING, PAWN, PIECE_SYMBOLS, pieceType } from './types.js';
import type { PieceType } from './types.js';
import { algebraic, fileOf, parseSquare, rankOf } from './squares.js';
import type { Square } from './squares.js';
import { Position } from './position.js';
import { generateLegalMoves, generatePseudoLegal, hasLegalMoves } from './movegen.js';
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
  FLAG_QUEEN_CASTLE,
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
 * What a SAN token asks for, read without reference to any position: which
 * piece, whichever of file/rank the writer gave to narrow the origin down, the
 * destination, and the promotion.
 */
interface SanRequest {
  castle: 'king' | 'queen' | null;
  type: PieceType;
  /** File of the origin square, or -1 when the notation did not say. */
  fromFile: number;
  /** Rank of the origin square, or -1 when the notation did not say. */
  fromRank: number;
  to: Square;
  /** Promotion piece type, or 0 for a move that is not a promotion. */
  promotion: PieceType | 0;
}

function readSan(san: string): SanRequest | null {
  const text = normalizeSan(san);
  if (text === 'O-O' || text === 'O-O-O') {
    return {
      castle: text === 'O-O' ? 'king' : 'queen',
      type: KING,
      fromFile: -1,
      fromRank: -1,
      to: 0 as Square,
      promotion: 0,
    };
  }
  const parts = /^([KQRBN])?([a-h])?([1-8])?x?([a-h][1-8])=?([QRBN])?$/.exec(text);
  if (!parts) return null;
  return {
    castle: null,
    type: parts[1] ? (PIECE_SYMBOLS.indexOf(parts[1].toLowerCase()) as PieceType) : PAWN,
    fromFile: parts[2] ? FILE_CHARS.indexOf(parts[2]) : -1,
    fromRank: parts[3] ? Number(parts[3]) - 1 : -1,
    to: parseSquare(parts[4]!),
    promotion: parts[5] ? (PIECE_SYMBOLS.indexOf(parts[5].toLowerCase()) as PieceType) : 0,
  };
}

/** The moves in `candidates` that fit the description. */
function matchSan(pos: Position, request: SanRequest, candidates: Move[]): Move[] {
  const out: Move[] = [];
  for (const move of candidates) {
    if (request.castle) {
      const wanted = request.castle === 'king' ? FLAG_KING_CASTLE : FLAG_QUEEN_CASTLE;
      if ((moveFlags(move) & wanted) !== 0) out.push(move);
      continue;
    }
    if (moveTo(move) !== request.to) continue;
    const from = moveFrom(move);
    if (pieceType(pos.board[from]!) !== request.type) continue;
    if (request.fromFile >= 0 && fileOf(from) !== request.fromFile) continue;
    if (request.fromRank >= 0 && rankOf(from) !== request.fromRank) continue;
    // The capture 'x' carries nothing the destination square does not already
    // say, so it is not matched on — plenty of files in the wild leave it out.
    if (request.promotion) {
      if (!isPromotion(move) || movePromotion(move) !== request.promotion) continue;
    } else if (isPromotion(move)) continue;
    out.push(move);
  }
  return out;
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
  // Last resort: read the notation instead of rendering ours. Exporters
  // disambiguate against the pieces that *could* move, not the ones that
  // legally may — ChessBase writes `Nge7` where our own renderer, seeing the
  // other knight pinned, writes `Ne7`. Over-specified is still unambiguous.
  const request = readSan(san);
  if (!request) return null;
  const matched = matchSan(pos, request, moves);
  return matched.length === 1 ? matched[0]! : null;
}

/** Resolves `e2e4` / `e7e8q` against the position. */
export function parseUci(pos: Position, uci: string, legal?: Move[]): Move | null {
  const moves = legal ?? generateLegalMoves(pos);
  const text = uci.trim().toLowerCase();
  for (const move of moves) if (moveToUci(move) === text) return move;
  return null;
}

/**
 * Resolves SAN the other way round: work out which move the text *describes*,
 * then look for that move.
 *
 * {@link parseSan} renders SAN for every legal move until one matches, and
 * rendering a piece move disambiguates it against the whole list — quadratic
 * string work per move. That is invisible in a UI and ruinous when replaying a
 * corpus of millions of nodes, where it costs more than move generation does.
 *
 * So this reads the notation into a description, filters the *pseudo-legal*
 * moves by it, and tests legality only for the one or two moves that survive.
 * Where the description stays ambiguous — two knights reach the square and the
 * notation did not say which, because one of them is pinned — it hands over to
 * {@link parseSan}, which will render its way to the answer. Same answer as
 * {@link parseSan} in every case, roughly ten times faster.
 */
export function resolveSan(pos: Position, san: string): Move | null {
  const request = readSan(san);
  if (!request) return parseSan(pos, san); // long algebraic, junk, something exotic

  const pseudo: Move[] = [];
  generatePseudoLegal(pos, pseudo);

  const legal: Move[] = [];
  const us = pos.turn;
  for (const move of matchSan(pos, request, pseudo)) {
    pos.make(move);
    if (!pos.isKingAttacked(us)) legal.push(move);
    pos.unmake();
  }
  if (legal.length === 1) return legal[0]!;
  // Ambiguous, or nothing matched at all: both are rare enough to settle on the
  // slow path rather than reimplement its tolerances here.
  return parseSan(pos, san);
}
