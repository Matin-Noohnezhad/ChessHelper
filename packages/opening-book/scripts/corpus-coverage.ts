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
  top: number;
}

function parseArgs(argv: string[]): Options {
  const options: Options = { corpus: resolve('.corpus'), minChars: 200, minGap: 4, top: 40 };
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

/* ---------------------------------------------------------------- book --- */

interface Node {
  opening: Opening;
  key: string;
  /** Plies between this node and the ancestor whose theory it displays. */
  gap: number;
  theorySource?: string;
  direct: number;
  directSubstantial: number;
  subtree: number;
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
      directSubstantial: 0,
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
      for (const node of exact) {
        node.direct++;
        if (substantial) node.directSubstantial++;
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
  const covered = book.nodes.filter((n) => n.directSubstantial > 0);
  console.log(
    `book coverage: ${withTheory.length} nodes carry their own theory, ` +
      `${covered.length} have substantial prose written about them in the corpus, ` +
      `${book.nodes.filter((n) => n.directSubstantial >= 10).length} have ten pieces or more\n`,
  );

  /**
   * Ranked by how much substantial prose sits on the node, among nodes whose
   * displayed theory comes from far enough above to be about a different
   * position. Deliberately not a weighted score — the two conditions are the
   * whole argument, and a score would only hide which one did the work.
   */
  const candidates = book.nodes.filter((n) => n.gap >= options.minGap && n.directSubstantial > 0);
  // Several book entries can reach one position by different move orders. They
  // are one piece of work, not three, so the list is collapsed onto the
  // position and the shallowest entry speaks for it.
  const byPosition = new Map<string, Node>();
  for (const node of candidates) {
    const held = byPosition.get(node.key);
    if (!held || node.opening.moves.length < held.opening.moves.length) byPosition.set(node.key, node);
  }
  const worklist = [...byPosition.values()].sort(
    (a, b) => b.directSubstantial - a.directSubstantial || b.sources.size - a.sources.size,
  );

  console.log(`── worklist: thin theory, rich corpus (${worklist.length} positions) ──`);
  console.log(
    `${pad('prose', 6)}${pad('sub', 7)}${pad('src', 5)}${pad('gap', 5)}${pad('eco', 5)}${pad('name', 44)}inherits from`,
  );
  for (const node of worklist.slice(0, options.top)) {
    console.log(
      pad(String(node.directSubstantial), 6) +
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
          directSubstantial: n.directSubstantial,
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
