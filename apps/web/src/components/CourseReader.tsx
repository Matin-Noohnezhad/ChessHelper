import { MoveStepButton } from './MoveStepButton.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Chess, START_FEN } from '@coh/chess-core';
import { readingLinesOf, readingPath } from '@coh/course';
import type { LibraryEntry } from '../hooks/useCourseLibrary.js';
import { courseShortcutBlocked } from '../courseShortcuts.js';
import { groupCourseSections } from '../courseSections.js';
import { Board } from './Board.js';
import type { AnnotationThickness } from './Board.js';
import { MoveTrail } from './CourseSession.js';
import { CourseAnalysis } from './CourseAnalysis.js';
import './CourseReader.css';

interface CourseReaderProps {
  entry: LibraryEntry;
  chapterId?: string;
  lineId?: string;
  initialPly?: number;
  moveEntryMode?: 'smart' | 'select';
  onTrain?: (chapterId: string, lineId?: string) => void;
  resumeTraining?: boolean;
  annotationThickness?: AnnotationThickness;
  onExit: () => void;
}

/** A read-only walk through every PGN variation, including the author's examples. */
export function CourseReader({ entry, chapterId, lineId, initialPly = 0, moveEntryMode = 'smart',
  annotationThickness, onExit, onTrain, resumeTraining = false }: CourseReaderProps) {
  const chapters = useMemo(() => entry.course.chapters.map((chapter) => ({
    ...chapter, lines: readingLinesOf(chapter),
  })), [entry.course]);
  const lines = useMemo(() => chapters.flatMap((chapter) => chapter.lines), [chapters]);
  const [index, setIndex] = useState(() => Math.max(0, lines.findIndex((line) =>
    lineId ? line.id === lineId || (lineId.startsWith(`${line.chapterId}/`) &&
      readingPath(line.roots, lineId.slice(line.chapterId.length + 1)).some((node) => `${line.chapterId}/${node.id}` === lineId))
      : line.chapterId === chapterId)));
  const [path, setPath] = useState(() => readingPath(lines[index]?.roots ?? [],
    lineId?.slice((lines[index]?.chapterId.length ?? 0) + 1)));
  const [ply, updatePly] = useState(() => Math.min(initialPly, path.length));
  const [choice, setChoice] = useState(0);
  const setPly = (value: number) => {
    updatePly(Math.max(0, Math.min(path.length, value)));
    setChoice(0);
  };
  const [expanded, setExpanded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const sourceLine = lines[index];
  const line = useMemo(() => sourceLine ? { ...sourceLine, line: path } : undefined, [sourceLine, path]);
  const continuations = ply ? path[ply - 1]?.children ?? [] : sourceLine?.roots ?? [];
  const branch = continuations.length > 1;
  const variationList = useRef<HTMLDivElement>(null);
  const branchPly = path.slice(0, ply).reduce((last, node, i) =>
    (i ? path[i - 1]!.children : sourceLine?.roots)?.[0]?.id !== node.id ? i : last, -1);
  const chapter = chapters.find((item) => item.id === line?.chapterId);
  const sections = useMemo(() => groupCourseSections(chapters), [chapters]);
  const hasSections = sections.some((item) => item.section);
  const sectionIndex = sections.findIndex((item) => item.section === chapter?.section);
  const sectionChapters = sections[sectionIndex]?.chapters ?? [];
  const trainingLine = sourceLine && path.length === sourceLine.line.length &&
    path.every((node, index) => node.id === sourceLine.line[index]?.id) ? sourceLine : undefined;
  const train = () => { if (chapter) onTrain?.(chapter.id, trainingLine?.id); };
  const trainingLabel = resumeTraining ? 'Back to training' : trainingLine ? 'Train this line' : 'Train this chapter';
  const node = line?.line[ply - 1];
  const { game, lastMove } = useMemo(() => {
    const game = new Chess(chapter?.startFen ?? START_FEN);
    let lastMove: { from: string; to: string } | null = null;
    for (const node of line?.line.slice(0, ply) ?? []) {
      const move = game.move(node.san);
      if (move) lastMove = { from: move.from, to: move.to };
    }
    return { game, lastMove };
  }, [chapter, line, ply]);

  useEffect(() => setExpanded(false), [index, ply]);
  useEffect(() => {
    const list = variationList.current;
    const option = list?.children[choice] as HTMLElement | undefined;
    if (!list || !option) return;
    if (option.offsetTop < list.scrollTop) list.scrollTop = option.offsetTop;
    else if (option.offsetTop + option.offsetHeight > list.scrollTop + list.clientHeight)
      list.scrollTop = option.offsetTop + option.offsetHeight - list.clientHeight;
  }, [choice, index, ply]);

  const pick = (next: number) => {
    if (next < 0 || next >= lines.length) return;
    setIndex(next);
    setPath(lines[next]!.line);
    updatePly(0);
    setChoice(0);
  };
  const advance = (selected = choice) => {
    const next = continuations[selected];
    if (!next) return;
    setPath([...path.slice(0, ply), ...readingPath([next])]);
    updatePly(ply + 1);
    setChoice(0);
  };
  const forward = () => {
    if (continuations.length) advance();
    else if (index < lines.length - 1) pick(index + 1);
    else onExit();
  };
  useEffect(() => {
    if (analyzing) return;
    const onKey = (event: KeyboardEvent) => {
      if (courseShortcutBlocked(event)) return;
      const key = event.key.toLowerCase();
      if (key === 't' && onTrain && chapter) train();
      else if (key === 'a' && line) setAnalyzing(true);
      else if (key === ' ') forward();
      else if (key === 'arrowright') { if (!event.repeat || !branch) advance(); }
      else if (key === 'arrowleft') setPly(ply - 1);
      else if (key === 'arrowup' && branch) setChoice(Math.max(0, choice - 1));
      else if (key === 'arrowdown' && branch) setChoice(Math.min(continuations.length - 1, choice + 1));
      else if (key === 'home') setPly(0);
      else if (key === 'end') setPly(path.length);
      else if (key === ']') pick(index + 1);
      else if (key === '[') pick(index - 1);
      else if (key === 'c') setExpanded((value) => !value);
      else if (key === 'escape') onExit();
      else return;
      event.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!line) return <section className="panel"><p>No moves to read.</p><button onClick={onExit}>Back to course</button></section>;
  if (analyzing) return <CourseAnalysis initialFen={game.fen()} initialLastMove={lastMove}
    orientation={entry.course.side} annotationThickness={annotationThickness} moveEntryMode={moveEntryMode}
    returnLabel="Back to reading" onReturn={() => setAnalyzing(false)} />;
  const comment = node?.comment ?? '';
  const brief = comment.length > 240 ? `${comment.slice(0, 240).replace(/\s+\S*$/, '')}…` : comment;
  const atEnd = ply === line.line.length;
  return (
    <div className="trainer course-session course-session--rail course-reader">
      <aside className="panel course-session__rail">
        <h2>Chapters &amp; lines</h2>
        <div className="course-reader__navigation">
          {hasSections && <div className="course-reader__field">
            <div className="course-reader__field-head">
              <label htmlFor="reading-section"><span className="course-reader__step" aria-hidden="true">1</span>Section</label>
              <span className="muted">{sectionIndex + 1} / {sections.length}</span>
            </div>
            <select id="reading-section" value={sectionIndex} title={chapter?.section ?? 'Other chapters'}
              onChange={(event) => {
                const firstLine = sections[Number(event.target.value)]?.chapters.find((item) => item.lines.length)?.lines[0];
                if (firstLine) pick(lines.indexOf(firstLine));
              }}>
              {sections.map((item, i) => <option key={i} value={i} disabled={!item.chapters.some((chapter) => chapter.lines.length)}>
                {item.section ?? 'Other chapters'}
              </option>)}
            </select>
          </div>}
          <div className={`course-reader__field${hasSections ? ' course-reader__field--subsection' : ''}`}>
            <div className="course-reader__field-head">
              <label htmlFor="reading-chapter">
                {hasSections && <span className="course-reader__step" aria-hidden="true">2</span>}
                {hasSections ? 'Subsection' : 'Chapter'}
              </label>
              <span className="muted">{sectionChapters.length}</span>
            </div>
            <select id="reading-chapter" value={chapter?.id} title={chapter?.name}
              onChange={(event) => pick(lines.findIndex((item) => item.chapterId === event.target.value))}>
              {sectionChapters.map((item) => <option key={item.id} value={item.id} disabled={!item.lines.length}>{item.name}</option>)}
            </select>
          </div>
        </div>
        <div className="course-reader__lines-head">
          <h3>Lines</h3><span className="muted">{chapter?.lines.length}</span>
        </div>
        <p className="muted course-reader__line-help">One line per game. Variations appear at the move where they branch.</p>
        <ul className="course-outline__lines">
          {chapter?.lines.map((item, i) => <li key={item.id}>
            <button type="button" className={`course-outline__line${line.id === item.id ? ' is-active' : ''}`}
              aria-current={line.id === item.id ? 'true' : undefined} onClick={() => pick(lines.indexOf(item))}>
              <span className="course-reader__line-number">{i + 1}</span>
              <span className="course-outline__san">{item.line.map((move) => move.san + (move.suffix ?? '')).join(' ')}</span>
            </button>
          </li>)}
        </ul>
      </aside>
      <div className="trainer__board">
        <Board game={game} orientation={entry.course.side} lastMove={lastMove} onMove={() => {}} interactive={false} replay
          hintArrows={(node ? node.shapes : sourceLine?.initialShapes)?.arrows ?? []}
          hintCircles={(node ? node.shapes : sourceLine?.initialShapes)?.circles ?? []}
          annotationThickness={annotationThickness} animateMoves />
        <div className="board-bar">
          <span className="status">{ply === 0 ? 'Starting position' : `${node?.moveNumber ?? Math.ceil(ply / 2)}${node?.side === 'w' ? '.' : '…'} ${node?.san}`} · {ply} / {line.line.length}</span>
          <div className="nav">
            <button type="button" onClick={() => setAnalyzing(true)} title="Analyze position (A)" aria-keyshortcuts="a">
              Analyze position <kbd>A</kbd>
            </button>
            <button type="button" onClick={() => setPly(0)} disabled={!ply} title="Start (Home)">⏮</button>
            <MoveStepButton type="button" onStep={() => setPly(ply - 1)} disabled={!ply} title="Previous move (←)">◀</MoveStepButton>
            <MoveStepButton type="button" onStep={() => advance()} disabled={atEnd} title="Next move (→)" repeat={!branch}>▶</MoveStepButton>
            <button type="button" className="primary" onClick={forward} title="Continue (Space)" aria-keyshortcuts="Space">
              {atEnd ? index === lines.length - 1 ? 'Finish reading' : 'Next line' : 'Next move'} <kbd>Space</kbd>
            </button>
            <button type="button" onClick={() => setPly(line.line.length)} disabled={atEnd} title="End (End)">⏭</button>
          </div>
        </div>
      </div>
      <aside className="trainer__side"><section className="panel">
        <div className="course-head"><h2>Reading</h2>
          {onTrain && <button type="button" onClick={train} title={`${trainingLabel} (T)`} aria-keyshortcuts="t">
            {trainingLabel} <kbd>T</kbd>
          </button>}
          <button type="button" onClick={onExit} title={`${resumeTraining ? 'Back to training' : 'Back to course'} (Esc)`} aria-keyshortcuts="Escape">Finish</button>
        </div>
        <p className="muted">{chapter?.name} · Line {index + 1} of {lines.length}. Read at your own pace; training progress stays as it is.</p>
        <div className="card card--info course-reader__note">
          <h3>{node ? `${node.moveNumber ?? Math.ceil(ply / 2)}${node.side === 'w' ? '.' : '…'} ${node.san}${node.suffix ?? ''}` : 'Start reading'}</h3>
          <p>{comment ? expanded ? comment : brief : node ? 'No explanation for this move in the PGN.' : 'Press Space to read the first move and its explanation.'}</p>
          {brief !== comment && <button type="button" onClick={() => setExpanded(!expanded)} title="Expand or shorten explanation (C)">{expanded ? 'Show less' : 'Read full explanation'}</button>}
        </div>
        {branch && <section className="course-variations" aria-label="Choose variation">
          <div className="course-variations__head"><h3>Variations</h3><span>{continuations.length} continuations</span></div>
          <div ref={variationList} className="course-variations__list" role="listbox" aria-label="Continuations"
            tabIndex={0} aria-activedescendant={`course-variation-${choice}`}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.repeat) { event.preventDefault(); advance(); }
            }}>
            {continuations.map((move, i) => <div key={move.id} id={`course-variation-${i}`}
              role="option" aria-selected={i === choice} className={`course-variations__option${i === choice ? ' is-selected' : ''}`}
              onClick={() => advance(i)}>
              <span className="course-variations__moves">{readingPath([move]).slice(0, 5).map((node, n) =>
                `${node.side === 'w' ? `${node.moveNumber ?? Math.ceil(node.ply / 2)}.` : n === 0 ? `${node.moveNumber ?? Math.ceil(node.ply / 2)}…` : ''}${node.san}${node.suffix ?? ''}`).join(' ')}</span>
              <span className="course-variations__label">{i === 0 ? 'Main line' : move.dubious ? 'Marked dubious' : 'Variation'}</span>
            </div>)}
          </div>
          <p><strong>↑ ↓</strong> choose <span>·</span> <strong>→</strong> play <span>·</span> Main line selected by default</p>
        </section>}
        {branchPly >= 0 && <button type="button" className="course-reader__return" onClick={() => setPly(branchPly)}>↩ Back to branch</button>}
        <MoveTrail trail={line.line} cursor={ply} startIndex={0} onSelect={setPly} />
        <div className="course-card__actions">
          <button type="button" disabled={index === 0} onClick={() => pick(index - 1)} title="Previous line ([)">Previous line</button>
          <button type="button" disabled={index === lines.length - 1} onClick={() => pick(index + 1)} title="Next line (])">Next line</button>
        </div>
        <details className="course-shortcuts"><summary>Keyboard shortcuts</summary><p>A: analyze position · {onTrain && `T: ${trainingLabel.toLowerCase()} · `}Space: continue · ← →: previous / next move · ↑ ↓: choose variation · Home / End: first / last position · [ / ]: previous / next game · C: expand explanation · Esc: finish. Tab and Enter activate any button.</p></details>
      </section></aside>
    </div>
  );
}
