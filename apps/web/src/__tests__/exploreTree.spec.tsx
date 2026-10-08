import { describe, expect, it } from 'vitest';
import { Chess, parseAnnotatedPgn } from '@coh/chess-core';
import type { PgnMove, ShapeColor } from '@coh/chess-core';
import { deleteTreeLine, exportExplorePgn, newExploreTree, playTreeMove, positionAt, promoteTreeLine, selectedLine, selectTreeNode, setTreeShapes } from '../exploreTree.js';

function branchingTree() {
  let tree = newExploreTree();
  for (const san of ['e4', 'e5', 'Nf3']) tree = playTreeMove(tree, san);
  tree = selectTreeNode(tree, 1);
  for (const san of ['c5', 'Nf3', 'd6']) tree = playTreeMove(tree, san);
  tree = selectTreeNode(tree, 4);
  for (const san of ['Nc3', 'Nc6']) tree = playTreeMove(tree, san);
  return tree;
}
function assertLegal(moves: PgnMove[], fen = new Chess().fen()) {
  const board = new Chess(fen);
  for (const move of moves) {
    for (const variation of move.variations ?? []) assertLegal(variation, board.fen());
    expect(board.move(move.san), move.san).not.toBeNull();
  }
}
describe('Explore variations and PGN', () => {
  it('preserves all played branches and exports nested legal variations', () => {
    const tree = branchingTree();
    const parsed = parseAnnotatedPgn(exportExplorePgn(tree));
    expect(parsed.moves.map((m) => m.san)).toEqual(['e4', 'e5', 'Nf3']);
    const sicilian = parsed.moves[1]!.variations![0]!;
    expect(sicilian.map((m) => m.san)).toEqual(['c5', 'Nf3', 'd6']);
    expect(sicilian[1]!.variations![0]!.map((m) => m.san)).toEqual(['Nc3', 'Nc6']);
    assertLegal(parsed.moves);
  });
  it('reuses an existing move and remembers the chosen branch when stepping back', () => {
    let tree = branchingTree();
    tree = selectTreeNode(tree, 1);
    expect(selectedLine(tree).map((id) => tree.nodes[id]!.san)).toEqual(['e4', 'c5', 'Nc3', 'Nc6']);
    const count = Object.keys(tree.nodes).length;
    tree = playTreeMove(tree, 'c5');
    expect(tree.selected).toBe(4);
    expect(Object.keys(tree.nodes)).toHaveLength(count);
    expect(playTreeMove(tree, 'e6')).toBe(tree); // illegal white move
  });
  it('promotes an entire nested line without changing its position or discarding other lines', () => {
    const original = branchingTree();
    const tree = promoteTreeLine(original);
    const parsed = parseAnnotatedPgn(exportExplorePgn(tree));
    expect(parsed.moves.map((m) => m.san)).toEqual(['e4', 'c5', 'Nc3', 'Nc6']);
    expect(parsed.moves[1]!.variations![0]!.map((m) => m.san)).toEqual(['e5', 'Nf3']);
    expect(parsed.moves[2]!.variations![0]!.map((m) => m.san)).toEqual(['Nf3', 'd6']);
    expect(positionAt(tree).fen()).toBe(positionAt(original).fen());
    assertLegal(parsed.moves);
  });
  it('deletes only the selected subtree and returns to the parent', () => {
    const tree = deleteTreeLine(selectTreeNode(branchingTree(), 4));
    expect(tree.selected).toBe(1);
    expect(Object.keys(tree.nodes)).toHaveLength(4);
    expect(selectedLine(tree).map((id) => tree.nodes[id]!.san)).toEqual(['e4', 'e5', 'Nf3']);
    expect(exportExplorePgn(tree)).not.toContain('c5');
    expect(deleteTreeLine(newExploreTree()).selected).toBe(0);
  });
  it('round-trips all drawing colors at the root and on separate branches', () => {
    const colors: ShapeColor[] = ['green', 'red', 'blue', 'yellow'];
    const shapes = {
      arrows: colors.map((color, i) => ({ color, from: `${'abcd'[i]}2`, to: `${'abcd'[i]}4` })),
      circles: colors.map((color, i) => ({ color, square: `${'abcd'[i]}4` })),
    };
    let tree = setTreeShapes(newExploreTree(), shapes);
    tree = playTreeMove(tree, 'e4');
    tree = setTreeShapes(tree, shapes);
    tree = selectTreeNode(tree, 0);
    tree = playTreeMove(tree, 'd4');
    tree = setTreeShapes(tree, { arrows: [], circles: [{ color: 'red', square: 'd4' }] });
    const parsed = parseAnnotatedPgn(exportExplorePgn(tree));
    expect(parsed.initialShapes).toEqual(shapes);
    expect(parsed.moves[0]!.shapes).toEqual(shapes);
    expect(parsed.moves[0]!.variations![0]![0]!.shapes).toEqual(tree.nodes[2]!.shapes);
    expect(parseAnnotatedPgn(exportExplorePgn(setTreeShapes(newExploreTree(), shapes))).initialShapes).toEqual(shapes);
  });
});
