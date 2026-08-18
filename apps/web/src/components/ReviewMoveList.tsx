import { formatSeconds } from '@coh/review';
import type { ReviewedMove } from '@coh/review';
import { QualityBadge, qualityClass } from './QualityBadge.js';

interface ReviewMoveListProps {
  moves: ReviewedMove[];
  selectedPly: number;
  onSelect: (ply: number) => void;
  showClocks: boolean;
}

function MoveButton({
  move,
  selected,
  onSelect,
  showClocks,
}: {
  move: ReviewedMove | undefined;
  selected: boolean;
  onSelect: (ply: number) => void;
  showClocks: boolean;
}) {
  if (!move) return <span className="review-move review-move--empty" />;
  return (
    <button
      type="button"
      className={`review-move ${qualityClass(move.quality)}${selected ? ' is-current' : ''}`}
      onClick={() => onSelect(move.ply)}
      title={move.explanation}
    >
      <QualityBadge quality={move.quality} />
      <span className="review-move__san">{move.san}</span>
      {showClocks && move.secondsSpent !== null && (
        <span className="review-move__clock muted">{formatSeconds(move.secondsSpent)}</span>
      )}
    </button>
  );
}

/** The game as a scannable list: colour tells you where it went wrong at a glance. */
export function ReviewMoveList({ moves, selectedPly, onSelect, showClocks }: ReviewMoveListProps) {
  const rows: { number: number; white?: ReviewedMove; black?: ReviewedMove }[] = [];
  for (const move of moves) {
    const last = rows[rows.length - 1];
    if (move.color === 'w' || !last || last.black || last.number !== move.moveNumber) {
      rows.push({ number: move.moveNumber, [move.color === 'w' ? 'white' : 'black']: move });
    } else if (move.color === 'b') {
      last.black = move;
    }
  }

  return (
    <ol className="review-moves">
      {rows.map((row) => (
        <li key={`${row.number}-${row.white?.ply ?? row.black?.ply}`}>
          <span className="review-moves__number">{row.number}.</span>
          <MoveButton
            move={row.white}
            selected={row.white?.ply === selectedPly}
            onSelect={onSelect}
            showClocks={showClocks}
          />
          <MoveButton
            move={row.black}
            selected={row.black?.ply === selectedPly}
            onSelect={onSelect}
            showClocks={showClocks}
          />
        </li>
      ))}
    </ol>
  );
}
