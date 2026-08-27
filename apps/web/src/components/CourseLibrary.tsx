import { nextDueAt } from '@coh/course';
import type { SessionMode } from '@coh/course';
import type { LibraryEntry } from '../hooks/useCourseLibrary.js';

/** "in 3 hours", "in 2 days" — enough to know whether to wait or move on. */
export function untilLabel(from: number, at: number): string {
  const ms = at - from;
  if (ms <= 0) return 'now';
  const minutes = Math.round(ms / 60_000);
  if (minutes < 60) return `in ${minutes} minute${minutes === 1 ? '' : 's'}`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `in ${hours} hour${hours === 1 ? '' : 's'}`;
  const days = Math.round(hours / 24);
  if (days < 31) return `in ${days} day${days === 1 ? '' : 's'}`;
  const months = Math.round(days / 30);
  return `in ${months} month${months === 1 ? '' : 's'}`;
}

interface CourseLibraryProps {
  entries: LibraryEntry[];
  loading?: boolean;
  onOpen: (id: string) => void;
  onStart: (id: string, mode: SessionMode) => void;
  onDelete: (id: string) => void;
  onImport: () => void;
}

/**
 * The shelf.
 *
 * One card per course, and the only number that matters on it is how many moves
 * are waiting — a course with nothing due needs nothing from you today, and
 * saying so is more use than another progress bar to feel bad about.
 */
export function CourseLibrary({
  entries,
  loading,
  onOpen,
  onStart,
  onDelete,
  onImport,
}: CourseLibraryProps) {
  const now = Date.now();

  if (loading) {
    return (
      <section className="panel panel--empty">
        <p className="muted">Opening your courses…</p>
      </section>
    );
  }

  if (!entries.length) {
    return (
      <section className="panel course-empty">
        <h2>No courses yet</h2>
        <p className="muted">
          A course is a repertoire PGN: chapters, sidelines and the author's notes on the moves.
          Import one and it is drilled a move at a time, each move on its own schedule.
        </p>
        <button type="button" className="primary" onClick={onImport}>
          Import a course
        </button>
      </section>
    );
  }

  return (
    <div className="course-library">
      <div className="course-head">
        <h2>Your courses</h2>
        <button type="button" onClick={onImport}>
          Import a course
        </button>
      </div>

      {entries.map((entry) => {
        const { stats, stored, course, progress } = entry;
        const percent = stats.total ? (stats.learned / stats.total) * 100 : 0;
        const next = nextDueAt(course, progress);
        const unseen = stats.total - stats.seen;

        return (
          <article key={stored.id} className="panel course-card">
            <div className="course-card__head">
              <button type="button" className="course-card__name" onClick={() => onOpen(stored.id)}>
                {course.name}
              </button>
              <span className={`tag tag--${course.side === 'white' ? 'book' : 'positional'}`}>
                {course.side === 'white' ? 'White' : 'Black'}
              </span>
            </div>

            <p className="muted course-card__meta">
              {course.chapters.length} chapter{course.chapters.length === 1 ? '' : 's'} ·{' '}
              {stats.variations} variations · {stats.total} moves
            </p>

            <div className="bar">
              <div className="bar__fill" style={{ width: `${percent}%` }} />
            </div>
            <p className="muted course-card__counts">
              {stats.learned} learned · {stats.seen - stats.learned} still settling · {unseen} not
              met yet
              {stats.due > 0
                ? ` · ${stats.due} due now`
                : next
                  ? ` · nothing due, next ${untilLabel(now, next)}`
                  : ''}
            </p>

            <div className="course-card__actions">
              <button
                type="button"
                className="primary"
                disabled={!unseen}
                onClick={() => onStart(stored.id, 'learn')}
                title={unseen ? `${unseen} moves you have not met` : 'Every move has been met'}
              >
                Learn
              </button>
              <button
                type="button"
                disabled={stats.due === 0 || stats.seen === 0}
                onClick={() => onStart(stored.id, 'review')}
                title="Replay whole variations, nothing shown"
              >
                Review
              </button>
              <button
                type="button"
                disabled={stats.due === 0 || stats.seen === 0}
                onClick={() => onStart(stored.id, 'random')}
                title="Straight to the position each due move sits in"
              >
                Quick review
              </button>
              <button type="button" onClick={() => onOpen(stored.id)}>
                Chapters
              </button>
              <button
                type="button"
                className="reset"
                onClick={() => onDelete(stored.id)}
                title="Remove this course and its progress"
              >
                Delete
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
