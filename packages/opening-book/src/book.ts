/**
 * Lookup over the opening tree.
 *
 * The book has two layers. The ECO tables give broad coverage of named
 * variations. The hand-written
 * entries give *understanding* — plans, structures, breaks. They are merged into
 * one tree here: curated entries win wherever both name the same position, and
 * theory is inherited downwards, so a deep ECO line still teaches the ideas of
 * the opening it belongs to.
 *
 * Move sequences address entries, but recognition uses legal positions so
 * transpositions inherit the same names, plans and continuations.
 */

import { Chess } from '@coh/chess-core';
import { CURATED_OPENINGS } from './openings.js';
import { theoryPositionKey } from './theory-position.js';
import { BOOK_POSITION_TSV } from './book-positions.generated.js';
import { ECO_TSV } from './eco.generated.js';
import { getStructures } from './structures.js';
import type { Opening, OpeningMatch, OpeningTheory, PawnStructure, Side } from './types.js';

const key = (moves: readonly string[]): string => moves.join(' ');

/**
 * Merged tree. Curated entries are inserted first so that they win on
 * collision — they carry the theory, and their names are the ones the study
 * panel is written against.
 */
function mergeBook(): Opening[] {
  const byMoves = new Map<string, Opening>();
  for (const opening of CURATED_OPENINGS) byMoves.set(key(opening.moves), opening);

  for (const row of ECO_TSV.split('\n')) {
    const firstTab = row.indexOf('\t');
    const secondTab = row.indexOf('\t', firstTab + 1);
    if (firstTab < 0 || secondTab < 0) continue;
    const id = row.slice(secondTab + 1);
    if (byMoves.has(id)) continue;
    byMoves.set(id, {
      eco: row.slice(0, firstTab),
      name: row.slice(firstTab + 1, secondTab),
      moves: id.split(' '),
    });
  }
  return [...byMoves.values()];
}

export const OPENINGS: Opening[] = mergeBook();

const BY_MOVES = new Map<string, Opening>(OPENINGS.map((o) => [key(o.moves), o]));

/** Shallowest-first, so tree walks and "closest named line" stay stable. */
const SORTED = [...OPENINGS].sort((a, b) => a.moves.length - b.moves.length);

interface ContinuationRoute {
  opening: Opening;
  /** Where the current position occurs in the stored move order. */
  offset: number;
}

interface BookPosition {
  openings: Opening[];
  continuations: Map<string, ContinuationRoute>;
}

interface PositionIndex {
  byPosition: Map<string, BookPosition>;
  byPrefix: Map<string, string>;
}

let positionIndex: PositionIndex | undefined;

/** Built once on demand from precomputed positions, without replaying the book. */
function positions(): PositionIndex {
  if (positionIndex) return positionIndex;
  const index = new Map<string, BookPosition>();
  const prefixes = new Map(BOOK_POSITION_TSV.split('\n').map((row) => {
    const tab = row.indexOf('\t');
    return [row.slice(0, tab), row.slice(tab + 1)] as const;
  }));

  for (const opening of SORTED) {
    let prefix = '';
    for (let offset = 0; offset <= opening.moves.length; offset++) {
      const position = prefixes.get(prefix);
      if (!position) throw new Error(`Missing book position: ${prefix}. Run npm run ingest:positions.`);
      let node = index.get(position);
      if (!node) {
        node = { openings: [], continuations: new Map() };
        index.set(position, node);
      }
      if (offset === opening.moves.length) {
        node.openings.push(opening);
        break;
      }
      const next = opening.moves[offset]!;
      const existing = node.continuations.get(next);
      if (!existing || opening.moves.length - offset < existing.opening.moves.length - existing.offset) {
        node.continuations.set(next, { opening, offset });
      }
      prefix = prefix ? `${prefix} ${next}` : next;
    }
  }
  positionIndex = { byPosition: index, byPrefix: prefixes };
  return positionIndex;
}

function openingAt(node: BookPosition | undefined, prefix: string): Opening | undefined {
  const exactLine = BY_MOVES.get(prefix);
  // Prefer teaching content when several entries name the same position.
  return (exactLine?.theory ? exactLine : node?.openings.find((opening) => opening.theory))
    ?? exactLine ?? node?.openings[0];
}

function resolvePosition(moves: readonly string[]): {
  opening?: Opening;
  depth: number;
  position?: BookPosition;
} {
  const { byPosition, byPrefix } = positions();
  let fen = byPrefix.get('')!;
  let prefix = '';
  let board: Chess | undefined;
  let opening: Opening | undefined;
  let depth = 0;
  let position = byPosition.get(fen);
  for (let ply = 0; ply < moves.length; ply++) {
    const san = moves[ply]!;
    prefix = prefix ? `${prefix} ${san}` : san;
    const known = byPrefix.get(prefix);
    if (!board && known) {
      fen = known;
    } else {
      // Stored prefixes need no replay. Start a board only when the played
      // order diverges, then keep checking positions after every legal move.
      board ??= new Chess(`${fen} 0 1`);
      if (!board.move(san)) return { opening, depth };
      fen = theoryPositionKey(board.fen());
    }
    position = byPosition.get(fen);
    const found = openingAt(position, prefix);
    if (found) {
      opening = found;
      depth = ply + 1;
    }
  }
  return { opening, depth, position };
}

function positionContinuations(position: BookPosition | undefined, moves: readonly string[], limit: number): Opening[] {
  if (!position || limit <= 0) return [];
  return [...position.continuations.values()]
    .sort((a, b) => (a.opening.moves.length - a.offset) - (b.opening.moves.length - b.offset))
    .slice(0, limit)
    .map(({ opening, offset }) => ({
      ...opening,
      // Keep the next move at moves.length for callers, even after a detour
      // added extra plies before returning to this position.
      moves: [...moves, ...opening.moves.slice(offset)],
    }));
}

