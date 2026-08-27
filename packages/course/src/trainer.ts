/**
 * The engine a course session runs on.
 *
 * It walks the tasks a {@link buildSession} plan handed it: replay what comes
 * before the question, put the question, play the opponent's answer, move on.
 * A wrong move never lands on the board — it is probed on a clone first — so the
 * position you were thinking about is still the position in front of you when
 * you try again.
 *
 * One rule decides everything about grading: **a move is graded once per
 * session, on the first time it is asked.** Learn replays a variation three
 * times and review may reach the same move down two lines; neither should be
 * able to walk a move up the ladder in an afternoon, and neither should let a
 * move you fluffed first time be redeemed by getting it right thirty seconds
 * later. The repeats are practice. The first answer is the measurement.
 */

import { Chess, START_FEN } from '@coh/chess-core';
import type { MoveInput } from '@coh/chess-core';
import { progressFor, recordAnswer } from './scheduler.js';
import { colorOf, moveKey, roleOf } from './tree.js';
import type {
  Chapter,
  Course,
  CourseNode,
  CourseOutcome,
  CourseProgress,
  ReplyInfo,
  RunPosition,
  SessionPlan,
  SessionTask,
} from './types.js';

export type TrainerStatus =
  /** Nothing started yet. */
  | 'idle'
  /** The moves are being played out for you, one at a time. */
  | 'watching'
  /** A question is on the board. */
  | 'asking'
  /** This run through the line is finished; the caller advances. */
  | 'task-complete'
  /** Every task in the plan is done. */
  | 'complete';

export interface CourseTrainerOptions {
  course: Course;
  plan: SessionPlan;
  progress?: CourseProgress;
  now?: () => number;
}

export interface SessionScore {
  /** Distinct moves graded this session. */
  graded: number;
  right: number;
  wrong: number;
  tasksDone: number;
  tasksTotal: number;
}

export class CourseTrainer {
  readonly course: Course;
  readonly plan: SessionPlan;

  private readonly chapters = new Map<string, Chapter>();
  private readonly userColor: 'w' | 'b';
  private readonly now: () => number;
  /** Where each task sits: which line of the session, and which run at it. */
  private readonly runs: RunPosition[];

  private progressMap: CourseProgress;
  private chess = new Chess();
  private taskIndex = -1;
  private cursor = 0;
  /** How far the demonstration has got, when one is running. */
  private watchCursor = 0;
  private lastMoveSquares: { from: string; to: string } | null = null;
  private sessionStatus: TrainerStatus = 'idle';

  /**
   * How each move has answered this session, by key: true for produced without
   * help. Not just a set of "seen", because a line is asked more than once in a
   * learn session and the answers can disagree.
   */
  private readonly answers = new Map<string, boolean>();
  /** Whether the question on the board has already been missed or given away. */
  private failed = false;
  /** Set by a hint, or by having just missed the move. */
  private revealedNow = false;
  private score = { right: 0, wrong: 0 };

  constructor(options: CourseTrainerOptions) {
    this.course = options.course;
    this.plan = options.plan;
    this.progressMap = { ...(options.progress ?? {}) };
    this.userColor = colorOf(options.course.side);
    this.now = options.now ?? (() => Date.now());
    for (const chapter of options.course.chapters) this.chapters.set(chapter.id, chapter);
    this.runs = positionRuns(options.plan.tasks);
    this.start();
  }

  // ------------------------------------------------------------- reading ---

  get game(): Chess {
    return this.chess;
  }

  get status(): TrainerStatus {
    return this.sessionStatus;
  }

  get task(): SessionTask | null {
    return this.plan.tasks[this.taskIndex] ?? null;
  }

  /** The move you are being asked for, or null when the session is over. */
  get current(): CourseNode | null {
    const task = this.task;
    if (!task || this.sessionStatus !== 'asking') return null;
    return task.line[this.cursor] ?? null;
  }

  /** True while the moves are being played out rather than asked for. */
  get watching(): boolean {
    return this.sessionStatus === 'watching';
  }

  /** The move the demonstration has just played, or null before it starts. */
  get watched(): CourseNode | null {
    const task = this.task;
    if (!task?.watch || this.sessionStatus !== 'watching') return null;
    return this.watchCursor > task.watch.from ? (task.line[this.watchCursor - 1] ?? null) : null;
  }

