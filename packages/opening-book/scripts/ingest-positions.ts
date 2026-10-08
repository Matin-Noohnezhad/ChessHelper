/** Precompute named-book positions so the browser never replays the corpus. */
import { writeFile } from 'node:fs/promises';
import { Chess } from '@coh/chess-core';
import { OPENINGS } from '../src/book.js';
import { theoryPositionKey } from '../src/theory-position.js';

const prefixes = new Map<string, string>([['', theoryPositionKey(new Chess().fen())]]);
for (const opening of OPENINGS) {
  let prefix = '';
  for (const san of opening.moves) {
    const parent = prefix;
    prefix = prefix ? `${prefix} ${san}` : san;
    if (prefixes.has(prefix)) continue;
    const board = new Chess(`${prefixes.get(parent)!} 0 1`);
    if (!board.move(san)) throw new Error(`Illegal opening move: ${prefix}`);
    prefixes.set(prefix, theoryPositionKey(board.fen()));
  }
}

const rows = [...prefixes].map(([moves, position]) => `${moves}\t${position}`).join('\n');
const escaped = rows.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
await writeFile(new URL('../src/book-positions.generated.ts', import.meta.url), `/**
 * AUTO-GENERATED — do not edit by hand.
 * Regenerate with npm run ingest:positions after changing opening move sequences.
 * Sources: curated openings and the ECO tables; see data/README.md for licenses.
 * Rows: space-separated SAN prefix, tab, normalized position (without clocks).
 */
export const BOOK_POSITION_TSV = \`${escaped}\`;
`);
console.log(`Wrote ${prefixes.size} opening prefix positions.`);
