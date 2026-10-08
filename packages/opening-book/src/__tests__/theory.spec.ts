import { describe, expect, it } from 'vitest';
import { Chess } from '@coh/chess-core';
import { isTheoryMove, theoryFlags, theoryOpeningAt, theoryPositionKey, THEORY_STATS } from '../theory.js';

function after(sans: string): Chess {
  const board = new Chess();
  for (const san of sans.split(' ')) expect(board.move(san), san).not.toBeNull();
  return board;
}

// Repeated Marshall theory through 25...Rxe4, not a synthetic length fixture.
const DEEP_MARSHALL = 'e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 O-O c3 d5 exd5 Nxd5 Nxe5 Nxe5 Rxe5 c6 d3 Bd6 Re1 Bf5 Qf3 Qh4 g3 Qh3 Nd2 Rae8 Ne4 Bg4 Qg2 Qxg2+ Kxg2 f5 Bf4 Bxf4 gxf4 fxe4 dxe4 Bf3+ Kxf3 Rxf4+ Kg3 Rfxe4 Rxe4 Rxe4';

describe('position-based theory collection', () => {
  it('recognizes every ply of a documented 25-move line', () => {
    const moves = DEEP_MARSHALL.split(' ');
    expect(moves).toHaveLength(50);
    expect(theoryFlags(moves)).toEqual(Array(50).fill(true));
    expect(THEORY_STATS.namedLines).toBeGreaterThan(12000);
    expect(THEORY_STATS.masterLines).toBeGreaterThan(7000);
    expect(THEORY_STATS.deepestPly).toBeGreaterThanOrEqual(50);
  });

  it('recognizes alternate move orders and their opening names', () => {
    const canonical = after('d4 d5 c4 e6 Nc3 Nf6');
    const transposed = after('Nf3 Nf6 d4 e6 c4 d5 Nc3');
    expect(isTheoryMove(transposed.fen(), 'f8e7')).toBe(true);
    expect(theoryOpeningAt(canonical.fen())?.eco).toMatch(/^D/);
    expect(theoryFlags('Nf3 Nf6 d4 e6 c4 d5 Nc3 Be7'.split(' ')).every(Boolean)).toBe(true);
  });

  it('matches counters and irrelevant en-passant targets without merging legal rights', () => {
    const board = after('e4');
    const noTarget = board.fen().replace('e3', '-').replace(/0 1$/, '19 22');
    expect(theoryPositionKey(noTarget)).toBe(theoryPositionKey(board.fen()));
    expect(isTheoryMove(noTarget, 'c7c5')).toBe(true);
    const castle = after('e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6');
    expect(isTheoryMove(castle.fen(), 'e1g1')).toBe(true);
    expect(isTheoryMove(castle.fen().replace('KQkq', 'kq'), 'e1g1')).toBe(false);
    const ep = after('e4 a6 e5 d5').fen();
    expect(theoryPositionKey(ep)).not.toBe(theoryPositionKey(ep.replace('d6', '-')));
  });

  it('does not turn an unknown detour into book, but recognizes a later return', () => {
    const flags = theoryFlags('Nf3 Nf6 Ng1 Ng8 e4 e5'.split(' '));
    expect(flags[2]).toBe(false);
    expect(flags[3]).toBe(false);
    expect(flags.slice(4)).toEqual([true, true]);
  });
});
