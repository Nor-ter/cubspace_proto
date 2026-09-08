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
          <aside className="node-bubble" aria-label="선택 항목 설명">
            <button aria-label="설명 닫기" onClick={() => setOpen(false)}>
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
        ← 자세·각속도 변화가 다음 자기장 측정값에 반영되는 폐루프 피드백
      </div>
    </ZoomCanvas>
  );
}
