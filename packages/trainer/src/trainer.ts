/**
 * The sparring engine.
 *
 * The trainer holds a target line and plays the other side of it. You play your
 * moves; it answers with book. A move that is not the book move is not punished
 * with a lost game — the run simply stops, you are told what theory plays and
 * why, and you try again. When the line runs out, that is the moment the plans
 * and structures matter, so that is when they are handed to you.
 */

import { Chess, normalizeSan } from '@coh/chess-core';
import type { MoveInput } from '@coh/chess-core';
import { identifyOpening } from '@coh/opening-book';
import type { Side } from '@coh/opening-book';
import { buildRepertoire } from './repertoire.js';
import { MASTERY_STREAK, chooseLine, progressFor, recordRun } from './scheduler.js';
import type {
  LineContext,
  LineProgress,
  MoveOutcome,
  ProgressMap,
  RepertoireLine,
  SessionStatus,
  SessionSummary,
} from './types.js';

export interface TrainerOptions {
  /** Opening to drill, as SAN moves. Empty trains the whole book. */
  root?: readonly string[];
  /** The side *you* play. */
  side: Side;
  /** Previously saved progress, e.g. from localStorage. */
  progress?: ProgressMap;
  /** Shortest line worth drilling; see DEFAULT_MIN_PLIES. */
  minPlies?: number;
  now?: () => number;
}

export interface StartResult {
  line: RepertoireLine;
  /** The trainer's opening move, when you are Black. */
  reply?: string;
}

export class OpeningTrainer {
  readonly lines: RepertoireLine[];
  readonly side: Side;

  private chess = new Chess();
  private current: RepertoireLine | null = null;
  private plyIndex = 0;
  private runMistakes = 0;
  private sessionStatus: SessionStatus = 'idle';
  private progressMap: ProgressMap;
  /** Lines shown this session, oldest first — drives variation rotation. */
  private recentLineIds: string[] = [];
  private lastMoveSquares: { from: string; to: string } | null = null;
  private readonly now: () => number;

  constructor(options: TrainerOptions) {
    this.lines = buildRepertoire(options.root ?? [], {
      ...(options.minPlies !== undefined ? { minPlies: options.minPlies } : {}),
    });
    this.side = options.side;
    this.progressMap = { ...(options.progress ?? {}) };
    this.now = options.now ?? (() => Date.now());
  }

  // ------------------------------------------------------------- reading ---

  get game(): Chess {
    return this.chess;
  }

  get line(): RepertoireLine | null {
    return this.current;
  }

  get ply(): number {
    return this.plyIndex;
  }

  get status(): SessionStatus {
    return this.sessionStatus;
  }

  get lastMove(): { from: string; to: string } | null {
    return this.lastMoveSquares;
  }

  get mistakesThisRun(): number {
    return this.runMistakes;
  }

  /** The colour you are playing, in board terms. */
  get userColor(): 'w' | 'b' {
    return this.side === 'white' ? 'w' : 'b';
  }

  get isUsersTurn(): boolean {
    return this.sessionStatus === 'playing' && this.chess.turn() === this.userColor;
  }

  /** SAN the current line expects from you next, if it is your move. */
  get expectedSan(): string | null {
    if (!this.current || this.sessionStatus !== 'playing') return null;
    return this.current.moves[this.plyIndex] ?? null;
  }

  /** How far through the current line you are, 0..1. */
  get lineCompletion(): number {
    if (!this.current?.moves.length) return 0;
    return this.plyIndex / this.current.moves.length;
  }

  progressOf(lineId: string): LineProgress {
    return progressFor(this.progressMap, lineId, this.now());
  }

  exportProgress(): ProgressMap {
    return { ...this.progressMap };
  }

  summary(): SessionSummary {
    const now = this.now();
    let seen = 0;
    let mastered = 0;
    let dueNow = 0;
    let mistakes = 0;
    for (const line of this.lines) {
      const p = this.progressMap[line.id];
      if (!p) {
        dueNow++;
        continue;
      }
      if (p.attempts > 0) seen++;
      if (p.mastered) mastered++;
      if (p.dueAt <= now) dueNow++;
      mistakes += p.mistakes;
    }
    return { total: this.lines.length, seen, mastered, dueNow, mistakes };
  }

  // ------------------------------------------------------------ playing ---

  /**
   * Begins a line — the scheduler's choice unless you name one. The id may be a
   * prefix (an opening's moves), in which case the first line beneath it is
   * used, so callers do not have to know where the book currently ends.
   */
  startLine(lineId?: string): StartResult | null {
    const line =
      (lineId ? this.lines.find((l) => l.id === lineId || l.id.startsWith(`${lineId} `)) : null) ??
      chooseLine(this.lines, this.progressMap, {
        now: this.now(),
        recent: this.recentLineIds,
      });
    if (!line) return null;

    this.remember(line.id);
    this.current = line;
    this.chess = new Chess();
    this.plyIndex = 0;
    this.runMistakes = 0;
    this.lastMoveSquares = null;
    this.sessionStatus = 'playing';

    // When you are Black the trainer owes you the first move.
    const reply = this.playTrainerMove();
    return reply ? { line, reply } : { line };
  }

