import type { GameReview } from '@coh/review';
import { parseTimeControl } from '@coh/review';
import { START_FEN } from '@coh/chess-core';

/** Recorded time at this position; a missing entry is unknown, never a future clock. */
export function reviewClocks(review: GameReview, ply: number): { w: number | null; b: number | null } {
  const startFen = review.moves[0]?.fenBefore ?? review.headers.FEN;
  const startsAtInitialPosition = !startFen || startFen === START_FEN;
  const initial = startsAtInitialPosition ? parseTimeControl(review.headers.TimeControl).initialSeconds : null;
  const clocks = { w: initial, b: initial };
  for (const move of review.moves.slice(0, ply)) clocks[move.color] = move.clockSeconds;
  return clocks;
}
export function formatClock(seconds: number): string {
  const tenths = Math.round(Math.max(0, seconds) * 10);
  const whole = Math.floor(tenths / 10);
  const hours = Math.floor(whole / 3600);
  const minutes = Math.floor((whole % 3600) / 60);
  const rest = String(whole % 60).padStart(2, '0');
  return `${hours ? `${hours}:${String(minutes).padStart(2, '0')}` : minutes}:${rest}${tenths % 10 ? `.${tenths % 10}` : ''}`;
}
export function ReviewPlayer({ review, color, seconds, showClock, active }: {
  review: GameReview;
  color: 'w' | 'b';
  seconds: number | null;
  showClock: boolean;
  active: boolean;
}) {
  const player = color === 'w' ? review.white : review.black;
  const side = color === 'w' ? 'White' : 'Black';
  return <div className={`review-player${active ? ' is-to-move' : ''}`} data-player-color={color}>
    <span className="review-player__identity"><span className={`review-player__piece review-player__piece--${color}`} aria-label={side}>●</span>
      <strong>{player.name || side}</strong>{player.elo !== null && <span className="muted">{player.elo}</span>}
    </span>
    {showClock && <span className="review-player__clock" aria-label={`${side} clock: ${seconds === null ? 'unavailable' : formatClock(seconds)}`}>{seconds === null ? '—' : formatClock(seconds)}</span>}
  </div>;
}
