/** Keep sections and their subsections in the order first seen in the PGN. */
export function groupCourseSections<T extends { section?: string }>(chapters: readonly T[]) {
  const groups = new Map<string | undefined, { section: string | undefined; chapters: T[] }>();
  for (const chapter of chapters) {
    let group = groups.get(chapter.section);
    if (!group) {
      group = { section: chapter.section, chapters: [] };
      groups.set(chapter.section, group);
    }
    group.chapters.push(chapter);
  }
  return [...groups.values()];
}
