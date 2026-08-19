---
name: distil-openings
description: Write opening theory entries — ideas, plans, pawn breaks, key squares — for the highest-value positions in the opening book, distilled from the local annotated-PGN corpus. Use when continuing the opening-book distillation work, when asked to improve the book's coverage of plans and structures, or when asked to work through the coverage worklist.
---

# Distilling opening theory

## The problem this solves

`packages/opening-book` names 3,844 lines but only ~41 carry their own teaching
content. Everything else inherits plans from an ancestor further up the tree, so
a deep line can show you ideas written for a position two openings away. That is
the thing being fixed, one position at a time.

The material to fix it with is already indexed: 1.6M annotations from a personal
library of annotated PGN, keyed by the position each was written about. The
worklist is already ranked. This skill is the loop that turns the second into
the first.

## Before you start

The index lives in `.corpus/`, which is gitignored and machine-local. Check it:

```bash
ls .corpus/          # annotations.jsonl.gz, games.jsonl.gz, manifest.json, coverage.json
```

If it is missing, rebuild it (~4 minutes) — the PGN library is at
`/media/sf_sharedWindows/pgn` unless the user says otherwise:

```bash
npm run index:corpus -- --dir /media/sf_sharedWindows/pgn
npm run report:coverage
```

**Commit as soon as the batch passes its tests.** Background work does not
survive the session ending, and an early run of this task lost everything it had
done because it was holding the whole batch until the end.

## The loop

Do one batch of **five** entries per session unless asked otherwise. More than
that and the reading blurs together and the writing gets generic.

### 1. Refresh the worklist

```bash
npm run report:coverage -- --min-prose 4 --min-sources 3 --top 12
```

The filters restrict the list to positions the corpus supports well enough to
write from: 4+ *distinct* passages, backed by 3+ separate courses. Distinct is
the word that matters — a course attaches its chapter preface to every line in
the chapter, so raw counts run an order of magnitude high and one row advertised
238 pieces that collapsed to eight, none about a plan. Below this bar an entry
rests on one person's single remark, which is not distillation. Do not drop the
filters unless the user asks for the thin tail explicitly.

Four distinct passages at the node itself is less thin than it sounds, because
you read with `--depth 2` and pick up everything one or two moves below it too.

