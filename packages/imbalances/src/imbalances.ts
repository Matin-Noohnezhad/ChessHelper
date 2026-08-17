/**
 * A static, Silman-style read of a position's imbalances — the classic
 * chess-literature categories (material, minor-piece quality, pawn
 * structure, space, development, king safety, open files), each detected
 * from piece placement alone. No search, no engine: this is "what kind of
 * position is this", not "who stands better and by how much" — that's what
 * the engine panel is for.
 */

import type { Chess, ColorName, PieceSymbol } from '@coh/chess-core';

export type ImbalanceCategory =
  | 'material'
  | 'bishop-pair'
  | 'bishop-colors'
  | 'pawn-structure'
  | 'pawn-islands'
  | 'space'
  | 'development'
  | 'king-safety'
  | 'open-file';

export type ImbalanceSide = 'white' | 'black' | 'both';

export interface Imbalance {
  category: ImbalanceCategory;
  /** Which side this imbalance favours ('both' for symmetric-but-notable facts like opposite bishops). */
  side: ImbalanceSide;
  description: string;
  /** This entry's contribution to the aggregate score — see {@link analyzeImbalances}. */
  weight: number;
}

export interface ImbalanceReport {
  /** 0 (perfectly symmetric) to ~1 (many/severe imbalances stacked up). */
  score: number;
  imbalances: Imbalance[];
}

interface Placement {
  square: string;
  file: number; // 0..7, a..h
  rank: number; // 1..8
  type: PieceSymbol;
  color: ColorName;
}

const PIECE_VALUE: Record<PieceSymbol, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
const PIECE_NAME: Record<PieceSymbol, string> = {
  p: 'pawn',
  n: 'knight',
  b: 'bishop',
  r: 'rook',
  q: 'queen',
  k: 'king',
};
const FILE_LETTERS = 'abcdefgh';

const article = (word: string): string => (/^[aeiou]/i.test(word) ? 'an' : 'a');
const numberWord = (n: number): string => (n === 2 ? 'two' : n === 3 ? 'three' : n === 4 ? 'four' : String(n));
const pluralize = (name: string, n: number): string => (n === 1 ? name : `${name}s`);
const sideName = (side: 'white' | 'black'): string => (side === 'white' ? 'White' : 'Black');

const mk = (category: ImbalanceCategory, side: ImbalanceSide, description: string, weight: number): Imbalance => ({
  category,
  side,
  description,
  weight,
});

function pawnFiles(pawns: Placement[]): Map<number, number[]> {
  const map = new Map<number, number[]>();
  for (const p of pawns) {
    const ranks = map.get(p.file);
    if (ranks) ranks.push(p.rank);
    else map.set(p.file, [p.rank]);
  }
  return map;
}

function islandCount(files: Set<number>): number {
  const sorted = [...files].sort((a, b) => a - b);
  let islands = 0;
  let prev = -2;
  for (const f of sorted) {
    if (f !== prev + 1) islands++;
    prev = f;
  }
  return islands;
}

function materialImbalance(placements: Placement[]): Imbalance[] {
  const counts: Record<ColorName, Record<PieceSymbol, number>> = {
    w: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 },
    b: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 },
  };
  for (const p of placements) counts[p.color][p.type]++;

  const whiteExtra: [PieceSymbol, number][] = [];
  const blackExtra: [PieceSymbol, number][] = [];
  let diffPoints = 0;
  for (const type of ['q', 'r', 'b', 'n', 'p'] as PieceSymbol[]) {
    const d = counts.w[type] - counts.b[type];
    diffPoints += d * PIECE_VALUE[type];
    if (d > 0) whiteExtra.push([type, d]);
    else if (d < 0) blackExtra.push([type, -d]);
  }
  if (!whiteExtra.length && !blackExtra.length) return [];

  // "for Black's bishop", never "for Black's a bishop" — the possessive already
  // does the article's job, so that phrasing drops it while the standalone
  // "White is up a bishop" phrasing keeps it.
  const withArticle = (extra: [PieceSymbol, number][]): string =>
    extra
      .map(([type, n]) => `${n === 1 ? article(PIECE_NAME[type]) : numberWord(n)} ${pluralize(PIECE_NAME[type], n)}`)
      .join(' and ');
  const possessive = (extra: [PieceSymbol, number][]): string =>
    extra.map(([type, n]) => (n === 1 ? PIECE_NAME[type] : `${numberWord(n)} ${pluralize(PIECE_NAME[type], n)}`)).join(' and ');

  let description: string;
  if (whiteExtra.length && blackExtra.length) {
    description = `White has ${withArticle(whiteExtra)} for Black's ${possessive(blackExtra)}`;
  } else if (whiteExtra.length) {
    description = `White is up ${withArticle(whiteExtra)}`;
  } else {
    description = `Black is up ${withArticle(blackExtra)}`;
  }

  const weight = Math.min(0.9, 0.1 + Math.abs(diffPoints) * 0.1);
  return [mk('material', diffPoints > 0 ? 'white' : 'black', description, weight)];
}

