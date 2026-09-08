'use client';

import type { adcsNodes } from '@/src/data/onboarding';

type Props = {
  nodes: typeof adcsNodes;
  active: number;
  onSelect: (index: number) => void;
};

export function AdcsLoopDiagram({ nodes, active, onSelect }: Props) {
  return (
    <div
      className="adcs-loop"
      aria-label="B-dot detumbling closed-loop functional model"
    >
      <div className="adcs-loop-row">
        {nodes.map((node, index) => (
          <button
            key={node.id}
            className={active === index ? 'active' : ''}
            onClick={() => onSelect(index)}
          >
            <small>{node.type.toUpperCase()}</small>
            <strong>{node.name}</strong>
            <span>{node.fn}</span>
            {index < nodes.length - 1 && (
              <i aria-hidden="true">
                <b>{node.flow}</b>
                <em>→</em>
              </i>
            )}
          </button>
        ))}
      </div>
      <div className="adcs-feedback" aria-hidden="true">
        <span>↖ 자세·각속도가 다음 B-body 측정값을 바꾸는 폐루프 피드백</span>
      </div>
      <div className="adcs-equations">
        <span>
          <b>CONTROL</b> m<sub>cmd</sub> = −K · dB/dt
        </span>
        <span>
          <b>PHYSICS</b> τ = m × B
        </span>
        <span>
          <b>LIMIT</b> B와 평행한 축의 토크는 순간적으로 만들 수 없음
        </span>
      </div>
      <p className="adcs-source-note">
        검증 기준 ·{' '}
        <a href="https://www.nasa.gov/smallsat-institute/sst-soa/guidance-navigation-and-control/" target="_blank" rel="noreferrer">NASA Small Spacecraft GNC</a>
        {' · '}
        <a href="https://ntrs.nasa.gov/api/citations/19970017186/downloads/19970017186.pdf" target="_blank" rel="noreferrer">NASA B-Dot control paper</a>
      </p>
    </div>
  );
}
