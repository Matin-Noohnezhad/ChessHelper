/**
 * Where the opening ends and the endgame begins.
 *
 * The opening is defined by knowledge, not by move number: it lasts as long as
 * the moves are still in our ECO tables, with a floor so that a game that
 * leaves book on move three still has an opening to report on. The endgame is
 * defined by material, the way every engine's phase term is.
 */

import { Chess } from '@coh/chess-core';
import { getOpeningByMoves, isLeafLine } from '@coh/opening-book';
import { nonPawnMaterial } from './material.js';
import type { GamePhase, PhaseBounds } from './types.js';

/** Roughly two rooks and a minor per side, or a queen each — where technique takes over. */
const ENDGAME_MATERIAL_CP = 2600;
/** Even an offbeat first move gets a five-move opening to be judged on. */
const MIN_OPENING_PLIES = 10;
/** Deep theory is still theory, but past this the player deserves the credit. */
const MAX_OPENING_PLIES = 30;

/** How many leading plies are still in the opening book. */
export function bookPlies(sans: readonly string[]): number {
  let count = 0;
  for (let i = 0; i < Math.min(sans.length, MAX_OPENING_PLIES); i++) {
    const line = sans.slice(0, i + 1);
    if (!getOpeningByMoves(line) && isLeafLine(line)) break;
    count++;
  }
  return count;
}

/**
 * `fens[i]` is the position before ply `i + 1`, so the endgame starts at the
 * first ply played with the board already stripped down.
 *
 * `fromInitialPosition` is false for a PGN that begins at a `[FEN]` header:
 * there the opening floor makes no sense — a study that starts in a rook ending
 * has no opening to report on, whatever the move numbers say.
 */
export function computeBounds(
  sans: readonly string[],
  fens: readonly string[],
  fromInitialPosition = true,
): PhaseBounds {
  let endgameStartPly: number | null = null;
  for (let i = 0; i < fens.length - 1; i++) {
    if (nonPawnMaterial(new Chess(fens[i]!)) <= ENDGAME_MATERIAL_CP) {
      endgameStartPly = i + 1;
      break;
    }
  }

  const floor = fromInitialPosition ? MIN_OPENING_PLIES : 0;
  const inBook = fromInitialPosition ? bookPlies(sans) : 0;
  const middlegameStartPly = Math.min(
    Math.max(inBook, floor) + 1,
    endgameStartPly ?? Number.MAX_SAFE_INTEGER,
    sans.length + 1,
  );

  return { middlegameStartPly, endgameStartPly };
}

export function phaseOfPly(ply: number, bounds: PhaseBounds): GamePhase {
  if (bounds.endgameStartPly !== null && ply >= bounds.endgameStartPly) return 'endgame';
  if (ply >= bounds.middlegameStartPly) return 'middlegame';
  return 'opening';
}
