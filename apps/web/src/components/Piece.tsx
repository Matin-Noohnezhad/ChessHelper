import { createContext, useContext } from 'react';
import type { ColorName, PieceSymbol } from '@coh/chess-core';

export const PIECE_SETS = [
  { key: 'original', label: 'Classic' },
  { key: 'club', label: 'Club', note: 'Rounded, chess.com-inspired' },
  { key: 'cburnett', label: 'Cburnett', note: 'Lichess' },
  { key: 'merida', label: 'Merida', note: 'Lichess' },
] as const;
export type PieceSet = typeof PIECE_SETS[number]['key'];
export const PieceSetContext = createContext<PieceSet>('original');

const NAMES: Record<PieceSymbol, string> = {
  k: 'king', q: 'queen', r: 'rook', b: 'bishop', n: 'knight', p: 'pawn',
};

interface PieceProps {
  type: PieceSymbol;
  color: ColorName;
  dragging?: boolean;
  pieceSet?: PieceSet;
}

/** Original vector Staunton pieces, with generous margins and consistent bases. */
export function Piece({ type, color, dragging, pieceSet }: PieceProps) {
  const preferred = useContext(PieceSetContext);
  const set = pieceSet ?? preferred;
  if (set === 'cburnett' || set === 'merida') return (
    <img className={`piece piece--${color}${dragging ? ' piece--dragging' : ''}`}
      src={`/pieces/${set}/${color}${type.toUpperCase()}.svg`}
      alt={`${color === 'w' ? 'white' : 'black'} ${NAMES[type]}`} draggable={false} />
  );
  if (set === 'club') return <ClubPiece type={type} color={color} dragging={dragging} />;
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

/** Original rounded silhouettes with broad bases and high-contrast details. */
function ClubPiece({ type, color, dragging }: PieceProps) {
  const profiles: Record<PieceSymbol, string> = {
    p: 'M25 28a10 10 0 1 1 14 0c-3 7-1 12 5 19H20c6-7 8-12 5-19Z',
    r: 'M15 11h9v8h4v-8h8v8h4v-8h9v18l-7 5v12H22V34l-7-5Z',
    n: 'M18 47c0-10 7-17 16-24l-12 6-9-5 13-12 2-8 8 8c15 1 16 20 11 35Z',
    b: 'M32 8c-5 7-14 12-14 21 0 6 5 9 10 10l-8 8h24l-8-8c5-1 10-4 10-10 0-9-9-14-14-21Z',
    q: 'M13 20l10 8 9-15 9 15 10-8-9 24 3 4H19l3-4Z',
    k: 'M28 6h8v6h6v7H22v-7h6ZM32 29c-6-14-23-8-18 4l9 11-4 4h26l-4-4 9-11c5-12-12-18-18-4Z',
  };
  return <svg className={`piece piece--club piece--${color}${dragging ? ' piece--dragging' : ''}`}
    viewBox="0 0 64 64" role="img" aria-label={`${color === 'w' ? 'white' : 'black'} ${NAMES[type]}`}>
    <g className="piece__body" strokeLinejoin="round" strokeLinecap="round">
      <path d={profiles[type]} />
      {type === 'q' && <><circle cx="13" cy="18" r="3" /><circle cx="32" cy="11" r="3" /><circle cx="51" cy="18" r="3" /></>}
      <path d="M20 45h24l5 7v5H15v-5Z" />
    </g>
    <path className="piece__line" d="M21 51h22" />
    {type === 'b' && <path className="piece__line" d="m36 18-9 12" />}
    {type === 'n' && <circle className="piece__eye" cx="29" cy="19" r="2" />}
    {type === 'r' && <path className="piece__line" d="M20 29h24" />}
    {type === 'k' && <path className="piece__line" d="M32 28v11" />}
  </svg>;
}
