import { Fragment, useEffect, useRef } from 'react';
import type { ChessGame } from '../hooks/useChessGame.js';

export function ExploreMoveTree({ game }: { game: ChessGame }) {
  const list = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = list.current;
    const selected = container?.querySelector('[aria-current="step"]');
    if (!container || !selected) return;
    const row = selected.getBoundingClientRect();
    const box = container.getBoundingClientRect();
    if (row.top < box.top || row.bottom > box.bottom) container.scrollTop += row.top - box.top - container.clientHeight / 2;
  }, [game.tree.selected]);
  const renderLine = (first: number, ply: number, siblings: number[] = []): React.ReactNode => {
    const node = game.tree.nodes[first]!;
    const [next, ...alternatives] = node.children;
    return <Fragment key={first}>
      <button type="button" className={`explore-move${game.tree.selected === first ? ' is-active' : ''}`}
        aria-current={game.tree.selected === first ? 'step' : undefined}
        onClick={() => game.selectNode(first)} title={`Go to ${Math.floor(ply / 2) + 1}${ply % 2 ? '...' : '.'} ${node.san}`}>
        <span className="muted">{Math.floor(ply / 2) + 1}{ply % 2 ? '…' : '.'}</span> {node.san}
        {(node.shapes.arrows.length > 0 || node.shapes.circles.length > 0) && <span aria-label="Has drawings"> ◇</span>}
      </button>
      {siblings.map((id) => <div className="explore-variation" key={id}>{renderLine(id, ply)}</div>)}
      {next !== undefined && renderLine(next, ply + 1, alternatives)}
    </Fragment>;
  };
  const [first, ...alternatives] = game.tree.nodes[0]!.children;
  return <section className="moves explore-moves">
    <div className="review-section-heading"><h3>Moves & variations</h3>
      <button type="button" onClick={game.toStart} disabled={game.atStart}>Start</button>
    </div>
    <div className="explore-tree" ref={list}>
      {first === undefined ? <p className="muted">Play moves on the board to build a line. Go back and play a different move to add a variation.</p> : renderLine(first, 0, alternatives)}
    </div>
    <div className="explore-line-actions">
      <button type="button" onClick={game.promoteLine} disabled={!game.canPromote} aria-keyshortcuts="p" title="Make the selected line the main line (P)">Promote line <kbd>P</kbd></button>
      <button type="button" onClick={game.deleteLine} disabled={game.atStart} aria-keyshortcuts="Delete" title="Delete the selected move and its continuation (Delete)">Delete line <kbd>Del</kbd></button>
      <button type="button" onClick={() => game.setShapes({ arrows: [], circles: [] })}
        disabled={!game.shapes.arrows.length && !game.shapes.circles.length}>Clear drawings</button>
    </div>
    <p className="muted explore-shortcuts">← → step · ↑ ↓ start / end · P promote · Delete removes the selected move and continuation.</p>
    <p className="muted explore-shortcuts">Right-click a square or drag an arrow: green · Ctrl red · Shift blue · Alt yellow. Drawings are saved with each position.</p>
  </section>;
}
