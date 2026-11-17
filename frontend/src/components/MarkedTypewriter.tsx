import { TypewriterText } from './TypewriterText';

/**
 * Types `text` on as one sequence, with each phrase in `marks` under the
 * green highlighter. Phrases are matched in order of appearance; one that
 * is not found is simply left unmarked. `start` continues the typing count
 * from earlier text, so several lines type as one sequence.
 */
export function MarkedTypewriter({
  text,
  marks,
  start: offset = 0,
}: {
  text: string;
  marks: readonly string[];
  start?: number;
}) {
  const parts: { text: string; marked: boolean }[] = [];
  let rest = text;
  for (const mark of marks) {
    const at = rest.indexOf(mark);
    if (at < 0) continue;
    if (at > 0) parts.push({ text: rest.slice(0, at), marked: false });
    parts.push({ text: mark, marked: true });
    rest = rest.slice(at + mark.length);
  }
  if (rest) parts.push({ text: rest, marked: false });

  let start = offset;
  return parts.map((part, index) => {
    // Spaces at a part's edges become plain spaces between the parts, so
    // the highlighter never starts or ends on a blank.
    const lead = /^\s/.test(part.text);
    const trail = /\s$/.test(part.text);
    const words = part.text.trim();
    const from = start;
    start += words.length;
    const typed = <TypewriterText text={words} start={from} when="view" />;
    return (
      <span key={index}>
        {lead && ' '}
        {part.marked ? <span className="mark-green">{typed}</span> : typed}
        {trail && ' '}
      </span>
    );
  });
}