Ranks shift every time an entry is written, so **always regenerate before
picking targets**. The header line tells you where the work stands ("N nodes
carry their own theory", "N thin nodes are well supported"). Take the top five
that are genuinely distinct openings — if two rows are the same variation at
different depths, prefer the shallower one and skip the other this round.

**Transpositions.** The book inherits theory along move-sequence ancestry, not
by position, so a position reachable by two move orders needs an address for
each. Only three positions in the book are like this. When you write one of them,
add the twin as well and have both point at the *same* theory object rather than
restating it — hoist it to a named `const` above `CURATED_OPENINGS`, as
`CARO_KANN_CLASSICAL` shows. One position, one set of ideas.

If a row is a transposition into a position that already carries theory, do not
write a duplicate: give the row's address the existing theory object, or skip it
and take the next row.

**A shallow row whose child is already written up needs a different entry, not a
fuller one.** The Pirc at 3.Nc3 sits one ply above an entry covering 3...g6. The
right content for the parent is the crossroads — which third move chooses which
game, and what is common to all of them — not a restatement of the child.

### 2. Read the material for each

```bash
npm run digest:node -- --rank 1 --depth 2 --max 8
```

`--depth 2` matters: the position itself often attracts only chapter prefaces,
while the actual plans sit one or two moves deeper. Raise `--max` when the
material is thin, or `--depth 3` for a node near the top of a tree. If the
digest warns that the node already carries theory, your `coverage.json` is
stale — go back to step 1.

Read for: what each side is *trying to do*, which pawn breaks matter and what
has to be true first, which squares the game turns on, named manoeuvres, and
concrete things that lose games. Ignore the autobiography; the relevance ranking
pushes most of it down but not all.

### 3. Write the entry

Entries go in `packages/opening-book/src/openings.ts`. Two cases:

- **A bare entry already exists at that move sequence** — fill in its `theory`
  block. Do not add a second entry; there is a test for duplicates and it will
  catch you.
- **No entry exists** — add one, keeping the ECO code and name exactly as the
  coverage report gives them, so identification does not shift.

Shape (see `src/types.ts` for the full contract):

```ts
{
  eco: 'B56',
  name: 'Sicilian Defence: Classical Variation',
  moves: line('e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 Nc6'),
  character: 'sharp',          // sharp | positional | balanced | gambit | system
  minRating: 1600,             // where the line starts paying off
  forSide: 'black',            // only when the entry is written from one side
  theory: {
    idea: '…',                 // one paragraph: what each side actually wants
    structures: ['scheveningen', 'boleslavsky'],   // ids from structures.ts
    whitePlans: ['…'],
    blackPlans: ['…'],
    breaks: [{ move: 'd5', side: 'black', note: '…', prerequisites: ['…'] }],
    keySquares: [{ square: 'd5', note: '…' }],
    routes: ['Nb1-d2-f1-g3'],
    traps: ['…'],
    sources: ['Course title — author'],
  },
}
```

### 4. Verify, then commit

```bash
npx vitest run packages/opening-book
```

`npm run typecheck` fails at the root with `TS5083` — there is no root
`tsconfig.json`, only `tsconfig.base.json`. This is pre-existing and unrelated to
this work; do not try to fix it and do not report it. Use `npx vitest run
packages/opening-book`, which is the check that matters here.

The tests are the compiler for this data. In particular one of them checks that
a break attributed to a side is a push that side could actually make — it has
already caught a real error, so if it fires, the entry is wrong, not the test.

Commit the batch with a message that lists what was written and how many courses
each rests on, and says what the numbers moved to. Then re-run
`npm run report:coverage` so the next session starts fresh.

## How to write these

**Say why, not what.** A move list is available from any database; the reason the
book exists is the sentence that explains what the move is for. "The bishop goes
to e7 rather than c5 because on c5 it is hit with tempo by the c3 and d4
build-up" earns its place. "Black develops the bishop" does not.

**Prefer what only the corpus knows.** The valuable material is the kind that
does not appear in a move list — a knight on d5 plugging the d-file so White
cannot both occupy the hole and attack the backward pawn; ...dxc4 being timed to
one specific move so that ...Bf5 follows without Qb3. Look for that and lead
with it.

**Match the house style.** British spelling, typographic apostrophes (`’`),
declarative prose, no second person, no exclamation marks. Read a neighbouring
entry before writing.

**Prerequisites are the part players skip.** When a break only works under
conditions, put them in `prerequisites` rather than burying them in the note.

## Rules that are not stylistic

**Never copy.** The corpus is commercial course material. Entries are written in
your own words, from understanding, and `theory.sources` records the titles you
read so a reader can go and check. Verbatim sentences must not appear in the
repo, and `.corpus/` must stay gitignored.

**Do not invent model games.** If you cannot name a game with confidence, leave
`modelGames` out. A wrong attribution is worse than an absent one.

**Do not state concrete tactical lines you have not verified.** A general
principle you are sure of beats a variation you half-remember. Where the corpus
gives a full line and you can replay it, it is fine to include.

**Do not change existing entries** unless they are wrong — and if one is wrong,
fix it and say so explicitly in the commit message and to the user. Two errors
have already been found this way (a Caro-Kann Exchange entry with the colours
reversed, four pawn-structure diagrams with pawns missing or misplaced), so this
does happen.

**Structure ids must exist.** Only the ids in `src/structures.ts`. If a position's
structure genuinely is not in the encyclopedia, leave `structures: []` rather
than forcing a bad fit — the classifier will still read what is on the board.

## Reporting back

Tell the user what was written, how many courses each entry drew on, where the
numbers moved (nodes with theory, worklist size), and anything you found wrong in
existing content. Do not paste the entries themselves; they are in the diff.
