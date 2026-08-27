import { useMemo, useRef, useState } from 'react';
import { allVariations, buildCourse, trainableMoves } from '@coh/course';
import type { Course, CourseSide } from '@coh/course';

interface CourseImportProps {
  onImport: (pgn: string, options: { name: string; side: CourseSide }) => void;
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
  const [dragging, setDragging] = useState(false);
  const [name, setName] = useState('');
  const [side, setSide] = useState<CourseSide | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Parsing on every keystroke is fine for a pasted line and wasteful for a
  // two-megabyte file, which is why this is only ever driven by a paste, a drop
  // or a file — never by typing into the box character by character.
  const preview = useMemo(() => {
    if (text.trim().length < 8) return null;
    try {
      const course = buildCourse(text, { ...(side ? { side } : {}) });
      if (!course.chapters.length) return null;
      return {
        course,
        variations: allVariations(course).length,
        moves: trainableMoves(course.chapters, course.side).size,
      };
    } catch {
      return null;
    }
  }, [text, side]);

  const readFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setText(String(reader.result ?? ''));
    reader.readAsText(file);
  };

  const chosenSide = side ?? preview?.course.side ?? 'white';
  const chosenName = name.trim() || preview?.course.name || '';

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
          value={text}
          onChange={(event) => setText(event.target.value)}
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
        <button type="button" onClick={() => fileRef.current?.click()}>
          Open a .pgn file
        </button>
        {text && (
          <button type="button" onClick={() => setText('')}>
            Clear
          </button>
        )}
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>

      {preview && (
        <CoursePreview
          course={preview.course}
          variations={preview.variations}
          moves={preview.moves}
          name={chosenName}
          side={chosenSide}
          inferred={side === null}
          busy={busy}
          onNameChange={setName}
          onSideChange={setSide}
          onConfirm={() => onImport(text, { name: chosenName, side: chosenSide })}
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

      <p className="muted course-import__counts">
        {course.chapters.length} chapter{course.chapters.length === 1 ? '' : 's'} · {variations}{' '}
        variation{variations === 1 ? '' : 's'} · {moves} moves to know
        {inferred && ' · side inferred from where the course branches'}
      </p>

      <ul className="course-import__chapters">
        {course.chapters.slice(0, 12).map((chapter) => (
          <li key={chapter.id}>{chapter.name}</li>
        ))}
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

      <div className="review-setup__row review-setup__go">
        <button type="button" className="primary" disabled={busy} onClick={onConfirm}>
          Add to my courses
        </button>
      </div>
    </div>
  );
}
