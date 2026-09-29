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
    title: 'Knowledge is inherited only when judgments can be reproduced.',
    principle:
      "First, we set the system's boundaries and success conditions, and then verify the claims with observations. A model is a purposefully simplified representation of reality, so its accuracy cannot be guaranteed without sources, versions, or assumptions.",
    equation:
      'Assertion → Requirement ID → Model element → Verification method → Result/condition → Review record',
    example:
      'Example: Instead of “the rotation is sufficiently reduced”, record the angular velocity vector, measurement coordinate system, threshold, dwell time and sensor effectiveness. A distinction is made between verification of meeting requirements (verification) and verification of suitability for mission purpose (validation).',
    checks: [
      'Separate textual statements, calculated results, teaching assumptions, and undetermined (TBD).',
      'Review/approval is not a substitute for test data. Verify the connection between the actual shape and test conditions and the evidence.',
    ],
    source: 'NASA Systems Engineering Handbook; MADE Modeling §1–2',
    url: 'https://www.nasa.gov/reference/systems-engineering-handbook/',
  },
  {
    id: '02',
    section: 'mission',
    title: 'Think of orbital motion and energy budget separately',
    principle:
      "In a circular orbit, gravity creates centripetal acceleration that continuously changes the direction of velocity. The satellite is in continuous free fall. Attitude control changes the satellite's orientation/rotation, and magnetic control in this training example does not control orbital altitude.",
    equation:
      'GM/r² = v²/r → v = √(GM/r)\nΔEBattery = ∫(Pcharge − Pload − Ploss)dt\nE(Wh) = P(W) × t(s) / 3600',
    example:
      'ConOps §2: Average available power of 0.31 W minus the specified 0.20 W load is 0.11 W (originally written as approximately 0.1 W). If the loss is already reflected, it will not be double-deducted. 5 V × 0.25 A × 10 s = 12.5 J ≈ 0.00347 Wh, and the 0.005 Wh in the original text is a conservative estimate.',
    checks: [
      'The size, orbital altitude, and time in this picture are not to scale flight analysis values. r is the distance from the center of the Earth.',
      "ConOps' initial 26.46 Wh is an estimate of nominal capacity × SOC, not all available spare energy. Discharge limits, temperature, deterioration, and voltage limits must be reflected. ConOps §3.1.2: There is an exception to deploy the antenna first if it is less than 2 Wh and the charge has not increased for 90 minutes. The normal ordering does not apply in all situations.",
      "ConOps' 40% maximum depth of discharge objective roughly corresponds to SOC ≥60%, but is inconsistent with the 40% residual operational criterion in §4.2. Document conflict to be resolved by the approver.",
    ],
    source: 'ConOps §2–4; NASA Gravity & Mechanics',
    url: 'https://science.nasa.gov/learn/basics-of-space-flight/chapter3-4/',
  },
  {
    id: '03',
    section: 'anatomy',
    title: 'External torque is required to reduce rotation',
    principle:
      'When a rigid body is not subjected to external torque, its angular momentum is conserved in an inertial frame. The mere fact that the center of mass is different from the geometric center does not automatically increase spin. Actual disturbance torques such as gravity gradient, aerodynamic force, solar radiation pressure, and residual magnetic moment must be reviewed.',
    equation:
      'H = Iω;  I·dω/dt + ω×(Iω) = τexternal\nτself = m×B;  |τ| = |m||B|sinθ',
    example:
      'Educational example: If m=0.1 A·m², B=30 µT and perpendicular to each other, the torque is 3 µN·m. If parallel, it is 0. These are not Deneb board performance values. Complete detumbling does not imply precise 3-axis orientation, as magnetic field directional torque cannot be created instantaneously.',
    workedExample: {
      assumption: 'Educational assumptions Deneb Not actual performance values',
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
        '3 µN·m is the amount of instantaneous torque generated under given conditions.',
        'This torque value alone cannot determine detumbling performance.',
      ],
      bridge:
        "To evaluate detumbling, we need to calculate how this torque changes the satellite's rotational state over time.",
      practice: [
        {
          index: '01',
          title: 'Rotational response',
          formula: '\\tau=I\\alpha',
          description:
            "Torque and the satellite's inertia determine how quickly its rotational state changes.",
        },
        {
          index: '02',
          title: 'Real spacecraft',
          formula: '\\text{3-axis inertia matrix}+\\text{axis coupling}',
          description:
            'A real satellite rotates not on one independent axis, but on three axes that are coupled together.',
        },
        {
          index: '03',
          title: 'Engineering simulation',
          formula: '\\text{MATLAB}/\\text{Simulink}',
          description:
            '3-axis dynamics are calculated over time to verify ω(t), attitude response, and detumbling behavior.',
        },
      ],
    },
    checks: [
      "ConOps' three-axis detumbling energy of 1.083 Wh is three times that of the single-axis estimate. It cannot be used as a guaranteed value without verification considering the coupled rotational dynamics and current limits. The rotation state is recorded in angular velocity (rad/s or °/s), the inertia matrix in kg·m², and the torque in N·m.",
      'A single vector at one point in the magnetometer cannot uniquely determine all postural degrees of freedom. Check reference vectors, sensors, estimators and observability.',
      "The GLB's deployable wing is a feature included in the educational 3D model. This is not a model that reproduces the five panel + antenna combination surfaces in Modeling §1 of the original text with confirmed CAD.",
    ],
    reviewChecks: [
      {
        label: 'Energy Estimate',
        text: "ConOps' three-axis detumbling energy of 1.083 Wh is three times that of the single-axis estimate. It cannot be used as a guaranteed value without verification considering the coupled rotational dynamics and current limits.",
      },
      {
        label: 'Units to Record',
        text: 'The rotation state is recorded in angular velocity (rad/s or °/s), the inertia matrix in kg·m², and the torque in N·m.',
      },
      {
        label: 'Attitude Observability Limit',
        text: 'A single vector at one point in the magnetometer cannot uniquely determine all postural degrees of freedom. Check reference vectors, sensors, estimators and observability.',
      },
      {
        label: '3D Model Limitation',
        text: "The GLB's deployable wing is a feature included in the educational 3D model. This is not a model that reproduces the five panel + antenna combination surfaces in Modeling §1 of the original text with confirmed CAD.",
      },
    ],
    source: 'Review spin description in ConOps §5.1; NASA Small Spacecraft GNC',
    url: 'https://www.nasa.gov/smallsat-institute/sst-soa/guidance-navigation-and-control/',
  },
  {
    id: '04',
    section: 'model',
    title:
      "Don't treat features, requirements, and implementation as the same thing",
    principle:
      'A function is a transformation or action to be performed, and requirements are measurable conditions that the function must satisfy. Hardware and software are implementations with assigned functions. Multiple functions can be linked to one part, and a function can be linked to multiple parts.',
    equation:
      'Requirement example: Achieve ‖ω‖ < ωlim within Tlim under specified initial conditions.\nFunction: Rotation reduction / Implementation: Sensor + OBC control SW + magnetic actuator',
    example:
      'We do not fill ωlim and Tlim with arbitrary fixed values. ConOps §3.2 suggests <5°/s, but whether it is vector size or axis-specific, holding time and verification conditions must be checked separately. A link without success criteria alone will not complete the verification.',
    checks: [
      'Part-pair < Component < Subsystem < System is a modeling convention in the provided MADE document and is not a universal law of physics.',
      'B-dot software assigns to OBCs and displays connections to ADCS functions. Distinguish between functional affiliation and physical mounting location.',
      'Number of batteries: 3 for ConOps §2, 3–4 TBD in parallel for Modeling §1. The camera is also TBD and will not be marked as a confirmed configuration prior to verification.',
    ],
    source:
      'MADE Modeling §1, §2.2; ConOps §3.2; NASA Systems Engineering Handbook',
    url: 'https://www.nasa.gov/reference/systems-engineering-handbook/',
  },
  {
    id: '05',
    section: 'made',
    title:
      'B-dot uses the rate of change of the magnetic field to reduce rotational energy',
    principle:
      "The temporal variation of the magnetic field measured in body coordinate system includes satellite rotation and the Earth's magnetic field changing along its orbit. In the approximation that rotational effects dominate, we order the magnetic dipoles in the opposite direction of the rate of change.",
    equation:
      'dBbody/dt ≈ −ω×B;  mcmd = −k·dBbody/dt (k > 0)\nτ = m×B;  dErot/dt = τ·ω ≈ −k|ω×B|² ≤ 0',
    example:
      'The rotational energy is reduced in the ideal fixed-inertia rigid body, disturbance neglect, and unsaturated control approximation. In practice, noise, sample interval, filter delay, current limiting, coil heating, and driver magnetic interference to the sensor must be verified. At low speeds, magnetic field changes along the orbit may not be ignored.',
    checks: [
      'The magnetic moment m is A·m², the magnetic field B is T, and the rate of change is T/s. If you do not convert µT to T, your gain and torque calculations will be incorrect.',
      'The Energy classification in the document is a physical interaction classification. Torque is not energy (J). The rotational power is τ·ω(W) and the electrical input power is VI(W).',
      "A block contains a mixture of environment, function, device, and state. This is a causal diagram, not every block is a part or every arrow is a power line. Deneb's shaft configuration and actuator details are not assumed to be firm specifications.",
    ],
    source: 'MADE Modeling §2; NASA magnetic control reference; PHM Technology',
    url: 'https://ntrs.nasa.gov/api/citations/20110007876/downloads/20110007876.pdf',
  },
  {
    id: '06',
    section: 'prolog',
    title: 'Query success does not prove real-world security',
    principle:
      'Prolog proves a goal from given facts and rules. Entering facts does not automatically result in approved information, and the authenticity, recency, and completeness of the model are subject to separate review.',
    equation:
      'Fact: component(adcs, magnetometer).\nRule: contains(X,Y) :- component(X,Y).\nQuery: ?- contains(adcs, X).',
    example:
      'The screen is an educational example showing the results of the three specified queries and is not a Prolog executor. ready(detumble) only indicates the review basis conditions of the example and does not determine actual power, temperature, sensor, controller, or operating permit.',
    checks: [
      "\\+ A Goal succeeds if the Goal's proof attempt fails in finite time. Separate physical failure from unregistered/unverified.",
      'Undefined predicates may cause errors in SWI-Prolog default settings. The example declares evidence/1 and human_signed/1 and leaves the facts blank.',
      'Transition rules for part relationships should also consider possible cycles and duplication. This example covers only small acyclic relationships.',
    ],
    source: 'SWI-Prolog official documentation: negation as failure',
    url: 'https://www.swi-prolog.org/pldoc/doc_for?object=(%5C%2B)/1',
  },
  {
    id: '07',
    section: 'handoff',
    title: 'Reproducibility conditions must remain in deliverable results.',
    principle:
      'Changes impact existing needs and interfaces. Maintain separate statuses for passing exams, approving changes, and completing lessons to prevent future teams from using incorrect baselines.',
    equation:
      'Change record = Target/Version + Reason + Impact + Reproduction Procedure/Results + Uncertainty + Reviewer',
    example:
      "In TASK-ADCS-001, write each input/output, unit, coordinate system, and source section for the magnetometer → OBC B-dot → magnetic actuator chain. If you don't find the current limit, leave a TBD and contact person/verification plan. Passing the quiz does not grant actual design approval or flight operation authorization.",
    checks: [
      'Link request ID, usage configuration, test input, expected results, and actual results.',
      'Record tolerance, uncertainty, action in case of failure, and review conditions.',
      'The completion check on this screen is for self-inspection. It does not update the authorization ledger or actual mission status.',
    ],
    source: 'NASA Systems Engineering Handbook; MADE Modeling §2.2',
    url: 'https://www.nasa.gov/reference/systems-engineering-handbook/',
  },
] satisfies EngineeringNote[];
