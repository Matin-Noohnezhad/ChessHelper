import { Chess } from '@coh/chess-core';

export interface ExplanationMove {
  san: string;
  label: string;
  start: number;
  end: number;
  fen: string;
  from: string;
  to: string;
}
export interface ExplanationLine {
  startFen: string;
  moves: ExplanationMove[];
}

const SAN = '(?:[O0]-[O0](?:-[O0])?|[KQRBN](?:[a-h][1-8]|[a-h]|[1-8])?x?[a-h][1-8]|[a-h](?:x[a-h])?[1-8](?:=?[QRBN])?)[+#]?[!?]*';
const tokenPattern = new RegExp(`(?<![\\w])(?:(\\d+)\\s*(\\.{1,3}|…)\\s*)?(${SAN})(?![\\w])`, 'g');
const positionPly = (fen: string) => {
  const fields = fen.split(' ');
  return (Number(fields[5]) - 1) * 2 + (fields[1] === 'b' ? 1 : 0);
};

/** Resolve numbered prose references against the course path and earlier examples.
 * Prose is never executed: only SAN moves legal in an established position link.
 * Unnumbered plans separated by prose deliberately stay as text.
 */
export function explanationLines(text: string, startFen: string, path: readonly { san: string }[]): ExplanationLine[] {
  const game = new Chess(startFen);
  const positions = [game.fen()];
  for (const node of path) {
    if (!game.move(node.san)) break;
    positions.push(game.fen());
  }
  const tokens = [...text.matchAll(tokenPattern)];
  const lines: ExplanationLine[] = [];
  for (let i = 0; i < tokens.length;) {
    const first = tokens[i]!;
    if (!first[1]) { i++; continue; }
    const target = (Number(first[1]) - 1) * 2 + (first[2] === '.' ? 0 : 1);
    // Prefer the most recently discussed example, but try the course position too.
    const candidates = [...new Set([...positions].reverse())].filter((fen) => positionPly(fen) === target);
    let best: ExplanationLine | undefined;
    for (const fen of candidates) {
      const probe = new Chess(fen);
      const moves: ExplanationMove[] = [];
      for (let j = i; j < tokens.length; j++) {
        const token = tokens[j]!;
        if (j > i && !/^\s*$/.test(text.slice(tokens[j - 1]!.index! + tokens[j - 1]![0].length, token.index))) break;
        if (token[1] && positionPly(probe.fen()) !== (Number(token[1]) - 1) * 2 + (token[2] === '.' ? 0 : 1)) break;
        const before = probe.fen().split(' ');
        const move = probe.move(token[3]!.replace(/0/g, 'O').replace(/[!?]+$/, ''));
        if (!move) break;
        moves.push({ san: move.san, label: `${before[5]}${before[1] === 'w' ? '.' : '…'} ${move.san}`,
          start: token.index!, end: token.index! + token[0].length, fen: probe.fen(), from: move.from, to: move.to });
      }
      if (moves.length && (!best || moves.length > best.moves.length)) best = { startFen: fen, moves };
    }
    if (best) {
      lines.push(best);
      // Keep the starting position too, so a later alternative can branch here.
      positions.push(best.startFen, ...best.moves.map((move) => move.fen));
      i += best.moves.length;
    } else i++;
  }
  return lines;
}
