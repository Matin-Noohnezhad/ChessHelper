import { useMemo, useRef, useState } from 'react';
import { parseAnnotatedPgn, splitPgnGames } from '@coh/chess-core';
import { REVIEW_SPEEDS } from '../hooks/useGameReview.js';
import type { ReviewController } from '../hooks/useGameReview.js';

/** Enough of a header line to recognise a game in a multi-game export. */
function describeGame(pgn: string, index: number): string {
  const { headers, result, moves } = parseAnnotatedPgn(pgn);
  const players =
    headers.White || headers.Black
      ? `${headers.White ?? '?'} – ${headers.Black ?? '?'}`
      : `Game ${index + 1}`;
  const date = headers.Date && headers.Date !== '????.??.??' ? ` · ${headers.Date}` : '';
  return `${players} · ${result}${date} · ${Math.ceil(moves.length / 2)} moves`;
}

/** "e4 c5 Nf3 d6 …" — enough of the line to recognise the game without a board. */
function openingOf(pgn: string, plies = 6): string {
  const { moves } = parseAnnotatedPgn(pgn);
  const shown = moves.slice(0, plies).map((move) => move.san);
  return shown.join(' ') + (moves.length > plies ? ' …' : '');
}

interface ReviewSetupProps {
  controller: ReviewController;
  /** The line currently on the explore board, ready to review without a copy-paste. */
  currentGamePgn: string | null;
  /** Reviews that line directly — the whole point of the button being here. */
  onReviewBoardGame: () => void;
}

/**
 * Where a review starts. Two ways in, and neither is the poor relation: the
 * moves already on the explore board go straight to the engine in one click,
 * and a PGN can be pasted, dropped or opened from a file. Exports from lichess
 * and chess.com routinely hold a whole month of games, so a multi-game file
 * gets a picker rather than a "one game only" error.
 */
export function ReviewSetup({ controller, currentGamePgn, onReviewBoardGame }: ReviewSetupProps) {
  const [text, setText] = useState('');
  const [selected, setSelected] = useState(0);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const games = useMemo(() => {
    const chunks = splitPgnGames(text).filter((chunk) => parseAnnotatedPgn(chunk).moves.length > 0);
    return chunks.slice(0, 200);
  }, [text]);

  const running = controller.status === 'running';
  const chosen = games[Math.min(selected, games.length - 1)] ?? null;

  const load = (value: string) => {
    setText(value);
    setSelected(0);
  };

  const readFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => load(String(reader.result ?? ''));
    reader.readAsText(file);
  };

  const boardMoves = currentGamePgn ? parseAnnotatedPgn(currentGamePgn).moves.length : 0;

  return (
    <section className="panel review-setup">
      <div className="panel__head">
        <div className="panel__title">
          <h2>Review a game</h2>
          <span className="muted">the moves on the board, or any PGN</span>
        </div>
      </div>

      {currentGamePgn && (
        <>
        <div className="review-board-game">
          <div className="review-board-game__what">
            <strong>The game on the board</strong>
            <span className="muted">
              {Math.ceil(boardMoves / 2)} moves · {openingOf(currentGamePgn)}
            </span>
          </div>
          <div className="review-setup__row">
            <button
              type="button"
              className="primary"
              onClick={onReviewBoardGame}
              disabled={running}
            >
              Review these moves
            </button>
            <button type="button" onClick={() => load(currentGamePgn)} disabled={running}>
              Edit as PGN
            </button>
          </div>
        </div>
        <div className="review-setup__or muted">or review a PGN</div>
        </>
      )}

      <label
        className={`review-drop${dragging ? ' is-dragging' : ''}`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          readFile(event.dataTransfer.files[0]);
        }}
      >
        <textarea
          value={text}
          onChange={(event) => load(event.target.value)}
          placeholder={'[Event "Rated blitz"]\n[White "you"]\n…\n\n1. e4 {[%clk 0:02:58]} c5 …'}
          spellCheck={false}
          rows={8}
        />
      </label>

      <div className="review-setup__row">
        <input
          ref={fileRef}
          type="file"
          accept=".pgn,text/plain"
          hidden
          onChange={(event) => readFile(event.target.files?.[0])}
        />
        <button type="button" onClick={() => fileRef.current?.click()}>
          Open a .pgn file
        </button>
        {text && (
          <button type="button" onClick={() => load('')}>
            Clear
          </button>
        )}
      </div>

      {games.length > 1 && (
        <label className="review-setup__games">
          <span className="muted">{games.length} games in this file</span>
          <select value={selected} onChange={(event) => setSelected(Number(event.target.value))}>
            {games.map((game, index) => (
              <option key={index} value={index}>
                {describeGame(game, index)}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="review-setup__row review-setup__go">
        <div className="segmented">
          {REVIEW_SPEEDS.map((option) => (
            <button
              key={option.key}
              type="button"
              className={controller.speed === option.key ? 'is-active' : ''}
              onClick={() => controller.setSpeed(option.key)}
              title={`depth ${option.depth} — ${option.note}`}
              disabled={running}
            >
              {option.label}
            </button>
          ))}
        </div>
        {running ? (
          <button type="button" onClick={controller.cancel}>
            Stop
          </button>
        ) : (
          <button
            type="button"
            className="primary"
            disabled={!chosen}
            onClick={() => chosen && controller.start(chosen)}
          >
            Analyze
          </button>
        )}
      </div>

      {running && (
        <div className="review-progress">
          <div className="bar">
            <div
              className="bar__fill"
              style={{
                width: `${controller.progress.total ? (controller.progress.done / controller.progress.total) * 100 : 0}%`,
              }}
            />
          </div>
          <p className="muted">
            {controller.progress.total
              ? `Position ${controller.progress.done} of ${controller.progress.total} — the engine keeps the board it has already seen, so repetitions are free.`
              : 'Starting the engine…'}
          </p>
        </div>
      )}

      {controller.error && <p className="review-error">{controller.error}</p>}
    </section>
  );
}
