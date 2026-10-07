import { useCallback, useMemo, useState } from 'react';
import type { MoveInput, MoveShapes } from '@coh/chess-core';
import { deleteTreeLine, exportExplorePgn, newExploreTree, nodePath, playTreeMove, positionAt, promoteTreeLine, selectedLine, selectTreeNode, setTreeShapes } from '../exploreTree.js';

export type Orientation = 'white' | 'black';

/** The Explore board retains every played branch and position's drawings. */
export function useChessGame() {
  const [tree, setTree] = useState(newExploreTree);
  const [replaying, setReplaying] = useState(false);
  const [orientation, setOrientation] = useState<Orientation>('white');
  const line = useMemo(() => selectedLine(tree), [tree]);
  const sans = useMemo(() => line.map((id) => tree.nodes[id]!.san), [tree, line]);
  const cursor = nodePath(tree).length;
  const game = useMemo(() => positionAt(tree), [tree]);
  const selected = tree.nodes[tree.selected]!;
  const last = selected.parent === null ? null : positionAt(tree, selected.parent).move(selected.san);
  const lastMove = last ? { from: last.from, to: last.to } : null;

  const play = useCallback((input: MoveInput) => {
    const info = positionAt(tree).move(input);
    if (!info) return null;
    setTree((previous) => playTreeMove(previous, input));
    setReplaying(false);
    return info;
  }, [tree]);
  const selectNode = useCallback((id: number) => {
    setTree((previous) => selectTreeNode(previous, id));
    setReplaying(true);
  }, []);
  const goTo = (index: number) => selectNode(line[Math.max(0, Math.min(index, line.length)) - 1] ?? 0);
  const deleteLine = () => { setTree(deleteTreeLine); setReplaying(true); };
  const loadLine = useCallback((moves: string[]) => {
    setTree(moves.reduce((state, san) => playTreeMove(state, san), newExploreTree()));
    setReplaying(true);
  }, []);
  const reset = () => { setTree(newExploreTree()); setReplaying(true); };
  const setShapes = useCallback((shapes: MoveShapes) => setTree((previous) => setTreeShapes(previous, shapes)), []);

  return {
    game, sans, cursor, tree, lastMove, replaying, orientation,
    pgn: useMemo(() => exportExplorePgn(tree), [tree]),
    shapes: tree.nodes[tree.selected]!.shapes, setShapes,
    atStart: cursor === 0, atEnd: cursor === line.length,
    canPromote: nodePath(tree).some((id) => tree.nodes[tree.nodes[id]!.parent!]!.children[0] !== id),
    play, goTo, selectNode,
    stepBack: () => goTo(cursor - 1), stepForward: () => goTo(cursor + 1),
    toStart: () => goTo(0), toEnd: () => goTo(sans.length),
    takeBack: deleteLine, deleteLine, promoteLine: () => setTree(promoteTreeLine),
    loadLine, reset, flip: () => setOrientation((o) => o === 'white' ? 'black' : 'white'), setOrientation,
  };
}
export type ChessGame = ReturnType<typeof useChessGame>;
