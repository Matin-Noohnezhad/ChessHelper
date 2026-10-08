import type { Chess, MoveInfo } from '@coh/chess-core';

/** Own piece: captures first. Other squares: legal moves to that target. */
export function smartCandidates(game: Chess, square: string): MoveInfo[] {
  const piece = game.pieceAt(square);
  const moves = game.legalMoves();
  if (!piece) return moves.filter((move) => move.to === square);
  if (piece.color !== game.turn()) {
    return moves.filter((move) => move.isCapture && capturedSquare(move) === square);
  }
  const own = moves.filter((move) => move.from === square);
  const captures = own.filter((move) => move.isCapture);
  return captures.length ? captures : own;
}

function capturedSquare(move: MoveInfo): string {
  return move.isEnPassant ? move.to[0]! + move.from[1]! : move.to;
}

/** Also handles dragging an en-passant victim onto its capturing pawn. */
export function reverseCapture(game: Chess, victim: string, attacker: string): MoveInfo | undefined {
  if (game.pieceAt(victim)?.color === game.turn()) return undefined;
  return game.movesFrom(attacker).find((move) => move.isCapture && capturedSquare(move) === victim);
}

const SEARCH_DEPTH = 4;
const SEARCH_TIME_MS = 80;
const RESPONSE_TIME_MS = 100;

/** A cheap legal fallback while WASM loads, preferring material gain and queen promotions. */
function fallbackMove(candidates: MoveInfo[]): MoveInfo {
  const value = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };
  const score = (move: MoveInfo) => (move.captured ? value[move.captured] * 10 - value[move.piece] : 0)
    + (move.promotion ? value[move.promotion] * 10 : 0);
  return candidates.reduce((best, move) => score(move) > score(best) ? move : best);
}

/** An independent, shallow worker keeps click searches separate from live analysis. */
export class SmartMoveEngine {
  private worker: Worker | null = null;
  private ready = false;
  private cancel: (() => void) | null = null;
  private onReady: (() => void) | null = null;
  private onLine: ((line: string) => void) | null = null;
  private onFailure: (() => void) | null = null;

  /** Load before the first click without doing any position analysis. */
  warmup(): void {
    if (this.worker) return;
    try {
      const worker = new Worker('/engine/stockfish-18-lite-single.js');
      this.worker = worker;
      worker.onmessage = (event: MessageEvent<string>) => {
        if (this.worker !== worker) return;
        if (event.data === 'uciok') {
          worker.postMessage('setoption name Hash value 16');
          worker.postMessage('isready');
        } else if (event.data === 'readyok') {
          this.ready = true;
          this.onReady?.();
        } else this.onLine?.(event.data);
      };
      worker.onerror = () => {
        if (this.worker !== worker) return;
        this.resetWorker();
        this.onFailure?.();
      };
      worker.postMessage('uci');
    } catch {
      this.resetWorker();
      this.onFailure?.();
    }
  }

  private resetWorker(): void {
    this.worker?.terminate();
    this.worker = null;
    this.ready = false;
  }

  choose(fen: string, candidates: MoveInfo[], signal: AbortSignal): Promise<MoveInfo> {
    if (signal.aborted) return Promise.reject(new DOMException('Cancelled', 'AbortError'));
    this.cancel?.();
    if (candidates.length === 1) return Promise.resolve(candidates[0]!);
    return new Promise((resolve, reject) => {
      if (!candidates.length) { reject(new Error('No legal moves')); return; }
      let settled = false;
      let best = fallbackMove(candidates);
      const finish = (move?: MoveInfo, error?: Error) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        signal.removeEventListener('abort', abort);
        this.cancel = null;
        this.onReady = null;
        this.onLine = null;
        this.onFailure = null;
        if (error) {
          this.resetWorker();
          reject(error);
        } else resolve(move!);
      };
      const abort = () => finish(undefined, new DOMException('Cancelled', 'AbortError'));
      const timeout = setTimeout(() => {
        // Keep a still-loading worker warm, but discard an overdue search so its
        // eventual bestmove cannot be mistaken for the next click's result.
        if (this.ready) this.resetWorker();
        finish(best);
      }, RESPONSE_TIME_MS);
      this.cancel = abort;
      signal.addEventListener('abort', abort, { once: true });
      const search = () => {
        try {
          const worker = this.worker!;
          worker.postMessage(`position fen ${fen}`);
          worker.postMessage(`go depth ${SEARCH_DEPTH} movetime ${SEARCH_TIME_MS} searchmoves ${candidates.map((move) => move.uci).join(' ')}`);
        } catch {
          this.resetWorker();
          finish(best);
        }
      };
      this.onReady = search;
      this.onFailure = () => finish(best);
      this.onLine = (line) => {
        if (line.startsWith('info ')) {
          const uci = /\bpv\s+(\S+)/.exec(line)?.[1];
          best = candidates.find((candidate) => candidate.uci === uci) ?? best;
        } else if (line.startsWith('bestmove ')) {
          const move = candidates.find((candidate) => candidate.uci === line.split(' ')[1]);
          finish(move, move ? undefined : new Error('Smart move engine returned no legal choice'));
        }
      };
      this.warmup();
      if (this.ready) search();
    });
  }

  dispose(): void {
    this.cancel?.();
    this.resetWorker();
  }
}
