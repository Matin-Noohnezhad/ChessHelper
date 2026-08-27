import { useCallback, useState } from 'react';
import type { AnnotationThickness } from '../components/Board.js';

const STORAGE_KEY = 'coh.settings.v1';

/**
 * The course line demonstration, as a dial rather than a few presets.
 *
 * `watchMoveSeconds` is how long a plain demonstrated move holds before the
 * next one; a move carrying a note holds proportionally longer. `watchAutoplay`
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

export interface AppSettings {
  annotationThickness: AnnotationThickness;
  /** Auto-advance the course line demonstration; false = step it yourself. */
  watchAutoplay: boolean;
  /** Seconds a plain demonstrated move holds; a move with a note holds longer. */
  watchMoveSeconds: number;
}

const DEFAULT_SETTINGS: AppSettings = {
  annotationThickness: 'medium',
  watchAutoplay: true,
  watchMoveSeconds: WATCH_SECONDS_DEFAULT,
};

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const stored = { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<AppSettings>) };
    return { ...stored, watchMoveSeconds: clampSeconds(stored.watchMoveSeconds) };
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
  setAnnotationThickness: (value: AnnotationThickness) => void;
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

  const setAnnotationThickness = useCallback(
    (value: AnnotationThickness) => update({ annotationThickness: value }),
    [update],
  );
  const setWatchAutoplay = useCallback(
    (value: boolean) => update({ watchAutoplay: value }),
    [update],
  );
  const setWatchMoveSeconds = useCallback(
    (value: number) => update({ watchMoveSeconds: clampSeconds(value) }),
    [update],
  );

  return { ...settings, setAnnotationThickness, setWatchAutoplay, setWatchMoveSeconds };
}
