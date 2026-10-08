import { useMemo, useState } from 'react';
import { Chess } from '@coh/chess-core';
import type { ColorName } from '@coh/chess-core';
import { analyzeSevenQuestions } from '@coh/imbalances';

export function SevenQuestionPlans({ fen }: { fen: string }) {
  const [perspective, setPerspective] = useState<'turn' | ColorName>('turn');
  const color = perspective === 'turn' ? (fen.split(' ')[1] === 'b' ? 'b' : 'w') : perspective;
  const report = useMemo(() => analyzeSevenQuestions(new Chess(fen), color), [fen, color]);
  if (report.status !== 'playing') return null;

  return (
    <section className="seven-q" aria-label="7Q planning guide">
      <div className="seven-q__header">
        <h4>7Q planning guide</h4>
        <label>
          Plan for{' '}
          <select value={perspective} onChange={(event) => setPerspective(event.target.value as typeof perspective)}>
            <option value="turn">Side to move</option>
            <option value="w">White</option>
            <option value="b">Black</option>
          </select>
        </label>
      </div>
      <p className="muted seven-q__intro">
        An application of <a href="https://www.chess.com/blog/GMAvetik/7q-method-your-roadmap-to-formulating-chess-plans-in-any-position" target="_blank" rel="noreferrer">GM Avetik Grigoryan’s 7Q method</a>.
        {' '}Explore the questions, combine the useful answers, then calculate candidate moves.
      </p>
      <div className="seven-q__priorities">
        <h5>{color === 'w' ? 'White' : 'Black'}: a possible plan</h5>
        {report.priorities.length ? (
          <ul>
            {report.priorities.map((plan) => <li key={plan.id}><strong>{plan.title}.</strong> {plan.action}</li>)}
          </ul>
        ) : <p>No clear plan emerges from these rules. Use the questions below to investigate the position.</p>}
        <p className="muted">Priorities to investigate, not a forced sequence. Opponent ideas and exchange suggestions need tactical checking.</p>
      </div>
      <div className="seven-q__questions">
        {report.questions.map((question) => (
          <details key={question.number}>
            <summary><span className="seven-q__number">Q{question.number}</span> {question.question}</summary>
            {question.findings.length ? (
              <ul>
                {question.findings.map((finding) => (
                  <li key={finding.id}>
                    <strong>{finding.title}</strong>
                    <p className="position-plans__reason">{finding.reason}</p>
                    <p>{finding.action}</p>
                  </li>
                ))}
              </ul>
            ) : <p className="muted">{question.fallback}</p>}
            {question.number === 7 && <p className="muted">Use this question especially when the first six have not given you a clear direction.</p>}
          </details>
        ))}
      </div>
    </section>
  );
}
