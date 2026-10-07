import { Piece, PIECE_SETS } from './Piece.js';
import type { PieceSet } from './Piece.js';
import { MovementPreview } from './MovementPreview.js';
import { MOVEMENT_SPEEDS, MOVEMENT_STYLES } from '../boardAnimation.js';
import type { MovementStyle, MovementSpeed } from '../boardAnimation.js';
import { ANNOTATION_THICKNESS_OPTIONS, ANNOTATION_STYLES, AnnotationPreview, AnnotationArrow, DRAW_COLOR_OPTIONS, DEFAULT_LAST_MOVE_ARROW } from './BoardAnnotations.js';
import type { AnnotationStyle, AnnotationThickness, DrawColor } from './BoardAnnotations.js';
import { DEFAULT_SOUND_STYLE, SOUND_STYLES, playBoardSound } from '../sound.js';
import type { SoundStyle } from '../sound.js';
import type { CourseLearningSettings, BoardTheme } from '../hooks/useSettings.js';
import {
  BOARD_THEMES,
  DEFAULT_COURSE_LEARNING,
  WATCH_SECONDS_MAX,
  WATCH_SECONDS_MIN,
  WATCH_SECONDS_STEP,
} from '../hooks/useSettings.js';

interface SettingsPanelProps {
  showCoordinates?: boolean;
  onShowCoordinatesChange?: (value: boolean) => void;
  movementStyle?: MovementStyle;
  onMovementStyleChange?: (value: MovementStyle) => void;
  movementSpeed?: MovementSpeed;
  onMovementSpeedChange?: (value: MovementSpeed) => void;
  pieceSet: PieceSet;
  onPieceSetChange: (value: PieceSet) => void;
  moveEntryMode: 'smart' | 'select';
  onMoveEntryModeChange: (value: 'smart' | 'select') => void;
  boardTheme?: BoardTheme;
  onBoardThemeChange?: (value: BoardTheme) => void;
  annotationThickness: AnnotationThickness;
  annotationStyle?: AnnotationStyle;
  onAnnotationStyleChange?: (value: AnnotationStyle) => void;
  showLastMoveArrow?: boolean;
  onShowLastMoveArrowChange?: (value: boolean) => void;
  lastMoveArrowColor?: DrawColor;
  onLastMoveArrowColorChange?: (value: DrawColor) => void;
  onAnnotationThicknessChange: (value: AnnotationThickness) => void;
  soundVolume: number;
  onSoundVolumeChange: (value: number) => void;
  soundStyle?: SoundStyle;
  onSoundStyleChange?: (value: SoundStyle) => void;
  replaySounds?: boolean;
  onReplaySoundsChange?: (value: boolean) => void;
  watchAutoplay: boolean;
  onWatchAutoplayChange: (value: boolean) => void;
  watchMoveSeconds: number;
  onWatchMoveSecondsChange: (value: number) => void;
  courseLearning?: CourseLearningSettings;
  onCourseLearningChange?: (value: CourseLearningSettings) => void;
  onClose: () => void;
}