function bishopPairImbalance(placements: Placement[]): Imbalance[] {
  const wB = placements.filter((p) => p.color === 'w' && p.type === 'b').length;
  const bB = placements.filter((p) => p.color === 'b' && p.type === 'b').length;
  if (wB >= 2 && bB < 2) return [mk('bishop-pair', 'white', 'White has the bishop pair', 0.15)];
  if (bB >= 2 && wB < 2) return [mk('bishop-pair', 'black', 'Black has the bishop pair', 0.15)];
  return [];
}

/** a1 is dark, h1 is light — same parity convention the board UI uses. */
function isLightSquare(file: number, rank: number): boolean {
  return (file + rank) % 2 === 0;
}

function bishopColorImbalance(placements: Placement[]): Imbalance[] {
  const wBishops = placements.filter((p) => p.color === 'w' && p.type === 'b');
  const bBishops = placements.filter((p) => p.color === 'b' && p.type === 'b');
  if (wBishops.length !== 1 || bBishops.length !== 1) return [];
  const wLight = isLightSquare(wBishops[0]!.file, wBishops[0]!.rank);
  const bLight = isLightSquare(bBishops[0]!.file, bBishops[0]!.rank);
  if (wLight === bLight) return [];
  return [mk('bishop-colors', 'both', 'Opposite-coloured bishops', 0.12)];
}

function pawnStructureImbalances(placements: Placement[]): Imbalance[] {
  const out: Imbalance[] = [];
  const wPawns = placements.filter((p) => p.color === 'w' && p.type === 'p');
  const bPawns = placements.filter((p) => p.color === 'b' && p.type === 'p');
  const wFiles = pawnFiles(wPawns);
  const bFiles = pawnFiles(bPawns);

  for (const [f, ranks] of wFiles) {
    if (ranks.length >= 2) {
      out.push(mk('pawn-structure', 'black', `Doubled pawns on the ${FILE_LETTERS[f]}-file (White)`, 0.06));
    }
  }
  for (const [f, ranks] of bFiles) {
    if (ranks.length >= 2) {
      out.push(mk('pawn-structure', 'white', `Doubled pawns on the ${FILE_LETTERS[f]}-file (Black)`, 0.06));
    }
  }

  for (const f of wFiles.keys()) {
    if (!wFiles.has(f - 1) && !wFiles.has(f + 1)) {
      out.push(mk('pawn-structure', 'black', `Isolated pawn on the ${FILE_LETTERS[f]}-file (White)`, 0.08));
    }
  }
  for (const f of bFiles.keys()) {
    if (!bFiles.has(f - 1) && !bFiles.has(f + 1)) {
      out.push(mk('pawn-structure', 'white', `Isolated pawn on the ${FILE_LETTERS[f]}-file (Black)`, 0.08));
    }
  }

  for (const p of wPawns) {
    const blocked = bPawns.some((bp) => Math.abs(bp.file - p.file) <= 1 && bp.rank > p.rank);
    if (blocked) continue;
    const advancement = p.rank - 2; // 0 on the start square, 5 on the 7th rank
    out.push(
      mk(
        'pawn-structure',
        'white',
        `Passed pawn on the ${FILE_LETTERS[p.file]}-file (White)`,
        Math.min(0.2, 0.05 + advancement * 0.03),
      ),
    );
  }
  for (const p of bPawns) {
    const blocked = wPawns.some((wp) => Math.abs(wp.file - p.file) <= 1 && wp.rank < p.rank);
    if (blocked) continue;
    const advancement = 7 - p.rank;
    out.push(
      mk(
        'pawn-structure',
        'black',
        `Passed pawn on the ${FILE_LETTERS[p.file]}-file (Black)`,
        Math.min(0.2, 0.05 + advancement * 0.03),
      ),
    );
  }

  return out;
}

