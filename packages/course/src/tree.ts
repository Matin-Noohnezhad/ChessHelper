/**
 * Reading the course tree.
 *
 * Two questions get asked of it constantly. What is every line in here — a
 * *variation* being one path from the start of a chapter to a position the
 * author stopped writing about. And, at a branch, what is each of these moves
 * for: the one being taught, another line to learn, a move offered in passing,
 * or a move the author is warning you off.
 *
 * That last question is the whole of "alternative moves" without asking the
 * author to mark anything up, and it only has an answer once we know which side
 * you are training: a sideline at *your* move is a choice, a sideline at your
 * opponent's is something you have to be ready for.
 */

import type { Chapter, Course, CourseNode, CourseSide, MoveRole } from './types.js';

export const colorOf = (side: CourseSide): 'w' | 'b' => (side === 'white' ? 'w' : 'b');

/**
 * The key a move's history is filed under: the position it is played from, plus
 * the move. Not the path — a move taught in two chapters is one thing to know,
 * and learning it in the Najdorf should not leave it unlearned in the Scheveningen.
 */
export const moveKey = (node: CourseNode): string => `${node.fromKey}|${node.san}`;

/**
 * Which sibling the course teaches. Normally the main line, but an author who
 * opens a note with a move they are about to demolish leaves the first sibling
 * dubious, and the move being taught is the next one along.
 */
function taughtIndex(siblings: readonly CourseNode[], userColor: 'w' | 'b'): number {
  const mine = siblings[0]?.side === userColor;
  if (!mine) return 0;
  const index = siblings.findIndex((node) => !node.dubious);
  return index < 0 ? 0 : index;
}

/** What a move at a branch is for. See the note at the top of the file. */
export function roleOf(
  siblings: readonly CourseNode[],
  index: number,
  side: CourseSide,
): MoveRole {
  const node = siblings[index]!;
  const userColor = colorOf(side);
  // At the opponent's turn every move is something you must be ready for,
  // including the ones the author calls bad — that is where the refutation is.
  if (node.side !== userColor) return 'branch';
  if (node.dubious) return 'rejected';
  if (index === taughtIndex(siblings, userColor)) return 'taught';
  return node.children.length ? 'branch' : 'alternative';
}

/** The children of `node` that a drill actually walks into. */
export function playableChildren(node: CourseNode, side: CourseSide): CourseNode[] {
  return node.children.filter((_, index) => {
    const role = roleOf(node.children, index, side);
    return role === 'taught' || role === 'branch';
  });
}

/** The same, for the top of a chapter. */
export function playableRoots(chapter: Chapter, side: CourseSide): CourseNode[] {
  return chapter.roots.filter((_, index) => {
    const role = roleOf(chapter.roots, index, side);
    return role === 'taught' || role === 'branch';
  });
}

/** One path through a chapter, from its start position to where the author stopped. */
export interface Variation {
  id: string;
  chapterId: string;
  chapterName: string;
  line: CourseNode[];
}

/**
 * Every variation in a chapter, in the order the file wrote them — main line
 * first at each branch, which is the order a course is meant to be learned in.
 *
 * Alternatives and rejected moves are not variations: nobody needs to drill a
 * move the author showed and then dropped.
 */
export function variationsOf(chapter: Chapter, side: CourseSide): Variation[] {
  const out: Variation[] = [];
  const line: CourseNode[] = [];

  const descend = (nodes: readonly CourseNode[]): void => {
    if (!nodes.length) {
      const last = line[line.length - 1];
      if (last) {
        out.push({
          id: `${chapter.id}/${last.id}`,
          chapterId: chapter.id,
          chapterName: chapter.name,
          line: [...line],
        });
      }
      return;
    }
    for (const node of nodes) {
      line.push(node);
      descend(playableChildren(node, side));
      line.pop();
    }
  };

  descend(playableRoots(chapter, side));
  return out;
}

/** Every variation in the course. */
export function allVariations(course: Course): Variation[] {
  return course.chapters.flatMap((chapter) => variationsOf(chapter, course.side));
}

/**
 * The distinct moves a course asks you to produce, keyed the way progress is.
 * Deduplicated: the same move reached down two variations is one thing to know.
 */
export function trainableMoves(
  chapters: readonly Chapter[],
  side: CourseSide,
): Map<string, CourseNode> {
  const userColor = colorOf(side);
  const out = new Map<string, CourseNode>();

  const visit = (nodes: readonly CourseNode[]): void => {
    for (const node of nodes) {
      if (node.side === userColor) {
        const key = moveKey(node);
        if (!out.has(key)) out.set(key, node);
      }
      visit(playableChildren(node, side));
    }
  };

  for (const chapter of chapters) visit(playableRoots(chapter, side));
  return out;
}

/** The indices of `line` you would be asked to produce. */
export function quizIndices(line: readonly CourseNode[], side: CourseSide): number[] {
  const userColor = colorOf(side);
  const out: number[] = [];
  for (let i = 0; i < line.length; i++) if (line[i]!.side === userColor) out.push(i);
  return out;
}

/** How the line reads as notation: `1.e4 c5 2.Nf3 d6`. */
export function lineSan(line: readonly CourseNode[]): string[] {
  return line.map((node) => node.san);
}
