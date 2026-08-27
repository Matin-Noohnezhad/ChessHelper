import { useCallback, useMemo, useReducer, useRef, useState } from 'react';
import { CourseTrainer, buildSession } from '@coh/course';
import type { CourseOutcome, CourseProgress, SessionMode, SessionPlan } from '@coh/course';
import type { MoveInput } from '@coh/chess-core';
import { saveProgress } from '../storage/courseStore.js';
import type { LibraryEntry } from './useCourseLibrary.js';

export interface CourseSessionOptions {
  mode: SessionMode;
  /** Restricts the session to one chapter. Whole course when absent. */
  chapterIds?: readonly string[];
}

export interface CourseSessionState {
  trainer: CourseTrainer;
  plan: SessionPlan;
  feedback: CourseOutcome | null;
  /** The move, once the session has told you it — by hint or by your missing it. */
  answer: string | null;
  submit: (input: MoveInput) => void;
  next: () => void;
  reveal: () => void;
  restart: () => void;
  /** Plays the next move of the demonstration. */
  advanceWatch: () => void;
  /** Cuts the demonstration short and goes to being asked. */
  skipWatch: () => void;
}

/**
 * Wraps the course trainer, which is a mutable engine, in the state React needs.
 *
 * Same trick as {@link useTrainer}: a version counter rather than mirroring the
 * engine's state into hooks, so the engine stays the only place the truth lives.
 * Progress is written back after every graded answer — a session interrupted by
 * a closed tab should still have counted the moves it asked.
 */
export function useCourseSession(
  entry: LibraryEntry,
  options: CourseSessionOptions,
  onProgress?: (progress: CourseProgress) => void,
): CourseSessionState {
  const [feedback, setFeedback] = useState<CourseOutcome | null>(null);
  const [hinted, setHinted] = useState<string | null>(null);
  const [generation, restart] = useReducer((n: number) => n + 1, 0);
  const [, bump] = useReducer((n: number) => n + 1, 0);

  const chapterKey = options.chapterIds?.join(',') ?? '';
  const commit = useRef(onProgress);
  commit.current = onProgress;

  const plan = useMemo(
    () =>
      buildSession(entry.course, entry.progress, {
        mode: options.mode,
        ...(chapterKey ? { chapterIds: chapterKey.split(',') } : {}),
      }),
    // The plan is a snapshot: rebuilding it mid-session because a move's level
    // changed would reshuffle the queue under the person answering it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [entry.course, entry.stored.id, options.mode, chapterKey, generation],
  );

  const trainer = useMemo(
    () => new CourseTrainer({ course: entry.course, plan, progress: entry.progress }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [plan],
  );

  const persist = useCallback(() => {
    const progress = trainer.exportProgress();
    commit.current?.(progress);
    void saveProgress(entry.stored.id, progress);
  }, [trainer, entry.stored.id]);

  const submit = useCallback(
    (input: MoveInput) => {
      const outcome = trainer.submit(input);
      if (outcome.status === 'illegal' || outcome.status === 'not-your-turn') return;
      setFeedback(outcome);
      if (outcome.status === 'correct' || outcome.status === 'alternative') setHinted(null);
      persist();
      bump();
    },
    [trainer, persist],
  );

  const next = useCallback(() => {
    trainer.nextTask();
    setFeedback(null);
    setHinted(null);
    bump();
  }, [trainer]);

  const reveal = useCallback(() => {
    setHinted(trainer.reveal());
    bump();
  }, [trainer]);

  const advanceWatch = useCallback(() => {
    trainer.advanceWatch();
    bump();
  }, [trainer]);

  const skipWatch = useCallback(() => {
    trainer.skipWatch();
    setFeedback(null);
    setHinted(null);
    bump();
  }, [trainer]);

  return {
    trainer,
    plan,
    feedback,
    // The trainer decides whether the answer is on display; the hint is only how
    // it got there.
    answer: trainer.revealed ? (hinted ?? trainer.current?.san ?? null) : null,
    submit,
    next,
    reveal,
    restart,
    advanceWatch,
    skipWatch,
  };
}
