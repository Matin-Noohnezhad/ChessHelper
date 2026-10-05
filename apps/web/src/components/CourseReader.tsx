import { useEffect, useMemo, useState } from 'react';
import { Chess, START_FEN } from '@coh/chess-core';
import { variationsOf } from '@coh/course';
import type { LibraryEntry } from '../hooks/useCourseLibrary.js';
import { courseShortcutBlocked } from '../courseShortcuts.js';
import { Board } from './Board.js';
import type { AnnotationThickness } from './Board.js';
import { MoveTrail } from './CourseSession.js';
import { CourseAnalysis } from './CourseAnalysis.js';

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
    ...chapter, lines: variationsOf(chapter, entry.course.side, true),
  })), [entry.course]);
  const lines = useMemo(() => chapters.flatMap((chapter) => chapter.lines), [chapters]);
  const [index, setIndex] = useState(() => Math.max(0, lines.findIndex((line) =>
    lineId ? line.id === lineId || line.line.some((node) => `${line.chapterId}/${node.id}` === lineId)
      : line.chapterId === chapterId)));
  const [ply, setPly] = useState(() => Math.min(initialPly, lines[index]?.line.length ?? 0));
  const [expanded, setExpanded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const line = lines[index];
  const chapter = chapters.find((item) => item.id === line?.chapterId);
  const trainingLine = useMemo(() => chapter
    ? variationsOf(chapter, entry.course.side).find((item) => item.id === line?.id ||
      item.line.every((node, index) => node.id === line?.line[index]?.id))
    : undefined, [chapter, entry.course.side, line]);
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

  const pick = (next: number) => {
    if (next < 0 || next >= lines.length) return;
    setIndex(next);
    setPly(0);
  };
  const forward = () => {
    if (line && ply < line.line.length) setPly(ply + 1);
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
      else if (key === 'arrowright') setPly((value) => Math.min(line?.line.length ?? 0, value + 1));
      else if (key === 'arrowleft') setPly((value) => Math.max(0, value - 1));
      else if (key === 'home' || key === 'arrowup') setPly(0);
      else if (key === 'end' || key === 'arrowdown') setPly(line?.line.length ?? 0);
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
        <label className="settings-row__label" htmlFor="reading-chapter">Chapter</label>
        <select id="reading-chapter" value={chapter?.id} onChange={(event) => pick(lines.findIndex((item) => item.chapterId === event.target.value))}>
          {chapters.map((item) => <option key={item.id} value={item.id} disabled={!item.lines.length}>{item.name}</option>)}
        </select>
        <ul className="course-outline__lines">
          {chapter?.lines.map((item, i) => <li key={item.id}>
            <button type="button" className={`course-outline__line${line.id === item.id ? ' is-active' : ''}`}
              aria-current={line.id === item.id ? 'true' : undefined} onClick={() => pick(lines.indexOf(item))}>
              <span className="course-outline__san">{i + 1}. {item.line.map((move) => move.san + (move.suffix ?? '')).join(' ')}</span>
            </button>
          </li>)}
        </ul>
      </aside>
      <div className="trainer__board">
        <Board game={game} orientation={entry.course.side} lastMove={lastMove} onMove={() => {}} interactive={false}
          hintArrows={node?.shapes?.arrows ?? []} hintCircles={node?.shapes?.circles ?? []}
          annotationThickness={annotationThickness} animateMoves />
        <div className="board-bar">
          <span className="status">{ply === 0 ? 'Starting position' : `${node?.moveNumber ?? Math.ceil(ply / 2)}${node?.side === 'w' ? '.' : '…'} ${node?.san}`} · {ply} / {line.line.length}</span>
          <div className="nav">
            <button type="button" onClick={() => setAnalyzing(true)} title="Analyze position (A)" aria-keyshortcuts="a">
              Analyze position <kbd>A</kbd>
            </button>
            <button type="button" onClick={() => setPly(0)} disabled={!ply} title="Start (Home)">⏮</button>
            <button type="button" onClick={() => setPly(ply - 1)} disabled={!ply} title="Previous move (←)">◀</button>
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
        <MoveTrail trail={line.line} cursor={ply} startIndex={0} onSelect={setPly} />
        <div className="course-card__actions">
          <button type="button" disabled={index === 0} onClick={() => pick(index - 1)} title="Previous line ([)">Previous line</button>
          <button type="button" disabled={index === lines.length - 1} onClick={() => pick(index + 1)} title="Next line (])">Next line</button>
        </div>
        <details className="course-shortcuts"><summary>Keyboard shortcuts</summary><p>A: analyze position · {onTrain && `T: ${trainingLabel.toLowerCase()} · `}Space: continue · ← →: previous / next move · Home / End: first / last position · [ / ]: previous / next line · C: expand explanation · Esc: finish. Tab and Enter activate any button.</p></details>
      </section></aside>
    </div>
  );
}
