/*
 * Board, piece and shell themes.
 *
 * Every theme is a flat bag of CSS custom properties. Nothing in the component
 * tree reads a theme object directly — the provider writes the variables onto
 * the document element and the stylesheet does the rest. Adding a theme is
 * therefore a data change, never a code change.
 */

export interface BoardTheme {
  id: string;
  name: string;
  /** Any valid `background` value: solid colours and gradients both work. */
  light: string;
  dark: string;
  /** Solid stand-ins used where a gradient cannot go (coordinate contrast). */
  lightPlain: string;
  darkPlain: string;
  /** The wooden/plastic surround the board sits in, ChessBase style. */
  frame: string;
  frameEdge: string;
  frameText: string;
  /** Overlay painted across the whole board for depth. */
  texture: string;
  lastMove: string;
  selected: string;
  hint: string;
  check: string;
}

export const BOARD_THEMES: BoardTheme[] = [
  {
    id: 'chessbase',
    name: 'ChessBase Brown',
    light: '#efdfc0',
    dark: '#b58150',
    lightPlain: '#efdfc0',
    darkPlain: '#b58150',
    frame: 'linear-gradient(160deg, #4a3626, #2e2015)',
    frameEdge: '#191009',
    frameText: '#e6d3b3',
    texture: 'radial-gradient(120% 120% at 30% 12%, rgba(255,255,255,0.12), rgba(0,0,0,0.16) 78%)',
    lastMove: 'rgba(255, 196, 60, 0.42)',
    selected: 'rgba(255, 235, 130, 0.5)',
    hint: 'rgba(38, 28, 16, 0.32)',
    check: 'radial-gradient(circle, rgba(226, 62, 42, 0.95) 12%, rgba(226, 62, 42, 0) 72%)',
  },
  {
    id: 'walnut',
    name: 'Walnut',
    light:
      'repeating-linear-gradient(100deg, rgba(122, 80, 38, 0.055) 0 6px, rgba(122, 80, 38, 0) 6px 14px), linear-gradient(#ead3ae, #dcc099)',
    dark:
      'repeating-linear-gradient(100deg, rgba(28, 14, 4, 0.1) 0 6px, rgba(28, 14, 4, 0) 6px 14px), linear-gradient(#815737, #694226)',
    lightPlain: '#e2c79f',
    darkPlain: '#764d2f',
    frame: 'linear-gradient(160deg, #56381f, #2c1a0c)',
    frameEdge: '#160c04',
    frameText: '#eccf9f',
    texture: 'radial-gradient(130% 130% at 26% 8%, rgba(255,236,200,0.14), rgba(20,8,0,0.22) 80%)',
    lastMove: 'rgba(255, 205, 70, 0.4)',
    selected: 'rgba(255, 232, 140, 0.48)',
    hint: 'rgba(30, 18, 8, 0.34)',
    check: 'radial-gradient(circle, rgba(224, 58, 40, 0.95) 12%, rgba(224, 58, 40, 0) 72%)',
  },
  {
    id: 'fritz-blue',
    name: 'Fritz Blue',
    light: '#dfe6ec',
    dark: '#7f9bb2',
    lightPlain: '#dfe6ec',
    darkPlain: '#7f9bb2',
    frame: 'linear-gradient(160deg, #2f4256, #1a2531)',
    frameEdge: '#0d141c',
    frameText: '#d3e0ec',
    texture: 'radial-gradient(120% 120% at 30% 10%, rgba(255,255,255,0.14), rgba(0,12,24,0.18) 78%)',
    lastMove: 'rgba(255, 214, 92, 0.44)',
    selected: 'rgba(126, 214, 255, 0.45)',
    hint: 'rgba(18, 30, 42, 0.32)',
    check: 'radial-gradient(circle, rgba(232, 70, 50, 0.95) 12%, rgba(232, 70, 50, 0) 72%)',
  },
  {
    id: 'tournament',
    name: 'Tournament Green',
    light: '#eeeed4',
    dark: '#6f8f56',
    lightPlain: '#eeeed4',
    darkPlain: '#6f8f56',
    frame: 'linear-gradient(160deg, #33422a, #1c2417)',
    frameEdge: '#101609',
    frameText: '#dfe7c9',
    texture: 'radial-gradient(120% 120% at 28% 10%, rgba(255,255,255,0.11), rgba(0,0,0,0.16) 78%)',
    lastMove: 'rgba(255, 214, 76, 0.44)',
    selected: 'rgba(214, 255, 140, 0.42)',
    hint: 'rgba(20, 28, 14, 0.32)',
    check: 'radial-gradient(circle, rgba(226, 62, 42, 0.95) 12%, rgba(226, 62, 42, 0) 72%)',
  },
  {
    id: 'marble',
    name: 'Grey Marble',
    light: 'radial-gradient(130% 110% at 26% 18%, #f5f4f0, #e3e1da 72%)',
    dark: 'radial-gradient(130% 110% at 26% 18%, #9c9b93, #83827b 72%)',
    lightPlain: '#e4e2dc',
    darkPlain: '#86857e',
    frame: 'linear-gradient(160deg, #3d3d3a, #232322)',
    frameEdge: '#131312',
    frameText: '#e0dfd8',
    texture: 'radial-gradient(120% 120% at 32% 10%, rgba(255,255,255,0.16), rgba(0,0,0,0.18) 80%)',
    lastMove: 'rgba(255, 200, 60, 0.42)',
    selected: 'rgba(150, 220, 255, 0.42)',
    hint: 'rgba(24, 24, 22, 0.3)',
    check: 'radial-gradient(circle, rgba(226, 62, 42, 0.95) 12%, rgba(226, 62, 42, 0) 72%)',
  },
  {
    id: 'slate',
    name: 'Slate Night',
    light: '#6d7684',
    dark: '#464e5b',
    lightPlain: '#6d7684',
    darkPlain: '#464e5b',
    frame: 'linear-gradient(160deg, #22262e, #14171c)',
    frameEdge: '#0a0c0f',
    frameText: '#b7c0cc',
    texture: 'radial-gradient(120% 120% at 30% 8%, rgba(255,255,255,0.09), rgba(0,0,0,0.24) 80%)',
    lastMove: 'rgba(255, 208, 84, 0.36)',
    selected: 'rgba(120, 200, 255, 0.36)',
    hint: 'rgba(230, 236, 244, 0.34)',
    check: 'radial-gradient(circle, rgba(242, 82, 62, 0.95) 12%, rgba(242, 82, 62, 0) 72%)',
  },
  {
    id: 'ice',
    name: 'Ice',
    light: '#f4f8fb',
    dark: '#adc9de',
    lightPlain: '#f4f8fb',
    darkPlain: '#adc9de',
    frame: 'linear-gradient(160deg, #d7e2ea, #b3c4d1)',
    frameEdge: '#8fa4b3',
    frameText: '#2b3d4c',
    texture: 'radial-gradient(120% 120% at 30% 10%, rgba(255,255,255,0.3), rgba(90,120,150,0.14) 80%)',
    lastMove: 'rgba(255, 196, 40, 0.42)',
    selected: 'rgba(70, 170, 240, 0.35)',
    hint: 'rgba(30, 60, 84, 0.3)',
    check: 'radial-gradient(circle, rgba(226, 62, 42, 0.9) 12%, rgba(226, 62, 42, 0) 72%)',
  },
  {
    id: 'newsprint',
    name: 'Newsprint',
    light: '#ffffff',
    dark: '#b6b6b6',
    lightPlain: '#ffffff',
    darkPlain: '#b6b6b6',
    frame: 'linear-gradient(160deg, #2b2b2b, #171717)',
    frameEdge: '#000000',
    frameText: '#e8e8e8',
    texture: 'none',
    lastMove: 'rgba(255, 190, 0, 0.4)',
    selected: 'rgba(0, 140, 255, 0.28)',
    hint: 'rgba(0, 0, 0, 0.34)',
    check: 'radial-gradient(circle, rgba(220, 40, 40, 0.9) 12%, rgba(220, 40, 40, 0) 72%)',
  },
];

