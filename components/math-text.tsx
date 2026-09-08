import { Children, cloneElement, isValidElement, type ReactNode } from 'react';
import katex from 'katex';
const units: Record<string, string> = {
  cm: String.raw`\mathrm{cm}`,
  mm: String.raw`\mathrm{mm}`,
  분: String.raw`\mathrm{min}`,
  'J/K': String.raw`\mathrm J/\mathrm K`,
  Wh: String.raw`\mathrm{Wh}`,
  W: String.raw`\mathrm W`,
  V: String.raw`\mathrm V`,
  A: String.raw`\mathrm A`,
  s: String.raw`\mathrm s`,
  J: String.raw`\mathrm J`,
  Hz: String.raw`\mathrm{Hz}`,
  T: String.raw`\mathrm T`,
  µT: String.raw`\mu\mathrm T`,
  µN·m: String.raw`\mu\mathrm N\!\cdot\!\mathrm m`,
  N·m: String.raw`\mathrm N\!\cdot\!\mathrm m`,
  'A·m²': String.raw`\mathrm A\!\cdot\!\mathrm m^2`,
  'kg·m²': String.raw`\mathrm{kg}\!\cdot\!\mathrm m^2`,
  '°/s': String.raw`{}^\circ/\mathrm s`,
  '°C': String.raw`{}^\circ\mathrm C`,
  'rad/s': String.raw`\mathrm{rad}/\mathrm s`,
  'T/s': String.raw`\mathrm T/\mathrm s`,
  '%': String.raw`\%`,
};
const explicit: Record<string, string> = {
  'P=VI': String.raw`P=VI`,
  'τ=m×B': String.raw`\boldsymbol\tau=\boldsymbol m\times\boldsymbol B`,
  τ·ω: String.raw`\boldsymbol\tau\cdot\boldsymbol\omega`,
  'm×B': String.raw`\boldsymbol m\times\boldsymbol B`,
  'm × B': String.raw`\boldsymbol m\times\boldsymbol B`,
  'dB/dt': String.raw`\frac{\mathrm d\boldsymbol B}{\mathrm dt}`,
  'C·dT/dt=Q입력−Q출력': String.raw`C\frac{\mathrm dT}{\mathrm dt}=\dot Q_{\mathrm{in}}-\dot Q_{\mathrm{out}}`,
  'SOC ≥60%': String.raw`\mathrm{SOC}\ge60\%`,
  'm=0.1 A·m²': String.raw`m=0.1\,\mathrm A\!\cdot\!\mathrm m^2`,
  'B=30 µT': String.raw`B=30\,\mu\mathrm T`,
};
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const quantity = String.raw`(?:[<>≤≥]\s*)?\d+(?:\.\d+)?\s*(?:J/K|cm|mm|분|µN·m|A·m²|kg·m²|rad/s|°/s|°C|N·m|µT|T/s|Wh|Hz|W|V|A|J|s|T|%)`;
const matcher = new RegExp(
  Object.keys(explicit)
    .sort((a, b) => b.length - a.length)
    .map(escape)
    .join('|') +
    '|' +
    quantity +
    '|' +
    Object.keys(units)
      .filter((u) => u.length > 1)
      .sort((a, b) => b.length - a.length)
      .map(escape)
      .join('|') +
    String.raw`|(?<![\w§.\d-])\d+(?:\.\d+)?(?![\w.\d-])`,
  'g',
);
export function MathFormula({
  tex,
  display = false,
}: {
  tex: string;
  display?: boolean;
}) {
  return (
    <span
      className={display ? 'math-display' : 'math-inline'}
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(tex, {
          displayMode: display,
          throwOnError: true,
          trust: false,
          output: 'htmlAndMathml',
          strict: 'ignore',
        }),
      }}
    />
  );
}
export function MathText({ text }: { text: string }) {
  const result = [];
  let end = 0;
  for (const match of text.matchAll(matcher)) {
    const index = match.index!;
    const token = match[0];
    result.push(text.slice(end, index));
    let tex = explicit[token] ?? units[token];
    if (!tex && /^\d+(?:\.\d+)?$/.test(token)) tex = token;
    if (!tex) {
      const unit = Object.keys(units)
        .sort((a, b) => b.length - a.length)
        .find((u) => token.endsWith(u))!;
      tex =
        token
          .slice(0, -unit.length)
          .trim()
          .replace('≤', String.raw`\le`)
          .replace('≥', String.raw`\ge`) +
        String.raw`\,` +
        units[unit];
    }
    result.push(<MathFormula key={index} tex={tex} />);
    end = index + token.length;
  }
  result.push(text.slice(end));
  return <>{result}</>;
}

export function MathRich({ children }: { children: ReactNode }) {
  return (
    <>
      {Children.map(children, (child) => {
        if (typeof child === 'string') return <MathText text={child} />;
        if (
          isValidElement<{ children?: ReactNode }>(child) &&
          child.props.children &&
          child.type !== 'code' &&
          child.type !== 'pre' &&
          child.type !== MathFormula &&
          child.type !== MathText
        )
          return cloneElement(
            child,
            {},
            <MathRich>{child.props.children}</MathRich>,
          );
        return child;
      })}
    </>
  );
}
