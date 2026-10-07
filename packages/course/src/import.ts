/**
 * Reading a course out of a PGN.
 *
 * Nothing here re-implements PGN: {@link parseAnnotatedPgnAll} already descends
 * into sidelines and keeps the comments, and a course *is* its sidelines — the
 * main line of a repertoire chapter is one path through it and the teaching is
 * spread over all of them.
 *
 * Two passes. The first folds the file's lines into a tree, merging games that
 * share a chapter so a chapter split over several games reads as one. The second
 * replays that tree from the chapter's start position, which is what turns a
 * string of notation into moves with a side, a ply and a position key — and
 * which quietly throws out anything that will not replay, rather than letting a
 * corrupt line poison the drill.
 */

import {
  Position,
  START_FEN,
  WHITE,
  loadFen,
  moveToSan,
  normalizeSan,
  parseAnnotatedPgnAll,
  resolveSan,
} from '@coh/chess-core';
import type { AnnotatedPgnGame, PgnMove } from '@coh/chess-core';
import type { Chapter, Course, CourseNode, CourseSide, ImportProblem, SectionHeader } from './types.js';

/** NAGs that mean "this move is a mistake": ?, ??, ?!. */
const DUBIOUS_NAGS = new Set([2, 4, 6]);

const isDubious = (move: PgnMove): boolean =>
  /\?/.test(move.suffix ?? '') || move.nags.some((nag) => DUBIOUS_NAGS.has(nag));

/** A move before it has been replayed: just what the file said about it. */
interface RawNode {
  san: string;
  comment?: string;
  shapes?: PgnMove['shapes'];
  nags: number[];
  suffix?: string;
  dubious: boolean;
  children: RawNode[];
}

/**
 * One line of movetext as a sibling list.
 *
 * PGN hangs a sideline off the move it *replaces*, so `1.e4 e5 (1...c5)` makes
 * c5 a sibling of e5 rather than a child. Everything after the first move is the
 * first move's continuation, which is what makes this recursive in two places.
 */
function convert(line: PgnMove[]): RawNode[] {
  const first = line[0];
  if (!first || first.nullMove) return [];

  const node: RawNode = {
    san: first.san,
    nags: first.nags,
    dubious: isDubious(first),
    children: convert(line.slice(1)),
  };
  if (first.comment) node.comment = first.comment;
  if (first.shapes) node.shapes = first.shapes;
  if (first.suffix) node.suffix = first.suffix;

  const siblings = [node];
  for (const variation of first.variations ?? []) siblings.push(...convert(variation));
  // Exporters sometimes repeat a move to attach another note or continuation.
  // Coalesce those occurrences at every depth before assigning tree IDs.
  const combined: RawNode[] = [];
  mergeSiblings(combined, siblings, true);
  return combined;
}

/** Folds one sibling list into another, matching on the move itself. */
function mergeSiblings(into: RawNode[], from: readonly RawNode[], combineNotes = false): void {
  for (const incoming of from) {
    const existing = into.find((node) => normalizeSan(node.san) === normalizeSan(incoming.san));
    if (!existing) {
      into.push(incoming);
      continue;
    }
    // The first source to say something about a move keeps the floor; a second
    // chapter repeating the position should not overwrite the prose that taught
    // it, but it may fill a gap the first left.
    if (!existing.comment && incoming.comment) existing.comment = incoming.comment;
    else if (combineNotes && incoming.comment && existing.comment !== incoming.comment)
      existing.comment += `\n\n${incoming.comment}`;
    if (combineNotes) {
      existing.nags = [...new Set([...existing.nags, ...incoming.nags])];
      if (existing.shapes && incoming.shapes) {
        existing.shapes = {
          arrows: [...existing.shapes.arrows, ...incoming.shapes.arrows].filter((shape, index, all) =>
            all.findIndex((item) => item.from === shape.from && item.to === shape.to && item.color === shape.color) === index),
          circles: [...existing.shapes.circles, ...incoming.shapes.circles].filter((shape, index, all) =>
            all.findIndex((item) => item.square === shape.square && item.color === shape.color) === index),
        };
      }
    }
    if (!existing.shapes && incoming.shapes) existing.shapes = incoming.shapes;
    if (!existing.suffix && incoming.suffix) existing.suffix = incoming.suffix;
    existing.dubious = existing.dubious || incoming.dubious;
    mergeSiblings(existing.children, incoming.children, combineNotes);
  }
}

/* ------------------------------------------------------------- naming --- */

