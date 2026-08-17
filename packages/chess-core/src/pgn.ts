/**
 * PGN reading/writing.
 *
 * Two levels: {@link parsePgn} keeps only the main-line SAN tokens, which is all
 * the opening ingest needs, while {@link parseAnnotatedPgn} also keeps what real
 * exports from lichess and chess.com carry per move — clocks, published evals,
 * NAGs and comments — which the game review needs. Variations are skipped in
 * both, not parsed.
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

/* ----------------------------------------------------- annotated PGN --- */

export interface PgnMove {
  san: string;
  /** `!`, `?`, `!?` … glued to the SAN token, if the exporter wrote any. */
  suffix?: string;
  /** Numeric annotation glyphs (`$1`, `$4`, …) attached to this move. */
  nags: number[];
  /** Comment text with the `[%…]` commands stripped out. */
  comment?: string;
  /** Clock left *after* the move, in seconds — `{[%clk 0:02:56.7]}`. */
  clockSeconds?: number;
  /** Time spent on the move, in seconds — `{[%emt 0:00:05]}`. */
  emtSeconds?: number;
  /** Published eval in centipawns from White's perspective — `{[%eval 0.35]}`. */
  evalCp?: number;
  /** Published forced mate from White's perspective — `{[%eval #-4]}`. */
  evalMate?: number;
}

export interface AnnotatedPgnGame {
  headers: Record<string, string>;
  moves: PgnMove[];
  result: string;
  /** Starting position, from a `[FEN]` header, or the standard one. */
  startFen?: string;
}

/** SAN, loosely: enough to reject junk tokens without re-implementing the parser. */
const SAN_RE = /^(?:O-O-O|O-O|0-0-0|0-0|[KQRBN][a-h]?[1-8]?x?[a-h][1-8]|[a-h](?:[1-8]|x[a-h][1-8])(?:=[QRBN])?)[+#]?$/;

/** `0:02:56.7`, `2:56.7` and `56.7` all appear in the wild; all mean seconds left. */
function parseClock(text: string): number | null {
  const match = /^(?:(\d+):)?(?:(\d+):)?(\d+(?:\.\d+)?)$/.exec(text.trim());
  if (!match) return null;
  const parts = [match[1], match[2], match[3]].filter((p) => p !== undefined) as string[];
  let seconds = 0;
  for (const part of parts) seconds = seconds * 60 + Number(part);
  return Number.isFinite(seconds) ? seconds : null;
}

/** `#-4` is a mate score; everything else is pawns, the way lichess writes it. */
function parseEval(text: string): { evalCp?: number; evalMate?: number } {
  const value = text.trim();
  const mate = /^#(-?\d+)$/.exec(value);
  if (mate) return { evalMate: Number(mate[1]) };
  const pawns = Number(value);
  if (!Number.isFinite(pawns)) return {};
  return { evalCp: Math.round(pawns * 100) };
}

/** Pulls `[%clk …]`-style commands out of a comment, leaving the prose behind. */
function applyComment(move: PgnMove, body: string): void {
  let prose = body;
  const commands = /\[%(\w+)\s+([^\]]*)\]/g;
  let match: RegExpExecArray | null;
  while ((match = commands.exec(body)) !== null) {
    const value = match[2]!;
    switch (match[1]!.toLowerCase()) {
      case 'clk': {
        const seconds = parseClock(value);
        if (seconds !== null) move.clockSeconds = seconds;
        break;
      }
      case 'emt': {
        const seconds = parseClock(value);
        if (seconds !== null) move.emtSeconds = seconds;
        break;
      }
      case 'eval':
        Object.assign(move, parseEval(value));
        break;
      default:
        break; // %cal, %csl and friends: annotations we do not render yet
    }
  }
  prose = prose.replace(commands, ' ').replace(/\s+/g, ' ').trim();
  if (prose) move.comment = move.comment ? `${move.comment} ${prose}` : prose;
}

