import { useCallback, useEffect, useRef, useState } from 'react';
import { Chess } from '@coh/chess-core';

/**
 * Stockfish 18, "lite single-threaded" WASM build — vendored under
 * public/engine/ rather than npm-installed (see the README there). Runs
 * entirely in a Worker over the UCI text protocol.
 */
const ENGINE_URL = '/engine/stockfish-18-lite-single.js';
const MULTIPV = 4;
const SEARCH_DEPTH = 16;
/** Two moves count as "close" once they're within a third of a pawn. */
const CLOSE_THRESHOLD_CP = 30;

export type ComplexityLabel = 'Quiet' | 'Moderate' | 'Sharp' | 'Critical';

export interface EngineLine {
  multipv: number;
  /** Centipawns from White's perspective — null when `mateWhite` applies instead. */
  cpWhite: number | null;
  /** Mate in N from White's perspective (negative = White gets mated). */
  mateWhite: number | null;
  pvSan: string[];
}

/**
 * A heuristic reading of "how many reasonable tries does the side to move
 * have", not a measure of tactical difficulty. It combines three signals
 * the engine already gives us for free:
 *  - how far the 2nd-best move trails the best one (a wide gap means the
 *    position is closer to forced),
 *  - how many of the top candidates are within a third of a pawn of each
 *    other (more close options means more genuine choice),
 *  - plain mobility (legal move count), as a cheap proxy for how open the
 *    position is.
 */
export interface PositionComplexity {
  score: number; // 0-100
  label: ComplexityLabel;
  gapCp: number | null;
  closeCount: number;
  candidateCount: number;
  mobility: number;
}

export interface EngineAnalysis {
  fen: string;
  depth: number;
  lines: EngineLine[]; // sorted by multipv ascending
  complexity: PositionComplexity;
}

export interface EngineController {
  enabled: boolean;
  toggle: () => void;
  thinking: boolean;
  analysis: EngineAnalysis | null;
  error: string | null;
}

interface RawLine {
  multipv: number;
  cpMover: number | null;
  mateMover: number | null;
  cpWhite: number | null;
  mateWhite: number | null;
  pvUci: string[];
}

/** A single comparable number, from the mover's own perspective, larger is better. */
function comparableForMover(line: RawLine): number {
  if (line.mateMover !== null) {
    return line.mateMover > 0 ? 100_000 - line.mateMover : -100_000 - line.mateMover;
  }
  return line.cpMover ?? 0;
}

function computeComplexity(lines: RawLine[], mobility: number): PositionComplexity {
  const ordered = [...lines].sort((a, b) => a.multipv - b.multipv);
  const values = ordered.map(comparableForMover);
  const best = values[0] ?? 0;
  const gapCp = values.length > 1 ? Math.max(0, Math.round(best - values[1]!)) : null;
  const closeCount = values.filter((v) => best - v <= CLOSE_THRESHOLD_CP).length;

  const gapFactor = gapCp === null ? 0.5 : Math.max(0, 1 - gapCp / 150);
  const closeFactor = values.length > 1 ? (closeCount - 1) / (values.length - 1) : 0;
  const mobilityFactor = Math.min(1, Math.max(0, (mobility - 15) / 35));

  const score = Math.round(100 * (0.5 * gapFactor + 0.3 * closeFactor + 0.2 * mobilityFactor));
  const label: ComplexityLabel =
    score >= 75 ? 'Critical' : score >= 50 ? 'Sharp' : score >= 25 ? 'Moderate' : 'Quiet';

  return { score, label, gapCp, closeCount, candidateCount: values.length, mobility };
}

interface ParsedInfo {
  depth: number;
  multipv: number;
  kind: 'cp' | 'mate';
  value: number;
  pv: string[];
}

/** UCI `pv` is always the last field, so anything after it is the line — order of the rest is not guaranteed. */
function parseInfoLine(line: string): ParsedInfo | null {
  if (!line.startsWith('info ') || line.includes('lowerbound') || line.includes('upperbound')) {
    return null;
  }
  const tokens = line.split(' ');
  let depth: number | null = null;
  let multipv = 1;
  let kind: 'cp' | 'mate' | null = null;
  let value: number | null = null;
  let pv: string[] = [];
  for (let i = 1; i < tokens.length; i++) {
    const tok = tokens[i];
    if (tok === 'depth') depth = Number(tokens[++i]);
    else if (tok === 'multipv') multipv = Number(tokens[++i]);
    else if (tok === 'score') {
      kind = tokens[++i] as 'cp' | 'mate';
      value = Number(tokens[++i]);
    } else if (tok === 'pv') {
      pv = tokens.slice(i + 1);
      break;
    }
  }
  if (depth === null || kind === null || value === null || !pv.length) return null;
  return { depth, multipv, kind, value, pv };
}

