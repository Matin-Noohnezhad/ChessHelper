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

  it('uses the configured defaults for missing or invalid settings', () => {
    for (const stored of [{}, { movementStyle: 'missing', movementSpeed: null }]) {
      vi.stubGlobal('localStorage', { getItem: () => JSON.stringify(stored) });
      expect(renderToStaticMarkup(<MovementSettings />)).toContain('data-style="chessbase" data-speed="medium"');
    }
  });
});

afterEach(() => vi.unstubAllGlobals());

function BoardSettings() {
  const settings = useSettings();
  return <output data-theme={settings.boardTheme} data-pieces={settings.pieceSet}
    data-movement={settings.movementStyle} data-speed={settings.movementSpeed}
    data-drawing={settings.annotationStyle} data-arrow={settings.showLastMoveArrow}
    data-color={settings.lastMoveArrowColor} data-sound={settings.soundStyle}
    data-volume={settings.soundVolume} />;
}

describe('installation board defaults', () => {
  it('uses the Chrome board preferences for fresh or corrupt storage', () => {
    for (const raw of [null, '{}', 'invalid json']) {
      vi.stubGlobal('localStorage', { getItem: () => raw });
      expect(renderToStaticMarkup(<BoardSettings />)).toContain(
        'data-theme="chessbase-maple" data-pieces="merida" data-movement="chessbase" data-speed="medium" ' +
        'data-drawing="chessbase" data-arrow="true" data-color="blue" data-sound="chessbase-desktop" data-volume="0.55"',
      );
    }
  });

  it('preserves previously saved board choices, including disabled arrows and muted audio', () => {
    vi.stubGlobal('localStorage', { getItem: () => JSON.stringify({
      boardTheme: 'walnut', pieceSet: 'original', movementStyle: 'lichess', movementSpeed: 'off',
      annotationStyle: 'original', showLastMoveArrow: false, lastMoveArrowColor: 'yellow',
      soundStyle: 'wooden', soundVolume: 0,
    }) });
    expect(renderToStaticMarkup(<BoardSettings />)).toContain(
      'data-theme="walnut" data-pieces="original" data-movement="lichess" data-speed="off" ' +
      'data-drawing="original" data-arrow="false" data-color="yellow" data-sound="wooden" data-volume="0"',
    );
  });
});

function AnnotationSettings() {
  const settings = useSettings();
  return <output data-style={settings.annotationStyle} data-thickness={settings.annotationThickness} />;
}

describe('saved drawing settings', () => {
  it('restores ChessBase marks and keeps their thickness', () => {
    vi.stubGlobal('localStorage', { getItem: () => JSON.stringify({ annotationStyle: 'chessbase', annotationThickness: 'thick' }) });
    expect(renderToStaticMarkup(<AnnotationSettings />)).toContain('data-style="chessbase" data-thickness="thick"');
  });

  it('uses ChessBase marks for missing or invalid preferences', () => {
    for (const annotationStyle of [undefined, 'missing', null, 42]) {
      vi.stubGlobal('localStorage', { getItem: () => JSON.stringify({ annotationStyle, annotationThickness: 'thin' }) });
      expect(renderToStaticMarkup(<AnnotationSettings />)).toContain('data-style="chessbase" data-thickness="thin"');
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

  it('defaults to on and blue for missing or invalid settings', () => {
    for (const stored of [{}, { showLastMoveArrow: 'true', lastMoveArrowColor: 'purple' }, { showLastMoveArrow: null, lastMoveArrowColor: 42 }]) {
      vi.stubGlobal('localStorage', { getItem: () => JSON.stringify(stored) });
      expect(renderToStaticMarkup(<LastMoveSettings />)).toContain('data-enabled="true" data-color="blue"');
    }
  });
});

describe('saved sound settings', () => {
  it('keeps saved sounds and mute settings for existing users', () => {
    expect(load({ soundStyle: 'wooden', soundVolume: 0 })).toContain('data-style="wooden" data-volume="0"');
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

  it('falls back to ChessBase desktop for invalid saved presets', () => {
    for (const soundStyle of ['missing', null, 42]) {
      expect(load({ soundStyle })).toContain('data-style="chessbase-desktop"');
    }
  });
});

function BranchSettings() {
  return <output data-branches={useSettings().branchNavigation} />;
}

describe('saved course branch chooser', () => {
  it('defaults to the board and restores the original sidebar mode', () => {
    for (const [stored, expected] of [[{}, 'board'], [{ branchNavigation: 'sidebar' }, 'sidebar'],
      [{ branchNavigation: 'board' }, 'board'], [{ branchNavigation: 'invalid' }, 'board']] as const) {
      vi.stubGlobal('localStorage', { getItem: () => JSON.stringify(stored) });
      expect(renderToStaticMarkup(<BranchSettings />)).toContain(`data-branches="${expected}"`);
    }
  });
});
