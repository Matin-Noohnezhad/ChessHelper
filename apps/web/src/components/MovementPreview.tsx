import { useEffect, useRef, useState } from 'react';
import type { PieceSet } from './Piece.js';
import { Piece } from './Piece.js';
import { movementDuration, movementFrames } from '../boardAnimation.js';
import type { BoardAnimationSettings } from '../boardAnimation.js';
import { useReducedMotion } from './BoardAnimationContext.js';

export function MovementPreview({ movementStyle, movementSpeed, pieceSet }: BoardAnimationSettings & { pieceSet: PieceSet }) {
  const piece = useRef<HTMLSpanElement>(null);
  const [replay, setReplay] = useState(0);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    const element = piece.current;
    const duration = movementDuration({ movementStyle, movementSpeed });
    if (!element?.animate || reducedMotion || !duration) return;
    const animation = element.animate(movementFrames(-element.offsetWidth * 3, 0, movementStyle), { duration });
    return () => animation.cancel();
  }, [movementStyle, movementSpeed, reducedMotion, replay]);
  return <div className="movement-preview">
    <div className="movement-preview__board" aria-hidden="true">
      {[0, 1, 2, 3].map((square) => <span key={square} className="movement-preview__square" />)}
      <span ref={piece} className="movement-preview__piece"><Piece type="r" color="w" pieceSet={pieceSet} /></span>
    </div>
    <button type="button" onClick={() => setReplay((n) => n + 1)} disabled={reducedMotion || movementSpeed === 'off'}>
      Preview movement
    </button>
    {reducedMotion && <span className="settings-row__hint">Animations are off because your device prefers reduced motion.</span>}
  </div>;
}
