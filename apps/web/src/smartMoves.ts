import type { Chess, MoveInfo } from '@coh/chess-core';

/** Own piece: captures first. Opponent piece: legal captures of that piece. */
export function smartCandidates(game: Chess, square: string): MoveInfo[] {
  const piece = game.pieceAt(square);
  if (!piece) return [];
  const moves = game.legalMoves();
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

/** An independent, lazy worker keeps click searches separate from live analysis. */
export class SmartMoveEngine {
  private worker: Worker | null = null;
  private ready = false;
  private cancel: (() => void) | null = null;

  choose(fen: string, candidates: MoveInfo[], signal: AbortSignal): Promise<MoveInfo> {
    if (signal.aborted) return Promise.reject(new DOMException('Cancelled', 'AbortError'));
    if (candidates.length === 1) return Promise.resolve(candidates[0]!);
    this.cancel?.();
    return new Promise((resolve, reject) => {
      if (!candidates.length) { reject(new Error('No legal moves')); return; }
      let settled = false;
      const finish = (move?: MoveInfo, error?: Error) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        signal.removeEventListener('abort', abort);
        this.cancel = null;
        if (error) {
          this.worker?.terminate();
          this.worker = null;
          this.ready = false;
          reject(error);
        } else resolve(move!);
      };
      const abort = () => finish(undefined, new DOMException('Cancelled', 'AbortError'));
      const timeout = setTimeout(() => finish(undefined, new Error('Smart move timed out')), 12000);
      this.cancel = abort;
      signal.addEventListener('abort', abort, { once: true });
      try {
        const fresh = !this.worker;
        const worker = this.worker ?? new Worker('/engine/stockfish-18-lite-single.js');
        this.worker = worker;
        const search = () => {
          worker.postMessage(`position fen ${fen}`);
          // Stockfish ranks only this piece's eligible moves, including promotions.
          worker.postMessage(`go movetime 250 searchmoves ${candidates.map((move) => move.uci).join(' ')}`);
        };
        worker.onerror = () => finish(undefined, new Error('Smart move engine could not load'));
        worker.onmessage = (event: MessageEvent<string>) => {
          if (settled) return;
          if (event.data === 'uciok') {
            worker.postMessage('setoption name Hash value 16');
            worker.postMessage('isready');
          } else if (event.data === 'readyok') {
            this.ready = true;
            search();
          } else if (event.data.startsWith('bestmove ')) {
            const move = candidates.find((candidate) => candidate.uci === event.data.split(' ')[1]);
            finish(move, move ? undefined : new Error('Smart move engine returned no legal choice'));
          }
        };
        if (fresh) worker.postMessage('uci');
        else if (this.ready) search();
      } catch (error) {
        finish(undefined, error instanceof Error ? error : new Error('Smart move engine unavailable'));
      }
    });
  }

  dispose(): void {
    this.cancel?.();
    this.worker?.terminate();
    this.worker = null;
    this.ready = false;
  }
}
