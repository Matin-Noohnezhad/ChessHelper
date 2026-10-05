import { useState } from 'react';
import type { CourseSide, SessionMode } from '@coh/course';
import { CourseDashboard } from './CourseDashboard.js';
import { CourseImport } from './CourseImport.js';
import { CourseLibrary } from './CourseLibrary.js';
import { CourseReader } from './CourseReader.js';
import type { CourseLearningSettings } from '../hooks/useSettings.js';
import { CourseSession } from './CourseSession.js';
import type { AnnotationThickness } from './Board.js';
import { useCourseLibrary } from '../hooks/useCourseLibrary.js';

type View =
  | { kind: 'library' }
  | { kind: 'import' }
  | { kind: 'course'; id: string; section?: 'learning' | 'reading' }
  | { kind: 'reading'; id: string; chapterId?: string; lineId?: string }
  | {
      kind: 'session';
      id: string;
      mode: SessionMode;
      chapterIds?: string[];
      lineIds?: string[];
    };

interface CoursesViewProps {
  moveEntryMode?: 'smart' | 'select';
  courseLearning?: CourseLearningSettings;
  annotationThickness?: AnnotationThickness;
  watchAutoplay?: boolean;
  watchMoveSeconds?: number;
}

/**
 * The courses tab: a shelf, a course, and a session on it.
 *
 * All the state that survives a session lives here rather than inside the
 * session, so finishing a line and stepping back out lands on a dashboard whose
 * numbers have already moved.
 */
export function CoursesView({
  moveEntryMode,
  annotationThickness,
  courseLearning,
  watchAutoplay,
  watchMoveSeconds,
}: CoursesViewProps) {
  const library = useCourseLibrary();
  const [view, setView] = useState<View>({ kind: 'library' });

  const entryOf = (id: string) => library.entries.find((entry) => entry.stored.id === id) ?? null;
  const openLibrary = () => setView({ kind: 'library' });
  const notices = <>
    {library.storageWarning && <p className="course-notice" role="alert">{library.storageWarning}</p>}
    {library.error && <p className="course-notice" role="alert">{library.error}</p>}
  </>;

  if (view.kind === 'import') {
    return (
      <div className="app__body app__body--single">
        <CourseImport
          onCancel={openLibrary}
          onImport={async (pgn, options) => {
            const id = await library.importPgn(pgn, options);
            if (id) setView({ kind: 'course', id });
          }}
        />
        {notices}
      </div>
    );
  }

  if (view.kind === 'reading') {
    const entry = entryOf(view.id);
    if (!entry) return <MissingCourse onBack={openLibrary} />;
    return <>{notices}<CourseReader key={view.id} entry={entry} chapterId={view.chapterId} lineId={view.lineId}
      moveEntryMode={moveEntryMode}
      onTrain={(chapterId, lineId) => setView({ kind: 'session', id: view.id, mode: 'learn',
        chapterIds: [chapterId], ...(lineId ? { lineIds: [lineId] } : {}) })}
      annotationThickness={annotationThickness} onExit={() => setView({ kind: 'course', id: view.id, section: 'reading' })} /></>;
  }

  if (view.kind === 'session') {
    const entry = entryOf(view.id);
    if (!entry) return <MissingCourse onBack={openLibrary} />;
    // No `app__body` wrapper: a session is board-plus-panel at full width, the
    // same shape the sparring trainer uses. The key makes picking a different
    // line off the rail a clean remount rather than a plan swapped mid-answer.
    return (<>
      {notices}
      <CourseSession
        moveEntryMode={moveEntryMode}
        key={`${view.id}:${view.mode}:${(view.chapterIds ?? []).join(',')}:${(view.lineIds ?? []).join(',')}`}
        entry={entry}
        mode={view.mode}
        courseLearning={courseLearning}
        {...(view.chapterIds ? { chapterIds: view.chapterIds } : {})}
        {...(view.lineIds ? { lineIds: view.lineIds } : {})}
        onExit={() => setView({ kind: 'course', id: view.id })}
        onPickLine={(lineId) =>
          setView({ kind: 'session', id: view.id, mode: 'learn', lineIds: [lineId] })
        }
        onProgress={(progress) => library.commitProgress(view.id, progress)}
        {...(annotationThickness ? { annotationThickness } : {})}
        {...(watchAutoplay !== undefined ? { watchAutoplay } : {})}
        {...(watchMoveSeconds !== undefined ? { watchMoveSeconds } : {})}
      />
    </>);
  }

  if (view.kind === 'course') {
    const entry = entryOf(view.id);
    if (!entry) return <MissingCourse onBack={openLibrary} />;
    return (
      <div className="app__body app__body--single">
        {notices}
        <CourseDashboard
          initialSection={view.section}
          entry={entry}
          onRead={(chapterId, lineId) => setView({ kind: 'reading', id: view.id, chapterId, lineId })}
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
          onResetProgress={() => {
            if (window.confirm(`Reset all progress for “${entry.course.name}”? This cannot be undone.`))
              void library.resetProgress(view.id);
          }}
          onResetChapter={(chapterId, label) => {
            if (
              window.confirm(
                `Reset your progress for “${label}”? The moves it teaches go back to unlearned.`,
              )
            )
              void library.resetScope(view.id, { chapterIds: [chapterId] });
          }}
          onResetLine={(lineId, label) => {
            if (window.confirm(`Reset your progress for ${label}? Its moves go back to unlearned.`))
              void library.resetScope(view.id, { lineIds: [lineId] });
          }}
          onSetSide={(side: CourseSide) => void library.setSide(view.id, side)}
        />
      </div>
    );
  }

  return (
    <div className="app__body app__body--single">
      {notices}
      <CourseLibrary
        entries={library.entries}
        loading={library.loading}
        onImport={() => setView({ kind: 'import' })}
        onOpen={(id) => setView({ kind: 'course', id })}
        onStart={(id, mode) => setView({ kind: 'session', id, mode })}
        onDelete={(id) => {
          const name = entryOf(id)?.course.name ?? 'this course';
          if (window.confirm(`Delete “${name}” and all its progress? This cannot be undone.`))
            void library.remove(id);
        }}
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
