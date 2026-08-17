import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PieceSymbol } from '@coh/chess-core';
import { identifyOpening } from '@coh/opening-book';
import { Board } from './components/Board.js';
import type { SquareMark } from './components/Board.js';
import { MaterialBar } from './components/MaterialBar.js';
import { MoveList } from './components/MoveList.js';
import { OpeningPanel } from './components/OpeningPanel.js';
import { SettingsPanel } from './components/SettingsPanel.js';
import { TrainerView } from './components/TrainerView.js';
import { useChessGame } from './hooks/useChessGame.js';
import { useSounds } from './hooks/useSounds.js';
import { useSpeech } from './hooks/useSpeech.js';
import { usePrefs } from './theme/prefs.js';

type Mode = 'explore' | 'train';

export default function App() {
  const game = useChessGame();
  const { prefs } = usePrefs();
  const speech = useSpeech();
  const sounds = useSounds();
  const [mode, setMode] = useState<Mode>('explore');
  const [marks, setMarks] = useState<SquareMark[]>([]);
  const [copied, setCopied] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Identification follows the cursor, not the end of the line, so stepping
  // back through a game replays how the opening was classified move by move.
  const played = useMemo(() => game.sans.slice(0, game.cursor), [game.sans, game.cursor]);
  const match = useMemo(() => identifyOpening(played), [played]);

  /* --------------------------------------------------- commentary --- */

  // Board feedback follows the cursor rather than the move handler, so a move
  // arrived at by clicking the move list sounds exactly like one just played.
  // Stepping backwards stays silent: nothing was played, only re-read.
  const heard = useRef<{ cursor: number; san: string } | null>(null);
  useEffect(() => {
    const san = game.cursor > 0 ? (game.sans[game.cursor - 1] ?? '') : '';
    const previous = heard.current;
    heard.current = { cursor: game.cursor, san };
    if (!previous || !san) return;
    if (game.cursor < previous.cursor) return;
    if (game.cursor === previous.cursor && san === previous.san) return;
    sounds.playForSan(san);
    speech.announce(san);
  }, [game.cursor, game.sans, sounds, speech]);

  const spokenOpening = useRef('');
  useEffect(() => {
    if (!prefs.speech || !prefs.speechOpenings) return;
    const name = match?.opening.name;
    if (!name || name === spokenOpening.current) return;
    spokenOpening.current = name;
    // Queued behind the move that produced it rather than cutting it off.
    const timer = setTimeout(() => speech.say(name), 900);
    return () => clearTimeout(timer);
  }, [match, prefs.speech, prefs.speechOpenings, speech]);

  /* -------------------------------------------------------- actions --- */

  const handleMove = useCallback(
    (from: string, to: string, promotion?: PieceSymbol) => {
      const info = game.play({ from, to, promotion });
      if (!info) sounds.play('illegal');
      setMarks([]);
    },
    [game, sounds],
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
      if (event.target instanceof HTMLSelectElement) return;
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

  const top = game.orientation === 'white' ? 'b' : 'w';
  const bottom = game.orientation === 'white' ? 'w' : 'b';

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
              <button type="button" onClick={game.flip} title="Flip the board (f)">
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
          <div className="settings-anchor">
            <button
              type="button"
              className={`icon-button${settingsOpen ? ' is-active' : ''}`}
              onClick={() => setSettingsOpen((open) => !open)}
              aria-expanded={settingsOpen}
              title="Board settings"
            >
              ⚙
            </button>
            {settingsOpen && (
              <SettingsPanel
                onClose={() => setSettingsOpen(false)}
                speech={speech}
                sounds={sounds}
              />
            )}
          </div>
        </div>
      </header>

      {mode === 'train' ? (
        <TrainerView onStudyLine={studyLine} speech={speech} sounds={sounds} />
      ) : (
      <main className="app__body">
        <div className="app__board">
          {prefs.showMaterial && (
            <div className="player-strip">
              <span className={`player-strip__dot${game.game.turn() === top ? ' is-turn' : ''}`} />
              <span className="player-strip__name">{top === 'w' ? 'White' : 'Black'}</span>
              <MaterialBar game={game.game} side={top} />
            </div>
          )}
          <Board
            game={game.game}
            orientation={game.orientation}
            lastMove={game.lastMove}
            onMove={handleMove}
            marks={marks}
          />
          {prefs.showMaterial && (
            <div className="player-strip">
              <span className={`player-strip__dot${game.game.turn() === bottom ? ' is-turn' : ''}`} />
              <span className="player-strip__name">{bottom === 'w' ? 'White' : 'Black'}</span>
              <MaterialBar game={game.game} side={bottom} />
            </div>
          )}
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
          <p className="board-hint muted">
            Right-drag to draw an arrow, right-click a square to ring it. Shift, Ctrl and Alt change
            the colour.
          </p>
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
