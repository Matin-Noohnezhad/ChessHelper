/**
 * PGN reading/writing.
 *
 * Two levels: {@link parsePgn} keeps only the main-line SAN tokens, which is all
 * the opening ingest needs, while {@link parseAnnotatedPgn} also keeps what real
 * exports from lichess and chess.com carry per move — clocks, published evals,
 * NAGs and comments — which the game review needs. {@link parseAnnotatedPgn}
 * also descends into sidelines, hanging each one off the move it replaces:
 * repertoire courses keep most of their teaching down there, so a reader that
 * drops variations throws away the better half of the file. {@link parsePgn}
 * still keeps the main line only.
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

/** The four colours lichess and chess.com draw with: `G`/`R`/`Y`/`B` in `[%cal …]`. */
export type ShapeColor = 'green' | 'red' | 'yellow' | 'blue';

export interface ShapeArrow {
  from: string;
  to: string;
  color: ShapeColor;
}

export interface ShapeCircle {
  square: string;
  color: ShapeColor;
}

/** Board drawings the author left on a move — `[%cal Gd2d4]`, `[%csl Re4]`. */
export interface MoveShapes {
  arrows: ShapeArrow[];
  circles: ShapeCircle[];
}

export interface PgnMove {
  san: string;
  /** `!`, `?`, `!?` … glued to the SAN token, if the exporter wrote any. */
  suffix?: string;
  /** Numeric annotation glyphs (`$1`, `$4`, …) attached to this move. */
  nags: number[];
  /** Comment text with the `[%…]` commands stripped out. */
  comment?: string;
  /** Arrows and circles drawn on this move — from `[%cal …]` / `[%csl …]`. */
  shapes?: MoveShapes;
  /** Clock left *after* the move, in seconds — `{[%clk 0:02:56.7]}`. */
  clockSeconds?: number;
  /** Time spent on the move, in seconds — `{[%emt 0:00:05]}`. */
  emtSeconds?: number;
  /** Published eval in centipawns from White's perspective — `{[%eval 0.35]}`. */
  evalCp?: number;
  /** Published forced mate from White's perspective — `{[%eval #-4]}`. */
  evalMate?: number;
  /**
   * Sidelines offered as alternatives to *this* move — `1. e4 e5 (1... c5 …)`
   * hangs the Sicilian off `e5`. Each entry is a line in its own right and may
   * nest further. Absent when the move has none, which is the common case.
   */
  variations?: PgnMove[][];
  /**
   * A passed turn — ChessBase writes `Z0`, other tools `--` or `0000`. Not a
   * chess move and not playable, but it has to be *kept*: dropping the token
   * silently shifts every move after it onto the wrong side, which turns the
   * rest of the line into notation that cannot be replayed.
   */
  nullMove?: true;
}

export interface AnnotatedPgnGame {
  headers: Record<string, string>;
  moves: PgnMove[];
  result: string;
  /** Starting position, from a `[FEN]` header, or the standard one. */
  startFen?: string;
}

/** Passed turns, as the tools that emit them write them. */
const NULL_MOVES = new Set(['--', 'Z0', '0000', 'z0', '@@@@']);

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

/** `G`/`R`/`Y`/`B` as `[%cal …]` writes them. */
const SHAPE_COLORS: Record<string, ShapeColor> = {
  G: 'green',
  R: 'red',
  Y: 'yellow',
  B: 'blue',
};

/** Reads `Gd2d4,Re1e5` (arrows) or `Gd4,Re5` (circles) into a move's shapes. */
function applyShapes(move: PgnMove, value: string, kind: 'cal' | 'csl'): void {
  for (const raw of value.split(',')) {
    const token = raw.trim();
    const color = SHAPE_COLORS[token[0]?.toUpperCase() ?? ''];
    if (!color) continue;
    const body = token.slice(1).toLowerCase();
    const shapes = (move.shapes ??= { arrows: [], circles: [] });
    if (kind === 'cal' && /^[a-h][1-8][a-h][1-8]$/.test(body)) {
      shapes.arrows.push({ from: body.slice(0, 2), to: body.slice(2, 4), color });
    } else if (/^[a-h][1-8]$/.test(body)) {
      shapes.circles.push({ square: body, color });
    }
  }
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
      case 'cal':
      case 'csl':
        applyShapes(move, value, match[1]!.toLowerCase() as 'cal' | 'csl');
        break;
      default:
        break; // other [%…] commands: nothing we render yet
    }
  }
  prose = prose.replace(commands, ' ').replace(/\s+/g, ' ').trim();
  if (prose) move.comment = move.comment ? `${move.comment} ${prose}` : prose;
}

/**
 * One line under construction: the moves so far, plus any comment seen before
 * its first move — `( {the point is} 1... c5 )` annotates the variation, and
 * there is no earlier move on that line to hang it on.
 */
interface LineFrame {
  line: PgnMove[];
  pending?: string;
}

/**
 * Walks movetext character by character rather than splitting on whitespace:
 * comments can contain parentheses, sidelines can be glued to moves, and a
 * clock comment has to land on the move it follows.
 *
 * Sidelines are read into a stack of frames. `(` opens a line that replaces the
 * move it follows, `)` returns to the parent, and everything — comments, NAGs,
 * suffixes — is applied to whichever frame is on top, so nesting costs nothing
 * extra.
 */
function scanMovetext(text: string): PgnMove[] {
  const root: PgnMove[] = [];
  const stack: LineFrame[] = [{ line: root }];
  let i = 0;

  const top = (): LineFrame => stack[stack.length - 1]!;
  const last = (): PgnMove | undefined => {
    const { line } = top();
    return line[line.length - 1];
  };

  while (i < text.length) {
    const ch = text[i]!;

    if (ch === '{') {
      const end = text.indexOf('}', i + 1);
      const body = text.slice(i + 1, end < 0 ? text.length : end);
      const target = last();
      if (target) applyComment(target, body);
      else {
        // Nothing to annotate yet: hold it for this line's first move.
        const frame = top();
        frame.pending = frame.pending ? `${frame.pending} ${body}` : body;
      }
      i = end < 0 ? text.length : end + 1;
      continue;
    }
    if (ch === ';') {
      const end = text.indexOf('\n', i);
      i = end < 0 ? text.length : end + 1;
      continue;
    }
    if (ch === '(') {
      const owner = last();
      const line: PgnMove[] = [];
      // A sideline with no move before it cannot be attached to anything, but
      // it still gets a frame so the parentheses stay balanced.
      if (owner) (owner.variations ??= []).push(line);
      stack.push({ line });
      i++;
      continue;
    }
    if (ch === ')') {
      if (stack.length > 1) stack.pop();
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
    if (!token) continue;

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
    const isNull = NULL_MOVES.has(san);
    if (!isNull && !SAN_RE.test(san)) continue; // move numbers, stray junk

    const move: PgnMove = { san: isNull ? '--' : san, nags: [] };
    if (isNull) move.nullMove = true;
    if (suffixMatch) move.suffix = suffixMatch[1]!;
    const frame = top();
    if (frame.pending !== undefined) {
      applyComment(move, frame.pending);
      frame.pending = undefined;
    }
    frame.line.push(move);
  }

  return root;
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
