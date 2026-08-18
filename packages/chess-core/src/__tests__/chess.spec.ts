import { describe, expect, it } from 'vitest';
import { Chess } from '../chess.js';
import { START_FEN, loadFen, parseFen, toFen } from '../fen.js';
import { Position } from '../position.js';
import { generateLegalMoves } from '../movegen.js';
import { moveToSan, parseSan, resolveSan } from '../san.js';
import {
  formatMoveText,
  parseAnnotatedPgn,
  parseAnnotatedPgnAll,
  parseMoveText,
  parsePgn,
} from '../pgn.js';

describe('FEN', () => {
  it('round-trips a set of positions unchanged', () => {
    const fens = [
      START_FEN,
      'r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1',
      'rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
      '8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1',
      '4k3/8/8/8/8/8/8/4K2R w K - 13 47',
    ];
    for (const fen of fens) expect(toFen(parseFen(fen))).toBe(fen);
  });

  it('sets the en passant square after a double push', () => {
    const game = new Chess();
    game.move('e4');
    expect(game.fen()).toBe('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1');
  });
});

describe('SAN', () => {
  it('plays and names a short opening line', () => {
    const game = new Chess();
    for (const san of ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'a6']) {
      expect(game.move(san), `expected ${san} to be legal`).not.toBeNull();
    }
    // Najdorf.
    expect(game.fenKey()).toBe(
      'rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq -',
    );
    expect(game.history().join(' ')).toBe('e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6');
  });

  it('disambiguates by file, then rank, then square', () => {
    const byFile = new Chess('4k3/8/8/8/8/8/4K3/R6R w - - 0 1');
    expect(byFile.sanMoves()).toContain('Rad1');
    expect(byFile.sanMoves()).toContain('Rhd1');

    const byRank = new Chess('4k3/8/8/R7/8/8/8/R3K3 w - - 0 1');
    expect(byRank.sanMoves()).toContain('R1a3');
    expect(byRank.sanMoves()).toContain('R5a3');

    // Queens on a8, d8 and a5 all reach d5. The a8 queen shares a file with
    // one and a rank with the other, so only the full square identifies it.
    const bySquare = new Chess('Q2Q4/8/8/Q7/8/8/2k5/4K3 w - - 0 1');
    const moves = bySquare.sanMoves();
    expect(moves).toContain('Qa8d5');
    expect(moves).toContain('Qdd5');
    expect(moves).toContain('Q5d5');
  });

  it('marks checks and mates', () => {
    const scholars = new Chess();
    for (const san of ['e4', 'e5', 'Bc4', 'Nc6', 'Qh5', 'Nf6']) scholars.move(san);
    expect(scholars.move('Qxf7')?.san).toBe('Qxf7#');
    expect(scholars.isCheckmate()).toBe(true);
    expect(scholars.result()).toBe('1-0');

    const check = new Chess('4k3/8/8/8/8/8/8/4K2R w K - 0 1');
    expect(check.move('Rh8')?.san).toBe('Rh8+');
  });

  it('writes castling and promotion', () => {
    const castle = new Chess('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1');
    expect(castle.sanMoves()).toContain('O-O');
    expect(castle.sanMoves()).toContain('O-O-O');
    expect(castle.move('O-O-O')?.to).toBe('c1');
    expect(castle.pieceAt('d1')?.type).toBe('r');

    const promo = new Chess('8/1P6/8/8/8/8/k6K/8 w - - 0 1');
    expect(promo.sanMoves()).toContain('b8=Q');
    expect(promo.sanMoves()).toContain('b8=N');
    expect(promo.move('b8=N')?.promotion).toBe('n');
    expect(promo.pieceAt('b8')?.type).toBe('n');
  });

  it('accepts UCI and object input, and rejects illegal moves', () => {
    const game = new Chess();
    expect(game.move('e2e4')?.san).toBe('e4');
    expect(game.move({ from: 'e7', to: 'e5' })?.san).toBe('e5');
    expect(game.move('Ke3')).toBeNull(); // king cannot jump two squares
    expect(game.move('Qd8')).toBeNull(); // black's queen, and not white's turn
    expect(game.move('e1e9')).toBeNull(); // not even a square
    expect(game.history()).toEqual(['e4', 'e5']);
  });
});