  /** Abandons the current line and starts another. */
  nextLine(): StartResult | null {
    return this.startLine();
  }

  /**
   * Records a line as shown, keeping just enough history that the session
   * cycles through every variation before any of them comes back.
   */
  private remember(lineId: string): void {
    this.recentLineIds = this.recentLineIds.filter((id) => id !== lineId);
    this.recentLineIds.push(lineId);
    const keep = Math.max(1, this.lines.length - 1);
    if (this.recentLineIds.length > keep) {
      this.recentLineIds = this.recentLineIds.slice(-keep);
    }
  }

  submit(input: MoveInput): MoveOutcome {
    const line = this.current;
    if (!line || this.sessionStatus !== 'playing' || !this.isUsersTurn) {
      return { status: 'not-your-turn' };
    }

    // Resolve the input to SAN without committing to it — an off-book move
    // must leave the board exactly as it was so you can try again.
    const probe = this.chess.clone();
    const attempt = probe.move(input);
    if (!attempt) return { status: 'illegal', played: String(typeof input === 'string' ? input : `${input.from}${input.to}`) };

    const played = attempt.san;
    const expected = line.moves[this.plyIndex];
    if (!expected) return { status: 'not-your-turn' };

    if (same(played, expected)) return this.accept(line, played);

    const alternative = this.findAlternative(played);
    if (alternative) {
      this.current = alternative;
      return this.accept(alternative, played, line);
    }

    this.runMistakes++;
    return {
      status: 'off-book',
      played,
      expected,
      message: `${played} is not the book move here. In the ${line.name}, theory plays ${expected}.`,
      line,
      context: this.contextAt(this.chess.history()),
    };
  }

  /**
   * Shows the move you are missing. It counts as a mistake — otherwise the
   * spacing algorithm would think you knew the line.
   */
  revealAnswer(): string | null {
    const expected = this.expectedSan;
    if (!expected) return null;
    this.runMistakes++;
    return expected;
  }

  /** Plays the expected move for you, to move a stuck session along. */
  playExpected(): MoveOutcome {
    const line = this.current;
    const expected = this.expectedSan;
    if (!line || !expected) return { status: 'not-your-turn' };
    return this.accept(line, expected);
  }

  // ------------------------------------------------------------ internal ---

  /** Commits a book move, plays the trainer's reply, and closes out the line. */
  private accept(line: RepertoireLine, san: string, switchedFrom?: RepertoireLine): MoveOutcome {
    const info = this.chess.move(san);
    if (!info) return { status: 'illegal', played: san };
    this.lastMoveSquares = { from: info.from, to: info.to };
    this.plyIndex++;

    const reply = this.playTrainerMove();
    const complete = this.plyIndex >= line.moves.length;
    if (complete) this.finish(line);

    const base = { played: san, complete, line, ...(reply ? { reply } : {}) };
    return switchedFrom
      ? { status: 'transposition', ...base, switchedFrom }
      : { status: 'correct', ...base };
  }

  /** Plays the line's next move if it is the trainer's turn. */
  private playTrainerMove(): string | undefined {
    const line = this.current;
    if (!line) return undefined;
    const san = line.moves[this.plyIndex];
    if (!san) return undefined;
    if (this.chess.turn() === this.userColor) return undefined;

    const info = this.chess.move(san);
    if (!info) return undefined;
    this.lastMoveSquares = { from: info.from, to: info.to };
    this.plyIndex++;
    return info.san;
  }

  private finish(line: RepertoireLine): void {
    this.sessionStatus = 'complete';
    const now = this.now();
    this.progressMap[line.id] = recordRun(progressFor(this.progressMap, line.id, now), {
      mistakes: this.runMistakes,
      now,
    });
  }

  /**
   * Another line in the repertoire that plays `san` here. Reaching the same
   * position by a different route is knowledge, not error.
   */
  private findAlternative(san: string): RepertoireLine | null {
    const played = this.chess.history();
    for (const candidate of this.lines) {
      if (candidate.moves.length <= this.plyIndex) continue;
      if (!same(candidate.moves[this.plyIndex]!, san)) continue;
      let matches = true;
      for (let i = 0; i < played.length; i++) {
        if (!same(candidate.moves[i] ?? '', played[i]!)) {
          matches = false;
          break;
        }
      }
      if (matches) return candidate;
    }
    return null;
  }

  private contextAt(moves: string[]): LineContext {
    const match = identifyOpening(moves);
    if (!match) return { eco: '', name: 'Starting position' };
    return {
      eco: match.opening.eco,
      name: match.opening.name,
      ...(match.theory ? { idea: match.theory.idea } : {}),
    };
  }
}

const same = (a: string, b: string): boolean => normalizeSan(a) === normalizeSan(b);

export { MASTERY_STREAK };
