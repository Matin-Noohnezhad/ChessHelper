/**
 * Lookup over the opening tree.
 *
 * The book has two layers. The ECO tables give near-complete *coverage* — 3,810
 * named lines, so almost any legal opening sequence has a name. The hand-written
 * entries give *understanding* — plans, structures, breaks. They are merged into
 * one tree here: curated entries win wherever both name the same position, and
 * theory is inherited downwards, so a deep ECO line still teaches the ideas of
 * the opening it belongs to.
 *
 * Openings are addressed by their SAN move sequence, so identification is a
 * longest-prefix match.
 */

import { CURATED_OPENINGS } from './openings.js';
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
  for (let depth = Math.min(moves.length, LONGEST_LINE); depth > 0; depth--) {
    const found = BY_MOVES.get(key(moves.slice(0, depth)));
    if (found) return found;
  }
  return undefined;
}

/**
 * The deepest known opening plus everything the UI needs around it: whether the
 * game is still in book, where it can go next, and which ancestor's theory
 * applies. Returns `null` before the first move.
 */
export function identifyOpening(moves: readonly string[]): OpeningMatch | null {
  const best = deepestOpening(moves);
  if (!best) return null;

  const inherited = inheritTheory(best);
  return {
    opening: best,
    depth: best.moves.length,
    exact: best.moves.length === moves.length,
    continuations: continuationsFrom(moves),
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
  const played = moves.length;
  const byNextMove = new Map<string, Opening>();

  for (const opening of SORTED) {
    if (opening.moves.length <= played) continue;
    // Compare element-wise: with thousands of lines this runs on every move,
    // and joining strings here would allocate once per candidate.
    let matches = true;
    for (let i = 0; i < played; i++) {
      if (opening.moves[i] !== moves[i]) {
        matches = false;
        break;
      }
    }
    if (!matches) continue;
    const next = opening.moves[played]!;
    // SORTED is shallowest-first, so the first hit is the closest named line.
    if (!byNextMove.has(next)) byNextMove.set(next, opening);
    if (byNextMove.size >= limit) break;
  }
  return [...byNextMove.values()];
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
