import { QUALITY_LABELS, QUALITY_ORDER, formatSeconds } from '@coh/review';
import type { GamePhase, GameReview, SideReport } from '@coh/review';
import { useId } from 'react';
import type { ReactNode } from 'react';
import { QualityBadge } from './QualityBadge.js';

const PHASES: { key: GamePhase; label: string }[] = [
  { key: 'opening', label: 'Opening' },
  { key: 'middlegame', label: 'Middlegame' },
  { key: 'endgame', label: 'Endgame' },
];

const percent = (value: number | null) => (value === null ? '—' : `${value.toFixed(1)}%`);
const cp = (value: number | null) => (value === null ? '—' : Math.round(value).toString());

function AccuracyCard({ side }: { side: SideReport }) {
  return (
    <div className={`accuracy-card accuracy-card--${side.color === 'w' ? 'white' : 'black'}`}>
      <span className="accuracy-card__name">
        <span className={`review-player-dot review-player-dot--${side.color}`} aria-hidden="true" />
        <span title={side.name ?? undefined}>{side.name ?? (side.color === 'w' ? 'White' : 'Black')}</span>
        {side.elo !== null && <em> {side.elo}</em>}
      </span>
      <div className="accuracy-card__score"><strong className="accuracy-card__value">{percent(side.accuracy)}</strong><span>Accuracy</span></div>
      <span className="accuracy-card__track" aria-hidden="true"><span style={{ width: `${side.accuracy ?? 0}%` }} /></span>
    </div>
  );
}

/**
 * The report card: how well each side played overall, how that splits across
 * the three phases, and what the moves were made of. The phase split is the
 * part players act on — "82% overall" says less than "you are fine until the
 * pieces come off".
 *
 * Every category is listed, including the ones nobody scored: a zero next to
 * Blunder is a fact about the game, and a table whose rows move around between
 * games cannot be read at a glance. Empty rows are dimmed, not dropped.
 */
export type ReviewSection = 'overview' | 'moves' | 'details';

