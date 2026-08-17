import { useCallback, useState } from 'react';
import type { AnnotationThickness } from '../components/Board.js';

const STORAGE_KEY = 'coh.settings.v1';

export interface AppSettings {
  annotationThickness: AnnotationThickness;
}

const DEFAULT_SETTINGS: AppSettings = {
  annotationThickness: 'medium',
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
}

export function useSettings(): SettingsController {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);

  const setAnnotationThickness = useCallback((value: AnnotationThickness) => {
    setSettings((prev) => {
      const next = { ...prev, annotationThickness: value };
      saveSettings(next);
      return next;
    });
  }, []);

  return { ...settings, setAnnotationThickness };
}
