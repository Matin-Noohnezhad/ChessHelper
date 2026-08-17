import { useCallback, useMemo, useState } from 'react';
import { Chess } from '@coh/chess-core';
import type { MoveInput, MoveInfo } from '@coh/chess-core';

export type Orientation = 'white' | 'black';

/**
 * Game state as a line plus a cursor.
 *
 * Keeping the SAN line as the single source of truth (rather than a mutable
 * board) means stepping backwards through a game is free, and playing a move
 * from an earlier point simply truncates — which is exactly the interaction an
 * opening trainer needs when the user wants to try a different reply.
 */
export interface ChessGame {
  /** Position at the cursor, not necessarily the end of the line. */
  game: Chess;
  /** Full SAN line, including moves after the cursor. */
  sans: string[];
  cursor: number;
  atStart: boolean;
  atEnd: boolean;
  lastMove: { from: string; to: string } | null;
  orientation: Orientation;
  play: (input: MoveInput) => MoveInfo | null;
  goTo: (index: number) => void;
  stepBack: () => void;
  stepForward: () => void;
  toStart: () => void;
  toEnd: () => void;
  /** Removes the move before the cursor from the line entirely. */
  takeBack: () => void;
  /** Replaces the whole line, e.g. to study a line just played in training. */
  loadLine: (sans: string[]) => void;
  reset: () => void;
  flip: () => void;
  setOrientation: (o: Orientation) => void;
}

function replay(sans: string[], upTo: number): { game: Chess; lastMove: ChessGame['lastMove'] } {
  const game = new Chess();
  let lastMove: ChessGame['lastMove'] = null;
  for (let i = 0; i < upTo; i++) {
    const info = game.move(sans[i]!);
    if (!info) break; // corrupt line; stop where it stops rather than throwing
    lastMove = { from: info.from, to: info.to };
  }
  return { game, lastMove };
}

export function useChessGame(): ChessGame {
  const [sans, setSans] = useState<string[]>([]);
  const [cursor, setCursor] = useState(0);
  const [orientation, setOrientation] = useState<Orientation>('white');

  const { game, lastMove } = useMemo(() => replay(sans, cursor), [sans, cursor]);

  const play = useCallback(
    (input: MoveInput): MoveInfo | null => {
      const { game: at } = replay(sans, cursor);
      const info = at.move(input);
      if (!info) return null;
      setSans((prev) => [...prev.slice(0, cursor), info.san]);
      setCursor((prev) => prev + 1);
      return info;
    },
    [sans, cursor],
  );

  const goTo = useCallback(
    (index: number) => setCursor(Math.max(0, Math.min(index, sans.length))),
    [sans.length],
  );

  const takeBack = useCallback(() => {
    if (cursor === 0) return;
    setSans((prev) => prev.slice(0, cursor - 1));
    setCursor((prev) => prev - 1);
  }, [cursor]);

  const loadLine = useCallback((line: string[]) => {
    setSans(line);
    setCursor(line.length);
  }, []);

  const reset = useCallback(() => {
    setSans([]);
    setCursor(0);
  }, []);

  return {
    game,
    sans,
    cursor,
    atStart: cursor === 0,
    atEnd: cursor === sans.length,
    lastMove,
    orientation,
    play,
    goTo,
    stepBack: () => goTo(cursor - 1),
    stepForward: () => goTo(cursor + 1),
    toStart: () => goTo(0),
    toEnd: () => goTo(sans.length),
    takeBack,
    loadLine,
    reset,
    flip: () => setOrientation((o) => (o === 'white' ? 'black' : 'white')),
    setOrientation,
  };
}
