export const equations: Record<string, string[]> = {
  '02': [
    '\\frac{GM}{r^2}=\\frac{v^2}{r}\\quad\\Longrightarrow\\quad v=\\sqrt{\\frac{GM}{r}}',
    '\\Delta E_{\\mathrm{battery}}=\\int_{t_0}^{t_1}\\left(P_{\\mathrm{charge}}-P_{\\mathrm{load}}-P_{\\mathrm{loss}}\\right)\\,\\mathrm{d}t',
    'E\\,[\\mathrm{Wh}]=\\frac{P\\,[\\mathrm{W}]\\,t\\,[\\mathrm{s}]}{3600}',
  ],
  '03': [
    '\\boldsymbol H=\\mathbf I\\boldsymbol\\omega',
    '\\mathbf I\\frac{\\mathrm{d}\\boldsymbol\\omega}{\\mathrm{d}t}+\\boldsymbol\\omega\\times(\\mathbf I\\boldsymbol\\omega)=\\boldsymbol\\tau_{\\mathrm{ext}}',
    '\\boldsymbol\\tau_{\\mathrm{mag}}=\\boldsymbol m\\times\\boldsymbol B,\\qquad |\\boldsymbol\\tau|=|\\boldsymbol m|\\,|\\boldsymbol B|\\sin\\theta',
  ],
  '04': [
    '\\lVert\\boldsymbol\\omega\\rVert<\\omega_{\\mathrm{lim}},\\qquad t\\leq T_{\\mathrm{lim}}',
  ],
};

export type EquationBlock = {
  name: string;
  purpose: string;
  formula?: string;
  statement?: string;
  notation?: string;
};

export const equationBlocks: Record<string, EquationBlock[]> = {
  '01': [
    {
      name: 'Traceable engineering claim',
      statement:
        'Assertion → Requirement ID → Model element → Verification method → Result/condition → Review record',
      purpose:
        'Link the basis for judgment and verification results so that the next reviewer can reproduce it.',
    },
  ],
  '02': [
    {
      name: 'Circular-orbit speed',
      formula: equations['02'][0],
      purpose:
        'Find the circular speed from the relationship between gravity and centripetal acceleration.',
      notation:
        'G: Gravitational constant M: Central object mass (kg) r: Central distance (m) v: Velocity (m/s)',
    },
    {
      name: 'Battery energy balance',
      formula: equations['02'][1],
      purpose:
        'Calculate the net effect of charge, load, and power loss over a certain period of time.',
      notation:
        'Pcharge, Pload, Ploss: Power (W) · t: Time (s) · ΔE: Energy change (J)',
    },
    {
      name: 'Power-to-energy conversion',
      formula: equations['02'][2],
      purpose:
        'Convert power and operating time to Wh, a unit of battery energy.',
      notation: 'P: Power (W) · t: Time (s) · E: Energy (Wh)',
    },
  ],
  '03': [
    {
      name: 'Angular momentum',
      formula: equations['03'][0],
      purpose:
        "We relate the satellite's inertial properties and its current rotation state to its angular momentum.",
      notation:
        'H: Angular momentum (kg·m²/s) · I: Inertia matrix (kg·m²) · ω: Angular velocity (rad/s)',
    },
    {
      name: 'Rigid-body rotational dynamics',
      formula: equations['03'][1],
      purpose:
        "Describes how external torque changes the satellite's angular velocity over time.",
      notation:
        'I: Inertia matrix (kg·m²) · ω: Angular velocity (rad/s) · τext: External torque (N·m) · t: Time (s)',
    },
    {
      name: 'Magnetic torque',
      formula: equations['03'][2],
      purpose:
        'Calculate the torque produced by the commanded magnetic dipole and the environmental magnetic field.',
      notation:
        'm: magnetic dipole (A·m²) · B: magnetic field (T) · θ: angle between two vectors · τmag: magnetic torque (N·m)',
    },
  ],
  '04': [
    {
      name: 'Detumbling acceptance condition',
      formula: equations['04'][0],
      purpose:
        'Expresses whether the rotation state has reached the allowable limit within a given time.',
      notation:
        'ω: Angular velocity (rad/s or °/s) ωlim: Tolerance limit Tlim: Completion time limit',
    },
    {
      name: 'Function-to-implementation allocation',
      statement:
        'Function: Rotation reduction / Implementation: Sensor + OBC control SW + magnetic actuator',
      purpose:
        'Distinguish between necessary functions and the hardware/software that performs those functions.',
    },
  ],
  '05': [
    {
      name: 'Reproducible change record',
      statement:
        'Change record = Target/Version + Reason + Impact + Reproduction Procedure/Results + Uncertainty + Reviewer',
      purpose:
        'Leave the scope, rationale, results and responsibilities of change traceable to the next team.',
    },
  ],
};
