import { MoveStepButton } from './MoveStepButton.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Chess } from '@coh/chess-core';
import type { PieceSymbol } from '@coh/chess-core';
import { nodePath, playTreeMove, positionAt, selectedLine, selectTreeNode } from '../exploreTree.js';
import { newReviewTree, reviewAnchor, selectReviewPly } from '../reviewTree.js';
import { useEngine } from '../hooks/useEngine.js';
import { EnginePanel } from './EnginePanel.js';
import {
  QUALITY_LABELS,
  QUALITY_SYMBOLS,
  formatScore,
  formatSeconds,
  keyMoments,
  winPercent,
} from '@coh/review';
import type { GameReview, MoveTag, ReviewedMove } from '@coh/review';
import { breaksFor, classifyStructureBest, structureFor } from '@coh/opening-book';
import type { Side } from '@coh/opening-book';
import { Board } from './Board.js';
import type { AnnotationThickness, SquareBadge } from './Board.js';
import { EvalBar } from './EvalBar.js';
import { QualityBadge, qualityClass } from './QualityBadge.js';
import { ReviewGraph } from './ReviewGraph.js';
import { ReviewMoveList } from './ReviewMoveList.js';
import { ReviewSetup } from './ReviewSetup.js';
import { ReviewSummary } from './ReviewSummary.js';
import type { ReviewSection } from './ReviewSummary.js';
import { ReviewPlayer, reviewClocks } from './ReviewPlayer.js';
import { StructureBreaks, StructurePlans } from './StructureAdvice.js';
import type { ReviewController } from '../hooks/useGameReview.js';
import type { Orientation } from '../hooks/useChessGame.js';

const TAG_LABELS: Record<MoveTag, string> = {
  sacrifice: 'Sacrifice',
  'only-move': 'Only move',
  critical: 'Critical moment',
  'time-pressure': 'Time pressure',
};

interface ReviewViewProps {
  controller: ReviewController;
  /** The line on the explore board, so "review what I just played" needs no clipboard. */
  currentGamePgn: string | null;
  /** Reviews that line straight away, without a trip through the paste box. */
  onReviewBoardGame: () => void;
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

  const structure = structureFor(match);
  const breaks = breaksFor(match, fen).filter((brk) => brk.side === toMove);

  return (
    <div className="review-detail__structure">
      <h3>{structure.name}</h3>
      <p className="muted">Typical plans for this pawn structure; choose them with the pieces and king safety in mind.</p>
      <StructurePlans structure={structure} firstSide={toMove} />
      <h4>{toMove === 'white' ? 'White' : 'Black'} breaks to prepare</h4>
      <StructureBreaks breaks={breaks} />
      {structure.endgameNote && (
        <p className="structure__endgame"><strong>Endgame:</strong> {structure.endgameNote}</p>
      )}
    </div>
  );
}

/**
 * The verdict, stuck to the square the move landed on, so the board alone says
 * what kind of move this was.
 *
 * The destination comes off the UCI, which is right for the awkward cases too:
 * castling is `e1g1`, so the sticker lands on the king rather than the rook,
 * and a promotion's `a7a8q` still points at a8.
 *
 * Nothing is shown while the engine's suggestion is on the board — the same
 * rule the last-move highlight follows. That position is the one *before* the
 * move, so there is nothing yet to pass judgement on.
 */
