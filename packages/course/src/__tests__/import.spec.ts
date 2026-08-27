import { describe, expect, it } from 'vitest';
import { buildCourse } from '../import.js';
import { BLACK_COURSE_PGN, COURSE_PGN } from './fixture.js';

describe('course import', () => {
  it('takes the course and chapter names from the Event header', () => {
    const course = buildCourse(COURSE_PGN);
    expect(course.name).toBe('Test Course');
    expect(course.chapters.map((chapter) => chapter.name)).toEqual([
      'Open Sicilian',
      'Move Orders',
    ]);
  });

  it('reads a sideline as a sibling of the move it replaces, not a continuation', () => {
    const course = buildCourse(COURSE_PGN);
    const e4 = course.chapters[0]!.roots[0]!;
    expect(e4.san).toBe('e4');
    // 1...e5 is written inside 1.e4's line but answers 1.e4, so it belongs
    // beside 1...c5 rather than after it.
    expect(e4.children.map((node) => node.san)).toEqual(['c5', 'e5']);
  });

  it('keeps the author’s prose on the move it was written about', () => {
    const course = buildCourse(COURSE_PGN);
    const najdorf = 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6'.split(' ');
    let nodes = course.chapters[0]!.roots;
    let node = nodes[0]!;
    for (const san of najdorf) {
      node = nodes.find((entry) => entry.san === san)!;
      nodes = node.children;
    }
    expect(node.comment).toContain('The Najdorf');
  });

  it('marks the moves the author warned against', () => {
    const course = buildCourse(COURSE_PGN);
    const third = 'e4 c5 Nf3 d6'
      .split(' ')
      .reduce(
        (nodes, san) => nodes.find((node) => node.san === san)!.children,
        course.chapters[0]!.roots,
      );
    expect(third.map((node) => node.san)).toEqual(['d4', 'Bb5+', 'c3', 'Be2']);
    expect(third.find((node) => node.san === 'c3')!.dubious).toBe(true);
    expect(third.find((node) => node.san === 'd4')!.dubious).toBeUndefined();
  });

  it('gives every move the position it is played from, so transpositions collapse', () => {
    const course = buildCourse(COURSE_PGN);
    const first = course.chapters[0]!.roots[0]!;
    const second = course.chapters[1]!.roots[0]!;
    // Both chapters open 1.e4 from the initial position: one thing to know.
    expect(second.fromKey).toBe(first.fromKey);
    expect(second.san).toBe(first.san);
  });

  it('infers the side from where the course really branches', () => {
    expect(buildCourse(COURSE_PGN).side).toBe('white');
    // The Black course branches only on White's move: 1.e4, 1.d4, 1.Nf3.
    expect(buildCourse(BLACK_COURSE_PGN).side).toBe('black');
  });

  it('lets the caller override the inferred side', () => {
    expect(buildCourse(COURSE_PGN, { side: 'black' }).side).toBe('black');
  });

  it('believes an Orientation header over its own guess', () => {
    const pgn = `[Event "X: Y"]\n[Orientation "black"]\n\n1. e4 c5 2. Nf3 d6 *`;
    expect(buildCourse(pgn).side).toBe('black');
  });

  it('merges two games of the same chapter into one tree', () => {
    const pgn = `[Event "C: One"]\n\n1. e4 c5 2. Nf3 *\n\n[Event "C: One"]\n\n1. e4 e5 2. Nf3 *`;
    const course = buildCourse(pgn);
    expect(course.chapters).toHaveLength(1);
    expect(course.chapters[0]!.roots[0]!.children.map((node) => node.san)).toEqual(['c5', 'e5']);
  });

  it('numbers chapters when the headers name nothing', () => {
    const pgn = `[Event "?"]\n\n1. e4 c5 *\n\n[Event "?"]\n\n1. d4 d5 *`;
    expect(buildCourse(pgn).chapters.map((chapter) => chapter.name)).toEqual([
      'Chapter 1',
      'Chapter 2',
    ]);
  });

  it('starts a chapter from its FEN header', () => {
    const fen = '8/8/8/4k3/8/8/4P3/4K3 w - - 0 1';
    const course = buildCourse(`[Event "Endings: Opposition"]\n[FEN "${fen}"]\n\n1. Kd2 Kd4 *`);
    expect(course.chapters[0]!.startFen).toBe(fen);
    expect(course.chapters[0]!.roots[0]!.san).toBe('Kd2');
  });

  it('carries the arrows and circles the author drew onto the move', () => {
    const course = buildCourse(
      `[Event "Shapes: Plan"]\n\n1. e4 c5 2. Nf3 d6 3. d4 {[%cal Gd4c5,Gf1b5] [%csl Rd4] the break} *`,
    );
    let nodes = course.chapters[0]!.roots;
    let node = nodes[0]!;
    for (const san of ['e4', 'c5', 'Nf3', 'd6', 'd4']) {
      node = nodes.find((entry) => entry.san === san)!;
      nodes = node.children;
    }
    expect(node.shapes).toEqual({
      arrows: [
        { from: 'd4', to: 'c5', color: 'green' },
        { from: 'f1', to: 'b5', color: 'green' },
      ],
      circles: [{ square: 'd4', color: 'red' }],
    });
    expect(node.comment).toBe('the break');
  });

  it('reports a move it cannot replay instead of dropping it in silence', () => {
    const course = buildCourse(`[Event "Bad: Line"]\n\n1. e4 e5 2. Nf7 Nc6 *`);
    expect(course.problems).toHaveLength(1);
    expect(course.problems[0]).toMatchObject({ san: 'Nf7', reason: 'illegal', line: 'e4 e5' });
    // Everything under the unreadable move goes with it — it was never anchored
    // to a position we could reach.
    const e5 = course.chapters[0]!.roots[0]!.children[0]!;
    expect(e5.children).toHaveLength(0);
  });
});
