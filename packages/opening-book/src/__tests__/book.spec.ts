import { describe, expect, it } from 'vitest';
import { Chess, parseFen, toFen } from '@coh/chess-core';
import { CURATED_OPENINGS } from '../openings.js';
import { PAWN_STRUCTURES, getStructure } from '../structures.js';
import { pawnSkeleton } from '../classify.js';
import { OPENINGS, bookStats, continuationsFrom, deepestOpening, identifyOpening, searchOpenings } from '../book.js';

/**
 * The book is hand-written data, so these tests are its compiler: an illegal
 * move order or a dangling structure id is a typo that would otherwise only
 * surface in front of a user mid-lesson.
 */
describe('opening data integrity', () => {
  it('every line is legal from the starting position', () => {
    for (const opening of CURATED_OPENINGS) {
      const game = new Chess();
      for (const san of opening.moves) {
        const played = game.move(san);
        expect(played, `${opening.name} (${opening.eco}): illegal move ${san}`).not.toBeNull();
      }
    }
  });

  it('has no duplicate move sequences', () => {
    const seen = new Map<string, string>();
    for (const opening of CURATED_OPENINGS) {
      const key = opening.moves.join(' ');
      expect(seen.has(key), `${opening.name} duplicates ${seen.get(key)}`).toBe(false);
      seen.set(key, opening.name);
    }
  });

  it('every theory entry references structures that exist', () => {
    for (const opening of CURATED_OPENINGS) {
      for (const id of opening.theory?.structures ?? []) {
        expect(getStructure(id), `${opening.name} references unknown structure "${id}"`).toBeDefined();
      }
    }
  });

  it('every pawn break is a plausible SAN move naming a real square', () => {
    const sanLike = /^[a-h][1-8]$|^[NBRQK][a-h]?[1-8]?x?[a-h][1-8]$|^O-O(-O)?$/;
    const check = (label: string, moves: { move: string; side: string }[]) => {
      for (const brk of moves) {
        expect(sanLike.test(brk.move), `${label}: "${brk.move}" is not SAN-shaped`).toBe(true);
        expect(['white', 'black']).toContain(brk.side);
      }
    };
    for (const opening of CURATED_OPENINGS) if (opening.theory) check(opening.name, opening.theory.breaks);
    for (const structure of PAWN_STRUCTURES) check(structure.name, structure.breaks);
  });

  /**
   * A break has to be a move that side could actually make. Writing plans from
   * annotated material makes it easy to attribute one to the wrong colour, or
   * to name a push on a file where that side has no pawn left — the sort of
   * mistake that reads perfectly well and is simply false. This checks the
   * cheap half of it: a pawn push needs a pawn of that colour on the file,
   * behind the square it is being pushed to.
   */
  it('every pawn break in an opening is a push that side could make', () => {
    const push = /^[a-h][1-8]$/;

    for (const opening of CURATED_OPENINGS) {
      if (!opening.theory) continue;
      const board = new Chess();
      for (const san of opening.moves) {
        expect(board.move(san), `${opening.name}: ${san}`).not.toBeNull();
      }
      const skeleton = pawnSkeleton(board.fen());

      for (const brk of opening.theory.breaks) {
        if (!push.test(brk.move)) continue;
        const file = brk.move[0]!;
        const rank = Number(brk.move[1]);
        const behind = [...Array(8).keys()]
          .map((index) => index + 1)
          .filter((candidate) => (brk.side === 'white' ? candidate < rank : candidate > rank));

        const found = behind.some((candidate) => skeleton.has(brk.side, `${file}${candidate}`));
        expect(
          found,
          `${opening.name}: ${brk.side} cannot push to ${brk.move} — no ${brk.side} pawn behind it on the ${file}-file`,
        ).toBe(true);
      }
    }
  });

  it('every structure skeleton is a valid position with both kings', () => {
    for (const structure of PAWN_STRUCTURES) {
      const pos = parseFen(structure.fen);
      expect(toFen(pos), `${structure.name} FEN does not round-trip`).toBe(structure.fen);
      expect(pos.kings[0], `${structure.name} has no white king`).toBeGreaterThanOrEqual(0);
      expect(pos.kings[1], `${structure.name} has no black king`).toBeGreaterThanOrEqual(0);
    }
  });

  /**
   * Four of these diagrams shipped with a pawn missing or on the wrong side —
   * a Benoni where White kept the c-pawn and Black had none, Sicilians where
   * White had no c2. Nothing caught it because nothing read them. They are read
   * now, by the classifier, so the counts are worth pinning: none of these
   * structures is a gambit, so both sides must have the same number of pawns.
   */
  /**
   * An entry once vanished from the array mid-edit — a rewrite consumed a
   * closing brace, the following entry was absorbed into the one before it, and
   * the file still parsed. Every test passed. Nothing in a book keyed by move
   * sequence notices that one of its addresses stopped existing, so this checks
   * the two things that would have caught it: the count only ever grows, and
   * the openings a reader is most likely to look up still resolve to real
   * teaching content.
   */
  it('does not quietly lose entries', () => {
    expect(CURATED_OPENINGS.length).toBeGreaterThanOrEqual(398);

    const landmarks = [
      'e4',
      'd4',
      'e4 c5',
      'e4 e6',
      'e4 c6',
      'e4 e5 Nf3 Nc6 Bb5',
      'd4 d5 c4',
      'd4 Nf6 c4 g6 Nc3 Bg7 e4 d6',
      'e4 c6 d4 d5 exd5 cxd5 c4',
      'e4 e5 f4',
      'd4 Nf6 c4 c5 d5 e6 Nc3 exd5 cxd5 d6',
    ];
    // Theory may be the node's own or inherited; what matters is that a reader
    // looking the opening up is shown some.
    for (const line of landmarks) {
      const match = identifyOpening(line.split(' '));
      expect(match, `nothing identified at "${line}"`).not.toBeNull();
      expect(match!.theory, `"${line}" (${match!.opening.name}) shows no theory`).toBeDefined();
    }
  });

  it('every structure skeleton has balanced material', () => {
    for (const structure of PAWN_STRUCTURES) {
      const placement = structure.fen.split(' ')[0]!;
      const white = placement.replace(/[^P]/g, '').length;
      const black = placement.replace(/[^p]/g, '').length;
      expect(white, `${structure.name}: ${white} white pawns vs ${black} black`).toBe(black);
      expect(white, `${structure.name} has too few pawns to be a structure`).toBeGreaterThanOrEqual(5);
    }
  });

  it('structure cross-references resolve', () => {
    for (const structure of PAWN_STRUCTURES) {
      for (const id of structure.transformsInto ?? []) {
        expect(getStructure(id), `${structure.name} -> unknown "${id}"`).toBeDefined();
      }
    }
  });
});

