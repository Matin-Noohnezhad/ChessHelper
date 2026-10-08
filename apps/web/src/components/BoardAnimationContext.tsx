import { createContext, useContext, useSyncExternalStore } from 'react';
import { DEFAULT_BOARD_ANIMATION } from '../boardAnimation.js';

export const BoardAnimationContext = createContext(DEFAULT_BOARD_ANIMATION);
export const useBoardAnimationSettings = () => useContext(BoardAnimationContext);

const reducedMotionQuery = '(prefers-reduced-motion: reduce)';
function readReducedMotion(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia?.(reducedMotionQuery).matches;
}
function subscribeReducedMotion(update: () => void): () => void {
  const media = window.matchMedia?.(reducedMotionQuery);
  media?.addEventListener('change', update);
  return () => media?.removeEventListener('change', update);
}
const serverReducedMotion = () => false;

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReducedMotion, readReducedMotion, serverReducedMotion);
}
