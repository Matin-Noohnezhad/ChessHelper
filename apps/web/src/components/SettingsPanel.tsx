import { ANNOTATION_THICKNESS_OPTIONS } from './Board.js';
import type { AnnotationThickness } from './Board.js';
import { playBoardSound } from '../sound.js';
import type { BoardTheme } from '../hooks/useSettings.js';
import {
  BOARD_THEMES,
  WATCH_SECONDS_MAX,
  WATCH_SECONDS_MIN,
  WATCH_SECONDS_STEP,
} from '../hooks/useSettings.js';

interface SettingsPanelProps {
  boardTheme?: BoardTheme;
  onBoardThemeChange?: (value: BoardTheme) => void;
  annotationThickness: AnnotationThickness;
  onAnnotationThicknessChange: (value: AnnotationThickness) => void;
  soundVolume: number;
  onSoundVolumeChange: (value: number) => void;
  watchAutoplay: boolean;
  onWatchAutoplayChange: (value: boolean) => void;
  watchMoveSeconds: number;
  onWatchMoveSecondsChange: (value: number) => void;
  onClose: () => void;
}

export function SettingsPanel({
  boardTheme = 'walnut',
  onBoardThemeChange,
  annotationThickness,
  onAnnotationThicknessChange,
  soundVolume,
  onSoundVolumeChange,
  watchAutoplay,
  onWatchAutoplayChange,
  watchMoveSeconds,
  onWatchMoveSecondsChange,
  onClose,
}: SettingsPanelProps) {
  return (
    <div className="modal" role="dialog" aria-label="Settings" onClick={onClose}>
      <div className="modal__inner" onClick={(event) => event.stopPropagation()}>
        <div className="modal__head">
          <h2>Settings</h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close settings">
            ✕
          </button>
        </div>

        <div className="settings-row">
          <span className="settings-row__label">Board appearance</span>
          <div className="board-themes" role="group" aria-label="Board color theme">
            {BOARD_THEMES.map((theme) => (
              <button key={theme.key} type="button" className="board-theme"
                data-board-theme={theme.key} aria-pressed={boardTheme === theme.key}
                onClick={() => onBoardThemeChange?.(theme.key)}>
                <span className="board-theme__swatch" aria-hidden="true" />
                {theme.label}
              </button>
            ))}
          </div>
        </div>

        <div className="settings-row">
          <span className="settings-row__label">Board sounds</span>
          <div className="settings-slider">
            <button
              type="button"
              className="sound-toggle"
              aria-label={soundVolume === 0 ? 'Unmute board sounds' : 'Mute board sounds'}
              aria-pressed={soundVolume === 0}
              onClick={() => onSoundVolumeChange(soundVolume === 0 ? 0.55 : 0)}
            >
              {soundVolume === 0 ? 'Muted' : 'On'}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={soundVolume}
              onChange={(event) => onSoundVolumeChange(Number(event.target.value))}
              aria-label="Board sound volume"
            />
            <span className="settings-slider__value">{Math.round(soundVolume * 100)}%</span>
          </div>
          <div className="sound-preview" role="group" aria-label="Preview board sounds">
            <span>Preview</span>
            {(['move', 'capture', 'castle', 'check'] as const).map((kind) => (
              <button key={kind} type="button" disabled={soundVolume === 0}
                onClick={() => playBoardSound(kind, soundVolume)}>{kind}</button>
            ))}
          </div>
        </div>

        <div className="settings-row">
          <span className="settings-row__label">Arrow &amp; square-mark thickness</span>
          <div className="segmented">
            {ANNOTATION_THICKNESS_OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                className={annotationThickness === option.key ? 'is-active' : ''}
                aria-pressed={annotationThickness === option.key}
                onClick={() => onAnnotationThicknessChange(option.key)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="settings-row">
          <span className="settings-row__label">
            Course line demonstration
            <span className="settings-row__hint">
              How a learn session plays a line out before it asks for it.
            </span>
          </span>

          <label className="settings-check">
            <input
              type="checkbox"
              checked={!watchAutoplay}
              onChange={(event) => onWatchAutoplayChange(!event.target.checked)}
            />
            Step through each move myself
          </label>

          <div className="settings-slider" aria-disabled={!watchAutoplay}>
            <span className="muted">Fast</span>
            <input
              type="range"
              min={WATCH_SECONDS_MIN}
              max={WATCH_SECONDS_MAX}
              step={WATCH_SECONDS_STEP}
              value={watchMoveSeconds}
              disabled={!watchAutoplay}
              onChange={(event) => onWatchMoveSecondsChange(Number(event.target.value))}
              aria-label="Seconds per demonstrated move"
            />
            <span className="muted">Slow</span>
            <span className="settings-slider__value">
              {watchAutoplay ? `${watchMoveSeconds.toFixed(1)}s / move` : 'Manual'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
