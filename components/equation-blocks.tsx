import { equationBlocks } from '@/src/data/equations';
import { MathFormula } from './math-text';

export function EquationBlocks({ noteId }: { noteId: string }) {
  const blocks = equationBlocks[noteId];

  if (!blocks) return null;

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
              <strong>기호와 단위</strong>
              <span>{block.notation}</span>
            </p>
          )}
        </article>
      ))}
    </div>
  );
}
