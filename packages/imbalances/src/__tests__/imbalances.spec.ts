import { describe, expect, it } from 'vitest';
import { Chess } from '@coh/chess-core';
import { analyzeImbalances } from '../imbalances.js';

function play(sans: string[]): Chess {
  const chess = new Chess();
  for (const san of sans) {
    const info = chess.move(san);
    if (!info) throw new Error(`illegal move in test setup: ${san}`);
  }
  return chess;
}

describe('analyzeImbalances', () => {
  it('sees the starting position as perfectly balanced', () => {
    const { score, imbalances } = analyzeImbalances(new Chess());
    expect(score).toBe(0);
    expect(imbalances).toEqual([]);
  });

  it('keeps the score within [0, 1)', () => {
    // A wildly lopsided position: White up a queen and two pawns.
    const chess = new Chess('rnb1kbnr/pp3ppp/8/2p5/2P5/8/PPQPPPPP/RNB1KBNR w KQkq - 0 1');
    const { score } = analyzeImbalances(chess);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(1);
  });

  it('flags the Ruy Lopez Exchange: Black gets the bishop pair and doubled c-pawns', () => {
    const chess = play(['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Bxc6', 'dxc6']);
    const { imbalances } = analyzeImbalances(chess);

    const bishopPair = imbalances.find((i) => i.category === 'bishop-pair');
    expect(bishopPair?.side).toBe('black');

    const doubled = imbalances.find((i) => i.category === 'pawn-structure' && i.description.includes('Doubled'));
    expect(doubled?.description).toContain('c-file');
    expect(doubled?.description).toContain('Black');
  });

  it('detects opposite-coloured bishops', () => {
    // Bare kings plus one bishop each: c1 (dark) and f8 (dark) — same colour, no flag.
    const same = new Chess('4kb2/8/8/8/8/8/8/2B1K3 w - - 0 1');
    expect(analyzeImbalances(same).imbalances.some((i) => i.category === 'bishop-colors')).toBe(false);

    // f1 (light) and f8 (dark) — opposite-coloured bishops.
    const opposite = new Chess('4kb2/8/8/8/8/8/8/4KB2 w - - 0 1');
    const bishopColors = analyzeImbalances(opposite).imbalances.find((i) => i.category === 'bishop-colors');
    expect(bishopColors).toBeDefined();
    expect(bishopColors?.side).toBe('both');
  });

  it('detects an isolated pawn', () => {
    // White pawns on c2 and e2 (not d2), an isolated d-pawn stand-in on... use a clean hand-built case instead:
    // White pawn alone on the d-file, no pawns on c or e files.
    const chess = new Chess('4k3/8/8/8/8/8/3P4/4K3 w - - 0 1');
    const isolated = analyzeImbalances(chess).imbalances.find((i) => i.category === 'pawn-structure');
    expect(isolated?.description).toContain('Isolated pawn on the d-file (White)');
  });

  it('detects a passed pawn that has crossed the midpoint', () => {
    const chess = new Chess('4k3/8/8/3P4/8/8/8/4K3 w - - 0 1');
    const passed = analyzeImbalances(chess).imbalances.find((i) => i.description.includes('Passed pawn'));
    expect(passed?.side).toBe('white');
  });

  it('rewards castling safety once there is enough material left for it to matter', () => {
    // White castled kingside with queens/rooks/minors still on; Black's king still on e8.
    const chess = new Chess('r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQ1RK1 b kq - 5 4');
    const king = analyzeImbalances(chess).imbalances.find((i) => i.category === 'king-safety');
    expect(king?.side).toBe('white');
    expect(king?.description).toMatch(/castled/i);
  });

  it('gives a half-open file to the side missing pawns on it', () => {
    const chess = new Chess('4k3/ppp1pppp/8/8/8/8/PPPPPPPP/4K3 w - - 0 1');
    const openFile = analyzeImbalances(chess).imbalances.find((i) => i.category === 'open-file');
    expect(openFile?.description).toContain('d-file');
    expect(openFile?.side).toBe('black');
  });
});
