/**
 * The vocabulary of a game review.
 *
 * The package never talks to an engine itself: callers hand in a
 * {@link PositionEvaluator}, which the web app backs with the Stockfish worker
 * it already ships and the tests back with canned numbers. Everything else here
 * is pure, so the classification rules can be tested without a search.
 */

import type { ColorName } from '@coh/chess-core';

/** An evaluation, always from White's point of view. */
export interface Score {
  /** Centipawns, or null when `mate` applies instead. */
  cp: number | null;
  /** Mate in N (negative = White is being mated), or null. */
  mate: number | null;
}

/** One of the engine's candidate moves in a position. */
export interface CandidateMove {
  uci: string;
  san: string;
  /** Score after this move, from White's point of view. */
  score: Score;
  /** Principal variation in SAN, for display; may be empty. */
  pv?: string[];
}

/** What the engine reports about one position. */
export interface EvaluatedPosition {
  fen: string;
  depth: number;
  /** Best first *for the side to move*; empty in a finished position. */
  candidates: CandidateMove[];
}

/**
 * Evaluates a position. `ply` is passed for progress reporting only — the
 * evaluation must depend on the FEN alone so results stay cacheable.
 */
export type PositionEvaluator = (fen: string, ply: number) => Promise<EvaluatedPosition>;

/**
 * chess.com's move vocabulary. `book` is a move still in our opening tables,
 * `forced` a position with a single legal reply, and `miss` a move that threw
 * away a decisive chance rather than merely losing evaluation.
 */
export type MoveQuality =
  | 'brilliant'
  | 'great'
  | 'best'
  | 'excellent'
  | 'good'
  | 'book'
  | 'forced'
  | 'inaccuracy'
  | 'mistake'
  | 'miss'
  | 'blunder';

/** Orthogonal to quality: a blunder can also be a sacrifice, a best move can be the only one. */
export type MoveTag = 'sacrifice' | 'only-move' | 'critical' | 'time-pressure';

export type GamePhase = 'opening' | 'middlegame' | 'endgame';

export interface ReviewedMove {
  /** 1-based index into the game's moves. */
  ply: number;
  moveNumber: number;
  color: ColorName;
  san: string;
  uci: string;
  fenBefore: string;
  fenAfter: string;
  phase: GamePhase;
  quality: MoveQuality;
  tags: MoveTag[];
  /** 0–100 for this move alone. */
  accuracy: number;
  /** Win expectancy for the mover before the move, 0–100. */
  winBefore: number;
  /** Win expectancy for the mover after it, 0–100. */
  winAfter: number;
  /** Win expectancy given up, 0 when nothing was lost. */
  loss: number;
  /** Centipawns given up, mover's perspective — the classic ACPL input. */
  centipawnLoss: number;
  /** Best play before the move, White's perspective. */
  scoreBefore: Score;
  /** Reality after the move, White's perspective. */
  scoreAfter: Score;
  /** What the engine would have played instead. */
  best: CandidateMove | null;
  /** Runners-up worth showing, best first, excluding `best`. */
  alternatives: CandidateMove[];
  /** Material invested by the move in centipawns; positive means given up. */
  investedCp: number;
  /** Seconds spent, when the PGN carried clocks. */
  secondsSpent: number | null;
  /** Clock left after the move, when the PGN carried clocks. */
  clockSeconds: number | null;
  /** Opening this move belongs to, while the game is still in book. */
  openingName?: string;
  eco?: string;
  /** Comment from the PGN, minus the `[%…]` commands. */
  comment?: string;
  /** One-line plain-English verdict. */
  explanation: string;
}

export interface PhaseReport {
  phase: GamePhase;
  /** Plies of this phase played by this side. */
  moves: number;
  /** 0–100, or null when the side never moved in this phase. */
  accuracy: number | null;
  averageCentipawnLoss: number | null;
  counts: Record<MoveQuality, number>;
}

export interface TimeReport {
  /** From the `TimeControl` header, when it parsed. */
  initialSeconds: number | null;
  incrementSeconds: number;
  averageSeconds: number | null;
  medianSeconds: number | null;
  slowest: { ply: number; san: string; seconds: number } | null;
  /** Moves played with under 10% of the initial clock left. */
  movesInTimePressure: number;
  /** Accuracy inside and outside time pressure, when both are measurable. */
  accuracyInTimePressure: number | null;
  accuracyOutsideTimePressure: number | null;
  /** Moves played in under 3 seconds. */
  hastyMoves: number;
}

export interface SideReport {
  color: ColorName;
  name: string | null;
  elo: number | null;
  moves: number;
  /** 0–100 across the whole game. */
  accuracy: number | null;
  averageCentipawnLoss: number | null;
  counts: Record<MoveQuality, number>;
  phases: Record<GamePhase, PhaseReport>;
  time: TimeReport | null;
}

export interface PhaseBounds {
  /** Ply at which the middlegame starts (1-based); equals move count if the game never left book. */
  middlegameStartPly: number;
  /** Ply at which the endgame starts, or null if it never arrived. */
  endgameStartPly: number | null;
}

export interface GameReview {
  headers: Record<string, string>;
  result: string;
  opening: { name: string; eco: string } | null;
  moves: ReviewedMove[];
  white: SideReport;
  black: SideReport;
  bounds: PhaseBounds;
  /** Shallowest depth any position was searched to. */
  depth: number;
  /** Set when the PGN stopped making sense and the review covers only a prefix. */
  truncated?: string;
}
