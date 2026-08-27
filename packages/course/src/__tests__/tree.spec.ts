import { describe, expect, it } from 'vitest';
import { buildCourse } from '../import.js';
import { allVariations, moveKey, quizIndices, roleOf, trainableMoves, variationsOf } from '../tree.js';
import type { CourseNode } from '../types.js';
import { COURSE_PGN } from './fixture.js';

const course = buildCourse(COURSE_PGN);

/** The sibling list reached by following `path` from the chapter's roots. */
function siblingsAfter(path: string): readonly CourseNode[] {
  return path
    .split(' ')
    .reduce(
      (nodes, san) => nodes.find((node) => node.san === san)!.children,
      course.chapters[0]!.roots as readonly CourseNode[],
    );
}

describe('what a move at a branch is for', () => {
  const third = siblingsAfter('e4 c5 Nf3 d6');
  const roles = third.map((_, index) => roleOf(third, index, 'white'));

  it('teaches the main line', () => {
    expect(third[0]!.san).toBe('d4');
    expect(roles[0]).toBe('taught');
  });

  it('treats a sideline with a line under it as another variation to learn', () => {
    expect(third[1]!.san).toBe('Bb5+');
    expect(roles[1]).toBe('branch');
  });

  it('rejects a move the author marked bad', () => {
    expect(third[2]!.san).toBe('c3');
    expect(roles[2]).toBe('rejected');
  });

  it('accepts a move shown and dropped as an alternative', () => {
    expect(third[3]!.san).toBe('Be2');
    expect(roles[3]).toBe('alternative');
  });

  it('treats every reply the opponent has as a branch, bad ones included', () => {
    const replies = siblingsAfter('e4');
    expect(replies.map((node) => node.san)).toEqual(['c5', 'e5']);
    expect(replies.map((_, index) => roleOf(replies, index, 'white'))).toEqual([
      'branch',
      'branch',
    ]);
  });

  it('reads the same branch the other way round for the other side', () => {
    // Training Black, White's third move is four things to be ready for rather
    // than one to play and three to ignore.
    expect(third.map((_, index) => roleOf(third, index, 'black'))).toEqual([
      'branch',
      'branch',
      'branch',
      'branch',
    ]);
  });
});

describe('variations', () => {
  const lines = variationsOf(course.chapters[0]!, 'white').map((v) =>
    v.line.map((node) => node.san).join(' '),
  );

  it('walks every path the course asks you to play', () => {
    expect(lines).toEqual([
      'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6',
      'e4 c5 Nf3 d6 Bb5+ Bd7 Bxd7+ Qxd7',
      'e4 c5 Nf3 Nc6 d4 cxd4 Nxd4',
      'e4 e5 Nf3 Nc6 Bb5',
    ]);
  });

  it('does not make a variation out of a move the author showed and dropped', () => {
    expect(lines.some((line) => line.endsWith('Be2'))).toBe(false);
    expect(lines.some((line) => line.endsWith('c3'))).toBe(false);
  });

  it('asks you for your own moves and nobody else’s', () => {
    const najdorf = variationsOf(course.chapters[0]!, 'white')[0]!;
    expect(quizIndices(najdorf.line, 'white')).toEqual([0, 2, 4, 6, 8]);
    expect(najdorf.line[8]!.san).toBe('Nc3');
  });
});

describe('trainable moves', () => {
  it('counts a move taught in two chapters once', () => {
    const moves = trainableMoves(course.chapters, 'white');
    const chapterOne = trainableMoves([course.chapters[0]!], 'white');
    const chapterTwo = trainableMoves([course.chapters[1]!], 'white');
    // Both chapters open 1.e4 2.Nf3 3.d4 4.Nxd4 against 2...Nc6, so the second
    // chapter adds nothing new at all.
    expect(chapterOne.size + chapterTwo.size).toBeGreaterThan(moves.size);
    expect(moves.size).toBe(chapterOne.size);
  });

  it('keys a move by the position it is played from', () => {
    const first = course.chapters[0]!.roots[0]!;
    const second = course.chapters[1]!.roots[0]!;
    expect(moveKey(second)).toBe(moveKey(first));
  });

  it('covers every chapter of the course', () => {
    expect(allVariations(course)).toHaveLength(5);
  });
});