/** Replays a UCI move sequence from `fen` to get displayable SAN, stopping early on anything illegal. */
function pvToSan(fen: string, pvUci: string[], maxPly = 8): string[] {
  const game = new Chess(fen);
  const sans: string[] = [];
  for (const uci of pvUci.slice(0, maxPly)) {
    const info = game.move(uci);
    if (!info) break;
    sans.push(info.san);
  }
  return sans;
}

/**
 * Drives Stockfish in a Worker. Off by default and torn down on disable —
 * this is an opt-in study aid, not something that should burn CPU and hold
 * a multi-megabyte WASM binary in memory while someone is just browsing
 * openings.
 */
export function useEngine(fen: string): EngineController {
  const [enabled, setEnabled] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [analysis, setAnalysis] = useState<EngineAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const workerRef = useRef<Worker | null>(null);
  const readyRef = useRef(false);
  const searchingRef = useRef(false);
  const pendingFenRef = useRef<string | null>(null);
  const searchFenRef = useRef(fen);
  const sideRef = useRef<'w' | 'b'>('w');
  const linesRef = useRef<Map<number, RawLine>>(new Map());
  const depthRef = useRef(0);
  const latestFenRef = useRef(fen);
  latestFenRef.current = fen;

  const publish = useCallback((positionFen: string) => {
    const lines = [...linesRef.current.values()];
    if (!lines.length) return;
    const mobility = new Chess(positionFen).legalMoves().length;
    setAnalysis({
      fen: positionFen,
      depth: depthRef.current,
      lines: [...lines]
        .sort((a, b) => a.multipv - b.multipv)
        .map((l) => ({
          multipv: l.multipv,
          cpWhite: l.cpWhite,
          mateWhite: l.mateWhite,
          pvSan: pvToSan(positionFen, l.pvUci),
        })),
      complexity: computeComplexity(lines, mobility),
    });
  }, []);

  const analyze = useCallback((positionFen: string) => {
    const worker = workerRef.current;
    if (!worker) return;
    linesRef.current = new Map();
    depthRef.current = 0;
    searchFenRef.current = positionFen;
    sideRef.current = positionFen.split(' ')[1] === 'b' ? 'b' : 'w';
    searchingRef.current = true;
    setThinking(true);
    worker.postMessage(`position fen ${positionFen}`);
    worker.postMessage(`go depth ${SEARCH_DEPTH}`);
  }, []);

  const requestAnalysis = useCallback(
    (positionFen: string) => {
      if (!readyRef.current || !workerRef.current) return;
      if (searchingRef.current) {
        pendingFenRef.current = positionFen;
        workerRef.current.postMessage('stop');
        return;
      }
      analyze(positionFen);
    },
    [analyze],
  );

  useEffect(() => {
    if (!enabled) {
      workerRef.current?.terminate();
      workerRef.current = null;
      readyRef.current = false;
      searchingRef.current = false;
      pendingFenRef.current = null;
      setThinking(false);
      setAnalysis(null);
      setError(null);
      return;
    }

    let cancelled = false;
    const worker = new Worker(ENGINE_URL);
    workerRef.current = worker;

    worker.onerror = () => {
      if (cancelled) return;
      setError('The analysis engine failed to load.');
      setThinking(false);
    };

    worker.onmessage = (event: MessageEvent<string>) => {
      if (cancelled) return;
      const line = event.data;

      if (line === 'uciok') {
        worker.postMessage(`setoption name MultiPV value ${MULTIPV}`);
        worker.postMessage('isready');
        return;
      }
      if (line === 'readyok') {
        readyRef.current = true;
        requestAnalysis(latestFenRef.current);
        return;
      }
      if (line.startsWith('bestmove')) {
        searchingRef.current = false;
        setThinking(false);
        publish(searchFenRef.current);
        const next = pendingFenRef.current;
        pendingFenRef.current = null;
        if (next) analyze(next);
        return;
      }

      const info = parseInfoLine(line);
      if (!info) return;
      depthRef.current = info.depth;
      const flip = sideRef.current === 'b';
      const cpMover = info.kind === 'cp' ? info.value : null;
      const mateMover = info.kind === 'mate' ? info.value : null;
      linesRef.current.set(info.multipv, {
        multipv: info.multipv,
        cpMover,
        mateMover,
        cpWhite: cpMover === null ? null : flip ? -cpMover : cpMover,
        mateWhite: mateMover === null ? null : flip ? -mateMover : mateMover,
        pvUci: info.pv,
      });
      if (info.multipv === 1) publish(searchFenRef.current);
    };

    worker.postMessage('uci');

    return () => {
      cancelled = true;
      worker.terminate();
      if (workerRef.current === worker) workerRef.current = null;
    };
  }, [enabled, analyze, publish, requestAnalysis]);

  useEffect(() => {
    if (enabled) requestAnalysis(fen);
  }, [fen, enabled, requestAnalysis]);

  const toggle = useCallback(() => setEnabled((v) => !v), []);

  return { enabled, toggle, thinking, analysis, error };
}
