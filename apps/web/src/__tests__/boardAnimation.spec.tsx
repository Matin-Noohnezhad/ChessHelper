import { describe, expect, it } from 'vitest';
import { Chess } from '@coh/chess-core';
import { movementPlan, movementDuration, movementFrames } from '../boardAnimation.js';

describe('piece movement', () => {
  it('gives ChessBase a straight, constant-speed glide and distinct speed presets', () => {
    expect(movementFrames(-240, 160, 'chessbase')).toEqual([
      { transform: 'translate(-240px, 160px)', easing: 'linear' },
      { transform: 'translate(0px, 0px)' },
    ]);
    for (const [movementSpeed, duration] of [['fast', 70], ['medium', 100], ['slow', 300], ['off', 0]] as const) {
      expect(movementDuration({ movementStyle: 'chessbase', movementSpeed })).toBe(duration);
    }
  });
  it.each([
    ['start', 'e4', [{ from: 'e2', to: 'e4' }]],
    ['r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1', 'O-O', [{ from: 'e1', to: 'g1' }, { from: 'h1', to: 'f1' }]],
    ['r3k2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1', 'O-O-O', [{ from: 'e8', to: 'c8' }, { from: 'a8', to: 'd8' }]],
    ['4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1', 'exd6', [{ from: 'e5', to: 'd6' }]],
    ['4k3/P7/8/8/8/8/8/4K3 w - - 0 1', 'a8=N', [{ from: 'a7', to: 'a8' }]],
    ['1r2k3/P7/8/8/8/8/8/4K3 w - - 0 1', 'axb8=Q+', [{ from: 'a7', to: 'b8' }]],
  ])('animates %s / %s forward and backward', (fen, san, expected) => {
    const game = new Chess(fen === 'start' ? undefined : fen);
    const previous = { fen: game.fen(), lastMove: null };
    const lastMove = game.move(san)!;
    expect(lastMove).not.toBeNull();
    const next = { fen: game.fen(), lastMove };
    expect(movementPlan(previous, next)).toEqual(expected);
    expect(movementPlan(next, previous)).toEqual(expected.map(({ from, to }) => ({ from: to, to: from })));
  });

  it('does not animate position jumps or an unchanged board', () => {
    const game = new Chess();
    const previous = { fen: game.fen(), lastMove: null };
    game.move('e4');
    game.move('e5');
    const lastMove = game.move('Nf3');
    const next = { fen: game.fen(), lastMove };
    expect(movementPlan(previous, next)).toEqual([]);
    expect(movementPlan(next, next)).toEqual([]);
  });

  it('preserves the original glide and supplies the standard Chess.com speed presets', () => {
    expect(movementDuration({ movementStyle: 'lichess', movementSpeed: 'medium' })).toBe(190);
    for (const [movementSpeed, duration] of [['fast', 100], ['medium', 180], ['slow', 500], ['off', 0]] as const) {
      expect(movementDuration({ movementStyle: 'chesscom', movementSpeed })).toBe(duration);
    }
    const frames = movementFrames(100, -200, 'chesscom');
    expect(frames[0]?.transform).toBe('translate(100px, -200px)');
    expect(frames[10]?.transform).toBe('translate(87.5px, -175px)');
    expect(frames[20]?.transform).toBe('translate(50px, -100px)');
    expect(frames[40]?.transform).toBe('translate(0px, 0px)');
    expect(movementFrames(100, 0, 'lichess')[0]?.easing).toContain('cubic-bezier');
  });
});
