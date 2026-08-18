/**
 * The knowledge model.
 *
 * The point of this app is not "here is the move order" — an engine or a
 * database does that better. It is *why* the moves are played: the structure
 * they produce, the plans that structure allows, and the pawn breaks that
 * change it. So an opening entry carries teaching content, and the move list is
 * merely its address.
 */

export type Side = 'white' | 'black';

/** How sharp a line is, which drives what we recommend to whom. */
export type Character =
  | 'sharp' // concrete, forcing, punishes imprecision
  | 'positional' // slow manoeuvring, structure matters more than tactics
  | 'balanced'
  | 'gambit' // material for initiative
  | 'system'; // repeatable setup, low move-order burden

export interface PawnBreak {
  /** The break in SAN, e.g. `'d5'`, `'c5'`, `'f5'`. */
  move: string;
  /** Which side plays it. */
  side: Side;
  /** When it works and what it achieves. */
  note: string;
  /** Conditions that must be met first — the part players usually skip. */
  prerequisites?: string[];
}

/**
 * A pawn structure, keyed by id so many openings can point at one entry.
 * Structures transpose across openings constantly; that reuse is the whole
 * reason players study them.
 */
export interface PawnStructure {
  id: string;
  name: string;
  /** Representative FEN — pawns and kings only, so it renders as a skeleton. */
  fen: string;
  description: string;
  whitePlans: string[];
  blackPlans: string[];
  breaks: PawnBreak[];
  /** Endgame tendencies, which is where structure judgement usually pays off. */
  endgameNote?: string;
  /** Other structures this one commonly turns into, by id. */
  transformsInto?: string[];
}

export interface KeySquare {
  square: string;
  note: string;
}

/** The teaching payload attached to an opening node. */
export interface OpeningTheory {
  /** One-paragraph statement of what each side is actually trying to do. */
  idea: string;
  /** Ids into the pawn structure encyclopedia. */
  structures: string[];
  whitePlans: string[];
  blackPlans: string[];
  breaks: PawnBreak[];
  keySquares?: KeySquare[];
  /** Piece manoeuvres worth knowing by name, e.g. `'Nb1-d2-f1-g3'`. */
  routes?: string[];
  /** Concrete things that lose games in this opening. */
  traps?: string[];
  /** Model games, "Player – Player, Event Year". */
  modelGames?: string[];
  /**
   * Where the understanding came from, when it was distilled from annotated
   * material rather than written from scratch. Titles only, and the entry is
   * always our own words — the point of recording this is that a reader can
   * tell which entries rest on somebody else's analysis and go check it.
   */
  sources?: string[];
}

export interface Opening {
  /** ECO code, e.g. `'B90'`. Not unique — many lines share one. */
  eco: string;
  name: string;
  /** SAN moves from the initial position. This is the node's identity. */
  moves: string[];
  /** Which side this entry is written from the perspective of, if either. */
  forSide?: Side;
  character?: Character;
  /** Rough rating band where this line starts paying off. */
  minRating?: number;
  theory?: OpeningTheory;
  /** Free-text aliases players actually search for. */
  aliases?: string[];
}

/** A resolved identification: the deepest entry matching the moves played. */
export interface OpeningMatch {
  opening: Opening;
  /** How many of the played moves the entry accounts for. */
  depth: number;
  /** True when every move played is accounted for by the entry. */
  exact: boolean;
  /** Named continuations available from here. */
  continuations: Opening[];
  /**
   * Where the displayed theory comes from. Specific variations rarely repeat
   * the parent's ideas, so we walk up the tree until we find some — a player in
   * the Mar del Plata should still be shown the King's Indian plans.
   */
  theory?: OpeningTheory;
  theorySource?: Opening;
}
