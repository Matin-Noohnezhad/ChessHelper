import { describe, expect, it } from 'vitest';
import { buildCourse } from '../import.js';
import { recordAnswer, blankProgress } from '../scheduler.js';
import { chapterStats, courseStats, nextDueAt } from '../stats.js';
import { moveKey, trainableMoves } from '../tree.js';
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

describe('moveKey', () => {
  it('is the position plus the move, so a path cannot change it', () => {
    const e4 = course.chapters[0]!.roots[0]!;
    expect(moveKey(e4)).toBe(`${e4.fromKey}|e4`);
  });
});
