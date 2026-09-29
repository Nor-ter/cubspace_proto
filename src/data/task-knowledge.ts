export const taskKnowledge = {
  id: 'TASK-ADCS-001',
  atom: 'task_adcs_001',
  version: '1.0',
  title: 'ADCS functional model review',
  purpose:
    'Review the functions, inputs/outputs and properties of magnetometer → OBC B-dot software → Deneb magnetorquer.',
  scope: 'Does not include flight controller design, threshold finalisation or actual hardware actuation.',
  inputs: [
    'ACRUX-2 MADE Modeling §1–2',
    'ConOps §3.1.2·3.2·5.1',
    'Available Deneb datasheet',
  ],
  constraints: [
    'Record the version, section and owner of each source. Mark unavailable specifications as TBD.',
    'Distinguish source statements, calculations, assumptions and document conflicts, and do not invent missing values.',
    'Final approval and authority to operate physical devices are decided separately by the responsible reviewer.',
  ],
  steps: [
    {
      id: 'S01',
      title: 'Define functions and flows',
      instruction:
        'Define the function of each item as a verb and object, and classify inputs and outputs as Energy / Data / Material.',
      output: 'Function and input/output table',
      check: 'Each function’s inputs, outputs and flow classification rationale are linked.',
    },
    {
      id: 'S02',
      title: 'Confirm physical properties',
      instruction:
        'Record units, coordinate frames, ranges and time references. Distinguish B (T), m (A·m²) and τ (N·m), and explain the directional limitation of magnetic torque.',
      output: 'Property, unit and source table',
      check:
        'Every value has a source or an explicit assumption, and torque is distinguished from energy.',
    },
    {
      id: 'S03',
      title: 'Review B-dot assumptions',
      instruction:
        'Check damping assumptions, sampling, noise, saturation and magnetic interference. Do not generalise a single-axis estimate to three-axis performance without evidence.',
      output: 'List of control assumptions and uncertainties',
      check: 'Applicable conditions are distinguished from unconfirmed conditions.',
    },
    {
      id: 'S04',
      title: 'Trace evidence and conflicts',
      instruction:
        'Distinguish source statements, calculation results, assumptions and document conflicts. Leave missing values and evidence as confirmation questions.',
      output: 'Evidence links and reviewer question list',
      check: 'Source locations and document versions can be traced.',
    },
    {
      id: 'S05',
      title: 'Change proposal and handoff',
      instruction:
        'Submit the change proposal and the affected requirements, tests and model elements. Do not decide final approval on the reviewer’s behalf.',
      output: 'Review package and handoff record',
      check: 'The affected items, responsible reviewer and remaining questions are stated.',
    },
  ],
};
const q = (value: string) => `'${value.replaceAll("'", "''")}'`;
export function taskProlog() {
  const t = taskKnowledge;
  return [
    '% Educational knowledge representation. Not an execution engine or hardware command.',
    `task(${t.atom}).`,
    `task_id(${t.atom}, ${q(t.id)}).`,
    `revision(${t.atom}, ${q(t.version)}).`,
    `title(${t.atom}, ${q(t.title)}).`,
    `purpose(${t.atom}, ${q(t.purpose)}).`,
    `scope(${t.atom}, ${q(t.scope)}).`,
    ...t.inputs.map((s) => `source(${t.atom}, ${q(s)}).`),
    ...t.constraints.map((s) => `constraint(${t.atom}, ${q(s)}).`),
    ...t.steps.flatMap((s, i) => [
      `step(${t.atom}, ${i + 1}, ${s.id.toLowerCase()}).`,
      `step_title(${s.id.toLowerCase()}, ${q(s.title)}).`,
      `instruction(${s.id.toLowerCase()}, ${q(s.instruction)}).`,
      `output(${s.id.toLowerCase()}, ${q(s.output)}).`,
      `acceptance(${s.id.toLowerCase()}, ${q(s.check)}).`,
    ]),
    '% Human approval records are not generated automatically.',
    ':- dynamic evidence/2, human_approved/1.',
    'reviewable(Task) :- task(Task), forall(step(Task, _, S), evidence(Task, S)).',
    'handoff_ready(Task) :- reviewable(Task), human_approved(Task).',
  ].join('\n');
}
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
    `## Scope\n${t.scope}`,
    `## Inputs\n${t.inputs.map((x) => '- ' + x).join('\n')}`,
    `## Constraints\n${t.constraints.map((x) => '- ' + x).join('\n')}`,
    ...t.steps.map(
      (s) =>
        `## ${s.id} ${s.title}\n${s.instruction}\n\nDeliverable: ${s.output}\n\nAcceptance criterion: ${s.check}`,
    ),
    `## Approval and handoff\nOwner: TBD\nReviewer: TBD\nApproval: not approved`,
    ...(view === 'ai'
      ? [
          `## Core Knowledge Tree / Skill storage structure (proposed)\nMission / ACRUX-II / ADCS / Skills / ${t.id}\n\nThe content below is a draft for knowledge storage and has not been stored in the actual Tower.`,
          `## Prolog\n\`\`\`prolog\n${taskProlog()}\n\`\`\``,
        ]
      : []),
  ].join('\n\n');
}
