/**
 * Turns SAN into something a speech synthesiser reads out like a commentator.
 *
 * The rules are the ones an arbiter uses aloud: piece name, "takes" for a
 * capture, the destination square spelt out, then check or mate. Bare squares
 * such as "e4" have to be spaced apart — a synthesiser handed "e4" says
 * "ee-four" at best and reads it as a word at worst.
 */

const PIECE_WORDS: Record<string, string> = {
  K: 'King',
  Q: 'Queen',
  R: 'Rook',
  B: 'Bishop',
  N: 'Knight',
};

const PHONETIC: Record<string, string> = {
  a: 'Alfa',
  b: 'Bravo',
  c: 'Charlie',
  d: 'Delta',
  e: 'Echo',
  f: 'Foxtrot',
  g: 'Golf',
  h: 'Hotel',
};

export interface SpeechOptions {
  /** Reads files as the NATO alphabet, the way ChessBase can be set to. */
  phonetic?: boolean;
}

function file(letter: string, options: SpeechOptions): string {
  const lower = letter.toLowerCase();
  return options.phonetic ? (PHONETIC[lower] ?? lower) : lower.toUpperCase();
}

function square(name: string, options: SpeechOptions): string {
  return `${file(name[0]!, options)} ${name[1]}`;
}

export function sanToSpeech(san: string, options: SpeechOptions = {}): string {
  const suffix = san.endsWith('#')
    ? ', checkmate'
    : san.endsWith('+')
      ? ', check'
      : '';
  let body = san.replace(/[+#?!]+$/, '');

  // Castling is spoken as a whole, and the zero and letter O spellings both
  // appear in the wild.
  const castle = body.replace(/0/g, 'O');
  if (castle === 'O-O') return `Castles kingside${suffix}`;
  if (castle === 'O-O-O') return `Castles queenside${suffix}`;

  let promotion = '';
  const promo = /=([QRBN])$/.exec(body);
  if (promo) {
    promotion = `, promotes to ${PIECE_WORDS[promo[1]!]!.toLowerCase()}`;
    body = body.slice(0, promo.index);
  }

  const capture = body.includes('x');
  const target = body.slice(-2);
  const head = body.slice(0, -2).replace('x', '');

  const piece = head && PIECE_WORDS[head[0]!] ? PIECE_WORDS[head[0]!]! : '';
  // Anything left over after the piece letter is a disambiguation — the file or
  // rank of the piece that moves, which is worth saying so the listener can
  // tell two knights apart.
  const from = piece ? head.slice(1) : head;
  const origin = from ? ` ${from.length === 1 && /[a-h]/.test(from) ? file(from, options) : from}` : '';

  // "Knight F 3" is how it is said; "to" only earns its place once a
  // disambiguation has been spoken and the sentence would otherwise run
  // two squares together — "Rook 1 to E 2".
  const verb = capture ? 'takes' : origin ? 'to' : '';
  const words = [piece, origin.trim(), verb, square(target, options)].filter(Boolean).join(' ');

  return `${words}${promotion}${suffix}`;
}

/** "1... c5" style prefix so a listener can follow the move number. */
export function moveNumberPrefix(ply: number): string {
  const number = Math.floor(ply / 2) + 1;
  return ply % 2 === 0 ? `${number}. ` : '';
}