describe('identification', () => {
  it('names the deepest matching line', () => {
    const najdorf = 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6'.split(' ');
    const match = identifyOpening(najdorf)!;
    expect(match.opening.name).toBe('Sicilian Defence: Najdorf Variation');
    expect(match.opening.eco).toBe('B90');
    expect(match.exact).toBe(true);
  });

  it('falls back to the last known position once out of book', () => {
    // Deliberately unnatural moves — with the full ECO tables loaded, almost
    // anything reasonable already has a name.
    const match = identifyOpening(
      'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Be3 Na6 Qd2 Nc7 O-O-O Ne8'.split(' '),
    )!;
    expect(match.opening.name).toContain('Sicilian');
    expect(match.exact).toBe(false);
    expect(match.depth).toBeLessThan(16);
  });

  it('inherits theory from the parent opening', () => {
    const classicalSystem = identifyOpening(
      'd4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O Nc6 d5 Ne7 Ne1'.split(' '),
    )!;
    expect(classicalSystem.opening.name).toContain('Classical System');
    expect(classicalSystem.opening.theory).toBeUndefined();
    expect(classicalSystem.theorySource?.name).toBe('King’s Indian Defence: Mar del Plata');
    expect(classicalSystem.theory?.structures).toContain('kid-locked');
  });

  it('returns null before any move', () => {
    expect(identifyOpening([])).toBeNull();
  });

  it('offers named continuations from the current position', () => {
    const next = continuationsFrom('e4'.split(' ')).map((o) => o.moves[1]);
    expect(next).toContain('c5');
    expect(next).toContain('e5');
    expect(next).toContain('e6');
    expect(next).toContain('c6');

    // One entry per distinct next move, not one per line beneath it.
    expect(new Set(next).size).toBe(next.length);
  });
});

