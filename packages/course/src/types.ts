/**
 * Course training types.
 *
 * A course is somebody else's repertoire: a PGN tree of chapters, variations and
 * prose hung on individual moves. The unit of practice here is not the line — it
 * is the *move*. Each move you have to produce carries its own level and its own
 * due date, so one stubborn move keeps coming back while the rest of the line it
 * lives in drifts out to months. That is the whole difference between drilling a
 * repertoire and re-reading it.
 */

import type { MoveShapes } from '@coh/chess-core';

export type { MoveShapes, ShapeArrow, ShapeCircle, ShapeColor } from '@coh/chess-core';

export type CourseSide = 'white' | 'black';

/** One move, as the course file wrote it. */
export interface CourseNode {
  /** Index path from the chapter's root — `"0.2.1"`. Stable across imports. */
  id: string;
  san: string;
  /** 1-based ply from the chapter's start position. */
  ply: number;
  /** Who played it. */
  side: 'w' | 'b';
  /**
   * Zobrist key of the position the move was played *from*. Progress is keyed
   * by this rather than by a path, so two chapters that transpose share one
   * move's history instead of teaching it twice.
   */
  fromKey: string;
  /** The author's prose for this move — the teaching half of a course. */
  comment?: string;
  /** Arrows and circles the author drew on this move — `[%cal]` / `[%csl]`. */
  shapes?: MoveShapes;
  nags: number[];
  /** `!`, `?`, `!?` … as the file wrote it. */
  suffix?: string;
  /**
   * The author marked this move as bad — `?`, `?!`, `$2`, `$4`, `$6`. Playing
   * it is an error even though it appears in the course, and the comment on it
   * is usually the reason why.
   */
  dubious?: true;
  /** Main continuation first, then the sidelines the author hung off it. */
  children: CourseNode[];
}

/** What a sibling move is *for*, once we know which side you are training. */
export type MoveRole =
  /** The move the course teaches here. */
  | 'taught'
  /** A move the author showed without building a line under it: playable, never required. */
  | 'alternative'
  /** A move with a line of its own — a variation to drill in its own right. */
  | 'branch'
  /** A move the author marked bad. */
  | 'rejected';

export interface Chapter {
  id: string;
  name: string;
  /** Starting position, when the chapter does not begin from the initial one. */
  startFen?: string;
  /** First moves of the chapter. More than one when the author branched at move 1. */
  roots: CourseNode[];
  headers: Record<string, string>;
}

/** A move the file wrote that could not be replayed, kept so an import can say so. */
export interface ImportProblem {
  chapter: string;
  line: string;
  san: string;
  reason: 'illegal' | 'null-move';
}

export interface Course {
  id: string;
  name: string;
  /** The side you are training. Inferred at import, overridable. */
  side: CourseSide;
  chapters: Chapter[];
  problems: ImportProblem[];
}

/* --------------------------------------------------------- scheduling --- */

/**
 * One move's history. `level` 0 means never learned — those are what a learn
 * session hands out; 1 to {@link MAX_LEVEL} are what review brings back.
 */
export interface MoveProgress {
  key: string;
  level: number;
  dueAt: number;
  lastSeenAt: number;
  correct: number;
  wrong: number;
}

export type CourseProgress = Record<string, MoveProgress>;

/* ------------------------------------------------------------ sessions --- */

export type SessionMode =
  /** New moves: shown with the author's comment, then quizzed, then replayed. */
  | 'learn'
  /** Whole variations that hold a due move, replayed start to end, quizzed cold. */
  | 'review'
  /** Straight to the position a due move sits in, one question, next. */
  | 'random';

/** A run of `line` that is demonstrated before it is asked for: `[from, to)`. */
export interface WatchRange {
  from: number;
  to: number;
  /**
   * Plies `[from, recap)` are a recap: moves you have already been taught this
   * session, at the head of a variation that shares its opening with one you
   * just did. They are played through quickly to carry you back to the point
   * where this line branches off, rather than dropped onto the board in one go.
   * Absent when the demonstration is all new ground.
   */
  recap?: number;
}