function pawnIslandsImbalance(placements: Placement[]): Imbalance[] {
  const wFiles = new Set(placements.filter((p) => p.color === 'w' && p.type === 'p').map((p) => p.file));
  const bFiles = new Set(placements.filter((p) => p.color === 'b' && p.type === 'p').map((p) => p.file));
  if (!wFiles.size || !bFiles.size) return [];
  const wi = islandCount(wFiles);
  const bi = islandCount(bFiles);
  if (wi === bi) return [];
  const diff = Math.abs(wi - bi);
  const [worse, worseCount, better, betterCount] = wi > bi ? (['White', wi, 'Black', bi] as const) : (['Black', bi, 'White', wi] as const);
  return [
    mk(
      'pawn-islands',
      (better.toLowerCase() as 'white' | 'black'),
      `${worse}'s pawns are split into ${worseCount} islands vs ${better}'s ${betterCount}`,
      Math.min(0.15, diff * 0.05),
    ),
  ];
}

function spaceImbalance(placements: Placement[]): Imbalance[] {
  const wPawns = placements.filter((p) => p.color === 'w' && p.type === 'p');
  const bPawns = placements.filter((p) => p.color === 'b' && p.type === 'p');
  const wSpace = wPawns.reduce((sum, p) => sum + Math.max(0, p.rank - 2), 0);
  const bSpace = bPawns.reduce((sum, p) => sum + Math.max(0, 7 - p.rank), 0);
  const diff = wSpace - bSpace;
  if (Math.abs(diff) < 3) return [];
  const side: 'white' | 'black' = diff > 0 ? 'white' : 'black';
  return [
    mk('space', side, `${sideName(side)} has more space (pawns advanced further)`, Math.min(0.15, Math.abs(diff) * 0.02)),
  ];
}

const WHITE_HOME: Record<string, PieceSymbol> = { b1: 'n', g1: 'n', c1: 'b', f1: 'b', d1: 'q' };
const BLACK_HOME: Record<string, PieceSymbol> = { b8: 'n', g8: 'n', c8: 'b', f8: 'b', d8: 'q' };

function developmentImbalance(placements: Placement[]): Imbalance[] {
  // Once enough material is off the board, "development" has stopped meaning anything.
  const nonPawnKingCount = placements.filter((p) => p.type !== 'p' && p.type !== 'k').length;
  if (nonPawnKingCount < 10) return [];

  const bySquare = new Map(placements.map((p) => [p.square, p]));
  const developedCount = (home: Record<string, PieceSymbol>, color: ColorName): number => {
    let developed = 0;
    for (const [square, type] of Object.entries(home)) {
      const occupant = bySquare.get(square);
      const stillHome = occupant?.color === color && occupant.type === type;
      if (!stillHome) developed++; // moved out, or gone — either way it's no longer sitting undeveloped
    }
    return developed;
  };
  const wd = developedCount(WHITE_HOME, 'w');
  const bd = developedCount(BLACK_HOME, 'b');
  const diff = wd - bd;
  if (Math.abs(diff) < 2) return [];
  const side: 'white' | 'black' = diff > 0 ? 'white' : 'black';
  const [ahead, behind] = diff > 0 ? [wd, bd] : [bd, wd];
  return [
    mk(
      'development',
      side,
      `${sideName(side)} leads in development (${ahead} of 5 minor pieces/queen developed vs ${behind})`,
      Math.min(0.12, Math.abs(diff) * 0.04),
    ),
  ];
}

