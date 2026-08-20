/**
 * Joins the annotation index against the opening book and reports where the
 * book is weakest *and* the corpus is richest.
 *
 * The point is to stop guessing about where the effort goes. There are 3,826
 * lines in the book and 1.6M annotations in the index; almost none of that
 * material is worth distilling, and the part that is worth distilling is not
 * evenly spread. This produces two lists:
 *
 *  - a **worklist** of book nodes whose teaching content is inherited from far
 *    above and that the corpus discusses in depth, ranked so the top of the
 *    list is the next thing to write;
 *  - an **unnamed** list of positions the corpus discusses at length that the
 *    book has no entry for at any depth. Most of these are not missing
 *    openings, only intermediate nodes the ECO tables skip, so the list shows
 *    the ones that sit well past any named line.
 *
 * Two counts are kept per node. `direct` is annotations at exactly this
 * position, matched on the Zobrist key so transpositions collapse the way they
 * should. `subtree` is annotations at or below the node, matched on the move
 * sequence — a different question ("how much is written about this opening")
 * with a different answer.
 *
 *   npx vite-node packages/opening-book/scripts/corpus-coverage.ts
 *
 *   --corpus <path>   index directory (default: .corpus/)
 *   --min-chars <n>   what counts as substantial prose (default: 200)
 *   --min-gap <n>     plies below the theory source before a node is "thin" (default: 4)
 *   --min-prose <n>   drop rows with fewer *distinct* passages than this (default: 0)
 *   --min-sources <n> drop worklist rows backed by fewer courses than this (default: 0)
 *   --top <n>         rows to print per list (default: 40)
 */

import { createReadStream } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { createGunzip } from 'node:zlib';
import { createInterface } from 'node:readline';
import { join, resolve } from 'node:path';
import { Position, START_FEN, loadFen, resolveSan } from '@coh/chess-core';
import { OPENINGS, inheritTheory } from '@coh/opening-book';
import type { Opening } from '@coh/opening-book';

interface Options {
  corpus: string;
  minChars: number;
  minGap: number;
  /** Floor on how much prose a node must have before it is worth writing up. */
  minProse: number;
  /** Floor on how many separate courses back it — corroboration, not volume. */
  minSources: number;
  top: number;
}

function parseArgs(argv: string[]): Options {
  const options: Options = {
    corpus: resolve('.corpus'),
    minChars: 200,
    minGap: 4,
    minProse: 0,
    minSources: 0,
    top: 40,
  };
  for (let i = 0; i < argv.length; i += 2) {
    const value = argv[i + 1];
    switch (argv[i]) {
      case '--corpus':
        options.corpus = resolve(value!);
        break;
      case '--min-chars':
        options.minChars = Number(value);
        break;
      case '--min-gap':
        options.minGap = Number(value);
        break;
      case '--min-prose':
        options.minProse = Number(value);
        break;
      case '--min-sources':
        options.minSources = Number(value);
        break;
      case '--top':
        options.top = Number(value);
        break;
      default:
        throw new Error(`unknown argument: ${argv[i]}`);
    }
  }
  return options;
}

/**
 * Game references rather than teaching: annotators paste the source game into a
 * comment, and at 200-odd characters of player names and ratings it would
 * otherwise pass for substance.
 */
const CITATION = /^(?:1-0|0-1|1\/2-1\/2|\*)\s*\(\d+\)/;

/**
 * Rows that clear the numeric bar but cannot be written, with the reason. Both
 * were read independently by two sessions that reached the same conclusion; the
 * list exists so a third does not have to spend a batch reaching it again.
 *
 * A row belongs here only when the *material* is the problem — the corpus has
 * nothing to say about the position, or says only what an existing entry
 * already says. A row that is merely hard, or thin, does not belong here.
 */
