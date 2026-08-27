import { describe, expect, it } from 'vitest';
import {
  LEARNED_LEVEL,
  LEVELS,
  MAX_LEVEL,
  blankProgress,
  isDue,
  isLearned,
  recordAnswer,
} from '../scheduler.js';

const NOW = 1_700_000_000_000;
const HOUR = 60 * 60_000;
const DAY = 24 * HOUR;

describe('the ladder', () => {
  it('starts a move unlearned and due', () => {
    const fresh = blankProgress('k', NOW);
    expect(fresh.level).toBe(0);
    expect(isDue(fresh, NOW)).toBe(true);
    expect(isLearned(fresh)).toBe(false);
  });

  it('climbs a rung per correct answer, four hours to half a year', () => {
    let entry = blankProgress('k', NOW);
    const intervals: number[] = [];
    for (let i = 0; i < MAX_LEVEL; i++) {
      entry = recordAnswer(entry, { correct: true, now: NOW });
      intervals.push(entry.dueAt - NOW);
    }
    expect(intervals).toEqual([...LEVELS]);
    expect(entry.level).toBe(MAX_LEVEL);
    expect(entry.correct).toBe(MAX_LEVEL);
  });

  it('stops at the top rather than running off the end of the table', () => {
    let entry = blankProgress('k', NOW);
    for (let i = 0; i < MAX_LEVEL + 5; i++) entry = recordAnswer(entry, { correct: true, now: NOW });
    expect(entry.level).toBe(MAX_LEVEL);
    expect(entry.dueAt - NOW).toBe(LEVELS[MAX_LEVEL - 1]);
  });

  it('drops a missed move to the bottom, not down one rung', () => {
    let entry = blankProgress('k', NOW);
    for (let i = 0; i < 5; i++) entry = recordAnswer(entry, { correct: true, now: NOW });
    expect(entry.level).toBe(5);

    entry = recordAnswer(entry, { correct: false, now: NOW });
    expect(entry.level).toBe(1);
    expect(entry.dueAt - NOW).toBe(4 * HOUR);
    expect(entry.wrong).toBe(1);
    // Half-knowing a move is what loses the game; it comes back this afternoon.
    expect(entry.correct).toBe(5);
  });

  it('counts a move as learned only once it has survived a night', () => {
    let entry = blankProgress('k', NOW);
    entry = recordAnswer(entry, { correct: true, now: NOW });
    expect(isLearned(entry)).toBe(false);
    entry = recordAnswer(entry, { correct: true, now: NOW + 4 * HOUR });
    expect(isLearned(entry)).toBe(false);
    entry = recordAnswer(entry, { correct: true, now: NOW + DAY });
    expect(entry.level).toBe(LEARNED_LEVEL);
    expect(isLearned(entry)).toBe(true);
  });

  it('is not due until its date', () => {
    const entry = recordAnswer(blankProgress('k', NOW), { correct: true, now: NOW });
    expect(isDue(entry, NOW + HOUR)).toBe(false);
    expect(isDue(entry, NOW + 4 * HOUR)).toBe(true);
  });
});
