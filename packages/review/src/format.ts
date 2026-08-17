/** Small shared formatters, kept here so the package and the UI print scores identically. */

import type { Score } from './types.js';

/** "+0.35", "-1.20", "#3", "#-3" — always from White's point of view. */
export function formatScore(score: Score): string {
  if (score.mate !== null) return `#${score.mate}`;
  const pawns = (score.cp ?? 0) / 100;
  return `${pawns > 0 ? '+' : ''}${pawns.toFixed(2)}`;
}

/** "1.4 pawns", "half a pawn" — for prose rather than tables. */
export function formatPawns(centipawns: number): string {
  const pawns = Math.abs(centipawns) / 100;
  if (pawns < 0.75) return 'half a pawn';
  return `${pawns.toFixed(1)} pawns`;
}

/** "1:23", "12s", "2:03:11" — clock-shaped durations. */
export function formatSeconds(seconds: number): string {
  if (seconds < 10) return `${seconds.toFixed(1)}s`;
  const total = Math.round(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  if (hours) return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  if (minutes) return `${minutes}:${String(secs).padStart(2, '0')}`;
  return `${secs}s`;
}
