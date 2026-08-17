interface MoveListProps {
  sans: string[];
  cursor: number;
  onSelect: (index: number) => void;
}

/**
 * The move list doubles as the timeline: clicking a move moves the cursor
 * there, and playing from that point rewrites the line after it.
 */
export function MoveList({ sans, cursor, onSelect }: MoveListProps) {
  const rows: { number: number; white?: string; black?: string }[] = [];
  for (let i = 0; i < sans.length; i += 2) {
    rows.push({ number: i / 2 + 1, white: sans[i], black: sans[i + 1] });
  }

  if (!sans.length) {
    return (
      <div className="move-list move-list--empty">
        <p>Play a move to begin. The opening is identified as you go.</p>
      </div>
    );
  }

  return (
    <ol className="move-list">
      {rows.map((row, rowIndex) => (
        <li key={row.number}>
          <span className="move-list__number">{row.number}.</span>
          <button
            type="button"
            className={`move-list__move${cursor === rowIndex * 2 + 1 ? ' is-current' : ''}`}
            onClick={() => onSelect(rowIndex * 2 + 1)}
          >
            {row.white}
          </button>
          {row.black && (
            <button
              type="button"
              className={`move-list__move${cursor === rowIndex * 2 + 2 ? ' is-current' : ''}`}
              onClick={() => onSelect(rowIndex * 2 + 2)}
            >
              {row.black}
            </button>
          )}
        </li>
      ))}
    </ol>
  );
}
