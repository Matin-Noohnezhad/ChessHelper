/**
 * Builds the local annotation index over a directory of PGN files.
 *
 * The opening book's teaching content is hand-written and therefore thin: 31
 * of 3,826 lines carry theory, and most of the rest inherit plans from an
 * ancestor several moves shallower. Annotated repertoire courses already say
 * the things those lines are missing — the plans, the breaks, the manoeuvres —
 * they just say them in prose attached to a move rather than in a data
 * structure. This script turns that prose into something addressable: every
 * comment in the corpus, keyed by the position it was written about.
 *
 * It is the enabling step, not the payoff. Nothing here decides what is true or
 * what belongs in the book; it only makes it possible to ask "what has anyone
 * written about *this* position" without re-reading 400MB.
 *
 * Output is a cache, not a source: it is derived from files the user owns, much
 * of it commercial, so it stays local and gitignored. Only the distilled result
 * of a later stage — written in our own words, with provenance — belongs in the
 * repository.
 *
 *   npx vite-node packages/opening-book/scripts/index-corpus.ts --dir <path>
 *
 *   --dir <path>     directory of .pgn files (repeatable)
 *   --out <path>     output directory (default: .corpus/)
 *   --max-ply <n>    stop walking a line here (default: 60, i.e. move 30)
 *   --min-chars <n>  ignore comments shorter than this (default: 0, keep all)
 *   --limit <n>      only read the first n files, for a smoke run
 *   --verify         cross-check the fast SAN resolver against parseSan
 */

import { createWriteStream } from 'node:fs';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';
import { join, resolve } from 'node:path';
import {
  Position,
  START_FEN,
  WHITE,
  loadFen,
  parseAnnotatedPgnAll,
  parseSan,
  resolveSan,
} from '@coh/chess-core';
import type { AnnotatedPgnGame, PgnMove } from '@coh/chess-core';

/* ------------------------------------------------------------- options --- */

interface Options {
  dirs: string[];
  out: string;
  maxPly: number;
  minChars: number;
  limit: number;
  verify: boolean;
}

function parseArgs(argv: string[]): Options {
  const options: Options = {
    dirs: [],
    out: resolve('.corpus'),
    maxPly: 60,
    minChars: 0,
    limit: Infinity,
    verify: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const flag = argv[i];
    const value = argv[i + 1];
    switch (flag) {
      case '--dir':
        options.dirs.push(resolve(value!));
        i++;
        break;
      case '--out':
        options.out = resolve(value!);
        i++;
        break;
      case '--max-ply':
        options.maxPly = Number(value);
        i++;
        break;
      case '--min-chars':
        options.minChars = Number(value);
        i++;
        break;
      case '--limit':
        options.limit = Number(value);
        i++;
        break;
      case '--verify':
        options.verify = true;
        break;
      default:
        throw new Error(`unknown argument: ${flag}`);
    }
  }
  if (!options.dirs.length) throw new Error('at least one --dir is required');
  return options;
}

/* -------------------------------------------------------------- output --- */

/**
 * One comment, addressed by the position it follows.
 *
 * `key` is the Zobrist hash after the move, which is what a position-keyed
 * lookup joins on; `line` is the SAN path that reached it, which is what the
 * opening book is keyed by. Both are needed — the book addresses openings by
 * move order, but transpositions only collapse under the hash.
 */
interface Annotation {
  key: string;
  /** SAN path from the start of the game, space separated. */
  line: string;
  /**
   * Set only when the game did not start from the initial position — endgame
   * manuals and puzzle books are full of these. Without it `line` reads like an
   * opening sequence and would join against the book as one.
   */
  startFen?: string;
  /** The move this comment was written after. */
  san: string;
  ply: number;
  /** Whose move it was: `w` or `b`. */
  side: 'w' | 'b';
  /** True when the move sits inside a sideline rather than the main line. */
  sideline: boolean;
  /** `!`, `?`, `!?` … as written. */
  suffix?: string;
  nags?: number[];
  text: string;
  /** Index into the manifest's `sources`. */
  src: number;
  /** Index of the game within that source file. */
  game: number;
}

interface GameRecord {
  src: number;
  game: number;
  headers: Record<string, string>;
}

