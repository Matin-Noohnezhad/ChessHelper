import { useState } from 'react';
import { LEVELS, MAX_LEVEL, courseOutline, nextDueAt } from '@coh/course';
import type { CourseSide, SessionMode, SectionHeader } from '@coh/course';
import type { LibraryEntry } from '../hooks/useCourseLibrary.js';
import { CourseOutline } from './CourseOutline.js';
import { CourseSectionMapping } from './CourseSectionMapping.js';
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
  initialSection?: 'learning' | 'reading';
  onStart: (mode: SessionMode, chapterIds?: string[], lineIds?: string[]) => void;
  onRead?: (chapterId?: string, lineId?: string) => void;
  onBack: () => void;
  onResetProgress: () => void;
  /** Wipe progress for one chapter. `label` is its name, for the confirm prompt. */
  onResetChapter?: (chapterId: string, label: string) => void;
  /** Wipe progress for one line. `label` is its notation, for the confirm prompt. */
  onResetLine?: (lineId: string, label: string) => void;
  onSetSide: (side: CourseSide) => void;
  onSetSectionHeader?: (header: SectionHeader) => void;
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
  initialSection = 'learning',
  onStart,
  onRead,
  onBack,
  onResetProgress,
  onResetChapter,
  onResetLine,
  onSetSide,
  onSetSectionHeader,
}: CourseDashboardProps) {
  const [section, setSection] = useState<'learning' | 'reading'>(initialSection);
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

      <div className="segmented" role="group" aria-label="Course section">
        <button type="button" className={section === 'learning' ? 'is-active' : ''} aria-pressed={section === 'learning'} onClick={() => setSection('learning')}>Learning</button>
        <button type="button" className={section === 'reading' ? 'is-active' : ''} aria-pressed={section === 'reading'} onClick={() => setSection('reading')}>Reading</button>
      </div>
      {section === 'reading' ? <section className="panel">
        <h3>Read the course</h3>
        <p className="muted">Each game stays in one line, with its explanations, arrows and square highlights. At a branch, use ↑ ↓ to choose a variation and → to continue; the main line is selected by default.</p>
        <button type="button" className="primary" onClick={() => onRead?.()}>Start reading</button>
      </section> : <section className="panel">
        <div className="bar">
          <div
            className="bar__fill"
            style={{ width: `${stats.total ? (stats.learned / stats.total) * 100 : 0}%` }}
          />
        </div>
        <p className="muted course-card__counts">
          {stats.learned} of {stats.total} moves learned · {stats.total - stats.seen} new · {stats.due} due now
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
          <button type="button" className="primary" disabled={stats.seen >= stats.total} onClick={() => onStart('learn')}>
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
      </section>}

      <section className="panel">
        <h3>Chapters &amp; lines</h3>
        {onSetSectionHeader && <CourseSectionMapping value={entry.stored.sectionHeader ?? 'White'} onChange={onSetSectionHeader} />}
        <p className="muted course-outline__legend">
          The ring fills as you work through a line and turns solid with a tick once every move in
          it has come back after a night. Click any line to {section === 'reading' ? 'read' : 'study'} it now — a dot means something in
          it is due.
        </p>
        <CourseOutline
          chapters={outline}
          onPickLine={(lineId) => section === 'reading' ? onRead?.(undefined, lineId) : onStart('learn', undefined, [lineId])}
          onReadChapter={section === 'reading' ? (chapterId) => onRead?.(chapterId) : undefined}
          onChapter={section === 'learning' ? (mode, chapterId) => onStart(mode, [chapterId]) : undefined}
          {...(section === 'learning' && onResetChapter ? { onResetChapter } : {})}
          {...(section === 'learning' && onResetLine ? { onResetLine } : {})}
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
