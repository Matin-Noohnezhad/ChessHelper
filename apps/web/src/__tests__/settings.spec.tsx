import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { useSettings } from '../hooks/useSettings.js';
import { SOUND_STYLES } from '../sound.js';

function SoundSettings() {
  const settings = useSettings();
  return <output data-style={settings.soundStyle} data-volume={settings.soundVolume} />;
}

function load(stored: unknown) {
  vi.stubGlobal('localStorage', { getItem: () => JSON.stringify(stored) });
  return renderToStaticMarkup(<SoundSettings />);
}

afterEach(() => vi.unstubAllGlobals());

describe('saved sound settings', () => {
  it('keeps the original sound and mute setting for existing users', () => {
    expect(load({ soundVolume: 0 })).toContain('data-style="wooden" data-volume="0"');
  });

  it('restores every saved preset', () => {
    for (const style of SOUND_STYLES) {
      expect(load({ soundStyle: style.key, soundVolume: 0.7 }))
        .toContain(`data-style="${style.key}" data-volume="0.7"`);
    }
  });

  it('falls back to wooden for invalid saved presets', () => {
    for (const soundStyle of ['missing', null, 42]) {
      expect(load({ soundStyle })).toContain('data-style="wooden"');
    }
  });
});