export function ReviewSummary({ review, children, section, onSectionChange, analysis, moments }: {
  review: GameReview;
  children: ReactNode;
  section: ReviewSection;
  onSectionChange: (section: ReviewSection) => void;
  analysis: ReactNode;
  moments: ReactNode;
}) {
  const panelId = useId();
  const theoryMoves = review.moves.filter((move) => move.quality === 'book');
  const lastTheory = theoryMoves[theoryMoves.length - 1];
  return (
    <section className="panel review-summary">
      <div className="review-section-heading"><h2>Game overview</h2><span className="review-chip">Depth {review.depth}</span></div>
      <div className="accuracy-cards">
        <AccuracyCard side={review.white} />
        <div className="accuracy-cards__mid">
          <strong>{review.result}</strong>
        </div>
        <AccuracyCard side={review.black} />
      </div>

      {review.truncated && <p className="review-error">{review.truncated}</p>}

      {children}

      <div className="review-sections" role="group" aria-label="Review sections">
        {(['overview', 'moves', 'details'] as const).map((item) => (
          <button key={item} type="button" aria-pressed={section === item} aria-controls={panelId} onClick={() => onSectionChange(item)}>
            {{ overview: 'Overview', moves: 'Moves', details: 'Details' }[item]}
          </button>
        ))}
      </div>
      <div key={section} id={panelId} className="review-summary__content" role="region" aria-label={section === 'overview' ? 'Move classification' : section === 'moves' ? 'Move analysis' : 'Game details'} tabIndex={0}>
        {section === 'overview' && <>
          <table className="review-table review-table--counts" aria-label="Move classification. Each move counts once; book moves count only as Theory.">
            <thead><tr><th scope="col">White</th><th scope="col">Category</th><th scope="col">Black</th></tr></thead>
            <tbody>
              {QUALITY_ORDER.map((quality) => (
                <tr
                  key={quality}
                  className={`q--${quality} ${review.white.counts[quality] || review.black.counts[quality] ? '' : 'is-empty'}`}
                >
                  <td><span className="review-count">{review.white.counts[quality]}</span><span aria-hidden="true" className="review-count-bar" style={{ width: `${100 * review.white.counts[quality] / Math.max(1, review.white.moves)}%` }} /></td>
                  <th scope="row"><QualityBadge quality={quality} />{QUALITY_LABELS[quality]}</th>
                  <td><span className="review-count">{review.black.counts[quality]}</span><span aria-hidden="true" className="review-count-bar" style={{ width: `${100 * review.black.counts[quality] / Math.max(1, review.black.moves)}%` }} /></td>
                </tr>
              ))}
            </tbody>
          </table>

        </>}
        {section === 'moves' && analysis}
        {section === 'details' && <>
          <p className="review-count-note">Each move counts once. Book moves count only as Theory.</p>
          <div className="review-theory">
            <QualityBadge quality="book" />
            <div>
              <strong>{review.opening?.name ?? 'Opening theory'}</strong>
              <span>{review.opening ? `${review.opening.eco} · ` : ''}{theoryMoves.length} book moves across both sides
                {lastTheory ? ` · last book move ${lastTheory.moveNumber}${lastTheory.color === 'w' ? '.' : '…'} ${lastTheory.san}` : ''}</span>
            </div>
          </div>

          <table className="review-table">
            <caption>Average centipawn loss</caption>
            <thead><tr><th scope="col">White</th><th scope="col">Black</th></tr></thead>
            <tbody><tr><td>{cp(review.white.averageCentipawnLoss)} cp / move</td><td>{cp(review.black.averageCentipawnLoss)} cp / move</td></tr></tbody>
          </table>

          <details className="review-breakdown" open>
          <summary>Accuracy by phase</summary>
          <table className="review-table">
            <thead>
              <tr>
                <th>White</th>
                <th>Phase</th>
                <th>Black</th>
              </tr>
            </thead>
            <tbody>
              {PHASES.map(({ key, label }) => (
                <tr key={key}>
                  <td>
                    {percent(review.white.phases[key].accuracy)}
                    <span className="muted"> · {review.white.phases[key].moves}</span>
                  </td>
                  <th scope="row">{label}</th>
                  <td>
                    {percent(review.black.phases[key].accuracy)}
                    <span className="muted"> · {review.black.phases[key].moves}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </details>

          {(review.white.time || review.black.time) && (
            <details className="review-breakdown"><summary>Time management</summary>
            <table className="review-table">
              <thead>
                <tr>
                  <th>White</th>
                  <th>Clock</th>
                  <th>Black</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {review.white.time ? formatSeconds(review.white.time.averageSeconds ?? 0) : '—'}
                  </td>
                  <th scope="row">Average per move</th>
                  <td>
                    {review.black.time ? formatSeconds(review.black.time.averageSeconds ?? 0) : '—'}
                  </td>
                </tr>
                <tr>
                  <td>{review.white.time?.slowest ? formatSeconds(review.white.time.slowest.seconds) : '—'}</td>
                  <th scope="row">Longest think</th>
                  <td>{review.black.time?.slowest ? formatSeconds(review.black.time.slowest.seconds) : '—'}</td>
                </tr>
                <tr>
                  <td>{review.white.time?.movesInTimePressure ?? '—'}</td>
                  <th scope="row">Moves in time pressure</th>
                  <td>{review.black.time?.movesInTimePressure ?? '—'}</td>
                </tr>
                <tr>
                  <td>{percent(review.white.time?.accuracyInTimePressure ?? null)}</td>
                  <th scope="row">Accuracy there</th>
                  <td>{percent(review.black.time?.accuracyInTimePressure ?? null)}</td>
                </tr>
              </tbody>
            </table>
            </details>
          )}
          {moments}
        </>}
      </div>
    </section>
  );
}
