/**
 * The review itself: PGN in, report out.
 *
 * The shape of the work is one evaluation per *position* rather than per move —
 * a move's cost is the difference between what the position was worth before it
 * and what it is worth after, so a game of N moves needs N+1 searches, and the
 * search after move i is reused as the "before" of move i+1.
 *
 * Nothing here knows what engine is running. The web app passes a Stockfish
 * worker; the tests pass a function that returns numbers from a table.
 */

import { Chess, parseAnnotatedPgn } from '@coh/chess-core';
import type { AnnotatedPgnGame, ColorName, PgnMove } from '@coh/chess-core';
import { deepestOpening } from '@coh/opening-book';
import {
  centipawnLoss,
  combineAccuracy,
  moveAccuracy,
  volatilityWeights,
  winPercent,
  winPercentFor,
} from './accuracy.js';
import { classifyMove, emptyCounts } from './classify.js';
import { explainMove } from './explain.js';
import { materialInvested } from './material.js';
import { computeBounds, bookPlies, phaseOfPly } from './phases.js';
import { TIME_PRESSURE_FRACTION, buildTimeReport, parseTimeControl } from './timing.js';
import type {
  CandidateMove,
  EvaluatedPosition,
  GamePhase,
  GameReview,
  MoveTag,
  PhaseReport,
  PositionEvaluator,
  ReviewedMove,
  Score,
  SideReport,
} from './types.js';

const PHASES: GamePhase[] = ['opening', 'middlegame', 'endgame'];
/** Runners-up kept per move for the "what else was there" list. */
const MAX_ALTERNATIVES = 3;

export class ReviewAbortedError extends Error {
  constructor() {
    super('Review cancelled');
    this.name = 'ReviewAbortedError';
  }
}

export interface ReviewOptions {
  evaluator: PositionEvaluator;
  /** Called after every position, so a UI can show "34 of 81". */
  onProgress?: (done: number, total: number) => void;
  signal?: AbortSignal;
  /** Safety valve for pathological inputs; the rest of the game is dropped. */
  maxPlies?: number;
}

interface PlayedMove {
  ply: number;
  moveNumber: number;
  color: ColorName;
  san: string;
  uci: string;
  fenBefore: string;
  fenAfter: string;
  legalCount: number;
  /** Destination square, for spotting a recapture on the next ply. */
  to: string;
  isCapture: boolean;
  annotation: PgnMove;
}

/** What a position is worth, given the engine's best line — or the board, if it is over. */
function positionScore(position: EvaluatedPosition, fen: string): Score {
  const best = position.candidates[0];
  if (best) return best.score;

  const game = new Chess(fen);
  // A mate already on the board is expressed as the shortest mate, so that
  // "White is mated" and "White is mated in one" read the same to every consumer.
  if (game.isCheckmate()) return { cp: null, mate: game.turn() === 'w' ? -1 : 1 };
  return { cp: 0, mate: null };
}

const favoursMover = (score: Score, color: ColorName): boolean =>
  score.mate !== null && (color === 'w' ? score.mate > 0 : score.mate < 0);

/** Replays the PGN, stopping at the first move that is not legal in the position. */
function replay(
  game: AnnotatedPgnGame,
  maxPlies: number,
): { moves: PlayedMove[]; fens: string[]; truncated?: string } {
  const board = game.startFen ? new Chess(game.startFen) : new Chess();
  const fens = [board.fen()];
  const moves: PlayedMove[] = [];

  for (const annotation of game.moves.slice(0, maxPlies)) {
    const fenBefore = board.fen();
    const legalCount = board.legalMoves().length;
    const color = board.turn();
    const moveNumber = board.moveNumber();
    const info = board.move(annotation.san);
    if (!info) {
      return {
        moves,
        fens,
        truncated: `"${annotation.san}" is not legal after ${moves.length} plies — reviewed up to there.`,
      };
    }
    moves.push({
      ply: moves.length + 1,
      moveNumber,
      color,
      san: info.san,
      uci: info.uci,
      fenBefore,
      fenAfter: board.fen(),
      legalCount,
      to: info.to,
      isCapture: info.isCapture,
      annotation,
    });
    fens.push(board.fen());
  }

  return { moves, fens };
}

/**
 * Seconds spent on each move, from `[%emt]` when the exporter wrote it and from
 * the difference between consecutive clocks of the same colour otherwise. The
 * increment is added back, because the clock shown after a move already
 * includes it.
 */
