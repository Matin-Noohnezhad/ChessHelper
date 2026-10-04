import { describe, expect, it } from 'vitest';
import { Chess } from '@coh/chess-core';
import { suggestPlans } from '../plans.js';

describe('position plans', () => {
  it('gives development advice even when the position is symmetric', () => {
    const game = new Chess();
    const before = game.fen();
    const plans = suggestPlans(game);
    expect(plans.white.find((p) => p.id === 'development')?.reason).toContain('b1');
    expect(plans.black.find((p) => p.id === 'development')?.reason).toContain('b8');
    expect(game.fen()).toBe(before);
  });

  it('stops proposing castling when castling rights are gone', () => {
    const game = new Chess();
    const fen = game.fen().replace('KQkq', '-');
    expect(suggestPlans(game).white.find((p) => p.id === 'king-safety')?.action).toContain('castling');
    expect(suggestPlans(new Chess(fen)).white.find((p) => p.id === 'king-safety')?.action).not.toContain('castling');
  });

  it('recognizes passed pawns in both directions and updates after a pawn capture', () => {
    const game = new Chess('4k3/8/4p3/3P4/8/8/8/4K3 w - - 0 1');
    expect(suggestPlans(game).white.some((p) => p.id === 'passed-pawns')).toBe(false);
    expect(suggestPlans(game).black.some((p) => p.id === 'passed-pawns')).toBe(false);
    expect(game.move('dxe6')).not.toBeNull();
    expect(suggestPlans(game).white.find((p) => p.id === 'passed-pawns')?.reason).toContain('e6');
    expect(suggestPlans(game).black.find((p) => p.id === 'blockade')?.reason).toContain('e6');
    const black = new Chess('4k3/8/8/8/3p4/8/8/4K3 b - - 0 1');
    expect(suggestPlans(black).black.find((p) => p.id === 'passed-pawns')?.reason).toContain('d4');
  });

  it('only recommends rook files to a side with a rook', () => {
    const game = new Chess('4k3/ppp2ppp/8/8/8/8/PPP2PPP/R3K3 w - - 0 1');
    const plans = suggestPlans(game);
    expect(plans.white.find((p) => p.id === 'rook-files')?.reason).toContain('d, e files are open');
    expect(plans.black.some((p) => p.id === 'rook-files')).toBe(false);
  });

  it('offers king activity rather than opening development in a pawn ending', () => {
    const plans = suggestPlans(new Chess('4k3/3p4/8/8/8/8/3P4/4K3 w - - 0 1'));
    for (const side of ['white', 'black'] as const) {
      expect(plans[side].some((p) => p.id === 'king-activity')).toBe(true);
      expect(plans[side].some((p) => p.id === 'development' || p.id === 'king-safety')).toBe(false);
    }
  });

  it('prioritizes a check response over strategic plans', () => {
    const plans = suggestPlans(new Chess('4k3/8/8/8/8/8/4r3/4K3 w - - 0 1'));
    expect(plans.status).toBe('check');
    expect(plans.white.map((p) => p.id)).toEqual(['check']);
    expect(plans.black).toEqual([]);
  });

  it.each([
    '7k/6Q1/5K2/8/8/8/8/8 b - - 0 1', // mate
    '7k/5Q2/5K2/8/8/8/8/8 b - - 0 1', // stalemate
    '4k3/8/8/8/8/8/8/4K3 w - - 0 1', // insufficient material
  ])('does not give playing plans for a finished position: %s', (fen) => {
    expect(suggestPlans(new Chess(fen))).toEqual({ status: 'finished', white: [], black: [] });
  });
});
