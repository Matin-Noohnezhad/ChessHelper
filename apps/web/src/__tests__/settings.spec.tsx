import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { useSettings } from '../hooks/useSettings.js';
import { SOUND_STYLES } from '../sound.js';
import { MOVEMENT_STYLES } from '../boardAnimation.js';
import { DRAW_COLOR_OPTIONS } from '../components/BoardAnnotations.js';

function SoundSettings() {
  const settings = useSettings();
  return <output data-style={settings.soundStyle} data-volume={settings.soundVolume}
    data-replay={settings.replaySounds} />;
}

function load(stored: unknown) {
  vi.stubGlobal('localStorage', { getItem: () => JSON.stringify(stored) });
  return renderToStaticMarkup(<SoundSettings />);
}

function MovementSettings() {
  const settings = useSettings();
  return <output data-style={settings.movementStyle} data-speed={settings.movementSpeed} />;
}

describe('saved movement settings', () => {
  it('restores each style, including ChessBase, with its saved speed', () => {
    for (const style of MOVEMENT_STYLES) {
      vi.stubGlobal('localStorage', { getItem: () => JSON.stringify({ movementStyle: style.key, movementSpeed: 'slow' }) });
      expect(renderToStaticMarkup(<MovementSettings />)).toContain(`data-style="${style.key}" data-speed="slow"`);
    }
  });

  it('keeps the original defaults for old or invalid settings', () => {
    for (const stored of [{}, { movementStyle: 'missing', movementSpeed: null }]) {
      vi.stubGlobal('localStorage', { getItem: () => JSON.stringify(stored) });
      expect(renderToStaticMarkup(<MovementSettings />)).toContain('data-style="lichess" data-speed="medium"');
    }
  });
});

afterEach(() => vi.unstubAllGlobals());

function AnnotationSettings() {
  const settings = useSettings();
  return <output data-style={settings.annotationStyle} data-thickness={settings.annotationThickness} />;
}

describe('saved drawing settings', () => {
  it('restores ChessBase marks and keeps their thickness', () => {
    vi.stubGlobal('localStorage', { getItem: () => JSON.stringify({ annotationStyle: 'chessbase', annotationThickness: 'thick' }) });
    expect(renderToStaticMarkup(<AnnotationSettings />)).toContain('data-style="chessbase" data-thickness="thick"');
  });

  it('keeps original marks for old or invalid preferences', () => {
    for (const annotationStyle of [undefined, 'missing', null, 42]) {
      vi.stubGlobal('localStorage', { getItem: () => JSON.stringify({ annotationStyle, annotationThickness: 'thin' }) });
      expect(renderToStaticMarkup(<AnnotationSettings />)).toContain('data-style="original" data-thickness="thin"');
    }
  });
});

function LastMoveSettings() {
  const settings = useSettings();
  return <output data-enabled={settings.showLastMoveArrow} data-color={settings.lastMoveArrowColor} />;
}

describe('saved last-move arrow settings', () => {
  it('restores every color and the enabled preference', () => {
    for (const { key: lastMoveArrowColor } of DRAW_COLOR_OPTIONS) {
      vi.stubGlobal('localStorage', { getItem: () => JSON.stringify({ showLastMoveArrow: true, lastMoveArrowColor }) });
      expect(renderToStaticMarkup(<LastMoveSettings />)).toContain(`data-enabled="true" data-color="${lastMoveArrowColor}"`);
    }
  });

  it('defaults to off and blue for old or invalid settings', () => {
    for (const stored of [{}, { showLastMoveArrow: 'true', lastMoveArrowColor: 'purple' }, { showLastMoveArrow: null, lastMoveArrowColor: 42 }]) {
      vi.stubGlobal('localStorage', { getItem: () => JSON.stringify(stored) });
      expect(renderToStaticMarkup(<LastMoveSettings />)).toContain('data-enabled="false" data-color="blue"');
    }
  });
});

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

  it('keeps replayed moves silent unless replay sounds were saved on', () => {
    expect(load({})).toContain('data-replay="false"');
    expect(load({ replaySounds: true })).toContain('data-replay="true"');
    for (const replaySounds of ['yes', 1, null]) {
      expect(load({ replaySounds })).toContain('data-replay="false"');
    }
  });

  it('falls back to wooden for invalid saved presets', () => {
    for (const soundStyle of ['missing', null, 42]) {
      expect(load({ soundStyle })).toContain('data-style="wooden"');
    }
  });
});
