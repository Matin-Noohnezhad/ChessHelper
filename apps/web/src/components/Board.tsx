import { createContext, useContext, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { Chess, PieceSymbol, SquareContents } from '@coh/chess-core';
import { reverseCapture, smartCandidates, SmartMoveEngine } from '../smartMoves.js';
import { Piece } from './Piece.js';
import { AnnotationArrow, AnnotationSquare, AnnotationStyleContext, LastMoveArrowContext } from './BoardAnnotations.js';
import type { AnnotationThickness, DrawColor } from './BoardAnnotations.js';
import { movementDuration, movementFrames, movementPlan } from '../boardAnimation.js';
import type { AnimationPosition } from '../boardAnimation.js';
import { useBoardAnimationSettings, useReducedMotion } from './BoardAnimationContext.js';
import { useBoardSoundSettings } from './BoardSoundContext.js';
import { playBoardSound } from '../sound.js';
import type { BoardSound } from '../sound.js';
import type { Orientation } from '../hooks/useChessGame.js';

export { ANNOTATION_THICKNESS_OPTIONS } from './BoardAnnotations.js';
export type { AnnotationThickness } from './BoardAnnotations.js';

const FILES = 'abcdefgh';
export const BoardCoordinatesContext = createContext(true);
const PROMOTION_CHOICES: PieceSymbol[] = ['q', 'r', 'b', 'n'];

/** Board squares in reading order for the given orientation. */
function squareNames(orientation: Orientation): string[] {
  const names: string[] = [];
  for (let rank = 8; rank >= 1; rank--) {
    for (let file = 0; file < 8; file++) names.push(FILES[file]! + rank);
  }
  return orientation === 'white' ? names : [...names].reverse();
}

interface DrawArrow {
  from: string;
  to: string;
  color: DrawColor;
}

interface DrawCircle {
  square: string;
  color: DrawColor;
}

/** Which annotation color a right-click draws, keyed like lichess: plain/shift/ctrl/alt. */
function colorForModifiers(event: { shiftKey: boolean; ctrlKey: boolean; altKey: boolean; metaKey: boolean }): DrawColor {
  if (event.altKey) return 'yellow';
  if (event.ctrlKey || event.metaKey) return 'blue';
  if (event.shiftKey) return 'red';
  return 'green';
}

/** Percentage-space center of a square, respecting board orientation. */
function squareCenter(square: string, orientation: Orientation): { x: number; y: number } {
  const file = FILES.indexOf(square[0]!);
  const rank = Number(square[1]);
  let col = file;
  let row = 8 - rank;
  if (orientation === 'black') {
    col = 7 - col;
    row = 7 - row;
  }
  return { x: (col + 0.5) * 12.5, y: (row + 0.5) * 12.5 };
}

/** An arrow the app draws itself, e.g. the engine's move in a review. */
export interface BoardArrow {
  from: string;
  to: string;
  color?: DrawColor;
}

export interface SquareMark {
  square: string;
  kind: 'key' | 'break';
  label?: string;
}

/**
 * A sticker pinned to a square, chess.com-style: the verdict on the move that
 * just landed there, readable without looking away from the board.
 *
 * Deliberately says nothing about move categories — the board does not know
 * what a review is. The caller brings the glyph, the words and the colour.
 */
export interface SquareBadge {
  square: string;
  /** The glyph inside the disc. One or two characters; anything longer will not fit. */
  symbol: string;
  /** What the glyph means, for the tooltip and for screen readers. */
  label: string;
  /** Carries the colour, e.g. `q q--sacrifice`. */
  className?: string;
}

/** Layout effects warn under server rendering, where there is nothing to lay out. */
const useVisualEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

interface BoardProps {
  game: Chess;
  orientation: Orientation;
  lastMove: { from: string; to: string } | null;
  onMove: (from: string, to: string, promotion?: PieceSymbol) => void;
  interactive?: boolean;
  /** Squares the study panel wants to point at (key squares, break targets). */
  marks?: SquareMark[];
  /** Arrows drawn by the app rather than the user; cleared with the position, not by clicking. */
  hintArrows?: BoardArrow[];
  /** Circled squares drawn by the app rather than the user; cleared with the position. */
  hintCircles?: { square: string; color?: DrawColor }[];
  /** The verdict on the move that reached this position, stuck to the square it landed on. */
  badge?: SquareBadge | null;
  /** Stroke weight for drawn arrows and square marks; defaults to 'medium'. */
  annotationThickness?: AnnotationThickness;
  /**
   * Slide the piece into place when the position changes under the board.
   *
   * Off by default. Clicked moves and single steps forward or back can slide;
   * dragged pieces are already at their destination and skip the animation.
   */
  animateMoves?: boolean;
  /** Smart entry is opt-in per board, so training remains a manual exercise. */
  moveEntryMode?: 'smart' | 'select';
  /**
   * The position changed by stepping through moves already played — back,
   * forward, or a jump in a move list — rather than by a new move.
   *
   * Read on the render the position changes. Replayed moves are silent unless
   * the replay-sound setting is on; new moves always sound.
   */
  replay?: boolean;
}

interface Pending {
  from: string;
  to: string;
}

interface Drag {
  square: string;
  x: number;
  y: number;
  originX: number;
  originY: number;
  active: boolean;
}

export function Board({
  game,
  orientation,
  lastMove,
  onMove,
  interactive = true,
  marks = [],
  hintArrows = [],
  hintCircles = [],
  badge = null,
  annotationThickness = 'medium',
  animateMoves = false,
  moveEntryMode = 'select',
  replay = false,
}: BoardProps) {
  const showCoordinates = useContext(BoardCoordinatesContext);
  const annotationStyle = useContext(AnnotationStyleContext);
  const { showLastMoveArrow, lastMoveArrowColor } = useContext(LastMoveArrowContext);
  const [lastMoveArrowDismissed, setLastMoveArrowDismissed] = useState(false);
  const animationSettings = useBoardAnimationSettings();
  const { movementStyle, movementSpeed } = animationSettings;
  const duration = movementDuration(animationSettings);
  const reducedMotion = useReducedMotion();
  const moveFrom = lastMove?.from;
  const moveTo = lastMove?.to;
  const { volume: soundVolume, style: soundStyle, replay: replaySounds } = useBoardSoundSettings();
  const boardRef = useRef<HTMLDivElement>(null);
  const smartEngine = useRef<SmartMoveEngine | null>(null);
  const smartRequest = useRef<AbortController | null>(null);
  const [smartBusy, setSmartBusy] = useState(false);
  const [smartError, setSmartError] = useState<string | null>(null);
  const cancelSmartMove = useCallback(() => {
    smartRequest.current?.abort();
    smartRequest.current = null;
    setSmartBusy(false);
    setSmartError(null);
  }, []);
  useEffect(() => {
    if (!interactive || moveEntryMode !== 'smart') return;
    const engine = new SmartMoveEngine();
    smartEngine.current = engine;
    engine.warmup();
    return () => {
      engine.dispose();
      if (smartEngine.current === engine) smartEngine.current = null;
    };
  }, [interactive, moveEntryMode]);
  const [selected, setSelected] = useState<string | null>(null);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const [arrows, setArrows] = useState<DrawArrow[]>([]);
  const [circles, setCircles] = useState<DrawCircle[]>([]);
  const [drawStart, setDrawStart] = useState<{ square: string; color: DrawColor } | null>(null);
  const [drawCurrent, setDrawCurrent] = useState<string | null>(null);
  const animationPosition = useRef<(AnimationPosition & { orientation: Orientation }) | null>(null);
  const draggedMove = useRef<string | null>(null);

  const names = useMemo(() => squareNames(orientation), [orientation]);

  /**
   * Everything below is derived from the *position*, so that is what it is keyed
   * on — not the identity of the `Chess` holding it.
   *
   * The explore board builds a fresh game from the move list on every render, so
   * identity would do there. The trainers do not: they own one board and make
   * moves on it, handing back the same object with different pieces on it. Keyed
   * on identity, a memo cannot tell that apart from nothing having happened, and
   * the board silently stops redrawing after the first move.
   */
  const fen = game.fen();

  // Manual drawing hides only this position's move arrow. A new move or a
  // navigation step restores it; clearing marks or flipping the board does not.
  useVisualEffect(() => {
    setLastMoveArrowDismissed(false);
  }, [fen, moveFrom, moveTo]);

  useVisualEffect(() => {
    cancelSmartMove();
    return () => { smartRequest.current?.abort(); };
  }, [fen, orientation, interactive, moveEntryMode, cancelSmartMove]);

  // Position navigation and board flips must not leave a stale drag or promotion.
  useEffect(() => {
    setSelected(null);
    setDrag(null);
    setPending(null);
    setArrows([]);
    setCircles([]);
    setDrawStart(null);
    setDrawCurrent(null);
  }, [fen, orientation, interactive, moveEntryMode]);

  const contents = useMemo(() => {
    // game.board() is always a8..h1; index it by square name so the rendering
    // order and the data order can differ without a second source of truth.
    const map = new Map<string, SquareContents>();
    const cells = game.board();
    const straight = squareNames('white');
    cells.forEach((cell, i) => {
      if (cell) map.set(straight[i]!, cell);
    });
    return map;
  }, [game, fen]);

  // Validate the entire transition so resets and jumps cannot animate unrelated pieces.
  // Web Animations start before paint and are cancelled when navigation interrupts a move.
  useVisualEffect(() => {
    const move = moveFrom && moveTo ? { from: moveFrom, to: moveTo } : null;
    const previous = animationPosition.current;
    animationPosition.current = { fen, orientation, lastMove: move };
    const dragKey = draggedMove.current;
    draggedMove.current = null;
    if (!animateMoves || !duration || reducedMotion || !previous || !boardRef.current ||
        previous.fen === fen || previous.orientation !== orientation) return;
    const moves = movementPlan(previous, { fen, lastMove: move });
    const rect = boardRef.current.getBoundingClientRect();
    const active: { animation: Animation; element: HTMLElement }[] = [];
    for (const move of moves) {
      if (dragKey === `${move.from}${move.to}`) continue;
      const element = boardRef.current.querySelector<HTMLElement>(`[data-square="${move.to}"] .piece-holder`);
      if (!element?.animate) continue;
      const from = squareCenter(move.from, orientation);
      const to = squareCenter(move.to, orientation);
      const animation = element.animate(movementFrames(
        ((from.x - to.x) / 100) * rect.width,
        ((from.y - to.y) / 100) * rect.height,
        movementStyle,
      ), { duration, easing: 'linear' });
      element.classList.add('piece-slide');
      animation.onfinish = () => element.classList.remove('piece-slide');
      active.push({ animation, element });
    }
    return () => {
      for (const { animation, element } of active) {
        animation.cancel();
        element.classList.remove('piece-slide');
      }
    };
  }, [animateMoves, fen, moveFrom, moveTo, orientation, duration, movementStyle, movementSpeed, reducedMotion]);

  const previousPosition = useRef<{ fen: string; pieces: Map<string, SquareContents> } | null>(null);
  useEffect(() => {
    const previous = previousPosition.current;
    previousPosition.current = { fen, pieces: contents };
    if (!previous || previous.fen === fen || (replay && !replaySounds)) return;

    const changed = names.filter((square) => {
      const before = previous.pieces.get(square);
      const after = contents.get(square);
      return before?.type !== after?.type || before?.color !== after?.color;
    }).length;
    if (changed < 2 || changed > 4) return;

    const before = lastMove ? previous.pieces.get(lastMove.from) : undefined;
    const after = lastMove ? contents.get(lastMove.to) : undefined;
    // Stepping backward has no forward mover at lastMove.from. Give it the
    // plain board click; the richer sounds describe moves that just landed.
    const forward = !!before && !!after && before.color === after.color;
    const capture = forward && (previous.pieces.size > contents.size ||
      !!previous.pieces.get(lastMove!.to));
    const castle = forward && before.type === 'k' &&
      Math.abs(FILES.indexOf(lastMove!.from[0]!) - FILES.indexOf(lastMove!.to[0]!)) === 2;
    const kind: BoardSound = !forward ? 'move'
      : game.isCheckmate() ? 'mate'
      : game.isCheck() ? 'check'
      : forward && before.type === 'p' && after.type !== 'p' ? 'promotion'
      : castle ? 'castle'
      : capture ? 'capture'
      : 'move';
    playBoardSound(kind, soundVolume, soundStyle);
  }, [fen, contents, lastMove, game, names, soundVolume, soundStyle, replay, replaySounds]);

  const targets = useMemo(() => {
    if (!selected || !interactive) return new Map<string, boolean>();
    const map = new Map<string, boolean>();
    if (contents.get(selected)?.color === game.turn()) {
      for (const move of game.movesFrom(selected)) map.set(move.to, move.isCapture);
    } else {
      for (const move of smartCandidates(game, selected)) map.set(move.from, move.isCapture);
    }
    return map;
  }, [game, fen, selected, interactive, contents]);

  const checkSquare = useMemo(() => {
    if (!game.isCheck()) return null;
    const turn = game.turn();
    for (const [square, piece] of contents) {
      if (piece.type === 'k' && piece.color === turn) return square;
    }
    return null;
  }, [game, fen, contents]);

  const markBySquare = useMemo(() => {
    const map = new Map<string, SquareMark>();
    for (const mark of marks) map.set(mark.square, mark);
    return map;
  }, [marks]);

  const squareAtPoint = useCallback(
    (clientX: number, clientY: number): string | null => {
      const rect = boardRef.current?.getBoundingClientRect();
      if (!rect) return null;
      const col = Math.floor(((clientX - rect.left) / rect.width) * 8);
      const row = Math.floor(((clientY - rect.top) / rect.height) * 8);
      if (col < 0 || col > 7 || row < 0 || row > 7) return null;
      return names[row * 8 + col] ?? null;
    },
    [names],
  );

  /** Plays from -> to, first asking which piece to promote to if needed. */
  const attemptMove = useCallback(
    (from: string, to: string) => {
      const options = game.movesFrom(from).filter((m) => m.to === to);
      if (!options.length) return false;
      if (options[0]!.isPromotion) {
        setPending({ from, to });
        return true;
      }
      onMove(from, to);
      return true;
    },
    [game, onMove],
  );

  const playSmartMove = useCallback(async (square: string) => {
    cancelSmartMove();
    const candidates = smartCandidates(game, square);
    if (!candidates.length) return;
    if (candidates.length === 1) {
      const move = candidates[0]!;
      setSelected(null);
      onMove(move.from, move.to, move.promotion);
      return;
    }
    const controller = new AbortController();
    smartRequest.current = controller;
    setSmartBusy(true);
    try {
      smartEngine.current ??= new SmartMoveEngine();
      const move = await smartEngine.current.choose(fen, candidates, controller.signal);
      if (controller.signal.aborted || smartRequest.current !== controller) return;
      setSelected(null);
      onMove(move.from, move.to, move.promotion);
    } catch {
      if (!controller.signal.aborted) setSmartError('Smart move unavailable. Choose a highlighted destination or drag to move.');
    } finally {
      if (smartRequest.current === controller) {
        smartRequest.current = null;
        setSmartBusy(false);
      }
    }
  }, [game, fen, onMove, cancelSmartMove]);

  const toggleDrawing = useCallback((from: string, to: string, color: DrawColor) => {
    setLastMoveArrowDismissed(true);
    if (from === to) {
      setCircles((prev) => {
        const existing = prev.find((c) => c.square === from);
        if (existing?.color === color) return prev.filter((c) => c.square !== from);
        if (existing) return prev.map((c) => (c.square === from ? { square: from, color } : c));
        return [...prev, { square: from, color }];
      });
      return;
    }
    setArrows((prev) => {
      const existing = prev.find((a) => a.from === from && a.to === to);
      if (existing?.color === color) return prev.filter((a) => !(a.from === from && a.to === to));
      if (existing) return prev.map((a) => (a.from === from && a.to === to ? { from, to, color } : a));
      return [...prev, { from, to, color }];
    });
  }, []);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent, square: string) => {
      cancelSmartMove();
      if (event.button === 2) {
        event.preventDefault();
        setDrawStart({ square, color: colorForModifiers(event) });
        setDrawCurrent(square);
        event.currentTarget.setPointerCapture?.(event.pointerId);
        return;
      }
      if (event.button !== 0) return;
      // Any left-button interaction starts a fresh selection, so clear old annotations first.
      if (arrows.length || circles.length) {
        setArrows([]);
        setCircles([]);
      }
      if (!interactive || pending) return;
      const piece = contents.get(square);
      const isOwn = piece?.color === game.turn();

      if (selected && selected !== square && !isOwn && contents.get(selected)?.color === game.turn()) {
        if (attemptMove(selected, square)) { setSelected(null); return; }
      }
      if (selected && isOwn && contents.get(selected)?.color !== game.turn()) {
        const reverse = reverseCapture(game, selected, square);
        if (reverse && attemptMove(reverse.from, reverse.to)) { setSelected(null); return; }
      }
      if (!piece && moveEntryMode !== 'smart') {
        setSelected(null);
        return;
      }

      setSelected(square);
      setDrag({ square, x: event.clientX, y: event.clientY,
        originX: event.clientX, originY: event.clientY, active: false });
      event.currentTarget.setPointerCapture?.(event.pointerId);
    },
    [interactive, pending, contents, game, selected, attemptMove, arrows, circles, cancelSmartMove, moveEntryMode],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent) => {
      if (drag) setDrag({ ...drag, x: event.clientX, y: event.clientY,
        active: drag.active || Math.hypot(event.clientX - drag.originX, event.clientY - drag.originY) > 5 });
      if (drawStart) setDrawCurrent(squareAtPoint(event.clientX, event.clientY));
    },
    [drag, drawStart, squareAtPoint],
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent) => {
      if (drawStart) {
        const end = squareAtPoint(event.clientX, event.clientY);
        if (end) toggleDrawing(drawStart.square, end, drawStart.color);
        setDrawStart(null);
        setDrawCurrent(null);
        return;
      }
      if (!drag) return;
      const target = squareAtPoint(event.clientX, event.clientY);
      const from = drag.square;
      setDrag(null);
      if (!drag.active && target === from) {
        if (moveEntryMode === 'smart') void playSmartMove(from);
        return;
      }
      if (!target || target === from || !game.pieceAt(from)) return;
      const reverse = reverseCapture(game, from, target);
      const source = reverse?.from ?? from;
      const destination = reverse?.to ?? target;
      // Reverse captures animate the actual attacker toward the victim.
      draggedMove.current = reverse ? null : `${source}${destination}`;
      if (attemptMove(source, destination)) setSelected(null);
      else draggedMove.current = null;
    },
    [drag, drawStart, squareAtPoint, attemptMove, toggleDrawing, game, moveEntryMode, playSmartMove],
  );

  const finishPromotion = useCallback(
    (piece: PieceSymbol) => {
      if (!pending) return;
      onMove(pending.from, pending.to, piece);
      setPending(null);
      setSelected(null);
    },
    [pending, onMove],
  );

  const dragPiece = drag ? contents.get(drag.square) : undefined;
  const dropSquare = drag?.active ? squareAtPoint(drag.x, drag.y) : null;

  const previewArrow: DrawArrow | null =
    drawStart && drawCurrent && drawCurrent !== drawStart.square
      ? { from: drawStart.square, to: drawCurrent, color: drawStart.color }
      : null;
  const previewCircle: DrawCircle | null =
    drawStart && drawCurrent === drawStart.square
      ? { square: drawStart.square, color: drawStart.color }
      : null;

  return (
    <div className="board-wrap">
      <div
        className={`board${interactive ? ' board--interactive' : ''}`}
        aria-label={`Chessboard, ${orientation} at bottom`}
        ref={boardRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          setDrag(null);
          setDrawStart(null);
          setDrawCurrent(null);
        }}
        onContextMenu={(event) => event.preventDefault()}
      >
        {names.map((square, index) => {
          const file = index % 8;
          const rank = Math.floor(index / 8);
          const dark = (file + rank) % 2 === 1;
          const piece = contents.get(square);
          const mark = markBySquare.get(square);
          const classes = [
            'square',
            dark ? 'square--dark' : 'square--light',
            selected === square ? 'square--selected' : '',
            dropSquare === square && targets.has(square) ? 'square--drop' : '',
            lastMove?.from === square ? 'square--last-from' : '',
            lastMove?.to === square ? 'square--last-to' : '',
            checkSquare === square ? 'square--check' : '',
            mark ? `square--mark square--mark-${mark.kind}` : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <div
              key={square}
              className={classes}
              data-square={square}
              onPointerDown={(e) => handlePointerDown(e, square)}
            >
              {piece && (
                <span className="piece-holder">
                  <Piece
                    type={piece.type}
                    color={piece.color}
                    dragging={drag?.active && drag.square === square}
                  />
                </span>
              )}
              {targets.has(square) && (
                <span className={targets.get(square) ? 'target target--capture' : 'target'} />
              )}
              {badge?.square === square && (
                <span
                  className={`square-badge ${badge.className ?? ''}`}
                  title={badge.label}
                  aria-label={badge.label}
                >
                  {badge.symbol}
                </span>
              )}
              {mark?.label && <span className="square-label">{mark.label}</span>}
              {showCoordinates && file === 0 && <span className="coord coord--rank" aria-hidden="true">{square[1]}</span>}
              {showCoordinates && rank === 7 && <span className="coord coord--file" aria-hidden="true">{square[0]}</span>}
            </div>
          );
        })}

        <svg className="board-draw" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {showLastMoveArrow && lastMove && !lastMoveArrowDismissed && !drawStart && (
            <g data-last-move-arrow={`${lastMove.from}${lastMove.to}`}>
              <AnnotationArrow from={squareCenter(lastMove.from, orientation)} to={squareCenter(lastMove.to, orientation)}
                color={lastMoveArrowColor} style={annotationStyle} thickness={annotationThickness} />
            </g>
          )}
          {[
            ...hintArrows.map((arrow) => ({ ...arrow, color: arrow.color ?? 'blue' })),
            ...arrows,
            ...(previewArrow ? [previewArrow] : []),
          ].map((arrow, i) => (
            <AnnotationArrow key={`arrow-${arrow.from}-${arrow.to}-${i}`}
              from={squareCenter(arrow.from, orientation)} to={squareCenter(arrow.to, orientation)}
              color={arrow.color} style={annotationStyle} thickness={annotationThickness} />
          ))}
          {[
            ...hintCircles.map((circle) => ({ ...circle, color: circle.color ?? 'green' })),
            ...circles,
            ...(previewCircle ? [previewCircle] : []),
          ].map((circle, i) => (
            <AnnotationSquare key={`circle-${circle.square}-${i}`} center={squareCenter(circle.square, orientation)}
              color={circle.color} style={annotationStyle} thickness={annotationThickness} />
          ))}
        </svg>

        {pending && (
          <div className="promotion" role="dialog" aria-label="Choose promotion piece">
            <div className="promotion__inner">
              <p>Promote to</p>
              <div className="promotion__choices">
                {PROMOTION_CHOICES.map((choice) => (
                  <button key={choice} type="button" onClick={() => finishPromotion(choice)}
                    aria-label={`Promote to ${{ q: 'queen', r: 'rook', b: 'bishop', n: 'knight', p: 'pawn', k: 'king' }[choice]}`}>
                    <Piece type={choice} color={game.turn()} />
                  </button>
                ))}
              </div>
              <button className="promotion__cancel" type="button" onClick={() => setPending(null)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {drag?.active && dragPiece && (
        <div className="drag-layer" style={{ left: drag.x, top: drag.y }}>
          <Piece type={dragPiece.type} color={dragPiece.color} />
        </div>
      )}

      {(smartBusy || smartError) && <p className="board-smart-status" role="status">
        {smartBusy ? 'Choosing a move…' : smartError}
      </p>}
      <details className="board-hint">
        <summary>Board controls</summary>
        <p>{moveEntryMode === 'smart'
          ? 'Click a piece to play its best capture, or its best move if no capture is available. Click an empty square to move the best eligible piece there. Click an opponent’s piece to capture it. Drag to choose a specific move.'
          : 'Click a piece and its destination, or drag to move.'}
          {' '}Drag an opponent’s piece onto your piece to capture it in reverse. Right-click drag to draw an arrow;
          right-click a square to mark it. Hold <kbd>Shift</kbd> for red, <kbd>Ctrl</kbd> for blue,
          or <kbd>Alt</kbd> for yellow.</p>
      </details>
    </div>
  );
}
