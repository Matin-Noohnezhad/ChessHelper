import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { identifyOpening } from '@coh/opening-book';
import { Chess } from '@coh/chess-core';
import { QUALITY_LABELS, QUALITY_ORDER, reviewPgn } from '@coh/review';
import type { PositionEvaluator } from '@coh/review';
import { MAX_LEVEL, allVariations, buildCourse, trainableMoves } from '@coh/course';
import App from '../App.js';
import { Board } from '../components/Board.js';
import { OpeningPanel } from '../components/OpeningPanel.js';
import { CourseDashboard } from '../components/CourseDashboard.js';
import { CourseImport, CoursePreview } from '../components/CourseImport.js';
import { CourseLibrary } from '../components/CourseLibrary.js';
import { CourseSession } from '../components/CourseSession.js';
import { ReviewSetup } from '../components/ReviewSetup.js';
import { ReviewReport, StructureNote, moveBadge } from '../components/ReviewView.js';
import { SettingsPanel } from '../components/SettingsPanel.js';
import { TrainerView } from '../components/TrainerView.js';
import { entryFrom } from '../hooks/useCourseLibrary.js';

/**
 * Smoke tests: the component tree has to actually execute. Type checking will
 * not catch a bad hook call, a wrong board index or a crash inside a memo, and
 * those are exactly the failures that make the app show a blank page.
 */
/** The position a line reaches, which is what the panel reads structures from. */
function fenAfter(moves: string[]): string {
  const board = new Chess();
  for (const san of moves) board.move(san);
  return board.fen();
}

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
    const moves = ['e4', 'c5'];
    const match = identifyOpening(moves);
    const html = renderToStaticMarkup(
      <OpeningPanel
        match={match}
        fen={fenAfter(moves)}
        plies={2}
        onPlayMove={() => {}}
        onMarks={() => {}}
      />,
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
    // One ply past the Mar del Plata, which carries its own theory, so what is
    // shown here has to have been inherited from it.
    const moves = 'd4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O Nc6 d5 Ne7 Ne1'.split(' ');
    const match = identifyOpening(moves);
    const html = renderToStaticMarkup(
      <OpeningPanel
        match={match}
        fen={fenAfter(moves)}
        plies={17}
        onPlayMove={() => {}}
        onMarks={() => {}}
      />,
    );
    expect(html).toContain('Classical System');
    expect(html).toContain('Ideas shown for the parent line');
    expect(html).toContain('Mar del Plata'); // the parent it was inherited from
    // The locked centre is read off the board, not from a tag on the opening,
    // and the tab says so before you open it.
    expect(html).toContain('pawn structures on the board');
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
      <ReviewSetup controller={idle} currentGamePgn={'1.e4 e5 *'} onReviewBoardGame={() => {}} />,
    );
    expect(html).toContain('Review a game');
    expect(html).toContain('Open a .pgn file');
    expect(html).toContain('Balanced');
  });

  it('offers the moves on the board as a review of their own, in one click', () => {
    const html = renderToStaticMarkup(
      <ReviewSetup
        controller={idle}
        currentGamePgn={'1.e4 e5 2.Nf3 Nc6 *'}
        onReviewBoardGame={() => {}}
      />,
    );
    expect(html).toContain('The game on the board');
    expect(html).toContain('Review these moves');
    expect(html).toContain('2 moves');
    expect(html).toContain('e4 e5 Nf3 Nc6');
  });

  it('has nothing to say about the board when no moves have been played', () => {
    const html = renderToStaticMarkup(
      <ReviewSetup controller={idle} currentGamePgn={null} onReviewBoardGame={() => {}} />,
    );
    expect(html).not.toContain('The game on the board');
    expect(html).toContain('Open a .pgn file');
  });

  it('names the pawn structure on the board, from the side to move', () => {
    // A French Advance: by move four the structure is the useful fact about the
    // position, and nothing tagged this game with it.
    const fen = fenAfter('e4 e6 d4 d5 e5 c5 c3 Nc6'.split(' '));

    const black = renderToStaticMarkup(<StructureNote fen={fen} toMove="black" />);
    expect(black).toContain('French Pawn Chain');
    expect(black).toContain('Black breaks here');
    expect(black).toContain('f6'); // ...f6, the break at the head of White's chain

    const white = renderToStaticMarkup(<StructureNote fen={fen} toMove="white" />);
    expect(white).toContain('White breaks here');
    expect(white).not.toContain('Black breaks here');

    // Nothing to say about a position with no structure yet.
    expect(renderToStaticMarkup(<StructureNote fen={fenAfter(['e4'])} toMove="black" />)).toBe('');
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

  it('sticks the move’s category to the square it landed on', () => {
    const html = renderToStaticMarkup(
      <Board
        game={new Chess()}
        orientation="white"
        lastMove={null}
        onMove={() => {}}
        badge={{ square: 'e4', symbol: '⚔', label: 'Sacrifice', className: 'q q--sacrifice' }}
      />,
    );
    // The disc sits inside e4's cell, carrying the colour class the move list
    // and the graph use for the same category.
    const cell = html.slice(html.indexOf('data-square="e4"'));
    expect(cell.slice(0, cell.indexOf('data-square="d4"'))).toContain('square-badge');
    expect(html).toContain('q--sacrifice');
    expect(html).toContain('Sacrifice');
  });

  it('takes the badge from the move, and hides it behind the engine’s suggestion', async () => {
    const review = await reviewPgn('1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 *', { evaluator: flatEvaluator });
    const knight = review.moves[2]!;
    expect(knight.san).toBe('Nf3');

    const badge = moveBadge(knight, false);
    expect(badge?.square).toBe('f3');
    expect(badge?.label).toBe(QUALITY_LABELS[knight.quality]);
    expect(badge?.className).toContain(`q--${knight.quality}`);

    // While the engine's move is on the board the position predates the move,
    // so there is nothing to pass judgement on yet.
    expect(moveBadge(knight, true)).toBeNull();
    expect(moveBadge(null, false)).toBeNull();
  });

  it('lists every move category, including the ones neither side scored', async () => {
    const review = await reviewPgn('1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 *', { evaluator: flatEvaluator });
    const html = renderToStaticMarkup(<ReviewReport review={review} onReset={() => {}} />);

    // A flat evaluator produces nothing but theory, so every other row is a zero
    // — and every one of them still has to be on screen.
    for (const label of QUALITY_ORDER.map((quality) => QUALITY_LABELS[quality])) {
      expect(html).toContain(label);
    }
    expect(html).toContain('Sacrifice');
    expect(html).toContain('is-empty');
  });
});

