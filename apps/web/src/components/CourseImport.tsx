import { useMemo, useRef, useState } from 'react';
import { allVariations, buildCourse, trainableMoves } from '@coh/course';
import type { Course, CourseSide, SectionHeader } from '@coh/course';
import { groupCourseSections } from '../courseSections.js';
import { CourseSectionMapping } from './CourseSectionMapping.js';

interface CourseImportProps {
  onImport: (pgn: string, options: { name: string; side: CourseSide; sectionHeader: SectionHeader }) => void | Promise<void>;
  onCancel?: () => void;
  busy?: boolean;
}

/**
 * Bringing a course in.
 *
 * The whole file is parsed before anything is saved, and what the parse found
 * is what you are shown: the chapters it recognised, how many lines that is, how
 * many moves you would have to know, and which side it thinks the repertoire is
 * written for. A course imported for the wrong colour is a course that asks you
 * to play your opponent's moves, so the guess is put on screen next to a switch
 * rather than left to be discovered on the first question.
 */
export function CourseImport({ onImport, onCancel, busy }: CourseImportProps) {
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const locked = busy || saving;
  const [dragging, setDragging] = useState(false);
  const [name, setName] = useState('');
  const [fileName, setFileName] = useState('');
  const [sectionHeader, setSectionHeader] = useState<SectionHeader>('White');
  const [side, setSide] = useState<CourseSide | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Keep the preview and the saved PGN based on the same text and side.
  const previewResult = useMemo<{ course: Course; variations: number; moves: number } | { error: string } | null>(() => {
    if (!text.trim()) return null;
    try {
      const course = buildCourse(text, { fileName, sectionHeader, ...(side ? { side } : {}) });
      if (!course.chapters.length) return null;
      return {
        course,
        variations: allVariations(course).length,
        moves: trainableMoves(course.chapters, course.side).size,
      };
    } catch (cause) {
      return { error: `The course importer could not process this PGN: ${cause instanceof Error ? cause.message : 'Unexpected import error'}` };
    }
  }, [text, side, fileName, sectionHeader]);
  const preview = previewResult && 'course' in previewResult ? previewResult : null;
  const previewError = previewResult && 'error' in previewResult ? previewResult.error : null;

  const readFile = (file: File | undefined) => {
    if (!file || locked) return;
    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setText(String(reader.result ?? ''));
      setFileName(file.name);
    };
    reader.onerror = () => setError('That file could not be read. Please try opening it again.');
    reader.readAsText(file);
  };

  const chosenSide = side ?? preview?.course.side ?? 'white';
  const chosenName = name.trim() || preview?.course.name || '';
  const confirmImport = async () => {
    if (!preview?.moves || busy || savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    setError(null);
    try { await onImport(text, { name: chosenName, side: chosenSide, sectionHeader }); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'The course could not be imported.'); }
    finally { savingRef.current = false; setSaving(false); }
  };

  return (
    <section className="panel review-setup course-import">
      <div className="panel__head">
        <div className="panel__title">
          <h2>Import a course</h2>
          <span className="muted">any repertoire PGN — chapters, sidelines and notes</span>
        </div>
      </div>

      <label
        className={`review-drop${dragging ? ' is-dragging' : ''}`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          readFile(event.dataTransfer.files[0]);
        }}
      >
        <textarea
          aria-label="Course PGN"
          disabled={locked}
          value={text}
          onChange={(event) => { setText(event.target.value); setFileName(''); setError(null); }}
          placeholder={
            '[Event "My repertoire: The Najdorf"]\n\n1. e4 c5 2. Nf3 d6 {The move order matters…}'
          }
          spellCheck={false}
          rows={8}
        />
      </label>

      <div className="review-setup__row">
        <input
          ref={fileRef}
          type="file"
          accept=".pgn,text/plain"
          hidden
          onChange={(event) => readFile(event.target.files?.[0])}
        />
        <button type="button" disabled={locked} onClick={() => fileRef.current?.click()}>
          Open a .pgn file
        </button>
        {text && (
          <button type="button" disabled={locked} onClick={() => { setText(''); setFileName(''); setName(''); }}>
            Clear
          </button>
        )}
        {onCancel && (
          <button type="button" disabled={locked} onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>

      {error && <p className="review-error" role="alert">{error}</p>}
      {text.trim() && !preview && <p className="review-error" role="alert">{previewError ?? 'No readable games found. Paste a PGN or open a .pgn file with legal moves.'}</p>}
      {preview && (
        <CoursePreview
          course={preview.course}
          variations={preview.variations}
          moves={preview.moves}
          name={chosenName}
          side={chosenSide}
          inferred={side === null}
          busy={locked}
          onNameChange={setName}
          onSideChange={setSide}
          sectionHeader={sectionHeader}
          onSectionHeaderChange={setSectionHeader}
          onConfirm={() => void confirmImport()}
        />
      )}
    </section>
  );
}

