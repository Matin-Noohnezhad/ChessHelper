import { Fragment, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { formatSeconds, QUALITY_LABELS } from '@coh/review';
import type { ReviewedMove } from '@coh/review';
import { QualityBadge, qualityClass } from './QualityBadge.js';
import type { ExploreTree } from '../exploreTree.js';

interface ReviewMoveListProps {
  moves: ReviewedMove[];
  selectedPly: number;
  onSelect: (ply: number) => void;
  showClocks: boolean;
  tree?: ExploreTree;
  onSelectNode?: (id: number) => void;
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
      aria-current={selected ? 'step' : undefined}
      aria-label={`${move.moveNumber}${move.color === 'w' ? '.' : '…'} ${move.san}, ${QUALITY_LABELS[move.quality]}`}
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
export function ReviewMoveList({ moves, selectedPly, onSelect, showClocks, tree, onSelectNode }: ReviewMoveListProps) {
  const listRef = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const list = listRef.current;
    const selected = list?.querySelector<HTMLElement>('[aria-current="step"]');
    if (!list || !selected) return;
    const row = selected.getBoundingClientRect();
    const box = list.getBoundingClientRect();
    if (row.top < box.top || row.bottom > box.bottom) list.scrollTop += row.top - box.top - list.clientHeight / 2;
  }, [selectedPly, tree?.selected]);
  const start = moves[0];
  const firstPly = start ? (start.moveNumber - 1) * 2 + (start.color === 'b' ? 1 : 0) : 0;
  const renderLine = (id: number, ply: number, siblings: number[] = []): ReactNode => {
    if (!tree) return null;
    const node = tree.nodes[id]!;
    const [next, ...alternatives] = node.children;
    return <Fragment key={id}>
      <button type="button" className={`explore-move${tree.selected === id ? ' is-active' : ''}`}
        aria-current={tree.selected === id ? 'step' : undefined}
        onClick={() => onSelectNode?.(id)}>
        <span className="muted">{Math.floor(ply / 2) + 1}{ply % 2 ? '…' : '.'}</span> {node.san}
      </button>
      {siblings.map((sibling) => <div className="explore-variation" key={sibling}>{renderLine(sibling, ply)}</div>)}
      {next !== undefined && renderLine(next, ply + 1, alternatives)}
    </Fragment>;
  };
  const branches = (parent: number) => tree?.nodes[parent]?.children
    .filter((id) => id > moves.length)
    .map((id) => <div className="review-variation explore-variation" key={id} aria-label="Analysis variation">
      {renderLine(id, firstPly + parent)}
    </div>);
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
    <ol className="review-moves" ref={listRef}>
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
          {row.white && branches(row.white.ply - 1)}
          {row.black && branches(row.black.ply - 1)}
          {(row.black?.ply ?? row.white?.ply) === moves.length && branches(moves.length)}
        </li>
      ))}
      {!moves.length && tree?.nodes[0]?.children.length ? <li>{branches(0)}</li> : null}
    </ol>
  );
}