/** Which instalment of a chunked line a task is, for the sake of saying so. */
export interface PartLabel {
  index: number;
  total: number;
}

/**
 * One run through a line, or through a part of one.
 *
 * A long variation is not learned by being shown once and asked for once. It is
 * broken into parts: each part is played out move by move, then asked for move
 * by move, then the next part — and when the parts are done the whole line is
 * asked from the first move, which is the only test that matters.
 */
export interface SessionTask {
  id: string;
  mode: SessionMode;
  chapterId: string;
  chapterName: string;
  /**
   * The variation this task is a run at. Several tasks share one — the parts of
   * a chunked line and the run from the top are all the same line — which is
   * what lets a session count itself in lines rather than in tasks.
   */
  lineId: string;
  /** Root to leaf, in order. */
  line: CourseNode[];
  /** Where the run starts inside `line`; everything before it is replayed silently. */
  startIndex: number;
  /** Indices into `line` that will be asked of you. */
  quiz: number[];
  /**
   * Moves played out for you first, one at a time, with whatever the author
   * wrote about them. Absent when the task is pure recall.
   */
  watch?: WatchRange;
  /** Set on the parts of a chunked line: "Part 2 of 3". */
  part?: PartLabel;
  /** Which full-line repetition this is — 0 for the first. */
  pass: number;
}

/** Where a session has got to: which line, and which run at it. */
export interface RunPosition {
  /** 0-based index of the line among the session's lines. */
  line: number;
  lines: number;
  /** 0-based index of this run among the runs at that line. */
  index: number;
  total: number;
}

export interface SessionPlan {
  mode: SessionMode;
  tasks: SessionTask[];
  /** Distinct never-learned moves the plan covers. */
  newMoves: number;
  /** Distinct due moves the plan covers. */
  dueMoves: number;
}

/* ------------------------------------------------------------ outcomes --- */

/** The opponent's answer, auto-played from the line. */
export interface ReplyInfo {
  san: string;
  comment?: string;
}

export type CourseOutcome =
  | {
      status: 'correct';
      san: string;
      node: CourseNode;
      reply?: ReplyInfo;
      taskComplete: boolean;
      sessionComplete: boolean;
    }
  | {
      /**
       * A move the author showed here but built no line under. Accepted — it is
       * not a mistake — but the course continues with the move it teaches, so
       * that is what goes on the board.
       */
      status: 'alternative';
      san: string;
      node: CourseNode;
      expected: CourseNode;
      reply?: ReplyInfo;
      taskComplete: boolean;
      sessionComplete: boolean;
    }
  | {
      /** A course move, but from another variation. The board waits for this one. */
      status: 'other-line';
      san: string;
      node: CourseNode;
      expected: CourseNode;
      message: string;
    }
  | {
      /** A move the author marked bad, usually with the reason attached. */
      status: 'rejected';
      san: string;
      node: CourseNode;
      expected: CourseNode;
      message: string;
    }
  | { status: 'wrong'; san: string; expected: CourseNode; message: string }
  | { status: 'illegal'; san: string }
  | { status: 'not-your-turn' };

/* --------------------------------------------------------------- stats --- */

export interface MoveCounts {
  /** Distinct trainable moves — positions you have to produce a move in. */
  total: number;
  /** Seen at least once. */
  seen: number;
  /** Past the first day of the ladder, so they have survived a night's sleep. */
  learned: number;
  /** Due now, including never-seen ones. */
  due: number;
  /** How many moves sit at each level, index 0 being "never learned". */
  levels: number[];
}

export interface ChapterStats extends MoveCounts {
  chapterId: string;
  name: string;
  variations: number;
}

export interface CourseStats extends MoveCounts {
  chapters: ChapterStats[];
  variations: number;
}
