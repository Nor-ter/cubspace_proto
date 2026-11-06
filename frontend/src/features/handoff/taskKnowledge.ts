export const taskKnowledge = {
  id: 'TASK-ADCS-001',
  version: '1.0',
  title: 'ADCS Capability Model Review',
  purpose:
    'Magnetometer → OBC B-dot software → Deneb Review the functions, input/output, and properties of the magnetic actuator.',
  scope:
    'It does not include flight controller design, threshold determination, or actual hardware operation.',
  inputs: [
    'ACRUX-2 MADE Modeling §1–2',
    'ConOps §3.1.2·3.2·5.1',
    'Deneb datasheet secured',
  ],
  constraints: [
    'Record the version, section, and person in charge of the material. Unsecured specifications are indicated as TBD.',
    'Distinguish between source statements, calculations, assumptions, and document conflicts and avoid creating missing figures.',
    'Final approval and authority to implement physical devices are determined separately by the responsible reviewer.',
  ],
  steps: [
    {
      id: 'S01',
      title: 'Function and flow definition',
      instruction:
        'The function of each item is defined by verb and object, and input and output are classified into Energy / Data / Material.',
      output: 'Function/input/output table',
      check:
        'The input, output, and flow classification basis of each function are connected.',
    },
    {
      id: 'S02',
      title: 'Check physical properties',
      instruction:
        'Record the unit, coordinate system, range, and time standards. Distinguish between B(T), m(A·m²), and τ(N·m) and explain the direction limitations of magnetic torque.',
      output: 'Attribute/Unit/Source Table',
      check:
        'All numbers have sources or explicit assumptions and distinguish between torque and energy.',
    },
    {
      id: 'S03',
      title: 'B-dot assumption review',
      instruction:
        'Check attenuation assumptions, sampling, noise, saturation, and self-interference. Do not generalize single-axis estimates to three-axis performance without evidence.',
      output: 'List of Control Assumptions/Uncertainties',
      check: 'Applicable conditions and unconfirmed conditions are separated.',
    },
    {
      id: 'S04',
      title: 'Rationale and Conflict Tracking',
      instruction:
        'Distinguish between source statements, calculation results, assumptions, and document conflicts. Leave missing figures and evidence as confirmation questions.',
      output: 'Link to evidence/list of reviewer questions',
      check: 'You can track the source location and document version.',
    },
    {
      id: 'S05',
      title: 'Change proposals and handover',
      instruction:
        'Submit proposed changes and affected requirements, tests, and model elements. We do not make a decision on whether or not to give final approval.',
      output: 'Review package and handover record',
      check:
        'Items affected, reviewers responsible, and remaining questions are identified.',
    },
  ],
};
export function taskMarkdown(view: 'human' | 'ai' | 'robot') {
  const t = taskKnowledge;
  return [
    `---`,
    `id: ${t.id}`,
    `version: "${t.version}"`,
    `view: ${view}`,
    `status: draft`,
    `---`,
    `# ${t.title}`,
    `## Purpose\n${t.purpose}`,
    `## Range\n${t.scope}`,
    `## input\n${t.inputs.map((x) => '- ' + x).join('\n')}`,
    `## Constraints\n${t.constraints.map((x) => '- ' + x).join('\n')}`,
    ...t.steps.map(
      (s) =>
        `## ${s.id} ${s.title}\n${s.instruction}\n\nResult: ${s.output}\n\nCompletion criteria: ${s.check}`,
    ),
    `## Approval and handover
Contact person: TBD
Reviewed by: TBD
Approved: Not Approved`,
    ...(view === 'ai'
      ? [
          `## Core Knowledge Tree / Skill Storage Structure (Proposal)\nMission / ACRUX-II / ADCS / Skills / ${t.id}\n\nThe content below is a draft for knowledge storage and is not actually stored in Tower.`,
        ]
      : []),
  ].join('\n\n');
}
