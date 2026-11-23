export type OrgPerson = { name: string; role?: string; children?: OrgPerson[] };
export type OrgBranch = {
  id: string;
  title: string;
  lead: OrgPerson;
  members: OrgPerson[];
};

export const MSP_ORG_BRANCHES: OrgBranch[] = [
  {
    id: 'governance',
    title: 'Board & Operations',
    lead: { name: 'Sam Hoffman', role: 'Director & Ex-CEO' },
    members: [
      {
        name: 'Lisa Dang',
        role: 'Secretary',
        children: [
          {
            name: 'Jane Mamon',
            role: 'Board Member and Humanoid Member',
            children: [
              {
                name: 'Alina Noor',
                role: 'Sponsorship Board Member',
                children: [
                  {
                    name: 'Melissa Yao',
                    role: 'Finance',
                    children: [
                      {
                        name: 'Marketing Team',
                        role: 'No lead',
                        children: [{ name: 'Website Development Sub-team' }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'acrux',
    title: 'ACRUX-II',
    lead: { name: 'Biho Shin', role: 'Director and ACRUX-2 Team Lead' },
    members: [
      {
        name: 'Keshav Mehra',
        role: 'Director and Ex-Lead',
        children: [
          {
            name: 'Lachlan Power',
            role: 'EPS Subteam Co-lead',
            children: [{ name: 'Electrical Power Systems Team' }],
          },
          {
            name: 'Marc Cordeiro',
            role: 'BOX Team Lead',
            children: [{ name: 'BOX Team' }],
          },
          {
            name: 'Arjun Kumar',
            role: 'OBC & COMMS Lead',
            children: [{ name: 'On-board Computer and COMMS Team' }],
          },
        ],
      },
    ],
  },
  {
    id: 'humanoid-hardware',
    title: 'Humanoid Hardware',
    lead: { name: 'Matt Ma', role: 'Director and Humanoid Hardware Team Lead' },
    members: [
      { name: 'Power Distribution Team' },
      { name: 'Head and Torso Team' },
      { name: 'Right arm and right end effector Team' },
      { name: 'Left arm and left end effector Team' },
      { name: 'Osford Teo', role: 'Humanoid Hardware Ex-Lead, Interim Mentor' },
    ],
  },
  {
    id: 'humanoid-software',
    title: 'Humanoid Software',
    lead: { name: 'Max Schuran', role: 'Humanoid Software Team Lead' },
    members: [
      { name: 'Facial Expressions Team' },
      { name: 'Chatbot Team' },
      { name: 'Computer Vision Team' },
    ],
  },
  {
    id: 'legal',
    title: 'Legal & Finances',
    lead: { name: 'Abraham Guiyab', role: 'Director, Legal, Finances' },
    members: [{ name: 'Legal Team' }],
  },
  {
    id: 'animatronics',
    title: 'Animatronics',
    lead: { name: 'Khang Nguyen', role: 'Animatronics Team Lead' },
    members: [
      {
        name: 'Monique Tovey',
        role: 'Finances & Mechanical Eng',
        children: [
          {
            name: 'Mechanical Sub-team',
            children: [
              {
                name: 'Luci Ackland',
                role: 'Electrical Subteam Lead',
                children: [{ name: 'Electrical Sub-team' }],
              },
            ],
          },
        ],
      },
      {
        name: 'Derrick A Suganda',
        role: 'Structures Subteam Lead',
        children: [{ name: 'Structures Sub-team' }],
      },
      {
        name: 'Allyza A Catapang',
        role: 'Textiles Subteam Lead',
        children: [{ name: 'Textiles Sub-team' }],
      },
      {
        name: 'Charlotte Woollams',
        role: 'Software Subteam Lead',
        children: [{ name: 'Software Sub-team' }],
      },
    ],
  },
];
