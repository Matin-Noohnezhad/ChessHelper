import { useMemo } from 'react';
import type { Chess } from '@coh/chess-core';
import { analyzeImbalances } from '@coh/imbalances';
import type { ImbalanceSide } from '@coh/imbalances';

interface ImbalancesPanelProps {
  game: Chess;
}

function SideDot({ side }: { side: ImbalanceSide }) {
  return <span className={`imbalance-dot imbalance-dot--${side}`} aria-hidden="true" />;
}

/**
 * A static, Silman-style read of the position — material, minor pieces,
 * pawn structure, space, development, king safety, open files — as opposed
 * to the engine panel's "who's better and by how much". Cheap enough to
 * recompute on every position change with no opt-in needed, unlike Stockfish.
 */
export function ImbalancesPanel({ game }: ImbalancesPanelProps) {
  // fen, not game, is the memo key: game is a fresh Chess instance every move,
  // but the analysis only depends on the position it currently holds.
  const fen = game.fen();
  const report = useMemo(() => analyzeImbalances(game), [fen]);

  return (
    <section className="panel imbalances-panel">
      <div className="panel__head">
        <div className="panel__title">
          <h2>Imbalances</h2>
        </div>
        <span className="imbalance-score" title="0 = structurally symmetric, 1 = many or severe imbalances">
          {report.score.toFixed(2)}
        </span>
      </div>
      <div className="bar imbalances-bar">
        <div className="bar__fill" style={{ width: `${Math.round(report.score * 100)}%` }} />
      </div>

      {report.imbalances.length === 0 ? (
        <p className="muted imbalances-empty">The position is structurally symmetric — nothing notable yet.</p>
      ) : (
        <ul className="imbalances-list">
          {report.imbalances.map((imbalance, i) => (
            <li key={i}>
              <SideDot side={imbalance.side} />
              <span>{imbalance.description}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
