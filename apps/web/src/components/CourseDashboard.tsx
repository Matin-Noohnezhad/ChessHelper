import { LEVELS, MAX_LEVEL, courseOutline, nextDueAt } from '@coh/course';
import type { CourseSide, SessionMode } from '@coh/course';
import type { LibraryEntry } from '../hooks/useCourseLibrary.js';
import { CourseOutline } from './CourseOutline.js';
import { untilLabel } from './CourseLibrary.js';

/** How long a move at each rung waits: the ladder, in words. */
function rungLabel(level: number): string {
  if (level === 0) return 'not met';
  const ms = LEVELS[level - 1]!;
  const hours = ms / 3_600_000;
  if (hours < 24) return `${hours}h`;
  const days = hours / 24;
  return days < 31 ? `${days}d` : `${Math.round(days / 30)}mo`;
}

interface CourseDashboardProps {
  entry: LibraryEntry;
  onStart: (mode: SessionMode, chapterIds?: string[], lineIds?: string[]) => void;
  onBack: () => void;
  onResetProgress: () => void;
  onSetSide: (side: CourseSide) => void;
}

/**
 * One course, chapter by chapter.
 *
 * The table counts moves rather than variations, because that is what the
 * schedule counts: forty variations built out of sixty distinct moves is sixty
 * things to remember, and a chapter that is mostly move orders into another
 * chapter is nearly free. The two numbers disagreeing is the useful part.
 */
export function CourseDashboard({
  entry,
  onStart,
  onBack,
  onResetProgress,
  onSetSide,
}: CourseDashboardProps) {
  const { course, stats, progress } = entry;
  const next = nextDueAt(course, progress);
  const now = Date.now();
  const outline = courseOutline(course, progress, now);

  return (
    <div className="course-dashboard">
      <div className="course-head">
        <button type="button" onClick={onBack}>
          ← Courses
        </button>
        <h2>{course.name}</h2>
        <div className="segmented">
          <button
            type="button"
            className={course.side === 'white' ? 'is-active' : ''}
            onClick={() => onSetSide('white')}
          >
            White
          </button>
          <button
            type="button"
            className={course.side === 'black' ? 'is-active' : ''}
            onClick={() => onSetSide('black')}
          >
            Black
          </button>
        </div>
      </div>

      <section className="panel">
        <div className="bar">
          <div
            className="bar__fill"
            style={{ width: `${stats.total ? (stats.learned / stats.total) * 100 : 0}%` }}
          />
        </div>
        <p className="muted course-card__counts">
          {stats.learned} of {stats.total} moves learned · {stats.due} due now
          {stats.due === 0 && next ? ` · next ${untilLabel(now, next)}` : ''}
        </p>

        <div className="course-ladder">
          {Array.from({ length: MAX_LEVEL + 1 }, (_, level) => {
            const count = stats.levels[level] ?? 0;
            const height = stats.total ? (count / stats.total) * 100 : 0;
            return (
              <div key={level} className="course-ladder__rung" title={`${count} moves`}>
                <div className="course-ladder__bar">
                  <div style={{ height: `${Math.max(height, count ? 4 : 0)}%` }} />
                </div>
                <span className="muted">{rungLabel(level)}</span>
              </div>
            );
          })}
        </div>
        <p className="muted">
          Every move climbs its own ladder — four hours, a day, three days, a week, and on out to
          half a year. One miss puts that move back on the bottom rung and leaves the rest of its
          variation where it was.
        </p>

        <div className="course-card__actions">
          <button type="button" className="primary" onClick={() => onStart('learn')}>
            Learn new moves
          </button>
          <button type="button" disabled={stats.due === 0} onClick={() => onStart('review')}>
            Review
          </button>
          <button type="button" disabled={stats.due === 0} onClick={() => onStart('random')}>
            Quick review
          </button>
          <button type="button" className="reset" onClick={onResetProgress}>
            Reset progress
          </button>
        </div>
      </section>

      <section className="panel">
        <h3>Chapters &amp; lines</h3>
        <p className="muted course-outline__legend">
          The ring fills as you work through a line and turns solid with a tick once every move in
          it has come back after a night. Click any line to study it now — a dot means something in
          it is due.
        </p>
        <CourseOutline
          chapters={outline}
          onPickLine={(lineId) => onStart('learn', undefined, [lineId])}
          onChapter={(mode, chapterId) => onStart(mode, [chapterId])}
        />
      </section>

      {course.problems.length > 0 && (
        <section className="panel">
          <h3>Left out of the import</h3>
          <p className="muted">
            These moves could not be replayed, so neither they nor anything under them was kept.
          </p>
          <ul className="course-problems">
            {course.problems.slice(0, 20).map((problem, index) => (
              <li key={index}>
                <strong>{problem.san}</strong> <span className="muted">in {problem.chapter}</span>
                {problem.line && <span className="muted"> after {problem.line}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
