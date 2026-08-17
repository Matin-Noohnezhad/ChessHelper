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
}

export function EnginePanel({ engine }: EnginePanelProps) {
  const { enabled, toggle, thinking, analysis, error } = engine;
  const best = analysis?.lines[0];

  return (
    <section className="panel engine-panel">
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

      {enabled && analysis && (
        <>
          <div className="engine-eval">
            <span className="engine-eval__value">{best ? formatEval(best) : '—'}</span>
            <span className="muted">best: {best?.pvSan[0] ?? '—'}</span>
          </div>

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

          <ol className="engine-lines">
            {analysis.lines.map((line) => (
              <li key={line.multipv} className={line.multipv === 1 ? 'is-best' : ''}>
                <span className="engine-lines__eval">{formatEval(line)}</span>
                <span className="engine-lines__pv">{line.pvSan.length ? line.pvSan.join(' ') : '—'}</span>
              </li>
            ))}
          </ol>
        </>
      )}
    </section>
  );
}
