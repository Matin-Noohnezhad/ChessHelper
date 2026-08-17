import { useMemo } from 'react';
import type { Chess, ColorName, PieceSymbol } from '@coh/chess-core';
import { Piece } from './Piece.js';

/**
 * Captured material and the running balance, the strip ChessBase keeps beside
 * the board. Derived entirely from the position — a piece missing from the
 * board was captured, whatever route the game took to get there.
 */

const FULL_SET: Record<Exclude<PieceSymbol, 'k'>, number> = { q: 1, r: 2, b: 2, n: 2, p: 8 };
const VALUES: Record<PieceSymbol, number> = { k: 0, q: 9, r: 5, b: 3, n: 3, p: 1 };
const ORDER: Exclude<PieceSymbol, 'k'>[] = ['q', 'r', 'b', 'n', 'p'];

export function MaterialBar({ game, side }: { game: Chess; side: ColorName }) {
  const { taken, edge } = useMemo(() => {
    const counts = new Map<string, number>();
    for (const cell of game.board()) {
      if (!cell) continue;
      const key = cell.color + cell.type;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    const missing = (color: ColorName) =>
      ORDER.flatMap((type) => {
        const gone = FULL_SET[type] - (counts.get(color + type) ?? 0);
        return Array.from({ length: Math.max(0, gone) }, () => type);
      });

    const score = (color: ColorName) =>
      ORDER.reduce((sum, type) => sum + (counts.get(color + type) ?? 0) * VALUES[type], 0);

    const other: ColorName = side === 'w' ? 'b' : 'w';
    return { taken: missing(other), edge: score(side) - score(other) };
  }, [game, side]);

  return (
    <div className="material" aria-label={`Material captured by ${side === 'w' ? 'White' : 'Black'}`}>
      <span className="material__pieces">
        {taken.map((type, i) => (
          <Piece key={i} type={type} color={side === 'w' ? 'b' : 'w'} />
        ))}
      </span>
      {edge > 0 && <span className="material__edge">+{edge}</span>}
    </div>
  );
}
