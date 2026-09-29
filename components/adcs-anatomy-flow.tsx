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
    role: 'Measures the ambient magnetic field vector in the satellite body frame.',
    input: 'Earth magnetic field B · EPS regulated power',
    output: 'Timestamped Bx / By / Bz data',
    note: 'The actual selection and redundant operation of the two sensors must be confirmed in the final specification.',
  },
  {
    stage: 'DECIDE',
    name: 'B-dot @ OBC',
    kind: 'Flight software',
    icon: Cpu,
    role: 'Calibrates and filters the measurements and computes the magnetic dipole command from dB/dt.',
    input: 'Bx / By / Bz · timestamp · mode command',
    output: 'Dipole command m-command',
    note: 'B-dot is software running on the OBC, not a separate hardware component.',
  },
  {
    stage: 'ACT',
    name: 'Deneb Magnetorquer',
    kind: 'ADCS component',
    icon: Magnet,
    role: 'Produces a magnetic dipole m from the commanded current, which interacts with the geomagnetic field B.',
    input: 'm-command · EPS regulated power · magnetic field B',
    output: 'Magnetic torque τ = m × B',
    note: 'The actual axis configuration, maximum magnetic moment and current limits require review of the board specification.',
  },
  {
    stage: 'OBSERVE',
    name: 'Rotational state',
    kind: 'Satellite state (not a component)',
    icon: Gauge,
    role: 'Represents the result of magnetic torque changing the satellite’s attitude and angular velocity ω.',
    input: 'Magnetic torque · inertia · disturbance torque',
    output: 'Changed attitude / angular rate ω',
    note: 'OBSERVE is not a new sensor or component; it is the rotational state reflected in the next measurement.',
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
    <section
      className="adcs-anatomy-flow"
      aria-label="ADCS closed-loop configuration and signal flow"
    >
      <div className="adcs-power-rail">
        <Zap aria-hidden="true" />
        <div>
          <span>Power supply</span>
          <strong>EPS · regulated power</strong>
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
          <span>State feedback</span>
          <strong>Change in rotational state → next magnetic field measurement</strong>
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
            <dt>Input</dt>
            <dd>{activeNode.input}</dd>
          </div>
          <div>
            <dt>Output</dt>
            <dd>{activeNode.output}</dd>
          </div>
        </dl>
        <p className="adcs-node-note">{activeNode.note}</p>
      </article>
    </section>
  );
}