export function SettingsPanel({
  showCoordinates = true, onShowCoordinatesChange,
  movementStyle = 'lichess', onMovementStyleChange,
  movementSpeed = 'medium', onMovementSpeedChange,
  pieceSet, onPieceSetChange, moveEntryMode, onMoveEntryModeChange,
  boardTheme = 'walnut',
  onBoardThemeChange,
  annotationThickness,
  annotationStyle = 'original', onAnnotationStyleChange,
  showLastMoveArrow = DEFAULT_LAST_MOVE_ARROW.showLastMoveArrow, onShowLastMoveArrowChange,
  lastMoveArrowColor = DEFAULT_LAST_MOVE_ARROW.lastMoveArrowColor, onLastMoveArrowColorChange,
  onAnnotationThicknessChange,
  soundVolume,
  onSoundVolumeChange,
  soundStyle = DEFAULT_SOUND_STYLE,
  onSoundStyleChange,
  replaySounds = false,
  onReplaySoundsChange,
  watchAutoplay,
  onWatchAutoplayChange,
  watchMoveSeconds,
  onWatchMoveSecondsChange,
  onClose,
  courseLearning = DEFAULT_COURSE_LEARNING,
  onCourseLearningChange,
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
          <label>
            <input type="checkbox" checked={showCoordinates}
              onChange={(event) => onShowCoordinatesChange?.(event.target.checked)} />
            {' '}Show board coordinates
          </label>
          <span className="settings-row__hint">File letters (a–h) and rank numbers (1–8) follow the board orientation.</span>
        </div>

        <div className="settings-row">
          <span className="settings-row__label">Piece shapes</span>
          <div className="piece-sets" role="group" aria-label="Piece shapes">
            {PIECE_SETS.map((set) => <button key={set.key} type="button"
              className="piece-set" aria-pressed={pieceSet === set.key}
              onClick={() => onPieceSetChange(set.key)}>
              <span className="piece-set__preview" aria-hidden="true">
                <Piece type="n" color="w" pieceSet={set.key} />
                <Piece type="b" color="b" pieceSet={set.key} />
              </span>
              <span>{set.label}</span>
              {'note' in set && <small>{set.note}</small>}
            </button>)}
          </div>
          <span className="settings-row__hint"><a href="/pieces/README.md" target="_blank" rel="noreferrer">Piece artwork credits</a></span>
        </div>

        <div className="settings-row">
          <span className="settings-row__label">Piece movement</span>
          <div className="segmented" role="group" aria-label="Piece movement style">
            {MOVEMENT_STYLES.map((style) => (
              <button key={style.key} type="button" className={movementStyle === style.key ? 'is-active' : ''}
                aria-pressed={movementStyle === style.key} onClick={() => onMovementStyleChange?.(style.key)}>{style.label}</button>
            ))}
          </div>
          <span className="settings-row__hint">{MOVEMENT_STYLES.find((style) => style.key === movementStyle)?.description}</span>
          <label htmlFor="piece-movement-speed">Animation speed</label>
          <select id="piece-movement-speed" value={movementSpeed}
            onChange={(event) => onMovementSpeedChange?.(event.target.value as MovementSpeed)}>
            {MOVEMENT_SPEEDS.map((speed) => <option key={speed.key} value={speed.key}>{speed.label}</option>)}
          </select>
          <MovementPreview movementStyle={movementStyle} movementSpeed={movementSpeed} pieceSet={pieceSet} />
          <span className="settings-row__hint">Applies to clicked moves, replies, and move-by-move playback. Dragged pieces follow your pointer.
            Course demonstration timing is set separately below.</span>
        </div>

        <div className="settings-row">
          <span className="settings-row__label">Move entry</span>
          <div className="segmented" role="group" aria-label="Move entry mode">
            <button type="button" className={moveEntryMode === 'smart' ? 'is-active' : ''}
              aria-pressed={moveEntryMode === 'smart'} onClick={() => onMoveEntryModeChange('smart')}>Smart click</button>
            <button type="button" className={moveEntryMode === 'select' ? 'is-active' : ''}
              aria-pressed={moveEntryMode === 'select'} onClick={() => onMoveEntryModeChange('select')}>Select destinations</button>
          </div>
          <span className="settings-row__hint">Smart click plays a capture when available, otherwise a legal move.
            Click an empty square to move a piece there, or an opponent’s piece to capture it.
            A quick engine search chooses among multiple options.
            Drag to choose a specific move. Applies to Explore; exercises keep manual selection.
            Reverse capture dragging works in either mode.</span>
        </div>

        <div className="settings-row">
          <span className="settings-row__label">Board sounds</span>
          <label htmlFor="board-sound-style">Sound style</label>
          <select id="board-sound-style" value={soundStyle}
            onChange={(event) => onSoundStyleChange?.(event.target.value as SoundStyle)}>
            {SOUND_STYLES.map((style) => <option key={style.key} value={style.key}>{style.label}</option>)}
          </select>
          <span className="settings-row__hint">{SOUND_STYLES.find((style) => style.key === soundStyle)?.description}
            {' '}Inspired presets are original sounds, not official recordings.</span>
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
            {(['move', 'capture', 'castle', 'check', 'promotion', 'mate'] as const).map((kind) => (
              <button key={kind} type="button" disabled={soundVolume === 0}
                onClick={() => playBoardSound(kind, soundVolume, soundStyle)}>{kind}</button>
            ))}
          </div>
          <label>
            <input type="checkbox" checked={replaySounds}
              onChange={(event) => onReplaySoundsChange?.(event.target.checked)} />
            {' '}Sound replayed moves
          </label>
          <span className="settings-row__hint">Only new moves make a sound by default. Turn this on to also hear moves
            when you step back and forward through a game, line or review.</span>
        </div>

        <div className="settings-row">
          <span className="settings-row__label">Arrows &amp; square marks</span>
          <div className="segmented" role="group" aria-label="Arrow and square style">
            {ANNOTATION_STYLES.map((style) => <button key={style.key} type="button"
              className={annotationStyle === style.key ? 'is-active' : ''} aria-pressed={annotationStyle === style.key}
              onClick={() => onAnnotationStyleChange?.(style.key)}>{style.label}</button>)}
          </div>
          <span className="settings-row__hint">{ANNOTATION_STYLES.find((style) => style.key === annotationStyle)?.description}</span>
          <AnnotationPreview style={annotationStyle} thickness={annotationThickness} />
          <span className="settings-row__label">Arrow &amp; square-mark thickness</span>
          <div className="segmented" role="group" aria-label="Arrow and square thickness">
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
          <span className="settings-row__hint">Applies to your drawings and study hints. Right-click a square to mark it, or right-drag for an arrow.
            Hold Shift for red, Ctrl for blue, or Alt for yellow. Draw the same mark again to remove it.</span>
        </div>

        <div className="settings-row">
          <span className="settings-row__label">Last-move arrow</span>
          <label className="settings-check">
            <input type="checkbox" checked={showLastMoveArrow}
              onChange={(event) => onShowLastMoveArrowChange?.(event.target.checked)} />
            Show last-move arrow
          </label>
          <span className="settings-row__hint">Shows the most recent move, such as e2 to e4. Hides when you draw an arrow or mark a square,
            and returns for the next move. Uses your chosen arrow style and thickness.</span>
          <label htmlFor="last-move-arrow-color">Last-move arrow color</label>
          <select id="last-move-arrow-color" value={lastMoveArrowColor} disabled={!showLastMoveArrow}
            onChange={(event) => onLastMoveArrowColorChange?.(event.target.value as DrawColor)}>
            {DRAW_COLOR_OPTIONS.map((color) => <option key={color.key} value={color.key}>{color.label}</option>)}
          </select>
          {showLastMoveArrow && <svg className="last-move-arrow-preview" viewBox="0 0 37.5 12.5" role="img" aria-label="Last-move arrow preview">
            {[0, 1, 2].map((i) => <rect key={i} x={i * 12.5} y="0" width="12.5" height="12.5"
              fill={i % 2 ? 'var(--sq-dark)' : 'var(--sq-light)'} />)}
            <AnnotationArrow from={{ x: 6.25, y: 6.25 }} to={{ x: 31.25, y: 6.25 }}
              color={lastMoveArrowColor} style={annotationStyle} thickness={annotationThickness} />
          </svg>}
        </div>

        <div className="settings-row">
          <label className="settings-row__label" htmlFor="course-chunk">Moves before practice</label>
          <select id="course-chunk" value={courseLearning.courseChunk}
            onChange={(event) => onCourseLearningChange?.({ ...courseLearning, courseChunk: Number(event.target.value) })}>
            <option value={0}>Whole line</option>
            {Array.from({ length: 30 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>Up to {n} {n === 1 ? 'move' : 'moves'}</option>)}
          </select>
          <span className="settings-row__hint">Counts your side’s moves; opponent replies are included. Long lines split into balanced parts. Applies to your next session.</span>
          <label className="settings-row__label" htmlFor="course-passes">Full-line practice rounds</label>
          <select id="course-passes" value={courseLearning.courseFullPasses}
            onChange={(event) => onCourseLearningChange?.({ ...courseLearning, courseFullPasses: Number(event.target.value) })}>
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <span className="settings-row__hint">After practicing each part, repeat the whole line this many times. Applies to your next session.</span>
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
