import { useState } from 'react';
import type { OpeningMatch, PawnBreak, StructureMatch } from '@coh/opening-book';
import { classifyStructure, structuresFor } from '@coh/opening-book';
import { StructureCard } from './StructureAdvice.js';
import type { SquareMark } from './Board.js';

type Tab = 'plans' | 'breaks' | 'structures' | 'notes';

interface OpeningPanelProps {
  match: OpeningMatch | null;
  /** The position on the board, which is what the structures are read from. */
  fen: string;
  /** Moves played so far, which is where the continuation list branches from. */
  plies: number;
  onPlayMove: (san: string) => void;
  onMarks: (marks: SquareMark[]) => void;
}

/**
 * A structure to show, and why it is being shown. The ones read off the board
 * describe the position in front of you; the ones the opening was tagged with
 * describe where it is heading, and are worth keeping for exactly that reason.
 */
interface ShownStructure extends StructureMatch {
  onBoard: boolean;
}

function structuresToShow(match: OpeningMatch, fen: string): ShownStructure[] {
  const onBoard = classifyStructure(fen).map((found) => ({
    ...found,
    onBoard: true,
  }));

  const seen = new Set(onBoard.map((entry) => entry.structure.id));
  const typical = structuresFor(match.theory)
    .filter((structure) => !seen.has(structure.id))
    .map((structure) => ({
      structure,
      onBoard: false,
      mirrored: false,
    }));

  return [...onBoard, ...typical];
}

/** The square a break lands on, so hovering it can point at the board. */
function targetSquare(san: string): string | null {
  const match = /([a-h][1-8])$/.exec(san);
  return match ? match[1]! : null;
}

export function OpeningPanel({ match, fen, plies, onPlayMove, onMarks }: OpeningPanelProps) {
  const [tab, setTab] = useState<Tab>('plans');

  if (!match) {
    return (
      <section className="panel panel--empty">
        <h2>No opening yet</h2>
        <p>
          Make a move and this panel fills in with the opening’s name, the ideas behind it, the
          pawn structures it produces and the breaks each side is aiming for.
        </p>
      </section>
    );
  }

  const { opening, theory, theorySource, continuations, exact } = match;
  const structures = structuresToShow(match, fen);
  const onBoardCount = structures.filter((entry) => entry.onBoard).length;
  const inherited = theorySource && theorySource.name !== opening.name;

  const highlightBreak = (brk: PawnBreak) => {
    const square = targetSquare(brk.move);
    onMarks(square ? [{ square, kind: 'break', label: brk.move }] : []);
  };

  return (
    <section className="panel">
      <header className="panel__head">
        <div className="panel__title">
          <span className="eco">{opening.eco}</span>
          <h2>{opening.name}</h2>
        </div>
        <div className="panel__tags">
          {opening.character && <span className={`tag tag--${opening.character}`}>{opening.character}</span>}
          {opening.minRating && <span className="tag">{opening.minRating}+</span>}
          <span className={`tag ${exact ? 'tag--book' : 'tag--out'}`}>
            {exact ? 'in book' : 'past known theory'}
          </span>
        </div>
      </header>

      {theory ? (
        <>
          <p className="panel__idea">{theory.idea}</p>
          {inherited && (
            <p className="panel__note">
              Ideas shown for the parent line, <strong>{theorySource!.name}</strong>.
            </p>
          )}

          <nav className="tabs">
            {(['plans', 'breaks', 'structures', 'notes'] as Tab[]).map((name) => (
              <button
                key={name}
                type="button"
                className={tab === name ? 'is-active' : ''}
                onClick={() => setTab(name)}
              >
                {name}
                {/* Structures are now read from the board, so which ones are
                    there changes as you play. Worth seeing without clicking. */}
                {name === 'structures' && onBoardCount > 0 && (
                  <span className="tabs__count" title="pawn structures on the board">
                    {onBoardCount}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {tab === 'plans' && (
            <div className="plan-columns">
              <div>
                <h3>White</h3>
                <ul>
                  {theory.whitePlans.map((plan) => (
                    <li key={plan}>{plan}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Black</h3>
                <ul>
                  {theory.blackPlans.map((plan) => (
                    <li key={plan}>{plan}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {tab === 'breaks' && (
            <ul className="breaks" onMouseLeave={() => onMarks([])}>
              {theory.breaks.map((brk) => (
                <li
                  key={`${brk.side}-${brk.move}-${brk.note.slice(0, 12)}`}
                  onMouseEnter={() => highlightBreak(brk)}
                >
                  <span className={`break-move break-move--${brk.side}`}>{brk.move}</span>
                  <div>
                    <p>{brk.note}</p>
                    {brk.prerequisites && (
                      <ul className="prereqs">
                        {brk.prerequisites.map((p) => (
                          <li key={p}>{p}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              ))}
              {!theory.breaks.length && <li className="muted">No characteristic breaks recorded yet.</li>}
            </ul>
          )}

          {tab === 'structures' && (
            <div className="structures">
              {structures.map((entry) => (
                <StructureCard
                  key={entry.structure.id}
                  match={entry}
                  positionFen={entry.onBoard ? fen : undefined}
                  onMarks={onMarks}
                />
              ))}
              {!structures.length && (
                <p className="muted">
                  No structure on the board yet, and none recorded for this line.
                </p>
              )}
            </div>
          )}

          {tab === 'notes' && (
            <div className="notes">
              {theory.keySquares?.length ? (
                <>
                  <h3>Key squares</h3>
                  <ul onMouseLeave={() => onMarks([])}>
                    {theory.keySquares.map((ks) => (
                      <li
                        key={ks.square}
                        onMouseEnter={() => onMarks([{ square: ks.square, kind: 'key', label: ks.square }])}
                      >
                        <span className="break-move">{ks.square}</span>
                        {ks.note}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
              {theory.routes?.length ? (
                <>
                  <h3>Manoeuvres</h3>
                  <ul>
                    {theory.routes.map((route) => (
                      <li key={route}>
                        <code>{route}</code>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
              {theory.traps?.length ? (
                <>
                  <h3>Watch out</h3>
                  <ul>
                    {theory.traps.map((trap) => (
                      <li key={trap}>{trap}</li>
                    ))}
                  </ul>
                </>
              ) : null}
              {theory.modelGames?.length ? (
                <>
                  <h3>Model games</h3>
                  <ul>
                    {theory.modelGames.map((game) => (
                      <li key={game}>{game}</li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>
          )}
        </>
      ) : (
        <>
          <p className="muted">No written theory for this line yet.</p>
          <div className="structures">
            {structures.map((entry) => (
              <StructureCard key={entry.structure.id} match={entry} positionFen={fen} onMarks={onMarks} />
            ))}
          </div>
        </>
      )}

      {continuations.length > 0 && (
        <footer className="continuations">
          <h3>Main continuations</h3>
          <div className="chips">
            {continuations.map((next) => {
              // Continuations were collected for exactly this many plies, so
              // the move to offer is the next one in each named line.
              const move = next.moves[plies];
              if (!move) return null;
              return (
                <button
                  key={next.name}
                  type="button"
                  className="chip"
                  title={`${next.eco} · ${next.name}`}
                  onClick={() => onPlayMove(move)}
                >
                  <strong>{move}</strong>
                  <span>{next.name}</span>
                </button>
              );
            })}
          </div>
        </footer>
      )}
    </section>
  );
}