function secondsPerMove(moves: PlayedMove[], increment: number, initial: number | null): (number | null)[] {
  const previous: Record<ColorName, number | null> = { w: initial, b: initial };
  return moves.map((move) => {
    const { emtSeconds, clockSeconds } = move.annotation;
    let spent: number | null = emtSeconds ?? null;
    const before = previous[move.color];
    if (spent === null && clockSeconds !== undefined && before !== null) {
      spent = before + increment - clockSeconds;
    }
    if (clockSeconds !== undefined) previous[move.color] = clockSeconds;
    return spent === null ? null : Math.max(0, Math.round(spent * 10) / 10);
  });
}

/** The clock a player was looking at when they moved, which is what "time pressure" means. */
function clockBeforeMove(moves: PlayedMove[], index: number, initial: number | null): number | null {
  const color = moves[index]!.color;
  for (let i = index - 1; i >= 0; i--) {
    if (moves[i]!.color !== color) continue;
    const clock = moves[i]!.annotation.clockSeconds;
    return clock === undefined ? null : clock;
  }
  return initial;
}

function phaseReport(phase: GamePhase, moves: ReviewedMove[], weights: number[]): PhaseReport {
  const counts = emptyCounts();
  for (const move of moves) counts[move.quality]++;
  return {
    phase,
    moves: moves.length,
    accuracy: combineAccuracy(
      moves.map((m) => m.accuracy),
      moves.map((m) => weights[m.ply - 1] ?? 1),
    ),
    averageCentipawnLoss: moves.length
      ? moves.reduce((sum, m) => sum + m.centipawnLoss, 0) / moves.length
      : null,
    counts,
  };
}

function sideReport(
  color: ColorName,
  moves: ReviewedMove[],
  weights: number[],
  headers: Record<string, string>,
): SideReport {
  const mine = moves.filter((move) => move.color === color);
  const counts = emptyCounts();
  for (const move of mine) counts[move.quality]++;

  const phases = Object.fromEntries(
    PHASES.map((phase) => [
      phase,
      phaseReport(
        phase,
        mine.filter((move) => move.phase === phase),
        weights,
      ),
    ]),
  ) as Record<GamePhase, PhaseReport>;

  const eloHeader = headers[color === 'w' ? 'WhiteElo' : 'BlackElo'];
  const elo = eloHeader && /^\d+$/.test(eloHeader) ? Number(eloHeader) : null;

  return {
    color,
    name: headers[color === 'w' ? 'White' : 'Black'] ?? null,
    elo,
    moves: mine.length,
    accuracy: combineAccuracy(
      mine.map((m) => m.accuracy),
      mine.map((m) => weights[m.ply - 1] ?? 1),
    ),
    averageCentipawnLoss: mine.length
      ? mine.reduce((sum, m) => sum + m.centipawnLoss, 0) / mine.length
      : null,
    counts,
    phases,
    time: buildTimeReport(mine, parseTimeControl(headers.TimeControl)),
  };
}

/** Parses and reviews a PGN. Rejects with {@link ReviewAbortedError} if the signal fires. */
export async function reviewPgn(pgn: string, options: ReviewOptions): Promise<GameReview> {
  return reviewGame(parseAnnotatedPgn(pgn), options);
}

