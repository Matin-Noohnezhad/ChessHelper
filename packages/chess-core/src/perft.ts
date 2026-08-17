/**
 * Perft: count leaf nodes of the legal move tree to a fixed depth.
 *
 * This is the only honest way to know the rules are right. Every published
 * node count below has to match exactly — a single wrong number means a bug in
 * generation, make, or unmake, and it is far cheaper to find it here than in a
 * training session three packages up.
 */

import { Position } from './position.js';
import { generatePseudoLegal } from './movegen.js';
import { moveToUci } from './move.js';
import type { Move } from './move.js';

export function perft(pos: Position, depth: number): number {
  if (depth === 0) return 1;
  const moves: Move[] = [];
  generatePseudoLegal(pos, moves);
  const us = pos.turn;
  let nodes = 0;

  for (const move of moves) {
    pos.make(move);
    if (!pos.isKingAttacked(us)) {
      nodes += depth === 1 ? 1 : perft(pos, depth - 1);
    }
    pos.unmake();
  }
  return nodes;
}

/** Per-move breakdown, which is how you actually localise a perft mismatch. */
export function perftDivide(pos: Position, depth: number): Map<string, number> {
  const result = new Map<string, number>();
  const moves: Move[] = [];
  generatePseudoLegal(pos, moves);
  const us = pos.turn;

  for (const move of moves) {
    pos.make(move);
    if (!pos.isKingAttacked(us)) result.set(moveToUci(move), perft(pos, depth - 1));
    pos.unmake();
  }
  return result;
}
