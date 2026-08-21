/**
 * Recognising a pawn structure from the position itself.
 *
 * Until now a structure reached an opening only because someone typed its id
 * into `theory.structures` by hand, which means 31 lines out of 3,844 get any
 * structural advice at all — and a game that leaves the book, or transposes
 * into an isolani from an opening nobody tagged, gets none. But a structure is
 * a property of the pawns on the board, not of the move order that produced
 * them: that is the entire reason structures are worth studying. So it can be
 * read off the position, and then it applies everywhere, including the
 * middlegame positions in a review.
 *
 * The rules below constrain only the files that define each structure. Wing
 * pawns move around constantly without changing what the position *is*, so
 * matching them would reject nearly every real game.
 */

import { PAWN_STRUCTURES, getStructure } from './structures.js';
import type { PawnBreak, PawnStructure, Side } from './types.js';

/** Pawn placement, and nothing else — the part that defines a structure. */
export interface PawnSkeleton {
  /** True when that side has a pawn on the square, e.g. `has('white', 'd4')`. */
  has(side: Side, square: string): boolean;
  /** How many pawns that side has on the file, e.g. `count('white', 'c')`. */
  count(side: Side, file: string): number;
}

const FILES = 'abcdefgh';

class Skeleton implements PawnSkeleton {
  private readonly squares = { white: new Set<string>(), black: new Set<string>() };
  private readonly files = { white: new Map<string, number>(), black: new Map<string, number>() };

  add(side: Side, file: string, rank: number): void {
    this.squares[side].add(`${file}${rank}`);
    this.files[side].set(file, (this.files[side].get(file) ?? 0) + 1);
  }

  has(side: Side, square: string): boolean {
    return this.squares[side].has(square);
  }

  count(side: Side, file: string): number {
    return this.files[side].get(file) ?? 0;
  }

  /**
   * The same structure seen from the other side: ranks flipped and colours
   * swapped, so a black isolani on d5 becomes a white one on d4. Every rule is
   * then written once, for the orientation the encyclopedia entry describes.
   */
  mirror(): Skeleton {
    const out = new Skeleton();
    for (const side of ['white', 'black'] as const) {
      const other: Side = side === 'white' ? 'black' : 'white';
      for (const square of this.squares[side]) {
        out.add(other, square[0]!, 9 - Number(square[1]));
      }
    }
    return out;
  }
}

/**
 * Reads the pawns out of a FEN. Only the placement field is touched, so a
 * skeleton FEN with nothing but kings and pawns works exactly like a real one.
 */
export function pawnSkeleton(fen: string): PawnSkeleton {
  const skeleton = new Skeleton();
  const placement = fen.trim().split(/\s+/)[0] ?? '';
  const ranks = placement.split('/');

  for (const [index, row] of ranks.entries()) {
    const rank = 8 - index;
    let file = 0;
    for (const ch of row) {
      if (ch >= '1' && ch <= '8') {
        file += Number(ch);
        continue;
      }
      if (ch === 'P') skeleton.add('white', FILES[file]!, rank);
      else if (ch === 'p') skeleton.add('black', FILES[file]!, rank);
      file++;
    }
  }
  return skeleton;
}

/* ----------------------------------------------------------------- rules --- */

type Rule = (s: PawnSkeleton) => boolean;

/** No pawn of that colour anywhere on the file — the file is theirs to use. */
const noFile = (side: Side, file: string): Rule => (s) => s.count(side, file) === 0;
/** A pawn on at least one of the squares — "the e-pawn is still home-ish". */
const pawnOnAny =
  (side: Side, ...squares: string[]): Rule =>
  (s) =>
    squares.some((square) => s.has(side, square));
const all =
  (...rules: Rule[]): Rule =>
  (s) =>
    rules.every((rule) => rule(s));
const pawns =
  (side: Side, ...squares: string[]): Rule =>
  (s) =>
    squares.every((square) => s.has(side, square));

/**
 * Ordered most specific first, because several of these are refinements of
 * each other — a Stonewall is a Slav triangle that has played ...f5, and a
 * Hedgehog is a Maróczy where Black has committed to ...a6, ...b6 and ...e6.
 * The first match is the most informative one, and callers that want the
 * broader family can read further down the list.
 */
