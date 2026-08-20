/** scratch helper — verify a stranded route against its target position */
import { readFileSync } from 'node:fs';
import { Position, START_FEN, loadFen, resolveSan } from '@coh/chess-core';
import { OPENINGS, CURATED_OPENINGS, deepestOpening, inheritTheory } from '@coh/opening-book';
import { ECO_TSV } from './packages/opening-book/src/eco.generated.js';
import type { Opening } from '@coh/opening-book';

const keyOf = (moves: string[]): string | null => {
  const pos = new Position();
  loadFen(pos, START_FEN);
  for (const san of moves) {
    const m = resolveSan(pos, san);
    if (!m) return null;
    pos.make(m);
  }
  return pos.key();
};

const byKey = new Map<string, Opening[]>();
for (const o of OPENINGS) {
  if (!o.theory) continue;
  const k = keyOf(o.moves as string[]);
  if (!k) continue;
  const l = byKey.get(k) ?? [];
  l.push(o);
  byKey.set(k, l);
}

const ecoRows = new Map<string, [string, string]>();
for (const row of ECO_TSV.split('\n')) {
  const a = row.indexOf('\t'), b = row.indexOf('\t', a + 1);
  if (a < 0 || b < 0) continue;
  ecoRows.set(row.slice(b + 1), [row.slice(0, a), row.slice(a + 1, b)]);
}

const curated = new Set(CURATED_OPENINGS.map((o) => o.moves.join(' ')));

for (const arg of process.argv.slice(2)) {
  const moves = arg.split(' ').filter(Boolean);
  const k = keyOf(moves);
  console.log(`\nROUTE  ${arg}`);
  if (!k) { console.log('  ILLEGAL LINE'); continue; }
  console.log(`  key ${k}`);
  const eco = ecoRows.get(arg);
  console.log(`  eco table row: ${eco ? eco[0] + ' ' + eco[1] : '— none —'}`);
  console.log(`  in curated already: ${curated.has(arg)}`);
  const targets = byKey.get(k) ?? [];
  for (const t of targets) {
    console.log(`  TARGET ${t.eco} ${t.name}  [${t.moves.join(' ')}] (${t.moves.length} plies) char=${(t as any).character} minRating=${(t as any).minRating} forSide=${(t as any).forSide}`);
  }
  if (!targets.length) console.log('  NO TARGET WITH THEORY AT THIS KEY');
  const shown = deepestOpening(moves);
  const inh = shown ? inheritTheory(shown) : undefined;
  console.log(`  currently shows: ${inh?.name ?? '—'} via ${shown?.name} [${shown?.moves.join(' ')}]`);
}
