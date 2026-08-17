/**
 * Minimal PGN reading/writing.
 *
 * We need enough to ingest opening lines and to hand a study back to the user;
 * full PGN (recursive variations, NAG semantics) can come later if the trainer
 * wants to import annotated repertoires. Variations are skipped, not parsed.
 */

const RESULTS = new Set(['1-0', '0-1', '1/2-1/2', '*']);

export interface PgnGame {
  headers: Record<string, string>;
  /** Main-line SAN tokens, in order. */
  moves: string[];
  result: string;
}

/** Extracts main-line SAN tokens from movetext, dropping comments and sidelines. */
export function parseMoveText(text: string): string[] {
  const out: string[] = [];
  let depth = 0;

  // Strip { } comments first; they can contain anything, including parentheses.
  const cleaned = text.replace(/\{[^}]*\}/g, ' ').replace(/;[^\n]*/g, ' ');

  for (const raw of cleaned.split(/\s+/)) {
    if (!raw) continue;
    let token = raw;

    // Sidelines can open and close within a token, e.g. "(1.e4)".
    while (token.length) {
      if (token[0] === '(') {
        depth++;
        token = token.slice(1);
        continue;
      }
      if (token[0] === ')') {
        depth = Math.max(0, depth - 1);
        token = token.slice(1);
        continue;
      }
      break;
    }
    // Note the depth *before* closing parens: "Nf3)" is the last move of a
    // sideline, not a main-line move, even though depth is back to 0 after it.
    const inSideline = depth > 0;
    while (token.endsWith(')')) {
      depth = Math.max(0, depth - 1);
      token = token.slice(0, -1);
    }
    if (inSideline || !token) continue;

    if (token.startsWith('$')) continue; // NAG
    if (RESULTS.has(token)) continue;
    token = token.replace(/^\d+\.+/, ''); // "1." / "1..." glued to the move
    if (!token || token === '.' || token === '...') continue;
    if (/^\d+$/.test(token)) continue;
    out.push(token);
  }
  return out;
}

export function parsePgn(pgn: string): PgnGame {
  const headers: Record<string, string> = {};
  const lines = pgn.split(/\r?\n/);
  const body: string[] = [];

  for (const line of lines) {
    const header = /^\s*\[(\w+)\s+"([^"]*)"\]\s*$/.exec(line);
    if (header) {
      headers[header[1]!] = header[2]!;
      continue;
    }
    body.push(line);
  }

  const text = body.join(' ');
  const resultMatch = /(1-0|0-1|1\/2-1\/2|\*)\s*$/.exec(text.trim());
  return {
    headers,
    moves: parseMoveText(text),
    result: resultMatch?.[1] ?? headers.Result ?? '*',
  };
}

/** Renders SAN tokens as numbered movetext, wrapped at ~80 columns. */
export function formatMoveText(sanMoves: string[], startsWithBlack = false, result = '*'): string {
  const parts: string[] = [];
  let moveNumber = 1;
  let index = 0;

  if (startsWithBlack && sanMoves.length) {
    parts.push(`${moveNumber}...${sanMoves[0]}`);
    index = 1;
    moveNumber++;
  }
  for (; index < sanMoves.length; index += 2) {
    const white = sanMoves[index]!;
    const black = sanMoves[index + 1];
    parts.push(black ? `${moveNumber}.${white} ${black}` : `${moveNumber}.${white}`);
    moveNumber++;
  }
  if (result) parts.push(result);

  const out: string[] = [];
  let line = '';
  for (const part of parts) {
    if (line.length + part.length + 1 > 80) {
      out.push(line);
      line = '';
    }
    line = line ? `${line} ${part}` : part;
  }
  if (line) out.push(line);
  return out.join('\n');
}