describe('game state', () => {
  it('detects stalemate', () => {
    const game = new Chess('7k/5Q2/6K1/8/8/8/8/8 b - - 0 1');
    expect(game.isStalemate()).toBe(true);
    expect(game.isDraw()).toBe(true);
    expect(game.result()).toBe('1/2-1/2');
  });

  it('detects insufficient material', () => {
    expect(new Chess('4k3/8/8/8/8/8/8/4K3 w - - 0 1').isInsufficientMaterial()).toBe(true);
    expect(new Chess('4k3/8/8/8/8/8/8/4KB2 w - - 0 1').isInsufficientMaterial()).toBe(true);
    expect(new Chess('4kb2/8/8/8/8/8/8/4KB2 w - - 0 1').isInsufficientMaterial()).toBe(false);
    expect(new Chess('4k3/8/8/8/8/8/4P3/4K3 w - - 0 1').isInsufficientMaterial()).toBe(false);
  });

  it('detects threefold repetition by shuffling knights back and forth', () => {
    const game = new Chess();
    expect(game.isThreefoldRepetition()).toBe(false);
    for (let i = 0; i < 2; i++) {
      for (const san of ['Nf3', 'Nf6', 'Ng1', 'Ng8']) game.move(san);
    }
    expect(game.isThreefoldRepetition()).toBe(true);
  });

  it('undo restores the exact prior position, hash included', () => {
    const game = new Chess();
    for (const san of ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4']) game.move(san);
    const fen = game.fen();
    const key = game.position.key();

    game.move('Nxd4');
    game.undo();

    expect(game.fen()).toBe(fen);
    expect(game.position.key()).toBe(key);
    expect(game.history()).toHaveLength(6);
  });

  it('en passant capture removes the right pawn', () => {
    const game = new Chess('4k3/8/8/8/4p3/8/3P4/4K3 w - - 0 1');
    game.move('d4');
    expect(game.move('exd3')?.isEnPassant).toBe(true);
    expect(game.pieceAt('d4')).toBeNull();
    expect(game.pieceAt('d3')?.color).toBe('b');
  });
});

describe('PGN', () => {
  it('reads headers and the main line, skipping comments and sidelines', () => {
    const pgn = [
      '[Event "Test"]',
      '[White "A"]',
      '[Black "B"]',
      '[Result "1-0"]',
      '',
      '1. e4 e5 {a comment} 2. Nf3 (2. f4 exf4 3. Nf3) 2... Nc6 $1 3. Bb5 a6 1-0',
    ].join('\n');

    const game = parsePgn(pgn);
    expect(game.headers.White).toBe('A');
    expect(game.result).toBe('1-0');
    expect(game.moves).toEqual(['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6']);

    const board = new Chess();
    for (const san of game.moves) expect(board.move(san)).not.toBeNull();
  });

  it('formats movetext back out', () => {
    expect(formatMoveText(['e4', 'e5', 'Nf3'], false, '*')).toBe('1.e4 e5 2.Nf3 *');
    expect(parseMoveText('1.e4 e5 2.Nf3')).toEqual(['e4', 'e5', 'Nf3']);
  });
});

describe('annotated PGN', () => {
  it('keeps clocks, evals, NAGs and prose per move', () => {
    const pgn = [
      '[Event "Rated blitz"]',
      '[TimeControl "180+2"]',
      '[Result "0-1"]',
      '',
      '1. e4 {[%clk 0:02:58]} e5!? {[%eval 0.31] [%clk 0:02:55] a solid reply}',
      '2. Nf3?? $4 {[%eval #-4] [%emt 0:00:07]} 0-1',
    ].join('\n');

    const game = parseAnnotatedPgn(pgn);
    expect(game.moves.map((m) => m.san)).toEqual(['e4', 'e5', 'Nf3']);
    expect(game.moves[0]!.clockSeconds).toBe(178);
    expect(game.moves[1]!.suffix).toBe('!?');
    expect(game.moves[1]!.evalCp).toBe(31);
    expect(game.moves[1]!.comment).toBe('a solid reply');
    expect(game.moves[2]!.nags).toEqual([4]);
    expect(game.moves[2]!.evalMate).toBe(-4);
    expect(game.moves[2]!.emtSeconds).toBe(7);
    expect(game.result).toBe('0-1');
  });

  it('keeps the main line clear of sidelines and their clocks', () => {
    const game = parseAnnotatedPgn(
      '1. e4 e5 (1... c5 {[%clk 0:01:00]} 2. Nf3 (2. Nc3)) 2. Nf3 {[%clk 0:02:00]} Nc6 *',
    );
    expect(game.moves.map((m) => m.san)).toEqual(['e4', 'e5', 'Nf3', 'Nc6']);
    expect(game.moves[1]!.clockSeconds).toBeUndefined();
    expect(game.moves[2]!.clockSeconds).toBe(120);
  });

  it('hangs sidelines off the move they replace, nesting and all', () => {
    const game = parseAnnotatedPgn(
      '1. e4 e5 (1... c5 {[%clk 0:01:00]} 2. Nf3 (2. Nc3)) 2. Nf3 Nc6 *',
    );
    const sicilian = game.moves[1]!.variations![0]!;
    expect(sicilian.map((m) => m.san)).toEqual(['c5', 'Nf3']);
    expect(sicilian[0]!.clockSeconds).toBe(60);
    expect(sicilian[1]!.variations![0]!.map((m) => m.san)).toEqual(['Nc3']);
    expect(game.moves[0]!.variations).toBeUndefined();
  });

  it('reads the prose a course writes about a sideline, wherever it sits', () => {
    const game = parseAnnotatedPgn(
      '1. d4 Nf6 2. c4 (2. Nf3 {a move-order finesse} e6 $14) (2. Bg5!? {the Trompowsky}) *',
    );
    const [reti, tromp] = game.moves[2]!.variations!;
    expect(reti![0]!.comment).toBe('a move-order finesse');
    expect(reti![1]!.nags).toEqual([14]);
    expect(tromp![0]!.suffix).toBe('!?');
    expect(tromp![0]!.comment).toBe('the Trompowsky');
  });

  it('attaches a leading comment to the first move of its line', () => {
    const game = parseAnnotatedPgn('{Welcome to the course.} 1. d4 d5 ({why not} 1... Nf6) *');
    expect(game.moves[0]!.comment).toBe('Welcome to the course.');
    expect(game.moves[1]!.variations![0]![0]!.comment).toBe('why not');
  });

  it('keeps a passed turn rather than dropping it', () => {
    // ChessBase writes Z0 for "it is now the other side's move"; dropping the
    // token would put every move after it on the wrong side.
    const game = parseAnnotatedPgn('1. e4 e5 2. Nf3 Z0 (2... Nc6 3. Bb5) 3. Bc4 *');
    expect(game.moves.map((m) => m.san)).toEqual(['e4', 'e5', 'Nf3', '--', 'Bc4']);
    expect(game.moves[3]!.nullMove).toBe(true);
    expect(game.moves[3]!.variations![0]!.map((m) => m.san)).toEqual(['Nc6', 'Bb5']);
    expect(game.moves[2]!.nullMove).toBeUndefined();
    expect(parseAnnotatedPgn('1. e4 -- 2. d4 *').moves.map((m) => m.san)).toEqual([
      'e4',
      '--',
      'd4',
    ]);
  });

  it('reads a starting position from the FEN header', () => {
    const game = parseAnnotatedPgn('[SetUp "1"]\n[FEN "8/5k2/8/8/8/4K3/4P3/8 w - - 0 1"]\n\n1. Kd4 Ke6 *');
    expect(game.startFen).toBe('8/5k2/8/8/8/4K3/4P3/8 w - - 0 1');
    expect(game.moves.map((m) => m.san)).toEqual(['Kd4', 'Ke6']);
  });

  it('splits a file of several games', () => {
    const file = [
      '[Event "One"]',
      '',
      '1. e4 e5 1/2-1/2',
      '',
      '[Event "Two"]',
      '',
      '1. d4 d5 0-1',
    ].join('\n');

    const games = parseAnnotatedPgnAll(file);
    expect(games).toHaveLength(2);
    expect(games[0]!.headers.Event).toBe('One');
    expect(games[1]!.moves.map((m) => m.san)).toEqual(['d4', 'd5']);
    expect(games[1]!.result).toBe('0-1');
  });
});

describe('resolveSan', () => {
  /**
   * The fast path exists only because it is interchangeable with parseSan, so
   * the test that matters is the one that says so. These positions carry the
   * cases that separate the two: both knights covering a square, a rook pair on
   * a file and a rank, pinned pieces that remove a disambiguation, promotions,
   * en passant and castling.
   */
  const fens = [
    START_FEN,
    'r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1',
    'r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R b KQkq - 0 1',
    '8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1',
    'n1n5/PPPk4/8/8/8/8/4Kppp/5N1N b - - 0 1', // promotions both sides
    'r3k2r/8/8/3N1N2/8/8/8/R3K2R w KQkq - 0 1', // two knights, castling both ways
    'r6r/1b2k3/8/8/8/8/4K3/R6R w - - 0 1', // rooks sharing rank and file
    '4k3/8/8/2pP4/8/8/8/4K3 w - c6 0 2', // en passant
    'rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq d6 0 2',
    '2r3k1/5ppp/8/8/8/8/2Q2PPP/2R3K1 w - - 0 1', // pinned piece kills a disambiguation
  ];

  it('returns exactly what parseSan returns, for every legal move', () => {
    let checked = 0;
    for (const fen of fens) {
      const pos = new Position();
      loadFen(pos, fen);
      for (const move of generateLegalMoves(pos)) {
        const san = moveToSan(pos, move);
        expect(resolveSan(pos, san), `${fen} — ${san}`).toBe(parseSan(pos, san));
        expect(resolveSan(pos, san), `${fen} — ${san}`).toBe(move);
        checked++;
      }
    }
    expect(checked).toBeGreaterThan(250);
  });

  it('agrees with parseSan on notation the wild writes badly', () => {
    const pos = new Position();
    loadFen(pos, START_FEN);
    for (const san of ['e4', 'E4', 'e2e4', 'Nf3+', 'Nf3!?', 'Ke2', 'Qd4', 'O-O', 'xyz', '']) {
      expect(resolveSan(pos, san), san).toBe(parseSan(pos, san));
    }
  });

  it('accepts disambiguation our own renderer would leave out', () => {
    // Nc6 is pinned by Bb5, so only one knight legally reaches e7 and moveToSan
    // writes 'Ne7'. ChessBase disambiguates against the pieces that *could*
    // move and writes 'Nge7'; both must resolve to the g8 knight.
    const pos = new Position();
    loadFen(pos, 'r3kbnr/pp3ppp/2n5/1Bp1p3/8/2P1BN2/PP3PPP/RN1K3R b kq - 0 9');
    const plain = resolveSan(pos, 'Ne7');
    expect(plain).not.toBeNull();
    expect(resolveSan(pos, 'Nge7')).toBe(plain);
    expect(parseSan(pos, 'Nge7')).toBe(plain);
    expect(parseSan(pos, 'Nce7')).toBeNull(); // the pinned knight cannot go there
  });

  it('reads a promotion written without the equals sign', () => {
    const pos = new Position();
    loadFen(pos, '4k3/P7/8/8/8/8/8/4K3 w - - 0 1');
    expect(resolveSan(pos, 'a8Q')).toBe(resolveSan(pos, 'a8=Q'));
    expect(resolveSan(pos, 'a8=N')).not.toBe(resolveSan(pos, 'a8=Q'));
  });

  it('replays a full annotated game, sidelines included', () => {
    const game = parseAnnotatedPgn(
      '1. e4 c5 (1... e5 2. Nf3 Nc6 3. Bb5) 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 *',
    );
    const pos = new Position();
    loadFen(pos, START_FEN);
    for (const move of game.moves) {
      const sideline = move.variations?.[0];
      if (sideline) {
        const branch = new Position();
        loadFen(branch, toFen(pos));
        for (const alt of sideline) {
          const resolved = resolveSan(branch, alt.san);
          expect(resolved, alt.san).not.toBeNull();
          branch.make(resolved!);
        }
      }
      const resolved = resolveSan(pos, move.san);
      expect(resolved, move.san).not.toBeNull();
      pos.make(resolved!);
    }
  });
});
