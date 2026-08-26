/**
 * Pulls together everything the corpus says about one position, so it can be
 * read and distilled into a book entry.
 *
 * This is the reading step of the last stage. It does not write theory and it
 * does not decide anything — it gathers, dedupes and attributes, and a person
 * (or a model) reads the digest and writes the entry in their own words. What
 * ships in the book is the distillation; the course text stays here, in the
 * gitignored index, which is the whole point of keeping the two apart.
 *
 * Courses repeat themselves heavily — the same paragraph appears at the head of
 * every chapter that reaches the position — so near-duplicates are collapsed
 * and the number of times a claim was made is reported instead. That count is
 * useful on its own: a plan that eleven courses state independently is a
 * different kind of fact from one that appears once.
 *
 *   npx vite-node packages/opening-book/scripts/digest-node.ts -- --rank 1
 *
 *   --line "<san …>"  the position, as moves from the start
 *   --rank <n>        instead, take the nth entry of the coverage worklist
 *   --depth <n>       also include material up to n plies deeper (default 0)
 *   --min-chars <n>   ignore anything shorter (default 200)
 *   --max <n>         how many pieces to print (default 30)
 *   --corpus <path>   index directory (default: .corpus/)
 */

import { createReadStream, readFileSync } from 'node:fs';
import { createGunzip } from 'node:zlib';
import { createInterface } from 'node:readline';
import { basename, join, resolve } from 'node:path';
import { Position, START_FEN, loadFen, resolveSan } from '@coh/chess-core';
import { deepestOpening, identifyOpening } from '@coh/opening-book';

interface Options {
  line: string[];
  rank: number | null;
  depth: number;
  minChars: number;
  max: number;
  corpus: string;
}

function parseArgs(argv: string[]): Options {
  const options: Options = {
    line: [],
    rank: null,
    depth: 0,
    minChars: 200,
    max: 30,
    corpus: resolve('.corpus'),
  };
  for (let i = 0; i < argv.length; i += 2) {
    const value = argv[i + 1];
    switch (argv[i]) {
      case '--line':
        options.line = value!.split(/\s+/).filter(Boolean);
        break;
      case '--rank':
        options.rank = Number(value);
        break;
      case '--depth':
        options.depth = Number(value);
        break;
      case '--min-chars':
        options.minChars = Number(value);
        break;
      case '--max':
        options.max = Number(value);
        break;
      case '--corpus':
        options.corpus = resolve(value!);
        break;
      default:
        throw new Error(`unknown argument: ${argv[i]}`);
    }
  }
  return options;
}

/** Game references pasted into a comment, not teaching. */
const CITATION = /^(?:1-0|0-1|1\/2-1\/2|\*)\s*\(\d+\)/;

/**
 * Chessable wraps every square and piece in brackets — `[e4]`, `[Qd2]`, `[g2]-g4`
 * — and embeds whole FENs inline for its board widget. All of it is markup for
 * a viewer we do not have, and noise to read through.
 */
