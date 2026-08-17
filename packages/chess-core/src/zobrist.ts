/**
 * Zobrist hashing, kept as two 32-bit halves rather than a BigInt so that
 * updating it stays in the JS integer fast path.
 *
 * The keys come from a seeded xorshift, so a given position always hashes to
 * the same value across runs and machines — the opening book and the future
 * transposition table can both rely on that.
 */

const rand = (() => {
  let s = 0x9e3779b9 >>> 0;
  return () => {
    s ^= s << 13;
    s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5;
    s >>>= 0;
    return s;
  };
})();

const alloc = (n: number): Int32Array => {
  const a = new Int32Array(n);
  for (let i = 0; i < n; i++) a[i] = rand() | 0;
  return a;
};

/** Indexed `[piece * 128 + square]`; piece codes run 0..14. */
export const Z_PIECE_LO = alloc(15 * 128);
export const Z_PIECE_HI = alloc(15 * 128);
export const Z_CASTLING_LO = alloc(16);
export const Z_CASTLING_HI = alloc(16);
/** Indexed by file of the en-passant square. */
export const Z_EP_LO = alloc(8);
export const Z_EP_HI = alloc(8);
export const Z_SIDE_LO = rand() | 0;
export const Z_SIDE_HI = rand() | 0;

/** Stable printable key, e.g. for book lookups and repetition maps. */
export function hashKey(lo: number, hi: number): string {
  return ((hi >>> 0).toString(16).padStart(8, '0') +
    (lo >>> 0).toString(16).padStart(8, '0'));
}
