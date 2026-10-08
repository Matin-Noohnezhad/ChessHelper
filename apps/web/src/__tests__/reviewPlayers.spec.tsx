import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Chess } from '@coh/chess-core';
import { reviewPgn } from '@coh/review';
import type { PositionEvaluator } from '@coh/review';
import { formatClock, reviewClocks } from '../components/ReviewPlayer.js';
import { ReviewReport } from '../components/ReviewView.js';

const evaluator: PositionEvaluator = async (fen) => ({ fen, depth: 1,
  candidates: new Chess(fen).legalMoves().slice(0, 1).map((move) => ({ uci: move.uci, san: move.san, score: { cp: 0, mate: null } })),
});
const pgn = '[White "Alice"]\n[Black "Bob"]\n[TimeControl "300+2"]\n\n{[%csl Ge4]} 1. e4 {[%clk 0:04:59.5] [%cal Re2e4]} e5 {[%clk 0:04:58]} 2. Nf3 Nc6 {[%clk 0:04:55]} *';

describe('Review player clocks', () => {
  it('reads clocks and names from PGN, follows the displayed ply, and never shows a future or stale clock', async () => {
    const review = await reviewPgn(pgn, { evaluator });
    expect(reviewClocks(review, 0)).toEqual({ w: 300, b: 300 });
    expect(reviewClocks(review, 1)).toEqual({ w: 299.5, b: 300 });
    expect(reviewClocks(review, 2)).toEqual({ w: 299.5, b: 298 });
    expect(reviewClocks(review, 3)).toEqual({ w: null, b: 298 });
    expect(reviewClocks(review, 4)).toEqual({ w: null, b: 295 });
    expect(review.moves[0]!.shapes?.arrows[0]?.color).toBe('red');
    expect(review.initialShapes?.circles[0]?.square).toBe('e4');
    const html = renderToStaticMarkup(<ReviewReport review={review} onReset={() => {}} />);
    expect(html.indexOf('data-player-color="b"')).toBeLessThan(html.indexOf('class="board-row"'));
    expect(html.indexOf('data-player-color="w"')).toBeGreaterThan(html.indexOf('class="board-row"'));
    expect(html).toContain('White clock: 5:00');
    expect(html).toContain('Black clock: 5:00');
    expect(html).toContain('Alice');
    expect(html).toContain('Bob');
  });
  it('keeps unknown clocks unknown without a time control and omits clocks without annotations', async () => {
    const review = await reviewPgn('1. e4 {[%clk 0:02:00]} e5 *', { evaluator });
    expect(reviewClocks(review, 0)).toEqual({ w: null, b: null });
    expect(reviewClocks(review, 1)).toEqual({ w: 120, b: null });
    const plain = await reviewPgn('1. e4 e5 *', { evaluator });
    expect(renderToStaticMarkup(<ReviewReport review={plain} onReset={() => {}} />)).not.toContain('review-player__clock');
  });
  it('does not use the initial time control as the clock in a custom starting position', async () => {
    const review = await reviewPgn('[FEN "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2"]\n[TimeControl "300"]\n\n2. Nf3 {[%clk 0:03:00]} *', { evaluator });
    expect(reviewClocks(review, 0)).toEqual({ w: null, b: null });
    expect(reviewClocks(review, 1)).toEqual({ w: 180, b: null });
  });
  it('formats zero, fractional seconds and clocks longer than an hour', () => {
    expect([0, 59.5, 60, 3600, 3661.2].map(formatClock)).toEqual(['0:00', '0:59.5', '1:00', '1:00:00', '1:01:01.2']);
  });
});
