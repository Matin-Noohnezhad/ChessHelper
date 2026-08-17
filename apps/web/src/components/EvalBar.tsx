import type { Orientation } from '../hooks/useChessGame.js';
import type { EngineController } from '../hooks/useEngine.js';
import { formatEval, whiteWinFraction } from '../hooks/useEngine.js';

interface EvalBarProps {
  engine: EngineController;
  orientation: Orientation;
}

/**
 * A lichess/chess.com-style vertical eval bar, flush against the board's
 * side. Sits idle (flat, no split) until analysis is switched on in the
 * engine panel, then fills to match the board's current orientation — the
 * White portion grows from whichever end White's side of the board is on.
 */
export function EvalBar({ engine, orientation }: EvalBarProps) {
  const best = engine.enabled ? engine.analysis?.lines[0] : undefined;
  const active = best !== undefined;
  const fraction = active ? whiteWinFraction(best) : 0.5;
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
        {active ? formatEval(best) : '–'}
      </span>
    </div>
  );
}
