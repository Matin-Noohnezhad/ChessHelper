import type { Chess, ColorName, PieceSymbol, SquareContents } from '@coh/chess-core';
import type { StrategicPlan } from './plans.js';

export interface PlanningQuestion {
  number: number;
  question: string;
  findings: StrategicPlan[];
  fallback: string;
}

export interface SevenQuestionReport {
  status: 'playing' | 'check' | 'finished';
  questions: PlanningQuestion[];
  /** Priorities to investigate, not a calculated move sequence. */
  priorities: StrategicPlan[];
}

const file = (p: SquareContents) => p.square.charCodeAt(0) - 97;
const rank = (p: SquareContents) => Number(p.square[1]);
const squares = (ps: SquareContents[]) => ps.map((p) => p.square).join(', ');
const values: Record<PieceSymbol, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
const idea = (id: string, title: string, reason: string, action: string): StrategicPlan => ({ id, title, reason, action });
const isolated = (ps: SquareContents[]) => ps.filter((p) => !ps.some((q) => Math.abs(file(p) - file(q)) === 1));
const passed = (ps: SquareContents[], opponents: SquareContents[], direction: number) => ps.filter((p) =>
  !opponents.some((q) => Math.abs(file(p) - file(q)) <= 1 && (rank(q) - rank(p)) * direction > 0));
const hasBishopPair = (ps: SquareContents[]) =>
  new Set(ps.filter((p) => p.type === 'b').map((p) => (file(p) + rank(p)) % 2)).size === 2;

/**
 * An original rule-based application of Avetik Grigoryan's 7Q framework.
 * Findings describe placement; actions remain candidates requiring calculation.
 * No turn-swapping or hypothetical legal moves: either color can inspect the
 * same position without mutating it or inventing the opponent's next move.
 */
