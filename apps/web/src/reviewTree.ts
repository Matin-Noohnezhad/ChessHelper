import type { GameReview } from '@coh/review';
import { newExploreTree, nodePath, playTreeMove, selectTreeNode, setTreeShapes } from './exploreTree.js';
import type { ExploreTree } from './exploreTree.js';

/** Original moves occupy IDs 1..N; any later move is always a side branch. */
export function newReviewTree(review: GameReview): ExploreTree {
  let tree = newExploreTree(review.moves[0]?.fenBefore);
  if (review.initialShapes) tree = setTreeShapes(tree, review.initialShapes);
  for (const move of review.moves) {
    tree = playTreeMove(tree, move.uci);
    if (move.shapes) tree = setTreeShapes(tree, move.shapes);
  }
  return selectTreeNode(tree, 0);
}

/** The original game position where the selected analysis branch started. */
export function reviewAnchor(tree: ExploreTree, mainLength: number): number {
  return nodePath(tree).filter((id) => id <= mainLength).at(-1) ?? 0;
}

/** Selecting the game explicitly restores its continuation preference. */
export function selectReviewPly(tree: ExploreTree, ply: number, mainLength: number): ExploreTree {
  const choices = { ...tree.choices };
  for (let id = 0; id < mainLength; id++) choices[id] = id + 1;
  return selectTreeNode({ ...tree, choices }, ply);
}
