/**
 * The one-line verdict under each move.
 *
 * Kept next to the classifier rather than in the UI: the sentence has to agree
 * with the label, and both change together when a threshold moves.
 */

import { formatPawns, formatScore } from './format.js';
import type { CandidateMove, MoveQuality, MoveTag, Score } from './types.js';

export interface ExplainInput {
  quality: MoveQuality;
  tags: readonly MoveTag[];
  san: string;
  best: CandidateMove | null;
  /** Win expectancy given up, percentage points. */
  loss: number;
  centipawnLoss: number;
  scoreAfter: Score;
  investedCp: number;
  openingName?: string;
  mateAvailable: boolean;
}

/** The engine's move, phrased so it can be dropped into a sentence, or null when it was played. */
function instead(input: ExplainInput): string | null {
  if (!input.best || input.best.san === input.san) return null;
  return input.best.san;
}

export function explainMove(input: ExplainInput): string {
  const alternative = instead(input);
  const after = formatScore(input.scoreAfter);

  switch (input.quality) {
    case 'book':
      return input.openingName ? `Theory — ${input.openingName}.` : 'Still in the opening books.';

    case 'forced':
      return 'The only legal move.';

    case 'brilliant':
      return `Brilliant — gives up ${formatPawns(input.investedCp)} and the position still stands at ${after}.`;

    case 'great':
      return alternative
        ? `The one move that holds; ${alternative} was the only rival and it falls short.`
        : 'The one move that holds — everything else lets the position slip.';

    case 'best':
      return input.tags.includes('sacrifice')
        ? `The engine's choice, and it invests ${formatPawns(input.investedCp)} to get there.`
        : "The engine's first choice.";

    case 'excellent':
      return alternative
        ? `As good as anything; ${alternative} was a shade sharper.`
        : 'As good as anything the engine had.';

    case 'good':
      return alternative ? `Sound, though ${alternative} kept more.` : 'Sound, if not the sharpest.';

    case 'inaccuracy':
      return alternative
        ? `Inaccurate — ${formatPawns(input.centipawnLoss)} slip; ${alternative} was the move.`
        : `Inaccurate — ${formatPawns(input.centipawnLoss)} slip.`;

    case 'mistake':
      return alternative
        ? `A mistake — ${formatPawns(input.centipawnLoss)} gone; ${alternative} was much better.`
        : `A mistake — ${formatPawns(input.centipawnLoss)} gone.`;

    case 'miss':
      if (input.mateAvailable) {
        return alternative
          ? `Missed a forced mate — ${alternative} finished the game.`
          : 'Missed a forced mate.';
      }
      return alternative
        ? `Missed the win — ${alternative} kept it decisive; now it is ${after}.`
        : `Missed the win — the position is only ${after} now.`;

    case 'blunder':
      return alternative
        ? `Blunder — ${formatPawns(input.centipawnLoss)} thrown away; ${alternative} held everything together.`
        : `Blunder — ${formatPawns(input.centipawnLoss)} thrown away.`;

    default:
      return '';
  }
}