/**
 * Walks movetext character by character rather than splitting on whitespace:
 * comments can contain parentheses, sidelines can be glued to moves, and a
 * clock comment has to land on the move it follows.
 */
function scanMovetext(text: string): PgnMove[] {
  const moves: PgnMove[] = [];
  let depth = 0; // > 0 means we are inside a sideline
  let i = 0;

  const last = (): PgnMove | undefined => moves[moves.length - 1];

  while (i < text.length) {
    const ch = text[i]!;

    if (ch === '{') {
      const end = text.indexOf('}', i + 1);
      const body = text.slice(i + 1, end < 0 ? text.length : end);
      const target = last();
      if (!depth && target) applyComment(target, body);
      i = end < 0 ? text.length : end + 1;
      continue;
    }
    if (ch === ';') {
      const end = text.indexOf('\n', i);
      i = end < 0 ? text.length : end + 1;
      continue;
    }
    if (ch === '(') {
      depth++;
      i++;
      continue;
    }
    if (ch === ')') {
      depth = Math.max(0, depth - 1);
      i++;
      continue;
    }
    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    let end = i;
    while (end < text.length && !/[\s{};()]/.test(text[end]!)) end++;
    const token = text.slice(i, end);
    i = end;
    if (depth || !token) continue;

    if (token.startsWith('$')) {
      const nag = Number(token.slice(1));
      if (Number.isFinite(nag)) last()?.nags.push(nag);
      continue;
    }
    if (RESULTS.has(token)) continue;

    const bare = token.replace(/^\d+\.*/, '').replace(/^\.+/, '');
    if (!bare) continue;

    const suffixMatch = /([!?]+)$/.exec(bare);
    const san = suffixMatch ? bare.slice(0, -suffixMatch[1]!.length) : bare;
    if (!SAN_RE.test(san)) continue; // move numbers, "--", "Z0", stray junk

    const move: PgnMove = { san, nags: [] };
    if (suffixMatch) move.suffix = suffixMatch[1]!;
    moves.push(move);
  }

  return moves;
}

/** Parses one game, keeping per-move clocks, evals, NAGs and comments. */
export function parseAnnotatedPgn(pgn: string): AnnotatedPgnGame {
  const headers: Record<string, string> = {};
  const body: string[] = [];

  for (const line of pgn.split(/\r?\n/)) {
    const header = /^\s*\[(\w+)\s+"([^"]*)"\]\s*$/.exec(line);
    if (header) headers[header[1]!] = header[2]!;
    else body.push(line);
  }

  const text = body.join('\n');
  const resultMatch = /(1-0|0-1|1\/2-1\/2|\*)\s*$/.exec(text.trim());
  const game: AnnotatedPgnGame = {
    headers,
    moves: scanMovetext(text),
    result: resultMatch?.[1] ?? headers.Result ?? '*',
  };
  if (headers.FEN) game.startFen = headers.FEN;
  return game;
}

/**
 * Splits a multi-game PGN file into per-game chunks. A header line that follows
 * movetext starts the next game — the only marker PGN really gives us, since
 * `[Event …]` is not guaranteed to be first in a hand-edited file.
 */
export function splitPgnGames(text: string): string[] {
  const games: string[] = [];
  let current: string[] = [];
  let sawMoves = false;

  const flush = () => {
    const chunk = current.join('\n').trim();
    if (chunk) games.push(chunk);
    current = [];
    sawMoves = false;
  };

  for (const line of text.split(/\r?\n/)) {
    const isHeader = /^\s*\[\w+\s+"/.test(line);
    if (isHeader && sawMoves) flush();
    if (!isHeader && line.trim()) sawMoves = true;
    current.push(line);
  }
  flush();
  return games;
}

/** Parses every game in a PGN file. */
export function parseAnnotatedPgnAll(text: string): AnnotatedPgnGame[] {
  return splitPgnGames(text)
    .map(parseAnnotatedPgn)
    .filter((game) => game.moves.length > 0);
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
