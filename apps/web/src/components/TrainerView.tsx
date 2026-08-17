import { useEffect, useMemo, useRef, useState } from 'react';
import type { PieceSymbol } from '@coh/chess-core';
import type { Side } from '@coh/opening-book';
import { MASTERY_STREAK, trainableOpenings } from '@coh/trainer';
import type { RepertoireLine } from '@coh/trainer';
import { Board } from './Board.js';
import { MaterialBar } from './MaterialBar.js';
import { useTrainer } from '../hooks/useTrainer.js';
import { usePrefs } from '../theme/prefs.js';
import { sanToSpeech } from '../lib/sanSpeech.js';
import type { Speech } from '../hooks/useSpeech.js';
import type { Sounds } from '../hooks/useSounds.js';

interface TrainerViewProps {
  /** Hands a finished line to the explore board for study. */
  onStudyLine: (moves: string[]) => void;
  speech?: Speech;
  sounds?: Sounds;
}

export function TrainerView({ onStudyLine, speech, sounds }: TrainerViewProps) {
  const openings = useMemo(() => {
    return [...trainableOpenings()].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const [rootKey, setRootKey] = useState('e4 c5');
  const [side, setSide] = useState<Side>('black');

  const rootMoves = useMemo(() => (rootKey ? rootKey.split(' ') : []), [rootKey]);
  const session = useTrainer(rootMoves, side);
  const { trainer, feedback, revealed } = session;

  const { prefs } = usePrefs();
  const summary = trainer.summary();
  const line = trainer.line;
  const complete = trainer.status === 'complete';
  const labels = useMemo(() => lineLabels(session.lines), [session.lines]);

  // Your move and the trainer's reply land in the same render. Both are worth
  // hearing, so the tail of the history since the last render is announced as
  // one phrase and the sounds are staggered to match the two moves.
  const history = trainer.game.history();
  const heard = useRef<number | null>(null);
  useEffect(() => {
    const previous = heard.current;
    heard.current = history.length;
    if (previous === null || history.length <= previous) return;
    const fresh = history.slice(previous);
    fresh.forEach((san, i) =>
      i === 0
        ? sounds?.playForSan(san)
        : setTimeout(() => sounds?.playForSan(san), 240 * i),
    );
    speech?.say(
      fresh.map((san) => sanToSpeech(san, { phonetic: prefs.speechPhonetic })).join(', '),
    );
  }, [history, sounds, speech, prefs.speechPhonetic]);

  const handleMove = (from: string, to: string, promotion?: PieceSymbol) => {
    session.submit({ from, to, promotion });
  };

  const top = side === 'white' ? 'b' : 'w';
  const bottom = side === 'white' ? 'w' : 'b';

  return (
    <div className="trainer">
      <div className="trainer__board">
        {prefs.showMaterial && (
          <div className="player-strip">
            <span className={`player-strip__dot${trainer.game.turn() === top ? ' is-turn' : ''}`} />
            <span className="player-strip__name">{top === 'w' ? 'White' : 'Black'}</span>
            <MaterialBar game={trainer.game} side={top} />
          </div>
        )}
        <Board
          game={trainer.game}
          orientation={side === 'white' ? 'white' : 'black'}
          lastMove={trainer.lastMove}
          onMove={handleMove}
          interactive={trainer.isUsersTurn}
        />
        {prefs.showMaterial && (
          <div className="player-strip">
            <span
              className={`player-strip__dot${trainer.game.turn() === bottom ? ' is-turn' : ''}`}
            />
            <span className="player-strip__name">{bottom === 'w' ? 'White' : 'Black'}</span>
            <MaterialBar game={trainer.game} side={bottom} />
          </div>
        )}
        <div className="board-bar">
          <span className="status">
            {complete
              ? 'Line complete'
              : trainer.isUsersTurn
                ? `Your move — ${side === 'white' ? 'White' : 'Black'} to play`
                : 'Thinking…'}
          </span>
          <span className="muted">
            move {Math.ceil(trainer.ply / 2) || 1} of {Math.ceil((line?.moves.length ?? 0) / 2)}
          </span>
          <div className="nav">
            <button type="button" onClick={session.reveal} disabled={complete || !trainer.isUsersTurn}>
              Hint
            </button>
            <button type="button" onClick={session.nextLine}>
              Skip line
            </button>
          </div>
        </div>
      </div>

      <aside className="trainer__side">
        <section className="panel">
          <div className="trainer__setup">
            <label>
              <span>Opening</span>
              <select value={rootKey} onChange={(e) => setRootKey(e.target.value)}>
                {openings.map((opening) => (
                  <option key={opening.moves.join(' ')} value={opening.moves.join(' ')}>
                    {opening.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>You play</span>
              <div className="segmented">
                <button
                  type="button"
                  className={side === 'white' ? 'is-active' : ''}
                  onClick={() => setSide('white')}
                >
                  White
                </button>
                <button
                  type="button"
                  className={side === 'black' ? 'is-active' : ''}
                  onClick={() => setSide('black')}
                >
                  Black
                </button>
              </div>
            </label>
          </div>

          <div className="trainer__progress">
            <div className="bar">
              <div
                className="bar__fill"
                style={{ width: `${summary.total ? (summary.mastered / summary.total) * 100 : 0}%` }}
              />
            </div>
            <p className="muted">
              {summary.mastered} of {summary.total} variations learned · {summary.seen} seen ·{' '}
              {summary.mistakes} slips
            </p>
          </div>

          <Feedback
            complete={complete}
            line={line}
            feedback={feedback}
            revealed={revealed}
            mistakes={trainer.mistakesThisRun}
            onNext={session.nextLine}
            onStudy={() => line && onStudyLine(line.moves)}
          />
        </section>

        <section className="panel">
          <h3 className="section-head">
            Variations in this opening <span className="muted">({session.lines.length})</span>
          </h3>
          <ul className="line-list">
            {session.lines.map((item) => {
              const progress = trainer.progressOf(item.id);
              return (
                <li key={item.id} className={item.id === line?.id ? 'is-current' : ''}>
                  <button type="button" onClick={() => session.startLine(item.id)}>
                    <span className="line-list__eco">{item.eco}</span>
                    <span className="line-list__name">{labels.get(item.id)}</span>
                    <Mastery streak={progress.streak} attempts={progress.attempts} />
                  </button>
                </li>
              );
            })}
          </ul>
          <button type="button" className="reset" onClick={session.resetProgress}>
            Reset progress
          </button>
        </section>
      </aside>
    </div>
  );
}

/** Everything the player is told after a move — the teaching surface. */
function Feedback({
  complete,
  line,
  feedback,
  revealed,
  mistakes,
  onNext,
  onStudy,
}: {
  complete: boolean;
  line: RepertoireLine | null;
  feedback: ReturnType<typeof useTrainer>['feedback'];
  revealed: string | null;
  mistakes: number;
  onNext: () => void;
  onStudy: () => void;
}) {
  if (complete && line) {
    return (
      <div className="card card--good">
        <h3>
          {line.name} <span className="eco">{line.eco}</span>
        </h3>
        <p>
          {mistakes === 0
            ? 'Clean run — the whole line played from memory.'
            : `Finished with ${mistakes} off-book ${mistakes === 1 ? 'move' : 'moves'}. It will come back soon.`}
        </p>
        {line.theory && <p className="card__idea">{line.theory.idea}</p>}
        <div className="card__actions">
          <button type="button" onClick={onNext}>
            Next variation
          </button>
          <button type="button" onClick={onStudy}>
            Study this line
          </button>
        </div>
      </div>
    );
  }

  if (revealed) {
    return (
      <div className="card card--hint">
        <p>
          Theory plays <strong>{revealed}</strong>. Play it to continue.
        </p>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="card">
        <p className="muted">
          Play the opening against the trainer. It answers with book moves and switches variation
          each time you finish one.
        </p>
      </div>
    );
  }

  switch (feedback.status) {
    case 'off-book':
      return (
        <div className="card card--bad">
          <p>{feedback.message}</p>
          <p className="muted">
            {feedback.context.name}
            {feedback.context.idea ? ` — ${feedback.context.idea}` : ''}
          </p>
        </div>
      );
    case 'transposition':
      return (
        <div className="card card--info">
          <p>
            <strong>{feedback.played}</strong> is book too — that is the {feedback.line.name}.
            Following you there instead.
          </p>
        </div>
      );
    case 'correct':
      return (
        <div className="card card--good">
          <p>
            <strong>{feedback.played}</strong> ✓{feedback.reply ? ` — the trainer replied ${feedback.reply}.` : ''}
          </p>
        </div>
      );
    case 'illegal':
      return (
        <div className="card card--bad">
          <p>That is not a legal move.</p>
        </div>
      );
    default:
      return null;
  }
}

function Mastery({ streak, attempts }: { streak: number; attempts: number }) {
  if (attempts === 0) return <span className="mastery mastery--new">new</span>;
  const dots = Array.from({ length: MASTERY_STREAK }, (_, i) => i < streak);
  return (
    <span className="mastery" title={`${streak} clean run${streak === 1 ? '' : 's'} in a row`}>
      {dots.map((filled, i) => (
        <i key={i} className={filled ? 'is-filled' : ''} />
      ))}
    </span>
  );
}

/** Variation names repeat their parent opening; the tail is the useful part. */
function shortName(line: RepertoireLine): string {
  const parts = line.name.split(': ');
  return parts.length > 1 ? parts.slice(1).join(': ') : line.name;
}

/**
 * Distinct move orders can end up under one ECO name — the book names a
 * position, and truncating deeper variations lands several of them on the same
 * one. Where that happens, tag the entry with its final move so the list does
 * not show the same row twice.
 */
function lineLabels(lines: readonly RepertoireLine[]): Map<string, string> {
  const counts = new Map<string, number>();
  for (const line of lines) {
    const name = shortName(line);
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }

  const labels = new Map<string, string>();
  for (const line of lines) {
    const name = shortName(line);
    const last = line.moves[line.moves.length - 1];
    labels.set(line.id, (counts.get(name) ?? 0) > 1 ? `${name} · ${last}` : name);
  }
  return labels;
}