const UNWRITABLE = new Map<string, string>([
  [
    'e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 O-O c3 d5 exd5 Nxd5 Nxe5 Nxe5 Rxe5 c6',
    'Marshall Modern: the digest returns the same passages from the same courses that the parent Marshall Attack entry already distils, one move earlier. Any entry would restate it.',
  ],
  [
    'e4 e5 Nf3 Nc6 Nc3 Nf6 d4 exd4 Nxd4 Nxe4',
    'Schmid Defence: the distinct passages are marketing, autobiography and move-frequency statistics from two courses. Depth 3 surfaces nothing further. No plan content exists to distil.',
  ],
  [
    'e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 d6 Bc4 e6',
    'Sozin Leonhardt: the distinct passages are chapter prefaces from two courses, each announcing that 6...e6 is the most popular reply and blunts the bishop on c4. The one plan sentence among them — Black follows with ...Be7 and short castling — is already in the Classical Variation entry four plies above. Depth 3 and a 90-character floor surface nothing further.',
  ],
  [
    'e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 c4',
    'Petrov Kaufmann Attack: four passages that survive deduplication are four phrasings of one sentence from a single course — free piece play as in the main lines, without the theory, followed by d3, d4, Nc3 and Bd3. One course saying one thing is not corroboration, and the sentence itself is a move list.',
  ],
]);

/** Same near-duplicate key the digest uses, so the two agree on what is one piece. */
const fingerprint = (text: string): string =>
  text.toLowerCase().replace(/[^a-z0-9 ]/g, '').slice(0, 120);

/* ---------------------------------------------------------------- book --- */

interface Node {
  opening: Opening;
  key: string;
  /** Plies between this node and the ancestor whose theory it displays. */
  gap: number;
  theorySource?: string;
  direct: number;
  /**
   * Distinct substantial passages, not occurrences. Courses attach the same
   * chapter preface to every line in the chapter, so counting occurrences
   * measures how a course was exported rather than how much it says: one row
   * advertised 238 pieces and collapsed to eight, none of them about a plan.
   */
  distinct: Set<string>;
  subtree: number;
  /** Occurrences, not distinct — kept raw because deduping every subtree would
   * mean holding a fingerprint set for every node in the book at once. */
  subtreeSubstantial: number;
  sources: Set<number>;
}

/** Move-sequence trie over the book, so one walk finds every node on a line. */
interface TrieNode {
  children: Map<string, TrieNode>;
  node?: Node;
}

function buildBook(): { nodes: Node[]; byKey: Map<string, Node[]>; trie: TrieNode } {
  const nodes: Node[] = [];
  const byKey = new Map<string, Node[]>();
  const trie: TrieNode = { children: new Map() };
  const pos = new Position();
  let unplayable = 0;

  for (const opening of OPENINGS) {
    loadFen(pos, START_FEN);
    let ok = true;
    for (const san of opening.moves) {
      const move = resolveSan(pos, san);
      if (!move) {
        ok = false;
        break;
      }
      pos.make(move);
    }
    if (!ok) {
      unplayable++;
      continue;
    }

    const source = inheritTheory(opening);
    const node: Node = {
      opening,
      key: pos.key(),
      // No theory anywhere above it: the whole line is uncovered, so the gap is
      // its full depth rather than a missing value that sorts oddly.
      gap: source ? opening.moves.length - source.moves.length : opening.moves.length,
      theorySource: source?.name,
      direct: 0,
      distinct: new Set(),
      subtree: 0,
      subtreeSubstantial: 0,
      sources: new Set(),
    };
    nodes.push(node);

    let list = byKey.get(node.key);
    if (!list) byKey.set(node.key, (list = []));
    list.push(node);

    let cursor = trie;
    for (const san of opening.moves) {
      let next = cursor.children.get(san);
      if (!next) cursor.children.set(san, (next = { children: new Map() }));
      cursor = next;
    }
    cursor.node = node;
  }

  if (unplayable) console.warn(`${unplayable} book lines would not replay and were skipped`);
  return { nodes, byKey, trie };
}

/* -------------------------------------------------------------- corpus --- */

/**
 * A position the book has no entry for. Most of these are not missing
 * *openings* — they are intermediate nodes between two named lines, where the
 * tables name the parent and a grandchild but not the move in between. The
 * nearest named ancestor is recorded so the two cases can be told apart:
 * `past` of 1 or 2 means the material belongs to the ancestor, and a large one
 * means the corpus has gone somewhere the book does not follow.
 */
