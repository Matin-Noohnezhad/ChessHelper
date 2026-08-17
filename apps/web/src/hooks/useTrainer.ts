import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import type { MoveInput } from '@coh/chess-core';
import type { Side } from '@coh/opening-book';
import { OpeningTrainer } from '@coh/trainer';
import type { MoveOutcome, ProgressMap, RepertoireLine } from '@coh/trainer';

const STORAGE_KEY = 'coh.trainer.progress.v1';

/**
 * Progress lives in localStorage keyed by the line's move sequence, so it
 * survives reloads and stays valid as the book grows — a line keeps its
 * history as long as its moves do not change.
 */
function loadProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {}; // private mode, corrupt JSON — training still works, just fresh
  }
}

function saveProgress(progress: ProgressMap): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    /* storage full or blocked: not worth interrupting a session over */
  }
}

export interface TrainerSession {
  trainer: OpeningTrainer;
  lines: RepertoireLine[];
  feedback: MoveOutcome | null;
  revealed: string | null;
  submit: (input: MoveInput) => void;
  startLine: (lineId?: string) => void;
  nextLine: () => void;
  reveal: () => void;
  resetProgress: () => void;
}

/**
 * Wraps the trainer, which is a mutable engine, in the state React needs.
 * A version counter is cheaper and less error-prone than mirroring engine
 * state into hooks: the engine stays the single source of truth.
 */
export function useTrainer(rootMoves: string[], side: Side): TrainerSession {
  const rootKey = rootMoves.join(' ');
  const [feedback, setFeedback] = useState<MoveOutcome | null>(null);
  const [revealed, setRevealed] = useState<string | null>(null);
  const [, bump] = useReducer((n: number) => n + 1, 0);

  const trainer = useMemo(
    () => new OpeningTrainer({ root: rootKey ? rootKey.split(' ') : [], side, progress: loadProgress() }),
    [rootKey, side],
  );

  const startLine = useCallback(
    (lineId?: string) => {
      trainer.startLine(lineId);
      setFeedback(null);
      setRevealed(null);
      bump();
    },
    [trainer],
  );

  // A fresh opening or a change of side starts a line automatically. The idle
  // check matters: StrictMode runs effects twice in development, and without it
  // the second run would rotate you off the line before you had seen it.
  useEffect(() => {
    if (trainer.status === 'idle') startLine();
  }, [trainer, startLine]);

  const submit = useCallback(
    (input: MoveInput) => {
      const outcome = trainer.submit(input);
      setFeedback(outcome);
      if (outcome.status !== 'illegal' && outcome.status !== 'not-your-turn') {
        setRevealed(null);
        saveProgress(trainer.exportProgress());
      }
      bump();
    },
    [trainer],
  );

  const reveal = useCallback(() => {
    setRevealed(trainer.revealAnswer());
    bump();
  }, [trainer]);

  const resetProgress = useCallback(() => {
    saveProgress({});
    window.location.reload();
  }, []);

  return {
    trainer,
    lines: trainer.lines,
    feedback,
    revealed,
    submit,
    startLine,
    nextLine: () => startLine(),
    reveal,
    resetProgress,
  };
}
