/**
 * The pawn structure encyclopedia.
 *
 * Structures are stored once and referenced by id, because they cut across
 * openings: an IQP arrives from the Panov, the Tarrasch, the Nimzo and half a
 * dozen others, and a player who understands it once understands it everywhere.
 * The skeleton FENs contain pawns and kings only — the pieces are exactly the
 * part that varies.
 */

import type { PawnStructure } from './types.js';

export const PAWN_STRUCTURES: PawnStructure[] = [
  {
    id: 'iqp',
    name: 'Isolated Queen’s Pawn',
    fen: '4k3/pp3ppp/4p3/8/3P4/8/PP3PPP/4K3 w - - 0 1',
    description:
      'White has a d-pawn with no neighbours on the c- and e-files. It grants space, the e5 and c5 outposts and open c- and e-files for the rooks, and in exchange it is a permanent target and hands Black the d5 square. The whole structure is a race between activity and the endgame.',
    whitePlans: [
      'Play for a kingside attack while the pieces are on: Bd3, Qd3/Qc2 aiming at h7, Ng5, Rad1 and Re1.',
      'Occupy e5 with a knight; it is the square the isolated pawn pays for.',
      'Meet ...Nd5 blockades by trading the blockading knight, not the pawn.',
      'Time d4-d5 so the pawn disappears at the moment it would otherwise become weak.',
    ],
    blackPlans: [
      'Blockade d5 with a knight — a piece in front of the pawn kills its energy.',
      'Trade minor pieces, especially the light-squared bishop and the e5 knight; every trade helps the blockader.',
      'Aim for an endgame where the pawn is simply weak.',
      'Pressure d4 with ...Nc6, ...Bf6/...Bb4 and a rook on d8 so White can never free it.',
    ],
    breaks: [
      {
        move: 'd5',
        side: 'white',
        note: 'The freeing break. It liquidates the weakness and usually opens lines toward an underdeveloped black king.',
        prerequisites: [
          'More pieces pointing at d5 than Black has blockading it',
          'Rook on d1, ideally opposite the black queen',
          'A concrete tactical justification — otherwise the pawn just hangs',
        ],
      },
      {
        move: 'e5',
        side: 'black',
        note: 'Rarer counter-break to open the position when Black is fully developed and White’s attack has stalled.',
      },
    ],
    endgameNote:
      'The rule of thumb is blunt: with queens and minor pieces on, the isolani is an attacking asset; once the heavy pieces come off, it is a liability. Both sides should trade in the direction that suits them.',
    transformsInto: ['hanging-pawns'],
  },
  {
    id: 'hanging-pawns',
    name: 'Hanging Pawns (c4 + d4)',
    fen: '4k3/pp3ppp/4p3/8/2PP4/8/PP3PPP/4K3 w - - 0 1',
    description:
      'Two connected but unsupported pawns abreast on c4 and d4. They control four central squares and can advance as a phalanx, but neither can be defended by another pawn, so pressure down the c- and d-files is permanent.',
    whitePlans: [
      'Advance d4-d5 at the right moment to open lines while the pawns still stand together.',
      'Use the space to build a kingside attack before Black organises the blockade.',
      'Keep the pawns side by side; the moment one advances alone it becomes a target.',
    ],
    blackPlans: [
      'Pile up on the c- and d-files and provoke one pawn forward.',
      'Trade into an endgame where both pawns need pieces to babysit them.',
      'Fix them with ...b6 and ...Ba6/...Rc8 before breaking with ...b5 or ...e5.',
    ],
    breaks: [
      { move: 'd5', side: 'white', note: 'The point of the structure: open the centre while ahead in activity.' },
      { move: 'b5', side: 'black', note: 'Undermines c4 and forces a concession — either an isolani or a backward pawn.' },
    ],
    transformsInto: ['iqp'],
  },
  {
    id: 'carlsbad',
    name: 'Carlsbad',
    fen: '4k3/ppp2ppp/8/3p4/3P4/8/PP2PPPP/4K3 w - - 0 1',
    description:
      'White pawns a2, b2, d4, e2-h2 against Black’s a7, b7, c7, d5, f7-h7. It arises from the Exchange Queen’s Gambit and the Caro-Kann Exchange. Black has three pawns against two on the queenside, White has four against three on the kingside, and each side attacks where they have the majority.',
    whitePlans: [
      'The minority attack: a4 and b4-b5, hitting c6 to leave Black with a backward c-pawn or an isolated d-pawn.',
      'Alternatively play in the centre with f3 and e4, which changes the character entirely.',
      'A kingside attack with Ne5, f3 and g4 if Black commits to the queenside.',
    ],
    blackPlans: [
      'Meet the minority attack with ...a5 and ...b5 or by inviting b5 and answering with ...c5.',
      'Counter in the centre with ...Ne4 and ...f5, using the kingside majority.',
      'The classic setup ...Re8, ...Nf8, ...Ne6 covering the queenside from a distance.',
    ],
    breaks: [
      {
        move: 'b5',
        side: 'white',
        note: 'The minority attack. After bxc6 bxc6 Black is left with a long-term weakness on c6 and an open b-file for White.',
        prerequisites: ['Rooks on b1 and c1', 'a4 played so b5 cannot simply be met by ...a6'],
      },
      { move: 'e4', side: 'white', note: 'Central alternative — prepared by f3 and Re1; turns the game into a fight about d5, not c6.' },
      { move: 'f5', side: 'black', note: 'Uses the kingside majority; usually preceded by ...Ne4 and ...Bd6.' },
      { move: 'c5', side: 'black', note: 'Freeing break that accepts an isolated d-pawn in return for activity.' },
    ],
    endgameNote:
      'If White achieves the minority attack and reaches a rook endgame, the c6 weakness often decides. Black’s counterplay must be found before the queens come off.',
    transformsInto: ['iqp'],
  },
  {
    id: 'maroczy',
    name: 'Maróczy Bind',
    fen: '4k3/pp2pppp/3p4/8/2P1P3/8/PP3PPP/4K3 w - - 0 1',
    description:
      'White pawns on c4 and e4 clamp down on d5 and b5. Black has traded a c-pawn for White’s d-pawn and lives with less space in exchange for a solid, break-free structure. It is the archetype of a bind: nothing is weak, everything is cramped.',
    whitePlans: [
      'Keep pieces on — space is only an advantage while there is something to squeeze.',
      'Occupy d5 with a piece once the knights that defend it are traded.',
      'Slow expansion with f3, Be3, Qd2, Rc1, b4 and c5.',
    ],
    blackPlans: [
      'Trade minor pieces, ideally the dark-squared bishops, until the space stops hurting.',
      'Prepare ...b5 or ...d5, the only two moves that dissolve the bind.',
      'Use the half-open c-file and pressure c4 with ...Rc8 and ...Qa5.',
    ],
    breaks: [
      {
        move: 'b5',
        side: 'black',
        note: 'The main freeing break, prepared by ...a6, ...Rb8 and sometimes ...Nc6-a5.',
        prerequisites: ['Queenside rook developed', 'c4 not over-defended'],
      },
      { move: 'd5', side: 'black', note: 'Wins the game on the spot if it works — but only when Black has real control of d5.' },
      { move: 'c5', side: 'white', note: 'Gains further space and fixes d6 as a target.' },
    ],
    transformsInto: ['hedgehog'],
  },
  {
    id: 'hedgehog',
    name: 'Hedgehog',
    fen: '4k3/5ppp/pp1pp3/8/2P1P3/8/PP3PPP/4K3 w - - 0 1',
    description:
      'Black keeps pawns on a6, b6, d6, e6 — a low, flexible wall behind which the pieces coil. White has the space; Black has no weaknesses and two loaded springs in ...b5 and ...d5. Understanding when to release them is the entire structure.',
    whitePlans: [
      'Restrain the breaks: a4 stops ...b5, and pieces trained on d5 stop ...d5.',
      'Do not grab space carelessly; every pawn move creates a target for the coiled pieces.',
      'Trade into endgames where the extra space tells.',
    ],
    blackPlans: [
      'Complete the standard setup: ...Qc7, ...Nbd7, ...Bb7, ...Rac8, ...Rfe8, ...Bf8.',
      'Wait. The structure is designed to punish impatience — White’s and Black’s alike.',
      'Fire ...b5 or ...d5 the moment White commits a piece to the wrong square.',
    ],
    breaks: [
      {
        move: 'b5',
        side: 'black',
        note: 'Opens the b-file and the long diagonal at once; the most common release.',
        prerequisites: ['Bb7 and Rc8 in place', 'a4 not yet played, or a4 answered by ...Nc5'],
      },
      {
        move: 'd5',
        side: 'black',
        note: 'The other spring. Usually a tactical shot, justified by pressure down the long diagonal and the c-file.',
      },
      { move: 'e5', side: 'white', note: 'Space-gaining lunge that can backfire badly by handing Black d5.' },
    ],
  },
  {
    id: 'boleslavsky',
    name: 'Boleslavsky Centre (d6 + e5)',
    fen: '4k3/1p3ppp/p2p4/4p3/4P3/8/PP3PPP/4K3 w - - 0 1',
    description:
      'Black plays ...e5 in an Open Sicilian, taking the d4 square from White’s pieces and accepting a hole on d5 and a backward d-pawn. This is the Najdorf, Sveshnikov and Boleslavsky bargain: a permanent structural concession in return for active pieces and the initiative.',
    whitePlans: [
      'Fight for d5: Nd5, Bg5xf6 to remove the defender, Nc3-e2-g3-f5.',
      'Pressure d6 down the d-file before Black plays ...d5.',
      'Kingside expansion with f4, g4 and f5 in the sharpest lines.',
    ],
    blackPlans: [
      'Play ...d5 in one move at the right moment and the structural problem vanishes.',
      'Cover d5 with ...Be6, ...Nbd7, ...b5-b4 kicking the c3 knight.',
      'Queenside counterplay with ...b5, ...Rc8 and pressure on c2 and e4.',
    ],
    breaks: [
      {
        move: 'd5',
        side: 'black',
        note: 'The freeing break the whole setup exists to prepare. Playing it in one go equalises; being forced into ...d6-d5 in two goes usually does not.',
        prerequisites: ['d5 defended more times than White attacks it', 'Pieces developed — this is not a move to rush'],
      },
      { move: 'b5', side: 'black', note: 'Gains queenside space and drives the knight away from d5.' },
      { move: 'f5', side: 'white', note: 'Clamps down on e6 and opens attacking lines; typical of the English Attack.' },
      { move: 'g4', side: 'white', note: 'The standard pawn storm, played with the king castled long or still in the centre.' },
    ],
    transformsInto: ['scheveningen'],
  },
  {
    id: 'scheveningen',
    name: 'Scheveningen Small Centre (d6 + e6)',
    fen: '4k3/1p3ppp/p2pp3/8/4P3/8/PP3PPP/4K3 w - - 0 1',
    description:
      'The most flexible Sicilian formation: pawns on d6 and e6 concede space but create no holes at all. Black keeps both ...d5 and ...e5 in reserve, and White’s attack has to break through a structure with no obvious cracks.',
    whitePlans: [
      'The Keres Attack g4-g5 and the English Attack f3, Be3, Qd2, g4 — hit the small centre before it expands.',
      'f4-f5 to attack e6 and provoke a concession.',
      'Central occupation with e5 when Black’s pieces are misplaced.',
    ],
    blackPlans: [
      'Play ...d5 or ...e5 exactly once and at the right moment.',
      'Queenside play with ...a6, ...b5, ...Bb7 and ...Rc8 aimed at c3 and e4.',
      'The ...Nc6-a5-c4 manoeuvre to trade White’s best attacking bishop.',
    ],
    breaks: [
      { move: 'd5', side: 'black', note: 'The main equaliser; usually needs ...Bb7 and a rook on d8 or c8 first.' },
      { move: 'e5', side: 'black', note: 'Transposes to a Boleslavsky centre — a real decision, not a free move: it hands over d5.' },
      { move: 'f5', side: 'white', note: 'The standard attacking break, hitting e6.' },
      { move: 'g5', side: 'white', note: 'Drives the f6 knight away from the defence of d5 and h7.' },
    ],
    transformsInto: ['boleslavsky'],
  },
  {
    id: 'french-chain',
    name: 'French Pawn Chain (e5/d4/c3 vs d5/e6)',
    fen: '4k3/pp3ppp/4p3/2ppP3/3P4/2P5/PP3PPP/4K3 w - - 0 1',
    description:
      'Interlocking chains pointing in opposite directions. White’s chain aims at the kingside, Black’s at the queenside, and each side attacks the base of the enemy chain. Black’s light-squared bishop, walled in behind e6, is the structure’s defining problem.',
    whitePlans: [
      'Defend d4 enough times to keep the chain intact — Nf3, Be3, Qd2 and sometimes Bd3 and Ne2.',
      'Attack on the kingside where the chain points: f4-f5, Qg4, Nf3-g5.',
      'Keep the e5 wedge; it is what makes Black’s pieces passive.',
    ],
    blackPlans: [
      'Attack the base d4 with ...c5, ...Nc6, ...Qb6 and ...Nge7-f5.',
      'Solve the bad bishop: ...b6 and ...Ba6, or ...Bd7-b5, or ...f6 opening the diagonal.',
      'Win the d4 pawn or force White to release the tension favourably.',
    ],
    breaks: [
      {
        move: 'c5',
        side: 'black',
        note: 'The main break, hitting the base of the chain. Almost always the right plan in the Advance French.',
        prerequisites: ['Ready to answer dxc5 with ...Bxc5 or ...Nxc5 developing'],
      },
      {
        move: 'f6',
        side: 'black',
        note: 'The secondary break against the head of the chain. Frees the position but weakens e6 and the e-file.',
        prerequisites: ['King safe', 'e6 defensible after the exchange on f6'],
      },
      { move: 'f5', side: 'white', note: 'Opens the kingside where White is stronger; usually decisive if achieved under good circumstances.' },
    ],
    endgameNote:
      'If the chains dissolve into an endgame, Black’s queenside majority and White’s kingside space usually balance out — but a bad light-squared bishop still loses endgames.',
  },
  {
    id: 'semi-slav-triangle',
    name: 'Slav Triangle (c6 + d5 + e6)',
    fen: '4k3/pp3ppp/2p1p3/3p4/2PP4/4P3/PP3PPP/4K3 w - - 0 1',
    description:
      'Black’s pawns on c6, d5 and e6 form the sturdiest structure in the queen’s pawn openings. Nothing can be attacked; the cost is the light-squared bishop, which has no comfortable diagonal until Black finds ...c5, ...e5 or ...dxc4 followed by ...b5.',
    whitePlans: [
      'Build the big centre with e4 and play for space.',
      'Trap Black’s bishop at home and play on the resulting passivity.',
      'Meet ...dxc4 and ...b5 with a4 to open the queenside before Black consolidates.',
    ],
    blackPlans: [
      'Free the bishop: ...dxc4 followed by ...b5 and ...Bb7, the Meran plan.',
      'The Stonewall-flavoured alternative ...f5 with a firm grip on e4.',
      'Break with ...c5 or ...e5 at the right moment.',
    ],
    breaks: [
      { move: 'c5', side: 'black', note: 'The main freeing break; usually played after ...Nbd7, ...Bd6 and ...0-0.' },
      { move: 'e5', side: 'black', note: 'The other release; hands Black the centre if White has castled and committed pieces.' },
      { move: 'e4', side: 'white', note: 'The critical central advance — the whole fight in the Meran is about whether White gets it in favourably.' },
    ],
  },
  {
    id: 'kid-locked',
    name: 'King’s Indian Locked Centre (d5/e4 vs d6/e5)',
    fen: '4k3/ppp2ppp/3p4/3Pp3/2P1P3/8/PP3PPP/4K3 w - - 0 1',
    description:
      'A fully locked centre where the pawns point in opposite directions and both sides know exactly where to play. White attacks on the queenside with c4-c5, Black on the kingside with ...f5-f4 and ...g5-g4. Whoever gets there first usually wins outright.',
    whitePlans: [
      'c5 and the c-file: Rc1, Nd2-b3 or b4-b5, then invade on c7.',
      'Blunt the kingside attack with Ne1-d3, g4 and f3.',
      'Trade off the dark-squared bishop with Be3-g5, or exchange knights to slow the storm.',
    ],
    blackPlans: [
      'The standard march: ...Ne8/...Nd7, ...f5, ...f4, ...g5, ...Rf6-h6, ...g4.',
      'Never open the queenside — every trade there helps White.',
      'Sacrifice material for time if it means the attack lands first; this is a race, not a manoeuvring game.',
    ],
    breaks: [
      {
        move: 'f5',
        side: 'black',
        note: 'The break that starts the kingside attack. It defines the whole game.',
        prerequisites: ['Knight moved off f6 so the f-pawn can advance', 'Prepared to answer exf5 with ...gxf5 keeping the f-file closed'],
      },
      { move: 'g4', side: 'black', note: 'The second wave; often played as a sacrifice to rip open the h-file.' },
      {
        move: 'c5',
        side: 'white',
        note: 'The mirror-image break on the other wing. Speed is everything: count the moves each side needs.',
        prerequisites: ['b4 prepared or Rc1 and Nb3 in place'],
      },
    ],
  },
  {
    id: 'benoni',
    name: 'Modern Benoni',
    fen: '4k3/pp2pppp/3p4/3P4/2P1P3/8/PP3PPP/4K3 w - - 0 1',
    description:
      'Black trades the c-pawn for White’s d-pawn, accepting a backward d6 pawn and less space for a half-open c-file, a queenside majority and the ...b5 break. Sharp, unbalanced and unforgiving — it punishes both sides for slow play.',
    whitePlans: [
      'The e4-e5 break, which blows the position open while Black’s king is still settling.',
      'The f4/Bb5+/a4 setup restraining ...b5 completely.',
      'Pressure d6 down the d-file and squeeze.',
    ],
    blackPlans: [
      'Push ...b5 — the entire counterplay depends on it.',
      'Fianchetto with ...g6 and ...Bg7 aiming at the long diagonal and the queenside.',
      'Play ...Re8, ...Nbd7-e5 or ...Na6-c7 to support ...b5.',
    ],
    breaks: [
      {
        move: 'b5',
        side: 'black',
        note: 'The reason to play the Benoni. Often a genuine pawn sacrifice for the initiative.',
        prerequisites: ['a4 not yet played, or ...Na6/...Nb4 available to reroute'],
      },
      { move: 'e5', side: 'white', note: 'The critical central break; usually preceded by f4 and Nf3.' },
      { move: 'f4', side: 'white', note: 'Supports e5 and gains space; the main line of the whole opening.' },
    ],
  },
  {
    id: 'stonewall',
    name: 'Stonewall (d5 + e6 + f5 + c6)',
    fen: '4k3/pp4pp/2p1p3/3p1p2/2PP4/4P3/PP3PPP/4K3 w - - 0 1',
    description:
      'An immovable grip on e4 bought with a permanent hole on e5 and a light-squared bishop with nothing to do. Black plays for a kingside attack from a fixed structure; White plays against e5 and the bad bishop.',
    whitePlans: [
      'Occupy e5 with a knight and trade off Black’s good dark-squared bishop with Ba3 or Bf4.',
      'Play b4-b5 to open the queenside where Black has no attack.',
      'Trade light-squared bishops only if it helps — Black is usually happy to see the bad one go.',
    ],
    blackPlans: [
      'Solve the bad bishop with ...b6 and ...Ba6, or ...Bd7-e8-h5.',
      'Attack with ...Qe8-h5, ...Ne4, ...Rf6-h6 and ...g5.',
      'Keep a knight on e4 permanently; it is the point of the structure.',
    ],
    breaks: [
      { move: 'g5', side: 'black', note: 'The attacking break, opening lines toward the white king.' },
      { move: 'c5', side: 'black', note: 'The freeing break when White plays on the queenside instead of contesting e4.' },
      { move: 'b5', side: 'white', note: 'Queenside expansion, aiming at c6 and the c-file.' },
    ],
    endgameNote:
      'Endgames strongly favour whoever kept the better bishop. Black should usually avoid trading into a bad-bishop endgame at almost any cost.',
  },
  {
    id: 'spanish-closed',
    name: 'Closed Spanish Centre (d4/e4 vs d6/e5)',
    fen: '4k3/2p2ppp/p2p4/1p2p3/3PP3/2P5/PP3PPP/4K3 w - - 0 1',
    description:
      'The classical closed centre of the Ruy Lopez and the Italian: White pawns on c3, d4 and e4 against Black’s a6, b5, d6 and e5. The central tension is deliberately maintained for many moves, and manoeuvring behind the lines decides the game.',
    whitePlans: [
      'The famous knight route Nb1-d2-f1-g3 (or -e3), regrouping toward the kingside.',
      'Keep the tension; both dxe5 and d5 usually release the pressure prematurely.',
      'a4 to open the a-file and hit b5 before Black finishes the queenside setup.',
    ],
    blackPlans: [
      'The Chigorin plan ...Na5, ...c5 and ...Qc7, hitting d4.',
      'The Breyer plan ...Nb8-d7 rerouting toward c5 and f8.',
      'Break with ...d5 in one move if White ever relaxes control of the square.',
    ],
    breaks: [
      { move: 'd5', side: 'black', note: 'The equaliser. Achieving ...d6-d5 in one move is Black’s central goal in the entire opening.' },
      { move: 'c5', side: 'black', note: 'Hits the base of White’s centre and gains queenside space.' },
      { move: 'd5', side: 'white', note: 'Closes the centre and shifts the game to the wings — good only if White wins the resulting race.' },
      { move: 'a4', side: 'white', note: 'Not a central break, but the standard way to create a second front against b5.' },
    ],
  },
];

const BY_ID = new Map(PAWN_STRUCTURES.map((s) => [s.id, s]));

export function getStructure(id: string): PawnStructure | undefined {
  return BY_ID.get(id);
}

export function getStructures(ids: readonly string[]): PawnStructure[] {
  return ids.map((id) => BY_ID.get(id)).filter((s): s is PawnStructure => Boolean(s));
}