function clean(text: string): string {
  return text
    .replace(/@@StartFEN@@.*?@@EndFEN@@/g, ' ')
    .replace(/`[^`]*\/[^`]*`/g, ' ') // backtick-quoted FENs
    .replace(/\[([^\]]{1,6})\]/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Words that mark a passage as being about how to *play* the position rather
 * than about the author's relationship with the opening. The corpus is full of
 * chapter prefaces — "I picked up the Classical Sicilian in 2016" — which are
 * long, repeated in every game of the course, and worthless here. Sorting by
 * length or by repetition puts them at the top; sorting by this does not.
 */
const TEACHING = [
  'advance', 'attack', 'backward', 'bishop pair', 'blockade', 'break', 'castle',
  'centre', 'center', 'chain', 'control', 'defend', 'diagonal', 'endgame',
  'exchange', 'file', 'idea', 'initiative', 'isolated', 'king', 'majority',
  'maneuver', 'manoeuvre', 'outpost', 'pawn', 'plan', 'pressure', 'push',
  'sacrifice', 'space', 'square', 'structure', 'target', 'tempo', 'trade',
  'weak', 'wing',
];

/** Teaching words per hundred, which is what separates a plan from a preface. */
function relevance(text: string): number {
  const lower = text.toLowerCase();
  const words = lower.split(/\s+/).length;
  let hits = 0;
  for (const term of TEACHING) {
    // Count each term, not just presence: density is the signal.
    let from = 0;
    for (;;) {
      const at = lower.indexOf(term, from);
      if (at < 0) break;
      hits++;
      from = at + term.length;
    }
  }
  return (100 * hits) / Math.max(words, 1);
}

/** Near-duplicate key: courses restate the same paragraph verbatim. */
const fingerprint = (text: string): string =>
  text.toLowerCase().replace(/[^a-z0-9 ]/g, '').slice(0, 120);

interface Piece {
  text: string;
  sources: Set<string>;
  /**
   * How many games carried this text. Within one course that is repetition,
   * not agreement — a chapter preface is attached to every line in the chapter
   * — so it is reported but never ranked on.
   */
  said: number;
  ply: number;
  line: string;
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));

  let line = options.line;
  if (options.rank !== null) {
    const coverage = JSON.parse(readFileSync(join(options.corpus, 'coverage.json'), 'utf8'));
    const entry = coverage.worklist[options.rank - 1];
    if (!entry) throw new Error(`worklist has no rank ${options.rank}`);
    line = entry.moves;
  }
  if (!line.length) throw new Error('pass --line or --rank');

  // The keys of the target position and, if asked, of everything below it.
  const pos = new Position();
  loadFen(pos, START_FEN);
  for (const san of line) {
    const move = resolveSan(pos, san);
    if (!move) throw new Error(`"${san}" is not legal in ${line.join(' ')}`);
    pos.make(move);
  }
  const targetKey = pos.key();

  const sourceNames: string[] = JSON.parse(
    readFileSync(join(options.corpus, 'manifest.json'), 'utf8'),
  ).sources.map((source: { path: string }) => basename(source.path, '.pgn'));

  const named = identifyOpening(line);
  const opening = deepestOpening(line);
  console.log(`${line.join(' ')}`);
  console.log(`${opening?.eco ?? '—'} ${opening?.name ?? 'not a named line'}`);
  if (named?.theorySource) console.log(`currently shows theory from: ${named.theorySource.name}`);
  // Ranks come from coverage.json, which goes stale the moment an entry is
  // written. Say so rather than let a batch be spent on finished work.
  if (opening?.theory) {
    console.log(
      '\n*** This node already carries its own theory. If you reached it by --rank, ' +
        're-run `npm run report:coverage` first — the worklist is out of date. ***',
    );
  }
  console.log(`position ${targetKey}, depth ${options.depth}, min ${options.minChars} chars\n`);

  const byFingerprint = new Map<string, Piece>();
  const prefix = line.join(' ');
  let scanned = 0;

  const input = createReadStream(join(options.corpus, 'annotations.jsonl.gz')).pipe(createGunzip());
  for await (const raw of createInterface({ input })) {
    if (!raw.includes(targetKey) && options.depth === 0) continue;
    const rec = JSON.parse(raw) as {
      key: string;
      line: string;
      ply: number;
      text: string;
      src: number;
      startFen?: string;
    };
    if (rec.startFen) continue;

    const atTarget = rec.key === targetKey;
    // Below the target: same move order, at most `depth` plies further on. A
    // transposition into the subtree is not detectable from the key alone, so
    // this deliberately under-reports rather than guess.
    const below =
      options.depth > 0 &&
      rec.line.startsWith(`${prefix} `) &&
      rec.ply <= line.length + options.depth;
    if (!atTarget && !below) continue;

    const text = clean(rec.text);
    if (text.length < options.minChars || CITATION.test(text)) continue;
    scanned++;

    const key = fingerprint(text);
    let piece = byFingerprint.get(key);
    if (!piece) {
      byFingerprint.set(
        key,
        (piece = { text, sources: new Set(), said: 0, ply: rec.ply, line: rec.line }),
      );
    }
    // Keep the fullest telling of a repeated point.
    if (text.length > piece.text.length) piece.text = text;
    piece.said++;
    piece.sources.add(sourceNames[rec.src] ?? `source ${rec.src}`);
  }

  // Independent agreement first, then how much of the passage is about play.
  const score = (piece: Piece): number => piece.sources.size * 3 + relevance(piece.text);
  const pieces = [...byFingerprint.values()].sort((a, b) => score(b) - score(a));
  const courses = new Set(pieces.flatMap((piece) => [...piece.sources]));
  console.log(
    `${scanned} pieces, ${pieces.length} distinct, from ${courses.size} courses ` +
      `— showing ${Math.min(options.max, pieces.length)}\n`,
  );

  for (const [index, piece] of pieces.slice(0, options.max).entries()) {
    const where = piece.ply === line.length ? 'here' : `+${piece.ply - line.length}: ${piece.line}`;
    console.log(
      `── [${index + 1}] ${piece.sources.size} courses, in ${piece.said} games, ` +
        `signal ${relevance(piece.text).toFixed(1)} · ${where}`,
    );
    console.log(`   ${[...piece.sources].slice(0, 4).join('; ')}`);
    console.log(`   ${piece.text}\n`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
