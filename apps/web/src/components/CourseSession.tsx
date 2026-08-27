import { useCallback, useEffect, useMemo, useState } from 'react';
import { courseOutline } from '@coh/course';
import type { CourseNode, CourseOutcome, CourseProgress, SessionMode } from '@coh/course';
import { Chess, START_FEN } from '@coh/chess-core';
import type { PieceSymbol } from '@coh/chess-core';
import { Board } from './Board.js';
import type { AnnotationThickness, BoardArrow } from './Board.js';
import { CourseOutline } from './CourseOutline.js';
import { useCourseSession } from '../hooks/useCourseSession.js';
import type { LibraryEntry } from '../hooks/useCourseLibrary.js';
import { WATCH_SECONDS_DEFAULT } from '../hooks/useSettings.js';

const MODE_LABELS: Record<SessionMode, string> = {
  learn: 'Learning',
  review: 'Review',
  random: 'Quick review',
};

const MODE_NOTES: Record<SessionMode, string> = {
  learn: 'Watch the moves, play them back, then the whole line from the top.',
  review: 'Whole variations, nothing shown until you have missed it.',
  random: 'One position, one move, next.',
};

/**
 * How long a demonstrated move stays on the board before the next one.
 *
 * The plain pause is the Settings dial (`watchMoveSeconds`); a move with
 * something written about it holds this much longer, so there is time to read
 * the first sentence of it whatever the dial is set to.
 */
const WATCH_NOTE_RATIO = 2600 / 1100;

/**
 * The pace for the recap at the top of a first part — the shared opening you
 * were already taught in the line before this one. Quick enough not to be a
 * wait, slow enough to follow the pieces back to where this line branches off.
 * It ignores the Settings dial: a recap is not the part you are here to read.
 */
const WATCH_PAUSE_RECAP = 420;

/** What one line of a session is called, which is not the same in all three. */
const RUN_NOUN: Record<SessionMode, string> = {
  learn: 'Line',
  review: 'Line',
  random: 'Move',
};

interface CourseSessionProps {
  entry: LibraryEntry;
  mode: SessionMode;
  chapterIds?: string[];
  lineIds?: string[];
  onExit: () => void;
  /** Jump to another line off the rail — starts a fresh study session on it. */
  onPickLine: (lineId: string) => void;
  onProgress?: (progress: CourseProgress) => void;
  annotationThickness?: AnnotationThickness;
  /** Auto-advance the demonstration — from Settings. Off means step it yourself. */
  watchAutoplay?: boolean;
  /** Seconds a plain demonstrated move holds — from Settings. */
  watchMoveSeconds?: number;
}

/**
 * A session, running.
 *
 * The board is the whole interface: you answer by playing the move, and the
 * panel beside it is the author talking. What the panel says depends on what the
 * session is doing — teaching a move shows the note before you play it, testing
 * one shows the note after — and the one thing it will not do is name the move
 * you are being asked for until you have either produced it or given up on it.
 */