/* ------------------------------------------------------------- pieces --- */

export interface PieceSet {
  id: string;
  name: string;
  /** `glyph` renders Unicode text; the rest share the vector outlines. */
  kind: 'vector' | 'glyph';
  /** Vector fill / silhouette stroke / interior detail stroke, per colour. */
  whiteFill: string;
  whiteStroke: string;
  whiteDetail: string;
  blackFill: string;
  blackStroke: string;
  blackDetail: string;
  strokeWidth: number;
  /** Lays a highlight-to-shadow ramp over the silhouette, for a moulded look. */
  shaded: boolean;
}

export const PIECE_SETS: PieceSet[] = [
  {
    id: 'staunton',
    name: 'Staunton',
    kind: 'vector',
    whiteFill: '#fbfaf6',
    whiteStroke: '#14130f',
    whiteDetail: '#14130f',
    blackFill: '#26241d',
    blackStroke: '#0a0908',
    blackDetail: '#ddd9cd',
    strokeWidth: 1.5,
    shaded: false,
  },
  {
    id: 'fritz',
    name: 'Fritz 3D',
    kind: 'vector',
    whiteFill: '#f6f1e4',
    whiteStroke: '#2a2115',
    whiteDetail: '#3a2f1e',
    blackFill: '#332c22',
    blackStroke: '#0c0a07',
    blackDetail: '#cfc6b2',
    strokeWidth: 1.3,
    shaded: true,
  },
  {
    id: 'ivory',
    name: 'Ivory & Ebony',
    kind: 'vector',
    whiteFill: '#f3e6c8',
    whiteStroke: '#5b4425',
    whiteDetail: '#6b5330',
    blackFill: '#1d1a17',
    blackStroke: '#0a0908',
    blackDetail: '#c2a97a',
    strokeWidth: 1.4,
    shaded: true,
  },
  {
    id: 'contrast',
    name: 'High Contrast',
    kind: 'vector',
    whiteFill: '#ffffff',
    whiteStroke: '#0c0c0c',
    whiteDetail: '#0c0c0c',
    blackFill: '#111111',
    blackStroke: '#fbfbfb',
    blackDetail: '#fbfbfb',
    strokeWidth: 2.2,
    shaded: false,
  },
  {
    id: 'unicode',
    name: 'Unicode',
    kind: 'glyph',
    whiteFill: '#fbfaf7',
    whiteStroke: '#23211c',
    whiteDetail: '#23211c',
    blackFill: '#1e1c18',
    blackStroke: '#0c0b09',
    blackDetail: '#0c0b09',
    strokeWidth: 1.5,
    shaded: false,
  },
];

