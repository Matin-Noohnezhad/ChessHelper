import { useMemo } from 'react';
import { formatScore, winPercent } from '@coh/review';
import type { GameReview, MoveQuality } from '@coh/review';
import { qualityClass } from './QualityBadge.js';

const WIDTH = 600;
const HEIGHT = 120;
/** Only the categories worth interrupting the curve for. */
const MARKED: MoveQuality[] = ['sacrifice', 'great', 'miss', 'mistake', 'blunder'];

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
    const x = (index: number) => (values.length > 1 ? (index / (values.length - 1)) * WIDTH : 0);
    const y = (value: number) => HEIGHT - (value / 100) * HEIGHT;
    const path = values.map((value, i) => `${x(i)},${y(value)}`).join(' ');

    return {
      series: values,
      line: path,
      area: `M0,${HEIGHT} L${path.split(' ').join(' L')} L${WIDTH},${HEIGHT} Z`,
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

  // Size the legend to the phases, with a readable minimum width in CSS for
  // very short phases (for example, a game ending one move into an endgame).
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
  const selectedMove = review.moves[selectedPly - 1];

  return (
    <div className="review-graph">
      <div className="review-section-heading"><h3 title="White’s win expectancy. Click the graph or use the slider to explore a move.">Game momentum</h3><span className="review-graph__reading">{selectedMove ? `${selectedMove.moveNumber}${selectedMove.color === 'w' ? '.' : '…'} ${selectedMove.san}` : 'Start'}<strong>{formatScore(selectedMove?.scoreAfter ?? { cp: 0, mate: null })}</strong></span></div>
      {/* A fixed-height chart keeps the overview visible on short screens. */}
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        role="img"
        aria-label="White's win expectancy through the game"
        onClick={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          onSelect(plyAt((event.clientX - rect.left) / rect.width));
        }}
      >
        <rect x="0" y="0" width={WIDTH} height={HEIGHT} className="review-graph__bg" />
        <path d={area} className="review-graph__area" />
        <polyline points={line} className="review-graph__line" vectorEffect="non-scaling-stroke" />
        <line
          x1="0"
          x2={WIDTH}
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
              x1={(ply / review.moves.length) * WIDTH}
              x2={(ply / review.moves.length) * WIDTH}
              y1="0"
              y2={HEIGHT}
              className="review-graph__phase"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        <line
          x1={(selectedPly / Math.max(1, review.moves.length)) * WIDTH}
          x2={(selectedPly / Math.max(1, review.moves.length)) * WIDTH}
          y1="0"
          y2={HEIGHT}
          className="review-graph__cursor"
          vectorEffect="non-scaling-stroke"
        />
        {markers.map((marker) => (
          <line
            key={marker.ply}
            x1={marker.cx}
            x2={marker.cx + 0.001}
            y1={marker.cy}
            y2={marker.cy}
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
      <input className="review-graph__seek" type="range" min={0} max={review.moves.length} value={selectedPly} onChange={(event) => onSelect(Number(event.target.value))} aria-label="Move on evaluation graph" aria-valuetext={`Ply ${selectedPly} of ${review.moves.length}`} />
    </div>
  );
}