  /** The move the demonstration is about to play, or null when it is spent. */
  get watchNext(): CourseNode | null {
    const task = this.task;
    if (!task?.watch || this.sessionStatus !== 'watching') return null;
    return this.watchCursor < task.watch.to ? (task.line[this.watchCursor] ?? null) : null;
  }

  /** 0..1 through the demonstration. */
  get watchCompletion(): number {
    const watch = this.task?.watch;
    if (!watch || watch.to <= watch.from) return 1;
    return (this.watchCursor - watch.from) / (watch.to - watch.from);
  }

  /** How many plies the demonstration has played. */
  get watchAt(): number {
    return this.watchCursor;
  }

  /**
   * The ply at which the demonstration stops recapping and starts teaching, or
   * 0 when it has no recap. Plies before it are a shared opening replayed at
   * speed; the move just played is part of the recap while `watchAt` is at or
   * below this.
   */
  get watchRecapUntil(): number {
    return this.task?.watch?.recap ?? 0;
  }

  /**
   * Whether the current part's demonstration can be played again.
   *
   * Only a learn part has one — the run from the top and every review task ask
   * cold — and only once it is over, i.e. you are being asked or the part is
   * done. Mid-demonstration there is nothing to replay yet.
   */
  get replayable(): boolean {
    return (
      Boolean(this.task?.watch) &&
      (this.sessionStatus === 'asking' || this.sessionStatus === 'task-complete')
    );
  }

  /** True once the answer is on display, because you asked or because you missed. */
  get revealed(): boolean {
    return this.revealedNow;
  }

  get lastMove(): { from: string; to: string } | null {
    return this.lastMoveSquares;
  }

  get isUsersTurn(): boolean {
    return this.sessionStatus === 'asking' && this.chess.turn() === this.userColor;
  }

  /** Which instalment of a chunked line this is, when it is one. */
  get part(): { index: number; total: number } | null {
    return this.task?.part ?? null;
  }

  /**
   * Which line the session is on and which run at it, counted the way a person
   * counts: a session over two variations is two lines, however many times each
   * gets asked for.
   */
  get run(): RunPosition | null {
    return this.runs[this.taskIndex] ?? null;
  }

  /** How many moves are on the board right now. */
  get ply(): number {
    return this.chess.history().length;
  }

  /** Moves on the board, oldest first — the trail a lookback walks. */
  get played(): CourseNode[] {
    const task = this.task;
    if (!task) return [];
    return task.line.slice(0, this.ply);
  }

  /** The position a task's line starts from, for replaying part of it. */
  get startFen(): string | undefined {
    const task = this.task;
    return task ? this.chapters.get(task.chapterId)?.startFen : undefined;
  }

  /** Moves replayed onto the board before the question — context, not answers. */
  get context(): string[] {
    const task = this.task;
    if (!task) return [];
    return task.line.slice(0, task.startIndex).map((node) => node.san);
  }

  /** 0..1 through the current task. */
  get taskCompletion(): number {
    const task = this.task;
    if (!task?.quiz.length) return 0;
    const done = task.quiz.filter((index) => index < this.cursor).length;
    return done / task.quiz.length;
  }

  scoreboard(): SessionScore {
    return {
      graded: this.answers.size,
      right: this.score.right,
      wrong: this.score.wrong,
      tasksDone: Math.max(0, Math.min(this.taskIndex, this.plan.tasks.length)),
      tasksTotal: this.plan.tasks.length,
    };
  }

  exportProgress(): CourseProgress {
    return { ...this.progressMap };
  }

  // ------------------------------------------------------------- driving ---

  /** Begins the first task. Called by the constructor; safe to call again. */
  start(): void {
    this.taskIndex = -1;
    this.answers.clear();
    this.score = { right: 0, wrong: 0 };
    this.nextTask();
  }

  /** Abandons the current task and moves to the next one. */
  nextTask(): void {
    this.taskIndex++;
    const task = this.plan.tasks[this.taskIndex];
    if (!task) {
      this.sessionStatus = 'complete';
      return;
    }

    // A task that demonstrates first opens on the board as it stands before its
    // own moves; everything earlier in the line goes on at once, since it is
    // there to give the moves a position, not to be watched.
    if (task.watch) {
      this.setUpAt(task.watch.from);
      this.watchCursor = task.watch.from;
      this.sessionStatus = 'watching';
      return;
    }
    this.beginAsking();
  }

