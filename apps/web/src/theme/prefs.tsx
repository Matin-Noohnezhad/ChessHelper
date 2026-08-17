import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { boardTheme, pieceSet, themeVars, uiTheme } from './themes.js';
import type { BoardTheme, PieceSet, UiTheme } from './themes.js';

/**
 * User-facing display preferences: how the board looks, whether it moves, and
 * whether it makes any noise.
 *
 * These are deliberately kept out of the game hooks. Nothing about a position
 * or a repertoire depends on them, so they live in their own context and are
 * persisted on their own key — a preference change never touches game state.
 */
export interface Prefs {
  ui: string;
  board: string;
  pieces: string;
  coords: 'outside' | 'inside' | 'none';
  /** Piece slide on every move, ChessBase style. 0 disables it. */
  animateMs: number;
  highlightLast: boolean;
  showHints: boolean;
  showMaterial: boolean;
  sound: boolean;
  soundVolume: number;
  speech: boolean;
  speechVoice: string;
  speechRate: number;
  speechVolume: number;
  /** Reads files as "alfa, bravo…" rather than the bare letter. */
  speechPhonetic: boolean;
  /** Announces the opening name when the classification changes. */
  speechOpenings: boolean;
}

export const DEFAULT_PREFS: Prefs = {
  ui: 'dark',
  board: 'chessbase',
  pieces: 'staunton',
  coords: 'outside',
  animateMs: 180,
  highlightLast: true,
  showHints: true,
  showMaterial: true,
  sound: true,
  soundVolume: 0.5,
  speech: false,
  speechVoice: '',
  speechRate: 1,
  speechVolume: 0.9,
  speechPhonetic: false,
  speechOpenings: false,
};

const STORAGE_KEY = 'coh.prefs.v1';

export interface PrefsContext {
  prefs: Prefs;
  set: <K extends keyof Prefs>(key: K, value: Prefs[K]) => void;
  reset: () => void;
  board: BoardTheme;
  set_: PieceSet;
  ui: UiTheme;
}

/**
 * A default-valued context, so every component that draws a piece works when
 * rendered outside the provider — which is what the smoke tests do.
 */
const Ctx = createContext<PrefsContext>({
  prefs: DEFAULT_PREFS,
  set: () => {},
  reset: () => {},
  board: boardTheme(DEFAULT_PREFS.board),
  set_: pieceSet(DEFAULT_PREFS.pieces),
  ui: uiTheme(DEFAULT_PREFS.ui),
});

function load(): Prefs {
  if (typeof window === 'undefined') return DEFAULT_PREFS;
  try {
    const raw = window.localStorage?.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    // Merge rather than replace: a preference added in a later version must
    // not leave older stored settings with an undefined field.
    return { ...DEFAULT_PREFS, ...(JSON.parse(raw) as Partial<Prefs>) };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(load);

  const set = useCallback(<K extends keyof Prefs>(key: K, value: Prefs[K]) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
  }, []);

  const reset = useCallback(() => setPrefs(DEFAULT_PREFS), []);

  const ui = useMemo(() => uiTheme(prefs.ui), [prefs.ui]);
  const board = useMemo(() => boardTheme(prefs.board), [prefs.board]);
  const set_ = useMemo(() => pieceSet(prefs.pieces), [prefs.pieces]);

  useEffect(() => {
    try {
      window.localStorage?.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      /* private mode: the session still works, it just will not be remembered */
    }
  }, [prefs]);

  useEffect(() => {
    const root = document.documentElement;
    const vars = themeVars(ui, board, set_);
    for (const [name, value] of Object.entries(vars)) root.style.setProperty(name, value);
    root.style.setProperty('color-scheme', ui.colorScheme);
    root.dataset.ui = ui.id;
    root.dataset.pieces = set_.id;
    root.dataset.board = board.id;
  }, [ui, board, set_]);

  const value = useMemo<PrefsContext>(
    () => ({ prefs, set, reset, board, set_, ui }),
    [prefs, set, reset, board, set_, ui],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePrefs(): PrefsContext {
  return useContext(Ctx);
}