export function moveBadge(move: ReviewedMove | null, showingBefore: boolean): SquareBadge | null {
  if (!move || showingBefore) return null;
  return {
    square: move.uci.slice(2, 4),
    symbol: QUALITY_SYMBOLS[move.quality],
    label: QUALITY_LABELS[move.quality],
    className: qualityClass(move.quality),
  };
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
    <section className={`panel review-detail q--${move.quality}`}>
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
  onReviewBoardGame,
}: {
  review: GameReview;
  annotationThickness?: AnnotationThickness;
  onReset: () => void;
  /** Offered when the explore board holds a line — usually a longer one than this report covers. */
  onReviewBoardGame?: (() => void) | undefined;
}) {
  const [tree, setTree] = useState(() => newReviewTree(review));
  const [replaying, setReplaying] = useState(true);
  const [section, setSection] = useState<ReviewSection>('overview');
  const [showBest, setShowBest] = useState(false);
  const [orientation, setOrientation] = useState<Orientation>('white');

  // A fresh report starts at the first thing worth looking at, not at move one.
  useEffect(() => {
    const worst = keyMoments(review, 1)[0];
    setTree(selectReviewPly(newReviewTree(review), worst?.ply ?? 0, review.moves.length));
    setReplaying(true);
    setSection('overview');
    setShowBest(false);
  }, [review]);

  const inBranch = tree.selected > review.moves.length;
  const selectedPly = reviewAnchor(tree, review.moves.length);
  const move = !inBranch && selectedPly > 0 ? (review.moves[selectedPly - 1] ?? null) : null;
  const alternative = move?.best && move.best.uci !== move.uci ? move.best : null;
  const showingBefore = showBest && alternative !== null && move !== null;
  const game = useMemo(() => showingBefore ? new Chess(move!.fenBefore) : positionAt(tree), [tree, showingBefore, move]);
  const fen = game.fen();
  const controller = useEngine(fen);
  const engine = { ...controller, analysis: controller.analysis?.fen === fen ? controller.analysis : null };
  const score = showingBefore ? move!.scoreBefore : (move?.scoreAfter ?? review.moves[0]?.scoreBefore ?? { cp: 0, mate: null });
  const node = tree.nodes[tree.selected]!;
  const played = node.parent === null ? null : positionAt(tree, node.parent).move(node.san);
  const lastMove = !showingBefore && played ? { from: played.from, to: played.to } : null;
  const hintArrows = showingBefore && alternative
    ? [{ from: alternative.uci.slice(0, 2), to: alternative.uci.slice(2, 4) }]
    : node.shapes.arrows;
  const badge = moveBadge(move, showingBefore);
  const clocks = reviewClocks(review, showingBefore ? selectedPly - 1 : selectedPly);
  const hasClockData = !inBranch && review.moves.some((entry) => entry.clockSeconds !== null);
  const topColor = orientation === 'white' ? 'b' : 'w';
  const bottomColor = orientation === 'white' ? 'w' : 'b';
  const line = selectedLine(tree);
  const cursor = nodePath(tree).length;
  const atStart = tree.selected === 0;
  const atEnd = node.children.length === 0;

  const selectNode = useCallback((id: number) => {
    setSection('moves');
    setShowBest(false);
    setReplaying(true);
    setTree((current) => selectTreeNode(current, id));
  }, []);
  const selectPly = useCallback((ply: number) => {
    setSection('moves');
    setShowBest(false);
    setReplaying(true);
    setTree((current) => selectReviewPly(current, ply, review.moves.length));
  }, [review.moves.length]);
  const step = useCallback((delta: number) => {
    setSection('moves');
    setShowBest(false);
    setReplaying(true);
    setTree((current) => {
      const path = selectedLine(current);
      const index = Math.max(0, Math.min(path.length, nodePath(current).length + delta));
      return selectTreeNode(current, path[index - 1] ?? 0);
    });
  }, []);
  const play = (from: string, to: string, promotion?: PieceSymbol) => {
    const input = { from, to, promotion };
    const origin = showingBefore ? selectReviewPly(tree, selectedPly - 1, review.moves.length) : tree;
    const next = playTreeMove(origin, input);
    if (next === origin) return;
    setTree(next);
    setShowBest(false);
    setReplaying(false);
    setSection('moves');
    if (next.selected > review.moves.length && !engine.enabled) engine.toggle();
  };
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement && event.target.closest('input, textarea, select, button, summary, [contenteditable="true"]')) {
        return;
      }
      if (event.key === 'ArrowLeft') step(-1);
      else if (event.key === 'ArrowRight') step(1);
      else if (event.key === 'ArrowUp') selectNode(0);
      else if (event.key === 'ArrowDown') selectNode(line.at(-1) ?? 0);
      else if (event.key === 'Escape') selectPly(selectedPly);
      else if (event.key === 'f') setOrientation((o) => (o === 'white' ? 'black' : 'white'));
      else return;
      event.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [line, selectedPly, selectPly, selectNode, step]);

  const moments = useMemo(() => keyMoments(review), [review]);
  const showClocks = hasClockData || review.moves.some((entry) => entry.secondsSpent !== null);

  return (
    <main className="app__body review-report">
      <header className="review-report__heading">
        <div><span className="review-eyebrow">Learn from every move</span><h2>Game review</h2></div>
        <div className="review-actions">
          <button type="button" onClick={onReset}>Review another game</button>
          {onReviewBoardGame && <button type="button" onClick={onReviewBoardGame}>Review the board again</button>}
        </div>
      </header>
      <div className="app__board">
        <ReviewPlayer review={review} color={topColor} seconds={clocks[topColor]} showClock={hasClockData} active={game.turn() === topColor} />
        <div className="board-row">
          <EvalBar
            engine={engine}
            reading={inBranch ? null : { fraction: winPercent(score) / 100, label: formatScore(score) }}
            orientation={orientation}
          />
          <Board
            game={game}
            orientation={orientation}
            lastMove={lastMove}
            onMove={play}
            replay={replaying}
            animateMoves
            hintArrows={hintArrows}
            hintCircles={!showingBefore ? node.shapes.circles : undefined}
            badge={badge}
            {...(annotationThickness ? { annotationThickness } : {})}
          />
        </div>
        <ReviewPlayer review={review} color={bottomColor} seconds={clocks[bottomColor]} showClock={hasClockData} active={game.turn() === bottomColor} />

        <div className="board-bar">
          <span className="status">
            {inBranch
              ? `Analysis · ${played?.san ?? ''} · ${game.turn() === 'w' ? 'White' : 'Black'} to move`
              : move
              ? `${move.moveNumber}${move.color === 'w' ? '.' : '…'} ${move.san} — ${QUALITY_LABELS[move.quality]}`
              : 'Starting position'}
          </span>
          <div className="nav">
            <button type="button" aria-label="Starting position" onClick={() => selectNode(0)} disabled={atStart}>
              ⏮
            </button>
            <MoveStepButton type="button" aria-label="Previous move" onStep={() => step(-1)} disabled={atStart}>
              ◀
            </MoveStepButton>
            <MoveStepButton
              type="button"
              aria-label="Next move"
              onStep={() => step(1)}
              disabled={atEnd}
            >
              ▶
            </MoveStepButton>
            <button
              type="button"
              aria-label="Final position"
              onClick={() => selectNode(line.at(-1) ?? 0)}
              disabled={atEnd}
            >
              ⏭
            </button>
          </div>
          <button type="button" onClick={() => setOrientation((o) => (o === 'white' ? 'black' : 'white'))}>
            Flip
          </button>
        </div>
        <p className="muted review-analysis-help">Play any move to explore a side branch. The imported game stays the main line.</p>
        {inBranch && <button type="button" onClick={() => selectPly(selectedPly)}>Back to the game</button>}
      </div>
      <aside className="app__side">
        <ReviewSummary
          review={review}
          section={section}
          onSectionChange={setSection}
          analysis={<>
            <section className="moves">
              <div className="review-section-heading"><h3>Moves & variations</h3><span className="muted">{inBranch ? `Analysis · ply ${cursor}` : `${selectedPly} / ${review.moves.length} plies`}</span></div>
              <ReviewMoveList
                moves={review.moves}
                selectedPly={inBranch ? -1 : selectedPly}
                tree={tree}
                onSelectNode={selectNode}
                onSelect={selectPly}
                showClocks={showClocks}
              />
            </section>
            {move && (
              <MoveDetail
                move={move}
                fen={fen}
                showBest={showBest}
                onToggleBest={() => setShowBest((v) => !v)}
              />
            )}
            {!move && !inBranch && <div className="panel review-detail review-detail--empty"><h3>Every move has a story</h3><p className="muted">Select a move or a point on the graph to explore it. Use ← and → to step through the game.</p></div>}
            {inBranch && <StructureNote fen={fen} toMove={game.turn() === 'w' ? 'white' : 'black'} />}
            <EnginePanel engine={engine} />
          </>}
          moments={<>
            {moments.length > 0 && (
              <section className="panel review-moments">
                <div className="panel__head">
                  <div className="panel__title">
                    <h2>Turning points</h2>
                    <span className="review-chip">{moments.length} to revisit</span>
                  </div>
                </div>
                <ul>
                  {moments.map((moment) => (
                    <li key={moment.ply}>
                      <button
                        type="button"
                        onClick={() => selectPly(moment.ply)}
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
          </>}
        >
          <ReviewGraph review={review} selectedPly={selectedPly} onSelect={selectPly} />
        </ReviewSummary>
      </aside>
    </main>
  );
}

/**
 * The report itself, split out so it can be rendered from a canned review in
 * the tests without standing up an engine.
 */

/**
 * The review mode. A game goes in — pasted, opened from a file, or simply the
 * moves sitting on the explore board — and what comes back is the same report
 * chess.com gives: accuracy for both sides, split by phase, with every move
 * labelled and the turning points listed first.
 */
export function ReviewView({
  controller,
  currentGamePgn,
  onReviewBoardGame,
  annotationThickness,
}: ReviewViewProps) {
  if (!controller.review) {
    return (
      <main className="app__body app__body--single review-entry">
        <ReviewSetup
          controller={controller}
          currentGamePgn={currentGamePgn}
          onReviewBoardGame={onReviewBoardGame}
        />
      </main>
    );
  }

  return (
    <ReviewReport
      review={controller.review}
      {...(annotationThickness ? { annotationThickness } : {})}
      onReset={controller.clear}
      onReviewBoardGame={currentGamePgn ? onReviewBoardGame : undefined}
    />
  );
}