  /**
   * Plays the next move of the demonstration and returns it. When the last one
   * has been played the board goes back to where the part began and the same
   * moves are asked for — which is the only reason to have watched them.
   */
  advanceWatch(): CourseNode | null {
    const task = this.task;
    if (!task?.watch || this.sessionStatus !== 'watching') return null;

    if (this.watchCursor >= task.watch.to) {
      this.beginAsking();
      return null;
    }
    const node = task.line[this.watchCursor];
    if (!node) {
      this.beginAsking();
      return null;
    }
    this.play(node);
    this.watchCursor++;
    if (this.watchCursor >= task.watch.to) return node;
    return node;
  }

  /** Cuts the demonstration short and goes straight to being asked. */
  skipWatch(): void {
    if (this.sessionStatus === 'watching') this.beginAsking();
  }

  /**
   * Plays the current part's demonstration over again.
   *
   * The line goes past once and then you are on your own, and the moment you
   * want it back is the moment you are stuck on the move after it. Rewinds to
   * the top of the part — the moves you had already answered are asked again,
   * which is the point of watching them — and does nothing outside a learn part.
   */
  rewatch(): boolean {
    if (!this.replayable) return false;
    const watch = this.task!.watch!;
    this.setUpAt(watch.from);
    this.watchCursor = watch.from;
    this.sessionStatus = 'watching';
    this.resetQuestion();
    return true;
  }

  /**
   * Shows the move you are being asked for. It counts as a miss — a move you
   * had to be told is a move you did not know, and the schedule has to hear
   * about it or the whole thing is a game of solitaire. Watching the line does
   * not count against you; needing to see it again a moment later does.
   */
  reveal(): string | null {
    const node = this.current;
    if (!node) return null;
    this.failed = true;
    this.revealedNow = true;
    return node.san;
  }

  submit(input: MoveInput): CourseOutcome {
    const task = this.task;
    const expected = this.current;
    if (!task || !expected || !this.isUsersTurn) return { status: 'not-your-turn' };

    // Probe on a clone: an answer that turns out to be wrong must leave the
    // board exactly where it was.
    const probe = this.chess.clone();
    const attempt = probe.move(input);
    if (!attempt) {
      return {
        status: 'illegal',
        san: typeof input === 'string' ? input : `${input.from}${input.to}`,
      };
    }
    const san = attempt.san;

    if (san === expected.san) return this.accept(expected, expected, 'correct');

    const siblings = this.siblingsAt(this.cursor);
    const index = siblings.findIndex((node) => node.san === san);
    if (index >= 0) {
      const node = siblings[index]!;
      switch (roleOf(siblings, index, this.course.side)) {
        case 'alternative':
          // Playable, and the author said so. It is not a mistake, but the line
          // under it is the one they wrote, so that is what goes on the board.
          return this.accept(expected, node, 'alternative');
        case 'rejected':
          return this.miss({
            status: 'rejected',
            san,
            node,
            expected,
            message: rejectedMessage(node, expected),
          });
        default:
          return this.miss({
            status: 'other-line',
            san,
            node,
            expected,
            message: `${san} is in the course, but in another line. Here it is ${expected.san}.`,
          });
      }
    }

    return this.miss({
      status: 'wrong',
      san,
      expected,
      message: `The course plays ${expected.san} here.`,
    });
  }

  // ------------------------------------------------------------ internal ---

  /** Puts the board at ply `ply` of the current task's line, silently. */
  private setUpAt(ply: number): void {
    const task = this.task;
    if (!task) return;
    const chapter = this.chapters.get(task.chapterId);
    this.chess = new Chess(chapter?.startFen ?? START_FEN);
    this.lastMoveSquares = null;
    for (let i = 0; i < ply; i++) this.play(task.line[i]!);
  }

  /** Rewinds to the start of the run and puts the first question up. */
  private beginAsking(): void {
    const task = this.task;
    if (!task) return;
    this.setUpAt(task.startIndex);
    this.sessionStatus = 'asking';
    this.cursor = task.startIndex;
    this.resetQuestion();
    this.skipToQuestion();
  }

  private siblingsAt(index: number): readonly CourseNode[] {
    const task = this.task;
    if (!task) return [];
    if (index === 0) return this.chapters.get(task.chapterId)?.roots ?? [];
    return task.line[index - 1]?.children ?? [];
  }

  private resetQuestion(): void {
    this.failed = false;
    this.revealedNow = false;
  }

  /** Records a missed attempt and reveals the move, the way review is meant to. */
  private miss(outcome: CourseOutcome): CourseOutcome {
    this.failed = true;
    this.revealedNow = true;
    return outcome;
  }

