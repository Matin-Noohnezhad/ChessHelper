import { useCallback, useEffect, useMemo, useState } from 'react';
import type { PieceSymbol } from '@coh/chess-core';
import { identifyOpening } from '@coh/opening-book';
import { Board } from './components/Board.js';
import type { SquareMark } from './components/Board.js';
import { MoveList } from './components/MoveList.js';
import { OpeningPanel } from './components/OpeningPanel.js';
import { TrainerView } from './components/TrainerView.js';
import { useChessGame } from './hooks/useChessGame.js';

type Mode = 'explore' | 'train';

export default function App() {
  const game = useChessGame();
  const [mode, setMode] = useState<Mode>('explore');
  const [marks, setMarks] = useState<SquareMark[]>([]);
  const [copied, setCopied] = useState(false);

  // Identification follows the cursor, not the end of the line, so stepping
  // back through a game replays how the opening was classified move by move.
  const played = useMemo(() => game.sans.slice(0, game.cursor), [game.sans, game.cursor]);
  const match = useMemo(() => identifyOpening(played), [played]);

  const handleMove = useCallback(
    (from: string, to: string, promotion?: PieceSymbol) => {
      game.play({ from, to, promotion });
      setMarks([]);
    },
    [game],
  );

  const playSan = useCallback(
    (san: string) => {
      game.play(san);
      setMarks([]);
    },
    [game],
  );

  const studyLine = useCallback(
    (moves: string[]) => {
      game.loadLine(moves);
      setMode('explore');
    },
    [game],
  );

  useEffect(() => {
    // Board navigation shortcuts belong to the explore board only — in training
    // the arrows would let you step out of the position you are being asked about.
    if (mode !== 'explore') return;
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) return;
      if (event.key === 'ArrowLeft') game.stepBack();
      else if (event.key === 'ArrowRight') game.stepForward();
      else if (event.key === 'ArrowUp') game.toStart();
      else if (event.key === 'ArrowDown') game.toEnd();
      else if (event.key === 'f') game.flip();
      else return;
      event.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [game, mode]);

  const status = game.game.isCheckmate()
    ? `Checkmate — ${game.game.turn() === 'w' ? 'Black' : 'White'} wins`
    : game.game.isStalemate()
      ? 'Stalemate'
      : game.game.isDraw()
        ? 'Draw'
        : game.game.isCheck()
          ? 'Check'
          : `${game.game.turn() === 'w' ? 'White' : 'Black'} to move`;

  const copyFen = async () => {
    await navigator.clipboard?.writeText(game.game.fen());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="app">
      <header className="app__head">
        <h1>
          Chess Opening Helper
          <span>plans, structures and breaks — not just move orders</span>
        </h1>
        <div className="app__actions">
          <div className="segmented segmented--mode">
            <button
              type="button"
              className={mode === 'explore' ? 'is-active' : ''}
              onClick={() => setMode('explore')}
            >
              Explore
            </button>
            <button
              type="button"
              className={mode === 'train' ? 'is-active' : ''}
              onClick={() => setMode('train')}
            >
              Train
            </button>
          </div>
          {mode === 'explore' && (
            <>
              <button type="button" onClick={game.flip}>
                Flip
              </button>
              <button type="button" onClick={game.takeBack} disabled={game.cursor === 0}>
                Take back
              </button>
              <button type="button" onClick={game.reset} disabled={!game.sans.length}>
                New game
              </button>
            </>
          )}
        </div>
      </header>

      {mode === 'train' ? (
        <TrainerView onStudyLine={studyLine} />
      ) : (
      <main className="app__body">
        <div className="app__board">
          <Board
            game={game.game}
            orientation={game.orientation}
            lastMove={game.lastMove}
            onMove={handleMove}
            marks={marks}
          />
          <div className="board-bar">
            <span className={`status${game.game.isCheck() ? ' status--check' : ''}`}>{status}</span>
            <div className="nav">
              <button type="button" onClick={game.toStart} disabled={game.atStart} title="Start (↑)">
                ⏮
              </button>
              <button type="button" onClick={game.stepBack} disabled={game.atStart} title="Back (←)">
                ◀
              </button>
              <button type="button" onClick={game.stepForward} disabled={game.atEnd} title="Forward (→)">
                ▶
              </button>
              <button type="button" onClick={game.toEnd} disabled={game.atEnd} title="End (↓)">
                ⏭
              </button>
            </div>
            <button type="button" className="fen" onClick={copyFen} title={game.game.fen()}>
              {copied ? 'FEN copied' : 'Copy FEN'}
            </button>
          </div>
        </div>

        <aside className="app__side">
          <OpeningPanel
            match={match}
            plies={played.length}
            onPlayMove={playSan}
            onMarks={setMarks}
          />
          <section className="moves">
            <h3>Moves</h3>
            <MoveList sans={game.sans} cursor={game.cursor} onSelect={game.goTo} />
          </section>
        </aside>
      </main>
      )}
    </div>
  );
}
