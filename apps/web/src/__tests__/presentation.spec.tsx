import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Chess } from '@coh/chess-core';
import { Board } from '../components/Board.js';
import { MaterialBar } from '../components/MaterialBar.js';
import { sanToSpeech } from '../lib/sanSpeech.js';
import { BOARD_THEMES, PIECE_SETS, UI_THEMES, boardTheme, pieceSet, themeVars, uiTheme } from '../theme/themes.js';

describe('spoken move notation', () => {
  it('says a pawn move as a spaced-out square', () => {
    // "e4" handed to a synthesiser unspaced is read as a word.
    expect(sanToSpeech('e4')).toBe('E 4');
  });

  it('names the piece and the destination', () => {
    expect(sanToSpeech('Nf3')).toBe('Knight F 3');
    expect(sanToSpeech('Bb5')).toBe('Bishop B 5');
  });

  it('says "takes" for captures, on both pieces and pawns', () => {
    expect(sanToSpeech('Qxd5')).toBe('Queen takes D 5');
    expect(sanToSpeech('exd5')).toBe('E takes D 5');
  });

  it('keeps the disambiguation that tells two pieces apart', () => {
    expect(sanToSpeech('Nbd7')).toBe('Knight B to D 7');
    expect(sanToSpeech('R1e2')).toBe('Rook 1 to E 2');
  });

  it('speaks castling as a whole rather than square by square', () => {
    expect(sanToSpeech('O-O')).toBe('Castles kingside');
    expect(sanToSpeech('O-O-O')).toBe('Castles queenside');
    expect(sanToSpeech('0-0+')).toBe('Castles kingside, check');
  });

  it('appends check and mate, and reads out a promotion', () => {
    expect(sanToSpeech('Ng5+')).toBe('Knight G 5, check');
    expect(sanToSpeech('Qh7#')).toBe('Queen H 7, checkmate');
    expect(sanToSpeech('e8=Q+')).toBe('E 8, promotes to queen, check');
    expect(sanToSpeech('bxa8=N')).toBe('B takes A 8, promotes to knight');
  });

  it('reads files phonetically when asked, the way ChessBase can be set to', () => {
    expect(sanToSpeech('Nf3', { phonetic: true })).toBe('Knight Foxtrot 3');
    expect(sanToSpeech('exd5', { phonetic: true })).toBe('Echo takes Delta 5');
  });

  it('ignores annotation glyphs rather than trying to say them', () => {
    expect(sanToSpeech('Nf3!?')).toBe('Knight F 3');
  });
});

describe('themes', () => {
  it('exposes every board, piece set and shell as CSS variables', () => {
    const vars = themeVars(uiTheme('dark'), boardTheme('walnut'), pieceSet('fritz'));
    expect(vars['--sq-light']).toBe(boardTheme('walnut').light);
    expect(vars['--pf-w']).toBe(pieceSet('fritz').whiteFill);
    expect(vars['--bg']).toBe(uiTheme('dark').vars['--bg']);
  });

  it('falls back to the first entry for an id that no longer exists', () => {
    // Stored preferences outlive renamed themes; they must not blank the board.
    expect(boardTheme('removed-theme')).toBe(BOARD_THEMES[0]);
    expect(pieceSet('removed-set')).toBe(PIECE_SETS[0]);
    expect(uiTheme('removed-ui')).toBe(UI_THEMES[0]);
  });

  it('gives every theme a distinct id', () => {
    const ids = [...BOARD_THEMES, ...PIECE_SETS, ...UI_THEMES].map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('board chrome', () => {
  const game = new Chess();

  it('draws the pieces as vectors and labels them for a screen reader', () => {
    const html = renderToStaticMarkup(
      <Board game={game} orientation="white" lastMove={null} onMove={() => {}} />,
    );
    expect(html.match(/<svg viewBox="0 0 45 45"/g)).toHaveLength(32);
    expect(html).toContain('aria-label="white knight"');
  });

  it('puts the coordinates on the frame, running the right way for each side', () => {
    const white = renderToStaticMarkup(
      <Board game={game} orientation="white" lastMove={null} onMove={() => {}} />,
    );
    const black = renderToStaticMarkup(
      <Board game={game} orientation="black" lastMove={null} onMove={() => {}} />,
    );
    const files = (html: string) =>
      /class="frame-coords frame-coords--file">(.*?)<\/div>/s
        .exec(html)![1]!
        .replace(/<[^>]+>/g, '');
    expect(files(white)).toBe('abcdefgh');
    expect(files(black)).toBe('hgfedcba');
  });

  it('reports no captured material in the starting position', () => {
    const html = renderToStaticMarkup(<MaterialBar game={game} side="w" />);
    expect(html).not.toContain('class="piece');
    expect(html).not.toContain('material__edge');
  });

  it('counts captured material and the resulting edge', () => {
    const played = new Chess();
    // 1.e4 d5 2.exd5 Qxd5 3.Nc3 Qxa2 4.Rxa2 — White has won a queen and a pawn
    // for two pawns, so it is eight points up.
    for (const san of ['e4', 'd5', 'exd5', 'Qxd5', 'Nc3', 'Qxa2', 'Rxa2']) played.move(san);
    const white = renderToStaticMarkup(<MaterialBar game={played} side="w" />);
    expect(white.match(/class="piece piece--b"/g)).toHaveLength(2); // queen and a pawn
    expect(white).toContain('+8');
    // The side that is behind shows its captures but no number.
    const black = renderToStaticMarkup(<MaterialBar game={played} side="b" />);
    expect(black.match(/class="piece piece--w"/g)).toHaveLength(2); // two pawns
    expect(black).not.toContain('material__edge');
  });
});
