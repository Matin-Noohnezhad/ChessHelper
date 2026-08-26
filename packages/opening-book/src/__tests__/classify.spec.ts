import { describe, expect, it } from 'vitest';
import { Chess } from '@coh/chess-core';
import { PAWN_STRUCTURES } from '../structures.js';
import {
  CLASSIFIED_STRUCTURES,
  UNCLASSIFIED_STRUCTURES,
  breaksFor,
  classifyStructure,
  classifyStructureBest,
  mirrorFen,
  pawnSkeleton,
  plansFor,
} from '../classify.js';

/** Plays a line from the start and hands back the FEN it reaches. */
function fenAfter(moves: string): string {
  const board = new Chess();
  for (const san of moves.split(' ').filter(Boolean)) {
    expect(board.move(san), `${san} in "${moves}"`).not.toBeNull();
  }
  return board.fen();
}

const idsOf = (fen: string): string[] => classifyStructure(fen).map((m) => m.structure.id);

describe('pawn skeleton', () => {
  it('reads pawns out of a FEN and ignores everything else', () => {
    const skeleton = pawnSkeleton(fenAfter('e4 c5 Nf3 d6 d4 cxd4 Nxd4'));
    expect(skeleton.has('white', 'e4')).toBe(true);
    expect(skeleton.has('black', 'd6')).toBe(true);
    expect(skeleton.count('white', 'd')).toBe(0); // traded on d4
    expect(skeleton.count('black', 'c')).toBe(0);
    expect(skeleton.count('white', 'a')).toBe(1);
    expect(skeleton.has('white', 'd4')).toBe(false); // a knight stands there, not a pawn
  });
});

