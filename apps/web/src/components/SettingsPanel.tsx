import { ANNOTATION_THICKNESS_OPTIONS } from './Board.js';
import type { AnnotationThickness } from './Board.js';
import {
  WATCH_SECONDS_MAX,
  WATCH_SECONDS_MIN,
  WATCH_SECONDS_STEP,
} from '../hooks/useSettings.js';

interface SettingsPanelProps {
  annotationThickness: AnnotationThickness;
  onAnnotationThicknessChange: (value: AnnotationThickness) => void;
  watchAutoplay: boolean;
  onWatchAutoplayChange: (value: boolean) => void;
  watchMoveSeconds: number;
  onWatchMoveSecondsChange: (value: number) => void;
  onClose: () => void;
}

export function SettingsPanel({
  annotationThickness,
  onAnnotationThicknessChange,
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
          <span className="settings-row__label">Arrow &amp; square-mark thickness</span>
          <div className="segmented">
            {ANNOTATION_THICKNESS_OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                className={annotationThickness === option.key ? 'is-active' : ''}
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
