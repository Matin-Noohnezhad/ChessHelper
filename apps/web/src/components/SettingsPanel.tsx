import { useEffect, useRef } from 'react';
import { BOARD_THEMES, PIECE_SETS, UI_THEMES } from '../theme/themes.js';
import { usePrefs } from '../theme/prefs.js';
import type { Prefs } from '../theme/prefs.js';
import type { Speech } from '../hooks/useSpeech.js';
import type { Sounds } from '../hooks/useSounds.js';
import { PIECE_SHAPES } from './pieces/shapes.js';

/**
 * The board-settings flyout: appearance, sound and the spoken commentary.
 *
 * Board and piece choices are shown as swatches rather than a dropdown, because
 * the whole point of a theme is what it looks like.
 */
interface SettingsPanelProps {
  onClose: () => void;
  speech: Speech;
  sounds: Sounds;
}

export function SettingsPanel({ onClose, speech, sounds }: SettingsPanelProps) {
  const { prefs, set, reset, board } = usePrefs();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    window.addEventListener('keydown', onKey);
    // Deferred: the click that opened the panel would otherwise close it again.
    const timer = setTimeout(() => window.addEventListener('mousedown', onDown), 0);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onDown);
    };
  }, [onClose]);

  const toggle = (key: keyof Prefs, label: string, hint?: string) => (
    <label className="setting setting--toggle">
      <input
        type="checkbox"
        checked={Boolean(prefs[key])}
        onChange={(e) => set(key, e.target.checked as never)}
      />
      <span>
        {label}
        {hint && <em>{hint}</em>}
      </span>
    </label>
  );

  return (
    <div className="settings" ref={ref} role="dialog" aria-label="Board settings">
      <div className="settings__head">
        <h2>Board settings</h2>
        <button type="button" className="settings__close" onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>

      <section className="settings__group">
        <h3>Board</h3>
        <div className="swatches">
          {BOARD_THEMES.map((theme) => (
            <button
              key={theme.id}
              type="button"
              className={`swatch${prefs.board === theme.id ? ' is-active' : ''}`}
              onClick={() => set('board', theme.id)}
              title={theme.name}
            >
              <span className="swatch__board" style={{ background: theme.frame }}>
                <i style={{ background: theme.light }} />
                <i style={{ background: theme.dark }} />
                <i style={{ background: theme.dark }} />
                <i style={{ background: theme.light }} />
              </span>
              <span className="swatch__name">{theme.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="settings__group">
        <h3>Pieces</h3>
        <div className="swatches swatches--pieces">
          {PIECE_SETS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`swatch${prefs.pieces === item.id ? ' is-active' : ''}`}
              onClick={() => set('pieces', item.id)}
              title={item.name}
            >
              <span
                className="swatch__piece"
                style={{ background: board.darkPlain }}
                aria-hidden="true"
              >
                {item.kind === 'glyph' ? (
                  <b style={{ color: item.whiteFill, WebkitTextStroke: `1px ${item.whiteStroke}` }}>♞</b>
                ) : (
                  <svg viewBox="0 0 45 45">
                    <g
                      style={
                        {
                          '--pf': item.whiteFill,
                          '--ps': item.whiteStroke,
                          '--pd': item.whiteDetail,
                          '--pdot': item.whiteDetail,
                          '--sw': String(item.strokeWidth),
                        } as React.CSSProperties
                      }
                    >
                      {PIECE_SHAPES.n}
                    </g>
                  </svg>
                )}
              </span>
              <span className="swatch__name">{item.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="settings__group settings__group--cols">
        <label className="setting">
          <span>Interface</span>
          <select value={prefs.ui} onChange={(e) => set('ui', e.target.value)}>
            {UI_THEMES.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.name}
              </option>
            ))}
          </select>
        </label>
        <label className="setting">
          <span>Coordinates</span>
          <select
            value={prefs.coords}
            onChange={(e) => set('coords', e.target.value as Prefs['coords'])}
          >
            <option value="outside">On the frame</option>
            <option value="inside">In the squares</option>
            <option value="none">Hidden</option>
          </select>
        </label>
        <label className="setting">
          <span>Animation</span>
          <select value={prefs.animateMs} onChange={(e) => set('animateMs', Number(e.target.value))}>
            <option value={0}>Off</option>
            <option value={110}>Fast</option>
            <option value={180}>Normal</option>
            <option value={320}>Slow</option>
          </select>
        </label>
      </section>

      <section className="settings__group">
        {toggle('highlightLast', 'Highlight the last move')}
        {toggle('showHints', 'Show legal moves for the selected piece')}
        {toggle('showMaterial', 'Show captured material')}
      </section>

      <section className="settings__group">
        <h3>Sound</h3>
        {toggle('sound', 'Board sounds', 'clicks, captures, check')}
        <label className="setting setting--range">
          <span>Volume</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={prefs.soundVolume}
            disabled={!prefs.sound}
            onChange={(e) => set('soundVolume', Number(e.target.value))}
            onMouseUp={() => sounds.play('move')}
          />
        </label>
      </section>

      <section className="settings__group">
        <h3>Spoken moves</h3>
        {!speech.supported ? (
          <p className="muted settings__note">This browser has no speech synthesiser.</p>
        ) : (
          <>
            {toggle('speech', 'Announce every move')}
            {toggle('speechOpenings', 'Announce the opening name')}
            {toggle('speechPhonetic', 'Read files phonetically', 'alfa, bravo, charlie…')}
            <label className="setting">
              <span>Voice</span>
              <select value={prefs.speechVoice} onChange={(e) => set('speechVoice', e.target.value)}>
                <option value="">System default</option>
                {speech.voices.map((voice) => (
                  <option key={voice.voiceURI} value={voice.voiceURI}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </label>
            <label className="setting setting--range">
              <span>Speed</span>
              <input
                type="range"
                min={0.6}
                max={1.8}
                step={0.05}
                value={prefs.speechRate}
                onChange={(e) => set('speechRate', Number(e.target.value))}
              />
            </label>
            <label className="setting setting--range">
              <span>Volume</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={prefs.speechVolume}
                onChange={(e) => set('speechVolume', Number(e.target.value))}
              />
            </label>
            <button
              type="button"
              className="settings__test"
              onClick={() => speech.say('Knight F 3, check', true)}
            >
              Test voice
            </button>
          </>
        )}
      </section>

      <button type="button" className="settings__reset" onClick={reset}>
        Restore defaults
      </button>
    </div>
  );
}
