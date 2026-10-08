import type { Chess, ColorName, SquareContents } from '@coh/chess-core';

export interface StrategicPlan {
  id: string;
  title: string;
  reason: string;
  action: string;
}

export interface PositionPlans {
  status: 'playing' | 'check' | 'finished';
  white: StrategicPlan[];
  black: StrategicPlan[];
}

const file = (piece: SquareContents) => piece.square.charCodeAt(0) - 97;
const rank = (piece: SquareContents) => Number(piece.square[1]);
const squares = (pieces: SquareContents[]) => pieces.map((p) => p.square).join(', ');

/** Strategic candidates from placement, not a search or a claim that a move is safe. */
export function suggestPlans(chess: Chess): PositionPlans {
  const result: PositionPlans = { status: 'playing', white: [], black: [] };
  if (chess.isGameOver()) return { ...result, status: 'finished' };
  if (chess.isCheck()) {
    result.status = 'check';
    result[chess.turn() === 'w' ? 'white' : 'black'] = [{
      id: 'check', title: 'Get out of check first',
      reason: 'The side to move is in check.',
      action: 'Compare legal king moves, captures of the checking piece, and blocks before making a strategic plan.',
    }];
    return result;
  }

  const board = chess.board().filter((p): p is SquareContents => p !== null);
  const pieces = board.filter((p) => p.type !== 'p' && p.type !== 'k');
  const rights = chess.fen().split(' ')[2] ?? '-';

  for (const color of ['w', 'b'] as ColorName[]) {
    const own = board.filter((p) => p.color === color);
    const enemy = board.filter((p) => p.color !== color);
    const pawns = own.filter((p) => p.type === 'p');
    const enemyPawns = enemy.filter((p) => p.type === 'p');
    const king = own.find((p) => p.type === 'k')!;
    const home = color === 'w' ? '1' : '8';
    const direction = color === 'w' ? 1 : -1;
    const plans: StrategicPlan[] = [];
    const add = (id: string, title: string, reason: string, action: string) => {
      plans.push({ id, title, reason, action });
    };

    if (pieces.length >= 6 && ['d', 'e'].includes(king.square[0]!)) {
      const canPrepareCastle = (color === 'w' ? /[KQ]/ : /[kq]/).test(rights);
      add('king-safety', 'Secure your king',
        `Your king is on ${king.square} with substantial attacking material still on the board.`,
        canPrepareCastle
          ? 'Prepare castling toward the safer wing; check the path and enemy attacks before committing.'
          : 'Keep defenders near your king and avoid opening central lines until it is safe.');
    }

    const homeMinors = own.filter((p) =>
      (p.type === 'n' && ['b', 'g'].some((f) => p.square === f + home)) ||
      (p.type === 'b' && ['c', 'f'].some((f) => p.square === f + home)));
    if (pieces.length >= 10 && homeMinors.length) {
      add('development', 'Bring your minor pieces into play',
        `Minor pieces on ${squares(homeMinors)} are on their starting squares.`,
        'Look for safe, active squares that influence the center; coordinate your pieces before starting a pawn attack.');
    }

    const passed = (candidates: SquareContents[], opponents: SquareContents[], step: number) =>
      candidates.filter((p) => !opponents.some((q) =>
        Math.abs(file(p) - file(q)) <= 1 && (rank(q) - rank(p)) * step > 0));
    const enemyPassers = passed(enemyPawns, pawns, -direction);
    if (enemyPassers.length) {
      add('blockade', 'Restrain the passed pawns',
        `Enemy pawns on ${squares(enemyPassers)} have no opposing pawns ahead on their own or adjacent files.`,
        'Control their advance squares and look for a safe blockade; avoid exchanges that let them run.');
    }
    const ownPassers = passed(pawns, enemyPawns, direction);
    if (ownPassers.length) {
      add('passed-pawns', 'Support your passed pawns',
        `Your pawns on ${squares(ownPassers)} have no enemy pawns ahead on their own or adjacent files.`,
        'Support their advance with your pieces, remove blockaders when possible, and check that each push can be defended.');
    }

    if (own.some((p) => p.type === 'r')) {
      const open = [...'abcdefgh'].filter((f) => !board.some((p) => p.type === 'p' && p.square[0] === f));
      const halfOpen = [...'abcdefgh'].filter((f) =>
        !pawns.some((p) => p.square[0] === f) && enemyPawns.some((p) => p.square[0] === f));
      const files = open.length ? open : halfOpen;
      if (files.length) {
        add('rook-files', 'Give your rooks useful files',
          `The ${files.join(', ')} ${files.length === 1 ? 'file is' : 'files are'} ${open.length ? 'open' : 'half-open for you'}.`,
          'Look for a safe rook entry on one of these files, then pressure a target or prepare to double rooks if you have two.');
      }
    }

    const isolated = enemyPawns.filter((p) => !enemyPawns.some((q) => Math.abs(file(p) - file(q)) === 1));
    if (isolated.length) {
      add('pawn-targets', 'Pressure isolated pawns',
        `Enemy pawns on ${squares(isolated)} have no friendly pawns on neighboring files.`,
        'Try to fix one in place and attack it with pieces; weigh its activity and the opponent’s counterplay before exchanging.');
    }

    if (!board.some((p) => p.type === 'q') && pieces.length <= 4) {
      add('king-activity', 'Activate your king',
        'Queens are off the board and few pieces remain.',
        'Look for safe king routes toward the center or pawn targets, while checking enemy attacks and passed pawns.');
    }

    if (plans.length < 2) {
      const centerPawns = pawns.filter((p) => ['d', 'e'].includes(p.square[0]!));
      if (centerPawns.length) {
        add('center', 'Coordinate around the center',
          `Your central pawns are on ${squares(centerPawns)}.`,
          'Support them with pieces. Prepare a central pawn break only when the resulting lines and exchanges help your pieces and king.');
      }
      add('piece-activity', 'Improve your least active piece',
        'No single forcing strategic target is established by these placement rules.',
        'Compare your pieces’ useful squares and improve the least active one; also identify and restrain the opponent’s next idea.');
    }

    result[color === 'w' ? 'white' : 'black'] = plans.slice(0, 4);
  }
  return result;
}