const LONGEST_LINE = OPENINGS.reduce((max, o) => Math.max(max, o.moves.length), 0);

/**
 * Every prefix that some line continues past. Used to answer "is this line a
 * leaf?" in constant time instead of comparing every line against every other.
 */
const EXTENDED_PREFIXES: Set<string> = (() => {
  const set = new Set<string>();
  for (const opening of OPENINGS) {
    for (let i = 1; i < opening.moves.length; i++) {
      set.add(key(opening.moves.slice(0, i)));
    }
  }
  return set;
})();

export { CURATED_OPENINGS };
export * from './types.js';
export { PAWN_STRUCTURES, getStructure, getStructures } from './structures.js';
export {
  CLASSIFIED_STRUCTURES,
  UNCLASSIFIED_STRUCTURES,
  breaksFor,
  classifyStructure,
  classifyStructureBest,
  mirrorFen,
  pawnSkeleton,
  plansFor,
  structureFor,
} from './classify.js';
export type { PawnSkeleton, StructureMatch } from './classify.js';

export function getOpeningByMoves(moves: readonly string[]): Opening | undefined {
  return BY_MOVES.get(key(moves));
}

/** True when no known line continues past these exact moves. */
export function isLeafLine(moves: readonly string[]): boolean {
  return !EXTENDED_PREFIXES.has(key(moves));
}

/**
 * The deepest known opening consistent with the moves played. Cheaper than
 * {@link identifyOpening} because it skips the continuation list.
 */
export function deepestOpening(moves: readonly string[]): Opening | undefined {
  return moves.length ? resolvePosition(moves).opening : undefined;
}

/**
 * The deepest known opening plus everything the UI needs around it: whether the
 * game is still in book, where it can go next, and which ancestor's theory
 * applies. Returns `null` before the first move.
 */
export function identifyOpening(moves: readonly string[]): OpeningMatch | null {
  if (!moves.length) return null;
  const { opening: best, depth, position } = resolvePosition(moves);
  if (!best) return null;

  const inherited = inheritTheory(best);
  return {
    opening: best,
    depth,
    exact: depth === moves.length,
    continuations: positionContinuations(position, moves, 12),
    theory: inherited?.theory,
    theorySource: inherited,
  };
}

/** Walks up the tree to the nearest ancestor (or self) that carries theory. */
export function inheritTheory(opening: Opening): Opening | undefined {
  for (let depth = opening.moves.length; depth > 0; depth--) {
    const node = BY_MOVES.get(key(opening.moves.slice(0, depth)));
    if (node?.theory) return node;
  }
  return undefined;
}

/**
 * Named lines reachable from here, one per distinct next move: the "where can
 * this go" list the UI offers after every move.
 */
export function continuationsFrom(moves: readonly string[], limit = 12): Opening[] {
  return positionContinuations(resolvePosition(moves).position, moves, limit);
}

const isOpening = (value: Opening | OpeningTheory): value is Opening => 'moves' in value;

/** Every pawn structure referenced by an opening's theory, resolved. */
export function structuresFor(input: Opening | OpeningTheory | undefined): PawnStructure[] {
  if (!input) return [];
  const theory = isOpening(input) ? input.theory : input;
  return theory ? getStructures(theory.structures) : [];
}

export interface SearchOptions {
  /** Only lines written from this side's point of view (plus neutral ones). */
  side?: Side;
  /** Drop lines flagged as needing more strength than this. */
  maxRating?: number;
  /** Restrict to hand-written entries, which are the ones that teach. */
  withTheoryOnly?: boolean;
  limit?: number;
}

/** Name / alias / ECO search for the opening picker. */
export function searchOpenings(query: string, options: SearchOptions = {}): Opening[] {
  const q = query.trim().toLowerCase();
  const { side, maxRating, withTheoryOnly, limit = 50 } = options;

  const scored: { opening: Opening; score: number }[] = [];
  for (const opening of OPENINGS) {
    if (withTheoryOnly && !opening.theory) continue;
    if (side && opening.forSide && opening.forSide !== side) continue;
    if (maxRating !== undefined && opening.minRating && opening.minRating > maxRating) continue;

    const name = opening.name.toLowerCase();
    const aliases = (opening.aliases ?? []).map((a) => a.toLowerCase());
    let score = -1;
    if (!q) score = 0;
    else if (name === q || aliases.includes(q)) score = 100;
    else if (opening.eco.toLowerCase() === q) score = 90;
    else if (name.startsWith(q)) score = 80;
    else if (name.includes(q) || aliases.some((a) => a.includes(q))) score = 60;
    else if (key(opening.moves).toLowerCase().startsWith(q)) score = 40;
    if (score < 0) continue;

    // Prefer named main lines over deep sub-variations at equal relevance, and
    // prefer entries that carry theory over bare ECO rows.
    scored.push({
      opening,
      score: score - opening.moves.length * 0.1 + (opening.theory ? 5 : 0),
    });
  }

  scored.sort((a, b) => b.score - a.score || a.opening.name.localeCompare(b.opening.name));
  return scored.slice(0, limit).map((s) => s.opening);
}

/** Entries that carry full teaching content — the ones worth studying first. */
export function openingsWithTheory(): Opening[] {
  return OPENINGS.filter((o) => o.theory);
}

/** Counts, for the UI and for sanity checks. */
export function bookStats(): { total: number; curated: number; withTheory: number; maxPlies: number } {
  return {
    total: OPENINGS.length,
    curated: CURATED_OPENINGS.length,
    withTheory: OPENINGS.filter((o) => o.theory).length,
    maxPlies: LONGEST_LINE,
  };
}
