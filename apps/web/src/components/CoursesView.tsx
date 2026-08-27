import { useState } from 'react';
import type { CourseSide, SessionMode } from '@coh/course';
import { CourseDashboard } from './CourseDashboard.js';
import { CourseImport } from './CourseImport.js';
import { CourseLibrary } from './CourseLibrary.js';
import { CourseSession } from './CourseSession.js';
import type { AnnotationThickness } from './Board.js';
import { useCourseLibrary } from '../hooks/useCourseLibrary.js';

type View =
  | { kind: 'library' }
  | { kind: 'import' }
  | { kind: 'course'; id: string }
  | {
      kind: 'session';
      id: string;
      mode: SessionMode;
      chapterIds?: string[];
      lineIds?: string[];
    };

interface CoursesViewProps {
  annotationThickness?: AnnotationThickness;
}

/**
 * The courses tab: a shelf, a course, and a session on it.
 *
 * All the state that survives a session lives here rather than inside the
 * session, so finishing a line and stepping back out lands on a dashboard whose
 * numbers have already moved.
 */
export function CoursesView({ annotationThickness }: CoursesViewProps) {
  const library = useCourseLibrary();
  const [view, setView] = useState<View>({ kind: 'library' });

  const entryOf = (id: string) => library.entries.find((entry) => entry.stored.id === id) ?? null;
  const openLibrary = () => setView({ kind: 'library' });

  if (view.kind === 'import') {
    return (
      <div className="app__body app__body--single">
        <CourseImport
          onCancel={openLibrary}
          onImport={async (pgn, options) => {
            const id = await library.importPgn(pgn, options);
            setView(id ? { kind: 'course', id } : { kind: 'library' });
          }}
        />
        {library.error && <p className="review-error">{library.error}</p>}
      </div>
    );
  }

  if (view.kind === 'session') {
    const entry = entryOf(view.id);
    if (!entry) return <MissingCourse onBack={openLibrary} />;
    // No `app__body` wrapper: a session is board-plus-panel at full width, the
    // same shape the sparring trainer uses. The key makes picking a different
    // line off the rail a clean remount rather than a plan swapped mid-answer.
    return (
      <CourseSession
        key={`${view.mode}:${(view.chapterIds ?? []).join(',')}:${(view.lineIds ?? []).join(',')}`}
        entry={entry}
        mode={view.mode}
        {...(view.chapterIds ? { chapterIds: view.chapterIds } : {})}
        {...(view.lineIds ? { lineIds: view.lineIds } : {})}
        onExit={() => setView({ kind: 'course', id: view.id })}
        onPickLine={(lineId) =>
          setView({ kind: 'session', id: view.id, mode: 'learn', lineIds: [lineId] })
        }
        onProgress={(progress) => library.commitProgress(view.id, progress)}
        {...(annotationThickness ? { annotationThickness } : {})}
      />
    );
  }

  if (view.kind === 'course') {
    const entry = entryOf(view.id);
    if (!entry) return <MissingCourse onBack={openLibrary} />;
    return (
      <div className="app__body app__body--single">
        <CourseDashboard
          entry={entry}
          onBack={openLibrary}
          onStart={(mode, chapterIds, lineIds) =>
            setView({
              kind: 'session',
              id: view.id,
              mode,
              ...(chapterIds ? { chapterIds } : {}),
              ...(lineIds ? { lineIds } : {}),
            })
          }
          onResetProgress={() => void library.resetProgress(view.id)}
          onSetSide={(side: CourseSide) => void library.setSide(view.id, side)}
        />
      </div>
    );
  }

  return (
    <div className="app__body app__body--single">
      <CourseLibrary
        entries={library.entries}
        loading={library.loading}
        onImport={() => setView({ kind: 'import' })}
        onOpen={(id) => setView({ kind: 'course', id })}
        onStart={(id, mode) => setView({ kind: 'session', id, mode })}
        onDelete={(id) => void library.remove(id)}
      />
    </div>
  );
}

function MissingCourse({ onBack }: { onBack: () => void }) {
  return (
    <div className="app__body app__body--single">
      <section className="panel panel--empty">
        <p className="muted">That course is no longer on the shelf.</p>
        <button type="button" onClick={onBack}>
          Back to courses
        </button>
      </section>
    </div>
  );
}
