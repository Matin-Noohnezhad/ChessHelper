import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Chess, PieceSymbol, SquareContents } from '@coh/chess-core';
import { Piece } from './Piece.js';
import { PieceDefs } from './pieces/shapes.js';
import { usePrefs } from '../theme/prefs.js';
import type { Orientation } from '../hooks/useChessGame.js';

const FILES = 'abcdefgh';
const RANKS = '87654321';
const PROMOTION_CHOICES: PieceSymbol[] = ['q', 'r', 'b', 'n'];

/** Board squares in reading order for the given orientation. */
function squareNames(orientation: Orientation): string[] {
  const names: string[] = [];
  for (let rank = 8; rank >= 1; rank--) {
    for (let file = 0; file < 8; file++) names.push(FILES[file]! + rank);
  }
  return orientation === 'white' ? names : [...names].reverse();
}

export interface SquareMark {
  square: string;
  kind: 'key' | 'break';
  label?: string;
}

/** A user-drawn annotation, the right-drag arrows and circles of ChessBase. */
interface Shape {
  from: string;
  to: string;
  color: ShapeColor;
}

type ShapeColor = 'green' | 'red' | 'blue' | 'yellow';

const SHAPE_COLORS: Record<ShapeColor, string> = {
  green: '#5aa02c',
  red: '#c33c2e',
  blue: '#3d7fc4',
  yellow: '#d9a520',
};

/** Modifier keys pick the pen colour, the convention every board app shares. */
function shapeColor(event: { shiftKey: boolean; ctrlKey: boolean; metaKey: boolean; altKey: boolean }): ShapeColor {
  if (event.shiftKey) return 'red';
  if (event.ctrlKey || event.metaKey) return 'blue';
  if (event.altKey) return 'yellow';
  return 'green';
}

