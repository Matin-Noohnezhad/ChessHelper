import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { identifyOpening } from '@coh/opening-book';
import { Chess } from '@coh/chess-core';
import { reviewPgn } from '@coh/review';
import type { PositionEvaluator } from '@coh/review';
import App from '../App.js';
import { Board } from '../components/Board.js';
import { OpeningPanel } from '../components/OpeningPanel.js';
import { ReviewSetup } from '../components/ReviewSetup.js';
import { ReviewReport } from '../components/ReviewView.js';
import { TrainerView } from '../components/TrainerView.js';

/**
 * Smoke tests: the component tree has to actually execute. Type checking will
 * not catch a bad hook call, a wrong board index or a crash inside a memo, and
 * those are exactly the failures that make the app show a blank page.
 */
describe('web app renders', () => {
  it('mounts the whole app with a full starting board', () => {
    const html = renderToStaticMarkup(<App />);
    expect(html).toContain('Chess Opening Helper');
    expect(html.match(/data-square="/g)).toHaveLength(64);
    // 32 pieces at the start, each drawn as one glyph span.
    expect(html.match(/class="piece piece--[wb]"/g)).toHaveLength(32);
    expect(html).toContain('White to move');
  });

  it('orients the board from Black’s side when asked', () => {
    const game = new Chess();
    const white = renderToStaticMarkup(
      <Board game={game} orientation="white" lastMove={null} onMove={() => {}} />,
    );
    const black = renderToStaticMarkup(
      <Board game={game} orientation="black" lastMove={null} onMove={() => {}} />,
    );
    expect(white.indexOf('data-square="a8"')).toBeLessThan(white.indexOf('data-square="h1"'));
    expect(black.indexOf('data-square="h1"')).toBeLessThan(black.indexOf('data-square="a8"'));
  });

  it('shows the identified opening with its ideas and breaks', () => {
    const match = identifyOpening(['e4', 'c5']);
    const html = renderToStaticMarkup(
      <OpeningPanel match={match} plies={2} onPlayMove={() => {}} onMarks={() => {}} />,
    );
    expect(html).toContain('Sicilian Defence');
    expect(html).toContain('B20');
    expect(html).toContain('half-open c-file');
    // Continuation chips offer the next named move from here.
    expect(html).toContain('Nf3');
  });

  it('renders the trainer with a board, an opening picker and its variations', () => {
    // No localStorage in this environment: the hook must degrade to a fresh
    // session rather than crashing the view.
    const html = renderToStaticMarkup(<TrainerView onStudyLine={() => {}} />);
    expect(html.match(/data-square="/g)).toHaveLength(64);
    expect(html).toContain('Sicilian Defence');
    expect(html).toContain('Najdorf Variation');
    expect(html).toContain('variations learned');
    expect(html).toContain('You play');
  });

  it('renders a deep line by inheriting the parent opening’s theory', () => {
    const match = identifyOpening(
      'd4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O Nc6 d5 Ne7'.split(' '),
    );
    const html = renderToStaticMarkup(
      <OpeningPanel match={match} plies={16} onPlayMove={() => {}} onMarks={() => {}} />,
    );
    expect(html).toContain('Mar del Plata');
    expect(html).toContain('Ideas shown for the parent line');
  });
});

/**
 * A flat evaluator: every position is level and every move is one of the
 * engine's. Enough to exercise the report's layout without a real search —
 * the numbers themselves are the review package's business.
 */
const flatEvaluator: PositionEvaluator = async (fen) => {
  const game = new Chess(fen);
  return {
    fen,
    depth: 10,
    candidates: game.legalMoves().slice(0, 3).map((move) => ({
      uci: move.uci,
      san: move.san,
      score: { cp: 0, mate: null },
      pv: [move.san],
    })),
  };
};

describe('game review UI', () => {
  const idle = {
    status: 'idle' as const,
    progress: { done: 0, total: 0 },
    review: null,
    error: null,
    speed: 'balanced' as const,
    setSpeed: () => {},
    start: () => {},
    cancel: () => {},
    clear: () => {},
  };

  it('offers a PGN box, a file picker and the depth presets', () => {
    const html = renderToStaticMarkup(
      <ReviewSetup controller={idle} currentGamePgn={'1.e4 e5 *'} />,
    );
    expect(html).toContain('Review a game');
    expect(html).toContain('Open a .pgn file');
    expect(html).toContain('Use the game on the board');
    expect(html).toContain('Balanced');
  });

  it('renders a full report: accuracies, phases, categories and the move list', async () => {
    const review = await reviewPgn(
      '[White "Ann"]\n[Black "Ben"]\n[Result "*"]\n\n1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 *',
      { evaluator: flatEvaluator },
    );
    const html = renderToStaticMarkup(<ReviewReport review={review} onReset={() => {}} />);

    expect(html).toContain('Ann');
    expect(html).toContain('Ben');
    expect(html).toContain('accuracy');
    expect(html).toContain('Opening');
    expect(html).toContain('Middlegame');
    expect(html).toContain('Endgame');
    // Every move is in the list, and the board still draws all 64 squares.
    expect(html).toContain('Bb5');
    expect(html.match(/data-square="/g)).toHaveLength(64);
  });
});
