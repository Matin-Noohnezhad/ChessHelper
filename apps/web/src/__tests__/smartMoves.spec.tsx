import { afterEach, describe, expect, it, vi } from 'vitest';
import { Chess } from '@coh/chess-core';
import { reverseCapture, smartCandidates, SmartMoveEngine } from '../smartMoves.js';

describe('fast move entry legality', () => {
  it('offers both pawn advances when no capture exists', () => {
    expect(smartCandidates(new Chess(), 'e2').map((m) => m.uci).sort()).toEqual(['e2e3', 'e2e4']);
  });

  it('offers all legal movers to an empty destination', () => {
    expect(smartCandidates(new Chess(), 'e4').map((m) => m.uci)).toEqual(['e2e4']);
    const game = new Chess('4k3/8/8/8/8/8/8/1N2KN2 w - - 0 1');
    expect(smartCandidates(game, 'd2').map((m) => m.uci).sort()).toEqual(['b1d2', 'e1d2', 'f1d2']);
    expect(smartCandidates(new Chess(), 'e5')).toEqual([]);
  });

  it('excludes pinned movers to an empty square and supports Black', () => {
    const pinned = new Chess('k3r3/8/8/8/4N3/8/8/4K3 w - - 0 1');
    expect(smartCandidates(pinned, 'f6')).toEqual([]);
    const black = new Chess();
    black.move('e4');
    expect(smartCandidates(black, 'e5').map((m) => m.uci)).toEqual(['e7e5']);
  });

  it('supports en passant, castling and promotions by destination', () => {
    const ep = new Chess('4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1');
    expect(smartCandidates(ep, 'd6').map((m) => m.uci)).toEqual(['e5d6']);
    const castle = new Chess('4k3/8/8/8/8/8/8/4K2R w K - 0 1');
    expect(smartCandidates(castle, 'g1').map((m) => m.uci)).toContain('e1g1');
    const promotion = new Chess('4k3/P7/8/8/8/8/8/4K3 w - - 0 1');
    expect(smartCandidates(promotion, 'a8').map((m) => m.uci).sort()).toEqual(['a7a8b', 'a7a8n', 'a7a8q', 'a7a8r']);
  });

  it('prioritizes captures and supports clicking the victim', () => {
    const game = new Chess('4k3/8/5b2/2p5/4N3/8/8/4K3 w - - 0 1');
    expect(smartCandidates(game, 'e4').map((m) => m.uci).sort()).toEqual(['e4c5', 'e4f6']);
  });

  it('reverses bishop onto knight while rejecting illegal and pinned captures', () => {
    const game = new Chess('4k3/8/5b2/8/4N3/8/8/4K3 w - - 0 1');
    expect(reverseCapture(game, 'f6', 'e4')?.uci).toBe('e4f6');
    expect(smartCandidates(game, 'e4').map((m) => m.uci)).toEqual(['e4f6']);
    expect(smartCandidates(game, 'f6').map((m) => m.uci)).toEqual(['e4f6']);
    expect(reverseCapture(game, 'f6', 'e1')).toBeUndefined();
    expect(reverseCapture(game, 'e4', 'f6')).toBeUndefined();
    const pinned = new Chess('k3r3/8/5b2/8/4N3/8/8/4K3 w - - 0 1');
    expect(reverseCapture(pinned, 'f6', 'e4')).toBeUndefined();
    expect(smartCandidates(pinned, 'e4')).toEqual([]);
  });

  it('captures an en-passant victim on its actual square', () => {
    const game = new Chess('4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1');
    expect(reverseCapture(game, 'd5', 'e5')?.uci).toBe('e5d6');
    expect(smartCandidates(game, 'd5').map((m) => m.uci)).toEqual(['e5d6']);
  });

  it('retains all capture promotions for evaluation', () => {
    const game = new Chess('1r2k3/P7/8/8/8/8/8/4K3 w - - 0 1');
    expect(smartCandidates(game, 'a7').map((m) => m.uci).sort()).toEqual(['a7b8b', 'a7b8n', 'a7b8q', 'a7b8r']);
  });
});

class FakeWorker {
  static instances: FakeWorker[] = [];
  onmessage: ((event: { data: string }) => void) | null = null;
  onerror: (() => void) | null = null;
  messages: string[] = [];
  terminated = false;
  constructor() { FakeWorker.instances.push(this); }
  postMessage(message: string) { this.messages.push(message); }
  terminate() { this.terminated = true; }
  emit(data: string) { this.onmessage?.({ data }); }
}