  /**
   * Commits an accepted answer: grade it, play the taught move, run the
   * opponent's reply, and stop at the next question.
   */
  private accept(
    expected: CourseNode,
    played: CourseNode,
    status: 'correct' | 'alternative',
  ): CourseOutcome {
    this.grade(expected);
    this.play(expected);
    this.cursor++;
    const reply = this.skipToQuestion();

    const taskComplete = this.sessionStatus !== 'asking';
    const sessionComplete = this.sessionStatus === 'complete';
    const base = {
      san: played.san,
      node: played,
      taskComplete,
      sessionComplete,
      ...(reply ? { reply } : {}),
    };
    return status === 'correct'
      ? { status: 'correct', ...base }
      : { status: 'alternative', ...base, expected };
  }

  private taskDone(): boolean {
    const task = this.task;
    if (!task) return true;
    return !task.quiz.some((index) => index >= this.cursor);
  }

  /**
   * Plays forward until the next thing you are asked for, returning the
   * opponent's answer if there was one — that is what the feedback names.
   */
  private skipToQuestion(): ReplyInfo | undefined {
    const task = this.task;
    if (!task) return undefined;
    let reply: ReplyInfo | undefined;

    // A part stops where the part stops. Running on to the end of the line
    // would spoil the instalments that have not been taught yet.
    const limit = task.watch?.to ?? task.line.length;
    while (this.cursor < limit && !task.quiz.includes(this.cursor)) {
      const node = task.line[this.cursor]!;
      this.play(node);
      if (!reply && node.side !== this.userColor) {
        reply = { san: node.san, ...(node.comment ? { comment: node.comment } : {}) };
      }
      this.cursor++;
    }

    if (this.taskDone()) {
      this.sessionStatus =
        this.taskIndex >= this.plan.tasks.length - 1 ? 'complete' : 'task-complete';
    } else {
      this.resetQuestion();
    }
    return reply;
  }

  private play(node: CourseNode): void {
    const info = this.chess.move(node.san);
    if (info) this.lastMoveSquares = { from: info.from, to: info.to };
  }

  /**
   * Folds an answer into the schedule.
   *
   * A move is measured the first time the session asks it, and after that only
   * bad news gets through: producing it from move one having already produced it
   * mid-line proves nothing new, but *failing* to, having managed it a minute
   * ago inside a part, is exactly the thing worth knowing. So a later miss
   * demotes a move that had passed, and a later success cannot promote one that
   * had not. Otherwise a line could be walked up the ladder by being asked
   * often enough in one sitting.
   */
  private grade(node: CourseNode): void {
    const key = moveKey(node);
    const correct = !this.failed;
    const before = this.answers.get(key);
    if (before !== undefined && !(before && !correct)) return;

    this.answers.set(key, correct);
    if (before === undefined) {
      if (correct) this.score.right++;
      else this.score.wrong++;
    } else {
      // A pass turning into a miss: the session's tally has to move with it.
      this.score.right--;
      this.score.wrong++;
    }

    const now = this.now();
    this.progressMap[key] = recordAnswer(progressFor(this.progressMap, key, now), { correct, now });
  }
}

function rejectedMessage(node: CourseNode, expected: CourseNode): string {
  const why = node.comment?.trim();
  const head = `${node.san} is in the course as a move to avoid.`;
  return why ? `${head} ${why} The move here is ${expected.san}.` : `${head} It is ${expected.san}.`;
}

/**
 * Groups a plan's tasks into lines.
 *
 * "Task 4 of 6" is a number about the machine. Two variations drilled three
 * times each is *two* lines, and knowing that is what tells you how much is
 * left — so every task carries where it sits in both counts.
 */
function positionRuns(tasks: readonly SessionTask[]): RunPosition[] {
  const order: string[] = [];
  const counts = new Map<string, number>();
  for (const task of tasks) {
    if (!counts.has(task.lineId)) order.push(task.lineId);
    counts.set(task.lineId, (counts.get(task.lineId) ?? 0) + 1);
  }

  const seen = new Map<string, number>();
  return tasks.map((task) => {
    const index = seen.get(task.lineId) ?? 0;
    seen.set(task.lineId, index + 1);
    return {
      line: order.indexOf(task.lineId),
      lines: order.length,
      index,
      total: counts.get(task.lineId) ?? 1,
    };
  });
}
