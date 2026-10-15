import { useEffect, useMemo, useRef } from 'react';
import { Chess } from '@coh/chess-core';
import type { PieceSymbol } from '@coh/chess-core';
import { formatEval } from '../hooks/useEngine.js';
import type { ComplexityLabel, EngineController } from '../hooks/useEngine.js';

const COMPLEXITY_TAG_CLASS: Record<ComplexityLabel, string> = {
  Quiet: 'tag--positional',
  Moderate: 'tag--book',
  Sharp: 'tag--sharp',
  Critical: 'tag--gambit',
};

interface EnginePanelProps {
  engine: EngineController;
  fen: string;
  onMove: (from: string, to: string, promotion?: PieceSymbol) => void;
}

export function EnginePanel({ engine, fen, onMove }: EnginePanelProps) {
  const { enabled, toggle, thinking, analysis, error } = engine;
  const best = analysis?.lines[0];
  const panelRef = useRef<HTMLElement>(null);
  const bestMove = useMemo(() => {
    if (!enabled || analysis?.fen !== fen) return null;
    const san = analysis.lines.find((line) => line.multipv === 1)?.pvSan[0];
    return san ? new Chess(fen).move(san) : null;
  }, [enabled, analysis, fen]);

  useEffect(() => {
    if (!enabled) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== ' ' || event.defaultPrevented || event.isComposing ||
        event.ctrlKey || event.metaKey || event.altKey || event.shiftKey ||
        document.querySelector('[role="dialog"], dialog[open]') ||
        (event.target instanceof HTMLElement && event.target.closest(
          'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"], summary, a[href]',
        ))) return;
      // Analysis owns Space, including when its Analyze/Stop button still has focus.
      // Consume presses while waiting for a result, but never queue a later move.
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!event.repeat && bestMove) onMove(bestMove.from, bestMove.to, bestMove.promotion);
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [enabled, bestMove, onMove]);

  useEffect(() => {
    if (!enabled || !panelRef.current) return;
    const panel = panelRef.current;
    const bounds = panel.getBoundingClientRect();
    // Leave room for the suggestions that arrive after the engine starts.
    // Only opening analysis moves the viewport; subsequent moves never do.
    if (bounds.top < 80 || bounds.top + Math.max(bounds.height, 320) > window.innerHeight) {
      panel.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  }, [enabled]);

  return (
    <section ref={panelRef} className="panel engine-panel">
      <div className="panel__head">
        <div className="panel__title">
          <h2>Engine</h2>
          {enabled && (
            <span className="muted">
              {thinking ? `depth ${analysis?.depth ?? 0}…` : analysis ? `depth ${analysis.depth}` : 'starting…'}
            </span>
          )}
        </div>
        <button type="button" onClick={toggle} className={enabled ? 'is-active' : ''}>
          {enabled ? 'Stop' : 'Analyze'}
        </button>
      </div>

      {!enabled && (
        <p className="muted">
          Turn on analysis for Stockfish's evaluation and a read on how sharp the position is.
        </p>
      )}
      {error && <p className="muted">{error}</p>}
      {enabled && <p className="muted"><kbd>Space</kbd>: play the best engine move.</p>}

      {enabled && analysis && (
        <>
          <div className="engine-eval">
            <span className="engine-eval__value">{best ? formatEval(best) : '—'}</span>
            <span className="muted">best: {best?.pvSan[0] ?? '—'}</span>
          </div>

          <ol className="engine-lines" aria-label="Top engine moves">
            {analysis.lines.map((line) => (
              <li key={line.multipv} className={line.multipv === 1 ? 'is-best' : ''}>
                <span className="engine-lines__eval">{formatEval(line)}</span>
                <span className="engine-lines__pv">{line.pvSan.length ? line.pvSan.join(' ') : '—'}</span>
              </li>
            ))}
          </ol>

          <div className="engine-complexity">
            <div className="engine-complexity__head">
              <span>Complexity</span>
              <span className={`tag ${COMPLEXITY_TAG_CLASS[analysis.complexity.label]}`}>
                {analysis.complexity.label}
              </span>
            </div>
            <div className="bar">
              <div className="bar__fill" style={{ width: `${analysis.complexity.score}%` }} />
            </div>
            <p className="muted engine-complexity__note">
              {analysis.complexity.candidateCount > 1 && analysis.complexity.gapCp !== null
                ? `Top ${analysis.complexity.candidateCount} choices ${(analysis.complexity.gapCp / 100).toFixed(2)} pawns apart, ${analysis.complexity.closeCount} of them close · ${analysis.complexity.mobility} legal moves`
                : `${analysis.complexity.mobility} legal moves`}
            </p>
          </div>
        </>
      )}
    </section>
  );
}
