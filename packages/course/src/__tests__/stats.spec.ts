import { describe, expect, it } from 'vitest';
import { buildCourse } from '../import.js';
import { recordAnswer, blankProgress } from '../scheduler.js';
import { chapterStats, courseOutline, courseStats, nextDueAt } from '../stats.js';
import { moveKey, trainableMoves, variationsOf } from '../tree.js';
import type { CourseProgress } from '../types.js';
import { COURSE_PGN } from './fixture.js';

const NOW = 1_700_000_000_000;
const HOUR = 60 * 60_000;
const course = buildCourse(COURSE_PGN);

describe('course statistics', () => {
  it('counts an untouched course as all still to do', () => {
    const stats = courseStats(course, {}, NOW);
    expect(stats.total).toBe(trainableMoves(course.chapters, course.side).size);
    expect(stats.seen).toBe(0);
    expect(stats.learned).toBe(0);
    // Nothing learned means everything is due; that is the learn queue.
    expect(stats.due).toBe(stats.total);
    expect(stats.levels[0]).toBe(stats.total);
  });

  it('counts in moves rather than variations', () => {
    const stats = courseStats(course, {}, NOW);
    expect(stats.variations).toBe(5);
    expect(stats.total).toBeGreaterThan(stats.variations);
  });

  it('follows a move up the ladder', () => {
    const moves = trainableMoves(course.chapters, course.side);
    const key = [...moves.keys()][0]!;
    let entry = blankProgress(key, NOW);
    for (let i = 0; i < 3; i++) entry = recordAnswer(entry, { correct: true, now: NOW });
    const progress: CourseProgress = { [key]: entry };

    const stats = courseStats(course, progress, NOW);
    expect(stats.seen).toBe(1);
    expect(stats.learned).toBe(1);
    expect(stats.levels[3]).toBe(1);
    expect(stats.due).toBe(stats.total - 1);
  });

  it('reports each chapter on its own terms', () => {
    const stats = courseStats(course, {}, NOW);
    expect(stats.chapters.map((chapter) => chapter.name)).toEqual([
      'Open Sicilian',
      'Move Orders',
    ]);
    expect(stats.chapters[0]!.variations).toBe(4);
    expect(stats.chapters[1]!.variations).toBe(1);
    // The second chapter is entirely move orders into the first, so its moves
    // are counted twice across the chapters and once for the course.
    const summed = stats.chapters.reduce((sum, chapter) => sum + chapter.total, 0);
    expect(summed).toBeGreaterThan(stats.total);
  });

  it('reads a chapter without the rest of the course', () => {
    const stats = chapterStats(course.chapters[1]!, course.side, {}, NOW);
    expect(stats.chapterId).toBe(course.chapters[1]!.id);
    expect(stats.variations).toBe(1);
  });

  it('says when the next thing falls due, and nothing before anything is learned', () => {
    expect(nextDueAt(course, {})).toBeNull();
    const moves = trainableMoves(course.chapters, course.side);
    const keys = [...moves.keys()];
    const progress: CourseProgress = {
      [keys[0]!]: { ...blankProgress(keys[0]!, NOW), level: 2, dueAt: NOW + 5 * HOUR },
      [keys[1]!]: { ...blankProgress(keys[1]!, NOW), level: 4, dueAt: NOW + 2 * HOUR },
    };
    expect(nextDueAt(course, progress)).toBe(NOW + 2 * HOUR);
  });

  it('ignores a never-learned move when asking what comes next', () => {
    const keys = [...trainableMoves(course.chapters, course.side).keys()];
    const progress: CourseProgress = {
      [keys[0]!]: blankProgress(keys[0]!, NOW),
      [keys[1]!]: { ...blankProgress(keys[1]!, NOW), level: 1, dueAt: NOW + HOUR },
    };
    expect(nextDueAt(course, progress)).toBe(NOW + HOUR);
  });
});

describe('the course outline', () => {
  it('lists every chapter with its lines, ids matching the tree', () => {
    const outline = courseOutline(course, {}, NOW);
    expect(outline.map((chapter) => chapter.name)).toEqual(['Open Sicilian', 'Move Orders']);
    expect(outline[0]!.variations).toHaveLength(4);
    expect(outline[1]!.variations).toHaveLength(1);

    const treeIds = variationsOf(course.chapters[0]!, 'white').map((v) => v.id);
    expect(outline[0]!.variations.map((v) => v.id)).toEqual(treeIds);
  });

  it('calls an untouched course all new, nothing filled, nothing due', () => {
    const outline = courseOutline(course, {}, NOW);
    for (const chapter of outline) {
      expect(chapter.completion).toBe(0);
      for (const variation of chapter.variations) {
        expect(variation.state).toBe('new');
        expect(variation.completion).toBe(0);
        expect(variation.moves).toBeGreaterThan(0);
        // Never-met moves are unstarted, not "due" — that is the empty ring's job.
        expect(variation.due).toBe(0);
      }
    }
  });

  it('counts a line as due only once a move it taught has come round again', () => {
    const najdorf = variationsOf(course.chapters[0]!, 'white')[0]!;
    const first = moveKey(najdorf.line.find((node) => node.side === 'w')!);
    const overdue: CourseProgress = {
      [first]: { key: first, level: 2, dueAt: NOW - HOUR, lastSeenAt: NOW - 100 * HOUR, correct: 2, wrong: 0 },
    };
    const variation = courseOutline(course, overdue, NOW)[0]!.variations[0]!;
    expect(variation.due).toBe(1);
    expect(variation.state).toBe('started');
  });

  it('fills a line as its moves climb, and calls it learned once every one has', () => {
    const najdorf = variationsOf(course.chapters[0]!, 'white')[0]!;
    const keys = najdorf.line
      .filter((node) => node.side === 'w')
      .map((node) => moveKey(node));

    // One move a rung up: the line has started but is a long way from filled.
    const partial: CourseProgress = {
      [keys[0]!]: { key: keys[0]!, level: 1, dueAt: NOW + HOUR, lastSeenAt: NOW, correct: 1, wrong: 0 },
    };
    const started = courseOutline(course, partial, NOW)[0]!.variations[0]!;
    expect(started.state).toBe('started');
    expect(started.completion).toBeGreaterThan(0);
    expect(started.completion).toBeLessThan(1);

    // Every move of it past the first day of the ladder: filled.
    const learned: CourseProgress = {};
    for (const key of keys) {
      learned[key] = { key, level: 4, dueAt: NOW + 100 * HOUR, lastSeenAt: NOW, correct: 4, wrong: 0 };
    }
    const done = courseOutline(course, learned, NOW)[0]!.variations[0]!;
    expect(done.state).toBe('learned');
    expect(done.completion).toBe(1);
  });
});

describe('moveKey', () => {
  it('is the position plus the move, so a path cannot change it', () => {
    const e4 = course.chapters[0]!.roots[0]!;
    expect(moveKey(e4)).toBe(`${e4.fromKey}|e4`);
  });
});