describe('structure classification', () => {
  /**
   * The encyclopedia's own skeleton FENs are the tightest test available: each
   * entry ships a diagram of the structure it describes, so every rule has to
   * recognise its own entry, upright, without matching a more specific one
   * first.
   */
  it('recognises every structure from the diagram that defines it', () => {
    for (const structure of PAWN_STRUCTURES) {
      if (!CLASSIFIED_STRUCTURES.includes(structure.id)) continue;
      const matches = classifyStructure(structure.fen);
      const ids = matches.map((m) => m.structure.id);
      expect(ids, `${structure.name} (${structure.fen})`).toContain(structure.id);
      expect(ids[0], `${structure.name} matched something more specific first`).toBe(structure.id);
      expect(matches[0]!.mirrored, `${structure.name} matched only as a mirror`).toBe(false);
    }
  });

  it('has a rule for every structure in the encyclopedia', () => {
    expect(UNCLASSIFIED_STRUCTURES).toEqual([]);
  });

  it('finds the isolani in the Panov, where nobody tagged it', () => {
    // 1.e4 c6 2.d4 d5 3.exd5 cxd5 4.c4 Nf6 5.Nc3 e6 6.Nf3 Be7 7.cxd5 Nxd5
    const fen = fenAfter('e4 c6 d4 d5 exd5 cxd5 c4 Nf6 Nc3 e6 Nf3 Be7 cxd5 Nxd5');
    expect(idsOf(fen)).toContain('iqp');
    expect(classifyStructureBest(fen)!.mirrored).toBe(false);
  });

  it('reads a black isolani as the same structure, mirrored', () => {
    // The Tarrasch: Black is the one left with the isolated d-pawn.
    const fen = fenAfter('d4 d5 c4 e6 Nc3 c5 cxd5 exd5 Nf3 Nc6 g3 Nf6 Bg2 Be7 O-O O-O dxc5 Bxc5');
    const best = classifyStructureBest(fen)!;
    expect(best.structure.id).toBe('iqp');
    expect(best.mirrored).toBe(true);
    // The entry's white plans are written for whoever owns the pawn — Black here.
    expect(plansFor(best, 'black')).toEqual(best.structure.whitePlans);
    expect(plansFor(best, 'white')).toEqual(best.structure.blackPlans);
  });

  it('names the structures the openings that reach them are built around', () => {
    const cases: { line: string; expect: string }[] = [
      // QGD Exchange
      { line: 'd4 d5 c4 e6 Nc3 Nf6 cxd5 exd5', expect: 'carlsbad' },
      // Maróczy Bind, Accelerated Dragon
      { line: 'e4 c5 Nf3 g6 d4 cxd4 Nxd4 Nc6 c4 Nf6 Nc3 d6', expect: 'maroczy' },
      // Najdorf with ...e5
      { line: 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Be2 e5', expect: 'boleslavsky' },
      // Scheveningen
      { line: 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Be2 e6', expect: 'scheveningen' },
      // French Advance
      { line: 'e4 e6 d4 d5 e5 c5 c3 Nc6', expect: 'french-chain' },
      // Closed Spanish
      { line: 'e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3 Na5 Bc2 c5 d4', expect: 'spanish-closed' },
      // King's Indian, Mar del Plata
      { line: 'd4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O Nc6 d5 Ne7', expect: 'kid-locked' },
      // Modern Benoni
      { line: 'd4 Nf6 c4 c5 d5 e6 Nc3 exd5 cxd5 d6 e4 g6', expect: 'benoni' },
      // Stonewall Dutch
      { line: 'd4 f5 g3 Nf6 Bg2 e6 Nf3 d5 O-O Bd6 c4 c6', expect: 'stonewall' },
      // Semi-Slav
      { line: 'd4 d5 c4 c6 Nf3 Nf6 Nc3 e6', expect: 'semi-slav-triangle' },
      // Hedgehog, from an English
      { line: 'c4 c5 Nf3 Nf6 g3 b6 Bg2 Bb7 O-O e6 Nc3 a6 d4 cxd4 Qxd4 d6 e4 Nbd7', expect: 'hedgehog' },
    ];

    for (const testCase of cases) {
      const fen = fenAfter(testCase.line);
      expect(idsOf(fen), `${testCase.expect}: ${testCase.line}`).toContain(testCase.expect);
    }
  });

  it('prefers the more specific reading where structures nest', () => {
    // A Stonewall is a Slav triangle with ...f5 played; both are true, and the
    // Stonewall is the one worth being told first.
    const stonewall = fenAfter('d4 f5 g3 Nf6 Bg2 e6 Nf3 d5 O-O Bd6 c4 c6');
    expect(idsOf(stonewall)[0]).toBe('stonewall');
    expect(idsOf(stonewall)).toContain('semi-slav-triangle');
  });

  it('turns a mirrored match the right way up', () => {
    const fen = fenAfter('d4 d5 c4 e6 Nc3 c5 cxd5 exd5 Nf3 Nc6 g3 Nf6 Bg2 Be7 O-O O-O dxc5 Bxc5');
    const best = classifyStructureBest(fen)!;
    expect(best.mirrored).toBe(true);

    // Upright, the isolani's freeing break is White's d4-d5. Mirrored, it is
    // Black's ...d5-d4, and it belongs to Black.
    const upright = best.structure.breaks.find((b) => b.move === 'd5' && b.side === 'white')!;
    const flipped = breaksFor(best).find((b) => b.side === 'black' && b.move === 'd4')!;
    expect(flipped.note).toBe(upright.note);

    // The diagram is drawn with White holding the isolani on d4; mirrored, it
    // is Black's on d5, which is what the position actually shown looks like.
    const flippedDiagram = pawnSkeleton(mirrorFen(best.structure.fen));
    expect(flippedDiagram.has('black', 'd5')).toBe(true);
    expect(flippedDiagram.has('white', 'd4')).toBe(false);
    expect(flippedDiagram.count('black', 'c')).toBe(0);
    expect(mirrorFen(mirrorFen(best.structure.fen))).toBe(best.structure.fen);
  });

  it('does not call a wedge a Carlsbad', () => {
    // Same c- and d-file picture as a Carlsbad, but White's pawn is on e5
    // rather than behind d4, which makes it a chain and a different game.
    const wedge = fenAfter('e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 e5 d5 Bb5 Ne4 cxd4 Bb6');
    expect(idsOf(wedge)).not.toContain('carlsbad');
    // The real thing, where the e-pawn is still home, still matches.
    expect(idsOf(fenAfter('d4 d5 c4 e6 Nc3 Nf6 cxd5 exd5'))).toContain('carlsbad');
  });

  it('says nothing about a position that has no structure yet', () => {
    expect(classifyStructure(fenAfter('e4 e5 Nf3 Nc6 Bb5'))).toEqual([]);
    expect(classifyStructureBest(fenAfter(''))).toBeUndefined();
  });
});
