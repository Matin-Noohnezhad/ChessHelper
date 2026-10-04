import { Chess } from '@coh/chess-core';
import { THEORY_STATS, THEORY_TSV } from './theory.generated.js';
import { theoryPositionKey } from './theory-position.js';

export { THEORY_STATS, theoryPositionKey };
export interface TheoryOpening { eco: string; name: string }
interface TheoryPosition { moves: Set<string>; opening?: TheoryOpening }
let index: Map<string, TheoryPosition> | undefined;
function getIndex(): Map<string, TheoryPosition> {
  if (!index) {
    index = new Map();
    for (const row of THEORY_TSV.split('\n')) {
      const [position, moves, eco, name] = row.split('\t');
      index.set(position, {
        moves: new Set(moves ? moves.split(' ') : []),
        ...(eco && name ? { opening: { eco, name } } : {}),
      });
    }
  }
  return index;
}

/** An actual book edge, not merely a familiar position or an engine's best move. */
export function isTheoryMove(fenBefore: string, uci: string): boolean {
  return getIndex().get(theoryPositionKey(fenBefore))?.moves.has(uci) ?? false;
}

export function theoryOpeningAt(fen: string): TheoryOpening | undefined {
  return getIndex().get(theoryPositionKey(fen))?.opening;
}

/** One flag per played ply. Known continuations can re-enter book after a deviation. */
export function theoryFlags(sans: readonly string[], startFen?: string): boolean[] {
  const board = new Chess(startFen);
  return sans.map((san) => {
    const before = board.fen();
    const move = board.move(san);
    return !!move && isTheoryMove(before, move.uci);
  });
}
