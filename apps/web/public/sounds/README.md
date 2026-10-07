# Downloaded board sounds

Retrieved on 2026-10-06. The audio files are original downloads, without synthesis, resampling, trimming, or normalization. Files are served locally; runtime playback does not contact the source sites.

## Sources

- **Chess.com:** 370 distinct audio files across 22 named sets, obtained from the public sound URLs in the sound-set catalog loaded by the user’s [analysis tab](https://www.chess.com/analysis). The tab used **Default**. The internal catalog entry named `DO NOT USE` was excluded. Shared files are stored once.
- **Lichess:** 254 files across 8 downloadable effect sets from the [official source repository](https://github.com/lichess-org/lila/tree/5ae58154b2be1033dcb0252173b4fff4bb02e73a/public/sound), pinned to commit `5ae58154b2be1033dcb0252173b4fff4bb02e73a`. Git symlinks are resolved to their audio content. The open analysis tab used **Lisp**; its Move, Capture, Check, and Checkmate files were verified byte for byte against the live site.
- **ChessBase:** 31 board files from the [web replay board](https://replay.chessbase.com/), downloaded from its shared `https://pgn.chessbase.com/common/Media/Sounds/Board/` directory. Its [ChessAudio implementation](https://replay.chessbase.com/Scripts/CBReplay.js) defines 11 move variants, 15 capture variants, castling, new game, two strong moves, and a strong capture. These are verified web assets; equivalence to the desktop application's recordings has not been established.
- **ChessBase desktop:** 47 board files extracted from the official Playchess 9.3 desktop installer linked on the [ChessBase download page](https://en.chessbase.com/pages/download). Of these, 24 are also present byte for byte in the official ChessBase Reader 2017 installer, including the classic `MOVE.mp3`, `CAPTURE.mp3`, and `castle.mp3`. Both installers were inspected as archives without executing them. See [chessbase-desktop-manifest.json](chessbase-desktop-manifest.json) for installer URLs, installer hashes, archive paths, and individual audio hashes. The desktop classic move and capture have different decoded audio from the web set.

The JSON manifests list every local filename, original URL, byte count, and SHA-256 hash. `lichess-live-verification.json` records the live Lisp URLs. Only board sounds for the selected style are preloaded. Additional downloaded game, clock, notification, and lesson effects are retained in the library for future use. MP3/OGG/WEBM encodings of the same sound were not duplicated; a few Chess.com URLs ending in `.mp3` contain WAV audio and are preserved exactly as served.

## Sets

| Site | Sound set | Downloaded event files |
| --- | --- | ---: |
| Chess.com | Stone Capture | 34 |
| Chess.com | Default | 34 |
| Chess.com | Nature | 34 |
| Chess.com | Metal | 34 |
| Chess.com | Marble | 34 |
| Chess.com | Space | 34 |
| Chess.com | Beat | 34 |
| Chess.com | Silly | 34 |
| Chess.com | Lolz | 34 |
| Chess.com | Newspaper | 34 |
| Chess.com | Pebbles | 34 |
| Chess.com | RuneScape - Bob the Cat | 35 |
| Chess.com | RuneScape - Vannaka & Wise Old Man | 35 |
| Chess.com | RuneScape - Bentnoze and Wartface | 35 |
| Chess.com | Chess The Musical | 35 |
| Chess.com | RuneScape - Sliske | 35 |
| Chess.com | Events - Esports World Cup | 35 |
| Chess.com | Bots - Earth Day | 34 |
| Chess.com | Bots - Martin's Family | 35 |
| Chess.com | Basketball | 35 |
| Chess.com | Baseball | 35 |
| Chess.com | Bots - Pygmy | 34 |
| Lichess | futuristic | 32 |
| Lichess | lisp | 35 |
| Lichess | nes | 31 |
| Lichess | piano | 31 |
| Lichess | robot | 31 |
| Lichess | sfx | 31 |
| Lichess | standard | 33 |
| Lichess | woodland | 30 |
| ChessBase | Web board | 31 |
| ChessBase | Desktop library (classic and varied presets) | 47 |

Chess.com event counts include shared assets; 370 distinct files are stored. Lichess speech synthesis and Pentatonic’s position-dependent music engine are not static effect sets and are not implemented here.

## Board event mapping

| Board event | Chess.com | Lichess |
| --- | --- | --- |
| Move | move-self | Move |
| Capture | capture | Capture |
| Castle | castle | Move |
| Promotion | promote | Move (Capture on a capture) |
| Check | move-check | Move/Capture + Check |
| Checkmate | game-end | Move/Capture + Checkmate |

Lichess follows its [sound implementation](https://github.com/lichess-org/lila/blob/5ae58154b2be1033dcb0252173b4fff4bb02e73a/ui/site/src/sound.ts): move or capture plays alongside the check/checkmate effect. Some upstream effects are deliberately silent or identical to another event. Chess.com supplies a game-end effect rather than a dedicated mate file. The original Wooden and ChessBase-inspired synthesized styles remain separate. Existing `chesscom` and `lichess` settings now select the respective Default and Standard recordings.

**ChessBase — Web board** (`chessbase-recorded`) randomly selects `move1`–`move11` for ordinary moves and `capture1`–`capture15` for captures, and uses `castle` for castling. Like its web board's `onMove`, check, checkmate, and promotion use the underlying move/capture/castle effect without a separate chime. All 27 playback files are preloaded. `newgame`, `moveStrong1`, `moveStrong2`, and `CaptStrong` are retained for future use; the app does not currently emit those events. No server applause or commentary is added to the board style. The existing `chessbase` preference continues to select the separately labelled synthesized style.

**ChessBase — Desktop (classic)** (`chessbase-desktop`) uses the desktop `MOVE.mp3`, `CAPTURE.mp3`, and `castle.mp3`. **ChessBase — Desktop (varied)** (`chessbase-desktop-varied`) alternates the Reader 2017 pool: `MOVE`, `MOVE2`–`MOVE6` and `CAPTURE`, `CAPTURE2`–`CAPTURE5`, plus castling. The classic preset preloads three recordings; varied preloads twelve. Check, mate, and promotion retain the underlying move/capture/castle sound. These are app-defined presets using original desktop recordings; the exact playback selection and timing of an unspecified ChessBase desktop version have not been verified. Additional hit, setup, clock, and feedback recordings remain in the library. Local desktop filenames are lowercased; their audio bytes are unchanged.

## Unavailable files

Chess.com returned HTTP 403 for these 18 catalog entries. They were not replaced with synthetic sounds; none are required for board playback.
- https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/lesson_pass.mp3
- https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/draw-offer.mp3
- https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/nature/lesson_pass.mp3
- https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/nature/draw-offer.mp3
- https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/metal/lesson_pass.mp3
- https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/metal/draw-offer.mp3
- https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/marble/lesson_pass.mp3
- https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/marble/draw-offer.mp3
- https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/space/lesson_pass.mp3
- https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/space/draw-offer.mp3
- https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/beat/lesson_pass.mp3
- https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/beat/draw-offer.mp3
- https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/silly/lesson_pass.mp3
- https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/silly/draw-offer.mp3
- https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/lolz/lesson_pass.mp3
- https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/lolz/draw-offer.mp3
- https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/newspaper/lesson_pass.mp3
- https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/newspaper/draw-offer.mp3

## Attribution and rights

Chess.com recordings belong to their respective rightsholders; the downloaded catalog did not provide a redistribution license. These files are not covered by any original-code license in this project.

ChessBase recordings belong to their respective rightsholders. The source pages do not supply a redistribution license for these audio files; they are not covered by this project's original-code license. Per-file source URLs and SHA-256 hashes are recorded in [chessbase-manifest.json](chessbase-manifest.json).

Lichess’s upstream notices are preserved in [LICHESS-COPYING.md](LICHESS-COPYING.md). They name Enigmahack for Futuristic, NES, Piano, and SFX (AGPLv3+), and EdinburghCollective for Lisp (CC BY-NC-SA 4.0); other sounds are listed under upstream non-free exceptions. See those upstream notices rather than assuming all Lichess assets share its software license.