const RULES: { id: string; rule: Rule }[] = [
  {
    id: 'stonewall',
    rule: all(pawns('black', 'c6', 'd5', 'e6', 'f5'), pawns('white', 'd4')),
  },
  {
    id: 'semi-slav-triangle',
    rule: all(pawns('black', 'c6', 'd5', 'e6'), pawns('white', 'c4', 'd4')),
  },
  {
    id: 'french-chain',
    rule: all(pawns('white', 'd4', 'e5'), pawns('black', 'd5', 'e6')),
  },
  {
    id: 'hedgehog',
    rule: all(
      pawns('white', 'c4', 'e4'),
      noFile('white', 'd'),
      pawns('black', 'a6', 'b6', 'd6', 'e6'),
      noFile('black', 'c'),
    ),
  },
  {
    id: 'maroczy',
    rule: all(pawns('white', 'c4', 'e4'), noFile('white', 'd'), pawns('black', 'd6'), noFile('black', 'c')),
  },
  {
    id: 'benoni',
    // Black's c5 against White's d5 is the whole structure; e4 is usual but the
    // fianchetto lines get there without it, so it is not required.
    rule: all(pawns('white', 'd5'), pawns('black', 'c5', 'd6'), noFile('black', 'e')),
  },
  {
    id: 'kid-locked',
    rule: all(pawns('white', 'd5', 'e4'), pawns('black', 'd6', 'e5')),
  },
  {
    id: 'boleslavsky',
    rule: all(pawns('white', 'e4'), noFile('white', 'd'), pawns('black', 'd6', 'e5'), noFile('black', 'c')),
  },
  {
    id: 'scheveningen',
    rule: all(pawns('white', 'e4'), noFile('white', 'd'), pawns('black', 'd6', 'e6'), noFile('black', 'c')),
  },
  {
    id: 'spanish-closed',
    rule: all(pawns('white', 'd4', 'e4'), pawns('black', 'd6', 'e5')),
  },
  {
    id: 'carlsbad',
    // White's e-pawn has to still be behind d4. Without that the rule also
    // matched positions with a pawn on e5, which is a wedge and a completely
    // different game — the Italian after 9.e5 and 11.cxd4 reached it, and
    // would have been shown minority-attack plans for a structure it is not.
    rule: all(
      pawns('white', 'd4'),
      noFile('white', 'c'),
      pawnOnAny('white', 'e2', 'e3'),
      pawns('black', 'd5'),
      noFile('black', 'e'),
    ),
  },
  {
    id: 'hanging-pawns',
    rule: all(
      pawns('white', 'c4', 'd4'),
      noFile('white', 'b'),
      noFile('white', 'e'),
      noFile('black', 'c'),
      noFile('black', 'd'),
    ),
  },
  {
    id: 'iqp',
    rule: all(pawns('white', 'd4'), noFile('white', 'c'), noFile('white', 'e'), noFile('black', 'd')),
  },
];

/* --------------------------------------------------------------- matches --- */

export interface StructureMatch {
  structure: PawnStructure;
  /**
   * True when it is Black who holds the position the entry describes — a black
   * isolani, a black Maróczy bind. The entry's `whitePlans` and `blackPlans`
   * then belong to the other side, and `breaks` to the other side too.
   */
  mirrored: boolean;
}

const other = (side: Side): Side => (side === 'white' ? 'black' : 'white');

/** The plans that belong to `side` in a match, accounting for the mirror. */
export function plansFor(match: StructureMatch, side: Side): string[] {
  const wantsWhite = match.mirrored ? side === 'black' : side === 'white';
  return wantsWhite ? match.structure.whitePlans : match.structure.blackPlans;
}

/**
 * The structure's breaks as they apply to this match. A mirrored match swaps
 * whose break it is and which rank it lands on — Black's freeing ...d5 in an
 * isolani position is White's d4 when White is the one blockading.
 */
export function breaksFor(match: StructureMatch): PawnBreak[] {
  if (!match.mirrored) return match.structure.breaks;
  return match.structure.breaks.map((brk) => ({
    ...brk,
    side: other(brk.side),
    move: brk.move.replace(/([1-8])/g, (rank) => String(9 - Number(rank))),
  }));
}

/**
 * The diagram seen from the other side, for a mirrored match: ranks reversed
 * and colours swapped, so the picture shows the position that was actually
 * matched rather than its upside-down twin.
 */
export function mirrorFen(fen: string): string {
  const [placement = '', turn = 'w', ...rest] = fen.trim().split(/\s+/);
  const flipped = placement
    .split('/')
    .reverse()
    .map((row) => [...row].map((ch) => (ch === ch.toUpperCase() ? ch.toLowerCase() : ch.toUpperCase())).join(''))
    .join('/');
  return [flipped, turn === 'w' ? 'b' : 'w', ...rest].join(' ');
}

/**
 * Every structure the position matches, most specific first.
 *
 * Returns more than one where the structures genuinely overlap; a Hedgehog is
 * also a Maróczy bind and it is useful to be told both. Mirrored matches come
 * after upright ones of the same specificity, since a position is more often
 * about the side that owns the structure.
 */
export function classifyStructure(fen: string): StructureMatch[] {
  const upright = pawnSkeleton(fen) as Skeleton;
  const mirrored = upright.mirror();
  const out: StructureMatch[] = [];

  for (const { id, rule } of RULES) {
    const structure = getStructure(id);
    if (!structure) continue;
    if (rule(upright)) out.push({ structure, mirrored: false });
    else if (rule(mirrored)) out.push({ structure, mirrored: true });
  }
  return out;
}

/** The single best reading of the position, or `undefined` if none applies. */
export function classifyStructureBest(fen: string): StructureMatch | undefined {
  return classifyStructure(fen)[0];
}

/** Ids of every structure the classifier knows a rule for. */
export const CLASSIFIED_STRUCTURES: string[] = RULES.map((entry) => entry.id);

/** Structures in the encyclopedia that no rule recognises yet. */
export const UNCLASSIFIED_STRUCTURES: string[] = PAWN_STRUCTURES.filter(
  (structure) => !CLASSIFIED_STRUCTURES.includes(structure.id),
).map((structure) => structure.id);