export function analyzeSevenQuestions(chess: Chess, color: ColorName): SevenQuestionReport {
  if (chess.isGameOver()) return { status: 'finished', questions: [], priorities: [] };
  if (chess.isCheck()) return { status: 'check', questions: [], priorities: [] };

  const board = chess.board().filter((p): p is SquareContents => p !== null);
  const own = board.filter((p) => p.color === color);
  const enemy = board.filter((p) => p.color !== color);
  const pawns = own.filter((p) => p.type === 'p');
  const enemyPawns = enemy.filter((p) => p.type === 'p');
  const direction = color === 'w' ? 1 : -1;
  const pieces = board.filter((p) => !['p', 'k'].includes(p.type));
  const ownPassers = passed(pawns, enemyPawns, direction);
  const enemyPassers = passed(enemyPawns, pawns, -direction);
  const ownKing = own.find((p) => p.type === 'k')!;
  const enemyKing = enemy.find((p) => p.type === 'k')!;
  const centralKing = (p: SquareContents) => pieces.length >= 6 && ['d', 'e'].includes(p.square[0]!);
  const homeMinors = (ps: SquareContents[], c: ColorName) => ps.filter((p) =>
    (p.type === 'n' && ['b', 'g'].includes(p.square[0]!) || p.type === 'b' && ['c', 'f'].includes(p.square[0]!)) &&
    p.square[1] === (c === 'w' ? '1' : '8'));

  const q: PlanningQuestion[] = [
    { number: 1, question: 'Which opposing weaknesses can I target?', findings: [], fallback: 'No clear target was detected. Look for weak squares, loose pieces, or an exposed king before committing.' },
    { number: 2, question: 'Which problems in my position need attention?', findings: [], fallback: 'No specific repair was identified. Still check threats and undefended pieces; this is not a safety verdict.' },
    { number: 3, question: 'Which part of the board favors my play?', findings: [], fallback: 'No clear area stands out from pawn majorities or rook files. Compare piece activity and central control.' },
    { number: 4, question: 'Which piece needs a better role or square?', findings: [], fallback: 'No obvious repositioning candidate was detected. Compare each piece’s useful squares and defensive duties.' },
    { number: 5, question: 'Which exchanges would help me?', findings: [], fallback: 'No clear exchange preference was detected. Compare the resulting activity, pawn structure, and king safety before trading.' },
    { number: 6, question: 'What might my opponent try next?', findings: [], fallback: 'No specific opposing plan was detected. Look for checks, captures, threats, and improvements to their least active piece.' },
    { number: 7, question: 'How can I make further progress?', findings: [], fallback: 'No clear pawn advance stands out. If the first six answers do not yield a plan, improve coordination or prepare a second target without creating weaknesses.' },
  ];
  const add = (number: number, plan: StrategicPlan) => q[number - 1]!.findings.push(plan);

  for (const [ps, defending] of [[enemyPawns, false], [pawns, true]] as const) {
    const targets = isolated(ps);
    const doubled = ps.filter((p) => ps.some((other) => other !== p && file(other) === file(p)));
    if (targets.length) add(defending ? 2 : 1, idea(defending ? 'own-isolated' : 'enemy-isolated',
      defending ? 'Support isolated pawns' : 'Build pressure on isolated pawns',
      `${defending ? 'Your' : 'Enemy'} pawns on ${squares(targets)} have no friendly pawns on adjacent files.`,
      defending ? 'Keep them supported and consider a freeing advance or exchange if it can be prepared safely.'
        : 'Try to fix one in place, restrain its advance, and bring pieces to attack it.'));
    if (doubled.length) add(defending ? 2 : 1, idea(defending ? 'own-doubled' : 'enemy-doubled',
      defending ? 'Coordinate around doubled pawns' : 'Examine doubled pawns as targets',
      `${defending ? 'Your' : 'Enemy'} pawns on ${squares(doubled)} share files.`,
      defending ? 'Protect the less mobile pawn; consider an exchange that repairs the structure without conceding activity.'
        : 'Check whether one can be fixed and attacked; doubled pawns may also provide useful control.'));
  }

  if (centralKing(enemyKing)) add(1, idea('enemy-king', 'Consider central pressure',
    `The opposing king is on ${enemyKing.square} with substantial material remaining.`,
    'Bring pieces toward central lines; open them only if your development and king safety justify it.'));
  if (centralKing(ownKing)) {
    const rights = chess.fen().split(' ')[2] ?? '-';
    add(2, idea('own-king', 'Attend to king safety',
      `Your king is on ${ownKing.square} with substantial material remaining.`,
      (color === 'w' ? /[KQ]/ : /[kq]/).test(rights)
        ? 'Consider preparing castling toward the safer wing; first check the path and enemy attacks.'
        : 'Keep defenders nearby and avoid opening the center until your king can cope.'));
    add(6, idea('opponent-central-pressure', 'Watch for central lines opening',
      `Your king on ${ownKing.square} could become a target if the center opens.`,
      'Check the opponent’s central pawn breaks and piece pressure before starting play on a wing.'));
  }

  const sectors = [{ name: 'queenside', files: 'abc' }, { name: 'center', files: 'de' }, { name: 'kingside', files: 'fgh' }];
  for (const sector of sectors) {
    const us = pawns.filter((p) => sector.files.includes(p.square[0]!));
    const them = enemyPawns.filter((p) => sector.files.includes(p.square[0]!));
    if (us.length > them.length) add(3, idea(`majority-${sector.name}`, `Explore your ${sector.name} majority`,
      `You have ${us.length} pawns against ${them.length} in the ${sector.name} (${sector.files}-files).`,
      'Consider supporting this majority to gain space or create a passer; pawn count alone does not establish control of this area.'));
    if (them.length > us.length) add(6, idea(`opponent-majority-${sector.name}`, `Anticipate ${sector.name} expansion`,
      `The opponent has ${them.length} pawns against ${us.length} in the ${sector.name}.`,
      'They may try to mobilize this majority. Consider restraint or counterplay before it advances.'));
  }

  const filesFor = (ps: SquareContents[]) => [...'abcdefgh'].filter((f) => !ps.some((p) => p.square[0] === f));
  const rookFiles = filesFor(pawns);
  const enemyRookFiles = filesFor(enemyPawns);
  if (own.some((p) => p.type === 'r') && rookFiles.length) {
    const reason = `The ${rookFiles.join(', ')} files have no pawns of your color, and you have a rook.`;
    add(3, idea('rook-area', 'Investigate open and half-open files', reason,
      'Compare entry squares and targets along these files before choosing where to concentrate your rooks.'));
    const misplaced = own.filter((p) => p.type === 'r' && !rookFiles.includes(p.square[0]!));
    if (misplaced.length) add(4, idea('rook-improvement', 'Consider a rook transfer',
      `Rooks on ${squares(misplaced)} sit behind files containing your pawns; ${rookFiles.join(', ')} may offer alternatives.`,
      'Check whether a safe transfer improves pressure without abandoning a defensive job.'));
  }
  if (enemy.some((p) => p.type === 'r') && enemyRookFiles.length) add(6, idea('opponent-rooks', 'Watch the opponent’s rook routes',
    `The opponent has a rook and no pawns of their color on the ${enemyRookFiles.join(', ')} files.`,
    'They may occupy these files. Check entry squares and whether you should contest a file or defend its targets.'));

  const minors = homeMinors(own, color);
  if (pieces.length >= 10 && minors.length) add(4, idea('develop', 'Activate the pieces still at home',
    `Minor pieces on ${squares(minors)} occupy their starting squares.`,
    'Find safe squares that influence the center and connect your pieces before committing to an attack.'));
  const rimKnights = own.filter((p) => p.type === 'n' && ['a', 'h'].includes(p.square[0]!));
  if (rimKnights.length) add(4, idea('knights', 'Review your edge knights',
    `Knights on ${squares(rimKnights)} have fewer geometric destinations at the board’s edge.`,
    'Consider a route toward a supported central square, unless the knight already has a useful attacking or defensive task.'));
  const blockedBishops = own.filter((p) => p.type === 'b' &&
    [-1, 1].every((df) => pawns.some((pawn) => file(pawn) === file(p) + df && rank(pawn) === rank(p) + direction)));
  if (blockedBishops.length) {
    const reason = `Bishops on ${squares(blockedBishops)} have friendly pawns immediately on both forward diagonals.`;
    add(4, idea('bishop-improvement', 'Find a role for a restricted bishop', reason,
      'Consider a safe pawn move that releases a diagonal or a route to a more useful diagonal.'));
    // Blocked starting bishops are ordinary development tasks; do not suggest
    // trading them simply because the opening pawns have not moved yet.
    if (pieces.length < 10 && enemy.some((p) => ['n', 'b'].includes(p.type))) add(5, idea('bishop-trade', 'Consider exchanging a restricted bishop', reason,
      'Compare trading it for an active enemy minor piece with improving it; verify the resulting structure and tactical details.'));
  }
  if (hasBishopPair(own) && !hasBishopPair(enemy)) add(5, idea('keep-bishops', 'Weigh preserving your bishop pair',
    'You have bishops on both square colors; the opponent does not.',
    'Avoid surrendering the pair without a concrete gain, especially if you can open useful diagonals.'));
  else if (hasBishopPair(enemy) && !hasBishopPair(own) && own.some((p) => ['n', 'b'].includes(p.type))) add(5, idea('trade-bishop', 'Consider reducing the opposing bishop pair',
    'The opponent has bishops on both square colors; you do not.',
    'Look for a favorable minor-piece exchange that removes an active bishop without weakening your position.'));

  const material = (ps: SquareContents[]) => ps.reduce((sum, p) => sum + values[p.type], 0);
  const advantage = material(own) - material(enemy);
  if (Math.abs(advantage) >= 2 && own.some((p) => !['p', 'k'].includes(p.type)) && enemy.some((p) => !['p', 'k'].includes(p.type))) {
    add(5, idea('material-exchanges', advantage > 0 ? 'Consider simplifying safely' : 'Preserve useful counterplay',
      `By basic piece values, you are ${Math.abs(advantage)} points ${advantage > 0 ? 'ahead' : 'behind'} in material; activity and compensation are not included.`,
      advantage > 0 ? 'Consider equal piece exchanges that reduce counterplay, but verify the resulting ending and avoid automatic pawn trades.'
        : 'Avoid automatic simplification; retain active pieces unless an exchange solves a concrete problem.'));
  }

  if (enemyPassers.length) {
    const threat = idea('enemy-passers', 'Restrain the opposing passed pawns',
      `Enemy pawns on ${squares(enemyPassers)} have no opposing pawns ahead on their own or adjacent files.`,
      'The opponent may support their advance. Control blockade squares and check how quickly the pawns could promote.');
    add(2, threat);
    add(6, threat);
  }
  if (ownPassers.length) add(7, idea('advance-passers', 'Prepare a supported passed-pawn advance',
    `Your pawns on ${squares(ownPassers)} have no enemy pawns ahead on their own or adjacent files.`,
    'Coordinate support, remove blockaders if possible, and calculate the reply before pushing.'));

  const breaks = pawns.flatMap((p) => {
    const nextRank = rank(p) + direction;
    const target = p.square[0]! + nextRank;
    if (nextRank < 2 || nextRank > 7 || board.some((piece) => piece.square === target)) return [];
    return enemyPawns.some((e) => Math.abs(file(e) - file(p)) === 1 && rank(e) === nextRank + direction)
      ? [`${p.square}–${target}`] : [];
  });
  if (breaks.length) add(7, idea('pawn-breaks', 'Investigate a pawn break',
    `Pawn pushes ${breaks.join(', ')} would challenge an enemy pawn diagonally.`,
    'These are geometric candidates, not checked moves. Verify legality, support, exchanges, and king safety before using one to open lines.'));

  if (!board.some((p) => p.type === 'q') && pieces.length <= 4) add(4, idea('active-king', 'Give your king an active role',
    `Queens are off and few pieces remain; your king is on ${ownKing.square}.`,
    'Look for safe routes toward pawn targets or useful blockade squares while respecting enemy attacks.'));

  // Urgent defensive candidates precede improvements and targets. Q7 supplies
  // progress ideas when the first six have not produced a concrete direction.
  const priorityCandidates = [
    q[1]!.findings.find((p) => p.id === 'own-king'),
    q[1]!.findings.find((p) => p.id === 'enemy-passers'),
    q[3]!.findings[0], q[0]!.findings[0], q[2]!.findings[0],
    q[4]!.findings[0], q[5]!.findings[0], q[6]!.findings[0],
  ].filter((p): p is StrategicPlan => p !== undefined);
  return { status: 'playing', questions: q, priorities: priorityCandidates.slice(0, 3) };
}
