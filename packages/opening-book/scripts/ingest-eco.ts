/**
 * Generates `src/eco.generated.ts` from the vendored ECO tables.
 *
 * Source: https://github.com/lichess-org/chess-openings (CC0-1.0, public
 * domain). The TSVs are vendored under `data/` so the build is reproducible
 * without network access; pass `--fetch` to refresh them from upstream.
 *
 * Every line is replayed through our own move generator before it is written
 * out. That does two jobs: it rejects anything illegal, and it re-emits the
 * moves in *our* SAN — the book's move strings then compare exactly against
 * what the trainer and the UI produce, with no normalisation at read time.
 *
 *   npx vite-node packages/opening-book/scripts/ingest-eco.ts [--fetch]
 */

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { Chess, parseMoveText } from '@coh/chess-core';

const FILES = ['a', 'b', 'c', 'd', 'e'] as const;
const UPSTREAM = 'https://raw.githubusercontent.com/lichess-org/chess-openings/master';

const dataPath = (name: string) => fileURLToPath(new URL(`../data/${name}`, import.meta.url));
const outPath = fileURLToPath(new URL('../src/eco.generated.ts', import.meta.url));

interface Row {
  eco: string;
  name: string;
  moves: string[];
}

async function refresh(): Promise<void> {
  for (const file of FILES) {
    const response = await fetch(`${UPSTREAM}/${file}.tsv`);
    if (!response.ok) throw new Error(`${file}.tsv: HTTP ${response.status}`);
    await writeFile(dataPath(`${file}.tsv`), await response.text());
    console.log(`fetched ${file}.tsv`);
  }
}

/**
 * Upstream uses American spelling and typewriter apostrophes; the hand-written
 * entries use British spelling and typographic ones. The two sit side by side
 * in the same menu, so normalise the two things that differ rather than
 * shipping "Queen's Gambit" one row above "Queen’s Gambit Declined".
 */
function normalizeName(name: string): string {
  return name.replace(/\bDefense\b/g, 'Defence').replace(/'/g, '’');
}

async function readRows(): Promise<{ rows: Row[]; skipped: string[] }> {
  const rows: Row[] = [];
  const skipped: string[] = [];

  for (const file of FILES) {
    const text = await readFile(dataPath(`${file}.tsv`), 'utf8');
    for (const raw of text.split('\n').slice(1)) {
      const lineText = raw.trim();
      if (!lineText) continue;
      const [eco, name, pgn] = lineText.split('\t');
      if (!eco || !name || !pgn) {
        skipped.push(`malformed row: ${lineText.slice(0, 60)}`);
        continue;
      }

      // Replay it: illegal lines are dropped, legal ones come back in our SAN.
      const game = new Chess();
      let ok = true;
      for (const san of parseMoveText(pgn)) {
        if (!game.move(san)) {
          skipped.push(`${eco} ${name}: illegal move ${san}`);
          ok = false;
          break;
        }
      }
      if (!ok) continue;
      const moves = game.history();
      if (!moves.length) {
        skipped.push(`${eco} ${name}: no moves`);
        continue;
      }
      rows.push({ eco, name: normalizeName(name), moves });
    }
  }
  return { rows, skipped };
}

/** One entry per move sequence; the first name wins, which is the shortest ECO. */
function dedupe(rows: Row[]): Row[] {
  const byMoves = new Map<string, Row>();
  for (const row of rows) {
    const key = row.moves.join(' ');
    if (!byMoves.has(key)) byMoves.set(key, row);
  }
  return [...byMoves.values()].sort(
    (a, b) => a.eco.localeCompare(b.eco) || a.moves.length - b.moves.length || a.name.localeCompare(b.name),
  );
}

function render(rows: Row[]): string {
  const body = rows
    .map((row) => `${row.eco}\t${escape(row.name)}\t${row.moves.join(' ')}`)
    .join('\n');

  return `/**
 * AUTO-GENERATED — do not edit by hand.
 *
 * Regenerate with:
 *   npx vite-node packages/opening-book/scripts/ingest-eco.ts
 *
 * Source: lichess-org/chess-openings (CC0-1.0, public domain), replayed and
 * re-emitted in this project's SAN. ${rows.length} lines.
 *
 * Held as one tab-separated string rather than ${rows.length} array literals.
 * It is a third smaller on the wire and far cheaper for the engine to parse —
 * a big literal costs real milliseconds at startup, a string costs one split.
 * book.ts expands it once at load.
 */

/** Rows of \`eco \\t name \\t space-separated SAN moves\`. */
export const ECO_TSV = \`${body}\`;
`;
}

/** The data goes inside a template literal, so those are the escapes needed. */
const escape = (value: string): string =>
  value.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

async function main(): Promise<void> {
  if (process.argv.includes('--fetch')) await refresh();

  const { rows, skipped } = await readRows();
  const unique = dedupe(rows);
  await writeFile(outPath, render(unique));

  const depths = unique.map((r) => r.moves.length);
  console.log(`wrote ${unique.length} lines to src/eco.generated.ts`);
  console.log(`  dropped ${rows.length - unique.length} duplicate move sequences`);
  console.log(`  rejected ${skipped.length} rows`);
  for (const reason of skipped.slice(0, 10)) console.log(`    ${reason}`);
  console.log(`  depth: min ${Math.min(...depths)}, max ${Math.max(...depths)} plies`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
