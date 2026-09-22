import { BdotGuide } from './bdot-guide';
import { AdcsVectorVisual } from './adcs-vector-visual';
import { EquationBlocks } from './equation-blocks';
import { MathFormula, MathText } from './math-text';
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
                  <span>유도 과정과 상세 수식</span>
                  <span aria-hidden="true">
                    <span className="derivation-collapsed">펼치기</span>
                    <span className="derivation-expanded">접기</span>
                  </span>
                </summary>
                <div className="equation-panel">
                  <EquationBlocks noteId={n.id} />
                </div>
              </details>
            ) : (
              <div className="equation-panel">
                <EquationBlocks noteId={n.id} />
              </div>
            )}
            {n.workedExample ? (
              <details className="worked-example">
                <summary>
                  <span className="worked-example-title">
                    <RoleIcon name="function" />
                    계산 예제
                  </span>
                  <span className="worked-example-state" aria-hidden="true">
                    <span className="worked-example-collapsed">펼치기</span>
                    <span className="worked-example-expanded">접기</span>
                  </span>
                </summary>
                <div className="worked-example-content">
                  <p className="worked-example-assumption" role="note">
                    {n.workedExample.assumption}
                  </p>
                  <ol className="worked-example-calculation">
                    {[
                      ['01', '입력값', n.workedExample.inputFormula],
                      ['02', '계산 과정', n.workedExample.calculationFormula],
                      ['03', '계산 결과', n.workedExample.resultFormula],
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
                    <h5>적용 범위와 한계</h5>
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
                    <h5>계산 결과 해석</h5>
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
                    <h5>설계에 적용하기</h5>
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
                  적용 예시
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
