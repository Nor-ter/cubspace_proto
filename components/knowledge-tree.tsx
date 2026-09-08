'use client';

import { Minus, Plus, RotateCcw } from 'lucide-react';
import { useRef, useState } from 'react';

const columns = [
  [{ kind: 'MISSION', title: 'ACRUX-II Mission', code: 'mission(acrux2).' }],
  [{ kind: 'SPACECRAFT', title: 'ACRUX-II', code: 'spacecraft(acrux2).' }],
  [{ kind: 'SUBSYSTEM', title: 'ADCS', code: 'subsystem(acrux2, adcs).' }],
  [
    {
      kind: 'FUNCTION',
      title: 'Sense field',
      code: 'function(adcs, sense_b).',
    },
    {
      kind: 'FUNCTION',
      title: 'Estimate B-dot',
      code: 'function(adcs, estimate_bdot).',
    },
    {
      kind: 'FUNCTION',
      title: 'Command dipole',
      code: 'function(adcs, command_m).',
    },
    {
      kind: 'FUNCTION',
      title: 'Generate torque',
      code: 'function(adcs, torque).',
    },
  ],
  [
    {
      kind: 'ITEM',
      title: 'Magnetometer A/B',
      code: 'measures(magnetometer, b_body).',
    },
    { kind: 'ITEM', title: 'B-dot controller', code: 'computes(obc, dB_dt).' },
    {
      kind: 'ITEM',
      title: 'Current driver',
      code: 'commands(driver, coil_current).',
    },
    {
      kind: 'ITEM',
      title: '3-axis magnetorquer',
      code: 'torque(M,B,T) :- cross(M,B,T).',
    },
  ],
];

export function KnowledgeTree() {
  const [scale, setScale] = useState(0.88);
  const [offset, setOffset] = useState({ x: 12, y: 0 });
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(
    null,
  );
  const zoom = (next: number) => setScale(Math.min(1.35, Math.max(0.55, next)));

  return (
    <div
      className="knowledge-tree"
      aria-label="5단계 ACRUX-II Prolog 관계 트리"
    >
      <div className="tree-toolbar">
        <span>RELATION VIEW · DEPTH 5</span>
        <div>
          <button aria-label="축소" onClick={() => zoom(scale - 0.1)}>
            <Minus />
          </button>
          <output>{Math.round(scale * 100)}%</output>
          <button aria-label="확대" onClick={() => zoom(scale + 0.1)}>
            <Plus />
          </button>
          <button
            aria-label="보기 초기화"
            onClick={() => {
              setScale(0.88);
              setOffset({ x: 12, y: 0 });
            }}
          >
            <RotateCcw />
          </button>
        </div>
      </div>
      <div
        className="tree-viewport"
        onWheel={(event) => {
          event.preventDefault();
          zoom(scale - event.deltaY * 0.001);
        }}
        onPointerDown={(event) => {
          drag.current = {
            x: event.clientX,
            y: event.clientY,
            ox: offset.x,
            oy: offset.y,
          };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!drag.current) return;
          setOffset({
            x: drag.current.ox + event.clientX - drag.current.x,
            y: drag.current.oy + event.clientY - drag.current.y,
          });
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
      >
        <div
          className="tree-map"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          }}
        >
          {columns.map((column, depth) => (
            <div className="tree-column" key={depth}>
              <p>0{depth + 1}</p>
              {column.map((node) => (
                <article key={node.title}>
                  <small>{node.kind}</small>
                  <strong>{node.title}</strong>
                  <code>{node.code}</code>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>
      <p className="tree-hint">
        드래그해서 이동 · 휠 또는 +/−로 확대/축소 · Mission → Spacecraft →
        Subsystem → Function → Item
      </p>
    </div>
  );
}