describe('search', () => {
  it('finds openings by name, alias and ECO code', () => {
    expect(searchOpenings('najdorf')[0]?.eco).toBe('B90');
    expect(searchOpenings('KID')[0]?.name).toBe('King’s Indian Defence');
    expect(searchOpenings('B90')[0]?.name).toContain('Najdorf');
    expect(searchOpenings('sicilian').length).toBeGreaterThan(5);
  });

  it('filters by side and rating', () => {
    const forBlack = searchOpenings('sicilian', { side: 'black' });
    expect(forBlack.every((o) => o.forSide !== 'white')).toBe(true);

    const beginner = searchOpenings('', { maxRating: 1200, withTheoryOnly: true });
    expect(beginner.some((o) => o.name === 'London System')).toBe(true);
    expect(beginner.some((o) => o.name.includes('Najdorf'))).toBe(false);
  });

  it('prefers the entry that can teach when several share a name', () => {
    // Dozens of ECO rows are called "…Najdorf…"; the curated one wins because
    // it is the only one with plans attached.
    const [best] = searchOpenings('najdorf');
    expect(best?.theory).toBeDefined();
    expect(best?.name).toBe('Sicilian Defence: Najdorf Variation');
  });
});

describe('the imported ECO tables', () => {
  it('loads the full book', () => {
    const stats = bookStats();
    expect(stats.total).toBeGreaterThan(3500);
    expect(stats.curated).toBeGreaterThan(100);
    expect(stats.withTheory).toBeGreaterThan(25);
    expect(stats.maxPlies).toBeGreaterThan(20);
  });

  it('every imported line is legal and in our own SAN', () => {
    // The generated file is machine-written, so this is the guard that it was
    // generated from good data and has not been hand-edited into nonsense.
    for (const opening of OPENINGS) {
      const game = new Chess();
      for (const san of opening.moves) {
        const played = game.move(san);
        expect(played, `${opening.eco} ${opening.name}: illegal ${san}`).not.toBeNull();
        // Round-tripping proves the stored SAN is exactly what we would emit.
        expect(played!.san, `${opening.name}: SAN mismatch`).toBe(san);
      }
    }
  });

  it('has no duplicate move sequences after the merge', () => {
    const seen = new Set<string>();
    for (const opening of OPENINGS) {
      const id = opening.moves.join(' ');
      expect(seen.has(id), `duplicate line ${id}`).toBe(false);
      seen.add(id);
    }
  });

  it('lets curated entries win over imported ones for the same position', () => {
    const najdorf = 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6'.split(' ');
    const found = deepestOpening(najdorf)!;
    expect(found.theory).toBeDefined();
    expect(found.name).toBe('Sicilian Defence: Najdorf Variation');
  });

  it('gives deep imported lines the theory of their curated ancestor', () => {
    // A Najdorf sub-variation that exists only in the imported tables. This
    // was the Poisoned Pawn until that line was given an entry of its own —
    // the assertion is about inheritance, so it has to name a line that is
    // still only in the tables. Move it again if the Polugaevsky is written.
    const deep = 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Bg5 e6 f4 b5'.split(' ');
    const match = identifyOpening(deep)!;
    expect(match.opening.theory).toBeUndefined();
    expect(match.theorySource?.name).toContain('Najdorf');
    expect(match.theory?.structures).toContain('boleslavsky');
  });

  it('names openings the curated book never mentioned', () => {
    const budapest = identifyOpening('d4 Nf6 c4 e5'.split(' '))!;
    expect(budapest.opening.name).toContain('Budapest');

    const grob = identifyOpening(['g4'])!;
    expect(grob.opening.name).toContain('Grob');
  });

  it('normalises names so curated and imported entries read as one list', () => {
    expect(OPENINGS.filter((o) => /\bDefense\b/.test(o.name))).toHaveLength(0);
    expect(OPENINGS.filter((o) => o.name.includes("'"))).toHaveLength(0);
  });
});
