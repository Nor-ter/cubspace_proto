import { BdotGuide } from './bdot-guide';
import { AdcsVectorVisual } from './adcs-vector-visual';
import { MathFormula, MathText } from './math-text';
import { equations } from '@/src/data/equations';
import { RoleIcon } from './role-icon';
import { engineeringNotes } from '@/src/data/engineering';
export function EngineeringNotes({
  lessonId,
  section,
}: {
  lessonId?: string;
  section?: string;
}) {
  return (
    <>
      {engineeringNotes
        .filter((n) => (lessonId ? n.id === lessonId : n.section === section))
        .map((n) => (
          <aside className="engineering-note" key={n.id}>
            <h3>
              <RoleIcon name={n.section} />
              {n.title}
            </h3>
            {n.id === '05' && <BdotGuide />}
            <p>
              <MathText text={n.principle} />
            </p>
            {n.id === '03' && <AdcsVectorVisual />}
            {n.id === '03' ? (
              <details className="derivation-disclosure">
                <summary>
                  <span>Derivation · 상세 수식 보기</span>
                  <span aria-hidden="true">
                    <span className="derivation-collapsed">Show</span>
                    <span className="derivation-expanded">Hide</span>
                  </span>
                </summary>
                <div className="equation-panel">
                  {equations[n.id].map((tex) => (
                    <MathFormula key={tex} tex={tex} display />
                  ))}
                </div>
              </details>
            ) : (
              <div className="equation-panel">
                {equations[n.id] ? (
                  equations[n.id].map((tex) => (
                    <MathFormula key={tex} tex={tex} display />
                  ))
                ) : (
                  <code>{n.equation}</code>
                )}
                {n.id === '02' && (
                  <p className="equation-key">
                    charge: 충전 · load: 부하 · loss: 손실 · t: 시간
                  </p>
                )}
              </div>
            )}
            {n.workedExample ? (
              <details className="worked-example">
                <summary>
                  <span className="worked-example-title">
                    <RoleIcon name="function" />
                    Worked Example · 원리를 적용하면
                  </span>
                  <span className="worked-example-state" aria-hidden="true">
                    <span className="worked-example-collapsed">Collapsed</span>
                    <span className="worked-example-expanded">Expanded</span>
                  </span>
                </summary>
                <div className="worked-example-content">
                  <p className="worked-example-assumption" role="note">
                    {n.workedExample.assumption}
                  </p>
                  <ol className="worked-example-calculation">
                    {[
                      ['01', 'Input Values', n.workedExample.inputFormula],
                      ['02', 'Calculation', n.workedExample.calculationFormula],
                      ['03', 'Result', n.workedExample.resultFormula],
                    ].map(([index, label, formula]) => (
                      <li key={label}>
                        <span>{index}</span>
                        <div>
                          <h5>{label}</h5>
                          <MathFormula tex={formula} display />
                        </div>
                      </li>
                    ))}
                  </ol>

                  <section className="worked-example-limitations">
                    <h5>Important Limitation</h5>
                    <div>
                      {n.workedExample.limitations.map((item) => (
                        <article key={item.label}>
                          <MathFormula tex={item.formula} />
                          <span aria-hidden="true">→</span>
                          <strong>{item.label}</strong>
                        </article>
                      ))}
                    </div>
                  </section>

                  <section className="worked-example-meaning">
                    <h5>What This Result Means</h5>
                    {n.workedExample.meaning.map((text) => (
                      <p key={text}>
                        <MathText text={text} />
                      </p>
                    ))}
                    <p className="worked-example-bridge">
                      {n.workedExample.bridge}
                    </p>
                  </section>

                  <section className="worked-example-practice">
                    <h5>In Practice</h5>
                    <ol>
                      {n.workedExample.practice.map((step) => (
                        <li key={step.index}>
                          <span>{step.index}</span>
                          <div>
                            <h6>{step.title}</h6>
                            <MathFormula tex={step.formula} display />
                            <p>{step.description}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </section>
                </div>
              </details>
            ) : (
              <>
                <h4>
                  <RoleIcon name="function" />
                  원리를 적용하면
                </h4>
                <p>
                  <MathText text={n.example} />
                </p>
              </>
            )}
            <h4>
              <RoleIcon name="review" />
              설계 검토에서 확인할 것
            </h4>
            {n.reviewChecks ? (
              <ul className="review-labels">
                {n.reviewChecks.map((check) => (
                  <li key={check.label}>
                    <h5>{check.label}</h5>
                    <p>
                      <MathText text={check.text} />
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <ul>
                {n.checks.map((c) => (
                  <li key={c}>
                    <MathText text={c} />
                  </li>
                ))}
              </ul>
            )}
            <p className="source-note">
              근거: {n.source} ·{' '}
              <a href={n.url} target="_blank" rel="noreferrer">
                공식 자료 확인
              </a>
            </p>
          </aside>
        ))}
    </>
  );
}
