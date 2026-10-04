import { useMemo } from 'react';
import { Chess } from '@coh/chess-core';
import { suggestPlans } from '@coh/imbalances';

export function PositionPlans({ fen }: { fen: string }) {
  const plans = useMemo(() => suggestPlans(new Chess(fen)), [fen]);
  return (
    <section className="position-plans" aria-label="Plans for this position">
      <h3>Plans for this position</h3>
      {plans.status === 'finished' ? (
        <p className="muted">The game is over in this position. Step back a move to explore plans.</p>
      ) : (
        <>
          <p className="muted">Ideas based on the current board and basic strategy. Check threats, captures, and king safety before choosing a move.</p>
          <div className="plan-columns">
            {(['white', 'black'] as const).filter((side) => plans[side].length).map((side) => (
              <div key={side}>
                <h4>{side === 'white' ? 'White' : 'Black'} plans</h4>
                <ul>
                  {plans[side].map((plan) => (
                    <li key={plan.id}>
                      <strong>{plan.title}</strong>
                      <p className="position-plans__reason">{plan.reason}</p>
                      <p>{plan.action}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
