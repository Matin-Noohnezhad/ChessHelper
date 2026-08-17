/**
 * Training types.
 *
 * The unit of practice is a *line*: one complete path through the book under
 * the opening you chose. You do not practise "the Sicilian" — you practise the
 * Najdorf, then the Dragon, then the Alapin, until none of them surprise you.
 */

import type { Opening, OpeningTheory, Side } from '@coh/opening-book';

export interface RepertoireLine {
  /** Stable id: the SAN move sequence, which is already unique per line. */
  id: string;
  eco: string;
  name: string;
  moves: string[];
  /** The deepest named opening on this path. */
  opening: Opening;
  /**
   * How many book lines run through this one. A proxy for how central the line
   * is — main lines have dozens of published sub-variations beneath them,
   * sidelines have one — and the order in which lines are taught.
   */
  descendants: number;
  /** Theory to show when the line is finished, inherited if needed. */
  theory?: OpeningTheory;
}

export interface LineProgress {
  lineId: string;
  /** Completed run-throughs, clean or not. */
  attempts: number;
  /** Run-throughs finished without a single off-book move. */
  cleanRuns: number;
  /** Consecutive clean runs; reset by any mistake. */
  streak: number;
  /** Total off-book moves ever played in this line. */
  mistakes: number;
  lastSeenAt: number;
  dueAt: number;
  mastered: boolean;
}

export type ProgressMap = Record<string, LineProgress>;

/** Where the trainer is right now, in the terms the UI needs. */
export type SessionStatus = 'idle' | 'playing' | 'complete';

export interface LineContext {
  eco: string;
  name: string;
  idea?: string;
}

export type MoveOutcome =
  | {
      status: 'correct';
      /** The move you played, in SAN. */
      played: string;
      /** The trainer's reply, if the line continues. */
      reply?: string;
      complete: boolean;
      line: RepertoireLine;
    }
  | {
      /**
       * A different book move — still theory, just a different variation. The
       * trainer follows you rather than marking it wrong.
       */
      status: 'transposition';
      played: string;
      reply?: string;
      complete: boolean;
      line: RepertoireLine;
      switchedFrom: RepertoireLine;
    }
  | {
      status: 'off-book';
      played: string;
      expected: string;
      message: string;
      line: RepertoireLine;
      context: LineContext;
    }
  | { status: 'illegal'; played: string }
  | { status: 'not-your-turn' };

export interface SessionSummary {
  total: number;
  seen: number;
  mastered: number;
  dueNow: number;
  /** Off-book moves across every line, all time. */
  mistakes: number;
}