interface OffBook {
  key: string;
  line: string;
  count: number;
  substantial: number;
  sources: Set<number>;
  ancestor?: string;
  /** Plies between the nearest named ancestor and this position. */
  past: number;
}

async function scan(options: Options, book: ReturnType<typeof buildBook>) {
  const { byKey, trie } = book;
  const offBook = new Map<string, OffBook>();
  let total = 0;
  let usable = 0;
  let onBookDirect = 0;

  const input = createReadStream(join(options.corpus, 'annotations.jsonl.gz')).pipe(createGunzip());
  for await (const raw of createInterface({ input })) {
    total++;
    const rec = JSON.parse(raw) as {
      key: string;
      line: string;
      ply: number;
      text: string;
      src: number;
      startFen?: string;
    };
    // A line that started from a FEN is not an opening sequence, whatever it
    // looks like: endgame manuals and puzzle books account for 9% of the index.
    if (rec.startFen) continue;
    const substantial = rec.text.length >= options.minChars && !CITATION.test(rec.text);
    if (!substantial && rec.text.length < 20) continue;
    usable++;

    const exact = byKey.get(rec.key);
    if (exact) {
      onBookDirect++;
      const print = substantial ? fingerprint(rec.text) : '';
      for (const node of exact) {
        node.direct++;
        if (substantial) node.distinct.add(print);
        node.sources.add(rec.src);
      }
    }

    const moves = rec.line.split(' ');
    let cursor: TrieNode | undefined = trie;
    let nearest: Node | undefined;
    for (const san of moves) {
      cursor = cursor.children.get(san);
      if (!cursor) break;
      if (cursor.node) {
        nearest = cursor.node;
        cursor.node.subtree++;
        if (substantial) cursor.node.subtreeSubstantial++;
      }
    }

    // Positions the book has no name for. Capped at opening depth, since a
    // move-25 position is not a missing book entry.
    if (!exact && substantial && rec.ply <= 20) {
      let entry = offBook.get(rec.key);
      if (!entry) {
        offBook.set(
          rec.key,
          (entry = {
            key: rec.key,
            line: rec.line,
            count: 0,
            substantial: 0,
            sources: new Set(),
            ancestor: nearest?.opening.name,
            past: nearest ? moves.length - nearest.opening.moves.length : moves.length,
          }),
        );
      }
      entry.count++;
      entry.substantial++;
      entry.sources.add(rec.src);
    }
  }

  return { total, usable, onBookDirect, offBook };
}

/* -------------------------------------------------------------- report --- */

