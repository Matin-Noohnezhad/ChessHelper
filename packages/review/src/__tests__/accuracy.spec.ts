import { describe, expect, it } from 'vitest';
import {
  centipawnLoss,
  combineAccuracy,
  moveAccuracy,
  volatilityWeights,
  winPercent,
  winPercentFor,
} from '../accuracy.js';

describe('win expectancy', () => {
  it('is 50% at a dead level evaluation and symmetric around it', () => {
    expect(winPercent({ cp: 0, mate: null })).toBeCloseTo(50, 6);
    const up = winPercent({ cp: 200, mate: null });
    const down = winPercent({ cp: -200, mate: null });
    expect(up + down).toBeCloseTo(100, 6);
    expect(up).toBeGreaterThan(60);
  });

  it('saturates on a forced mate, in either direction', () => {
    expect(winPercent({ cp: null, mate: 3 })).toBe(100);
    expect(winPercent({ cp: null, mate: -3 })).toBe(0);
  });

  it('flips for Black', () => {
    const score = { cp: 300, mate: null };
    expect(winPercentFor(score, 'w') + winPercentFor(score, 'b')).toBeCloseTo(100, 6);
    expect(winPercentFor(score, 'b')).toBeLessThan(50);
  });

  it('treats a pawn as worth far more when the game is level', () => {
    const levelSwing = winPercent({ cp: 0, mate: null }) - winPercent({ cp: -100, mate: null });
    const wonSwing = winPercent({ cp: 900, mate: null }) - winPercent({ cp: 800, mate: null });
    expect(levelSwing).toBeGreaterThan(wonSwing * 2);
  });
});

describe('move accuracy', () => {
  it('is perfect when the evaluation does not drop', () => {
    expect(moveAccuracy(50, 50)).toBe(100);
    expect(moveAccuracy(40, 62)).toBe(100);
  });

  it('falls off with the expectancy given away, and never below zero', () => {
    const small = moveAccuracy(50, 48);
    const large = moveAccuracy(50, 20);
    expect(small).toBeGreaterThan(large);
    expect(small).toBeGreaterThan(90);
    expect(moveAccuracy(100, 0)).toBeGreaterThanOrEqual(0);
  });
});

describe('aggregation', () => {
  it('punishes one catastrophe harder than the plain mean does', () => {
    const accuracies = [...Array(19).fill(100), 0];
    const weights = accuracies.map(() => 1);
    const plainMean = accuracies.reduce((a, b) => a + b, 0) / accuracies.length;
    expect(combineAccuracy(accuracies, weights)!).toBeLessThan(plainMean);
  });

  it('returns null with nothing to average', () => {
    expect(combineAccuracy([], [])).toBeNull();
  });

  it('weights the moves played while the evaluation was swinging', () => {
    const calm = volatilityWeights([50, 50, 50, 50, 50, 50, 50, 50]);
    const wild = volatilityWeights([50, 10, 80, 20, 90, 30, 70, 40]);
    expect(Math.max(...wild)).toBeGreaterThan(Math.max(...calm));
    // Clamped at both ends so neither extreme dominates a whole game.
    expect(Math.min(...calm)).toBeGreaterThanOrEqual(0.5);
    expect(Math.max(...wild)).toBeLessThanOrEqual(12);
  });
});

describe('centipawn loss', () => {
  it('measures the drop from the mover’s point of view only', () => {
    expect(centipawnLoss({ cp: 100, mate: null }, { cp: -50, mate: null }, 'w')).toBe(150);
    expect(centipawnLoss({ cp: 100, mate: null }, { cp: -50, mate: null }, 'b')).toBe(0);
    expect(centipawnLoss({ cp: -50, mate: null }, { cp: 100, mate: null }, 'b')).toBe(150);
  });

  it('keeps a missed mate finite so averages survive it', () => {
    const loss = centipawnLoss({ cp: null, mate: 2 }, { cp: 0, mate: null }, 'w');
    expect(loss).toBeGreaterThan(1000);
    expect(Number.isFinite(loss)).toBe(true);
  });
});
