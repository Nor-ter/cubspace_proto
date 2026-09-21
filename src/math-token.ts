export const mathUnits: Record<string, string> = {
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

export const explicitMath: Record<string, string> = {
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

const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const unitPattern = Object.keys(mathUnits)
  .sort((a, b) => b.length - a.length)
  .map(escape)
  .join('|');

const explicitPattern = Object.keys(explicitMath)
  .sort((a, b) => b.length - a.length)
  .map(escape)
  .join('|');

const quantityPattern = String.raw`(?<![\w§.\d-])(?:[<>≤≥]\s*)?\d+(?:\.\d+)?\s*(?:${unitPattern})(?![A-Za-z0-9_])`;
const standaloneUnitPattern = String.raw`(?<![A-Za-z0-9_])(?:${Object.keys(
  mathUnits,
)
  .filter((unit) => unit.length > 1)
  .sort((a, b) => b.length - a.length)
  .map(escape)
  .join('|')})(?![A-Za-z0-9_])`;

export const mathTokenMatcher = new RegExp(
  `${explicitPattern}|${quantityPattern}|${standaloneUnitPattern}` +
    String.raw`|(?<![\w§.\d-])\d+(?:\.\d+)?(?![\w.\d-])`,
  'g',
);

export function findMathTokens(text: string) {
  return Array.from(text.matchAll(mathTokenMatcher), (match) => match[0]);
}
