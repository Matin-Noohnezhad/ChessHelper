import type { ColorName, PieceSymbol } from '@coh/chess-core';

/**
 * Pieces are drawn with the solid Unicode glyphs and recoloured, so the app
 * ships with no image assets at all. White pieces are the same glyph filled
 * light with a dark outline — the standard trick, and it keeps both colours
 * legible on either square shade. Swapping in SVG sprites later means changing
 * this one component.
 */
const GLYPHS: Record<PieceSymbol, string> = {
  k: '♚',
  q: '♛',
  r: '♜',
  b: '♝',
  n: '♞',
  p: '♟',
};

const NAMES: Record<PieceSymbol, string> = {
  k: 'king',
  q: 'queen',
  r: 'rook',
  b: 'bishop',
  n: 'knight',
  p: 'pawn',
};

interface PieceProps {
  type: PieceSymbol;
  color: ColorName;
  dragging?: boolean;
}

export function Piece({ type, color, dragging }: PieceProps) {
  return (
    <span
      className={`piece piece--${color}${dragging ? ' piece--dragging' : ''}`}
      role="img"
      aria-label={`${color === 'w' ? 'white' : 'black'} ${NAMES[type]}`}
    >
      {GLYPHS[type]}
    </span>
  );
}
