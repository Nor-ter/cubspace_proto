'use client';
import { MathText } from './math-text';
import { useState } from 'react';
import {
  Globe,
  Radio,
  SlidersHorizontal,
  Code2,
  Cpu,
  Magnet,
  Orbit,
  X,
} from 'lucide-react';
import type { adcsNodes } from '@/src/data/onboarding';
import { ZoomCanvas } from './zoom-canvas';
type Props = {
  nodes: typeof adcsNodes;
  active: number;
  onSelect: (index: number) => void;
};
const icons = [Globe, Radio, SlidersHorizontal, Code2, Cpu, Magnet, Orbit];
export function AdcsLoopDiagram({ nodes, active, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const node = nodes[active];
  return (
    <ZoomCanvas
      width={1120}
      height={220}
      overlay={
        open ? (
          <aside className="node-bubble" aria-label="Selected item description">
            <button aria-label="Close description" onClick={() => setOpen(false)}>
              <X />
            </button>
            <strong>{node.name}</strong>
            <p>
              <MathText text={node.fn} />
            </p>
            <small>
              <MathText text={node.props.join(' · ')} />
            </small>
          </aside>
        ) : undefined
      }
    >
      <div className="compact-flow">
        {nodes.map((n, i) => {
          const Icon = icons[i];
          return (
            <div className="compact-flow-item" key={n.id}>
              <button
                aria-pressed={active === i}
                aria-expanded={open && active === i}
                onClick={() => {
                  onSelect(i);
                  setOpen(true);
                }}
              >
                <Icon />
                <strong>{n.name}</strong>
              </button>
              {i < nodes.length - 1 && (
                <span className="compact-edge">
                  {n.flow}
                  <b>→</b>
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div className="compact-feedback">
        ← Closed-loop feedback: changes in attitude and angular rate are reflected in the next magnetic field measurement
      </div>
    </ZoomCanvas>
  );
}
