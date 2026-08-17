Stockfish 18, "lite single-threaded" WASM build, vendored (not npm-installed)
because the `stockfish` package bundles every build variant and unpacks to
~250MB — we only need these two files.

Source: https://www.npmjs.com/package/stockfish (v18.0.8), `bin/stockfish-18-lite-single.{js,wasm}`
License: GPL-3.0 (see LICENSE.txt). Run as a separate Worker process talking
UCI over postMessage, not linked into the app bundle, so the app code itself
is unaffected by the GPL.

To upgrade: download the new version's tarball from npm, copy the two
`*-lite-single.{js,wasm}` files here (same basenames, so the `.js` finds its
`.wasm` automatically), and update the filename referenced in
`src/hooks/useEngine.ts`.
