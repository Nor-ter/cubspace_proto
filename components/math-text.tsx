import { Children, cloneElement, isValidElement, type ReactNode } from 'react';
import katex from 'katex';
import { explicitMath, mathTokenMatcher, mathUnits } from '@/src/math-token';
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
  for (const match of text.matchAll(mathTokenMatcher)) {
    const index = match.index!;
    const token = match[0];
    result.push(text.slice(end, index));
    let tex = explicitMath[token] ?? mathUnits[token];
    if (!tex && /^\d+(?:\.\d+)?$/.test(token)) tex = token;
    if (!tex) {
      const unit = Object.keys(mathUnits)
        .sort((a, b) => b.length - a.length)
        .find((u) => token.endsWith(u))!;
      tex =
        token
          .slice(0, -unit.length)
          .trim()
          .replace('≤', String.raw`\le`)
          .replace('≥', String.raw`\ge`) +
        String.raw`\,` +
        mathUnits[unit];
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
