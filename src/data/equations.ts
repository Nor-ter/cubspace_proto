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
  '05': [
    '\\frac{\\mathrm{d}\\boldsymbol B_{\\mathrm{body}}}{\\mathrm{d}t}\\approx-\\boldsymbol\\omega\\times\\boldsymbol B',
    '\\boldsymbol m_{\\mathrm{cmd}}=-k\\frac{\\mathrm{d}\\boldsymbol B_{\\mathrm{body}}}{\\mathrm{d}t},\\quad k>0',
    '\\boldsymbol\\tau=\\boldsymbol m\\times\\boldsymbol B',
    '\\frac{\\mathrm{d}E_{\\mathrm{rot}}}{\\mathrm{d}t}=\\boldsymbol\\tau\\cdot\\boldsymbol\\omega\\approx-k\\lVert\\boldsymbol\\omega\\times\\boldsymbol B\\rVert^2\\leq0',
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
      name: 'Body-frame magnetic-field rate',
      formula: equations['05'][0],
      purpose:
        'It is an approximation that relates the rate of change of the magnetic field in the body coordinate system to the satellite rotation.',
      notation:
        'Bbody: Body coordinate system magnetic field (T) · ω: Angular velocity (rad/s) · dB/dt: Magnetic field change rate (T/s)',
    },
    {
      name: 'B-dot dipole command',
      formula: equations['05'][1],
      purpose:
        'Command the magnetic dipoles in the opposite direction of the measured magnetic field change rate.',
      notation:
        'mcmd: Command magnetic dipole (A m²) k: Positive control gain dB/dt: Rate of magnetic field change (T/s)',
    },
    {
      name: 'Magnetic torque',
      formula: equations['05'][2],
      purpose:
        'The magnetic dipole and the external magnetic field of the environment create a driving torque.',
      notation:
        'm: magnetic dipole (A·m²) · B: magnetic field (T) · τ: torque (N·m)',
    },
    {
      name: 'Rotational-energy rate',
      formula: equations['05'][3],
      purpose:
        'We show that the rotational energy does not increase in the ideal B-dot approximation.',
      notation:
        'Erot: rotational energy (J) · τ·ω: rotational power (W) · k: positive control gain',
    },
  ],
  '06': [
    {
      name: 'Fact, rule, and query',
      statement:
        'Fact: component(adcs, magnetometer).\nRule: contains(X,Y) :- component(X,Y).\nQuery: ?- contains(adcs, X).',
      purpose:
        'Demonstrates the basic structure of Prolog for querying relationships from stored facts and rules.',
    },
  ],
  '07': [
    {
      name: 'Reproducible change record',
      statement:
        'Change record = Target/Version + Reason + Impact + Reproduction Procedure/Results + Uncertainty + Reviewer',
      purpose:
        'Leave the scope, rationale, results and responsibilities of change traceable to the next team.',
    },
  ],
};
