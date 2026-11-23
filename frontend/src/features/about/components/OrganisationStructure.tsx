import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { MSP_ORG_BRANCHES, type OrgPerson } from '../organisation';
import './OrganisationStructure.css';

function Member({ member }: { member: OrgPerson }) {
  return (
    <li>
      <div className="org-member">
        <strong>{member.name}</strong>
        {member.role && <span>{member.role}</span>}
      </div>
      {member.children && (
        <ul>
          {member.children.map((child) => (
            <Member key={child.name} member={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function OrganisationStructure() {
  const [selected, setSelected] = useState('acrux');
  const humanoidBranches = MSP_ORG_BRANCHES.filter((item) =>
    ['humanoid-hardware', 'humanoid-software'].includes(item.id),
  );
  const operatingBranches = [
    {
      id: 'humanoid',
      title: 'Humanoid Project',
      lead: { name: 'Hardware & Software', role: 'Matt Ma / Max Schuran' },
      members: humanoidBranches.map((item) => ({
        ...item.lead,
        children: item.members,
      })),
    },
    ...['acrux', 'animatronics', 'governance', 'legal'].map((id) =>
      MSP_ORG_BRANCHES.find((item) => item.id === id)!,
    ),
  ];
  const branch = operatingBranches.find((item) => item.id === selected)!;
  return (
    <section className="ax-org" aria-labelledby="msp-org-heading">
      <header className="org-section-head">
        <h3 id="msp-org-heading" className="ax-heading">
          CURRENT MSP ORGANISATION STRUCTURE
        </h3>
        <p className="org-date">August 2026</p>
      </header>
      <p className="org-intro">
        Explore the people and teams behind Melbourne Space Program. Select a
        branch to see its members and sub-teams.
      </p>
      <div className="org-chart">
        <div className="org-leadership">
          <div className="org-ceo grip-frame">
            <span>Chief Executive Officer</span>
            <strong>Jenny Pham</strong>
          </div>
        </div>
        <fieldset
          className="org-branches"
          aria-label="MSP organisation branches"
        >
          {operatingBranches.map((item) => (
            <button
              key={item.id}
              className="org-branch"
              aria-pressed={selected === item.id}
              aria-controls="org-branch-details"
              onClick={() => setSelected(item.id)}
            >
              <span className="org-branch-name">
                {item.id === 'acrux'
                  ? 'ACRUX-II Project'
                  : item.id === 'animatronics'
                    ? 'Animatronics Project'
                    : item.title}
              </span>
              <strong>{item.lead.name}</strong>
              <span className="org-branch-role">{item.lead.role}</span>
              <ChevronDown aria-hidden="true" />
            </button>
          ))}
        </fieldset>
      </div>
      <section
        id="org-branch-details"
        className="org-detail"
        aria-labelledby="org-detail-heading"
      >
        <header>
          <span>Selected branch</span>
          <h4 id="org-detail-heading">{branch.title}</h4>
          <p>
            {branch.lead.name} · {branch.lead.role}
          </p>
        </header>
        <ul className="org-member-tree" key={branch.id}>
          {branch.members.map((member) => (
            <Member key={member.name} member={member} />
          ))}
        </ul>
      </section>
      <p className="org-source">
        Based on the supplied MSP organisation chart, August 2026. Roles and
        reporting lines reflect that snapshot.
      </p>
    </section>
  );
}
