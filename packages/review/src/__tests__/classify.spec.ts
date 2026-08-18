import { describe, expect, it } from 'vitest';
import { classifyMove } from '../classify.js';
import type { ClassifyInput } from '../classify.js';
import type { CandidateMove } from '../types.js';

const candidate = (uci: string, cp: number): CandidateMove => ({
  uci,
  san: uci,
  score: { cp, mate: null },
});

/** A quiet, equal position where the played move was also the engine's. */
function input(overrides: Partial<ClassifyInput> = {}): ClassifyInput {
  return {
    isBook: false,
    legalCount: 30,
    playedUci: 'g1f3',
    candidates: [candidate('g1f3', 20), candidate('b1c3', 10)],
    winBefore: 52,
    winAfter: 52,
    winSecondBest: 50,
    mateAvailable: false,
    keepsMate: false,
    investedCp: 0,
    isRecapture: false,
    inTimePressure: false,
    ...overrides,
  };
}

describe('move classification', () => {
  it('calls the engine’s own move best', () => {
    expect(classifyMove(input()).quality).toBe('best');
  });

  it('labels theory as theory, even when it is also the best move', () => {
    expect(classifyMove(input({ isBook: true })).quality).toBe('book');
  });

  it('calls a position with one legal reply forced, and tags it', () => {
    const result = classifyMove(input({ legalCount: 1, playedUci: 'e1e2' }));
    expect(result.quality).toBe('forced');
    expect(result.tags).toContain('only-move');
  });

  it('walks the ladder from excellent to blunder as expectancy is given away', () => {
    const played = { playedUci: 'a2a3' };
    const at = (winAfter: number) =>
      classifyMove(input({ ...played, winBefore: 55, winAfter })).quality;
    expect(at(54)).toBe('excellent');
    expect(at(51)).toBe('good');
    expect(at(48)).toBe('inaccuracy');
    expect(at(40)).toBe('mistake');
    expect(at(20)).toBe('blunder');
  });

  it('calls throwing away a won position a miss rather than a blunder', () => {
    const result = classifyMove(
      input({ playedUci: 'a2a3', winBefore: 88, winAfter: 45, winSecondBest: 80 }),
    );
    expect(result.quality).toBe('miss');
  });

  it('calls a missed forced mate a miss', () => {
    const result = classifyMove(
      input({
        playedUci: 'a2a3',
        candidates: [
          { uci: 'd1h5', san: 'Qh5#', score: { cp: null, mate: 1 } },
          candidate('b1c3', 300),
        ],
        winBefore: 100,
        winAfter: 70,
        winSecondBest: 85,
        mateAvailable: true,
        keepsMate: false,
      }),
    );
    expect(result.quality).toBe('miss');
  });

  it('celebrates a sound sacrifice and tags the material', () => {
    const result = classifyMove(
      input({ investedCp: 330, winBefore: 60, winAfter: 60, winSecondBest: 55 }),
    );
    expect(result.quality).toBe('brilliant');
    expect(result.tags).toContain('sacrifice');
  });

  it('does not call a sacrifice brilliant when it simply loses', () => {
    const result = classifyMove(
      input({ playedUci: 'a2a3', investedCp: 330, winBefore: 55, winAfter: 15 }),
    );
    expect(result.quality).toBe('blunder');
    expect(result.tags).toContain('sacrifice');
  });

  it('does not call giving material back in a won game brilliant', () => {
    const result = classifyMove(input({ investedCp: 500, winBefore: 99, winAfter: 99 }));
    expect(result.quality).toBe('best');
  });

  it('calls the one move that holds great, and marks the moment critical', () => {
    const result = classifyMove(
      input({
        winBefore: 50,
        winAfter: 50,
        winSecondBest: 18,
        candidates: [candidate('g1f3', 0), candidate('b1c3', -300)],
      }),
    );
    expect(result.quality).toBe('great');
    expect(result.tags).toEqual(expect.arrayContaining(['only-move', 'critical']));
  });

  it('will not call taking back on the same square great', () => {
    const onlyMove = {
      winBefore: 50,
      winAfter: 50,
      winSecondBest: 18,
      candidates: [candidate('g1f3', 0), candidate('b1c3', -300)],
    };
    expect(classifyMove(input(onlyMove)).quality).toBe('great');
    expect(classifyMove(input({ ...onlyMove, isRecapture: true })).quality).toBe('best');
  });

  it('stays "best" when the runner-up was also perfectly playable', () => {
    const result = classifyMove(input({ winBefore: 95, winAfter: 95, winSecondBest: 70 }));
    expect(result.quality).toBe('best');
  });

  it('records that a move was made in time pressure', () => {
    expect(classifyMove(input({ inTimePressure: true })).tags).toContain('time-pressure');
  });
});
