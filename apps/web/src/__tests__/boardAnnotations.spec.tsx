import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Chess } from '@coh/chess-core';
import { Board } from '../components/Board.js';
import { AnnotationArrow, AnnotationSquare, AnnotationStyleContext, LastMoveArrowContext, ANNOTATION_THICKNESS_OPTIONS } from '../components/BoardAnnotations.js';

describe('board drawing styles', () => {
  it.each(['original', 'chessbase'] as const)('draws the last move in the chosen color and %s style', (style) => {
    const game = new Chess();
    const lastMove = game.move('e4');
    const html = renderToStaticMarkup(<AnnotationStyleContext.Provider value={style}>
      <LastMoveArrowContext.Provider value={{ showLastMoveArrow: true, lastMoveArrowColor: 'yellow' }}>
        <Board game={game} lastMove={lastMove} orientation="white" onMove={() => {}} />
      </LastMoveArrowContext.Provider>
    </AnnotationStyleContext.Provider>);
    expect(html).toContain('data-last-move-arrow="e2e4"');
    expect(html).toContain(`data-annotation-arrow="yellow" data-annotation-style="${style}"`);
  });

  it('omits the move arrow before the first move and when disabled, while keeping hints', () => {
    for (const enabled of [true, false]) {
      const game = new Chess();
      const lastMove = enabled ? null : game.move('e4');
      const html = renderToStaticMarkup(<LastMoveArrowContext.Provider value={{ showLastMoveArrow: enabled, lastMoveArrowColor: 'blue' }}>
        <Board game={game} lastMove={lastMove} orientation="white" onMove={() => {}}
          hintArrows={[{ from: 'g1', to: 'f3' }]} />
      </LastMoveArrowContext.Provider>);
      expect(html).not.toContain('data-last-move-arrow');
      expect(html).toContain('data-annotation-arrow="blue"');
    }
  });
  it('keeps the original rendering as the default', () => {
    const html = renderToStaticMarkup(<Board game={new Chess()} lastMove={null} orientation="white" onMove={() => {}}
      hintArrows={[{ from: 'e2', to: 'e4' }]} hintCircles={[{ square: 'd4' }]} />);
    expect(html).toContain('data-annotation-style="original"');
    expect(html).toContain('rx="0.55"');
    expect(html).not.toContain('linearGradient');
  });

  it.each(['white', 'black'] as const)('positions ChessBase hints correctly with %s at the bottom', (orientation) => {
    const html = renderToStaticMarkup(<AnnotationStyleContext.Provider value="chessbase">
      <Board game={new Chess()} lastMove={null} orientation={orientation} onMove={() => {}}
        hintArrows={[{ from: 'e2', to: 'e4' }, { from: 'd2', to: 'd4' }]}
        hintCircles={[{ square: 'e4' }]} />
    </AnnotationStyleContext.Provider>);
    const ids = [...html.matchAll(/<linearGradient id="([^"]+)"/g)].map((m) => m[1]);
    expect(ids).toHaveLength(2);
    expect(new Set(ids).size).toBe(2);
    for (const id of ids) expect(html).toContain(`stroke="url(#${id})"`);
    expect(html).toContain(orientation === 'white' ? 'L56.25,59.375' : 'L43.75,40.625');
    expect(html).toContain('data-annotation-square="green"');
    expect(html).not.toContain('rx="0.55"');
  });

  it('keeps all arrow directions and thicknesses finite, including short knight arrows', () => {
    for (const { key: thickness } of ANNOTATION_THICKNESS_OPTIONS) {
      for (const to of [{ x: 18.75, y: 6.25 }, { x: 18.75, y: 18.75 }, { x: 31.25, y: 18.75 }, { x: 6.25, y: 93.75 }]) {
        const html = renderToStaticMarkup(<svg>
          <AnnotationArrow from={{ x: 6.25, y: 6.25 }} to={to} style="chessbase" thickness={thickness} color="red" />
          <AnnotationSquare center={to} style="chessbase" thickness={thickness} color="red" />
        </svg>);
        expect(html).not.toMatch(/NaN|Infinity/);
        expect(html).toContain('<path');
      }
    }
    expect(renderToStaticMarkup(<AnnotationArrow from={{ x: 6.25, y: 6.25 }} to={{ x: 6.25, y: 6.25 }}
      style="chessbase" thickness="medium" color="green" />)).toBe('');
  });
});
