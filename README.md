# Chess Opening Helper

An opening trainer that teaches *why* the moves are played: the typical plans,
the pawn structures they produce, and the breaks each side is aiming for — then
spars with you in your opening, switching variation each time, until you know
its ups and downs.

## Where the project is now

Steps 1–4 are done: the rules engine, the knowledge base, the web UI, and the
sparring trainer. Since then: the game review, and a course trainer that drills
a repertoire somebody else wrote.

```
packages/
  chess-core/     zero-dependency rules: 0x88 board, legal movegen, make/unmake,
                  FEN, SAN, PGN, Zobrist hashing, perft            ✅ verified
  opening-book/   full ECO tables merged with hand-written theory,
                  identification, inheritance, search           ✅ 3,844 lines
  trainer/        sparring engine: repertoire lines, variation
                  rotation, spaced repetition, off-book feedback   ✅ 19 tests
  course/         MoveTrainer-style course drilling: PGN import,
                  chunked lessons, per-move spaced repetition     ✅ 111 tests
  imbalances/     static, Silman-style reading of a position       ✅ 8 tests
  review/         whole-game review: accuracy, phases, and
                  chess.com-style move classification             ✅ 50 tests
apps/
  web/            React + Vite: explore board, study panel, the
                  training mode, the courses and the game review   ✅ runs
```

Nothing in `packages/` imports the DOM, so the same core drives a React Native
app or a Tauri desktop build later — only `apps/*` changes.

