/**
 * Labelling a single move.
 *
 * Everything is measured in win expectancy given away, never in centipawns:
 * dropping half a pawn while up a queen is not a mistake, and dropping half a
 * pawn in a level ending is. On top of the plain "how much did this cost"
 * ladder sit the four labels that need context rather than a threshold —
 * a move that was the only one available, the only *good* one, one that gave up
 * material on purpose, and one that threw away a decisive chance.
 */

import type { CandidateMove, MoveQuality, MoveTag } from './types.js';

/** Win expectancy given up, in percentage points, at each rung of the ladder. */
export const LOSS_THRESHOLDS = {
  /** Anything under this is as good as the engine's own move. */
  best: 0.5,
  excellent: 2,
  good: 5,
  inaccuracy: 10,
  mistake: 20,
} as const;

/** Alternatives have to be this much worse before a move counts as the only one. */
const ONLY_MOVE_GAP = 15;
/** A moment where one move holds and the rest do not, whatever was actually played. */
const CRITICAL_GAP = 20;
/** Every alternative has to leave the mover worse than equal for a move to be "great". */
const RUNNER_UP_IS_LOST = 50;
/** Material given up before a move is called a sacrifice — a clear piece, not an exchange. */
const SACRIFICE_CP = 150;
/** Below this the position is not "still fine", so a sacrifice was just a blunder. */
const SOUND_SACRIFICE_WIN = 50;
/** Above this the game is already over and giving material back is not brilliant. */
const ALREADY_WINNING = 97;
/** A decisive advantage: throwing this away is a miss, not merely a mistake. */
const DECISIVE_WIN = 70;
/** What a miss has to leave behind — anything above this and the chance is still there. */
const MISS_RESIDUAL_WIN = 55;

export interface ClassifyInput {
  /** True while the move is still in our opening tables. */
  isBook: boolean;
  legalCount: number;
  playedUci: string;
  /** Engine candidates in this position, best first for the mover. */
  candidates: readonly CandidateMove[];
  /** Win expectancy for the mover under best play, 0–100. */
  winBefore: number;
  /** Win expectancy for the mover after the move actually played, 0–100. */
  winAfter: number;
  /** Win expectancy of the engine's second choice, or null when there was none. */
  winSecondBest: number | null;
  /** The mover had a forced mate available. */
  mateAvailable: boolean;
  /** The move played keeps a forced mate for the mover. */
  keepsMate: boolean;
  /** Material invested by the move, centipawns; positive means given up. */
  investedCp: number;
  /** The move takes back on the square the opponent just captured on. */
  isRecapture: boolean;
  /** The mover was down to their last tenth of the clock. */
  inTimePressure: boolean;
}

export interface Classification {
  quality: MoveQuality;
  tags: MoveTag[];
}

/** The plain "how much did it cost" ladder, before any of the special cases. */
function band(loss: number): MoveQuality {
  if (loss <= LOSS_THRESHOLDS.best) return 'best';
  if (loss < LOSS_THRESHOLDS.excellent) return 'excellent';
  if (loss < LOSS_THRESHOLDS.good) return 'good';
  if (loss < LOSS_THRESHOLDS.inaccuracy) return 'inaccuracy';
  if (loss < LOSS_THRESHOLDS.mistake) return 'mistake';
  return 'blunder';
}

export function classifyMove(input: ClassifyInput): Classification {
  const loss = Math.max(0, input.winBefore - input.winAfter);
  const playedBest = input.candidates[0]?.uci === input.playedUci;
  const gap = input.winSecondBest === null ? null : input.winBefore - input.winSecondBest;

  const tags: MoveTag[] = [];
  if (input.legalCount === 1 || (playedBest && gap !== null && gap >= ONLY_MOVE_GAP)) {
    tags.push('only-move');
  }
  if (input.investedCp >= SACRIFICE_CP) tags.push('sacrifice');
  if (input.legalCount > 1 && gap !== null && gap >= CRITICAL_GAP) tags.push('critical');
  if (input.inTimePressure) tags.push('time-pressure');

  const quality = qualityOf(input, loss, playedBest, gap);
  return { quality, tags };
}

function qualityOf(
  input: ClassifyInput,
  loss: number,
  playedBest: boolean,
  gap: number | null,
): MoveQuality {
  // Theory first: a book move is a book move even when it is also the only one.
  if (input.isBook) return 'book';
  if (input.legalCount === 1) return 'forced';

  // A sound sacrifice: material given up, nothing given away on the clock face
  // of the evaluation, and a position still worth playing afterwards. The
  // "already winning" guard stops every simplifying exchange sacrifice in a
  // won game from being celebrated.
  if (
    input.investedCp >= SACRIFICE_CP &&
    loss < LOSS_THRESHOLDS.excellent &&
    input.winAfter >= SOUND_SACRIFICE_WIN &&
    input.winBefore <= ALREADY_WINNING
  ) {
    return 'brilliant';
  }

  // The only move that holds, found. Every alternative has to leave the mover
  // worse than equal, otherwise this is just the best of several playable moves
  // — and delivering a mate that was there all along stays "best", not "great".
  // Recaptures are excluded however lopsided the alternatives look: taking back
  // is the move everyone finds, so calling it great cheapens the label.
  if (
    playedBest &&
    !input.isRecapture &&
    loss <= LOSS_THRESHOLDS.best &&
    gap !== null &&
    gap >= ONLY_MOVE_GAP &&
    input.winSecondBest !== null &&
    input.winSecondBest < RUNNER_UP_IS_LOST
  ) {
    return 'great';
  }

  // A missed win reads differently from a mistake in a level position, even
  // when the evaluation swing is identical.
  if (loss >= LOSS_THRESHOLDS.inaccuracy) {
    const missedMate = input.mateAvailable && !input.keepsMate;
    const threwAwayWin = input.winBefore >= DECISIVE_WIN && input.winAfter <= MISS_RESIDUAL_WIN;
    if (missedMate || threwAwayWin) return 'miss';
  }

  if (playedBest) return 'best';
  return band(loss);
}

/** Display order and copy for the categories, so the UI and the tests agree on both. */
export const QUALITY_LABELS: Record<MoveQuality, string> = {
  brilliant: 'Brilliant',
  great: 'Great',
  best: 'Best',
  excellent: 'Excellent',
  good: 'Good',
  book: 'Theory',
  forced: 'Forced',
  inaccuracy: 'Inaccuracy',
  mistake: 'Mistake',
  miss: 'Miss',
  blunder: 'Blunder',
};

export const QUALITY_SYMBOLS: Record<MoveQuality, string> = {
  brilliant: '!!',
  great: '!',
  best: '★',
  excellent: '✓',
  good: '✓',
  book: '📖',
  forced: '□',
  inaccuracy: '?!',
  mistake: '?',
  miss: '×',
  blunder: '??',
};

export const QUALITY_ORDER: MoveQuality[] = [
  'brilliant',
  'great',
  'best',
  'excellent',
  'good',
  'book',
  'forced',
  'inaccuracy',
  'mistake',
  'miss',
  'blunder',
];

export function emptyCounts(): Record<MoveQuality, number> {
  return {
    brilliant: 0,
    great: 0,
    best: 0,
    excellent: 0,
    good: 0,
    book: 0,
    forced: 0,
    inaccuracy: 0,
    mistake: 0,
    miss: 0,
    blunder: 0,
  };
}
