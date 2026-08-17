import { useState } from 'react';
import type { OpeningMatch, PawnBreak } from '@coh/opening-book';
import { structuresFor } from '@coh/opening-book';
import { MiniBoard } from './MiniBoard.js';
import type { SquareMark } from './Board.js';

type Tab = 'plans' | 'breaks' | 'structures' | 'notes';

interface OpeningPanelProps {
  match: OpeningMatch | null;
  /** Moves played so far, which is where the continuation list branches from. */
  plies: number;
  onPlayMove: (san: string) => void;
  onMarks: (marks: SquareMark[]) => void;
}

/** The square a break lands on, so hovering it can point at the board. */
function targetSquare(san: string): string | null {
  const match = /([a-h][1-8])$/.exec(san);
  return match ? match[1]! : null;
}

export function OpeningPanel({ match, plies, onPlayMove, onMarks }: OpeningPanelProps) {
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
  const structures = structuresFor(theory);
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
              {structures.map((structure) => (
                <article key={structure.id} className="structure">
                  <MiniBoard fen={structure.fen} />
                  <div className="structure__body">
                    <h3>{structure.name}</h3>
                    <p>{structure.description}</p>
                    <h4>Breaks</h4>
                    <ul className="structure__breaks" onMouseLeave={() => onMarks([])}>
                      {structure.breaks.map((brk) => (
                        <li key={`${brk.side}-${brk.move}`} onMouseEnter={() => highlightBreak(brk)}>
                          <span className={`break-move break-move--${brk.side}`}>{brk.move}</span>
                          {brk.note}
                        </li>
                      ))}
                    </ul>
                    {structure.endgameNote && (
                      <p className="structure__endgame">
                        <strong>Endgame:</strong> {structure.endgameNote}
                      </p>
                    )}
                  </div>
                </article>
              ))}
              {!structures.length && <p className="muted">No structure recorded for this line yet.</p>}
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
        <p className="muted">No written theory for this line yet.</p>
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
