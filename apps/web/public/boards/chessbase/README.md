# ChessBase board presets

Original assets from [ChessBase's Playchess 9.3 installer](https://download.chessbase.com/download/playchess/PlayChessV9Setup.exe), extracted without running the installer. Artwork belongs to ChessBase GmbH. These files are not covered by this project's code license; no redistribution license is asserted here.

The gallery includes all 17 fixed 2D board presets found in this installer: Fritz5, Junior5, Nimzo, Hiarcs, Fritz4, Grey, Petrol, Maple, Teak, Cherry, Babinga, Pine, Worn, Green Marble, Brown Marble, Metal, and Grass. “Plain Colour” and “User BMP” are customization controls, not additional presets. This collection does not claim to cover every ChessBase release or its 3D boards.

## Extraction and verification

- PNG resources were copied byte-for-byte from `Textures3.dll`, resource type `PNG`, language 1031. `manifest.json` records resource IDs, file sizes, SHA-256 hashes, and the source installer hash.
- Texture names come from the DLL's English string resources. Its board table (RVA `0x15000`, 10 records of `0x98` bytes) supplies the exact dark-square, light-square, and border resource IDs. `GetBoardCount` exposes nine ordinary presets; the tenth is Grass.
- Solid colors come from `PlayChessV9.exe`'s built-in scheme switch (VA `0x95917a`–`0x95939c`), with names from the corresponding name switch (VA `0x95958c`–`0x9595f2`). Fritz5 and Fritz4 intentionally share square colors. Teak and Worn share squares but have different borders; Grass uses Cherry squares with a grass border.
- Petrol uses `CBColor::FromHSL`: hue 0.5, saturation 0.3, lightness 0.92 for light squares and 0.47 for dark squares. CSS preserves those HSL values.
- The browser scales the original textures to each square and uses the original border texture. Solid fallback colors for textured themes are the image's average RGB. Piece shapes, piece colors, window backgrounds, and board geometry remain app settings rather than being imported from the desktop presets.

ChessBase documents its board design settings in the [official manual](https://help.chessbase.com/CBase/18/Eng/000061.htm).
