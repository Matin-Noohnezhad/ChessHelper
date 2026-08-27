import { useCallback, useState } from 'react';
import type { AnnotationThickness } from '../components/Board.js';

const STORAGE_KEY = 'coh.settings.v1';

/**
 * How the course trainer plays a line out for you.
 *
 * `manual` runs no clock at all — you step to the next move yourself, reading
 * the note at whatever pace you read at. The rest auto-advance, `slow` leaving
 * room to read every comment, `fast` for a line you half-know already.
 */
export type WatchPace = 'manual' | 'slow' | 'normal' | 'fast';

export const WATCH_PACE_OPTIONS: { key: WatchPace; label: string }[] = [
  { key: 'manual', label: 'Manual' },
  { key: 'slow', label: 'Slow' },
  { key: 'normal', label: 'Normal' },
  { key: 'fast', label: 'Fast' },
];

export interface AppSettings {
  annotationThickness: AnnotationThickness;
  watchPace: WatchPace;
}

const DEFAULT_SETTINGS: AppSettings = {
  annotationThickness: 'medium',
  watchPace: 'normal',
};

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<AppSettings>) };
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
  setWatchPace: (value: WatchPace) => void;
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
  const setWatchPace = useCallback((value: WatchPace) => update({ watchPace: value }), [update]);

  return { ...settings, setAnnotationThickness, setWatchPace };
}
