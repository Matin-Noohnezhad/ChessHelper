import { describe, expect, it } from 'vitest';
import { buildCourse } from '../import.js';
import { buildSession } from '../session.js';
import { courseOutline, courseStats, nextDueAt } from '../stats.js';
import { allVariations, moveKey, progressKeys, readingLinesOf, trainableMoves, variationsOf } from '../tree.js';
import { CourseTrainer } from '../trainer.js';
import type { CourseProgress } from '../types.js';

// Same subsection, opposite source-game main lines, nested notes, and a
// shorter third game whose endpoint is internal to the merged chapter tree.
const pgn = `[White "Section"]
[Black "Subsection"]
1. e4 {First game} e5 (1... c5 2. Nf3 d6) 2. Nf3 (2. Bc4 Nc6) Nc6 *

[White "Section"]
[Black "Subsection"]
1. e4 {Second game} c5 (1... e5 2. Nf3 Nc6) 2. Nc3 *

[White "Section"]
[Black "Subsection"]
1. e4 {Short game} e5 *

[White "Section"]
[Black "Empty subsection"]
{Text only} *`;
const course = buildCourse(pgn, { side: 'white' });
const lines = readingLinesOf(course.chapters[0]!);
const sans = (line: readonly { san: string }[]) => line.map((node) => node.san).join(' ');

describe('main lines shared by reading and training', () => {
  it('lists one main line per source game and keeps each game’s own order and notes', () => {
    const outline = courseOutline(course, {});
    expect(outline[0]!.variations.map((line) => sans(line.line))).toEqual([
      'e4 e5 Nf3 Nc6', 'e4 c5 Nc3', 'e4 e5',
    ]);
    expect(allVariations(course).map((line) => line.id)).toEqual(lines.map((line) => line.id));
    expect(outline[0]!.variations.map((line) => line.line[0]!.comment))
      .toEqual(['First game', 'Second game', 'Short game']);
    expect(outline).toHaveLength(1);
    expect(courseStats(course, {}).variations).toBe(3);
    // The annotated branches remain available to the reader.
    expect(variationsOf(course.chapters[0]!, 'white').map((line) => sans(line.line)))
      .toContain('e4 e5 Bc4 Nc6');
  });

  it.each(['learn', 'review', 'random'] as const)('drills only main-line moves in %s', (mode) => {
    const progress: CourseProgress = {};
    // Include old saved progress for sidelines to verify it cannot revive them.
    for (const variation of variationsOf(course.chapters[0]!, 'white')) {
      for (const node of variation.line) {
        const key = moveKey(node);
        progress[key] = { key, level: 2, dueAt: 0, lastSeenAt: 0, correct: 2, wrong: 0 };
      }
    }
    const plan = buildSession(course, mode === 'learn' ? {} : progress, {
      mode, now: 100, lineIds: lines.map((line) => line.id),
    });
    expect(plan.tasks.length).toBeGreaterThan(0);
    for (const task of plan.tasks) {
      const source = lines.find((line) => line.id === task.lineId.split('@')[0]);
      expect(source).toBeDefined();
      expect(sans(task.line)).toBe(sans(source!.line));
    }
    const trainer = new CourseTrainer({ course, plan, now: () => 100 });
    for (const task of plan.tasks) {
      trainer.skipWatch();
      for (const index of task.quiz) expect(trainer.submit(task.line[index]!.san).status).toBe('correct');
      trainer.nextTask();
    }
  });

  it('counts and resets only the main-line moves, preserving their saved progress', () => {
    const keys = new Set(lines.flatMap((line) => line.line.filter((node) => node.side === 'w').map(moveKey)));
    expect(new Set(trainableMoves(course.chapters, 'white').keys())).toEqual(keys);
    expect(progressKeys(course)).toEqual(keys);
    expect(progressKeys(course, { lineIds: [lines[2]!.id] })).toEqual(new Set([moveKey(lines[2]!.line[0]!)]));
    const progress = Object.fromEntries([...keys].map((key) => [key,
      { key, level: 3, dueAt: 200, lastSeenAt: 0, correct: 3, wrong: 0 },
    ]));
    expect(courseStats(course, progress, 100).learned).toBe(keys.size);
    expect(courseOutline(course, progress, 100)[0]!.completion).toBe(1);
    expect(nextDueAt(course, progress)).toBe(200);
    expect(buildSession(course, progress, { mode: 'learn', now: 100 }).tasks).toEqual([]);
  });
});
