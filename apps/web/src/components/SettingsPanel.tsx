import { ANNOTATION_THICKNESS_OPTIONS } from './Board.js';
import type { AnnotationThickness } from './Board.js';

interface SettingsPanelProps {
  annotationThickness: AnnotationThickness;
  onAnnotationThicknessChange: (value: AnnotationThickness) => void;
  onClose: () => void;
}

export function SettingsPanel({
  annotationThickness,
  onAnnotationThicknessChange,
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
      </div>
    </div>
  );
}