/** PGN uses question marks for unknown metadata, not actual titles. */
function title(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed && !/^[?\s]+$/.test(trimmed) ? trimmed : undefined;
}

/** Lichess and most publishers write `[Event "Course name: Chapter name"]`. */
function splitEvent(event: string | undefined): { course?: string; chapter?: string } {
  event = title(event);
  if (!event) return {};
  const at = event.lastIndexOf(': ');
  if (at <= 0) return { course: event };
  return { course: event.slice(0, at).trim(), chapter: event.slice(at + 2).trim() };
}

/**
 * Chapter names, one per game.
 *
 * `[Event "Course: Chapter"]` is somebody naming a chapter, so it is believed
 * even when every game in the file names the same one — a chapter written as
 * five games is exactly what that looks like. The guessier schemes underneath
 * are not: a bare `[Event]` repeated verbatim on every game is a book title the
 * exporter stamped once, and calling that a chapter name would collapse the
 * whole course into one. Those have to earn it by telling the games apart.
 */
function chapterNames(games: readonly AnnotatedPgnGame[]): string[] {
  const schemes: { names: (string | undefined)[]; explicit: boolean }[] = [
    { names: games.map((game) => splitEvent(game.headers.Event).chapter), explicit: true },
    { names: games.map((game) => title(game.headers.Event)), explicit: false },
    { names: games.map((game) => title(game.headers.White)), explicit: false },
  ];

  for (const { names, explicit } of schemes) {
    if (names.some((name) => !title(name))) continue;
    if (!explicit && games.length > 1 && new Set(names).size === 1) continue;
    return names.map((name) => name!.trim());
  }
  return games.map((_, index) => `Chapter ${index + 1}`);
}

function courseName(games: readonly AnnotatedPgnGame[]): string {
  for (const game of games) {
    const { course } = splitEvent(game.headers.Event);
    if (title(course)) return title(course)!;
  }
  return title(games[0]?.headers.White) || 'Imported course';
}

const slug = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'course';

/* -------------------------------------------------------------- replay --- */

interface PlaceContext {
  pos: Position;
  chapter: string;
  path: string[];
  problems: ImportProblem[];
}

/**
 * Replays a raw sibling list from the position on the board, returning the
 * course nodes it produced. Moves are re-rendered in *our* SAN so a comparison
 * against what the board generates is an equality test, not a normalisation
 * problem; a move that will not replay is recorded and its whole subtree
 * dropped, since everything under it is unanchored.
 */
function place(context: PlaceContext, raw: readonly RawNode[], idPrefix: string): CourseNode[] {
  const { pos, path, problems } = context;
  const out: CourseNode[] = [];

  for (const entry of raw) {
    const move = resolveSan(pos, entry.san);
    if (!move) {
      problems.push({
        chapter: context.chapter,
        line: path.join(' '),
        san: entry.san,
        reason: 'illegal',
      });
      continue;
    }

    const san = moveToSan(pos, move);
    const node: CourseNode = {
      id: idPrefix ? `${idPrefix}.${out.length}` : String(out.length),
      san,
      ply: path.length + 1,
      moveNumber: pos.fullmoves,
      side: pos.turn === WHITE ? 'w' : 'b',
      fromKey: pos.key(),
      nags: entry.nags,
      children: [],
    };
    if (entry.comment) node.comment = entry.comment;
    if (entry.shapes) node.shapes = entry.shapes;
    if (entry.suffix) node.suffix = entry.suffix;
    if (entry.dubious) node.dubious = true;

    pos.make(move);
    path.push(san);
    node.children = place(context, entry.children, node.id);
    pos.unmake();
    path.pop();

    out.push(node);
  }

  return out;
}

/* ---------------------------------------------------------- inference --- */

/**
 * Which side the course is written for.
 *
 * A repertoire branches on the opponent and not on itself: a White course
 * answers 1...c5, 1...e5 and 1...e6, but plays one move against each. So the
 * side whose turn it is at the real branch points is the side you are *not*
 * training.
 *
 * "Real" is doing the work there. Authors scatter moves they mention and drop —
 * a transposition, a move order, something playable they did not want to write a
 * chapter on — all over their own side of the tree, and counting those would
 * make every course look like it branched on both sides. A branch you have to
 * be ready for is one the author built a line under, so only siblings with a
 * continuation of their own are counted.
 */