interface SourceRecord {
  id: number;
  path: string;
  sha256: string;
  bytes: number;
  games: number;
  annotations: number;
  /** Moves that would not replay — a corrupt line, or notation we cannot read. */
  illegal: number;
  /** Lines cut short at a passed turn (`Z0`, `--`) rather than at an error. */
  nulls: number;
  /** Positions reached, which is what the counts above should be read against. */
  nodes: number;
  /** Set when an identical file was already read; nothing was indexed twice. */
  duplicateOf?: string;
  error?: string;
}

/**
 * Streams JSONL through gzip. The index runs to hundreds of megabytes of prose
 * and is written once per corpus change, so it is worth the compression; every
 * reader downstream is streaming anyway.
 */
class JsonlWriter {
  private readonly input = new Readable({ read() {} });
  private readonly done: Promise<void>;
  count = 0;

  constructor(path: string) {
    this.done = pipeline(this.input, createGzip(), createWriteStream(path));
  }

  write(record: unknown): void {
    this.count++;
    // Back-pressure is handled by the Readable's own buffer; push returning
    // false only means "slow down", and the corpus is small enough that
    // buffering a few megabytes is cheaper than awaiting every line.
    this.input.push(`${JSON.stringify(record)}\n`);
  }

  async close(): Promise<void> {
    this.input.push(null);
    await this.done;
  }
}

/* --------------------------------------------------------------- walk --- */

interface WalkContext {
  pos: Position;
  path: string[];
  /** The game's starting position, when it is not the standard one. */
  startFen?: string;
  options: Options;
  annotations: JsonlWriter;
  src: number;
  game: number;
  stats: { nodes: number; illegal: number; nulls: number; annotations: number };
}

/**
 * Depth-first over one game, descending into every sideline.
 *
 * A sideline replaces the move it hangs off, so it is walked *before* that move
 * is played — from the same position the main move would have been played in.
 * The board is restored by unmaking exactly what was made, which matters here:
 * a line that dies on an unreadable move must not leave the position shifted
 * for its siblings.
 */
function walk(context: WalkContext, line: PgnMove[], sideline: boolean): void {
  const { pos, path, options, stats } = context;
  let played = 0;

  for (const move of line) {
    if (path.length >= options.maxPly) break;

    // A passed turn cannot be played, and everything after it belongs to a
    // position we have no way to reach. Stop here rather than replay the rest
    // against a board that is a tempo out — that is what silently produces
    // thousands of "unreadable" moves in training material.
    if (move.nullMove) {
      stats.nulls++;
      break;
    }

    for (const variation of move.variations ?? []) walk(context, variation, true);

    const resolved = resolveSan(pos, move.san);
    if (options.verify && resolved !== parseSan(pos, move.san)) {
      throw new Error(`resolveSan disagrees with parseSan on "${move.san}" at ${pos.key()}`);
    }
    if (resolved === null) {
      stats.illegal++;
      break; // everything after an unreadable move is unanchored guesswork
    }

    const side: 'w' | 'b' = pos.turn === WHITE ? 'w' : 'b';
    pos.make(resolved);
    played++;
    path.push(move.san);
    stats.nodes++;

    const text = move.comment?.trim();
    if (text && text.length >= options.minChars) {
      const record: Annotation = {
        key: pos.key(),
        line: path.join(' '),
        san: move.san,
        ply: path.length,
        side,
        sideline,
        text,
        src: context.src,
        game: context.game,
      };
      if (context.startFen) record.startFen = context.startFen;
      if (move.suffix) record.suffix = move.suffix;
      if (move.nags.length) record.nags = move.nags;
      context.annotations.write(record);
      stats.annotations++;
    }
  }

  for (let i = 0; i < played; i++) {
    pos.unmake();
    path.pop();
  }
}

function indexGame(
  game: AnnotatedPgnGame,
  context: Omit<WalkContext, 'pos' | 'path'>,
): void {
  const pos = new Position();
  const startFen = game.startFen && game.startFen !== START_FEN ? game.startFen : undefined;
  loadFen(pos, startFen ?? START_FEN);
  walk({ ...context, pos, path: [], startFen }, game.moves, false);
}

