/**
 * A small White repertoire, written the way a real course PGN is: chapters in
 * the Event header, the teaching in comments, and most of the content in
 * sidelines rather than the main line.
 *
 * Chapter one branches at White's third move on purpose, once per kind:
 * `3.Bb5+` has a line under it (another variation to learn), `3.c3?!` is marked
 * bad (a move to recognise and avoid), and `3.Be2` is shown and dropped (an
 * alternative — playable, never required).
 */
export const COURSE_PGN = `[Event "Test Course: Open Sicilian"]

1. e4 c5 (1... e5 {The open game — a different chapter's problem.} 2. Nf3 Nc6 3. Bb5)
2. Nf3 d6 (2... Nc6 3. d4 cxd4 4. Nxd4) 3. d4 (3. Bb5+ {The Moscow.} Bd7 4. Bxd7+ Qxd7)
(3. c3?! {Too slow — Black gets ...Nf6 in with tempo.}) (3. Be2) 3... cxd4 4. Nxd4 Nf6
5. Nc3 a6 {The Najdorf. Now Be3 or Bg5.} *

[Event "Test Course: Move Orders"]

1. e4 c5 2. Nf3 Nc6 3. d4 {Straight into the open Sicilian, same as chapter one.}
cxd4 4. Nxd4 g6 *
`;

/** A Black repertoire, to check that side inference is reading the branching. */
export const BLACK_COURSE_PGN = `[Event "Black Course: The Caro-Kann"]

1. e4 (1. d4 d5 2. c4 c6) (1. Nf3 d5) 1... c6 2. d4 (2. Nc3 d5) (2. d3 d5) 2... d5 *
`;