describe('course trainer UI', () => {
  const PGN = `[Event "Test Course: Open Sicilian"]

1. e4 c5 2. Nf3 d6 {Entering the Najdorf complex — d6 keeps e5 covered.}
(2... Nc6 3. d4 cxd4 4. Nxd4) 3. d4 (3. Be2) cxd4 4. Nxd4 Nf6 5. Nc3 *
`;

  const stored = {
    id: 'test-course',
    name: 'Test Course',
    pgn: PGN,
    side: 'white' as const,
    importedAt: 0,
  };
  const entry = entryFrom(stored, {});

  it('offers a paste box and a file picker for a course PGN', () => {
    const html = renderToStaticMarkup(<CourseImport onImport={() => {}} />);
    expect(html).toContain('Import a course');
    expect(html).toContain('Open a .pgn file');
  });

  it('previews what the parse found before anything is saved', () => {
    const course = buildCourse(PGN);
    const html = renderToStaticMarkup(
      <CoursePreview
        course={course}
        variations={allVariations(course).length}
        moves={trainableMoves(course.chapters, course.side).size}
        name={course.name}
        side={course.side}
        inferred
        onNameChange={() => {}}
        onSideChange={() => {}}
        onConfirm={() => {}}
      />,
    );
    expect(html).toContain('Open Sicilian');
    expect(html).toContain('2 variations');
    expect(html).toContain('side inferred from where the course branches');
  });

  it('lists a course with what is learned and what is waiting', () => {
    // No IndexedDB in this environment: the library must build its entries from
    // the stored PGN rather than crashing on the missing store.
    const html = renderToStaticMarkup(
      <CourseLibrary
        entries={[entry]}
        onOpen={() => {}}
        onStart={() => {}}
        onDelete={() => {}}
        onImport={() => {}}
      />,
    );
    expect(html).toContain('Test Course');
    expect(html).toContain('1 chapter');
    expect(html).toContain('not met yet');
    expect(html).toContain('Quick review');
  });

  it('breaks a course down by chapter, in moves rather than lines', () => {
    const html = renderToStaticMarkup(
      <CourseDashboard
        entry={entry}
        onStart={() => {}}
        onBack={() => {}}
        onResetProgress={() => {}}
        onSetSide={() => {}}
      />,
    );
    expect(html).toContain('Open Sicilian');
    expect(html).toContain('moves learned');
    // The ladder is drawn with a rung per interval, "not met" included.
    expect(html.match(/course-ladder__rung/g)).toHaveLength(MAX_LEVEL + 1);
    expect(html).toContain('4h');
    expect(html).toContain('6mo');
  });

  it('lists every line of a chapter with a ring and its notation', () => {
    const html = renderToStaticMarkup(
      <CourseDashboard
        entry={entry}
        onStart={() => {}}
        onBack={() => {}}
        onResetProgress={() => {}}
        onSetSide={() => {}}
      />,
    );
    // Both variations of the fixture, written out move by move, each with a ring.
    expect(html).toContain('course-outline__line');
    expect(html.match(/class="ring"/g)?.length).toBe(2);
    expect(html).toContain('1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3');
    expect(html).toContain('1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4');
  });

  it('puts a line rail beside the board in a session', () => {
    const html = renderToStaticMarkup(
      <CourseSession entry={entry} mode="learn" onExit={() => {}} onPickLine={() => {}} />,
    );
    expect(html).toContain('course-session--rail');
    expect(html).toContain('course-session__rail');
    // The line being taught is marked active in the rail.
    expect(html).toContain('is-new is-active');
  });

  it('opens a learn session by offering to play the line, not by asking for it', () => {
    const html = renderToStaticMarkup(
      <CourseSession entry={entry} mode="learn" onExit={() => {}} onPickLine={() => {}} />,
    );
    expect(html.match(/data-square="/g)).toHaveLength(64);
    expect(html).toContain('Learning');
    expect(html).toContain('Watch the line');
    expect(html).toContain('you will be asked for them next');
    // The board is untouched — the demonstration has not started yet.
    expect(html).toContain('data-square="e2"');
  });

  it('counts the session in lines, and says which try at the line this is', () => {
    const html = renderToStaticMarkup(
      <CourseSession entry={entry} mode="learn" onExit={() => {}} onPickLine={() => {}} />,
    );
    // Two variations, each taught in two parts and then asked from the top:
    // two lines, three tries at this one — not "1 of 6 tasks", which is a
    // number about the machine rather than about the chapter.
    expect(html).toContain('Line 1 of 2');
    expect(html).toContain('try 1 of 3');
    expect(html).not.toContain('of 6');
  });

  it('says which part of a long line is being taught', () => {
    const html = renderToStaticMarkup(
      <CourseSession entry={entry} mode="learn" onExit={() => {}} onPickLine={() => {}} />,
    );
    // Seven moves of your own, four to a part.
    expect(html).toContain('Part 1 of 2');
    expect(html).toContain('then the whole thing from the top');
    expect(html).toContain('Let me try');
  });

  it('asks for the part back without naming a move of it', () => {
    // A review session on a course with one move learned puts the board
    // straight into recall, which is where the prompt has to hold its tongue.
    const moves = trainableMoves(entry.course.chapters, entry.course.side);
    const first = [...moves.keys()][0]!;
    const learned = entryFrom(stored, {
      [first]: { key: first, level: 2, dueAt: 0, lastSeenAt: 0, correct: 2, wrong: 0 },
    });
    const html = renderToStaticMarkup(
      <CourseSession entry={learned} mode="review" onExit={() => {}} onPickLine={() => {}} />,
    );
    expect(html).toContain('Your turn');
    expect(html).toContain('to play');
    // The move being asked for appears nowhere on the page.
    expect(html).not.toContain('The move was');
    expect(html).not.toContain('The course plays');
  });

  it('has nothing to review until something has been learned', () => {
    const html = renderToStaticMarkup(
      <CourseSession entry={entry} mode="review" onExit={() => {}} onPickLine={() => {}} />,
    );
    expect(html).toContain('Nothing to do here');
    expect(html).not.toContain('data-square=');
  });

  it('offers a per-chapter and per-line progress reset once there is progress', () => {
    const learned = entryFrom(
      stored,
      Object.fromEntries(
        [...trainableMoves(entry.course.chapters, entry.course.side).keys()].map((key) => [
          key,
          { key, level: 3, dueAt: 0, lastSeenAt: 0, correct: 3, wrong: 0 },
        ]),
      ),
    );
    const html = renderToStaticMarkup(
      <CourseDashboard
        entry={learned}
        onStart={() => {}}
        onBack={() => {}}
        onResetProgress={() => {}}
        onResetChapter={() => {}}
        onResetLine={() => {}}
        onSetSide={() => {}}
      />,
    );
    expect(html).toContain('Reset chapter');
    expect(html).toContain('course-outline__line-reset');
    expect(html).toContain('Reset progress for 1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3');
  });

  it('does not offer a scoped reset for a line with nothing learned', () => {
    const html = renderToStaticMarkup(
      <CourseDashboard
        entry={entry}
        onStart={() => {}}
        onBack={() => {}}
        onResetProgress={() => {}}
        onResetChapter={() => {}}
        onResetLine={() => {}}
        onSetSide={() => {}}
      />,
    );
    expect(html).not.toContain('course-outline__line-reset');
    expect(html).not.toContain('Reset chapter');
  });
});

describe('settings', () => {
  it('offers the annotation thickness and the demonstration pace', () => {
    const html = renderToStaticMarkup(
      <SettingsPanel
        annotationThickness="medium"
        onAnnotationThicknessChange={() => {}}
        watchPace="normal"
        onWatchPaceChange={() => {}}
        onClose={() => {}}
      />,
    );
    expect(html).toContain('Course line demonstration');
    for (const label of ['Manual', 'Slow', 'Normal', 'Fast']) expect(html).toContain(label);
  });
});
