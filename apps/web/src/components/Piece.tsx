import type { ColorName, PieceSymbol } from '@coh/chess-core';

const NAMES: Record<PieceSymbol, string> = {
  k: 'king', q: 'queen', r: 'rook', b: 'bishop', n: 'knight', p: 'pawn',
};

interface PieceProps {
  type: PieceSymbol;
  color: ColorName;
  dragging?: boolean;
}

/** Original vector Staunton pieces, with generous margins and consistent bases. */
export function Piece({ type, color, dragging }: PieceProps) {
  const detail = (() => {
    switch (type) {
      case 'p': return <>
        <path d="M24 43c5-5 6-10 3-15a8 8 0 1 1 10 0c-3 5-2 10 3 15l3 5H21z" />
        <path className="piece__line" d="M26 30h12M24 43h16" />
      </>;
      case 'r': return <>
        <path d="M18 13h7v7h4v-7h6v7h4v-7h7v15l-5 4v12l4 4H19l4-4V32l-5-4z" />
        <path className="piece__line" d="M19 27h26M24 33h16M23 44h18" />
      </>;
      case 'n': return <>
        <path d="M18 48c0-8 7-14 13-20l-7 4-7-1-2-5 10-10 3-7 5 5c14 0 17 16 14 34z" />
        <path className="piece__line" d="M33 18c9 5 10 17 6 25M18 27l5 1M28 15l3 3" />
        <circle className="piece__eye" cx="28" cy="22" r="1.6" />
      </>;
      case 'b': return <>
        <path d="M32 12c-4 5-11 10-11 17 0 5 4 8 8 9l-5 7-4 3h24l-4-3-5-7c4-1 8-4 8-9 0-7-7-12-11-17z" />
        <path className="piece__line" d="m35 19-7 11M27 38h10M24 44h16" />
        <circle cx="32" cy="10" r="2.6" />
      </>;
      case 'q': return <>
        <path d="m16 20 6 19c2 4 1 6-2 9h24c-3-3-4-5-2-9l6-19-10 11-6-17-6 17z" />
        <circle cx="16" cy="18" r="3" /><circle cx="32" cy="12" r="3" />
        <circle cx="48" cy="18" r="3" />
        <path className="piece__line" d="M22 39q10-4 20 0M24 44h16" />
      </>;
      case 'k': return <>
        <path d="M30 7h4v5h5v4h-5v7h-4v-7h-5v-4h5z" />
        <path d="M32 26c-6-12-20-7-16 3l8 12-4 7h24l-4-7 8-12c4-10-10-15-16-3z" />
        <path className="piece__line" d="M32 26v10M24 40q8-3 16 0M23 44h18" />
      </>;
    }
  })();

  return (
    <svg
      className={`piece piece--${color}${dragging ? ' piece--dragging' : ''}`}
      viewBox="0 0 64 64"
      role="img"
      aria-label={`${color === 'w' ? 'white' : 'black'} ${NAMES[type]}`}
    >
      <g className="piece__body" strokeLinejoin="round" strokeLinecap="round">{detail}</g>
      <path className="piece__base" d="M22 47h20l4 5v5H18v-5z" strokeLinejoin="round" />
      <path className="piece__base-line" d="M20 52h24" />
    </svg>
  );
}
