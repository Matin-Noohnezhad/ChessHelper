import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { buildCourse, courseOutline, trainableMoves } from '@coh/course';
import { CourseOutline } from '../components/CourseOutline.js';
import { CoursePreview } from '../components/CourseImport.js';
import { CourseReader } from '../components/CourseReader.js';
import { entryFrom } from '../hooks/useCourseLibrary.js';
import { groupCourseSections } from '../courseSections.js';

const pgn = `[Event "?"]
[White "Introduction"]
[Black "Overview"]

1. e4 e5 *

[Event "?"]
[White "Main lines"]
[Black "Overview"]

1. d4 d5 *`;

describe('course sections', () => {
  it('shows sections above their subsections in the outline and preview', () => {
    const course = buildCourse(pgn, { fileName: 'Scotch Gambit.pgn' });
    const outline = courseOutline(course, {});
    expect(groupCourseSections(outline).map(({ section }) => section)).toEqual(['Introduction', 'Main lines']);
    const html = renderToStaticMarkup(<CourseOutline chapters={outline} onPickLine={() => {}} />);
    expect(html).toMatch(/aria-label="Introduction"[\s\S]*Overview[\s\S]*aria-label="Main lines"[\s\S]*Overview/);
    const preview = renderToStaticMarkup(<CoursePreview course={course} variations={2} moves={2}
      name={course.name} side="white" inferred onNameChange={() => {}} onSideChange={() => {}} onConfirm={() => {}} />);
    expect(preview).toContain('value="Scotch Gambit"');
    expect(preview).toContain('<strong>Introduction</strong><ul><li>Overview</li></ul>');
    expect(preview).toContain('<strong>Main lines</strong><ul><li>Overview</li></ul>');
  });

  it('separates reading selectors and limits subsections to the selected section', () => {
    const entry = entryFrom({ id: 'section-test', name: '?', pgn, side: 'white', importedAt: 0 }, {});
    expect(entry.course.name).not.toBe('?');
    const html = renderToStaticMarkup(<CourseReader entry={entry} onExit={() => {}} />);
    expect(html).toMatch(/id="reading-section"[^>]*>[\s\S]*Introduction[\s\S]*Main lines/);
    const subsections = html.match(/<select id="reading-chapter"[^>]*>(.*?)<\/select>/)![1]!;
    expect(subsections.match(/<option /g)).toHaveLength(1);
    expect(subsections).toContain('Overview');
    expect(subsections).not.toContain('Main lines');
    expect(html).not.toContain('<optgroup');
    const otherChapter = entry.course.chapters[1]!;
    const linked = renderToStaticMarkup(<CourseReader entry={entry} chapterId={otherChapter.id} onExit={() => {}} />);
    expect(linked).toContain('<option value="1" selected="">Main lines</option>');
    expect(linked).toContain(`<option value="${otherChapter.id}" selected="">Overview</option>`);
  });
  it('rebuilds a cached course when its mapping changes and preserves progress', () => {
    const stored = { id: 'mapping-test', name: 'Test', pgn, side: 'white' as const, importedAt: 0 };
    const initial = entryFrom(stored, {});
    const key = [...trainableMoves(initial.course.chapters, 'white').keys()][0]!;
    const progress = { [key]: { key, level: 2, dueAt: 10, lastSeenAt: 0, correct: 2, wrong: 0 } };
    const swapped = entryFrom({ ...stored, sectionHeader: 'Black' }, progress);
    expect(swapped.course.chapters.map(({ section, name }) => [section, name])).toEqual([
      ['Overview', 'Introduction'], ['Overview', 'Main lines'],
    ]);
    expect(swapped.progress).toEqual(progress);
    expect(swapped.stats.seen).toBe(1);
    const restored = entryFrom({ ...stored, sectionHeader: 'White' }, progress);
    expect(restored.course.chapters).toEqual(initial.course.chapters);
    expect(restored.stats.seen).toBe(1);
  });

});
