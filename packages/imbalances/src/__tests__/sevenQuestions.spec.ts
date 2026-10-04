import { describe, expect, it } from 'vitest';
import { Chess } from '@coh/chess-core';
import type { ColorName } from '@coh/chess-core';
import { analyzeSevenQuestions } from '../sevenQuestions.js';

const findings = (fen: string, color: ColorName, question: number) =>
  analyzeSevenQuestions(new Chess(fen), color).questions[question - 1]!.findings;

describe('7Q planning', () => {
  it('answers all seven questions without inventing an exchange preference in a symmetric position', () => {
    const chess = new Chess();
    const fen = chess.fen();
    const report = analyzeSevenQuestions(chess, 'w');
    expect(report.questions.map((q) => q.number)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(report.questions[3]!.findings.find((p) => p.id === 'develop')?.reason).toContain('b1');
    expect(report.questions[4]!.findings).toEqual([]);
    expect(report.questions[4]!.fallback).toContain('No clear exchange preference');
    expect(report.priorities[0]?.id).toBe('own-king');
    expect(chess.fen()).toBe(fen);
    expect(chess.history()).toEqual([]);
  });

  it('treats the same isolated pawn as a target or a problem depending on perspective', () => {
    const fen = '4k3/8/8/3p4/8/8/PPP2PPP/4K3 w - - 0 1';
    expect(findings(fen, 'w', 1).find((p) => p.id === 'enemy-isolated')?.reason).toContain('d5');
    expect(findings(fen, 'b', 2).find((p) => p.id === 'own-isolated')?.reason).toContain('d5');
    expect(findings(fen, 'w', 2).some((p) => p.id === 'own-isolated')).toBe(false);
  });

  it('identifies a pawn majority and the corresponding possible opposing plan', () => {
    const fen = '4k3/pp3ppp/8/8/8/8/PPP2PPP/4K3 w - - 0 1';
    expect(findings(fen, 'w', 3).find((p) => p.id === 'majority-queenside')?.reason).toContain('3 pawns against 2');
    expect(findings(fen, 'b', 6).find((p) => p.id === 'opponent-majority-queenside')?.action).toContain('may');
  });

  it('suggests improving or exchanging a bishop whose forward diagonals are blocked', () => {
    const fen = '4k1n1/ppp2ppp/8/8/8/8/1P1P4/2B1K3 w - - 0 1';
    expect(findings(fen, 'w', 4).find((p) => p.id === 'bishop-improvement')?.reason).toContain('c1');
    expect(findings(fen, 'w', 5).some((p) => p.id === 'bishop-trade')).toBe(true);
    const freed = fen.replace('1P1P4', '3P4');
    expect(findings(freed, 'w', 5).some((p) => p.id === 'bishop-trade')).toBe(false);
  });

  it('recognizes a bishop pair by both square colors, including promoted bishops', () => {
    const fen = '4k1n1/7p/8/8/8/8/P7/2B1KB2 w - - 0 1';
    expect(findings(fen, 'w', 5).some((p) => p.id === 'keep-bishops')).toBe(true);
    expect(findings(fen, 'b', 5).some((p) => p.id === 'trade-bishop')).toBe(true);
    const sameColor = '4k1n1/7p/8/8/8/8/P2B4/2B1K3 w - - 0 1';
    expect(findings(sameColor, 'w', 5).some((p) => p.id === 'keep-bishops')).toBe(false);
  });

  it('distinguishes simplification from preserving counterplay', () => {
    const fen = 'r3k3/7p/8/8/8/8/P7/R2QK3 w - - 0 1';
    expect(findings(fen, 'w', 5).find((p) => p.id === 'material-exchanges')?.title).toContain('simplifying');
    expect(findings(fen, 'b', 5).find((p) => p.id === 'material-exchanges')?.title).toContain('counterplay');
  });

  it('tracks passed pawns in either direction without treating their advance as certain', () => {
    const white = '4k3/8/8/3P4/8/8/8/4K3 w - - 0 1';
    expect(findings(white, 'w', 7).find((p) => p.id === 'advance-passers')?.reason).toContain('d5');
    expect(findings(white, 'b', 6).find((p) => p.id === 'enemy-passers')?.action).toContain('may');
    const black = '4k3/8/8/8/3p4/8/8/4K3 b - - 0 1';
    expect(findings(black, 'b', 7).find((p) => p.id === 'advance-passers')?.reason).toContain('d4');
    expect(analyzeSevenQuestions(new Chess(black), 'w').priorities[0]?.id).toBe('enemy-passers');
  });

  it('identifies potential pawn breaks without claiming legality and removes blocked pushes', () => {
    const fen = '4k3/8/8/3p4/8/2P5/8/4K3 w - - 0 1';
    expect(findings(fen, 'w', 7).find((p) => p.id === 'pawn-breaks')?.reason).toContain('c3–c4');
    expect(findings(fen, 'w', 7).find((p) => p.id === 'pawn-breaks')?.action).toContain('Verify legality');
    expect(findings(fen.replace('3p4/8', '3p4/2N5'), 'w', 7).some((p) => p.id === 'pawn-breaks')).toBe(false);
    const black = '4k3/8/2p5/8/3P4/8/8/4K3 b - - 0 1';
    expect(findings(black, 'b', 7).find((p) => p.id === 'pawn-breaks')?.reason).toContain('c6–c5');
  });

  it('updates findings after moves without modifying the game or its history', () => {
    const chess = new Chess();
    chess.move('Nf3');
    const fen = chess.fen();
    const report = analyzeSevenQuestions(chess, 'w');
    expect(report.questions[3]!.findings.find((p) => p.id === 'develop')?.reason).not.toContain('g1');
    expect(chess.fen()).toBe(fen);
    expect(chess.history()).toEqual(['Nf3']);
  });

  it.each([
    ['4k3/8/8/8/8/8/4r3/4K3 w - - 0 1', 'check'],
    ['7k/6Q1/5K2/8/8/8/8/8 b - - 0 1', 'finished'],
    ['7k/5Q2/5K2/8/8/8/8/8 b - - 0 1', 'finished'],
  ])('defers planning in check or at game end: %s', (fen, status) => {
    for (const side of ['w', 'b'] as const) {
      expect(analyzeSevenQuestions(new Chess(fen), side)).toEqual({ status, questions: [], priorities: [] });
    }
  });
});