interface CoursePreviewProps {
  course: Course;
  variations: number;
  moves: number;
  name: string;
  side: CourseSide;
  /** True while the side on show is the importer's guess rather than a choice. */
  inferred: boolean;
  busy?: boolean;
  onNameChange: (name: string) => void;
  onSideChange: (side: CourseSide) => void;
  sectionHeader?: SectionHeader;
  onSectionHeaderChange?: (header: SectionHeader) => void;
  onConfirm: () => void;
}

/** What the parse found, and the two things worth correcting before it is saved. */
export function CoursePreview({
  course,
  variations,
  moves,
  name,
  side,
  inferred,
  busy,
  onNameChange,
  onSideChange,
  sectionHeader = 'White',
  onSectionHeaderChange,
  onConfirm,
}: CoursePreviewProps) {
  return (
    <div className="course-import__preview">
      <div className="course-import__fields">
        <label>
          <span>Course name</span>
          <input
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            spellCheck={false}
          />
        </label>
        <label>
          <span>You play</span>
          <div className="segmented">
            <button
              type="button"
              className={side === 'white' ? 'is-active' : ''}
              onClick={() => onSideChange('white')}
            >
              White
            </button>
            <button
              type="button"
              className={side === 'black' ? 'is-active' : ''}
              onClick={() => onSideChange('black')}
            >
              Black
            </button>
          </div>
        </label>
      </div>

      {onSectionHeaderChange && <CourseSectionMapping value={sectionHeader} onChange={onSectionHeaderChange} disabled={busy} />}

      <p className="muted course-import__counts">
        {course.chapters.length} chapter{course.chapters.length === 1 ? '' : 's'} · {variations}{' '}
        variation{variations === 1 ? '' : 's'} · {moves} moves to know
        {inferred && ' · side inferred from where the course branches'}
      </p>

      <ul className="course-import__chapters">
        {groupCourseSections(course.chapters.slice(0, 12)).map(({ section, chapters }) => section ? (
          <li key={section}><strong>{section}</strong><ul>
            {chapters.map((chapter) => <li key={chapter.id}>{chapter.name}</li>)}
          </ul></li>
        ) : chapters.map((chapter) => <li key={chapter.id}>{chapter.name}</li>))}
        {course.chapters.length > 12 && (
          <li className="muted">and {course.chapters.length - 12} more</li>
        )}
      </ul>

      {course.problems.length > 0 && (
        <p className="course-import__problems">
          {course.problems.length} move{course.problems.length === 1 ? '' : 's'} could not be
          replayed and {course.problems.length === 1 ? 'was' : 'were'} left out — first was{' '}
          <strong>{course.problems[0]!.san}</strong> in {course.problems[0]!.chapter}.
        </p>
      )}

      {moves === 0 && <p className="review-error" role="alert">No trainable moves for this side. Check the PGN or choose the other side.</p>}
      <div className="review-setup__row review-setup__go">
        <button type="button" className="primary" disabled={busy || moves === 0} onClick={onConfirm}>
          {busy ? 'Adding…' : 'Add to my courses'}
        </button>
      </div>
    </div>
  );
}
