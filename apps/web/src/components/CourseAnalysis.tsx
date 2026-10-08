import { MoveStepButton } from './MoveStepButton.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { SetStateAction } from 'react';
import { Chess } from '@coh/chess-core';
import type { PieceSymbol } from '@coh/chess-core';
import { Board } from './Board.js';
import type { AnnotationThickness } from './Board.js';
import { EnginePanel } from './EnginePanel.js';
import { EvalBar } from './EvalBar.js';
import { useEngine } from '../hooks/useEngine.js';
import type { Orientation } from '../hooks/useChessGame.js';
import { courseShortcutBlocked } from '../courseShortcuts.js';

interface CourseAnalysisProps {
  initialFen: string;
  initialLastMove: { from: string; to: string } | null;
  orientation: Orientation;
  annotationThickness?: AnnotationThickness;
  moveEntryMode?: 'smart' | 'select';
  returnLabel?: string;
  onReturn: () => void;
}

interface Position {
  fen: string;
  lastMove: CourseAnalysisProps['initialLastMove'];
  label: string;
}

/** A disposable analysis line: none of its moves reach the course trainer. */
export function CourseAnalysis({
  initialFen, initialLastMove, orientation, annotationThickness, onReturn,
  moveEntryMode = 'smart', returnLabel = 'Back to lesson',
}: CourseAnalysisProps) {
  const [positions, setPositions] = useState<Position[]>([
    { fen: initialFen, lastMove: initialLastMove, label: 'Lesson position' },
  ]);
  const [cursor, setCursor] = useState(0);
  // Only `play` adds a move; every other cursor change steps through ones already played.
  const [replaying, setReplaying] = useState(false);
  const browse = useCallback((to: SetStateAction<number>) => {
    setCursor(to);
    setReplaying(true);
  }, []);
  const position = positions[cursor]!;
  const game = useMemo(() => new Chess(position.fen), [position.fen]);
  const controller = useEngine(position.fen, true);
  // A stopped search can still publish its last result while the next starts.
  const engine = {
    ...controller,
    analysis: controller.analysis?.fen === position.fen ? controller.analysis : null,
  };
  const atStart = cursor === 0;
  const atEnd = cursor === positions.length - 1;

  const play = (from: string, to: string, promotion?: PieceSymbol) => {
    const next = new Chess(position.fen);
    const move = next.move({ from, to, promotion });
    if (!move) return;
    const number = position.fen.split(' ')[5];
    const label = `${number}${game.turn() === 'w' ? '.' : '...'} ${move.san}`;
    setPositions([...positions.slice(0, cursor + 1), {
      fen: next.fen(), lastMove: { from: move.from, to: move.to }, label,
    }]);
    setCursor(cursor + 1);
    setReplaying(false);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (courseShortcutBlocked(event)) return;
      if (event.key === 'Escape' || event.key.toLowerCase() === 'a') onReturn();
      else if (event.key === 'ArrowLeft') browse((i) => Math.max(0, i - 1));
      else if (event.key === 'ArrowRight') browse((i) => Math.min(positions.length - 1, i + 1));
      else if (event.key === 'Home' || event.key === 'ArrowUp') browse(0);
      else if (event.key === 'End' || event.key === 'ArrowDown') browse(positions.length - 1);
      else return;
      event.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [positions.length, onReturn, browse]);

  const status = game.isCheckmate() ? 'Checkmate'
    : game.isStalemate() ? 'Stalemate'
      : `${game.turn() === 'w' ? 'White' : 'Black'} to move${game.isCheck() ? ' — check' : ''}`;

  return (
    <div className="trainer course-session course-analysis">
      <div className="trainer__board">
        <div className="board-row">
          <EvalBar engine={engine} orientation={orientation} />
          <Board game={game} orientation={orientation} lastMove={position.lastMove} replay={replaying}
            moveEntryMode={moveEntryMode}
            onMove={play} annotationThickness={annotationThickness} animateMoves />
        </div>
        <div className="board-bar">
          <span className="status">Analysis · {status}</span>
          <div className="nav">
            <MoveStepButton type="button" onStep={() => browse(cursor - 1)} disabled={atStart}
              title="Back (←)" aria-label="Previous analysis move">◀</MoveStepButton>
            <MoveStepButton type="button" onStep={() => browse(cursor + 1)} disabled={atEnd}
              title="Forward (→)" aria-label="Next analysis move">▶</MoveStepButton>
            <button type="button" onClick={() => browse(0)} disabled={atStart} title="Reset position (Home)" aria-keyshortcuts="Home">
              Reset position <kbd>Home</kbd>
            </button>
          </div>
        </div>
      </div>
      <aside className="trainer__side">
        <section className="panel">
          <div className="course-head">
            <h2>Analyze position</h2>
            <span className="tag tag--book">Lesson paused</span>
          </div>
          <p className="muted">Try moves for either side and compare the engine’s suggestions.
            Your lesson position and progress are kept while you explore.</p>
          <button type="button" className="primary" onClick={onReturn} title={`${returnLabel} (A or Esc)`} aria-keyshortcuts="a Escape">
            {returnLabel} <kbd>A</kbd>
          </button>
          <p className="muted">← →: browse your moves · Home: lesson position · End: latest move · A / Esc: {returnLabel.toLowerCase()}.</p>
          {positions.length > 1 && (
            <div className="course-analysis__moves" aria-label="Analysis moves">
              {positions.map((item, index) => (
                <button type="button" key={index} onClick={() => browse(index)}
                  className={cursor === index ? 'is-active' : undefined}
                  aria-current={cursor === index ? 'step' : undefined}>
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </section>
        <EnginePanel engine={engine} />
      </aside>
    </div>
  );
}
