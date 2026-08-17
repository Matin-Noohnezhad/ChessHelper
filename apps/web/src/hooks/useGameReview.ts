import { useCallback, useEffect, useRef, useState } from 'react';
import { Chess } from '@coh/chess-core';
import { ReviewAbortedError, reviewPgn } from '@coh/review';
import type { CandidateMove, EvaluatedPosition, GameReview, Score } from '@coh/review';
import { parseInfoLine } from './useEngine.js';

/**
 * Drives a whole-game review from the same vendored Stockfish build the explore
 * board uses, one position at a time.
 *
 * A separate worker from {@link useEngine} on purpose: the review holds the
 * engine for minutes at a stretch, and interleaving its searches with the
 * live board's would make both slower and the code far harder to reason about.
 */
const ENGINE_URL = '/engine/stockfish-18-lite-single.js';
/** Enough to know what else was on offer without tripling the search time. */
const MULTIPV = 3;
/** Plies of principal variation kept for display. */
const PV_PLIES = 6;

export type ReviewSpeed = 'fast' | 'balanced' | 'deep';

export const REVIEW_SPEEDS: { key: ReviewSpeed; label: string; depth: number; note: string }[] = [
  { key: 'fast', label: 'Fast', depth: 12, note: 'a minute or so' },
  { key: 'balanced', label: 'Balanced', depth: 16, note: 'a few minutes' },
  { key: 'deep', label: 'Deep', depth: 20, note: 'slow, but it sees tactics' },
];

const depthFor = (speed: ReviewSpeed) =>
  REVIEW_SPEEDS.find((entry) => entry.key === speed)?.depth ?? 16;

interface PendingSearch {
  fen: string;
  lines: Map<number, { depth: number; score: Score; pv: string[] }>;
  depth: number;
  resolve: (position: EvaluatedPosition) => void;
  reject: (error: Error) => void;
}

interface EngineSession {
  evaluate: (fen: string, depth: number) => Promise<EvaluatedPosition>;
  dispose: () => void;
}

/** Replays a UCI line into SAN for display, stopping at anything unplayable. */
function pvToSan(fen: string, pv: string[]): { san: string; line: string[] } {
  const game = new Chess(fen);
  const line: string[] = [];
  for (const uci of pv.slice(0, PV_PLIES)) {
    const info = game.move(uci);
    if (!info) break;
    line.push(info.san);
  }
  return { san: line[0] ?? '', line };
}

function createSession(): EngineSession {
  const worker = new Worker(ENGINE_URL);
  let pending: PendingSearch | null = null;
  let disposed = false;
  let markReady: (() => void) | null = null;
  let failReady: ((error: Error) => void) | null = null;
  const ready = new Promise<void>((resolve, reject) => {
    markReady = resolve;
    failReady = reject;
  });

  const finish = () => {
    const search = pending;
    if (!search) return;
    pending = null;

    const white = search.fen.split(' ')[1] !== 'b';
    const candidates: CandidateMove[] = [...search.lines.entries()]
      .sort((a, b) => a[0] - b[0])
      .flatMap(([, line]) => {
        const { san, line: pvSan } = pvToSan(search.fen, line.pv);
        if (!san) return [];
        // UCI scores come from the mover's point of view; everything downstream
        // of here is White's.
        const score: Score = white
          ? line.score
          : { cp: line.score.cp === null ? null : -line.score.cp, mate: line.score.mate === null ? null : -line.score.mate };
        return [{ uci: line.pv[0]!, san, score, pv: pvSan }];
      });

    search.resolve({ fen: search.fen, depth: search.depth, candidates });
  };

  worker.onerror = () => {
    const error = new Error('The analysis engine failed to load.');
    failReady?.(error);
    pending?.reject(error);
    pending = null;
  };

  worker.onmessage = (event: MessageEvent<string>) => {
    const line = event.data;
    if (line === 'uciok') {
      worker.postMessage(`setoption name MultiPV value ${MULTIPV}`);
      worker.postMessage('isready');
      return;
    }
    if (line === 'readyok') {
      markReady?.();
      return;
    }
    if (!pending) return;
    if (line.startsWith('bestmove')) {
      finish();
      return;
    }
    const info = parseInfoLine(line);
    if (!info) return;
    pending.depth = Math.max(pending.depth, info.depth);
    pending.lines.set(info.multipv, {
      depth: info.depth,
      score:
        info.kind === 'cp'
          ? { cp: info.value, mate: null }
          : { cp: null, mate: info.value },
      pv: info.pv,
    });
  };

  worker.postMessage('uci');

  return {
    async evaluate(fen, depth) {
      await ready;
      if (disposed) throw new ReviewAbortedError();
      return new Promise<EvaluatedPosition>((resolve, reject) => {
        pending = { fen, lines: new Map(), depth: 0, resolve, reject };
        worker.postMessage('ucinewgame');
        worker.postMessage(`position fen ${fen}`);
        worker.postMessage(`go depth ${depth}`);
      });
    },
    dispose() {
      disposed = true;
      pending?.reject(new ReviewAbortedError());
      pending = null;
      worker.terminate();
    },
  };
}

export interface ReviewController {
  status: 'idle' | 'running' | 'done' | 'error';
  progress: { done: number; total: number };
  review: GameReview | null;
  error: string | null;
  speed: ReviewSpeed;
  setSpeed: (speed: ReviewSpeed) => void;
  start: (pgn: string) => void;
  cancel: () => void;
  clear: () => void;
}

export function useGameReview(): ReviewController {
  const [status, setStatus] = useState<ReviewController['status']>('idle');
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [review, setReview] = useState<GameReview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [speed, setSpeed] = useState<ReviewSpeed>('balanced');

  const sessionRef = useRef<EngineSession | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const teardown = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    sessionRef.current?.dispose();
    sessionRef.current = null;
  }, []);

  useEffect(() => teardown, [teardown]);

  const start = useCallback(
    (pgn: string) => {
      teardown();
      const controller = new AbortController();
      abortRef.current = controller;
      setStatus('running');
      setError(null);
      setReview(null);
      setProgress({ done: 0, total: 0 });

      const session = createSession();
      sessionRef.current = session;
      const depth = depthFor(speed);

      reviewPgn(pgn, {
        evaluator: (fen) => session.evaluate(fen, depth),
        signal: controller.signal,
        onProgress: (done, total) => {
          if (!controller.signal.aborted) setProgress({ done, total });
        },
      })
        .then((result) => {
          if (controller.signal.aborted) return;
          setReview(result);
          setStatus('done');
        })
        .catch((err: unknown) => {
          if (controller.signal.aborted || err instanceof ReviewAbortedError) {
            setStatus('idle');
            return;
          }
          setError(err instanceof Error ? err.message : 'That game could not be reviewed.');
          setStatus('error');
        })
        .finally(() => {
          if (sessionRef.current === session) {
            session.dispose();
            sessionRef.current = null;
          }
        });
    },
    [speed, teardown],
  );

  const cancel = useCallback(() => {
    teardown();
    setStatus('idle');
    setProgress({ done: 0, total: 0 });
  }, [teardown]);

  const clear = useCallback(() => {
    teardown();
    setStatus('idle');
    setReview(null);
    setError(null);
    setProgress({ done: 0, total: 0 });
  }, [teardown]);

  return { status, progress, review, error, speed, setSpeed, start, cancel, clear };
}
