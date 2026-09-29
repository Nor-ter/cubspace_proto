type EngineeringReviewCheck = {
  label: string;
  text: string;
};

type WorkedExample = {
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

type EngineeringNote = {
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
};

export const engineeringNotes = [
  {
    id: '01',
    section: 'mission',
    title: 'Knowledge carries forward only when decisions can be reproduced',
    principle:
      'First define the system boundary and success conditions, then confirm claims with observations. A model is a purpose-driven simplification of reality, so its accuracy cannot be guaranteed without sources, versions and assumptions.',
    equation:
      'Claim → requirement ID → model element → verification method → result and conditions → review record',
    example:
      'Example: instead of “the rotation has decreased enough”, record the angular velocity vector, measurement frame, threshold, dwell time and sensor validity. Distinguish confirming that requirements are met (verification) from confirming fitness for the mission purpose (validation).',
    checks: [
      'Separate source statements, calculated results, teaching assumptions and unconfirmed items (TBD).',
      'Review and approval are not substitutes for test data. Confirm the link between the actual configuration, test conditions and evidence.',
    ],
    source: 'NASA Systems Engineering Handbook; MADE Modeling §1–2',
    url: 'https://www.nasa.gov/reference/systems-engineering-handbook/',
  },
  {
    id: '02',
    section: 'mission',
    title: 'Think about orbital motion and the energy budget separately',
    principle:
      'In a circular orbit, gravity provides the centripetal acceleration that continuously changes the direction of the velocity. The satellite is in continuous free fall. Attitude control changes the satellite’s orientation and rotation; the magnetic control in this teaching example does not control orbital altitude.',
    equation:
      'GM/r² = v²/r → v = √(GM/r)\nΔE_battery = ∫(P_charge − P_load − P_loss)dt\nE(Wh) = P(W) × t(s) / 3600',
    example:
      'ConOps §2: subtracting the stated 0.20 W load from the average available power of 0.31 W gives 0.11 W (the source states about 0.1 W). If losses are already included in the value, do not subtract them twice. 5 V × 0.25 A × 10 s = 12.5 J ≈ 0.00347 Wh, and the source’s 0.005 Wh is a conservative estimate.',
    checks: [
      'The sizes, orbital altitude and times in this figure are not to scale and are not flight analysis values. r is the distance from the centre of the Earth.',
      'The ConOps initial 26.46 Wh is a nominal capacity × SOC estimate, not spare energy that can all be used. Discharge limits, temperature, degradation and voltage limits must be taken into account. ConOps §3.1.2: there is an exception to deploy the antenna first if the charge is below 2 Wh and does not increase for 90 min. The normal sequence does not apply in every situation.',
      'The ConOps 40% maximum depth-of-discharge target corresponds roughly to SOC ≥60%, but it does not match the §4.2 operating criterion of 40% remaining charge. This is a document conflict for the approver to resolve.',
    ],
    source: 'ConOps §2–4; NASA Gravity & Mechanics',
    url: 'https://science.nasa.gov/learn/basics-of-space-flight/chapter3-4/',
  },
  {
    id: '03',
    section: 'anatomy',
    title: 'Reducing rotation requires external torque',
    principle:
      'If a rigid body experiences no external torque, its angular momentum is conserved in the inertial frame. An offset between the centre of mass and the geometric centre does not by itself make the spin increase. Actual disturbance torques such as gravity gradient, aerodynamics, solar radiation pressure and residual magnetic moment must be reviewed.',
    equation:
      'H = Iω;  I·dω/dt + ω×(Iω) = τ_ext\nτ_mag = m×B;  |τ| = |m||B|sinθ',
    example:
      'Teaching example: if m=0.1 A·m² and B=30 µT are perpendicular, the torque is 3 µN·m. If they are parallel, it is 0. This is not a Deneb board performance value. Because torque along the magnetic field direction cannot be produced at any instant, completing detumbling does not imply precise 3-axis pointing.',
    workedExample: {
      assumption: 'Teaching assumption · not an actual Deneb performance value',
      inputFormula:
        'm=0.1\\,\\mathrm A\\!\\cdot\\!\\mathrm m^2,\\quad B=30\\,\\mu\\mathrm T,\\quad \\theta=90^\\circ',
      calculationFormula:
        '|\\tau|=|m||B|\\sin\\theta=0.1\\times(30\\times10^{-6})\\times\\sin90^\\circ\\,\\mathrm N\\!\\cdot\\!\\mathrm m',
      resultFormula:
        '|\\tau|=3\\times10^{-6}\\,\\mathrm N\\!\\cdot\\!\\mathrm m=3\\,\\mu\\mathrm N\\!\\cdot\\!\\mathrm m',
      limitations: [
        { formula: 'm\\perp B', label: 'Maximum torque' },
        { formula: 'm\\parallel B', label: 'Zero torque' },
      ],
      meaning: [
        '3 µN·m is the magnitude of the instantaneous torque generated under the given conditions.',
        'This torque value alone cannot determine detumbling performance.',
      ],
      bridge:
        'To evaluate detumbling, calculate how this torque changes the satellite’s rotational state over time.',
      practice: [
        {
          index: '01',
          title: 'Rotational response',
          formula: '\\tau=I\\alpha',
          description:
            'Torque and the satellite’s inertia determine how quickly the rotational state changes.',
        },
        {
          index: '02',
          title: 'Real spacecraft',
          formula: '\\text{3-axis inertia matrix}+\\text{axis coupling}',
          description:
            'A real satellite rotates about three coupled axes, not a single independent axis.',
        },
        {
          index: '03',
          title: 'Engineering simulation',
          formula: '\\text{MATLAB}/\\text{Simulink}',
          description:
            'Compute the 3-axis dynamics over time to verify ω(t), attitude response and detumbling behaviour.',
        },
      ],
    },
    checks: [
      'The ConOps 3-axis detumbling energy of 1.083 Wh is three times the single-axis estimate. It cannot be used as a guaranteed value without verification that considers coupled rotational dynamics and current limits. Record rotational state as angular velocity (rad/s or °/s), the inertia matrix in kg·m², and torque in N·m.',
      'A single magnetometer vector at one instant cannot uniquely determine all attitude degrees of freedom. Check reference vectors, sensors, the estimator and observability.',
      'The deployable wings in the GLB are geometry included in the teaching 3D model. It is not a finalised CAD reproduction of the five panels plus antenna mating face in source Modeling §1.',
    ],
    reviewChecks: [
      {
        label: 'Energy Estimate',
        text: 'The ConOps 3-axis detumbling energy of 1.083 Wh is three times the single-axis estimate. It cannot be used as a guaranteed value without verification that considers coupled rotational dynamics and current limits.',
      },
      {
        label: 'Units to Record',
        text: 'Record rotational state as angular velocity (rad/s or °/s), the inertia matrix in kg·m², and torque in N·m.',
      },
      {
        label: 'Attitude Observability Limit',
        text: 'A single magnetometer vector at one instant cannot uniquely determine all attitude degrees of freedom. Check reference vectors, sensors, the estimator and observability.',
      },
      {
        label: '3D Model Limitation',
        text: 'The deployable wings in the GLB are geometry included in the teaching 3D model. It is not a finalised CAD reproduction of the five panels plus antenna mating face in source Modeling §1.',
      },
    ],
    source: 'Review of the spin explanation in ConOps §5.1; NASA Small Spacecraft GNC',
    url: 'https://www.nasa.gov/smallsat-institute/sst-soa/guidance-navigation-and-control/',
  },
  {
    id: '04',
    section: 'model',
    title: 'Do not treat functions, requirements and implementation as the same thing',
    principle:
      'A function is a transformation or action to be performed, and a requirement is a measurable condition that function must satisfy. Hardware and software are the implementation to which functions are allocated. Several functions can map to one component, and one function can map to several components.',
    equation:
      'Example requirement: achieve ‖ω‖ < ωlim within Tlim from specified initial conditions\nFunction: rotation reduction / Implementation: sensor + OBC control SW + magnetorquer',
    example:
      'Do not fill ωlim and Tlim with arbitrary fixed values. ConOps §3.2 gives <5°/s, but whether it is the vector magnitude or a per-axis value, and the dwell time and verification conditions, must be confirmed separately. A link without a success criterion does not complete verification.',
    checks: [
      'Part-pair < Component < Subsystem < System is a modelling convention of the provided MADE document, not a universal physical law.',
      'Allocate the B-dot software to the OBC and show its link to the ADCS function. Distinguish functional ownership from physical mounting location.',
      'Number of batteries: ConOps §2 states 3, Modeling §1 states 3–4 in parallel, TBD. The camera is also TBD and is not shown as a confirmed configuration before verification.',
    ],
    source:
      'MADE Modeling §1, §2.2; ConOps §3.2; NASA Systems Engineering Handbook',
    url: 'https://www.nasa.gov/reference/systems-engineering-handbook/',
  },
  {
    id: '05',
    section: 'made',
    title: 'B-dot uses the magnetic field rate to reduce rotational energy',
    principle:
      'The time variation of the magnetic field measured in the body frame includes both satellite rotation and the geomagnetic field varying along the orbit. Under the approximation that the rotational effect dominates, a magnetic dipole is commanded opposite to the rate of change.',
    equation:
      'dBbody/dt ≈ −ω×B;  mcmd = −k·dBbody/dt (k > 0)\nτ = m×B;  dErot/dt = τ·ω ≈ −k|ω×B|² ≤ 0',
    example:
      'Rotational energy decreases under the approximation of an ideal rigid body with fixed inertia, neglected disturbances and unsaturated control. In practice, noise, sample interval, filter delay, current limits, coil heating and actuator magnetic interference with the sensor must be verified. At low rates, the magnetic field variation along the orbit may not be negligible.',
    checks: [
      'The magnetic moment m is in A·m², the magnetic field B in T, and its rate in T/s. If µT is not converted to T, the gain and torque calculations will be wrong.',
      'The Energy classification in the document is a classification of physical interaction. Torque is not energy (J). Rotational power is τ·ω (W), and electrical input power is VI (W).',
      'The blocks mix environment, functions, devices and states. This is a causal teaching diagram; not every block is a component and not every arrow is a power supply line. The Deneb axis configuration and detailed actuators are not assumed to be confirmed specifications.',
    ],
    source: 'MADE Modeling §2; NASA magnetic control reference; PHM Technology',
    url: 'https://ntrs.nasa.gov/api/citations/20110007876/downloads/20110007876.pdf',
  },
  {
    id: '06',
    section: 'prolog',
    title: 'A successful query does not prove real-world safety',
    principle:
      'Prolog proves goals from the given facts and rules. Entering a fact does not automatically make it approved information; the authenticity and currency of evidence and the completeness of the model are subject to separate review.',
    equation:
      'Fact: component(adcs, magnetometer).\nRule: contains(X,Y) :- component(X,Y).\nQuery: ?- contains(adcs, X).',
    example:
      'The screen is a teaching example that shows the results of three specified queries; it is not a Prolog executor. ready(detumble) represents only the example’s review evidence condition and does not decide actual power, temperature, sensor, controller or operational authorisation.',
    checks: [
      '\\+ Goal succeeds if the attempt to prove Goal fails in finite time. Separate unregistered or unverified items from physical failure.',
      'Undefined predicates can raise errors under the SWI-Prolog default settings. The example declares evidence/1 and human_signed/1 and leaves their facts empty.',
      'Transitive rules over component relations must also be reviewed for possible cycles and duplicates. This example handles only a small acyclic relation.',
    ],
    source: 'SWI-Prolog official documentation: negation as failure',
    url: 'https://www.swi-prolog.org/pldoc/doc_for?object=(%5C%2B)/1',
  },
  {
    id: '07',
    section: 'handoff',
    title: 'A deliverable ready for handoff must retain its reproduction conditions',
    principle:
      'Changes affect existing requirements and interfaces. Test passes, change approval and learning completion must be managed as separate states so that later teams do not use the wrong baseline.',
    equation:
      'Change record = target and version + reason + impact + reproduction procedure and result + uncertainty + reviewer',
    example:
      'In TASK-ADCS-001, write each input, output, unit, coordinate frame and source section of the magnetometer → OBC B-dot → magnetorquer chain. If the current limit could not be found, leave TBD with an owner and a confirmation plan. Passing a quiz does not grant actual design approval or flight operation authority.',
    checks: [
      'Link the requirement ID, the configuration used, and the test inputs, expected results and actual results.',
      'Record tolerances, uncertainty, behaviour on failure and re-review conditions.',
      'The completion checks on this screen are for self-assessment. They do not update the approval ledger or the actual mission state.',
    ],
    source: 'NASA Systems Engineering Handbook; MADE Modeling §2.2',
    url: 'https://www.nasa.gov/reference/systems-engineering-handbook/',
  },
] satisfies EngineeringNote[];
