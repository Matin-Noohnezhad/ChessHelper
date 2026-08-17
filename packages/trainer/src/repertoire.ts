/**
 * Turning the opening tree into practisable lines.
 *
 * With the full ECO tables in the book, "every leaf under the Sicilian" runs to
 * hundreds of lines that branch at move 18 — coverage, but not a training plan.
 * So the repertoire is built by *truncating* to a depth budget past the opening
 * you chose, deduplicating the results, and keeping only what nothing else
 * extends. Each line is then named by the deepest book entry that matches it, so
 * a truncated path still arrives with a real name and real theory.
 */

import { OPENINGS, deepestOpening, inheritTheory } from '@coh/opening-book';
import type { Opening } from '@coh/opening-book';
import type { RepertoireLine } from './types.js';

const startsWith = (moves: readonly string[], prefix: readonly string[]): boolean => {
  if (prefix.length > moves.length) return false;
  for (let i = 0; i < prefix.length; i++) if (moves[i] !== prefix[i]) return false;
  return true;
};

/**
 * Shortest line worth drilling. Below this you are answering one question, not
 * playing an opening.
 */
export const DEFAULT_MIN_PLIES = 6;

/** How many plies past the chosen opening a drill runs, by default. */
export const DEFAULT_DEPTH_BUDGET = 10;

export interface RepertoireOptions {
  /** Lines shorter than this are dropped, unless that would leave nothing. */
  minPlies?: number;
  /**
   * Absolute depth cap. Defaults to the root's length plus
   * {@link DEFAULT_DEPTH_BUDGET}, so picking a deep variation drills deeper
   * than picking a whole opening does.
   */
  maxPlies?: number;
}

/** Every practisable line under `root`, ordered by move order. */
export function buildRepertoire(
  root: readonly string[] = [],
  options: RepertoireOptions = {},
): RepertoireLine[] {
  const { minPlies = DEFAULT_MIN_PLIES } = options;
  const maxPlies = options.maxPlies ?? root.length + DEFAULT_DEPTH_BUDGET;

  // Truncate to the budget, then dedupe: many deep ECO variations share their
  // first dozen moves and collapse into a single line to practise.
  //
  // Counting how many book lines collapse into each one is the useful part: it
  // is a free measure of how much theory sits beneath a move order, and so of
  // how central it is. Without it a Sicilian session opens with the Wing
  // Gambit, because nothing else distinguishes a main line from a sideline.
  const truncated = new Map<string, { moves: string[]; descendants: number }>();
  for (const opening of OPENINGS) {
    if (!startsWith(opening.moves, root)) continue;
    const moves = opening.moves.slice(0, maxPlies);
    if (!moves.length) continue;
    const id = moves.join(' ');
    const existing = truncated.get(id);
    if (existing) existing.descendants++;
    else truncated.set(id, { moves, descendants: 1 });
  }

  // A line is a leaf when nothing else in the set continues past it. Collecting
  // the prefixes once keeps this linear instead of comparing every pair.
  const extended = new Set<string>();
  for (const { moves } of truncated.values()) {
    for (let i = Math.max(1, root.length); i < moves.length; i++) {
      extended.add(moves.slice(0, i).join(' '));
    }
  }

  const leaves = [...truncated.entries()].filter(([id]) => !extended.has(id));

  // Falling back matters: a shallow opening should still be practisable, just
  // briefly, rather than showing an empty session.
  const deep = leaves.filter(([, entry]) => entry.moves.length >= minPlies);
  const chosen = deep.length ? deep : leaves;

  // Main lines first: the scheduler hands out unseen lines in this order, and
  // the UI lists them in it.
  return chosen
    .map(([id, entry]) => toLine(id, entry.moves, entry.descendants))
    .sort((a, b) => b.descendants - a.descendants || a.id.localeCompare(b.id));
}

function toLine(id: string, moves: string[], descendants: number): RepertoireLine {
  const opening = deepestOpening(moves);
  const source = opening ? inheritTheory(opening) : undefined;
  return {
    id,
    eco: opening?.eco ?? '',
    name: opening?.name ?? 'Unnamed line',
    moves,
    descendants,
    opening: opening ?? ({ eco: '', name: 'Unnamed line', moves } as Opening),
    ...(source?.theory ? { theory: source.theory } : {}),
  };
}

/** How many distinct lines an opening would give you to practise. */
export function countLines(root: readonly string[], options?: RepertoireOptions): number {
  return buildRepertoire(root, options).length;
}

/**
 * Openings worth offering in the picker: they carry written theory and have at
 * least one line with real depth behind them. The ECO tables supply coverage,
 * but only the hand-written entries can teach, so those are what you choose
 * between — the imported lines provide the depth underneath.
 */
export function trainableOpenings(options: RepertoireOptions = {}): Opening[] {
  const minPlies = options.minPlies ?? DEFAULT_MIN_PLIES;
  // Deliberately not via buildRepertoire: this runs for every candidate root,
  // and "is there anything deep enough under here" is a one-pass question.
  return OPENINGS.filter(
    (candidate) =>
      candidate.theory &&
      OPENINGS.some(
        (line) => line.moves.length >= minPlies && startsWith(line.moves, candidate.moves),
      ),
  );
}
