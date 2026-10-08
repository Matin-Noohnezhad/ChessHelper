import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Chess, parseAnnotatedPgn } from '@coh/chess-core';
import { reviewPgn } from '@coh/review';
import type { PositionEvaluator } from '@coh/review';
import { exportExplorePgn, playTreeMove, positionAt, selectedLine, selectTreeNode } from '../exploreTree.js';
import { newReviewTree, reviewAnchor, selectReviewPly } from '../reviewTree.js';
import { ReviewMoveList } from '../components/ReviewMoveList.js';

const evaluator: PositionEvaluator = async (fen) => ({ fen, depth: 1, candidates: [] });

describe('Review analysis branches', () => {
  it('preserves the reviewed main line, nested branches and navigation choices', async () => {
    const review = await reviewPgn('1. e4 e5 2. Nf3 Nc6 *', { evaluator });
    const original = JSON.stringify(review);
    let tree = selectReviewPly(newReviewTree(review), 1, review.moves.length);
    for (const san of ['c5', 'Nf3', 'd6']) tree = playTreeMove(tree, san);
    const firstEnd = tree.selected;
    tree = selectTreeNode(tree, 5); // c5
    for (const san of ['Nc3', 'Nc6']) tree = playTreeMove(tree, san);
    expect(reviewAnchor(tree, review.moves.length)).toBe(1);
    const nestedEnd = tree.selected;
    tree = selectTreeNode(tree, 1);
    expect(selectedLine(tree).map((id) => tree.nodes[id]!.san)).toEqual(['e4', 'c5', 'Nc3', 'Nc6']);
    tree = selectReviewPly(tree, 1, review.moves.length);
    expect(selectedLine(tree).map((id) => tree.nodes[id]!.san)).toEqual(['e4', 'e5', 'Nf3', 'Nc6']);
    expect(positionAt(tree, firstEnd).history()).toEqual(['e4', 'c5', 'Nf3', 'd6']);
    expect(positionAt(tree, nestedEnd).history()).toEqual(['e4', 'c5', 'Nc3', 'Nc6']);
    const count = Object.keys(tree.nodes).length;
    tree = playTreeMove(tree, 'c5');
    expect(Object.keys(tree.nodes)).toHaveLength(count);
    expect(playTreeMove(tree, 'c6')).toBe(tree); // Black cannot move twice.
    expect(JSON.stringify(review)).toBe(original);
    expect(parseAnnotatedPgn(exportExplorePgn(tree)).moves.map((move) => move.san)).toEqual(review.moves.map((move) => move.san));
    const html = renderToStaticMarkup(<ReviewMoveList moves={review.moves} selectedPly={-1} tree={tree} onSelect={() => {}} onSelectNode={() => {}} showClocks={false} />);
    expect(html).toContain('Analysis variation');
    expect(html).toContain('c5');
    expect(html).toContain('d6');
    expect(html.match(/aria-current="step"/g)).toHaveLength(1);
  });

  it('supports root alternatives, continuations past the game, and a fresh report', async () => {
    const review = await reviewPgn('1. e4 e5 *', { evaluator });
    let tree = playTreeMove(newReviewTree(review), 'd4');
    expect(reviewAnchor(tree, 2)).toBe(0);
    tree = playTreeMove(selectReviewPly(tree, 2, 2), 'Nf3');
    expect(reviewAnchor(tree, 2)).toBe(2);
    const html = renderToStaticMarkup(<ReviewMoveList moves={review.moves} selectedPly={-1} tree={tree} onSelect={() => {}} onSelectNode={() => {}} showClocks={false} />);
    expect(html).toContain('d4');
    expect(html).toContain('Nf3');
    expect(Object.keys(newReviewTree(review).nodes)).toHaveLength(3);
  });

  it('plays and numbers moves correctly from a black-to-move custom FEN', async () => {
    const fen = '4k3/8/8/8/8/8/p7/4K3 b - - 0 23';
    const review = await reviewPgn(`[SetUp "1"]\n[FEN "${fen}"]\n\n23... a1=Q+ 24. Kf2 *`, { evaluator });
    let tree = newReviewTree(review);
    expect(positionAt(tree, 2).fen()).toBe(review.moves[1]!.fenAfter);
    tree = playTreeMove(tree, { from: 'a2', to: 'a1', promotion: 'n' });
    const board = new Chess(fen);
    board.move('a1=N');
    expect(positionAt(tree).fen()).toBe(board.fen());
    const html = renderToStaticMarkup(<ReviewMoveList moves={review.moves} selectedPly={-1} tree={tree} onSelect={() => {}} onSelectNode={() => {}} showClocks={false} />);
    expect(html).toContain('23…');
    expect(exportExplorePgn(tree)).toContain('23... a1=Q+ (23... a1=N)');
  });
});
