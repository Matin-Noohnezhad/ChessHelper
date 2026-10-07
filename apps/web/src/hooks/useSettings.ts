import { useCallback, useState } from 'react';
import { PIECE_SETS } from '../components/Piece.js';
import type { PieceSet } from '../components/Piece.js';
import { ANNOTATION_STYLES, DEFAULT_LAST_MOVE_ARROW, DRAW_COLOR_OPTIONS } from '../components/BoardAnnotations.js';
import type { AnnotationStyle, AnnotationThickness, DrawColor, LastMoveArrowSettings } from '../components/BoardAnnotations.js';
import { DEFAULT_SOUND_STYLE, SOUND_STYLES } from '../sound.js';
import type { SoundStyle } from '../sound.js';
import { DEFAULT_BOARD_ANIMATION, MOVEMENT_SPEEDS, MOVEMENT_STYLES } from '../boardAnimation.js';
import type { BoardAnimationSettings, MovementStyle, MovementSpeed } from '../boardAnimation.js';

import { DEFAULT_CHUNK, DEFAULT_FULL_PASSES } from '@coh/course';

const STORAGE_KEY = 'coh.settings.v1';

export const BOARD_THEMES = [
  { key: 'walnut', label: 'Walnut' },
  { key: 'tournament', label: 'Tournament' },
  { key: 'slate', label: 'Slate' },
] as const;
export type BoardTheme = typeof BOARD_THEMES[number]['key'];

/**
 * The course line demonstration, as a dial rather than a few presets.
 *
 * `watchMoveSeconds` is how long each demonstrated move holds before the
 * next one, including moves carrying notes. `watchAutoplay`
 * off means no clock at all — you step each move yourself and read for as long
 * as you like.
 */
export const WATCH_SECONDS_MIN = 0.4;
export const WATCH_SECONDS_MAX = 4;
export const WATCH_SECONDS_STEP = 0.1;
export const WATCH_SECONDS_DEFAULT = 1.1;

const clampSeconds = (n: number): number => {
  if (!Number.isFinite(n)) return WATCH_SECONDS_DEFAULT;
  return Math.min(WATCH_SECONDS_MAX, Math.max(WATCH_SECONDS_MIN, Math.round(n * 10) / 10));
};

export interface CourseLearningSettings {
  courseChunk: number;
  courseFullPasses: number;
}

export const DEFAULT_COURSE_LEARNING: CourseLearningSettings = {
  courseChunk: DEFAULT_CHUNK,
  courseFullPasses: DEFAULT_FULL_PASSES,
};

function clampInteger(value: number, min: number, max: number, fallback: number): number {
  return Number.isFinite(value) ? Math.min(max, Math.max(min, Math.round(value))) : fallback;
}

export interface AppSettings extends CourseLearningSettings, BoardAnimationSettings, LastMoveArrowSettings {
  boardTheme: BoardTheme;
  pieceSet: PieceSet;
  moveEntryMode: 'smart' | 'select';
  annotationThickness: AnnotationThickness;
  annotationStyle: AnnotationStyle;
  /** Board audio level, 0 = muted. */
  soundVolume: number;
  soundStyle: SoundStyle;
  /** Auto-advance the course line demonstration; false = step it yourself. */
  watchAutoplay: boolean;
  /** Seconds each demonstrated move holds, including moves with notes. */
  watchMoveSeconds: number;
}

const DEFAULT_SETTINGS: AppSettings = {
  ...DEFAULT_COURSE_LEARNING,
  ...DEFAULT_BOARD_ANIMATION,
  ...DEFAULT_LAST_MOVE_ARROW,
  boardTheme: 'walnut',
  pieceSet: 'original',
  moveEntryMode: 'smart',
  annotationThickness: 'medium',
  annotationStyle: 'original',
  soundVolume: 0.55,
  soundStyle: DEFAULT_SOUND_STYLE,
  watchAutoplay: true,
  watchMoveSeconds: WATCH_SECONDS_DEFAULT,
};

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const stored = { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<AppSettings>) };
    return {
      ...stored,
      movementStyle: MOVEMENT_STYLES.some((style) => style.key === stored.movementStyle)
        ? stored.movementStyle : DEFAULT_BOARD_ANIMATION.movementStyle,
      movementSpeed: MOVEMENT_SPEEDS.some((speed) => speed.key === stored.movementSpeed)
        ? stored.movementSpeed : DEFAULT_BOARD_ANIMATION.movementSpeed,
      pieceSet: PIECE_SETS.some((set) => set.key === stored.pieceSet) ? stored.pieceSet : DEFAULT_SETTINGS.pieceSet,
      moveEntryMode: stored.moveEntryMode === 'select' ? 'select' : 'smart',
      annotationThickness: ['thin', 'medium', 'thick', 'extra'].includes(stored.annotationThickness)
        ? stored.annotationThickness : DEFAULT_SETTINGS.annotationThickness,
      annotationStyle: ANNOTATION_STYLES.some((style) => style.key === stored.annotationStyle)
        ? stored.annotationStyle : DEFAULT_SETTINGS.annotationStyle,
      showLastMoveArrow: typeof stored.showLastMoveArrow === 'boolean'
        ? stored.showLastMoveArrow : DEFAULT_LAST_MOVE_ARROW.showLastMoveArrow,
      lastMoveArrowColor: DRAW_COLOR_OPTIONS.some((color) => color.key === stored.lastMoveArrowColor)
        ? stored.lastMoveArrowColor : DEFAULT_LAST_MOVE_ARROW.lastMoveArrowColor,
      boardTheme: BOARD_THEMES.some((theme) => theme.key === stored.boardTheme)
        ? stored.boardTheme : DEFAULT_SETTINGS.boardTheme,
      soundVolume: Number.isFinite(stored.soundVolume)
        ? Math.min(1, Math.max(0, stored.soundVolume)) : DEFAULT_SETTINGS.soundVolume,
      soundStyle: SOUND_STYLES.some((style) => style.key === stored.soundStyle)
        ? stored.soundStyle : DEFAULT_SOUND_STYLE,
      watchMoveSeconds: clampSeconds(stored.watchMoveSeconds),
      watchAutoplay: typeof stored.watchAutoplay === 'boolean' ? stored.watchAutoplay : true,
      courseChunk: clampInteger(stored.courseChunk, 0, 30, DEFAULT_CHUNK),
      courseFullPasses: clampInteger(stored.courseFullPasses, 1, 5, DEFAULT_FULL_PASSES),
    };
  } catch {
    return DEFAULT_SETTINGS; // private mode, corrupt JSON — settings just fall back to defaults
  }
}

