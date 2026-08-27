import { useEffect, useState } from 'react';
import type { CourseNode, OutlineChapter } from '@coh/course';

/**
 * The course as Chessable draws it: chapters down the side, each with a
 * completion figure, and under it every line as a row with a ring that fills as
 * you learn it. Clicking a line is how you pick what to drill next.
 *
 * Two shapes. `full` is the one on the course page — every chapter open, its own
 * Learn and Review buttons, lines allowed to wrap. `rail` is the strip beside
 * the board during a session: dense, one line per row, chapters collapsed to the
 * one you are working in, the line you are on picked out, and no chapter-level
 * actions because you are already in one.
 */
interface CourseOutlineProps {
  chapters: OutlineChapter[];
  /** The line currently on the board, so the rail can point at it. */
  activeLineId?: string | null;
  onPickLine: (lineId: string) => void;
  /** Chapter-level Learn / Review. Absent in the rail. */
  onChapter?: (mode: 'learn' | 'review', chapterId: string) => void;
  variant?: 'full' | 'rail';
}

export function CourseOutline({
  chapters,
  activeLineId,
  onPickLine,
  onChapter,
  variant = 'full',
}: CourseOutlineProps) {
  const activeChapter = chapters.find((chapter) =>
    chapter.variations.some((v) => v.id === activeLineId),
  )?.chapterId;

  // In the rail the sections collapse; a manual toggle sticks, but jumping to a
  // line always opens the chapter it lives in.
  const [open, setOpen] = useState<Record<string, boolean>>({});
  useEffect(() => {
    if (activeChapter) setOpen((current) => ({ ...current, [activeChapter]: true }));
  }, [activeChapter]);

  const isOpen = (chapter: OutlineChapter): boolean => {
    if (variant === 'full' || chapters.length === 1) return true;
    return open[chapter.chapterId] ?? chapter.chapterId === activeChapter;
  };

  return (
    <div className={`course-outline course-outline--${variant}`}>
      {chapters.map((chapter) => {
        return (
          <details
            key={chapter.chapterId}
            className="course-outline__chapter"
            open={isOpen(chapter)}
            onToggle={(event) =>
              setOpen((current) => ({
                ...current,
                [chapter.chapterId]: (event.target as HTMLDetailsElement).open,
              }))
            }
          >
            <summary className="course-outline__summary">
              <span className="course-outline__name">
                <span>{chapter.name}</span>
              </span>
              <span className="course-outline__pct">{Math.round(chapter.completion * 100)}%</span>
              <span className="bar course-outline__bar">
                <span className="bar__fill" style={{ width: `${chapter.completion * 100}%` }} />
              </span>
            </summary>

            {onChapter && (
              <div className="course-outline__chapter-actions">
                <button
                  type="button"
                  onClick={() => onChapter('learn', chapter.chapterId)}
                  disabled={chapter.seen >= chapter.moves}
                >
                  Learn
                </button>
                <button
                  type="button"
                  onClick={() => onChapter('review', chapter.chapterId)}
                  disabled={chapter.due === 0 || chapter.seen === 0}
                >
                  Review
                </button>
                <span className="muted">
                  {chapter.variations.length} line{chapter.variations.length === 1 ? '' : 's'}
                  {chapter.due > 0 ? ` · ${chapter.due} due` : ''}
                </span>
              </div>
            )}

            <ul className="course-outline__lines">
              {chapter.variations.map((variation) => {
                const label = sanLine(variation.line);
                return (
                  <li key={variation.id}>
                    <button
                      type="button"
                      className={[
                        'course-outline__line',
                        `is-${variation.state}`,
                        variation.id === activeLineId ? 'is-active' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => onPickLine(variation.id)}
                      title={label}
                    >
                      <ProgressRing
                        value={variation.completion}
                        done={variation.state === 'learned'}
                        started={variation.state !== 'new'}
                      />
                      <span className="course-outline__san">{label}</span>
                      {variation.due > 0 && (
                        <span className="course-outline__due" title={`${variation.due} due now`} />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </details>
        );
      })}
    </div>
  );
}

/** `1.e4 c5 2.Nf3 d6` — from the nodes, so a chapter that starts mid-game still numbers right. */
function sanLine(line: readonly CourseNode[]): string {
  const out: string[] = [];
  line.forEach((node, index) => {
    const number = Math.ceil(node.ply / 2);
    if (node.side === 'w') out.push(`${number}.${node.san}`);
    else if (index === 0) out.push(`${number}...${node.san}`);
    else out.push(node.san);
  });
  return out.join(' ');
}

interface ProgressRingProps {
  /** 0..1 — the share of the line's moves you have worked through. */
  value: number;
  /** Every move in the line has come back after a night: a solid dot with a tick. */
  done: boolean;
  /** At least one move met: a ring rather than an empty circle. */
  started: boolean;
}

/**
 * The dot next to a line. Empty for a line you have not touched, a part-filled
 * arc for one still settling, a solid ticked disc for one you know.
 */
function ProgressRing({ value, done, started }: ProgressRingProps) {
  const radius = 6;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.max(0, Math.min(1, value)));

  return (
    <svg className="ring" viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
      <circle className="ring__track" cx="8" cy="8" r={radius} fill="none" strokeWidth="2" />
      {done ? (
        <>
          <circle className="ring__disc" cx="8" cy="8" r={radius + 1} />
          <path
            className="ring__check"
            d="M4.7 8.2l2.1 2.1 4.3-4.6"
            fill="none"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        started && (
          <circle
            className="ring__fill"
            cx="8"
            cy="8"
            r={radius}
            fill="none"
            strokeWidth="2"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 8 8)"
          />
        )
      )}
    </svg>
  );
}
