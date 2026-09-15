import { BdotGuide } from './bdot-guide';
import { MathFormula, MathText } from './math-text';
import {
  equations,
  equationLabels,
  statementLabels,
} from '@/src/data/equations';
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
            <div className="equation-blocks">
              {(equations[n.id] ?? n.equation.split('\n')).map(
                (formula, index) => {
                  const label = (equationLabels[n.id] ?? statementLabels[n.id])[
                    index
                  ];
                  return (
                    <section
                      className="equation-panel"
                      key={formula}
                      aria-label={label.name}
                    >
                      <h4 className="equation-name">{label.name}</h4>
                      <div
                        className="equation-scroll"
                        role="region"
                        aria-label={`${label.name} 식`}
                        tabIndex={0}
                      >
                        {equations[n.id] ? (
                          <MathFormula tex={formula} display />
                        ) : (
                          <code>{formula}</code>
                        )}
                      </div>
                      <p className="equation-purpose">{label.purpose}</p>
                      {equationLabels[n.id] && (
                        <p className="equation-key">
                          기호·단위: {equationLabels[n.id][index].symbols}
                        </p>
                      )}
                    </section>
                  );
                },
              )}
            </div>
            <h4>
              <RoleIcon name="function" />
              원리를 적용하면
            </h4>
            <p>
              <MathText text={n.example} />
            </p>
            <h4>
              <RoleIcon name="review" />
              설계 검토에서 확인할 것
            </h4>
            <ul>
              {n.checks.map((c) => (
                <li key={c}>
                  <MathText text={c} />
                </li>
              ))}
            </ul>
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