interface BoardProps {
  game: Chess;
  orientation: Orientation;
  lastMove: { from: string; to: string } | null;
  onMove: (from: string, to: string, promotion?: PieceSymbol) => void;
  interactive?: boolean;
  /** Squares the study panel wants to point at (key squares, break targets). */
  marks?: SquareMark[];
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
}: BoardProps) {
  const { prefs } = usePrefs();
  const boardRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [drag, setDrag] = useState<{ square: string; x: number; y: number } | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const [hover, setHover] = useState<string | null>(null);

  const names = useMemo(() => squareNames(orientation), [orientation]);
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
  }, [game]);

  const targets = useMemo(() => {
    if (!selected || !interactive) return new Map<string, boolean>();
    const map = new Map<string, boolean>();
    for (const move of game.movesFrom(selected)) map.set(move.to, move.isCapture);
    return map;
  }, [game, selected, interactive]);

  const checkSquare = useMemo(() => {
    if (!game.isCheck()) return null;
    const turn = game.turn();
    for (const [square, piece] of contents) {
      if (piece.type === 'k' && piece.color === turn) return square;
    }
    return null;
  }, [game, contents]);

  const markBySquare = useMemo(() => {
    const map = new Map<string, SquareMark>();
    for (const mark of marks) map.set(mark.square, mark);
    return map;
  }, [marks]);

  /* ------------------------------------------------------- animation --- */

  const [anim, setAnim] = useState<{ square: string; dx: number; dy: number; key: number } | null>(
    null,
  );
  const seen = useRef<string>('');

  useEffect(() => {
    const id = lastMove ? `${lastMove.from}${lastMove.to}` : '';
    if (id === seen.current) return;
    seen.current = id;
    if (!lastMove || !prefs.animateMs) return;

    const from = names.indexOf(lastMove.from);
    const to = names.indexOf(lastMove.to);
    if (from < 0 || to < 0) return;
    // The piece is already rendered on its destination; it starts the frame
    // displaced by the distance it travelled and slides that offset away.
    setAnim({
      square: lastMove.to,
      dx: (from % 8) - (to % 8),
      dy: Math.floor(from / 8) - Math.floor(to / 8),
      key: Date.now(),
    });
    const timer = setTimeout(() => setAnim(null), prefs.animateMs + 40);
    return () => clearTimeout(timer);
  }, [lastMove, names, prefs.animateMs]);

  /* ------------------------------------------------------ annotations --- */

  const [shapes, setShapes] = useState<Shape[]>([]);
  const [pen, setPen] = useState<{ from: string; to: string; color: ShapeColor } | null>(null);

  // Drawings describe one position. Once a move is played they are stale, so
  // they clear the way ChessBase clears them on a move. Keyed on the move
  // itself rather than the object, which is re-created on every render.
  const lastMoveId = lastMove ? `${lastMove.from}${lastMove.to}` : '';
  useEffect(() => setShapes([]), [lastMoveId]);

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

  /** Adds a shape, or removes it when the same one is drawn twice. */
  const toggleShape = useCallback((shape: Shape) => {
    setShapes((prev) => {
      const at = prev.findIndex((s) => s.from === shape.from && s.to === shape.to);
      if (at === -1) return [...prev, shape];
      // Same squares, different colour: recolour rather than erase.
      if (prev[at]!.color !== shape.color) {
        const next = [...prev];
        next[at] = shape;
        return next;
      }
      return prev.filter((_, i) => i !== at);
    });
  }, []);

  /* ------------------------------------------------------------ moves --- */

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

  const handlePointerDown = useCallback(
    (event: React.PointerEvent, square: string) => {
      if (event.button === 2) {
        setPen({ from: square, to: square, color: shapeColor(event) });
        (event.target as Element).setPointerCapture?.(event.pointerId);
        return;
      }
      if (event.button !== 0) return;
      // Any left click on the board is a fresh start for the drawings.
      setShapes([]);
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
    [interactive, pending, contents, game, selected, attemptMove],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent) => {
      // Only tracked while something is in flight: hovering an idle board must
      // not re-render 64 squares per mouse move.
      if (!pen && !drag) return;
      const at = squareAtPoint(event.clientX, event.clientY);
      if (pen) {
        if (at && at !== pen.to) setPen({ ...pen, to: at });
        return;
      }
      setDrag({ ...drag!, x: event.clientX, y: event.clientY });
      setHover(at);
    },
    [drag, pen, squareAtPoint],
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent) => {
      if (pen) {
        toggleShape(pen);
        setPen(null);
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
    [drag, pen, squareAtPoint, attemptMove, toggleShape],
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
  const drawn = pen ? [...shapes.filter((s) => !(s.from === pen.from && s.to === pen.to)), pen] : shapes;
  const showCoords = prefs.coords;

  return (
    <div className="board-wrap">
      <PieceDefs />
      <div className={`board-frame board-frame--${showCoords}`}>
        {showCoords === 'outside' && (
          <>
            <div className="frame-coords frame-coords--rank">
              {(orientation === 'white' ? RANKS : [...RANKS].reverse().join('')).split('').map((r) => (
                <span key={r}>{r}</span>
              ))}
            </div>
            <div className="frame-coords frame-coords--file">
              {(orientation === 'white' ? FILES : [...FILES].reverse().join('')).split('').map((f) => (
                <span key={f}>{f}</span>
              ))}
            </div>
          </>
        )}

        <div
          className="board"
          ref={boardRef}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={() => setHover(null)}
          onPointerCancel={() => {
            setDrag(null);
            setPen(null);
          }}
          onContextMenu={(e) => e.preventDefault()}
        >
          {names.map((square, index) => {
            const file = index % 8;
            const rank = Math.floor(index / 8);
            const dark = (file + rank) % 2 === 1;
            const piece = contents.get(square);
            const mark = markBySquare.get(square);
            const animating = anim?.square === square;
            const classes = [
              'square',
              dark ? 'square--dark' : 'square--light',
              selected === square ? 'square--selected' : '',
              prefs.highlightLast && lastMove && (lastMove.from === square || lastMove.to === square)
                ? 'square--last'
                : '',
              checkSquare === square ? 'square--check' : '',
              mark ? `square--mark square--mark-${mark.kind}` : '',
              animating ? 'square--anim' : '',
              drag && hover === square && targets.has(square) ? 'square--over' : '',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <div
                key={square}
                className={classes}
                data-square={square}
                style={
                  animating
                    ? ({
                        '--adx': String(anim.dx),
                        '--ady': String(anim.dy),
                        '--anim-ms': `${prefs.animateMs}ms`,
                      } as React.CSSProperties)
                    : undefined
                }
                onPointerDown={(e) => handlePointerDown(e, square)}
              >
                {piece && (
                  <Piece
                    key={animating ? anim.key : undefined}
                    type={piece.type}
                    color={piece.color}
                    dragging={drag?.square === square}
                  />
                )}
                {prefs.showHints && targets.has(square) && (
                  <span className={targets.get(square) ? 'target target--capture' : 'target'} />
                )}
                {mark?.label && <span className="square-label">{mark.label}</span>}
                {showCoords === 'inside' && file === 0 && (
                  <span className="coord coord--rank">{square[1]}</span>
                )}
                {showCoords === 'inside' && rank === 7 && (
                  <span className="coord coord--file">{square[0]}</span>
                )}
              </div>
            );
          })}

          <div className="board__texture" />

          {drawn.length > 0 && (
            <svg className="board__shapes" viewBox="0 0 8 8" aria-hidden="true">
              {drawn.map((shape) => (
                <ShapeGlyph key={`${shape.from}${shape.to}`} shape={shape} names={names} />
              ))}
            </svg>
          )}

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
      </div>

      {drag && dragPiece && (
        <div className="drag-layer" style={{ left: drag.x, top: drag.y }}>
          <Piece type={dragPiece.type} color={dragPiece.color} />
        </div>
      )}
    </div>
  );
}

/** One annotation: a ring when it starts and ends on the same square, else an arrow. */
function ShapeGlyph({ shape, names }: { shape: Shape; names: string[] }) {
  const color = SHAPE_COLORS[shape.color];
  const at = (square: string) => {
    const i = names.indexOf(square);
    return { x: (i % 8) + 0.5, y: Math.floor(i / 8) + 0.5 };
  };

  const a = at(shape.from);
  if (shape.from === shape.to) {
    return (
      <circle cx={a.x} cy={a.y} r={0.42} fill="none" stroke={color} strokeWidth={0.09} opacity={0.9} />
    );
  }

  const b = at(shape.to);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const head = 0.34;
  const tipX = b.x - ux * 0.1;
  const tipY = b.y - uy * 0.1;
  const baseX = tipX - ux * head;
  const baseY = tipY - uy * head;

  return (
    <g opacity={0.85}>
      <line
        x1={a.x + ux * 0.13}
        y1={a.y + uy * 0.13}
        x2={baseX}
        y2={baseY}
        stroke={color}
        strokeWidth={0.14}
        strokeLinecap="round"
      />
      <polygon
        points={`${tipX},${tipY} ${baseX - uy * 0.19},${baseY + ux * 0.19} ${baseX + uy * 0.19},${baseY - ux * 0.19}`}
        fill={color}
      />
    </g>
  );
}
