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
        <strong>knowledge.pl · 관계와 규칙</strong>
        <fieldset aria-label="Prolog 보기 선택">
          <button
            aria-pressed={view === 'tree'}
            onClick={() => setView('tree')}
          >
            <GitBranch size={18} />
            트리 보기
          </button>
          <button
            aria-pressed={view === 'code'}
            onClick={() => setView('code')}
          >
            <Code2 size={18} />
            코드 보기
          </button>
        </fieldset>
      </div>
      {view === 'code' ? (
        <pre className="prolog-source">{prologFacts}</pre>
      ) : (
        <ZoomCanvas width={1000} height={440}>
          <div className="prolog-relations">
            <section>
              <h3>구성 관계</h3>
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
                            자력계
                          </strong>
                          <small>component(adcs, magnetometer)</small>
                          <ul>
                            <li>측정 대상 → magnetic_field</li>
                          </ul>
                        </li>
                        <li>
                          <strong>
                            <Magnet />
                            Deneb 자기구동기
                          </strong>
                          <small>component(adcs, deneb_magnetorquer)</small>
                          <ul>
                            <li>명령 출처 ← b_dot</li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </section>
            <section>
              <h3>의존성과 추론 규칙</h3>
              <ul className="relation-branch">
                <li>
                  <strong>
                    <GitBranch />
                    detumble_complete
                  </strong>
                  <ul>
                    <li>필요 조건 → adcs_operational</li>
                  </ul>
                </li>
                <li>
                  <strong>
                    <Boxes />
                    contains(X, Y)
                  </strong>
                  <ul>
                    <li>직접 subsystem 관계 또는 component 관계</li>
                    <li>subsystem(X, Z)와 contains(Z, Y)가 모두 성립</li>
                  </ul>
                </li>
                <li>
                  <strong>
                    <ShieldCheck />
                    ready(detumble)
                  </strong>
                  <ul>
                    <li>
                      <FileCheck2 /> evidence(adcs_test) — 등록된 근거 없음
                    </li>
                    <li>
                      <ShieldCheck /> human_signed(adcs_test) — 등록된 승인 없음
                    </li>
                  </ul>
                  <small>
                    두 조건 모두 필요(AND). 빈 술어는 dynamic으로 선언됩니다.
                  </small>
                </li>
              </ul>
            </section>
          </div>
        </ZoomCanvas>
      )}
      <p className="note">
        동일한 예제의 구성 관계와 규칙을 펼쳐 표현했습니다. 트리의 선은
        포함·측정·명령·조건 관계를 구분하며, 코드 실행 결과나 실제 비행 준비
        판정이 아닙니다.
      </p>
    </div>
  );
}
