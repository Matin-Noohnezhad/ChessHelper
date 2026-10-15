import { createContext, useContext, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Chess, START_FEN } from '@coh/chess-core';
import type { CourseNode } from '@coh/course';
import { explanationLines } from '../explanationLines.js';
import type { ExplanationLine } from '../explanationLines.js';
import { courseShortcutBlocked } from '../courseShortcuts.js';
import { MoveStepButton } from './MoveStepButton.js';
import './CourseReader.css';

export interface ExplanationPreviewState {
  sourceId: string;
  lines: ExplanationLine[];
  lineIndex: number;
  ply: number;
}
export const ExplanationContext = createContext<{
  startFen?: string;
  path: CourseNode[];
  roots?: CourseNode[];
  preview: ExplanationPreviewState | null;
  explore: (preview: ExplanationPreviewState) => void;
} | null>(null);

function commentPath(roots: CourseNode[], text: string): CourseNode[] | undefined {
  for (const node of roots) {
    if (node.comment === text) return [node];
    const rest = commentPath(node.children, text);
    if (rest) return [node, ...rest];
  }
  return undefined;
}

/** Preserve the author's prose exactly; only verified references become buttons. */
export function CourseExplanation({ text, sourceComment = text, limit, selectable = false }: {
  text: string;
  sourceComment?: string;
  limit?: number;
  selectable?: boolean;
}) {
  const context = useContext(ExplanationContext);
  const sourceId = useId();
  const prose = useRef<HTMLSpanElement>(null);
  const lines = useMemo(() => {
    if (!context) return [];
    // Prefer this game's path: merged chapters may repeat the same note in other games.
    const noteAt = context.path.findIndex((node) => node.comment === sourceComment);
    const path = noteAt >= 0 ? context.path.slice(0, noteAt + 1)
      : context.roots ? commentPath(context.roots, sourceComment) ?? context.path : context.path;
    return explanationLines(text, context.startFen ?? START_FEN, path);
  }, [text, sourceComment, context?.startFen, context?.path, context?.roots]);
  const active = context?.preview?.sourceId === sourceId ? context.preview : null;
  const explore = (lineIndex: number, ply = 1) => context?.explore({ sourceId, lines, lineIndex, ply });
  // W/E also start exploration directly from the displayed explanation.
  useEffect(() => {
    if (!lines.length || context?.preview) return;
    const onKey = (event: KeyboardEvent) => {
      if (courseShortcutBlocked(event)) return;
      const key = event.key.toLowerCase();
      if (key !== 'w' && key !== 'e') return;
      event.preventDefault();
      explore(key === 'w' ? lines.length - 1 : 0);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
  useEffect(() => {
    if (active) prose.current?.querySelector('[aria-current="step"]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [active?.lineIndex, active?.ply]);
  const end = !active && limit && text.length > limit ? text.slice(0, limit).replace(/\s+\S*$/, '').length : text.length;
  const parts: ReactNode[] = [];
  let cursor = 0;
  for (const [lineIndex, line] of lines.entries()) for (const [i, move] of line.moves.entries()) {
    if (move.end > end) continue;
    parts.push(text.slice(cursor, move.start));
    parts.push(<button type="button" className={`course-explanation__move${active?.lineIndex === lineIndex ? ' is-active-line' : ''}`} key={move.start}
      aria-current={active?.lineIndex === lineIndex && active.ply === i + 1 ? 'step' : undefined}
      title={`Explore ${move.label} on the board`} onClick={() => explore(lineIndex, i + 1)}>
      {text.slice(move.start, move.end)}
    </button>);
    cursor = move.end;
  }
  parts.push(text.slice(cursor, end), end < text.length ? '…' : '');
  return <><span className="course-explanation" ref={prose}>{parts}</span>
    {lines.length > 0 && <span className="course-explanation__help">Click moves to view them here · W / E: previous / next line · ← →: step · Q: course position</span>}{selectable && lines.length > 0 &&
    <label className="course-explanation__select">Lines in this explanation
      <select value={active?.lineIndex ?? ""} onChange={(event) => {
        const index = Number(event.target.value);
        if (lines[index]) explore(index);
      }}>
        <option value="" disabled>Choose a line to explore…</option>
        {lines.map((line, i) => <option key={i} value={i}>{line.moves.map((move) => move.label).join(' ')}</option>)}
      </select>
    </label>}</>;
}

/** A board detour that leaves the surrounding course and explanation mounted. */
export function useExplanationPreview(enabled = true) {
  const [preview, setPreview] = useState<ExplanationPreviewState | null>(null);
  const line = preview?.lines[preview.lineIndex];
  const move = line?.moves[(preview?.ply ?? 0) - 1];
  const game = useMemo(() => line ? new Chess(move?.fen ?? line.startFen) : null, [line, move]);
  const step = (value: number) => setPreview((current) => current ? { ...current,
    ply: Math.max(0, Math.min(current.lines[current.lineIndex]!.moves.length, value)) } : null);
  const jump = (direction: number) => setPreview((current) => current ? { ...current,
    lineIndex: (current.lineIndex + direction + current.lines.length) % current.lines.length, ply: 1 } : null);
  useEffect(() => {
    if (!enabled || !preview || !line) return;
    const onKey = (event: KeyboardEvent) => {
      if (courseShortcutBlocked(event)) return;
      const key = event.key.toLowerCase();
      if (key === 'arrowleft') step(preview.ply - 1);
      else if (key === 'arrowright' || key === ' ') step(preview.ply + 1);
      else if (key === 'home') step(0);
      else if (key === 'end') step(line.moves.length);
      else if (key === 'w') jump(-1);
      else if (key === 'e') jump(1);
      else if (key === 'q') setPreview(null);
      else return;
      event.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
  return { preview, setPreview, line, move, game, step, jump };
}

export function ExplanationControls({ exploration }: { exploration: ReturnType<typeof useExplanationPreview> }) {
  const { preview, setPreview, line, move, step, jump } = exploration;
  if (!preview || !line) return null;
  return <div className="board-bar course-explanation__controls">
    <span className="status">Explanation · {move?.label ?? 'Before the line'} · {preview.ply} / {line.moves.length}</span>
    <div className="nav">
      <MoveStepButton onStep={() => step(preview.ply - 1)} disabled={!preview.ply} title="Previous explanation move (←)">◀</MoveStepButton>
      <MoveStepButton onStep={() => step(preview.ply + 1)} disabled={preview.ply === line.moves.length} title="Next explanation move (→)">▶</MoveStepButton>
      <button type="button" onClick={() => jump(-1)} disabled={preview.lines.length < 2}
        title="Previous explanation line (W)" aria-keyshortcuts="w">Previous line <kbd>W</kbd></button>
      <button type="button" onClick={() => jump(1)} disabled={preview.lines.length < 2}
        title="Next explanation line (E)" aria-keyshortcuts="e">Next line <kbd>E</kbd></button>
      <button type="button" onClick={() => setPreview(null)} title="Back to course position (Q)" aria-keyshortcuts="q">
        Back to course position <kbd>Q</kbd>
      </button>
    </div>
  </div>;
}