export function CourseSession({
  entry,
  mode,
  chapterIds,
  lineIds,
  onExit,
  onPickLine,
  onProgress,
  annotationThickness,
  watchAutoplay = true,
  watchMoveSeconds = WATCH_SECONDS_DEFAULT,
}: CourseSessionProps) {
  const session = useCourseSession(
    entry,
    { mode, ...(chapterIds ? { chapterIds } : {}), ...(lineIds ? { lineIds } : {}) },
    onProgress,
  );
  const { trainer, plan, feedback, answer } = session;
  const orientation = entry.course.side === 'white' ? 'white' : 'black';
  const score = trainer.scoreboard();
  const task = trainer.task;
  const node = trainer.current;
  const watching = trainer.watching;
  const watched = trainer.watched;
  const part = trainer.part;
  // How far through the run you are, in moves rather than plies — the number a
  // person counts while playing a line back.
  const asked = task?.quiz.length ?? 0;
  const done = Math.round(trainer.taskCompletion * asked);
  const run = trainer.run;

  // The rail: every line of the course, grouped by chapter, with the one on the
  // board picked out. Built off the library's progress, so it moves as you go.
  const outline = useMemo(
    () => courseOutline(entry.course, entry.progress),
    [entry.course, entry.progress],
  );
  // A random-mode task's lineId carries the position it asks about after an `@`.
  const activeLineId = task?.lineId.split('@')[0] ?? null;
  const railLines = outline.reduce((sum, chapter) => sum + chapter.variations.length, 0);

  /**
   * Looking back through the line, as a ply count, or null for the live board.
   *
   * A note attached to a move goes past in a couple of seconds, and the moment
   * you want it again is the moment you are stuck on the move after it. So the
   * moves already on the board can be walked back through and read again — on a
   * board of their own, with the live position untouched behind them.
   */
  const [lookback, setLookback] = useState<number | null>(null);
  const livePly = trainer.ply;
  const trail = trainer.played;
  const looking = lookback !== null;

  // Any move by either side puts you back in the present: a lookback is a
  // detour, not a mode you can accidentally leave the session in.
  useEffect(() => {
    setLookback(null);
  }, [livePly, trainer.task?.id]);

  const stepTo = useCallback(
    (ply: number) => setLookback(ply >= livePly ? null : Math.max(0, ply)),
    [livePly],
  );

  // The board as it stood after `lookback` plies. Rebuilt rather than unwound,
  // because the trainer's own board is the live one and must not be touched.
  const lookbackGame = useMemo(() => {
    if (lookback === null || !task) return null;
    const board = new Chess(trainer.startFen ?? START_FEN);
    for (let i = 0; i < lookback; i++) board.move(task.line[i]!.san);
    return board;
  }, [lookback, task, trainer.startFen]);

  const lookbackNode = lookback ? (task?.line[lookback - 1] ?? null) : null;
  const lookbackLast = useMemo(() => {
    if (!lookbackGame || !lookback) return null;
    const before = new Chess(trainer.startFen ?? START_FEN);
    for (let i = 0; i < lookback - 1; i++) before.move(task!.line[i]!.san);
    const info = before.move(task!.line[lookback - 1]!.san);
    return info ? { from: info.from, to: info.to } : null;
  }, [lookbackGame, lookback, task, trainer.startFen]);

  // The demonstration plays itself — unless autoplay is off, when it waits for
  // you to step it. Each move holds for the dial's `watchMoveSeconds`, longer
  // when the author left something to read with it. It holds still entirely
  // while you read back through what it has already played, and the recap at the
  // top of a first part always runs at its own quick clock, autoplay off or on.
  const { advanceWatch } = session;
  const watchStep = watched?.id ?? '';
  const watchAt = trainer.watchAt;
  const recapUntil = trainer.watchRecapUntil;
  const inRecap = watching && recapUntil > 0 && watchAt <= recapUntil;
  const manualWatch = !watchAutoplay;
  useEffect(() => {
    if (!watching || looking) return;
    if (manualWatch && !inRecap) return; // your move to make: step it yourself
    const moveMs = watchMoveSeconds * 1000;
    const pause = inRecap
      ? WATCH_PAUSE_RECAP
      : watched?.comment
        ? moveMs * WATCH_NOTE_RATIO
        : moveMs;
    const timer = setTimeout(advanceWatch, pause);
    return () => clearTimeout(timer);
    // watchStep is the move currently on the board: a new one restarts the wait.
  }, [
    watching,
    looking,
    watchStep,
    watched?.comment,
    inRecap,
    manualWatch,
    watchMoveSeconds,
    advanceWatch,
  ]);

  // Arrow keys walk the trail, the way they do on the explore board — but while
  // the line is being demonstrated, → and Space step the demonstration instead,
  // which is the whole of how Manual pace is driven.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) return;
      const steppingWatch = watching && !looking;
      // Space also activates a focused button; only claim it when nothing is.
      const spaceStep = event.key === ' ' && !(event.target instanceof HTMLButtonElement);
      if ((event.key === 'ArrowRight' || spaceStep) && steppingWatch) advanceWatch();
      else if (event.key === 'ArrowLeft') stepTo((lookback ?? livePly) - 1);
      else if (event.key === 'ArrowRight') stepTo((lookback ?? livePly) + 1);
      else if (event.key === 'ArrowUp') stepTo(0);
      else if (event.key === 'ArrowDown' || event.key === 'Escape') setLookback(null);
      else return;
      event.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lookback, livePly, stepTo, watching, looking, advanceWatch]);

  const handleMove = (from: string, to: string, promotion?: PieceSymbol) => {
    session.submit({ from, to, promotion });
  };

  // The answer, drawn rather than only written: an arrow on the board is what
  // you will actually see over the board next time.
  const arrows: BoardArrow[] = [];
  if (node && answer) {
    const probe = trainer.game.clone();
    const info = probe.move(node.san);
    if (info) arrows.push({ from: info.from, to: info.to, color: 'blue' });
  }

  // Whatever the author drew on the move you are looking at — carried through
  // from the PGN's [%cal]/[%csl]. Shown while the line plays itself and while
  // you read back through it; a move that is still a question keeps its secrets.
  const shapeNode: CourseNode | null = looking ? lookbackNode : watching ? watched : null;
  const shapeArrows: BoardArrow[] = (shapeNode?.shapes?.arrows ?? []).map((arrow) => ({
    from: arrow.from,
    to: arrow.to,
    color: arrow.color,
  }));
  const shapeCircles = (shapeNode?.shapes?.circles ?? []).map((circle) => ({
    square: circle.square,
    color: circle.color,
  }));

  if (!plan.tasks.length) {
    return (
      <div className="course-session course-session--empty">
        <section className="panel">
          <h2>Nothing to do here</h2>
          <p className="muted">
            {mode === 'learn'
              ? 'Every move in this selection has been met at least once. Review is what brings them back.'
              : 'Nothing in this selection is due yet. Come back when it is, or learn some new moves.'}
          </p>
          <button type="button" className="primary" onClick={onExit}>
            Back to the course
          </button>
        </section>
      </div>
    );
  }

  const finished = trainer.status === 'complete' && !trainer.current;
  const betweenTasks = trainer.status === 'task-complete';
  const showRail = railLines > 1;

  return (
    <div className={`trainer course-session${showRail ? ' course-session--rail' : ''}`}>
      {showRail && (
        <aside className="panel course-session__rail">
          <div className="course-head">
            <h2>Lines</h2>
          </div>
          <CourseOutline
            chapters={outline}
            variant="rail"
            activeLineId={activeLineId}
            onPickLine={onPickLine}
          />
        </aside>
      )}
      <div className="trainer__board">
        <Board
          game={lookbackGame ?? trainer.game}
          orientation={orientation}
          lastMove={looking ? lookbackLast : trainer.lastMove}
          onMove={handleMove}
          interactive={!looking && trainer.isUsersTurn}
          hintArrows={[...(looking ? [] : arrows), ...shapeArrows]}
          hintCircles={shapeCircles}
          annotationThickness={annotationThickness}
          animateMoves={!looking}
        />
        <div className="board-bar">
          <span className={`status${looking ? ' status--looking' : ''}`}>
            {looking
              ? `Looking back — move ${lookback} of ${livePly}`
              : watching
                ? inRecap
                  ? watched
                    ? `Recap — ${watched.san}`
                    : 'Recapping the shared opening'
                  : watched
                    ? `Watching — ${watched.san}`
                    : 'Watch the line'
                : finished
                  ? 'Session complete'
                  : betweenTasks
                    ? 'Line complete'
                    : trainer.isUsersTurn
                      ? answer
                        ? `Play ${answer}`
                        : `Your move — ${orientation === 'white' ? 'White' : 'Black'} to play`
                      : 'Thinking…'}
          </span>
          {run && (
            <span className="course-session__count muted">
              <strong>
                {RUN_NOUN[mode]} {run.line + 1} of {run.lines}
              </strong>
              {run.total > 1 && (
                <span>
                  try {run.index + 1} of {run.total}
                </span>
              )}
            </span>
          )}
          <div className="nav">
            <button
              type="button"
              onClick={() => stepTo((lookback ?? livePly) - 1)}
              disabled={(lookback ?? livePly) === 0}
              title="Back through the moves (←)"
            >
              ◀
            </button>
            <button
              type="button"
              onClick={() => stepTo((lookback ?? livePly) + 1)}
              disabled={!looking}
              title="Forward (→)"
            >
              ▶
            </button>
            {looking ? (
              <button type="button" className="primary" onClick={() => setLookback(null)}>
                Back to the game
              </button>
            ) : watching ? (
              <>
                <button
                  type="button"
                  className={manualWatch && !inRecap ? 'primary' : undefined}
                  onClick={session.advanceWatch}
                  title="Next move (→ or Space)"
                >
                  Next ⏭
                </button>
                <button type="button" onClick={session.skipWatch}>
                  Let me try
                </button>
              </>
            ) : (
              <>
                {trainer.replayable && (
                  <button
                    type="button"
                    onClick={session.rewatch}
                    title="Play the line out again — you will be asked for it after"
                  >
                    Watch again
                  </button>
                )}
                <button
                  type="button"
                  onClick={session.reveal}
                  disabled={!trainer.isUsersTurn || Boolean(answer)}
                  title="Show the move — it counts as a miss"
                >
                  Hint
                </button>
                <button type="button" onClick={session.next} disabled={finished}>
                  Skip
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <aside className="trainer__side">
        <section className="panel">
          <div className="course-head">
            <h2>{MODE_LABELS[mode]}</h2>
            {part && (
              <span className="tag tag--book">
                Part {part.index + 1} of {part.total}
              </span>
            )}
            <button type="button" onClick={onExit}>
              Finish
            </button>
          </div>
          <p className="muted">
            {mode === 'learn' && part
              ? `A long line, so it comes in ${part.total} parts — then the whole thing from the top.`
              : MODE_NOTES[mode]}
          </p>

          <div className="trainer__progress">
            <div className="bar">
              <div
                className="bar__fill"
                style={{
                  width: `${score.tasksTotal ? (score.tasksDone / score.tasksTotal) * 100 : 0}%`,
                }}
              />
            </div>
            <p className="muted">
              {task ? `${task.chapterName} · ` : ''}
              {score.graded} move{score.graded === 1 ? '' : 's'} answered · {score.right} right ·{' '}
              {score.wrong} missed
            </p>
          </div>

          {trail.length > 0 && (
            <MoveTrail
              trail={trail}
              cursor={lookback ?? livePly}
              startIndex={task?.startIndex ?? 0}
              onSelect={stepTo}
            />
          )}

          {looking ? (
            <div className="card card--hint">
              <h3>
                <strong>{lookbackNode?.san}</strong>{' '}
                <span className="muted">{lookbackNode?.side === 'w' ? 'White' : 'Black'}</span>
              </h3>
              {lookbackNode?.comment && <p>{lookbackNode.comment}</p>}
              <div className="card__actions">
                <button type="button" className="primary" onClick={() => setLookback(null)}>
                  Back to the game
                </button>
              </div>
            </div>
          ) : watching ? (
            <Demonstration
              watched={watched}
              upNext={trainer.watchNext}
              progress={trainer.watchCompletion}
              recap={inRecap}
              manual={manualWatch && !inRecap}
            />
          ) : finished ? (
            <div className="card card--good">
              <h3>Done</h3>
              <p>
                {score.right} of {score.graded} answered without help. Everything you answered has
                a new date; the ones you missed come back in four hours.
              </p>
              <div className="card__actions">
                <button type="button" onClick={session.restart}>
                  Go again
                </button>
                <button type="button" className="primary" onClick={onExit}>
                  Back to the course
                </button>
              </div>
            </div>
          ) : betweenTasks ? (
            <div className="card card--good">
              <h3>{part ? `Part ${part.index + 1} done` : 'Line complete'}</h3>
              <p className="course-session__line">{task?.line.map((n) => n.san).join(' ')}</p>
              <div className="card__actions">
                <button type="button" className="primary" onClick={session.next}>
                  {part && part.index + 1 < part.total ? 'Next part' : 'Next'}
                </button>
              </div>
            </div>
          ) : (
            <Prompt
              node={node}
              answer={answer}
              feedback={feedback}
              asked={asked}
              done={done}
              part={part}
              fromTheTop={mode === 'learn' && !task?.watch}
            />
          )}
        </section>
      </aside>
    </div>
  );
}

interface MoveTrailProps {
  trail: CourseNode[];
  cursor: number;
  /** Plies before this were put on the board as context, not taught. */
  startIndex: number;
  onSelect: (ply: number) => void;
}

/**
 * The moves so far, clickable.
 *
 * This is how you get a note back. The author's line about why the knight goes
 * to b3 goes past in a couple of seconds, and the moment you want it again is
 * the moment you are stuck on the move after it — so every move played is a
 * button, and the ones the session merely replayed to reach the question are
 * dimmed rather than hidden, because they are also moves with notes on them.
 */
function MoveTrail({ trail, cursor, startIndex, onSelect }: MoveTrailProps) {
  const rows: { number: number; white?: CourseNode; black?: CourseNode; whitePly?: number; blackPly?: number }[] = [];
  let number = 1;
  for (let i = 0; i < trail.length; i++) {
    const node = trail[i]!;
    const row = rows[rows.length - 1];
    if (node.side === 'w' || !row || row.black) {
      rows.push(
        node.side === 'w'
          ? { number: number++, white: node, whitePly: i + 1 }
          : { number: number++, black: node, blackPly: i + 1 },
      );
    } else {
      row.black = node;
      row.blackPly = i + 1;
    }
  }

  const cell = (node: CourseNode | undefined, ply: number | undefined) =>
    node && ply !== undefined ? (
      <button
        type="button"
        className={[
          'move-list__move',
          cursor === ply ? 'is-current' : '',
          ply <= startIndex ? 'is-context' : '',
          node.comment ? 'has-note' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={() => onSelect(ply)}
        title={node.comment ? node.comment.slice(0, 120) : undefined}
      >
        {node.san}
      </button>
    ) : null;

  return (
    <div className="course-trail">
      <ol className="move-list">
        {rows.map((row) => (
          <li key={row.number}>
            <span className="move-list__number">
              {row.number}.{row.white ? '' : '..'}
            </span>
            {cell(row.white, row.whitePly)}
            {cell(row.black, row.blackPly)}
          </li>
        ))}
      </ol>
      <p className="muted course-trail__hint">
        Click a move — or use ← and → — to read what the author wrote about it.
      </p>
    </div>
  );
}

interface DemonstrationProps {
  watched: CourseNode | null;
  upNext: CourseNode | null;
  progress: number;
  /** The moves going past now are the shared opening, replayed at speed. */
  recap: boolean;
  /** Manual pace: the line waits for you to step it rather than playing itself. */
  manual: boolean;
}

/**
 * The line being played out.
 *
 * This is the half of learning that is not a test, and it is worth not rushing:
 * a move you watched land, in a position you had a moment to look at, with the
 * reason it is played sitting next to it, is a move you have some chance of
 * producing thirty seconds later. A line that flashes past is a line you will
 * be shown again tomorrow. The exception is the recap — moves you were taught
 * in the line before this one, run through quickly to reach the branch.
 */
function Demonstration({ watched, upNext, progress, recap, manual }: DemonstrationProps) {
  return (
    <div className="card card--info course-watch">
      <h3>
        {watched ? (
          <>
            <strong>{watched.san}</strong>{' '}
            <span className="muted">
              {watched.side === 'w' ? 'White' : 'Black'}
            </span>
          </>
        ) : recap ? (
          'Recapping the shared opening'
        ) : (
          'Watch the line'
        )}
      </h3>
      {recap ? (
        <p className="muted">
          You have played these moves already — this is the line before this one, to here.
        </p>
      ) : watched?.comment ? (
        <p>{watched.comment}</p>
      ) : (
        <p className="muted">
          {upNext ? 'Watching the moves — you will be asked for them next.' : 'Now play it back.'}
        </p>
      )}
      {manual && upNext && (
        <p className="muted course-watch__step">
          Press <kbd>→</kbd> or <strong>Next</strong> for {upNext.san}.
        </p>
      )}
      <div className="bar course-watch__bar">
        <div className="bar__fill" style={{ width: `${Math.round(progress * 100)}%` }} />
      </div>
    </div>
  );
}

interface PromptProps {
  node: { san: string; comment?: string } | null;
  answer: string | null;
  feedback: CourseOutcome | null;
  /** Moves this run asks for, and how many have been produced. */
  asked: number;
  done: number;
  part: { index: number; total: number } | null;
  /** True on the run that asks for the whole line rather than a part of it. */
  fromTheTop: boolean;
}

/**
 * What the panel says while you are the one moving.
 *
 * The one thing it will not do is name the move. Everything here is either the
 * shape of what is being asked — a part you have just watched, or the whole line
 * from the top — or what happened to the move you last played. The note the
 * author wrote about the move you are *about* to make is worth nothing before
 * you know which move it is, and printing it would be printing the answer.
 */
function Prompt({ node, answer, feedback, asked, done, part, fromTheTop }: PromptProps) {
  const left = Math.max(asked - done, 0);

  return (
    <>
      {!answer && !feedback && (
        <div className="card card--info">
          <h3>{fromTheTop ? 'Now the whole line' : 'Your turn'}</h3>
          <p className="muted">
            {fromTheTop
              ? `From the first move, nothing shown — ${asked} move${asked === 1 ? '' : 's'} to play.`
              : part
                ? `Play back the ${asked} move${asked === 1 ? '' : 's'} of part ${part.index + 1}.`
                : `Play back the ${asked} move${asked === 1 ? '' : 's'} you just watched.`}
          </p>
        </div>
      )}

      {answer && node && (
        <div className="card card--hint">
          <h3>
            The move was <strong>{answer}</strong>
          </h3>
          {node.comment && <p>{node.comment}</p>}
        </div>
      )}

      {feedback && <Feedback feedback={feedback} />}

      {(answer || feedback) && left > 0 && (
        <p className="muted course-session__left">
          {left} move{left === 1 ? '' : 's'} left in this run.
        </p>
      )}
    </>
  );
}

function Feedback({ feedback }: { feedback: CourseOutcome }) {
  switch (feedback.status) {
    case 'correct':
      return (
        <div className="card card--good">
          <h3>{feedback.san}</h3>
          {feedback.node.comment && <p>{feedback.node.comment}</p>}
          {feedback.reply && (
            <p>
              <strong>{feedback.reply.san}</strong>
              {feedback.reply.comment ? ` — ${feedback.reply.comment}` : ''}
            </p>
          )}
        </div>
      );
    case 'alternative':
      return (
        <div className="card card--good">
          <h3>
            {feedback.san} <span className="muted">also playable</span>
          </h3>
          <p>
            The author shows {feedback.san} here but writes the line with{' '}
            <strong>{feedback.expected.san}</strong>, so that is what is on the board.
          </p>
          {feedback.expected.comment && <p>{feedback.expected.comment}</p>}
        </div>
      );
    case 'other-line':
      return (
        <div className="card card--info">
          <h3>{feedback.san}</h3>
          <p>{feedback.message}</p>
          {feedback.node.comment && <p className="muted">{feedback.node.comment}</p>}
        </div>
      );
    case 'rejected':
      return (
        <div className="card card--bad">
          <h3>{feedback.san}</h3>
          <p>{feedback.message}</p>
        </div>
      );
    case 'wrong':
      return (
        <div className="card card--bad">
          <h3>Not {feedback.san}</h3>
          <p>{feedback.message}</p>
          {feedback.expected.comment && <p>{feedback.expected.comment}</p>}
        </div>
      );
    default:
      return null;
  }
}
