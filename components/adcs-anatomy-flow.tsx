'use client';

import { useState } from 'react';
import {
  ArrowDown,
  CornerUpLeft,
  Cpu,
  Gauge,
  Magnet,
  Radio,
  Zap,
} from 'lucide-react';

const flowNodes = [
  {
    stage: 'SENSE',
    name: 'Magnetometer A/B',
    kind: 'ADCS component',
    icon: Radio,
    role: '위성 몸체 좌표계에서 주변 자기장 벡터를 측정합니다.',
    input: 'Earth magnetic field B · EPS regulated power',
    output: 'Timestamped Bx / By / Bz data',
    note: '두 센서의 실제 선택·중복 운용 방식은 확정 사양에서 확인해야 합니다.',
  },
  {
    stage: 'DECIDE',
    name: 'B-dot @ OBC',
    kind: 'Flight software',
    icon: Cpu,
    role: '측정값을 보정·필터링하고 dB/dt에서 자기 쌍극자 명령을 계산합니다.',
    input: 'Bx / By / Bz · timestamp · mode command',
    output: 'Dipole command m-command',
    note: 'B-dot은 OBC에서 실행되는 소프트웨어이며 독립된 하드웨어 부품이 아닙니다.',
  },
  {
    stage: 'ACT',
    name: 'Deneb Magnetorquer',
    kind: 'ADCS component',
    icon: Magnet,
    role: '명령된 전류로 자기 쌍극자 m을 만들어 지구 자기장 B와 상호작용합니다.',
    input: 'm-command · EPS regulated power · magnetic field B',
    output: 'Magnetic torque τ = m × B',
    note: '실제 축 구성, 최대 자기모멘트와 전류 제한은 보드 사양 검토가 필요합니다.',
  },
  {
    stage: 'OBSERVE',
    name: 'Rotation State',
    kind: 'Spacecraft state · not hardware',
    icon: Gauge,
    role: '자기 토크가 위성의 자세와 각속도 ω를 바꾸는 결과를 나타냅니다.',
    input: 'Magnetic torque · inertia · disturbance torque',
    output: 'Changed attitude / angular rate ω',
    note: 'OBSERVE는 신규 센서나 부품이 아니라 다음 측정에 반영되는 회전 상태입니다.',
  },
] as const;

const edges = [
  { type: 'DATA', label: 'Bx / By / Bz' },
  { type: 'COMMAND', label: 'Dipole command' },
  { type: 'INTERACTION', label: 'm × B torque' },
] as const;

export function AdcsAnatomyFlow() {
  const [selected, setSelected] = useState(0);
  const activeNode = flowNodes[selected];

  return (
    <section className="adcs-anatomy-flow" aria-label="ADCS closed-loop component flow">
      <div className="adcs-power-rail">
        <Zap aria-hidden="true" />
        <div>
          <span>POWER SUPPORT</span>
          <strong>EPS · Regulated power</strong>
          <small>Magnetometer · OBC · Deneb</small>
        </div>
      </div>

      <ol className="adcs-flow-chain">
        {flowNodes.map((node, index) => {
          const Icon = node.icon;
          const edge = edges[index];
          return (
            <li key={node.stage}>
              <button
                type="button"
                aria-pressed={selected === index}
                onClick={() => setSelected(index)}
              >
                <span className="adcs-stage">{node.stage}</span>
                <Icon aria-hidden="true" />
                <span className="adcs-node-name">
                  <strong>{node.name}</strong>
                  <small>{node.kind}</small>
                </span>
              </button>
              {edge && (
                <div
                  className={`adcs-flow-edge adcs-flow-${edge.type.toLowerCase()}`}
                >
                  <span>{edge.type}</span>
                  <strong>{edge.label}</strong>
                  <ArrowDown aria-hidden="true" />
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <div className="adcs-feedback-edge">
        <CornerUpLeft aria-hidden="true" />
        <div>
          <span>STATE FEEDBACK</span>
          <strong>Rotation state → new magnetic-field measurement</strong>
        </div>
      </div>

      <article className="adcs-node-card" aria-live="polite">
        <header>
          <span>{activeNode.stage}</span>
          <small>{activeNode.kind}</small>
        </header>
        <h5>{activeNode.name}</h5>
        <p>{activeNode.role}</p>
        <dl>
          <div>
            <dt>INPUT</dt>
            <dd>{activeNode.input}</dd>
          </div>
          <div>
            <dt>OUTPUT</dt>
            <dd>{activeNode.output}</dd>
          </div>
        </dl>
        <p className="adcs-node-note">{activeNode.note}</p>
      </article>
    </section>
  );
}
