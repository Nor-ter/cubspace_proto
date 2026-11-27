export function Cited({ text }: { text: string }) {
  const match = text.match(/\s*\[([\d,\s]+)\]$/);
  if (!match) return text;
  const ids = match[1].split(',').map((id) => Number(id.trim()));

  return (
    <>
      {text.slice(0, match.index)}
      <span className="cite"> [{ids.join(', ')}]</span>
    </>
  );
}