function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    /* storage full or blocked: not worth interrupting a session over */
  }
}

export interface SettingsController extends AppSettings {
  setMovementStyle: (value: MovementStyle) => void;
  setMovementSpeed: (value: MovementSpeed) => void;
  setCourseLearning: (value: CourseLearningSettings) => void;
  setPieceSet: (value: PieceSet) => void;
  setMoveEntryMode: (value: AppSettings['moveEntryMode']) => void;
  setBoardTheme: (value: BoardTheme) => void;
  setAnnotationThickness: (value: AnnotationThickness) => void;
  setAnnotationStyle: (value: AnnotationStyle) => void;
  setShowLastMoveArrow: (value: boolean) => void;
  setLastMoveArrowColor: (value: DrawColor) => void;
  setSoundVolume: (value: number) => void;
  setSoundStyle: (value: SoundStyle) => void;
  setWatchAutoplay: (value: boolean) => void;
  setWatchMoveSeconds: (value: number) => void;
}

export function useSettings(): SettingsController {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);

  const update = useCallback((patch: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveSettings(next);
      return next;
    });
  }, []);

  const setPieceSet = useCallback((value: PieceSet) => update({ pieceSet: value }), [update]);
  const setMovementStyle = useCallback((value: MovementStyle) => update({ movementStyle: value }), [update]);
  const setAnnotationStyle = useCallback((value: AnnotationStyle) => update({ annotationStyle: value }), [update]);
  const setShowLastMoveArrow = useCallback((value: boolean) => update({ showLastMoveArrow: value }), [update]);
  const setLastMoveArrowColor = useCallback((value: DrawColor) => update({ lastMoveArrowColor: value }), [update]);
  const setMovementSpeed = useCallback((value: MovementSpeed) => update({ movementSpeed: value }), [update]);
  const setMoveEntryMode = useCallback((value: AppSettings['moveEntryMode']) => update({ moveEntryMode: value }), [update]);

  const setAnnotationThickness = useCallback(
    (value: AnnotationThickness) => update({ annotationThickness: value }),
    [update],
  );
  const setBoardTheme = useCallback(
    (value: BoardTheme) => update({ boardTheme: value }),
    [update],
  );
  const setSoundVolume = useCallback(
    (value: number) => update({ soundVolume: Math.min(1, Math.max(0, value)) }),
    [update],
  );
  const setSoundStyle = useCallback((value: SoundStyle) => update({ soundStyle: value }), [update]);
  const setWatchAutoplay = useCallback(
    (value: boolean) => update({ watchAutoplay: value }),
    [update],
  );
  const setWatchMoveSeconds = useCallback(
    (value: number) => update({ watchMoveSeconds: clampSeconds(value) }),
    [update],
  );

  const setCourseLearning = useCallback((value: CourseLearningSettings) => update({
    courseChunk: clampInteger(value.courseChunk, 0, 30, DEFAULT_CHUNK),
    courseFullPasses: clampInteger(value.courseFullPasses, 1, 5, DEFAULT_FULL_PASSES),
  }), [update]);

  return { ...settings, setShowLastMoveArrow, setLastMoveArrowColor, setAnnotationStyle, setMovementStyle, setMovementSpeed, setCourseLearning, setPieceSet, setMoveEntryMode, setBoardTheme, setAnnotationThickness, setSoundVolume, setSoundStyle, setWatchAutoplay, setWatchMoveSeconds };
}
