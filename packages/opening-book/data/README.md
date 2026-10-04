# Opening and review theory data

The application ships an offline book assembled from three factual datasets.
No network request or account is needed during a review.

| Input | Source snapshot | License / provenance |
| --- | --- | --- |
| `a.tsv`–`e.tsv` | [lichess-org/chess-openings](https://github.com/lichess-org/chess-openings/tree/5a13018164f6bd88f48b3dc31a8e2a39f31a060a) | CC0; `LICHESS-LICENSE.txt` |
| `extended.tsv` | [JeffML/eco.json](https://github.com/JeffML/eco.json/tree/36cfd9227f553dec1d39ee20fa0775eea8f8e165), `ecoA.json`–`ecoE.json` | MIT; copyright Ömür Yanıkoğlu; `ECO-JSON-LICENSE.txt`. Reduced to ECO, name and move sequence. |
| `masters.tsv` | [rozim/ChessData](https://github.com/rozim/ChessData/tree/ed88abd2716da58ee55d42b662455c1c8ebe0776), `mega2600_part_01.pgn`–`mega2600_part_05.pgn` | Aggregated factual opening move sequences and occurrence counts. No game annotations or source prose are distributed. Exact URLs and SHA-256 checksums are in `masters-sources.json`. |

The imported names merge with the project's curated entries, which retain
priority. The resulting named book has 12,851 lines. The master supplement adds
7,221 terminal opening sequences, each seen in at least **8 distinct games**
involving at least **4 distinct players**, with **both players rated 2400+**.
138,348 games qualify after deduplication. Prefixes are counted before retaining
only terminal sequences, so every move in a retained line has the same minimum
support. Seven of these lines reach at least 21 complete moves; three reach 25.
These are frequency-backed master continuations, not a claim that every one is
an engine's preferred move or that every opening has 25 moves of forced theory.

## Recognition

`src/theory.generated.ts` contains 33,124 position/move edges from 22,983 source
positions. The builder replays every line with our chess library, aborting on
illegal input. Named trap lines are truncated before moves that allow mate in
one or end the game, so a Scholar's Mate blunder does not earn theory credit.
The generated statistics report these exclusions.

Review matches the **position before the move plus the played UCI move**. It
keeps the side to move, castling rights and legally capturable en-passant target;
move counters and non-capturable en-passant targets do not affect membership.
Transposed move orders therefore share book continuations. A later return to a
known continuation is recognized without relabeling preceding unknown moves.
FEN-start games use the same lookup. There is no runtime move-15 cutoff.

Every reviewed move has exactly one quality category. Book edges always count
as `book` (displayed as **Theory**), including known gambits; optional descriptive
tags do not increment any other category. Engine evaluations/accuracy remain
available, but book moves are excluded from the list of engine mistakes to revisit.

This is an independently sourced book, not Chess.com's proprietary book. The
bundled collection demonstrates recognition beyond move 21, but exact coverage
parity with Chess.com has not been established. Unknown moves are not called
theory just because they occur early or the engine likes them.

## Rebuild and refresh

From the repository root:

```sh
npm run ingest:theory
```

This validates the vendored inputs and deterministically rebuilds both generated
TypeScript files. The browser loads a lookup table, never replays the corpus.
`npm run ingest:eco -- --fetch` restores the two pinned upstream named datasets;
change the pinned revisions in the script and this document for a deliberate
source update, then regenerate theory too.

To reproduce the master aggregation, download the five files listed in
`masters-sources.json` to a directory and copy that manifest there as
`sources.json` **using its `sources` array as the JSON root**. Then run:

```sh
python3 packages/opening-book/scripts/extract-master-theory.py /path/to/pgns
npm run ingest:theory
```

The extractor verifies all input checksums before processing. It removes comments
and variations, deduplicates games using players/date/round/full mainline, and
counts prefixes through 50 plies. This is a source-extraction horizon, not a
runtime restriction. To expand coverage, update the source snapshot/filter
parameters, regenerate and rerun the theory and review regression tests. The
original PGNs (about 113 MB) are deliberately not part of the application bundle.
