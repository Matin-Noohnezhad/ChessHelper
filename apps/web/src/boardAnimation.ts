import { Chess } from '@coh/chess-core';

export const MOVEMENT_STYLES = [
  { key: 'lichess', label: 'Lichess', description: 'The original Lichess-style glide: a quick start with a gentle finish.' },
  { key: 'chesscom', label: 'Chess.com', description: 'Chess.com-style standard movement: build speed, then smoothly settle on the square.' },
  { key: 'chessbase', label: 'ChessBase', description: 'ChessBase-style standard movement: a quick, even glide from square to square.' },
] as const;
export type MovementStyle = typeof MOVEMENT_STYLES[number]['key'];
export const MOVEMENT_SPEEDS = [
  { key: 'fast', label: 'Fast' },
  { key: 'medium', label: 'Medium' },
  { key: 'slow', label: 'Slow' },
  { key: 'off', label: 'Off' },
] as const;
export type MovementSpeed = typeof MOVEMENT_SPEEDS[number]['key'];
export interface BoardAnimationSettings {
  movementStyle: MovementStyle;
  movementSpeed: MovementSpeed;
}
export const DEFAULT_BOARD_ANIMATION: BoardAnimationSettings = {
  movementStyle: 'lichess', movementSpeed: 'medium',
};

export function movementDuration({ movementStyle, movementSpeed }: BoardAnimationSettings): number {
  if (movementSpeed === 'off') return 0;
  // ChessBase's public 2D renderer uses a short linear glide. These are app
  // speed presets inspired by it, not values from the desktop animation slider.
  if (movementStyle === 'chessbase') return { fast: 70, medium: 100, slow: 300 }[movementSpeed];
  // Chess.com's standard web presets, checked on its live analysis board.
  // Keep the app's original 190 ms glide for Lichess / Medium.
  return { fast: 100, medium: movementStyle === 'chesscom' ? 180 : 190, slow: 500 }[movementSpeed];
}

export function movementFrames(dx: number, dy: number, style: MovementStyle): Keyframe[] {
  if (style === 'chessbase') return [
    { transform: `translate(${dx}px, ${dy}px)`, easing: 'linear' },
    { transform: 'translate(0px, 0px)' },
  ];
  if (style === 'lichess') return [
    { transform: `translate(${dx}px, ${dy}px)`, easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)' },
    { transform: 'translate(0px, 0px)' },
  ];
  // Sample a quadratic ease-in-out: the standard Chess.com glide builds speed
  // through the first half, then brakes symmetrically. Linear interpolation
  // between these samples also keeps the timing consistent on high-refresh displays.
  return Array.from({ length: 41 }, (_, i) => {
    const t = i / 40;
    const progress = t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) ** 2;
    return { offset: t, transform: `translate(${dx * (1 - progress)}px, ${dy * (1 - progress)}px)` };
  });
}

export interface BoardMove { from: string; to: string }
export interface AnimationPosition { fen: string; lastMove: BoardMove | null }

/** Only animate adjacent legal positions, never a reset or a jump to another line. */
export function movementPlan(previous: AnimationPosition, next: AnimationPosition): BoardMove[] {
  function forward(fromFen: string, toFen: string, move: BoardMove | null): BoardMove[] {
    if (!move) return [];
    const game = new Chess(fromFen);
    const promotion = new Chess(toFen).pieceAt(move.to)?.type;
    const played = game.move({ ...move, ...(promotion && ['q', 'r', 'b', 'n'].includes(promotion) ? { promotion } : {}) });
    if (!played || game.fen() !== toFen) return [];
    const moves = [{ from: move.from, to: move.to }];
    if (played.piece === 'k' && Math.abs(move.from.charCodeAt(0) - move.to.charCodeAt(0)) === 2) {
      const rank = move.from[1]!;
      moves.push(move.to[0] === 'g' ? { from: `h${rank}`, to: `f${rank}` } : { from: `a${rank}`, to: `d${rank}` });
    }
    return moves;
  }
  const ahead = forward(previous.fen, next.fen, next.lastMove);
  if (ahead.length) return ahead;
  return forward(next.fen, previous.fen, previous.lastMove).map(({ from, to }) => ({ from: to, to: from }));
}
