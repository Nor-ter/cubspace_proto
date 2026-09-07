import { assignmentFields, questions, chains } from './data/content';
export type Draft = Record<string, string>;
export type LearningState = {
  version: 1;
  completed: number[];
  answers: Record<string, string>;
  order: string[];
  explanation: string;
  drafts: Draft[];
  reviewed: boolean;
};
export const freshState = (): LearningState => ({
  version: 1,
  completed: [],
  answers: {},
  order: [
    'MPPT',
    'Spacecraft Loads',
    'Sunlight',
    'Voltage Regulator',
    'Solar Panel',
    'Battery / Bus',
  ],
  explanation: '',
  drafts: [{}, {}],
  reviewed: false,
});
export function restoreState(raw: string | null): LearningState {
  const clean = freshState();
  if (!raw) return clean;
  try {
    const x = JSON.parse(raw);
    if (x?.version !== 1) return clean;
    if (Array.isArray(x.completed))
      clean.completed = [
        ...new Set<number>(
          x.completed.filter(
            (n: unknown) =>
              Number.isInteger(n) && Number(n) >= 0 && Number(n) < 5,
          ),
        ),
      ];
    if (x.answers && typeof x.answers === 'object')
      for (const q of questions) {
        const a = x.answers[q.id];
        if (typeof a === 'string' && q.options[Number(a)] !== undefined)
          clean.answers[q.id] = a;
      }
    if (
      Array.isArray(x.order) &&
      x.order.length === 6 &&
      new Set(x.order).size === 6 &&
      x.order.every(
        (s: unknown) => typeof s === 'string' && chains[0].nodes.includes(s),
      )
    )
      clean.order = x.order;
    if (typeof x.explanation === 'string')
      clean.explanation = x.explanation.slice(0, 4000);
    if (Array.isArray(x.drafts))
      clean.drafts = [0, 1].map((i) =>
        Object.fromEntries(
          assignmentFields.map(([k]) => [
            k,
            typeof x.drafts[i]?.[k] === 'string'
              ? x.drafts[i][k].slice(0, 4000)
              : '',
          ]),
        ),
      );
    clean.reviewed = x.reviewed === true;
    return clean;
  } catch {
    return clean;
  }
}
export function grade(s: LearningState) {
  const correct = questions.filter(
    (q) => s.answers[q.id] === String(q.answer),
  ).length;
  const chainCorrect = s.order.every((n, i) => n === chains[0].nodes[i]);
  const missing = s.drafts.flatMap((d, i) =>
    assignmentFields
      .filter(([key]) => !d[key]?.trim())
      .map(([, label]) => `${i === 0 ? 'Sensor' : 'Heater'}: ${label}`),
  );
  const ready =
    correct === questions.length &&
    chainCorrect &&
    s.explanation.trim().length >= 40 &&
    missing.length === 0 &&
    s.reviewed;
  return {
    correct,
    total: questions.length + 1,
    score: correct + Number(chainCorrect),
    chainCorrect,
    missing,
    ready,
  };
}
export function moveItem(items: string[], index: number, direction: number) {
  const next = index + direction;
  if (next < 0 || next >= items.length) return items;
  const copy = [...items];
  [copy[index], copy[next]] = [copy[next], copy[index]];
  return copy;
}