/* ----------------------------------------------------------------- run --- */

async function pgnFiles(dirs: string[]): Promise<string[]> {
  const files: string[] = [];
  for (const dir of dirs) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      if (entry.isFile() && entry.name.toLowerCase().endsWith('.pgn')) {
        files.push(join(dir, entry.name));
      }
    }
  }
  return files.sort();
}

const mb = (bytes: number): string => `${(bytes / 1048576).toFixed(1)}MB`;

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  await mkdir(options.out, { recursive: true });

  const files = (await pgnFiles(options.dirs)).slice(0, options.limit);
  console.log(`${files.length} PGN files under ${options.dirs.join(', ')}`);

  const annotations = new JsonlWriter(join(options.out, 'annotations.jsonl.gz'));
  const games = new JsonlWriter(join(options.out, 'games.jsonl.gz'));
  const sources: SourceRecord[] = [];
  const seen = new Map<string, string>(); // sha256 -> first path that had it

  const started = Date.now();
  let nodes = 0;

  for (const [id, path] of files.entries()) {
    const raw = await readFile(path);
    const sha256 = createHash('sha256').update(raw).digest('hex');
    const source: SourceRecord = {
      id,
      path,
      sha256,
      bytes: raw.length,
      games: 0,
      annotations: 0,
      illegal: 0,
      nulls: 0,
      nodes: 0,
    };

    // The collection carries a lot of re-downloads of the same course; reading
    // one twice would double-count every line it contains.
    const first = seen.get(sha256);
    if (first) {
      source.duplicateOf = first;
      sources.push(source);
      continue;
    }
    seen.set(sha256, path);

    const stats = { nodes: 0, illegal: 0, nulls: 0, annotations: 0 };
    try {
      const parsed = parseAnnotatedPgnAll(raw.toString('utf8'));
      source.games = parsed.length;
      for (const [game, parsedGame] of parsed.entries()) {
        const record: GameRecord = { src: id, game, headers: parsedGame.headers };
        games.write(record);
        indexGame(parsedGame, { options, annotations, src: id, game, stats });
      }
    } catch (error) {
      source.error = error instanceof Error ? error.message : String(error);
    }

    source.annotations = stats.annotations;
    source.illegal = stats.illegal;
    source.nulls = stats.nulls;
    source.nodes = stats.nodes;
    nodes += stats.nodes;
    sources.push(source);

    const elapsed = (Date.now() - started) / 1000;
    console.log(
      `[${id + 1}/${files.length}] ${mb(raw.length)} ${source.games} games ` +
        `${stats.annotations} annotations ${stats.illegal} unreadable ` +
        `${stats.nulls} passed · ` +
        `${Math.round(nodes / elapsed / 1000)}k nodes/s · ${path.split('/').pop()}`,
    );
  }

  await annotations.close();
  await games.close();

  const manifest = {
    generatedAt: new Date().toISOString(),
    dirs: options.dirs,
    maxPly: options.maxPly,
    minChars: options.minChars,
    totals: {
      files: files.length,
      duplicates: sources.filter((s) => s.duplicateOf).length,
      failed: sources.filter((s) => s.error).length,
      bytes: sources.reduce((sum, s) => sum + (s.duplicateOf ? 0 : s.bytes), 0),
      games: games.count,
      annotations: annotations.count,
      nodes,
      illegal: sources.reduce((sum, s) => sum + s.illegal, 0),
      nulls: sources.reduce((sum, s) => sum + s.nulls, 0),
    },
    sources,
  };
  await writeFile(join(options.out, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

  const seconds = (Date.now() - started) / 1000;
  console.log(
    `\n${manifest.totals.annotations} annotations over ${manifest.totals.games} games ` +
      `from ${files.length - manifest.totals.duplicates} distinct files ` +
      `(${manifest.totals.duplicates} duplicates skipped, ${manifest.totals.failed} failed)\n` +
      `${nodes} nodes replayed, ${manifest.totals.illegal} unreadable, ` +
      `${manifest.totals.nulls} lines cut at a passed turn, in ${seconds.toFixed(0)}s\n` +
      `written to ${options.out}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
