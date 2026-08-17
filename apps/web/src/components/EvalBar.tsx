import type { Orientation } from '../hooks/useChessGame.js';
import type { EngineController } from '../hooks/useEngine.js';
import { formatEval, whiteWinFraction } from '../hooks/useEngine.js';

interface EvalBarProps {
  /** Live analysis of the explore board. */
  engine?: EngineController;
  /** A reading the caller already has — the review works from its own report, not a live search. */
  reading?: { fraction: number; label: string } | null;
  orientation: Orientation;
}

/**
 * A lichess/chess.com-style vertical eval bar, flush against the board's
 * side. Sits idle (flat, no split) until there is something to show, then
 * fills to match the board's current orientation — the White portion grows
 * from whichever end White's side of the board is on.
 */
export function EvalBar({ engine, reading, orientation }: EvalBarProps) {
  const best = engine?.enabled ? engine.analysis?.lines[0] : undefined;
  const active = reading ? true : best !== undefined;
  const fraction = reading ? reading.fraction : best ? whiteWinFraction(best) : 0.5;
  const label = reading ? reading.label : best ? formatEval(best) : '–';

  const whiteAtBottom = orientation === 'white';
  const anchorStyle = whiteAtBottom
    ? { bottom: 0, height: `${fraction * 100}%` }
    : { top: 0, height: `${fraction * 100}%` };
  const labelStyle = whiteAtBottom
    ? { bottom: `${fraction * 100}%`, transform: 'translate(-50%, 50%)' }
    : { top: `${fraction * 100}%`, transform: 'translate(-50%, -50%)' };

  return (
    <div className={`eval-bar${active ? '' : ' eval-bar--idle'}`}>
      <div className="eval-bar__track">
        {active && <div className="eval-bar__white" style={anchorStyle} />}
      </div>
      <span className="eval-bar__label" style={labelStyle}>
        {active ? label : '–'}
      </span>
    </div>
  );
}
