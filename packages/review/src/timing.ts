/**
 * What the clocks in an annotated PGN can tell us.
 *
 * lichess and chess.com both write `[%clk]` after every move; some exports
 * write `[%emt]` (elapsed move time) instead. Either is enough to say how long
 * a move took, and therefore whether the blunder on move 34 was a chess mistake
 * or a clock one. Games without clocks review exactly the same, minus this.
 */

import type { MoveQuality, ReviewedMove, TimeReport } from './types.js';
import { meanAccuracy } from './accuracy.js';

/** The last tenth of the clock — where "I had no time" starts being true. */
export const TIME_PRESSURE_FRACTION = 0.1;
/** A move played this fast was not calculated. */
const HASTY_SECONDS = 3;

export interface TimeControl {
  initialSeconds: number | null;
  incrementSeconds: number;
}

/**
 * Parses the `TimeControl` header: `300+3`, `600`, `40/7200:1800`, `1/86400`
 * (correspondence) or `-`. Only the first period is used — a review does not
 * need to model a second time control it will probably never reach.
 */
export function parseTimeControl(header: string | undefined): TimeControl {
  const empty: TimeControl = { initialSeconds: null, incrementSeconds: 0 };
  if (!header || header === '-' || header === '?') return empty;

  const first = header.split(':')[0]!;
  const afterMoves = first.includes('/') ? first.slice(first.indexOf('/') + 1) : first;
  const match = /^(\d+)(?:\+(\d+(?:\.\d+)?))?$/.exec(afterMoves.trim());
  if (!match) return empty;
  return {
    initialSeconds: Number(match[1]),
    incrementSeconds: match[2] ? Number(match[2]) : 0,
  };
}

function median(values: number[]): number | null {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid]! : (sorted[mid - 1]! + sorted[mid]!) / 2;
}

/** Aggregates one side's clock usage; null when that side's moves carried no clock data. */
export function buildTimeReport(
  moves: readonly ReviewedMove[],
  control: TimeControl,
): TimeReport | null {
  const timed = moves.filter((move) => move.secondsSpent !== null);
  if (!timed.length) return null;

  const spent = timed.map((move) => move.secondsSpent!);
  const slowestMove = timed.reduce((worst, move) =>
    move.secondsSpent! > worst.secondsSpent! ? move : worst,
  );

  const pressured = moves.filter((move) => move.tags.includes('time-pressure'));
  const calm = moves.filter((move) => !move.tags.includes('time-pressure'));

  return {
    initialSeconds: control.initialSeconds,
    incrementSeconds: control.incrementSeconds,
    averageSeconds: spent.reduce((a, b) => a + b, 0) / spent.length,
    medianSeconds: median(spent),
    slowest: {
      ply: slowestMove.ply,
      san: slowestMove.san,
      seconds: slowestMove.secondsSpent!,
    },
    movesInTimePressure: pressured.length,
    accuracyInTimePressure: pressured.length
      ? meanAccuracy(pressured.map((move) => move.accuracy))
      : null,
    accuracyOutsideTimePressure: calm.length
      ? meanAccuracy(calm.map((move) => move.accuracy))
      : null,
    hastyMoves: timed.filter((move) => move.secondsSpent! < HASTY_SECONDS).length,
  };
}

/** Qualities worth calling out when they cluster in time pressure. */
export const COSTLY_QUALITIES: MoveQuality[] = ['inaccuracy', 'mistake', 'miss', 'blunder'];
