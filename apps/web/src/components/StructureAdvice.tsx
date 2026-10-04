import { breaksFor, structureFor } from '@coh/opening-book';
import type { PawnBreak, PawnStructure, Side, StructureMatch } from '@coh/opening-book';
import type { SquareMark } from './Board.js';
import { MiniBoard } from './MiniBoard.js';

export function StructurePlans({ structure, firstSide = 'white' }: {
  structure: PawnStructure;
  firstSide?: Side;
}) {
  const sides: Side[] = firstSide === 'white' ? ['white', 'black'] : ['black', 'white'];
  return (
    <div className="plan-columns">
      {sides.map((side) => (
        <div key={side}>
          <h4>{side === 'white' ? 'White' : 'Black'} plans</h4>
          <ul>
            {structure[side === 'white' ? 'whitePlans' : 'blackPlans'].map((plan) => (
              <li key={plan}>{plan}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function StructureBreaks({ breaks, onMarks }: {
  breaks: PawnBreak[];
  onMarks?: (marks: SquareMark[]) => void;
}) {
  if (!breaks.length) return <p className="muted">No listed breaks fit the current pawn placement.</p>;
  return (
    <ul className="breaks structure__breaks" onMouseLeave={() => onMarks?.([])}>
      {breaks.map((brk) => (
        <li key={`${brk.side}-${brk.move}`}>
          <span
            className={`break-move break-move--${brk.side}`}
            aria-label={`${brk.side === 'white' ? 'White' : 'Black'} pawn break ${brk.move}`}
            tabIndex={onMarks ? 0 : undefined}
            onMouseEnter={() => onMarks?.([{ square: brk.move, kind: 'break', label: brk.move }])}
            onFocus={() => onMarks?.([{ square: brk.move, kind: 'break', label: brk.move }])}
            onBlur={() => onMarks?.([])}
          >
            {brk.side === 'black' ? '…' : ''}{brk.move}
          </span>
          <div>
            <p>{brk.note}</p>
            {brk.prerequisites?.length ? (
              <>
                <strong className="structure__prepare">Prepare first</strong>
                <ul className="prereqs">
                  {brk.prerequisites.map((condition) => <li key={condition}>{condition}</li>)}
                </ul>
              </>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

export function StructureCard({ match, positionFen, onMarks }: {
  match: StructureMatch;
  /** Present only for structures actually detected on the current board. */
  positionFen?: string;
  onMarks: (marks: SquareMark[]) => void;
}) {
  const structure = structureFor(match);
  return (
    <article className="structure">
      <div>
        <MiniBoard fen={structure.fen} />
        <p className="muted structure__caption">Typical pawn placement</p>
      </div>
      <div className="structure__body">
        <h3>
          {structure.name}
          <span className={`tag ${positionFen ? 'tag--book' : 'tag--out'}`}>
            {positionFen ? 'on the board' : 'typical of this line'}
          </span>
        </h3>
        {match.mirrored && <p className="muted">Diagram and advice adapted to the colors on the board.</p>}
        <p>{structure.description}</p>
        <StructurePlans structure={structure} />
        <h4>{positionFen ? 'Breaks to prepare' : 'Typical breaks'}</h4>
        <p className="muted">Check piece placement and king safety before choosing a break.</p>
        <StructureBreaks breaks={breaksFor(match, positionFen)} onMarks={onMarks} />
        {structure.endgameNote && (
          <p className="structure__endgame"><strong>Endgame:</strong> {structure.endgameNote}</p>
        )}
      </div>
    </article>
  );
}
