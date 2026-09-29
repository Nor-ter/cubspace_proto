'use client';
import { useState } from 'react';
import {
  Code2,
  GitBranch,
  Satellite,
  Boxes,
  Radio,
  Magnet,
  FileCheck2,
  ShieldCheck,
} from 'lucide-react';
import { ZoomCanvas } from './zoom-canvas';
import { prologFacts } from '@/src/data/onboarding';
export function PrologViewer() {
  const [view, setView] = useState<'tree' | 'code'>('tree');
  return (
    <div className="prolog-viewer">
      <div className="prolog-view-toolbar">
        <strong>knowledge.pl · Relationships and rules</strong>
        <fieldset aria-label="Select Prolog view">
          <button
            aria-pressed={view === 'tree'}
            onClick={() => setView('tree')}
          >
            <GitBranch size={18} />
            tree view
          </button>
          <button
            aria-pressed={view === 'code'}
            onClick={() => setView('code')}
          >
            <Code2 size={18} />
            View code
          </button>
        </fieldset>
      </div>
      {view === 'code' ? (
        <pre className="prolog-source">{prologFacts}</pre>
      ) : (
        <ZoomCanvas width={1000} height={440}>
          <div className="prolog-relations">
            <section>
              <h3>composition relationship</h3>
              <ul className="relation-branch">
                <li>
                  <strong>
                    <Satellite />
                    ACRUX-II
                  </strong>
                  <small>subsystem(acrux2, adcs)</small>
                  <ul>
                    <li>
                      <strong>
                        <Boxes />
                        ADCS
                      </strong>
                      <ul>
                        <li>
                          <strong>
                            <Radio />
                            magnetometer
                          </strong>
                          <small>component(adcs, magnetometer)</small>
                          <ul>
                            <li>Measurement target → magnetic_field</li>
                          </ul>
                        </li>
                        <li>
                          <strong>
                            <Magnet />
                            Deneb magnetic actuator
                          </strong>
                          <small>component(adcs, deneb_magnetorquer)</small>
                          <ul>
                            <li>Command Source ← b_dot</li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </section>
            <section>
              <h3>Dependencies and inference rules</h3>
              <ul className="relation-branch">
                <li>
                  <strong>
                    <GitBranch />
                    detumble_complete
                  </strong>
                  <ul>
                    <li>Requirements → adcs_operational</li>
                  </ul>
                </li>
                <li>
                  <strong>
                    <Boxes />
                    contains(X, Y)
                  </strong>
                  <ul>
                    <li>
                      Direct subsystem relationship or component relationship
                    </li>
                    <li>
                      Both subsystem(X, Z) and contains(Z, Y) are established.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>
                    <ShieldCheck />
                    ready(detumble)
                  </strong>
                  <ul>
                    <li>
                      <FileCheck2 /> evidence(adcs_test) · No registered
                      evidence
                    </li>
                    <li>
                      <ShieldCheck /> human_signed(adcs_test) · No registered
                      approval
                    </li>
                  </ul>
                  <small>
                    Both conditions are required (AND). Empty predicates are
                    declared dynamic.
                  </small>
                </li>
              </ul>
            </section>
          </div>
        </ZoomCanvas>
      )}
      <p className="note">
        This expands the same example into component relationships and rules.
        The tree lines distinguish containment, measurement, command, and
        condition relationships; they are not code-execution results or an
        actual flight-readiness assessment.
      </p>
    </div>
  );
}
