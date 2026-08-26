/**
 * Labelling a single move.
 *
 * Cost is measured in win expectancy given away, never in centipawns: dropping
 * half a pawn while up a queen is not a mistake, and dropping half a pawn in a
 * level ending is. On top of that ladder sit the labels that need context
 * rather than a threshold — a move that was the only one available, the only
 * *good* one, one that gave up material on purpose, and one that threw away a
 * decisive chance.
 *
 * The sacrifice rule is the one place centipawns are read directly, because
 * "the position held" is a statement about the evaluation itself and not about
 * how much of it was spent. See {@link isSacrifice}.
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
/** Material given up before a move is called a sacrifice — a pawn is enough. */
export const SACRIFICE_CP = 100;
/**
 * The floors of the four evaluation bands a position can sit in, mover's
 * perspective: winning, playable, worse-but-holding, and lost. A sacrifice is
 * judged by whether it *keeps* the band it started in, not by what it costs —
 * +7 to +2 is still a winning position, +0.5 to -0.5 is still a game, and a
 * -1.5 that stays -1.5 is still the same fight. Below the last floor the
 * position is already gone and shedding material is not a sacrifice.
 */
export const BAND_FLOORS = {
  winning: 150,
  playable: -100,
  holding: -200,
} as const;
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
  /** Evaluation before the move in centipawns, mover's perspective. */
  cpBefore: number;
  /** Evaluation after it, same units and perspective. */
  cpAfter: number;
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

/**
 * Which of the four bands an evaluation sits in: 3 winning, 2 playable,
 * 1 worse but holding, 0 lost.
 */
export function evalBand(cp: number): number {
  if (cp >= BAND_FLOORS.winning) return 3;
  if (cp >= BAND_FLOORS.playable) return 2;
  if (cp >= BAND_FLOORS.holding) return 1;
  return 0;
}

/**
 * A sacrifice in the ordinary chess sense: material handed over without getting
 * it straight back, and a position that still stands up afterwards. The static
 * exchange in {@link materialInvested} is what makes the first half true — a
 * capture the opponent simply recaptures costs nothing, and a piece dropped on
 * a defended square costs a piece.
 *
 * "Stands up" means the evaluation stays in the band it was already in. That
 * deliberately admits sacrifices that cost something: giving back a rook to
 * simplify a won game is a sacrifice, and so is a pawn burned for the initiative
 * in a level position. What it excludes is the move that drops the position a
 * band — an attack that was worth playing and now is not — and any sacrifice
 * made from an already lost position, where there is nothing left to keep.
 */
export function isSacrifice(investedCp: number, cpBefore: number, cpAfter: number): boolean {
  if (investedCp < SACRIFICE_CP) return false;
  const before = evalBand(cpBefore);
  return before > 0 && evalBand(cpAfter) >= before;
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

  const quality = qualityOf(input, loss, playedBest, gap);

  const tags: MoveTag[] = [];
  if (input.legalCount === 1 || (playedBest && gap !== null && gap >= ONLY_MOVE_GAP)) {
    tags.push('only-move');
  }
  // The tag is what is left over once the category has had its say: it marks the
  // gambit still in book and the piece thrown at a lost position, not the move
  // already labelled "Sacrifice" in letters an inch high.
  if (input.investedCp >= SACRIFICE_CP && quality !== 'sacrifice') tags.push('sacrifice');
  if (input.legalCount > 1 && gap !== null && gap >= CRITICAL_GAP) tags.push('critical');
  if (input.inTimePressure) tags.push('time-pressure');

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

  // Material given up, and the position still standing where it stood.
  if (isSacrifice(input.investedCp, input.cpBefore, input.cpAfter)) return 'sacrifice';

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
  sacrifice: 'Sacrifice',
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
  sacrifice: '⚔',
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
  'sacrifice',
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
    sacrifice: 0,
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
