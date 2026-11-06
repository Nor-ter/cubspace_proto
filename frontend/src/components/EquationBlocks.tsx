import { MathFormula } from './MathText';
import type { EquationBlock } from '@/types/engineering';

export function EquationBlocks({ blocks }: { blocks: EquationBlock[] }) {
  if (!blocks.length) return null;

  return (
    <div className="equation-block-list">
      {blocks.map((block, index) => (
        <article className="equation-block" key={block.name}>
          <header>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h5>{block.name}</h5>
          </header>
          {block.formula ? (
            <MathFormula tex={block.formula} display />
          ) : (
            <code className="equation-statement">{block.statement}</code>
          )}
          <p className="equation-purpose">{block.purpose}</p>
          {block.notation && (
            <p className="equation-notation">
              <strong>Symbols and Units</strong>
              <span>{block.notation}</span>
            </p>
          )}
        </article>
      ))}
    </div>
  );
}
