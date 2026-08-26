import { useEffect, useMemo, useState } from 'react';
import { Chess } from '@coh/chess-core';
import {
  QUALITY_LABELS,
  formatScore,
  formatSeconds,
  keyMoments,
  winPercent,
} from '@coh/review';
import type { GameReview, MoveTag, ReviewedMove } from '@coh/review';
import { breaksFor, classifyStructureBest, plansFor } from '@coh/opening-book';
import type { Side } from '@coh/opening-book';
import { Board } from './Board.js';
import type { AnnotationThickness } from './Board.js';
import { EvalBar } from './EvalBar.js';
import { QualityBadge } from './QualityBadge.js';
import { ReviewGraph } from './ReviewGraph.js';
import { ReviewMoveList } from './ReviewMoveList.js';
import { ReviewSetup } from './ReviewSetup.js';
import { ReviewSummary } from './ReviewSummary.js';
import { useGameReview } from '../hooks/useGameReview.js';
import type { Orientation } from '../hooks/useChessGame.js';

const TAG_LABELS: Record<MoveTag, string> = {
  sacrifice: 'Sacrifice',
  'only-move': 'Only move',
  critical: 'Critical moment',
  'time-pressure': 'Time pressure',
};

interface ReviewViewProps {
  /** The line on the explore board, so "review what I just played" needs no clipboard. */
  currentGamePgn: string | null;
  annotationThickness?: AnnotationThickness;
}

/**
 * The pawn structure on the board at this move, if it is one the encyclopedia
 * knows. Read from the position rather than from the opening, which is the
 * point: by move 20 the opening's name has stopped being the useful fact and
 * the structure has started being it.
 */
export function StructureNote({ fen, toMove }: { fen: string; toMove: Side }) {
  const match = classifyStructureBest(fen);
  if (!match) return null;

  const plans = plansFor(match, toMove);
  const breaks = breaksFor(match).filter((brk) => brk.side === toMove);

  return (
    <div className="review-detail__structure">
      <h3>{match.structure.name}</h3>
      {plans[0] && <p>{plans[0]}</p>}
      {breaks.length > 0 && (
        <p className="muted">
          {toMove === 'white' ? 'White' : 'Black'} breaks here:{' '}
          {breaks.map((brk) => brk.move).join(', ')}
        </p>
      )}
    </div>
  );
}

function MoveDetail({
  move,
  fen,
  showBest,
  onToggleBest,
}: {
  move: ReviewedMove;
  /** The position shown on the board, which is what the structure is read from. */
  fen: string;
  showBest: boolean;
  onToggleBest: () => void;
}) {
  const numbered = `${move.moveNumber}${move.color === 'w' ? '.' : '…'} ${move.san}`;
  const alternative = move.best && move.best.uci !== move.uci ? move.best : null;

  return (
    <section className="panel review-detail">
      <div className="panel__head">
        <div className="panel__title">
          <h2>{numbered}</h2>
          <QualityBadge quality={move.quality} withLabel />
        </div>
        {alternative && (
          <button type="button" className={showBest ? 'is-active' : ''} onClick={onToggleBest}>
            {showBest ? 'Back to the game' : `Show ${alternative.san}`}
          </button>
        )}
      </div>

      <p className="review-detail__line">{move.explanation}</p>

      <StructureNote fen={fen} toMove={fen.split(' ')[1] === 'b' ? 'black' : 'white'} />

      <dl className="review-detail__facts">
        <div>
          <dt>Evaluation</dt>
          <dd>
            {formatScore(move.scoreBefore)} → {formatScore(move.scoreAfter)}
          </dd>
        </div>
        <div>
          <dt>Accuracy</dt>
          <dd>{move.accuracy.toFixed(1)}%</dd>
        </div>
        <div>
          <dt>Phase</dt>
          <dd>{move.phase}</dd>
        </div>
        {move.secondsSpent !== null && (
          <div>
            <dt>Time spent</dt>
            <dd>
              {formatSeconds(move.secondsSpent)}
              {move.clockSeconds !== null && (
                <span className="muted"> · {formatSeconds(move.clockSeconds)} left</span>
              )}
            </dd>
          </div>
        )}
      </dl>

      {move.tags.length > 0 && (
        <div className="panel__tags">
          {move.tags.map((tag) => (
            <span key={tag} className="tag">
              {TAG_LABELS[tag]}
            </span>
          ))}
        </div>
      )}

      {move.best && (
        <ol className="review-detail__lines">
          {[move.best, ...move.alternatives].map((candidate, index) => (
            <li key={candidate.uci} className={index === 0 ? 'is-best' : ''}>
              <span className="review-detail__eval">{formatScore(candidate.score)}</span>
              <span className="review-detail__pv">
                {(candidate.pv ?? [candidate.san]).join(' ')}
              </span>
            </li>
          ))}
        </ol>
      )}

      {move.comment && <p className="muted review-detail__comment">“{move.comment}”</p>}
    </section>
  );
}

