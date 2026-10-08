import { MoveStepButton } from './components/MoveStepButton.js';
import { PieceSetContext } from './components/Piece.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { PieceSymbol } from '@coh/chess-core';
import { identifyOpening } from '@coh/opening-book';
import { Board, BoardCoordinatesContext } from './components/Board.js';
import { courseShortcutBlocked } from './courseShortcuts.js';
import { BoardSoundProvider } from './components/BoardSoundContext.js';
import { BoardAnimationContext } from './components/BoardAnimationContext.js';
import { AnnotationStyleContext, LastMoveArrowContext } from './components/BoardAnnotations.js';
import type { SquareMark } from './components/Board.js';
import { CoursesView } from './components/CoursesView.js';
import { EnginePanel } from './components/EnginePanel.js';
import { EvalBar } from './components/EvalBar.js';
import { ImbalancesPanel } from './components/ImbalancesPanel.js';
import { ExploreMoveTree } from './components/ExploreMoveTree.js';
import { OpeningPanel } from './components/OpeningPanel.js';
import { ReviewView } from './components/ReviewView.js';
import { SettingsPanel } from './components/SettingsPanel.js';
import { TrainerView } from './components/TrainerView.js';
import { useChessGame } from './hooks/useChessGame.js';
import { useEngine } from './hooks/useEngine.js';
import { useGameReview } from './hooks/useGameReview.js';
import { useSettings } from './hooks/useSettings.js';
import { boardThemeStyle } from './boardThemes.js';

