import { describe, expect, it } from 'vitest';
import { Chess, START_FEN } from '@coh/chess-core';
import { renderToStaticMarkup } from 'react-dom/server';
import { explanationLines } from '../explanationLines.js';
import { CourseReader } from '../components/CourseReader.js';
import { entryFrom } from '../hooks/useCourseLibrary.js';

const moves = 'e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 e5 Ndb5 d6 Nd5 Nxd5 exd5 Nb8'.split(' ').map((san) => ({ san }));
const prose = "Here Black has 8... Ne7 and 8… Nb8. The critical line after 8...Ne7 is 9.c4 Ng6 10.Qa4 Bd7 11.Qb4, after which Magnus has played 11...Qb8 and 11...Bf5, which allows White to repeat with 12.Qa4 Bd7. After 8...Nb8 White's main line is 9.c4, but 9.a4 and 9.Qf3 and 9.Qd3 also occur.";
const fenAfter = (sans: string[]) => {
  const game = new Chess();
  for (const san of sans) expect(game.move(san), san).not.toBeNull();
  return game.fen();
};

describe('explanation lines', () => {
  it('resolves the Sicilian example, including references to previous prose branches', () => {
    const lines = explanationLines(prose, START_FEN, moves);
    const critical = lines.find((line) => line.moves.some((move) => move.san === 'Qb4'))!;
    expect(critical.moves.map((move) => move.san)).toEqual(['Ne7', 'c4', 'Ng6', 'Qa4', 'Bd7', 'Qb4', 'Qb8']);
    const beforeRetreat = moves.slice(0, -1).map((move) => move.san);
    expect(critical.startFen).toBe(fenAfter(beforeRetreat));
    const alternative = lines.find((line) => line.moves[0]?.san === 'Bf5')!;
    expect(alternative.startFen).toBe(critical.moves[5]!.fen);
    expect(alternative.moves.map((move) => move.san)).toEqual(['Bf5', 'Qa4', 'Bd7']);
    expect(alternative.moves[0]!.fen).toBe(fenAfter([...beforeRetreat, 'Ne7', 'c4', 'Ng6', 'Qa4', 'Bd7', 'Qb4', 'Bf5']));
    const later = lines.filter((line) => line.moves.some((move) => move.label.startsWith('9.'))).slice(1);
    expect(later.map((line) => line.moves.at(-1)!.san)).toEqual(['c4', 'a4', 'Qf3', 'Qd3']);
    expect(later[0]!.moves.map((move) => move.san)).toEqual(['Nb8', 'c4']);
    for (const line of later.slice(1)) expect(line.startFen).toBe(fenAfter(moves.map((move) => move.san)));
    for (const line of lines) for (const move of line.moves)
      expect(prose.slice(move.start, move.end)).toMatch(/\S/);
  });

  it('keeps 16.Na4 in the blunder line across the explanation text', () => {
    const path = [...moves, ...'c4 Be7 Be2 O-O O-O a6 Nc3 f5 f4 Bf6'.split(' ').map((san) => ({ san }))];
    const comment = '13...Nd7 is also fine and will lead to the same position. Please note that 13...exf4 14.Bxf4 Qb6+ 15.Kh1 Qxb2 is a huge blunder due to 16.Na4.';
    const lines = explanationLines(comment, START_FEN, path);
    expect(lines).toHaveLength(2);
    expect(lines[0]!.moves.map((move) => move.san)).toEqual(['Nd7']);
    expect(lines[1]!.moves.map((move) => move.san)).toEqual(['exf4', 'Bxf4', 'Qb6+', 'Kh1', 'Qxb2', 'Na4']);
    expect(lines[1]!.moves.at(-1)!.fen).toBe(fenAfter([
      ...path.slice(0, -1).map((move) => move.san), 'exf4', 'Bxf4', 'Qb6+', 'Kh1', 'Qxb2', 'Na4',
    ]));
    const penultimate = lines[1]!.moves[4]!;
    const last = lines[1]!.moves[5]!;
    expect(comment.slice(penultimate.end, last.start)).toBe(' is a huge blunder due to ');
    expect(comment.slice(last.start, last.end)).toBe('16.Na4');
    // The reader's selector lists the complete line once and keeps the prose intact.
    const pgn = path.map((move) => move.san).join(' ') + ` {${comment}} *`;
    const entry = entryFrom({ id: 'prose-continuation-test', name: 'Test', pgn, side: 'white', importedAt: 0 }, {});
    const html = renderToStaticMarkup(<CourseReader entry={entry} initialPly={path.length} onExit={() => {}} />);
    expect(html).toMatch(/<option value="1">13… exf4 14. Bxf4 14… Qb6\+ 15. Kh1 15… Qxb2 16. Na4<\/option>/);
    expect(html).not.toContain('<option value="2">');
    expect(html).toContain(' is a huge blunder due to ');
  });

  it('requires the next half-move and a matching position before joining prose segments', () => {
    const path = ['e4', 'e5'].map((san) => ({ san }));
    const joined = explanationLines('1.e4 can be met by 1...c5, then 2.Nf3.', START_FEN, path);
    expect(joined.map((line) => line.moves.map((move) => move.san))).toEqual([['e4', 'c5', 'Nf3']]);
    const skipped = explanationLines('1.e4 is common. Another idea is 2.Nf3.', START_FEN, path);
    expect(skipped.map((line) => line.moves.map((move) => move.san))).toEqual([['e4'], ['Nf3']]);
    const alternatives = explanationLines('1.e4 e5 or 1.d4 d5.', START_FEN, path);
    expect(alternatives.map((line) => line.moves.map((move) => move.san))).toEqual([['e4', 'e5'], ['d4', 'd5']]);
  });

  it('leaves illegal, unanchored and speculative prose alone and preserves valid prefixes', () => {
    expect(explanationLines('99.Qa4 and ...Be7, ...O-O or h4 then h5. 1.Ke8', START_FEN, [])).toEqual([]);
    const lines = explanationLines('Try 1.e4 e5 2.Nf3 Qh1 then stop.', START_FEN, []);
    expect(lines[0]!.moves.map((move) => move.san)).toEqual(['e4', 'e5', 'Nf3']);
  });

  it('supports black-to-move FENs, ellipses, promotions, castling and annotations', () => {
    const fen = '4k2r/P7/8/8/8/8/8/4K3 b k - 0 23';
    const lines = explanationLines('23… 0-0! 24.a8=Q', fen, []);
    expect(lines[0]!.moves.map((move) => move.san)).toEqual(['O-O', 'a8=Q']);
    expect(lines[0]!.moves.map((move) => move.label)).toEqual(['23… O-O', '24. a8=Q']);
  });

  it('splits adjacent alternatives instead of playing a mismatched move number', () => {
    const lines = explanationLines('1.e4 1.d4 d5', START_FEN, []);
    expect(lines.map((line) => line.moves.map((move) => move.san))).toEqual([['e4'], ['d4', 'd5']]);
  });
});

describe('reading branches and explanation controls', () => {
  const entry = entryFrom({ id: 'explanation-test', name: 'Test', side: 'white', importedAt: 0,
    pgn: '1.e4 {Try 1.d4 d5 2.c4 instead.} e5 (1...c5 2.Nf3) 2.Nf3 *' }, {});
  it('keeps branch choices hidden until next is pressed in both placements', () => {
    const html = renderToStaticMarkup(<CourseReader entry={entry} initialPly={1} onExit={() => {}} />);
    expect(html).not.toContain('course-reader__branch-overlay');
    expect(html).not.toContain('Choose variation');
    expect(html).toContain('Lines in this explanation');
    expect(html).toContain('Explore 1. d4 on the board');
    const original = renderToStaticMarkup(<CourseReader entry={entry} initialPly={1} branchNavigation="sidebar" onExit={() => {}} />);
    expect(original).not.toContain('course-reader__branch-overlay');
    expect(original).not.toContain('Choose variation');
  });
});
