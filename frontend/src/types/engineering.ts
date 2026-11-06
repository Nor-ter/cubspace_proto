export type EquationBlock = {
  name: string;
  purpose: string;
  formula?: string;
  statement?: string;
  notation?: string;
};

export type EngineeringReviewCheck = {
  label: string;
  text: string;
};

export type WorkedExample = {
  assumption: string;
  inputFormula: string;
  calculationFormula: string;
  resultFormula: string;
  limitations: {
    formula: string;
    label: string;
  }[];
  meaning: [string, string];
  bridge: string;
  practice: {
    index: string;
    title: string;
    formula: string;
    description: string;
  }[];
};

export type EngineeringNote = {
  id: string;
  section: string;
  title: string;
  principle: string;
  equation: string;
  example: string;
  workedExample?: WorkedExample;
  checks: string[];
  reviewChecks?: EngineeringReviewCheck[];
  source: string;
  url: string;
  equationBlocks: EquationBlock[];
  collapseEquations?: boolean;
};