const pad = (text: string, width: number): string =>
  text.length > width ? `${text.slice(0, width - 1)}…` : text.padEnd(width);

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const book = buildBook();
  console.log(`${book.nodes.length} book nodes, ${book.byKey.size} distinct positions`);

  const started = Date.now();
  const { total, usable, onBookDirect, offBook } = await scan(options, book);
  console.log(
    `${total} annotations read, ${usable} usable, ${onBookDirect} landing on a named position ` +
      `(${((100 * onBookDirect) / usable).toFixed(1)}%), in ${((Date.now() - started) / 1000).toFixed(0)}s\n`,
  );

  const withTheory = book.nodes.filter((n) => n.gap === 0);
  const covered = book.nodes.filter((n) => n.distinct.size > 0);
  /**
   * The bar below which "distilling" stops meaning anything. One course's single
   * remark about a position is not several strong players agreeing — it is one
   * person, unchecked, and an entry resting on it would be the weakest content
   * in the book. Reported here so the end of the useful work is visible.
   */
  const wellSupported = book.nodes.filter(
    (n) => n.gap >= options.minGap && n.distinct.size >= 4 && n.sources.size >= 3,
  );
  console.log(
    `book coverage: ${withTheory.length} nodes carry their own theory, ` +
      `${covered.length} have substantial prose written about them in the corpus, ` +
      `${book.nodes.filter((n) => n.distinct.size >= 10).length} have ten pieces or more\n` +
      `${wellSupported.length} thin nodes are well supported (4+ distinct pieces from 3+ courses) — ` +
      `the work that the material actually backs\n`,
  );

  /**
   * Ranked by how much substantial prose sits on the node, among nodes whose
   * displayed theory comes from far enough above to be about a different
   * position. Deliberately not a weighted score — the two conditions are the
   * whole argument, and a score would only hide which one did the work.
   */
  // A position can sit in the book twice under different move orders, and theory
  // is inherited along move-sequence ancestry rather than by position — so the
  // twin of a written-up node still looks untouched. Three positions in the book
  // are like this. They are not work; they are the same work already done.
  const coveredPositions = new Set(
    book.nodes.filter((n) => n.opening.theory).map((n) => n.key),
  );
  const candidates = book.nodes.filter(
    (n) =>
      !UNWRITABLE.has(n.opening.moves.join(' ')) &&
      !coveredPositions.has(n.key) &&
      n.gap >= options.minGap &&
      n.distinct.size >= Math.max(1, options.minProse) &&
      n.sources.size >= options.minSources,
  );
  // Several book entries can reach one position by different move orders. They
  // are one piece of work, not three, so the list is collapsed onto the
  // position and the shallowest entry speaks for it.
  const byPosition = new Map<string, Node>();
  for (const node of candidates) {
    const held = byPosition.get(node.key);
    if (!held || node.opening.moves.length < held.opening.moves.length) byPosition.set(node.key, node);
  }
  const worklist = [...byPosition.values()].sort(
    (a, b) => b.distinct.size - a.distinct.size || b.sources.size - a.sources.size,
  );

  console.log(
    `── worklist: thin theory, rich corpus (${worklist.length} positions, ` +
      `${UNWRITABLE.size} set aside as unwritable) ──`,
  );
  console.log(
    `${pad('prose', 6)}${pad('sub', 7)}${pad('src', 5)}${pad('gap', 5)}${pad('eco', 5)}${pad('name', 44)}inherits from`,
  );
  for (const node of worklist.slice(0, options.top)) {
    console.log(
      pad(String(node.distinct.size), 6) +
        pad(String(node.subtreeSubstantial), 7) +
        pad(String(node.sources.size), 5) +
        pad(String(node.gap), 5) +
        pad(node.opening.eco, 5) +
        pad(node.opening.name, 44) +
        (node.theorySource ?? '— nothing above it'),
    );
  }

  const gaps = [...offBook.values()]
    .filter((entry) => entry.sources.size >= 2)
    .sort((a, b) => b.substantial - a.substantial);

  // Material one or two plies past a named line already counts toward that
  // line's subtree total in the worklist above, so listing it again here would
  // be the same work twice. What is left is territory the book does not follow.
  const orphans = gaps.filter((entry) => entry.past >= 3);
  console.log(
    `\n── unnamed positions, 3+ plies past any named line (${orphans.length} of ` +
      `${gaps.length}; the rest is already counted in 'sub' above) ──`,
  );
  console.log(`${pad('prose', 6)}${pad('src', 5)}${pad('past', 6)}${pad('nearest named line', 42)}line`);
  for (const entry of orphans.slice(0, options.top)) {
    console.log(
      pad(String(entry.substantial), 6) +
        pad(String(entry.sources.size), 5) +
        pad(`+${entry.past}`, 6) +
        pad(entry.ancestor ?? '— off book', 42) +
        entry.line,
    );
  }

  const out = join(options.corpus, 'coverage.json');
  await writeFile(
    out,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        options,
        totals: { annotations: total, usable, onBookDirect },
        worklist: worklist.map((n) => ({
          eco: n.opening.eco,
          name: n.opening.name,
          moves: n.opening.moves,
          key: n.key,
          gap: n.gap,
          theorySource: n.theorySource,
          direct: n.direct,
          distinct: n.distinct.size,
          subtree: n.subtree,
          subtreeSubstantial: n.subtreeSubstantial,
          sources: n.sources.size,
        })),
        unnamed: orphans.slice(0, 500).map((entry) => ({
          key: entry.key,
          line: entry.line,
          substantial: entry.substantial,
          sources: entry.sources.size,
          ancestor: entry.ancestor,
          past: entry.past,
        })),
      },
      null,
      2,
    )}\n`,
  );
  console.log(`\nwritten to ${out}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
