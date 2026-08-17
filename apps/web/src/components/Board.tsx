import { useCallback, useMemo, useRef, useState } from 'react';
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

export interface SquareMark {
  square: string;
  kind: 'key' | 'break';
  label?: string;
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
  const boardRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [drag, setDrag] = useState<{ square: string; x: number; y: number } | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);

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

  const handlePointerDown = useCallback(
    (event: React.PointerEvent, square: string) => {
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
      if (!drag) return;
      setDrag({ ...drag, x: event.clientX, y: event.clientY });
    },
    [drag],
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent) => {
      if (!drag) return;
      const target = squareAtPoint(event.clientX, event.clientY);
      const from = drag.square;
      setDrag(null);
      // Releasing on the origin square means "select", not "move" — that is
      // what makes click-to-move and drag-to-move coexist.
      if (!target || target === from) return;
      if (attemptMove(from, target)) setSelected(null);
    },
    [drag, squareAtPoint, attemptMove],
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

  return (
    <div className="board-wrap">
      <div
        className="board"
        ref={boardRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => setDrag(null)}
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
                <Piece
                  type={piece.type}
                  color={piece.color}
                  dragging={drag?.square === square}
                />
              )}
              {targets.has(square) && (
                <span className={targets.get(square) ? 'target target--capture' : 'target'} />
              )}
              {mark?.label && <span className="square-label">{mark.label}</span>}
              {file === 0 && <span className="coord coord--rank">{square[1]}</span>}
              {rank === 7 && <span className="coord coord--file">{square[0]}</span>}
            </div>
          );
        })}

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
    </div>
  );
}
