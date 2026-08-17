import { useMemo } from 'react';
import type { ColorName, PieceSymbol } from '@coh/chess-core';
import { Piece } from './Piece.js';

/**
 * A small, static board used to show pawn-structure skeletons. It reads the
 * FEN placement field directly — no game state, no interaction, no cost.
 */
export function MiniBoard({ fen, caption }: { fen: string; caption?: string }) {
  const cells = useMemo(() => parsePlacement(fen), [fen]);

  return (
    <figure className="mini-board">
      <div className="mini-board__grid">
        {cells.map((cell, index) => {
          const dark = ((index % 8) + Math.floor(index / 8)) % 2 === 1;
          return (
            <div key={index} className={`mini-square ${dark ? 'is-dark' : 'is-light'}`}>
              {cell && <Piece type={cell.type} color={cell.color} />}
            </div>
          );
        })}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

function parsePlacement(fen: string): ({ type: PieceSymbol; color: ColorName } | null)[] {
  const cells: ({ type: PieceSymbol; color: ColorName } | null)[] = [];
  for (const row of fen.split(' ')[0]!.split('/')) {
    for (const ch of row) {
      if (ch >= '1' && ch <= '8') {
        for (let i = 0; i < Number(ch); i++) cells.push(null);
      } else {
        cells.push({
          type: ch.toLowerCase() as PieceSymbol,
          color: ch === ch.toLowerCase() ? 'b' : 'w',
        });
      }
    }
  }
  return cells;
}