export async function reviewGame(
  parsed: AnnotatedPgnGame,
  options: ReviewOptions,
): Promise<GameReview> {
  const { evaluator, onProgress, signal, maxPlies = 600 } = options;
  const { moves: played, fens, truncated } = replay(parsed, maxPlies);
  if (!played.length) throw new Error('That PGN has no legal moves to review.');

  const control = parseTimeControl(parsed.headers.TimeControl);
  const spent = secondsPerMove(played, control.incrementSeconds, control.initialSeconds);

  // One search per position, including the one the game ended in. Repetitions
  // and transpositions reuse the first result rather than paying twice.
  const total = fens.length;
  const cache = new Map<string, EvaluatedPosition>();
  const evaluations: EvaluatedPosition[] = [];
  for (let i = 0; i < fens.length; i++) {
    if (signal?.aborted) throw new ReviewAbortedError();
    const fen = fens[i]!;
    const cached = cache.get(fen);
    const evaluation = cached ?? (await evaluator(fen, i));
    if (!cached) cache.set(fen, evaluation);
    evaluations.push(evaluation);
    onProgress?.(i + 1, total);
  }

  const scores = evaluations.map((evaluation, i) => positionScore(evaluation, fens[i]!));
  const weights = volatilityWeights(scores.map(winPercent));
  const sans = played.map((move) => move.san);
  const fromInitialPosition = !parsed.startFen;
  const bounds = computeBounds(sans, fens, fromInitialPosition);
  const inBook = fromInitialPosition ? bookPlies(sans) : 0;

  const reviewed: ReviewedMove[] = played.map((move, i) => {
    const scoreBefore = scores[i]!;
    const scoreAfter = scores[i + 1]!;
    const winBefore = winPercentFor(scoreBefore, move.color);
    const winAfter = winPercentFor(scoreAfter, move.color);
    const loss = Math.max(0, winBefore - winAfter);

    const candidates = evaluations[i]!.candidates;
    const best = candidates[0] ?? null;
    const alternatives = candidates.slice(1, 1 + MAX_ALTERNATIVES);
    const winSecondBest = candidates[1]
      ? winPercentFor(candidates[1].score, move.color)
      : null;

    const isBook = move.ply <= inBook;
    const investedCp = materialInvested(move.fenBefore, move.uci);
    const clockBefore = clockBeforeMove(played, i, control.initialSeconds);
    const inTimePressure =
      control.initialSeconds !== null &&
      clockBefore !== null &&
      clockBefore < control.initialSeconds * TIME_PRESSURE_FRACTION;

    const mateAvailable = favoursMover(scoreBefore, move.color);
    const keepsMate = favoursMover(scoreAfter, move.color);

    const { quality, tags } = classifyMove({
      isBook,
      legalCount: move.legalCount,
      playedUci: move.uci,
      candidates,
      winBefore,
      winAfter,
      winSecondBest,
      mateAvailable,
      keepsMate,
      investedCp,
      isRecapture: move.isCapture && played[i - 1]?.to === move.to,
      inTimePressure,
    });

    const opening = isBook ? deepestOpening(sans.slice(0, move.ply)) : undefined;
    const cpLoss = centipawnLoss(scoreBefore, scoreAfter, move.color);

    const reviewedMove: ReviewedMove = {
      ply: move.ply,
      moveNumber: move.moveNumber,
      color: move.color,
      san: move.san,
      uci: move.uci,
      fenBefore: move.fenBefore,
      fenAfter: move.fenAfter,
      phase: phaseOfPly(move.ply, bounds),
      quality,
      tags: tags as MoveTag[],
      accuracy: moveAccuracy(winBefore, winAfter),
      winBefore,
      winAfter,
      loss,
      centipawnLoss: cpLoss,
      scoreBefore,
      scoreAfter,
      best,
      alternatives: alternatives as CandidateMove[],
      investedCp,
      secondsSpent: spent[i] ?? null,
      clockSeconds: move.annotation.clockSeconds ?? null,
      explanation: '',
    };
    if (opening) {
      reviewedMove.openingName = opening.name;
      reviewedMove.eco = opening.eco;
    }
    if (move.annotation.comment) reviewedMove.comment = move.annotation.comment;

    reviewedMove.explanation = explainMove({
      quality,
      tags: reviewedMove.tags,
      san: move.san,
      best,
      loss,
      centipawnLoss: cpLoss,
      scoreAfter,
      investedCp,
      ...(reviewedMove.openingName ? { openingName: reviewedMove.openingName } : {}),
      mateAvailable,
    });
    return reviewedMove;
  });

  const named = deepestOpening(sans);
  const review: GameReview = {
    headers: parsed.headers,
    result: parsed.result,
    opening: named ? { name: named.name, eco: named.eco } : null,
    moves: reviewed,
    white: sideReport('w', reviewed, weights, parsed.headers),
    black: sideReport('b', reviewed, weights, parsed.headers),
    bounds,
    depth: Math.min(...evaluations.map((evaluation) => evaluation.depth)),
  };
  if (truncated) review.truncated = truncated;
  return review;
}

/**
 * The moves worth replaying first, biggest swing first. Brilliancies and the
 * moves that saved a position ride along at the bottom, where their zero loss
 * puts them — they are worth seeing, but never ahead of the game's blunders.
 */
export function keyMoments(review: GameReview, limit = 6): ReviewedMove[] {
  return [...review.moves]
    .filter((move) => move.loss >= 5 || move.quality === 'brilliant' || move.quality === 'great')
    .sort((a, b) => b.loss - a.loss)
    .slice(0, limit);
}