/* ---------------------------------------------------------------- ui --- */

export interface UiTheme {
  id: string;
  name: string;
  vars: Record<string, string>;
  colorScheme: 'dark' | 'light';
}

export const UI_THEMES: UiTheme[] = [
  {
    id: 'dark',
    name: 'Dark',
    colorScheme: 'dark',
    vars: {
      '--bg': '#14130f',
      '--surface': '#1e1c17',
      '--surface-2': '#26241e',
      '--surface-3': '#302d25',
      '--border': '#35322a',
      '--text': '#ece7dd',
      '--muted': '#9b948a',
      '--accent': '#7aa64f',
      '--accent-dim': '#55743a',
      '--danger': '#c4553d',
    },
  },
  {
    id: 'graphite',
    name: 'Graphite',
    colorScheme: 'dark',
    vars: {
      '--bg': '#101215',
      '--surface': '#171a1f',
      '--surface-2': '#1f242b',
      '--surface-3': '#282e37',
      '--border': '#2c333c',
      '--text': '#e4e9ef',
      '--muted': '#8d97a3',
      '--accent': '#4d9fd6',
      '--accent-dim': '#2f6d97',
      '--danger': '#d9614a',
    },
  },
  {
    id: 'light',
    name: 'Light',
    colorScheme: 'light',
    vars: {
      '--bg': '#f2efe8',
      '--surface': '#ffffff',
      '--surface-2': '#f0ece3',
      '--surface-3': '#e5e0d4',
      '--border': '#d9d3c5',
      '--text': '#232019',
      '--muted': '#6d6659',
      '--accent': '#4f7a2c',
      '--accent-dim': '#8bb168',
      '--danger': '#b1402a',
    },
  },
  {
    id: 'sepia',
    name: 'Sepia',
    colorScheme: 'light',
    vars: {
      '--bg': '#efe6d4',
      '--surface': '#faf4e6',
      '--surface-2': '#f0e6d0',
      '--surface-3': '#e5d8bd',
      '--border': '#d8c9a8',
      '--text': '#2e2618',
      '--muted': '#7a6b50',
      '--accent': '#8a6a1f',
      '--accent-dim': '#c2a55c',
      '--danger': '#a8452a',
    },
  },
];

export function boardTheme(id: string): BoardTheme {
  return BOARD_THEMES.find((t) => t.id === id) ?? BOARD_THEMES[0]!;
}

export function pieceSet(id: string): PieceSet {
  return PIECE_SETS.find((p) => p.id === id) ?? PIECE_SETS[0]!;
}

export function uiTheme(id: string): UiTheme {
  return UI_THEMES.find((t) => t.id === id) ?? UI_THEMES[0]!;
}

/** The full variable map for a preference set, ready to write onto an element. */
export function themeVars(
  ui: UiTheme,
  board: BoardTheme,
  pieces: PieceSet,
): Record<string, string> {
  return {
    ...ui.vars,
    '--sq-light': board.light,
    '--sq-dark': board.dark,
    '--sq-light-plain': board.lightPlain,
    '--sq-dark-plain': board.darkPlain,
    '--board-frame': board.frame,
    '--board-frame-edge': board.frameEdge,
    '--board-frame-text': board.frameText,
    '--board-texture': board.texture,
    '--sq-last': board.lastMove,
    '--sq-selected': board.selected,
    '--sq-hint': board.hint,
    '--sq-check': board.check,
    '--pf-w': pieces.whiteFill,
    '--ps-w': pieces.whiteStroke,
    '--pd-w': pieces.whiteDetail,
    '--pf-b': pieces.blackFill,
    '--ps-b': pieces.blackStroke,
    '--pd-b': pieces.blackDetail,
    '--piece-stroke-w': String(pieces.strokeWidth),
  };
}
