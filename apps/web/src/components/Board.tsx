import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { Chess, PieceSymbol, SquareContents } from '@coh/chess-core';
import { Piece } from './Piece.js';
import type { Orientation } from '../hooks/useChessGame.js';

const FILES = 'abcdefgh';
const PROMOTION_CHOICES: PieceSymbol[] = ['q', 'r', 'b', 'n'];

/** Board squares in reading order for the given orientation. */
function squareNames(orientation: Orientation): string[] {
  const names: string[] = [];
  for (let rank = 8; rank >= 1; rank--) {
    for (let file = 0; file < 8; file++) names.push(FILES[file]! + rank);
  }
  return orientation === 'white' ? names : [...names].reverse();
}

/** Right-click annotations, lichess-style: drag for an arrow, click for a rounded-square mark. */
type DrawColor = 'green' | 'red' | 'blue' | 'yellow';

const DRAW_COLORS: Record<DrawColor, string> = {
  green: 'rgba(21, 120, 27, 0.82)',
  red: 'rgba(200, 45, 45, 0.82)',
  blue: 'rgba(30, 100, 220, 0.82)',
  yellow: 'rgba(230, 158, 0, 0.85)',
};

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

/** Pulls the arrow's end point back toward its start so the arrowhead clears the target square's center. */
function shortenTowards(
  from: { x: number; y: number },
  to: { x: number; y: number },
  amount: number,
): { x: number; y: number } {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const ratio = Math.max(0, (len - amount) / len);
  return { x: from.x + dx * ratio, y: from.y + dy * ratio };
}

export type AnnotationThickness = 'thin' | 'medium' | 'thick' | 'extra';

/** Ordered for a settings picker; label is what the user sees. */
export const ANNOTATION_THICKNESS_OPTIONS: { key: AnnotationThickness; label: string }[] = [
  { key: 'thin', label: 'Thin' },
  { key: 'medium', label: 'Medium' },
  { key: 'thick', label: 'Thick' },
  { key: 'extra', label: 'Extra thick' },
];

const ANNOTATION_SCALE: Record<AnnotationThickness, { arrow: number; circle: number; marker: number }> = {
  thin: { arrow: 1.4, circle: 1.3, marker: 4.4 },
  medium: { arrow: 2.2, circle: 2, marker: 6 },
  thick: { arrow: 3.2, circle: 2.8, marker: 7.6 },
  extra: { arrow: 4.4, circle: 3.6, marker: 9.2 },
};

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

/**
 * A piece caught mid-move: it is already drawn on the square it arrived at, and
 * `dx`/`dy` are how far back toward its old square to start it before letting
 * it run home. Offsets are in pixels rather than percentages because a piece is
 * a text glyph — its own box is the width of the letter, not of the square.
 */
interface Slide {
  to: string;
  dx: number;
  dy: number;
  /** False on the frame that positions it, true on the one that releases it. */
  running: boolean;
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
  /** The verdict on the move that reached this position, stuck to the square it landed on. */
  badge?: SquareBadge | null;
  /** Stroke weight for drawn arrows and square marks; defaults to 'medium'. */
  annotationThickness?: AnnotationThickness;
  /**
   * Slide the piece into place when the position changes under the board.
   *
   * Off by default. On the explore board a move is something you just made and
   * an animation is in your way; when the board is playing a line *to* you, a
   * piece that teleports is a move you did not see happen.
   */
  animateMoves?: boolean;
}

interface Pending {
  from: string;
  to: string;
}