describe('smart move engine', () => {
  afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); FakeWorker.instances = []; });

  it('restricts Stockfish to candidates and reuses the initialized worker', async () => {
    vi.stubGlobal('Worker', FakeWorker);
    const engine = new SmartMoveEngine();
    const game = new Chess();
    const request = engine.choose(game.fen(), smartCandidates(game, 'e2'), new AbortController().signal);
    const worker = FakeWorker.instances[0]!;
    worker.emit('uciok'); worker.emit('readyok');
    expect(worker.messages).toContain(`position fen ${game.fen()}`);
    expect(worker.messages.find((m) => m.startsWith('go '))).toMatch(/go depth 4 movetime 80 searchmoves e2e[34] e2e[34]$/);
    worker.emit('bestmove e2e4');
    expect((await request).uci).toBe('e2e4');
    const next = engine.choose(game.fen(), smartCandidates(game, 'd2'), new AbortController().signal);
    expect(FakeWorker.instances).toHaveLength(1);
    worker.emit('bestmove d2d3');
    expect((await next).uci).toBe('d2d3');
    engine.dispose();
    expect(worker.terminated).toBe(true);
  });

  it('aborts pending searches so a late result cannot play', async () => {
    vi.stubGlobal('Worker', FakeWorker);
    const engine = new SmartMoveEngine();
    const game = new Chess();
    const controller = new AbortController();
    const result = engine.choose(game.fen(), smartCandidates(game, 'e2'), controller.signal);
    const rejected = expect(result).rejects.toMatchObject({ name: 'AbortError' });
    controller.abort();
    await rejected;
    expect(FakeWorker.instances[0]!.terminated).toBe(true);
  });

  it('rejects an engine move outside the eligible set', async () => {
    vi.stubGlobal('Worker', FakeWorker);
    const game = new Chess();
    const engine = new SmartMoveEngine();
    const result = engine.choose(game.fen(), smartCandidates(game, 'e2'), new AbortController().signal);
    FakeWorker.instances[0]!.emit('bestmove d2d4');
    await expect(result).rejects.toThrow('no legal choice');
  });

  it('uses the latest eligible engine choice by 100 ms and ignores late results', async () => {
    vi.useFakeTimers(); vi.stubGlobal('Worker', FakeWorker);
    const game = new Chess();
    const engine = new SmartMoveEngine();
    const result = engine.choose(game.fen(), smartCandidates(game, 'e2'), new AbortController().signal);
    const worker = FakeWorker.instances[0]!;
    worker.emit('uciok'); worker.emit('readyok');
    worker.emit('info depth 2 score cp 20 pv e2e4 e7e5');
    worker.emit('info depth 3 score cp 25 pv d2d4');
    await vi.advanceTimersByTimeAsync(100);
    expect((await result).uci).toBe('e2e4');
    expect(worker.terminated).toBe(true);
    const next = engine.choose(game.fen(), smartCandidates(game, 'd2'), new AbortController().signal);
    worker.emit('bestmove d2d4');
    FakeWorker.instances[1]!.emit('bestmove d2d3');
    expect((await next).uci).toBe('d2d3');
    engine.dispose();
  });

  it('preloads without searching and plays a single candidate immediately', async () => {
    vi.stubGlobal('Worker', FakeWorker);
    const engine = new SmartMoveEngine();
    engine.warmup();
    const worker = FakeWorker.instances[0]!;
    worker.emit('uciok'); worker.emit('readyok');
    expect(worker.messages.some((m) => m.startsWith('go '))).toBe(false);
    const game = new Chess();
    expect((await engine.choose(game.fen(), smartCandidates(game, 'e4'), new AbortController().signal)).uci).toBe('e2e4');
    expect(worker.messages.some((m) => m.startsWith('go '))).toBe(false);
    engine.dispose();
  });

  it('falls back within 100 ms while loading, then reuses the warmed engine', async () => {
    vi.useFakeTimers(); vi.stubGlobal('Worker', FakeWorker);
    const engine = new SmartMoveEngine();
    const game = new Chess('4k3/P7/8/8/8/8/8/4K3 w - - 0 1');
    const result = engine.choose(game.fen(), smartCandidates(game, 'a8'), new AbortController().signal);
    await vi.advanceTimersByTimeAsync(100);
    expect((await result).uci).toBe('a7a8q');
    const worker = FakeWorker.instances[0]!;
    expect(worker.terminated).toBe(false);
    worker.emit('uciok'); worker.emit('readyok');
    expect(worker.messages.some((m) => m.startsWith('go '))).toBe(false);
    const next = engine.choose(game.fen(), smartCandidates(game, 'a8'), new AbortController().signal);
    expect(FakeWorker.instances).toHaveLength(1);
    worker.emit('bestmove a7a8n');
    expect((await next).uci).toBe('a7a8n');
    engine.dispose();
  });

  it('cancels an old search even when the next click has only one candidate', async () => {
    vi.stubGlobal('Worker', FakeWorker);
    const engine = new SmartMoveEngine();
    const game = new Chess();
    const result = engine.choose(game.fen(), smartCandidates(game, 'e2'), new AbortController().signal);
    const rejected = expect(result).rejects.toMatchObject({ name: 'AbortError' });
    const next = engine.choose(game.fen(), smartCandidates(game, 'd4'), new AbortController().signal);
    await rejected;
    expect((await next).uci).toBe('d2d4');
    expect(FakeWorker.instances[0]!.terminated).toBe(true);
    engine.dispose();
  });
});