## Running it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # 266 tests across core, book, trainer, courses, review and UI
npm run ingest:eco # regenerate the ECO tables from data/*.tsv
npm run typecheck
```

## What works today

- **Full legal chess**, verified against the standard perft suite (start
  position, kiwipete, and positions 3–6) to depth 4–5. Castling rights, en
  passant, promotion, repetition and insufficient material all included.
- **Board UI** with drag-and-drop *and* click-to-move, legal-move dots, capture
  rings, last-move and check highlights, a promotion picker, board flip,
  coordinates, and arrow-key navigation through the game.
- **Live opening identification** as you play across the full ECO tables —
  3,844 named lines, up to 36 plies deep — with ECO code, character
  (sharp / positional / gambit / system) and a suggested rating band.
- **The study panel**: the idea of the opening in plain words, plans for each
  side, characteristic pawn breaks with their prerequisites, the pawn structures
  the opening produces (drawn as skeleton boards), key squares, standard
  manoeuvres, traps, and model games.
- **Continuations**: named next moves from wherever you are, one click to play.
- **Theory inheritance**: reach the Mar del Plata and you still get the King's
  Indian ideas, attributed to the parent line.

### Training mode

Pick an opening and a side; the trainer plays the other side from the book.

- **A different variation each time.** Choose the Sicilian and you drill the
  Najdorf, then the Dragon, then the Alapin, then the Rossolimo… The session
  walks every variation before any of them repeats — including ones you skipped.
- **Off-book moves are not "wrong".** The board does not move, you are told what
  theory plays here and in which line, and you try again.
- **Transpositions are followed, not punished.** Play 2...e6 in a Najdorf drill
  and the trainer says "that is the Kan" and follows you there.
- **Spaced repetition.** A clean run pushes a line out 10 minutes → 4 hours →
  a day → 3 days → a week. A mistake brings it back in two minutes. Two clean
  runs in a row marks it learned.
- **The payoff at the end of the line** is the opening's idea, plus one click
  through to the study board with the line loaded.
- Progress is saved in `localStorage`, keyed by move sequence.

Line depth scales with what you pick: choosing the Sicilian drills 178 variations
of 6–12 plies, choosing the Najdorf drills 26 of 14–20. Lines are ordered by how
much published theory sits beneath them, so main lines come first and the Wing
Gambit waits its turn.

### Courses

The trainer above drills *our* book. The Courses tab drills somebody else's:
paste or drop a repertoire PGN and it becomes a course, taught the way
Chessable's MoveTrainer teaches one — a move at a time, each move on its own
schedule.

- **The unit is the move, not the line.** Every move you have to produce carries
  its own level and its own due date. Miss the fifth move of a variation and the
  fifth move comes back this afternoon; the other four go on climbing. A line is
  not a thing you know or do not know, and treating it as one is what makes a
  twenty-ply variation come round every time you fluff one move of it.
- **The ladder** is four hours → a day → three days → a week → two weeks → a
  month → three → six. One miss puts that move back on the bottom rung.
- **Learning a line means watching it first.** The moves are played out one at a
  time — animated, at a pace you can read at, the opponent's replies included —
  with whatever the author wrote about each one beside it, and any arrows or
  circles they drew on it (`[%cal]` / `[%csl]` in the PGN) on the board. Then it
  rewinds and asks for the same moves back. Watching a line is not knowing it,
  and the gap between the two is the whole point of the exercise. **Watch again**
  replays the demonstration whenever you want it — the line goes past once, and
  the moment you want it back is the moment you are stuck on the move after it.
- **The demonstration runs at the pace you set.** Settings has four: *Slow*,
  *Normal* and *Fast* auto-advance, stretching or compressing the reading pause;
  *Manual* runs no clock at all — the line waits on the board and you step it
  with the **Next** button, <kbd>→</kbd> or <kbd>Space</kbd>, reading each note
  for as long as you like. The quick recap of a shared opening always plays
  itself either way.
- **Long lines come in parts.** Four of your own moves at a time, split evenly
  rather than four-then-one: watch a part, play it back, watch the next, play
  that back — and when the parts are done, the whole line from the first move
  with nothing shown. Playing a variation in four-move instalments is not knowing
  it either; the run from the top is the only task in a learn session that asks
  the question the board will ask you.
- **A line that opens like the last one is recapped, not re-taught.** When the
  next variation shares its first several moves with one you just learned, the
  first part rewinds to move one and replays that shared opening quickly — a few
  hundred milliseconds a move — to carry you back to the point where the two
  lines diverge, and only asks for the moves past it. A deep transposition is
  capped so the recap never becomes the screensaver the instant set-up avoids.
- **Read a note again whenever you want it.** The author's line about why the
  knight goes to b3 goes past in a couple of seconds, and the moment you want it
  back is the moment you are stuck on the move after it. Every move already on
  the board is a button, arrow keys walk the trail, and the ones carrying a note
  are marked — the board rewinds to that position, the note comes back, and the
  live position waits untouched behind it.
- **A session counts itself in lines.** Two variations drilled three times each
  is *two* lines, not six tasks: the board says `Line 1 of 2` with `try 1 of 3`
  under it, so the number tells you how much of the chapter is left as well as
  where you are inside it.
- **The whole course is a list you can steer by.** Chapters down the side, each
  with a percentage and a bar, and under each one every line written out move by
  move with a ring beside it — empty for a line you have not touched, part-filled
  as you work through it, a solid tick once every move in it has come back after
  a night. It is on the course page and again as a rail beside the board during a
  session; click any line in either place and that is what you drill next, taught
  from the top whether or not the schedule had it due.
- **Review and quick review.** *Review* replays whole variations with nothing
  shown until you have missed something. *Quick review* skips the replay and
  drops you straight into the position each due move sits in — the difference
  between an hour of review and ten minutes of it on a course of any size.
- **Reset as much or as little as you mean to.** The whole course, a single
  chapter from its row in the outline, or one line from the ⟲ beside it — each
  puts the moves it covers back to unlearned and leaves the rest of the course
  where it was. Because progress is keyed by position, a move a line shares by
  transposition is reset with it, the same rule that let learning it once count
  everywhere.
- **Sidelines are the course.** A repertoire keeps most of its teaching in
  parentheses, so the import reads them as siblings of the move they replace, not
  as footnotes. At your own move the three kinds are told apart without asking the
  author to mark anything up: a sideline with a line under it is another variation
  to learn, one shown and dropped is an **alternative** — playable, accepted, never
  required — and one carrying `?` or `?!` is a move the author is warning you off,
  which comes back with their reason for it when you play it. At the opponent's
  move every sideline is a branch, the bad ones included: that is where the
  refutation lives.
- **A move is measured the first time the session asks it, and after that only
  bad news gets through.** Producing it from move one having already produced it
  inside a part proves nothing new; *failing* to, having managed it a minute ago,
  is exactly the thing worth knowing — so a later miss demotes a move that had
  passed, and a later success cannot promote one that had not. Otherwise a line
  could be walked up the ladder by being asked often enough in one sitting.
- **Progress is keyed by position, not by path.** Two chapters that transpose
  share one move's history, so learning the Najdorf move order does not leave
  the same move unlearned in the Scheveningen.
- **Chapters come from the file.** `[Event "Course: Chapter"]` is split the way
  lichess writes it, games under one chapter merge into one tree, `[FEN]` starts
  a chapter wherever the author wanted, and a move that will not replay is
  reported rather than dropped in silence.
- **Which colour you play is inferred** from where the course actually branches —
  a White repertoire answers 1...c5, 1...e5 and 1...e6 but plays one move against
  each — and shown next to a switch at import, since a course imported for the
  wrong colour asks you to play your opponent's moves.
- Courses live in IndexedDB rather than `localStorage`: a real course is a
  megabyte or two of PGN and people own several. What is stored is the PGN, so a
  fix to the importer reaches courses imported last month.

### Game review

Two ways in, both one click: **Review game** on the explore board sends the
moves you have just played straight to the engine, and the review tab also takes
a PGN — annotated with clocks or not, one game or a whole month's export. Either
way the game comes back the way chess.com reports it.

- **Accuracy for both sides, and per phase.** Every score is converted to a win
  expectancy before anything is measured, because half a pawn matters in a level
  ending and does not when you are up a queen. The per-move numbers are combined
  with lichess's volatility-weighted and harmonic means, so one catastrophe
  cannot be averaged away by twenty quiet moves.
- **Phases from the game, not the move number.** The opening lasts as long as
  the moves are still in our ECO tables; the endgame starts when the material
  says so. "82% overall" tells you less than "you are fine until the pieces come
  off".
- **Every move labelled** — Sacrifice, Great, Best, Excellent, Good, Theory,
  Forced, Inaccuracy, Mistake, Miss, Blunder — plus tags for only moves,
  critical moments and moves played in time pressure. Every category is listed
  in the summary whether or not anyone scored it: a zero next to Blunder is a
  fact about the game, and a table whose rows shuffle between games cannot be
  read at a glance. An obvious recapture never counts as a great move. Stepping
  through the game sticks the label to the square the move landed on, so the
  board on its own tells you what kind of move you are looking at.
- **Sacrifices, in the ordinary sense of the word.** Material handed over — a
  pawn is enough — without getting it straight back, found by static exchange
  evaluation rather than by eyeballing the eval. Whether it *counts* is a
  question about the position, not the price: the evaluation has to stay in the
  band it was already in. +7 to +2 is still a winning position and still a
  sacrifice; +0.5 to −0.5 is still a game; −1.5 that stays −1.5 is still the
  same fight. Below −2 there is nothing left to keep, and a move that drops the
  position a band bought nothing — those keep the label they earned on the
  ladder and carry a sacrifice *tag* instead.
- **A one-line verdict per move**, the engine's alternatives with their lines,
  and a "show me the move I should have played" arrow on the previous position.
- **Turning points first**, biggest swing at the top, and a win-expectancy graph
  of the whole game with the phase boundaries marked.
- **Clocks, when the PGN has them**: time spent per move, longest think, moves
  played in the last tenth of the clock, and how much worse you played there.

The review runs on the vendored Stockfish build in the browser — one search per
position, repetitions reused — at Fast, Balanced or Deep. `packages/review`
itself never touches an engine or the DOM: callers hand it a
`PositionEvaluator`, which is how the tests review whole games with no search at
all.

## The opening data

`packages/opening-book` has two sources.

**Imported** — `data/*.tsv` are the ECO tables from
[lichess-org/chess-openings](https://github.com/lichess-org/chess-openings)
(CC0-1.0, public domain), vendored so the build is reproducible offline.
`npm run ingest:eco` regenerates `src/eco.generated.ts` from them; add `--fetch`
to pull the latest upstream first.

Every imported line is replayed through our own move generator before it is
written out, which rejects anything illegal and re-emits the moves in *our* SAN
— so book strings compare exactly against what the trainer and UI produce, with
no normalisation at read time. All 3,810 lines pass, which doubles as a decent
independent check on the move generator (~28,000 moves). Names are normalised to
British spelling and typographic apostrophes so the imported and hand-written
entries read as one list.

**Hand-written** — `src/openings.ts` and `src/structures.ts`. This is the part
that cannot be imported and the reason the app exists.

### The annotation index

The hand-written layer is the good part and also the thin part: 31 of 3,826
lines carry their own theory, 298 inherit none at all, and 72% of the tree
inherits from a node four or more plies shallower. That is why a deep line can
show plans written for a position two openings up.

Annotated PGN — repertoire courses, annotated game collections — already says
the things those lines are missing, in prose attached to a move. `npm run
index:corpus -- --dir <path>` makes that prose addressable: it replays every
line in every file, main lines and sidelines alike, and writes each comment out
keyed by the position it was written about.

```
.corpus/
  annotations.jsonl.gz   one record per comment: position hash, SAN path, text
  games.jsonl.gz         headers per game, so a comment can be cited
  manifest.json          per-file sha256, counts, and anything unreadable
```

The index is a **local cache, not a source**. It is derived from files you own,
often commercial, so `.corpus/` is gitignored and nothing verbatim from it
belongs in the repository — only distilled content, written in our own words,
with provenance recorded.

`npm run report:coverage` then joins the index against the book and says where
the work is. It ranks book nodes by how far their displayed theory was inherited
from against how much the corpus writes about that exact position — so the top
of the list is the next thing worth writing rather than a guess. The Classical
Sicilian heads it: 1,167 substantial pieces of prose from 19 separate sources
about a line that currently shows the plans of `1.e4 c5`, eight plies above it.
A second list covers positions the corpus discusses that the book has no entry
for at all. Both are written to `.corpus/coverage.json`.

`npm run digest:node -- --rank 1` is the reading step: it gathers everything
written about one position, collapses the near-duplicates that courses repeat at
the head of every chapter, and ranks what is left by how much of it is about
*playing* the position rather than about the author's relationship with the
opening. A person reads the digest and writes the entry. Nothing is copied —
what ships is the distillation, in our own words, with the courses it rests on
recorded in `theory.sources` so a reader can go and check.

That is a loop, not a one-off: write entries, re-run the coverage report, and
the worklist shrinks by exactly what was written. There is no checklist to keep
up to date — a node leaves the worklist the moment it has its own theory, so
progress is read off the data rather than tracked by hand. `.claude/skills/
distil-openings` carries the runbook, so a fresh session can pick the work up
with `/distil-openings` and no other context.

Two pieces of the core exist to make this practical. `parseAnnotatedPgn`
descends into sidelines, hanging each on the move it replaces, because courses
keep most of their teaching down there. And `resolveSan` resolves notation by
reading what it describes and checking only that move for legality, rather than
rendering SAN for every legal move until one matches — same answer, about ten
times faster, which is the difference between a four-minute pass over a corpus
and a forty-minute one.

## Design notes

**Why our own chess core.** The planned complexity engine needs make/unmake,
attack maps and incremental hashing — things a black-box move generator will not
expose. Writing it once, verified by perft, avoids rewriting the foundation
later.

**Why structures are separate from openings.** An IQP is the same problem
whether it came from the Panov, the Tarrasch or the Nimzo. Structures live in
their own encyclopedia and openings reference them by id, so learning
transfers the way it does over the board.

**Why structures are recognised, not tagged.** Referencing them by id only
works if somebody typed the id, which happened for 24 lines out of 3,844 — and
never for a game that left the book. But a structure is a property of the pawns
on the board, so `classifyStructure` reads it off the position instead: 519
book lines now arrive with one, and so does roughly a quarter of any real
middlegame. A structure held by Black comes back mirrored, with the plans,
breaks and diagram turned the right way up.

**Two layers in the book.** The imported ECO tables give *coverage* — almost any
opening sequence has a name. The 118 hand-written entries give *understanding* —
plans, structures, breaks, traps. They merge into one tree where curated entries
win on collision and theory is inherited downwards, so a 20-ply ECO sub-variation
still arrives with the ideas of the opening it belongs to.

**Why the move list is the source of truth.** Game state is a SAN line plus a
cursor, so stepping back and playing a different move is a truncation, not a
rebuild — the interaction the trainer needs when you want to try another reply.

## Next steps

1. **`packages/engine`** — evaluation and search, and then the interesting part:
   a *complexity* model that scores how hard a position is for a player of a
   given rating, rather than only whether a move is right.
2. **Recommendations** — read a player's games, estimate strength and style, and
   suggest openings and specific lines that fit.
3. **The book, next to the course.** A course teaches its own lines and says
   nothing about the ones it skipped. The opening book knows the plans,
   structures and breaks for the same positions, and showing them beside the
   author's note is the thing Chessable cannot do and this repo already can.
4. **Engine-marked alternatives** — accept anything within about a third of a
   pawn of the taught move, the way a course author would if they had the time,
   once `packages/engine` exists to ask.
5. **More UIs** — React Native and Tauri shells over the same packages.