export function Board({
  game,
  orientation,
  lastMove,
  onMove,
  interactive = true,
  marks = [],
  hintArrows = [],
  badge = null,
  annotationThickness = 'medium',
  animateMoves = false,
}: BoardProps) {
  const annotationScale = ANNOTATION_SCALE[annotationThickness];
  const boardRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const [selected, setSelected] = useState<string | null>(null);
  const [drag, setDrag] = useState<{ square: string; x: number; y: number } | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const [arrows, setArrows] = useState<DrawArrow[]>([]);
  const [circles, setCircles] = useState<DrawCircle[]>([]);
  const [drawStart, setDrawStart] = useState<{ square: string; color: DrawColor } | null>(null);
  const [drawCurrent, setDrawCurrent] = useState<string | null>(null);
  const [slide, setSlide] = useState<Slide | null>(null);
  const slidFrom = useRef<string | null>(null);

  const names = useMemo(() => squareNames(orientation), [orientation]);

  /**
   * Catch the arriving piece and start it where it came from.
   *
   * Keyed on the origin square rather than on the pair: a piece being dragged
   * home by the person holding it has already visibly travelled, and re-running
   * the trip under it looks like a stutter. What this is for is the moves the
   * board makes on its own.
   */
  useVisualEffect(() => {
    if (!animateMoves) {
      slidFrom.current = null;
      return;
    }
    const key = lastMove ? `${lastMove.from}${lastMove.to}` : null;
    if (key === slidFrom.current) return;
    slidFrom.current = key;
    if (!lastMove || !boardRef.current) {
      setSlide(null);
      return;
    }
    const rect = boardRef.current.getBoundingClientRect();
    const from = squareCenter(lastMove.from, orientation);
    const to = squareCenter(lastMove.to, orientation);
    setSlide({
      to: lastMove.to,
      dx: ((from.x - to.x) / 100) * rect.width,
      dy: ((from.y - to.y) / 100) * rect.height,
      running: false,
    });
  }, [animateMoves, lastMove, orientation]);

  // A frame later, drop the offset and let the transition carry it across.
  useEffect(() => {
    if (!slide || slide.running) return;
    const frame = requestAnimationFrame(() =>
      setSlide((current) => (current && !current.running ? { ...current, running: true } : current)),
    );
    return () => cancelAnimationFrame(frame);
  }, [slide]);

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

  const targets = useMemo(() => {
    if (!selected || !interactive) return new Map<string, boolean>();
    const map = new Map<string, boolean>();
    for (const move of game.movesFrom(selected)) map.set(move.to, move.isCapture);
    return map;
  }, [game, fen, selected, interactive]);

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

  const toggleDrawing = useCallback((from: string, to: string, color: DrawColor) => {
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
      if (event.button === 2) {
        event.preventDefault();
        setDrawStart({ square, color: colorForModifiers(event) });
        setDrawCurrent(square);
        (event.target as Element).setPointerCapture?.(event.pointerId);
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

      if (selected && selected !== square && !isOwn) {
        if (attemptMove(selected, square)) setSelected(null);
        else setSelected(null);
        return;
      }
      if (!isOwn) {
        setSelected(null);
        return;
      }

      setSelected(square);
      setDrag({ square, x: event.clientX, y: event.clientY });
      (event.target as Element).setPointerCapture?.(event.pointerId);
    },
    [interactive, pending, contents, game, selected, attemptMove, arrows, circles],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent) => {
      if (drag) setDrag({ ...drag, x: event.clientX, y: event.clientY });
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
      // Releasing on the origin square means "select", not "move" — that is
      // what makes click-to-move and drag-to-move coexist.
      if (!target || target === from) return;
      if (attemptMove(from, target)) setSelected(null);
    },
    [drag, drawStart, squareAtPoint, attemptMove, toggleDrawing],
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
        className="board"
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
            lastMove && (lastMove.from === square || lastMove.to === square)
              ? 'square--last'
              : '',
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
                <span
                  className={slide?.to === square ? 'piece-slide' : undefined}
                  style={
                    slide?.to === square
                      ? {
                          transform: slide.running
                            ? 'none'
                            : `translate(${slide.dx}px, ${slide.dy}px)`,
                        }
                      : undefined
                  }
                >
                  <Piece
                    type={piece.type}
                    color={piece.color}
                    dragging={drag?.square === square}
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
              {file === 0 && <span className="coord coord--rank">{square[1]}</span>}
              {rank === 7 && <span className="coord coord--file">{square[0]}</span>}
            </div>
          );
        })}

        <svg className="board-draw" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            {(Object.keys(DRAW_COLORS) as DrawColor[]).map((color) => (
              <marker
                key={color}
                id={`${uid}-arrowhead-${color}`}
                viewBox="0 0 10 10"
                refX="8.5"
                refY="5"
                markerWidth={annotationScale.marker}
                markerHeight={annotationScale.marker}
                markerUnits="userSpaceOnUse"
                orient="auto"
              >
                <path d="M0,0 L10,5 L0,10 z" fill={DRAW_COLORS[color]} />
              </marker>
            ))}
          </defs>
          {[
            ...hintArrows.map((arrow) => ({ ...arrow, color: arrow.color ?? 'blue' })),
            ...arrows,
            ...(previewArrow ? [previewArrow] : []),
          ].map((arrow, i) => {
            const start = squareCenter(arrow.from, orientation);
            const end = shortenTowards(
              start,
              squareCenter(arrow.to, orientation),
              annotationScale.marker * 0.9,
            );
            return (
              <line
                key={`arrow-${arrow.from}-${arrow.to}-${i}`}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke={DRAW_COLORS[arrow.color]}
                strokeWidth={annotationScale.arrow}
                strokeLinecap="round"
                markerEnd={`url(#${uid}-arrowhead-${arrow.color})`}
              />
            );
          })}
          {[...circles, ...(previewCircle ? [previewCircle] : [])].map((circle, i) => {
            const { x, y } = squareCenter(circle.square, orientation);
            const side = 9.6; // a rounded square, not a full circle — squarish highlight with soft corners
            const radius = side * 0.32;
            return (
              <rect
                key={`circle-${circle.square}-${i}`}
                x={x - side / 2}
                y={y - side / 2}
                width={side}
                height={side}
                rx={radius}
                ry={radius}
                fill="none"
                stroke={DRAW_COLORS[circle.color]}
                strokeWidth={annotationScale.circle}
              />
            );
          })}
        </svg>

        {pending && (
          <div className="promotion" role="dialog" aria-label="Choose promotion piece">
            <div className="promotion__inner">
              <p>Promote to</p>
              <div className="promotion__choices">
                {PROMOTION_CHOICES.map((choice) => (
                  <button key={choice} type="button" onClick={() => finishPromotion(choice)}>
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

      {drag && dragPiece && (
        <div className="drag-layer" style={{ left: drag.x, top: drag.y }}>
          <Piece type={dragPiece.type} color={dragPiece.color} />
        </div>
      )}

      <p className="board-hint">
        Right-click drag to draw an arrow, right-click a square to mark it — hold{' '}
        <kbd>Shift</kbd> for red, <kbd>Ctrl</kbd> for blue, <kbd>Alt</kbd> for yellow.
      </p>
    </div>
  );
}