export function ReviewReport({
  review,
  annotationThickness,
  onReset,
}: {
  review: GameReview;
  annotationThickness?: AnnotationThickness;
  onReset: () => void;
}) {
  const [selectedPly, setSelectedPly] = useState(0);
  const [showBest, setShowBest] = useState(false);
  const [orientation, setOrientation] = useState<Orientation>('white');

  // A fresh report starts at the first thing worth looking at, not at move one.
  useEffect(() => {
    const worst = keyMoments(review, 1)[0];
    setSelectedPly(worst?.ply ?? 0);
    setShowBest(false);
  }, [review]);

  const move = selectedPly > 0 ? (review.moves[selectedPly - 1] ?? null) : null;
  const alternative = move?.best && move.best.uci !== move.uci ? move.best : null;
  const showingBefore = showBest && alternative !== null && move !== null;

  const fen = showingBefore
    ? move!.fenBefore
    : move
      ? move.fenAfter
      : (review.moves[0]?.fenBefore ?? new Chess().fen());
  const game = useMemo(() => new Chess(fen), [fen]);

  const score = showingBefore ? move!.scoreBefore : (move?.scoreAfter ?? { cp: 0, mate: null });
  const lastMove =
    move && !showingBefore ? { from: move.uci.slice(0, 2), to: move.uci.slice(2, 4) } : null;
  const hintArrows =
    showingBefore && alternative
      ? [{ from: alternative.uci.slice(0, 2), to: alternative.uci.slice(2, 4) }]
      : [];

  const step = (delta: number) => {
    setShowBest(false);
    setSelectedPly((ply) => Math.max(0, Math.min(review.moves.length, ply + delta)));
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (event.key === 'ArrowLeft') step(-1);
      else if (event.key === 'ArrowRight') step(1);
      else if (event.key === 'ArrowUp') setSelectedPly(0);
      else if (event.key === 'ArrowDown') setSelectedPly(review.moves.length);
      else if (event.key === 'f') setOrientation((o) => (o === 'white' ? 'black' : 'white'));
      else return;
      event.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [review.moves.length]);

  const moments = useMemo(() => keyMoments(review), [review]);
  const showClocks = review.moves.some((entry) => entry.secondsSpent !== null);

  return (
    <main className="app__body">
      <div className="app__board">
        <div className="board-row">
          <EvalBar
            reading={{ fraction: winPercent(score) / 100, label: formatScore(score) }}
            orientation={orientation}
          />
          <Board
            game={game}
            orientation={orientation}
            lastMove={lastMove}
            onMove={() => {}}
            interactive={false}
            hintArrows={hintArrows}
            {...(annotationThickness ? { annotationThickness } : {})}
          />
        </div>

        <div className="board-bar">
          <span className="status">
            {move
              ? `${move.moveNumber}${move.color === 'w' ? '.' : '…'} ${move.san} — ${QUALITY_LABELS[move.quality]}`
              : 'Starting position'}
          </span>
          <div className="nav">
            <button type="button" onClick={() => setSelectedPly(0)} disabled={selectedPly === 0}>
              ⏮
            </button>
            <button type="button" onClick={() => step(-1)} disabled={selectedPly === 0}>
              ◀
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              disabled={selectedPly === review.moves.length}
            >
              ▶
            </button>
            <button
              type="button"
              onClick={() => setSelectedPly(review.moves.length)}
              disabled={selectedPly === review.moves.length}
            >
              ⏭
            </button>
          </div>
          <button type="button" onClick={() => setOrientation((o) => (o === 'white' ? 'black' : 'white'))}>
            Flip
          </button>
        </div>

        {move && (
          <MoveDetail
            move={move}
            fen={fen}
            showBest={showBest}
            onToggleBest={() => setShowBest((v) => !v)}
          />
        )}
      </div>

      <aside className="app__side">
        <div className="review-actions">
          <button type="button" onClick={onReset}>
            Review another game
          </button>
        </div>

        <ReviewSummary review={review} />
        <ReviewGraph
          review={review}
          selectedPly={selectedPly}
          onSelect={(ply) => {
            setShowBest(false);
            setSelectedPly(ply);
          }}
        />

        {moments.length > 0 && (
          <section className="panel review-moments">
            <div className="panel__head">
              <div className="panel__title">
                <h2>Turning points</h2>
                <span className="muted">worst first</span>
              </div>
            </div>
            <ul>
              {moments.map((moment) => (
                <li key={moment.ply}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowBest(false);
                      setSelectedPly(moment.ply);
                    }}
                  >
                    <QualityBadge quality={moment.quality} />
                    <span className="review-moments__san">
                      {moment.moveNumber}
                      {moment.color === 'w' ? '.' : '…'} {moment.san}
                    </span>
                    <span className="muted">{moment.explanation}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="moves">
          <h3>Moves</h3>
          <ReviewMoveList
            moves={review.moves}
            selectedPly={selectedPly}
            onSelect={(ply) => {
              setShowBest(false);
              setSelectedPly(ply);
            }}
            showClocks={showClocks}
          />
        </section>
      </aside>
    </main>
  );
}

/**
 * The report itself, split out so it can be rendered from a canned review in
 * the tests without standing up an engine.
 */

/**
 * The review mode: a PGN goes in, and what comes back is the same report
 * chess.com gives — accuracy for both sides, split by phase, with every move
 * labelled and the turning points listed first.
 */
export function ReviewView({ currentGamePgn, annotationThickness }: ReviewViewProps) {
  const controller = useGameReview();

  if (!controller.review) {
    return (
      <main className="app__body app__body--single">
        <ReviewSetup controller={controller} currentGamePgn={currentGamePgn} />
      </main>
    );
  }

  return (
    <ReviewReport
      review={controller.review}
      {...(annotationThickness ? { annotationThickness } : {})}
      onReset={controller.clear}
    />
  );
}