function kingSafetyImbalances(placements: Placement[]): Imbalance[] {
  // Not enough attacking material left for king safety to be a live concern.
  const nonPawnKingCount = placements.filter((p) => p.type !== 'p' && p.type !== 'k').length;
  if (nonPawnKingCount < 6) return [];

  const out: Imbalance[] = [];
  const wKing = placements.find((p) => p.color === 'w' && p.type === 'k');
  const bKing = placements.find((p) => p.color === 'b' && p.type === 'k');
  if (!wKing || !bKing) return [];

  const wCastled = wKing.square === 'g1' || wKing.square === 'c1';
  const bCastled = bKing.square === 'g8' || bKing.square === 'c8';
  if (wCastled && !bCastled && bKing.square === 'e8') {
    out.push(mk('king-safety', 'white', 'White has castled to safety; Black has not', 0.15));
  }
  if (bCastled && !wCastled && wKing.square === 'e1') {
    out.push(mk('king-safety', 'black', 'Black has castled to safety; White has not', 0.15));
  }

  const shieldFiles = (kingFile: number): number[] => [kingFile - 1, kingFile, kingFile + 1].filter((f) => f >= 0 && f <= 7);
  if (wCastled) {
    const files = shieldFiles(wKing.file);
    const present = files.filter((f) => placements.some((p) => p.color === 'w' && p.type === 'p' && p.file === f)).length;
    if (present <= 1) {
      out.push(
        mk('king-safety', 'black', `White's king shield is thin (${present} of ${files.length} pawns left)`, 0.1),
      );
    }
  }
  if (bCastled) {
    const files = shieldFiles(bKing.file);
    const present = files.filter((f) => placements.some((p) => p.color === 'b' && p.type === 'p' && p.file === f)).length;
    if (present <= 1) {
      out.push(
        mk('king-safety', 'white', `Black's king shield is thin (${present} of ${files.length} pawns left)`, 0.1),
      );
    }
  }
  return out;
}

function openFileImbalances(placements: Placement[]): Imbalance[] {
  const wFiles = new Set(placements.filter((p) => p.color === 'w' && p.type === 'p').map((p) => p.file));
  const bFiles = new Set(placements.filter((p) => p.color === 'b' && p.type === 'p').map((p) => p.file));
  const out: Imbalance[] = [];
  for (let f = 0; f < 8; f++) {
    const hasW = wFiles.has(f);
    const hasB = bFiles.has(f);
    if (!hasW && hasB) out.push(mk('open-file', 'white', `White has a half-open ${FILE_LETTERS[f]}-file to press on`, 0.05));
    else if (hasW && !hasB) out.push(mk('open-file', 'black', `Black has a half-open ${FILE_LETTERS[f]}-file to press on`, 0.05));
  }
  return out;
}

/**
 * Reads off every static imbalance we can detect from piece placement, and
 * folds their weights into a single 0..1 score via `1 - Π(1 - weight)` — a
 * handful of small imbalances compound instead of one dominating, and no
 * amount of stacking can push the score to (or past) 1.
 */
export function analyzeImbalances(chess: Chess): ImbalanceReport {
  const placements: Placement[] = [];
  for (const cell of chess.board()) {
    if (!cell) continue;
    placements.push({
      square: cell.square,
      file: cell.square.charCodeAt(0) - 97,
      rank: Number(cell.square[1]),
      type: cell.type,
      color: cell.color,
    });
  }

  const imbalances: Imbalance[] = [
    ...materialImbalance(placements),
    ...bishopPairImbalance(placements),
    ...bishopColorImbalance(placements),
    ...pawnStructureImbalances(placements),
    ...pawnIslandsImbalance(placements),
    ...spaceImbalance(placements),
    ...developmentImbalance(placements),
    ...kingSafetyImbalances(placements),
    ...openFileImbalances(placements),
  ];

  const score = 1 - imbalances.reduce((acc, i) => acc * (1 - i.weight), 1);
  return { score: Math.round(score * 100) / 100, imbalances };
}
