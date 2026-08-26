import { QUALITY_LABELS, QUALITY_ORDER, formatSeconds } from '@coh/review';
import type { GamePhase, GameReview, SideReport } from '@coh/review';
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
        {side.name ?? (side.color === 'w' ? 'White' : 'Black')}
        {side.elo !== null && <em> {side.elo}</em>}
      </span>
      <strong className="accuracy-card__value">{percent(side.accuracy)}</strong>
      <span className="muted">accuracy · {cp(side.averageCentipawnLoss)} cp lost per move</span>
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
export function ReviewSummary({ review }: { review: GameReview }) {
  return (
    <section className="panel review-summary">
      <div className="accuracy-cards">
        <AccuracyCard side={review.white} />
        <div className="accuracy-cards__mid">
          <strong>{review.result}</strong>
          {review.opening && (
            <span className="muted">
              {review.opening.eco} {review.opening.name}
            </span>
          )}
          <span className="muted">depth {review.depth}</span>
        </div>
        <AccuracyCard side={review.black} />
      </div>

      {review.truncated && <p className="review-error">{review.truncated}</p>}

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

      <table className="review-table review-table--counts">
        <tbody>
          {QUALITY_ORDER.map((quality) => (
            <tr
              key={quality}
              className={
                review.white.counts[quality] || review.black.counts[quality] ? '' : 'is-empty'
              }
            >
              <td>{review.white.counts[quality]}</td>
              <th scope="row">
                <QualityBadge quality={quality} />
                {QUALITY_LABELS[quality]}
              </th>
              <td>{review.black.counts[quality]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {(review.white.time || review.black.time) && (
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
      )}
    </section>
  );
}
