import { BdotGuide } from './bdot-guide';
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