export function inferSide(chapters: readonly Chapter[]): CourseSide {
  const excess = { w: 0, b: 0 };

  const count = (siblings: readonly CourseNode[], side: 'w' | 'b'): void => {
    const real = siblings.filter((node) => node.children.length > 0).length;
    if (real > 1) excess[side] += real - 1;
  };

  for (const chapter of chapters) {
    // The root is a branch point too: a Black repertoire opens by listing every
    // first move White might play.
    count(chapter.roots, chapter.startFen?.includes(' b ') ? 'b' : 'w');
    const visit = (node: CourseNode): void => {
      if (node.children.length) count(node.children, node.children[0]!.side);
      for (const child of node.children) visit(child);
    };
    for (const root of chapter.roots) visit(root);
  }

  // A tie means the file gives us nothing to go on — most courses are White
  // repertoires, and White is also the side that moves first, so a wrong guess
  // is visible on the very first question.
  return excess.w > excess.b ? 'black' : 'white';
}

/* -------------------------------------------------------------- build --- */

export interface BuildCourseOptions {
  id?: string;
  name?: string;
  /** Uploaded filename, used as the default course title without its extension. */
  fileName?: string;
  /** White names sections by default; the other player header names subsections. */
  sectionHeader?: SectionHeader;
  /** Overrides {@link inferSide}. */
  side?: CourseSide;
}

/** Turns the text of a course PGN into a course ready to drill. */
export function buildCourse(pgnText: string, options: BuildCourseOptions = {}): Course {
  const games = parseAnnotatedPgnAll(pgnText);
  const names = chapterNames(games);
  const problems: ImportProblem[] = [];
  const sectionHeader = options.sectionHeader ?? 'White';
  const subsectionHeader = sectionHeader === 'White' ? 'Black' : 'White';

  // Games are folded into chapters before anything is replayed: two games of the
  // same chapter can share a position, and merging their notation is cheaper and
  // safer than merging two half-built trees of course nodes.
  interface Draft {
    name: string;
    section?: string;
    startFen?: string;
    roots: RawNode[];
    games: AnnotatedPgnGame[];
    headers: Record<string, string>;
  }
  const drafts: Draft[] = [];

  games.forEach((game, index) => {
    const section = title(game.headers[sectionHeader]);
    const name = section ? title(game.headers[subsectionHeader]) ?? `Chapter ${index + 1}` : names[index]!;
    const startFen = game.startFen && game.startFen !== START_FEN ? game.startFen : undefined;
    // A chapter is one starting position: two games under one name that begin
    // from different positions are two chapters, whatever the header says.
    let draft = drafts.find((entry) => entry.name === name && entry.section === section && entry.startFen === startFen);
    if (!draft) {
      draft = { name, roots: [], games: [], headers: game.headers };
      if (section) draft.section = section;
      if (startFen) draft.startFen = startFen;
      drafts.push(draft);
    }
    mergeSiblings(draft.roots, convert(game.moves));
    draft.games.push(game);
  });

  const chapters: Chapter[] = drafts.map((draft, index) => {
    const pos = new Position();
    loadFen(pos, draft.startFen ?? START_FEN);
    const context: PlaceContext = { pos, chapter: draft.name, path: [], problems };
    const chapter: Chapter = {
      id: `${index}-${slug(draft.name)}`,
      name: draft.name,
      roots: place(context, draft.roots, ''),
      headers: draft.headers,
    };
    if (draft.startFen) chapter.startFen = draft.startFen;
    if (draft.section) chapter.section = draft.section;
    // Keep each source game's order and annotations, but share node IDs with
    // the merged training tree so paused lessons can open the same position.
    const alignIds = (nodes: CourseNode[], merged: CourseNode[]): void => {
      for (const node of nodes) {
        const match = merged.find((item) => item.san === node.san)!;
        node.id = match.id;
        alignIds(node.children, match.children);
      }
    };
    chapter.games = draft.games.map((game, gameIndex) => {
      const roots = place({ ...context, problems: [] }, convert(game.moves), '');
      alignIds(roots, chapter.roots);
      return { id: `${chapter.id}/game-${gameIndex + 1}`, roots, headers: game.headers };
    });
    return chapter;
  });

  const fileTitle = title(options.fileName?.split(/[\\/]/).pop()?.replace(/\.pgn$/i, ''));
  const name = title(options.name) ?? fileTitle ?? courseName(games);
  const declared = games[0]?.headers.Orientation?.toLowerCase();
  const side: CourseSide =
    options.side ??
    (declared === 'white' || declared === 'black' ? declared : inferSide(chapters));

  return { id: options.id ?? slug(name), name, side, chapters, problems };
}
