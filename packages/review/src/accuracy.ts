/**
 * Turning evaluations into a percentage.
 *
 * Centipawns are the wrong unit for "how well did you play": giving up a pawn
 * in a dead-drawn rook ending barely matters, while the same pawn decides an
 * equal middlegame. So every score is first converted to a win expectancy, and
 * accuracy measures the expectancy the move gave away. The curve and the
 * aggregation are lichess's, which is also what chess.com's numbers track
 * closely enough that the two sites usually agree within a point or two.
 */

import type { ColorName } from '@coh/chess-core';
import type { Score } from './types.js';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** Win expectancy for White, 0–100, from a score in White's perspective. */
export function winPercent(score: Score): number {
  if (score.mate !== null) return score.mate > 0 ? 100 : 0;
  const cp = clamp(score.cp ?? 0, -1000, 1000);
  return 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * cp)) - 1);
}

/** The same number seen from one side of the board. */
export function winPercentFor(score: Score, color: ColorName): number {
  const white = winPercent(score);
  return color === 'w' ? white : 100 - white;
}

/**
 * How good a single move was, 0–100, given the win expectancy before and after
 * it. Exponential rather than linear: the first few points of expectancy hurt
 * far more than the twentieth, which is why a single blunder tanks a score in a
 * way that ten inaccuracies do not.
 */
export function moveAccuracy(winBefore: number, winAfter: number): number {
  if (winAfter >= winBefore) return 100;
  const raw = 103.1668 * Math.exp(-0.04354 * (winBefore - winAfter)) - 3.1669;
  return clamp(raw, 0, 100);
}

/** Population standard deviation. */
function stdev(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

/**
 * Per-position volatility weights over the whole game's win-expectancy series.
 *
 * A move made while the evaluation is swinging wildly counts for more than one
 * made in a position that has been dead level for twenty moves — otherwise a
 * long, safe shuffle would inflate the score of a game decided by two moves.
 * Weights are indexed by position (0 = the starting position), so a move played
 * at ply `p` uses `weights[p - 1]`.
 */
export function volatilityWeights(winSeries: number[]): number[] {
  const window = clamp(Math.floor(winSeries.length / 10), 2, 8);
  return winSeries.map((_, i) => {
    const start = Math.max(0, i - window + 1);
    const slice = winSeries.slice(start, i + 1);
    // Pad the opening, where there is no history to measure yet.
    while (slice.length < window) slice.unshift(winSeries[0] ?? 50);
    return clamp(stdev(slice), 0.5, 12);
  });
}

/**
 * Combines per-move accuracies into one number: the mean of a volatility-weighted
 * mean (which cares about the moves that mattered) and a harmonic mean (which
 * refuses to let a stack of easy moves bury one catastrophe).
 */
export function combineAccuracy(accuracies: number[], weights: number[]): number | null {
  if (!accuracies.length) return null;

  let weightedSum = 0;
  let weightTotal = 0;
  let reciprocalSum = 0;
  for (let i = 0; i < accuracies.length; i++) {
    const weight = weights[i] ?? 1;
    weightedSum += accuracies[i]! * weight;
    weightTotal += weight;
    // A zero would send the harmonic mean to zero for the whole game; floor it
    // at half a point, which is still a rout.
    reciprocalSum += 1 / Math.max(accuracies[i]!, 0.5);
  }
  const weightedMean = weightTotal ? weightedSum / weightTotal : 0;
  const harmonicMean = accuracies.length / reciprocalSum;
  return clamp((weightedMean + harmonicMean) / 2, 0, 100);
}

/** Plain mean, for the per-phase numbers where volatility weighting has too little to chew on. */
export function meanAccuracy(accuracies: number[]): number | null {
  if (!accuracies.length) return null;
  return accuracies.reduce((a, b) => a + b, 0) / accuracies.length;
}

/**
 * Centipawns lost by a move, from the mover's perspective, with mates mapped to
 * a large but finite number so a missed mate-in-5 does not make an average
 * infinite.
 */
export function centipawnLoss(before: Score, after: Score, color: ColorName): number {
  const toCp = (score: Score): number => {
    if (score.mate !== null) return score.mate > 0 ? 2000 : -2000;
    return clamp(score.cp ?? 0, -2000, 2000);
  };
  const sign = color === 'w' ? 1 : -1;
  return Math.max(0, (toCp(before) - toCp(after)) * sign);
}
