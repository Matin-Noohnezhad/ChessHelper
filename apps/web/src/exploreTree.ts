import { Chess } from '@coh/chess-core';
import type { MoveInput, MoveShapes } from '@coh/chess-core';

export interface ExploreNode {
  id: number;
  parent: number | null;
  san: string;
  children: number[];
  shapes: MoveShapes;
}
export interface ExploreTree {
  initialFen?: string;
  nodes: Record<number, ExploreNode>;
  selected: number;
  nextId: number;
  choices: Record<number, number>;
}
export const emptyShapes = (): MoveShapes => ({ arrows: [], circles: [] });
export function newExploreTree(initialFen?: string): ExploreTree {
  return { ...(initialFen ? { initialFen } : {}), nodes: { 0: { id: 0, parent: null, san: '', children: [], shapes: emptyShapes() } }, selected: 0, nextId: 1, choices: {} };
}
export function nodePath(tree: ExploreTree, id = tree.selected): number[] {
  const path: number[] = [];
  let node = tree.nodes[id];
  while (node && node.parent !== null) {
    path.push(node.id);
    node = tree.nodes[node.parent];
  }
  return path.reverse();
}
/** The selected branch, followed by its preferred continuation. */
export function selectedLine(tree: ExploreTree): number[] {
  const line = nodePath(tree);
  let node = tree.nodes[tree.selected]!;
  while (node.children.length) {
    const preferred = tree.choices[node.id];
    node = tree.nodes[preferred !== undefined && node.children.includes(preferred) ? preferred : node.children[0]!]!;
    line.push(node.id);
  }
  return line;
}
export function selectTreeNode(tree: ExploreTree, id: number): ExploreTree {
  if (!tree.nodes[id]) return tree;
  const choices = { ...tree.choices };
  for (const child of nodePath(tree, id)) choices[tree.nodes[child]!.parent!] = child;
  return { ...tree, selected: id, choices };
}
export function positionAt(tree: ExploreTree, id = tree.selected): Chess {
  const game = new Chess(tree.initialFen);
  for (const nodeId of nodePath(tree, id)) game.move(tree.nodes[nodeId]!.san);
  return game;
}
export function playTreeMove(tree: ExploreTree, input: MoveInput): ExploreTree {
  const info = positionAt(tree).move(input);
  if (!info) return tree;
  const parent = tree.nodes[tree.selected]!;
  const existing = parent.children.find((id) => tree.nodes[id]!.san === info.san);
  if (existing !== undefined) return selectTreeNode(tree, existing);
  const id = tree.nextId;
  return {
    ...tree,
    nodes: { ...tree.nodes,
      [parent.id]: { ...parent, children: [...parent.children, id] },
      [id]: { id, parent: parent.id, san: info.san, children: [], shapes: emptyShapes() },
    },
    selected: id, nextId: id + 1, choices: { ...tree.choices, [parent.id]: id },
  };
}
/** Promote the whole selected path, including any enclosing variations. */
export function promoteTreeLine(tree: ExploreTree): ExploreTree {
  const nodes = { ...tree.nodes };
  for (const id of nodePath(tree)) {
    const parent = nodes[nodes[id]!.parent!]!;
    nodes[parent.id] = { ...parent, children: [id, ...parent.children.filter((child) => child !== id)] };
  }
  return { ...tree, nodes };
}
/** Delete the selected move and all its descendants, preserving sibling lines. */
export function deleteTreeLine(tree: ExploreTree): ExploreTree {
  const node = tree.nodes[tree.selected]!;
  if (node.parent === null) return tree;
  const nodes = { ...tree.nodes };
  const pending = [node.id];
  while (pending.length) {
    const id = pending.pop()!;
    pending.push(...nodes[id]!.children);
    delete nodes[id];
  }
  const parent = nodes[node.parent]!;
  nodes[parent.id] = { ...parent, children: parent.children.filter((id) => id !== node.id) };
  return { ...tree, nodes, selected: parent.id };
}
export function setTreeShapes(tree: ExploreTree, shapes: MoveShapes): ExploreTree {
  const node = tree.nodes[tree.selected]!;
  return { ...tree, nodes: { ...tree.nodes, [node.id]: { ...node, shapes } } };
}

function shapeComment(shapes: MoveShapes): string {
  const codes = { green: 'G', red: 'R', blue: 'B', yellow: 'Y' };
  const commands: string[] = [];
  if (shapes.arrows.length) commands.push(`[%cal ${shapes.arrows.map((a) => `${codes[a.color]}${a.from}${a.to}`).join(',')}]`);
  if (shapes.circles.length) commands.push(`[%csl ${shapes.circles.map((s) => `${codes[s.color]}${s.square}`).join(',')}]`);
  return commands.length ? `{ ${commands.join(' ')} }` : '';
}
/** Export every branch, with sibling variations immediately after the move they replace. */
export function exportExplorePgn(tree: ExploreTree): string {
  const fields = new Chess(tree.initialFen).fen().split(' ');
  const firstPly = (Number(fields[5]) - 1) * 2 + (fields[1] === 'b' ? 1 : 0);
  const moveText = (id: number, ply: number): string => {
    const node = tree.nodes[id]!;
    return [`${Math.floor(ply / 2) + 1}${ply % 2 ? '...' : '.'} ${node.san}`, shapeComment(node.shapes)].filter(Boolean).join(' ');
  };
  const continuation = (parentId: number, ply: number): string => {
    const [main, ...alternatives] = tree.nodes[parentId]!.children;
    if (main === undefined) return '';
    return [moveText(main, ply), ...alternatives.map((id) => `(${[moveText(id, ply), continuation(id, ply + 1)].filter(Boolean).join(' ')})`), continuation(main, ply + 1)].filter(Boolean).join(' ');
  };
  const setup = tree.initialFen ? `[SetUp "1"]\n[FEN "${tree.initialFen}"]\n` : '';
  return `${setup}[Result "*"]\n\n${[shapeComment(tree.nodes[0]!.shapes), continuation(0, firstPly), '*'].filter(Boolean).join(' ')}`;
}
