import type { ColorName, PieceSymbol } from '@coh/chess-core';
import { usePrefs } from '../theme/prefs.js';
import { PIECE_GLYPHS, PIECE_NAMES, PIECE_SHAPES } from './pieces/shapes.js';

/**
 * One piece, drawn by whichever set the user picked.
 *
 * Vector sets share a single set of Staunton outlines and differ only in
 * colour, stroke weight and whether a shading pass is laid over the top — that
 * is what separates the flat set from the moulded one. The Unicode set is kept
 * as a zero-geometry fallback.
 *
 * The class name stays exactly `piece piece--w|b`: the set is selected through
 * CSS variables from the document root, so nothing here needs to vary per set.
 */
interface PieceProps {
  type: PieceSymbol;
  color: ColorName;
  dragging?: boolean;
}

export function Piece({ type, color, dragging }: PieceProps) {
  const { set_ } = usePrefs();
  const label = `${color === 'w' ? 'white' : 'black'} ${PIECE_NAMES[type]}`;
  const className = `piece piece--${color}${dragging ? ' piece--dragging' : ''}`;

  if (set_.kind === 'glyph') {
    return (
      <span className={className} role="img" aria-label={label}>
        {PIECE_GLYPHS[type]}
      </span>
    );
  }

  return (
    <span className={className} role="img" aria-label={label}>
      <svg viewBox="0 0 45 45" focusable="false" aria-hidden="true">
        <g className="pbody">{PIECE_SHAPES[type]}</g>
        {set_.shaded && <g className="pshade">{PIECE_SHAPES[type]}</g>}
      </svg>
    </span>
  );
}
