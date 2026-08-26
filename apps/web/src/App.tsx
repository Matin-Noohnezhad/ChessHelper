import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatMoveText } from '@coh/chess-core';
import type { PieceSymbol } from '@coh/chess-core';
import { identifyOpening } from '@coh/opening-book';
import { Board } from './components/Board.js';
import type { SquareMark } from './components/Board.js';
import { EnginePanel } from './components/EnginePanel.js';
import { EvalBar } from './components/EvalBar.js';
import { ImbalancesPanel } from './components/ImbalancesPanel.js';
import { MoveList } from './components/MoveList.js';
import { OpeningPanel } from './components/OpeningPanel.js';
import { ReviewView } from './components/ReviewView.js';
import { SettingsPanel } from './components/SettingsPanel.js';
import { TrainerView } from './components/TrainerView.js';
import { useChessGame } from './hooks/useChessGame.js';
import { useEngine } from './hooks/useEngine.js';
import { useGameReview } from './hooks/useGameReview.js';
import { useSettings } from './hooks/useSettings.js';

type Mode = 'explore' | 'train' | 'review';

export default function App() {
  const game = useChessGame();
  const settings = useSettings();
  // Analysis belongs to the explore board only — the trainer is quizzing the
  // user, and Stockfish's opinion would defeat the point.
  const engine = useEngine(game.game.fen());
  // The review lives up here rather than inside the view so that a report
  // survives a trip back to the board — you can play the position out, look at
  // a line, and come back to the same report instead of re-running the engine.
  const review = useGameReview();
  const [mode, setMode] = useState<Mode>('explore');
  const [marks, setMarks] = useState<SquareMark[]>([]);
  const [copied, setCopied] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Identification follows the cursor, not the end of the line, so stepping
  // back through a game replays how the opening was classified move by move.
  const played = useMemo(() => game.sans.slice(0, game.cursor), [game.sans, game.cursor]);
  const match = useMemo(() => identifyOpening(played), [played]);

  // The whole line, not the cursor's prefix: reviewing "the game on the board"
  // should cover everything played, wherever the user happens to be looking.
  const currentGamePgn = useMemo(
    () => (game.sans.length ? formatMoveText(game.sans, false, '*') : null),
    [game.sans],
  );

  // The second way in: no clipboard, no paste box. Whatever is on the board is
  // a game, and one click reviews it.
  const reviewBoardGame = useCallback(() => {
    if (!currentGamePgn) return;
    setMode('review');
    review.start(currentGamePgn);
  }, [currentGamePgn, review]);

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
            <button
              type="button"
              className={mode === 'review' ? 'is-active' : ''}
              onClick={() => setMode('review')}
            >
              Review
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
              <button
                type="button"
                onClick={reviewBoardGame}
                disabled={!currentGamePgn}
                title="Run the game review on the moves currently on the board"
              >
                Review game
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            title="Settings"
            aria-label="Settings"
          >
            ⚙
          </button>
        </div>
      </header>

      {settingsOpen && (
        <SettingsPanel
          annotationThickness={settings.annotationThickness}
          onAnnotationThicknessChange={settings.setAnnotationThickness}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {mode === 'train' ? (
        <TrainerView onStudyLine={studyLine} annotationThickness={settings.annotationThickness} />
      ) : mode === 'review' ? (
        <ReviewView
          controller={review}
          currentGamePgn={currentGamePgn}
          onReviewBoardGame={reviewBoardGame}
          annotationThickness={settings.annotationThickness}
        />
      ) : (
      <main className="app__body">
        <div className="app__board">
          <div className="board-row">
            <EvalBar engine={engine} orientation={game.orientation} />
            <Board
              game={game.game}
              orientation={game.orientation}
              lastMove={game.lastMove}
              onMove={handleMove}
              marks={marks}
              annotationThickness={settings.annotationThickness}
            />
          </div>
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
          <EnginePanel engine={engine} />
          <ImbalancesPanel game={game.game} />
          <OpeningPanel
            match={match}
            fen={game.game.fen()}
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
