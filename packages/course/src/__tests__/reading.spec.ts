import { describe, expect, it } from 'vitest';
import { buildCourse } from '../import.js';
import { courseOutline } from '../stats.js';
import { readingLinesOf, readingPath, variationsOf } from '../tree.js';

describe('reading games without splitting their annotations into lines', () => {
  it('combines repeated moves before matching source games to the chapter tree', () => {
    const course = buildCourse(`[Event "Course: Repeated notes"]
1. e4 e5 {Main note [%cal Ge7e5]} $1
(1... e5 {Extra note [%csl Re5]} $3 2. Bc4 Nc6)
(1... e5 {Another note} 2. Nf3 Nf6)
2. Nf3 {Develop} Nc6 *

[Event "Course: Repeated notes"]
1. e4 e5 {Second game} 2. Bc4 Nf6 *`);
    const chapter = course.chapters[0]!;
    const games = readingLinesOf(chapter);
    expect(games).toHaveLength(2);
    expect(course.problems).toEqual([]);
    const replies = games[0]!.roots[0]!.children;
    expect(replies).toHaveLength(1);
    const reply = replies[0]!;
    expect(reply.comment).toBe('Main note\n\nExtra note\n\nAnother note');
    expect(reply.nags).toEqual([1, 3]);
    expect(reply.shapes).toEqual({
      arrows: [{ from: 'e7', to: 'e5', color: 'green' }],
      circles: [{ square: 'e5', color: 'red' }],
    });
    expect(reply.children.map((node) => node.san)).toEqual(['Nf3', 'Bc4']);
    expect(reply.children[0]!.children.map((node) => node.san)).toEqual(['Nc6', 'Nf6']);
    expect(games[1]!.roots[0]!.children[0]!.comment).toBe('Second game');
    for (const game of games) {
      const visit = (nodes: typeof chapter.roots): void => {
        for (const node of nodes) {
          const match = readingPath(chapter.roots, node.id).find((item) => item.id === node.id);
          expect(match?.san).toBe(node.san);
          visit(node.children);
        }
      };
      visit(game.roots);
    }
  });

  it('keeps nested and dubious branches attached to a single game', () => {
    const course = buildCourse('1. e4 (1. d4? d5) e5 (1... c5 2. Nf3 (2. Bc4? Nc6) d6) 2. Nf3 *');
    const chapter = course.chapters[0]!;
    const [game] = readingLinesOf(chapter);
    expect(readingLinesOf(chapter)).toHaveLength(1);
    expect(game!.line.map((node) => node.san)).toEqual(['e4', 'e5', 'Nf3']);
    expect(game!.roots[1]!.dubious).toBe(true);
    const sicilian = game!.roots[0]!.children[1]!;
    expect(sicilian.children.map((node) => node.san)).toEqual(['Nf3', 'Bc4']);
    const target = sicilian.children[1]!.children[0]!;
    expect(readingPath(game!.roots, target.id).map((node) => node.san)).toEqual(['e4', 'c5', 'Bc4', 'Nc6']);
    expect(courseOutline(course, {}, 0)[0]!.variations).toHaveLength(1);
  });

  it('keeps games with identical chapter headers separate, including their own main line and comments', () => {
    const course = buildCourse(`[Event "Course: Same chapter"]
1. e4 {First game} e5 (1... c5) 2. Nf3 *

[Event "Course: Same chapter"]
1. e4 {Second game} c5 (1... e5) 2. Nc3 *`);
    expect(course.chapters).toHaveLength(1);
    const chapter = course.chapters[0]!;
    const games = readingLinesOf(chapter);
    expect(games).toHaveLength(2);
    expect(games[0]!.line.map((node) => node.san)).toEqual(['e4', 'e5', 'Nf3']);
    expect(games[1]!.line.map((node) => node.san)).toEqual(['e4', 'c5', 'Nc3']);
    expect(games.map((game) => game.line[0]!.comment)).toEqual(['First game', 'Second game']);
    expect(games[1]!.line[1]!.id).toBe(chapter.roots[0]!.children[1]!.id);
    // Training IDs still point at the same nodes, even when source order differs.
    const training = variationsOf(chapter, course.side).find((line) => line.line.at(-1)!.san === 'Nc3')!;
    expect(readingPath(games[1]!.roots, training.line.at(-1)!.id).map((node) => node.id))
      .toEqual(training.line.map((node) => node.id));
    expect(courseOutline(course, {}, 0)[0]!.variations).toHaveLength(2);
  });

  it('preserves FEN move numbering and skips illegal moves without duplicating problems', () => {
    const course = buildCourse(`[SetUp "1"]
[FEN "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 12"]
12... e5 (12... c5) 13. Nf3 Bh3 *`);
    const game = readingLinesOf(course.chapters[0]!)[0]!;
    expect(game.roots[0]!.moveNumber).toBe(12);
    expect(game.roots[0]!.side).toBe('b');
    expect(game.roots).toHaveLength(2);
    expect(course.problems).toHaveLength(1);
    expect(game.line.map((node) => node.san)).toEqual(['e5', 'Nf3']);
  });

  it('supports older chapter objects and ignores empty source games', () => {
    const chapter = buildCourse('1. e4 e5 (1... c5) *').chapters[0]!;
    delete chapter.games;
    expect(readingLinesOf(chapter)).toHaveLength(1);
    expect(readingLinesOf({ ...chapter, roots: [] })).toEqual([]);
  });
});
