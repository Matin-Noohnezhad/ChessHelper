import { useMemo } from 'react';
import { winPercent } from '@coh/review';
import type { GameReview, MoveQuality } from '@coh/review';
import { qualityClass } from './QualityBadge.js';

const HEIGHT = 34;
/** Only the categories worth interrupting the curve for. */
const MARKED: MoveQuality[] = ['brilliant', 'great', 'miss', 'mistake', 'blunder'];

interface ReviewGraphProps {
  review: GameReview;
  selectedPly: number;
  onSelect: (ply: number) => void;
}

/**
 * The shape of the game: White's win expectancy after every move. Reading it
 * beats reading the move list — a cliff is a blunder, a staircase is a slow
 * squeeze, and a flat line means the result was decided somewhere else.
 */
export function ReviewGraph({ review, selectedPly, onSelect }: ReviewGraphProps) {
  const { series, area, line, markers } = useMemo(() => {
    const values = [50, ...review.moves.map((move) => winPercent(move.scoreAfter))];
    const x = (index: number) => (values.length > 1 ? (index / (values.length - 1)) * 100 : 0);
    const y = (value: number) => HEIGHT - (value / 100) * HEIGHT;
    const path = values.map((value, i) => `${x(i)},${y(value)}`).join(' ');

    return {
      series: values,
      line: path,
      area: `M0,${HEIGHT} L${path.split(' ').join(' L')} L100,${HEIGHT} Z`,
      markers: review.moves
        .filter((move) => MARKED.includes(move.quality))
        .map((move) => ({
          ply: move.ply,
          quality: move.quality,
          cx: x(move.ply),
          cy: y(values[move.ply] ?? 50),
        })),
    };
  }, [review]);

  // The legend sits under the span each phase really occupies, so the labels
  // line up with the separators instead of being three evenly spaced words.
  const spans = useMemo(() => {
    const total = review.moves.length || 1;
    const openingPlies = Math.min(review.bounds.middlegameStartPly - 1, total);
    const beforeEndgame =
      review.bounds.endgameStartPly === null
        ? total
        : Math.min(review.bounds.endgameStartPly - 1, total);
    return [
      { label: 'Opening', width: openingPlies / total },
      { label: 'Middlegame', width: Math.max(0, beforeEndgame - openingPlies) / total },
      { label: 'Endgame', width: Math.max(0, total - beforeEndgame) / total },
    ].filter((span) => span.width > 0);
  }, [review]);

  const plyAt = (fraction: number) =>
    Math.max(0, Math.min(review.moves.length, Math.round(fraction * (series.length - 1))));

  return (
    <div className="review-graph">
      {/* Scaled uniformly, so the blunder dots stay round however wide the panel is. */}
      <svg
        viewBox={`0 0 100 ${HEIGHT}`}
        role="img"
        aria-label="White's win expectancy through the game"
        onClick={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          onSelect(plyAt((event.clientX - rect.left) / rect.width));
        }}
      >
        <rect x="0" y="0" width="100" height={HEIGHT} className="review-graph__bg" />
        <path d={area} className="review-graph__area" />
        <polyline points={line} className="review-graph__line" vectorEffect="non-scaling-stroke" />
        <line
          x1="0"
          x2="100"
          y1={HEIGHT / 2}
          y2={HEIGHT / 2}
          className="review-graph__mid"
          vectorEffect="non-scaling-stroke"
        />
        {[review.bounds.middlegameStartPly, review.bounds.endgameStartPly]
          .filter((ply): ply is number => ply !== null && ply > 1 && ply <= review.moves.length)
          .map((ply) => (
            <line
              key={ply}
              x1={(ply / review.moves.length) * 100}
              x2={(ply / review.moves.length) * 100}
              y1="0"
              y2={HEIGHT}
              className="review-graph__phase"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        <line
          x1={(selectedPly / Math.max(1, review.moves.length)) * 100}
          x2={(selectedPly / Math.max(1, review.moves.length)) * 100}
          y1="0"
          y2={HEIGHT}
          className="review-graph__cursor"
          vectorEffect="non-scaling-stroke"
        />
        {markers.map((marker) => (
          <circle
            key={marker.ply}
            cx={marker.cx}
            cy={marker.cy}
            r="1.6"
            className={`review-graph__dot ${qualityClass(marker.quality)}`}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      <div className="review-graph__legend muted">
        {spans.map((span) => (
          <span key={span.label} style={{ width: `${span.width * 100}%` }}>
            {span.label}
          </span>
        ))}
      </div>
    </div>
  );
}
