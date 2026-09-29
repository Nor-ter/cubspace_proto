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
        <strong>knowledge.pl · relationships and rules</strong>
        <fieldset aria-label="Select Prolog view">
          <button
            aria-pressed={view === 'tree'}
            onClick={() => setView('tree')}
          >
            <GitBranch size={18} />
            Tree view
          </button>
          <button
            aria-pressed={view === 'code'}
            onClick={() => setView('code')}
          >
            <Code2 size={18} />
            Code view
          </button>
        </fieldset>
      </div>
      {view === 'code' ? (
        <pre className="prolog-source">{prologFacts}</pre>
      ) : (
        <ZoomCanvas width={1000} height={440}>
          <div className="prolog-relations">
            <section>
              <h3>Composition relationships</h3>
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
                            Magnetometer
                          </strong>
                          <small>component(adcs, magnetometer)</small>
                          <ul>
                            <li>Measures → magnetic_field</li>
                          </ul>
                        </li>
                        <li>
                          <strong>
                            <Magnet />
                            Deneb magnetorquer
                          </strong>
                          <small>component(adcs, deneb_magnetorquer)</small>
                          <ul>
                            <li>Commanded by ← b_dot</li>
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
                    <li>Requires → adcs_operational</li>
                  </ul>
                </li>
                <li>
                  <strong>
                    <Boxes />
                    contains(X, Y)
                  </strong>
                  <ul>
                    <li>Direct subsystem relation or component relation</li>
                    <li>Both subsystem(X, Z) and contains(Z, Y) hold</li>
                  </ul>
                </li>
                <li>
                  <strong>
                    <ShieldCheck />
                    ready(detumble)
                  </strong>
                  <ul>
                    <li>
                      <FileCheck2 /> evidence(adcs_test) · no evidence registered
                    </li>
                    <li>
                      <ShieldCheck /> human_signed(adcs_test) · no approval registered
                    </li>
                  </ul>
                  <small>
                    Both conditions are required (AND). Empty predicates are declared dynamic.
                  </small>
                </li>
              </ul>
            </section>
          </div>
        </ZoomCanvas>
      )}
      <p className="note">
        The composition relationships and rules of the same example are laid out
        in full. The tree lines distinguish containment, measurement, command
        and condition relationships; this is not a code execution result or an
        actual flight readiness decision.
      </p>
    </div>
  );
}