type Mode = 'explore' | 'train' | 'courses' | 'review';

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
  const [copied, setCopied] = useState<'FEN' | 'PGN' | null>(null);
  const [copyError, setCopyError] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (courseShortcutBlocked(event)) return;
      if (event.key.toLowerCase() === 'z') setFocusMode((value) => !value);
      else if (event.key === 'Escape' && focusMode) setFocusMode(false);
      else return;
      // Handle Escape before course listeners so leaving focus keeps the lesson open.
      event.preventDefault();
      event.stopImmediatePropagation();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [focusMode]);

  // Identification follows the cursor, not the end of the line, so stepping
  // back through a game replays how the opening was classified move by move.
  const played = useMemo(() => game.sans.slice(0, game.cursor), [game.sans, game.cursor]);
  const match = useMemo(() => identifyOpening(played), [played]);

  // Review follows the main line; promoting a variation chooses it for review.
  const currentGamePgn = game.sans.length ? game.pgn : null;

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
      if (courseShortcutBlocked(event)) return;
      if (event.key === 'ArrowLeft') game.stepBack();
      else if (event.key === 'ArrowRight') game.stepForward();
      else if (event.key === 'ArrowUp') game.toStart();
      else if (event.key === 'ArrowDown') game.toEnd();
      else if (event.key === 'f') game.flip();
      else if (event.key.toLowerCase() === 'p') game.promoteLine();
      else if (event.key === 'Delete') game.deleteLine();
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

  const copyPosition = async (kind: 'FEN' | 'PGN') => {
    try {
      await navigator.clipboard.writeText(kind === 'FEN' ? game.game.fen() : game.pgn);
      setCopyError('');
      setCopied(kind);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      setCopyError(`Could not copy ${kind}. Check clipboard permissions and try again.`);
    }
  };

  return (
    <div className={`app${focusMode ? ' app--focus' : ''}`} data-board-theme={settings.boardTheme} style={boardThemeStyle(settings.boardTheme)}>
      <header className="app__head">
        <h1>
          Chess Opening Helper
          <span>plans, structures and breaks — not just move orders</span>
        </h1>
        <div className="app__actions">
          <button type="button" className="focus-button" aria-pressed={focusMode}
            aria-keyshortcuts="z" title={focusMode ? 'Exit focus mode (Z or Esc)' : 'Focus mode (Z)'}
            onClick={() => setFocusMode((value) => !value)}>
            {focusMode ? 'Exit focus' : 'Focus mode'} <kbd>Z</kbd>
          </button>
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
              className={mode === 'courses' ? 'is-active' : ''}
              onClick={() => setMode('courses')}
              title="Drill a repertoire PGN, a move at a time"
            >
              Courses
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
                title="Review the main line. Promote a variation to review it instead."
              >
                Review game
              </button>
            </>
          )}
          <button
            type="button"
            className="sound-button"
            onClick={() => settings.setSoundVolume(settings.soundVolume === 0 ? 0.55 : 0)}
            title={settings.soundVolume === 0 ? 'Unmute board sounds' : 'Mute board sounds'}
            aria-label={settings.soundVolume === 0 ? 'Unmute board sounds' : 'Mute board sounds'}
            aria-pressed={settings.soundVolume === 0}
          >
            {settings.soundVolume === 0 ? 'Sound off' : 'Sound on'}
          </button>
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
          showCoordinates={settings.showCoordinates}
          onShowCoordinatesChange={settings.setShowCoordinates}
          pieceSet={settings.pieceSet}
          onPieceSetChange={settings.setPieceSet}
          moveEntryMode={settings.moveEntryMode}
          onMoveEntryModeChange={settings.setMoveEntryMode}
          movementStyle={settings.movementStyle}
          onMovementStyleChange={settings.setMovementStyle}
          movementSpeed={settings.movementSpeed}
          onMovementSpeedChange={settings.setMovementSpeed}
          boardTheme={settings.boardTheme}
          onBoardThemeChange={settings.setBoardTheme}
          annotationThickness={settings.annotationThickness}
          annotationStyle={settings.annotationStyle}
          onAnnotationStyleChange={settings.setAnnotationStyle}
          showLastMoveArrow={settings.showLastMoveArrow}
          onShowLastMoveArrowChange={settings.setShowLastMoveArrow}
          lastMoveArrowColor={settings.lastMoveArrowColor}
          onLastMoveArrowColorChange={settings.setLastMoveArrowColor}
          onAnnotationThicknessChange={settings.setAnnotationThickness}
          soundVolume={settings.soundVolume}
          onSoundVolumeChange={settings.setSoundVolume}
          soundStyle={settings.soundStyle}
          onSoundStyleChange={settings.setSoundStyle}
          replaySounds={settings.replaySounds}
          onReplaySoundsChange={settings.setReplaySounds}
          watchAutoplay={settings.watchAutoplay}
          onWatchAutoplayChange={settings.setWatchAutoplay}
          watchMoveSeconds={settings.watchMoveSeconds}
          onWatchMoveSecondsChange={settings.setWatchMoveSeconds}
          courseLearning={settings}
          onCourseLearningChange={settings.setCourseLearning}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      <PieceSetContext.Provider value={settings.pieceSet}>
      <BoardCoordinatesContext.Provider value={settings.showCoordinates}>
      <BoardAnimationContext.Provider value={settings}>
      <AnnotationStyleContext.Provider value={settings.annotationStyle}>
      <LastMoveArrowContext.Provider value={settings}>
      <BoardSoundProvider volume={settings.soundVolume} style={settings.soundStyle} replay={settings.replaySounds}>
      {mode === 'train' ? (
        <TrainerView onStudyLine={studyLine} annotationThickness={settings.annotationThickness} />
      ) : mode === 'courses' ? (
        <CoursesView
          moveEntryMode={settings.moveEntryMode}
          courseLearning={settings}
          annotationThickness={settings.annotationThickness}
          watchAutoplay={settings.watchAutoplay}
          watchMoveSeconds={settings.watchMoveSeconds}
        />
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
              replay={game.replaying}
              onMove={handleMove}
              moveEntryMode={settings.moveEntryMode}
              marks={marks}
              shapes={game.shapes}
              onShapesChange={game.setShapes}
              annotationThickness={settings.annotationThickness}
              animateMoves
            />
          </div>
          <div className="board-bar">
            <span className={`status${game.game.isCheck() ? ' status--check' : ''}`}>{status}</span>
            <div className="nav">
              <button type="button" onClick={game.toStart} disabled={game.atStart} title="Start (↑)">
                ⏮
              </button>
              <MoveStepButton type="button" onStep={game.stepBack} disabled={game.atStart} title="Back (←)">
                ◀
              </MoveStepButton>
              <MoveStepButton type="button" onStep={game.stepForward} disabled={game.atEnd} title="Forward (→)">
                ▶
              </MoveStepButton>
              <button type="button" onClick={game.toEnd} disabled={game.atEnd} title="End (↓)">
                ⏭
              </button>
            </div>
            <button type="button" className="fen" onClick={() => void copyPosition('FEN')} title={game.game.fen()}>
              {copied === 'FEN' ? 'FEN copied' : 'Copy FEN'}
            </button>
            <button type="button" className="fen" onClick={() => void copyPosition('PGN')} title="Copy all moves, variations and colored drawings">
              {copied === 'PGN' ? 'PGN copied' : 'Copy PGN'}
            </button>
          </div>
          {copyError && <p role="alert">{copyError}</p>}
        </div>

        <aside className="app__side">
          <ExploreMoveTree game={game} />
          <EnginePanel engine={engine} />
          <ImbalancesPanel game={game.game} />
          <OpeningPanel
            match={match}
            fen={game.game.fen()}
            plies={played.length}
            onPlayMove={playSan}
            onMarks={setMarks}
          />
        </aside>
      </main>
      )}
      </BoardSoundProvider>
      </LastMoveArrowContext.Provider>
      </AnnotationStyleContext.Provider>
      </BoardAnimationContext.Provider>
      </BoardCoordinatesContext.Provider>
      </PieceSetContext.Provider>
    </div>
  );
}
