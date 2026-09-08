import { MathFormula, MathRich } from './math-text';
import {
  ClipboardList,
  Target,
  BookOpen,
  ListChecks,
  FileCheck2,
  ShieldCheck,
} from 'lucide-react';
export function PromptManual() {
  return (
    <section className="manual-frame" aria-label="A4 Prompt Manual 예시">
      <div className="manual-caption">
        <ClipboardList />
        Task Card 예시 · A4 Prompt Manual
      </div>
      <MathRich>
        <article className="prompt-paper">
          <header>
            <small>CUBSPACE / ENGINEERING WORK INSTRUCTION</small>
            <h2>ADCS 기능 모델 검토</h2>
            <p>TASK-ADCS-001 · 교육용 예시 · 상태: 검토 전 초안</p>
          </header>
          <section>
            <h3>
              <Target />
              01 목적과 범위
            </h3>
            <p>
              자력계 → OBC B-dot 소프트웨어 → Deneb 자기구동기의
              기능·입출력·속성을 검토한다. 비행 제어기 설계나 임계값 확정은
              포함하지 않는다.
            </p>
          </section>
          <section>
            <h3>
              <BookOpen />
              02 입력 자료
            </h3>
            <p>
              ACRUX-2 MADE Modeling §1–2, ConOps §3.1.2·3.2·5.1, 확보된 Deneb
              데이터시트. 모든 자료의 버전·절·담당자를 기록한다. 미확보 사양은
              TBD로 표시한다.
            </p>
          </section>
          <section>
            <h3>
              <ListChecks />
              03 사용할 프롬프트
            </h3>
            <blockquote>
              당신은 ADCS 모델 검토를 지원하는 엔지니어입니다. 제공된 자료만으로
              다음을 수행하세요.
            </blockquote>
            <ol>
              <li>
                각 항목의 기능을 동사와 목적어로 정의하고 입력·출력을 Energy /
                Data / Material로 분류하세요.
              </li>
              <li>
                속성의 단위·좌표계·범위·시간 기준을 기록하세요. B(T), m(A·m²),
                τ(N·m)를 구분하고{' '}
                <MathFormula
                  tex={String.raw`\boldsymbol\tau=\boldsymbol m\times\boldsymbol B`}
                />
                의 방향 제한을 설명하세요.
              </li>
              <li>
                B-dot의 감쇠 가정, 샘플링·노이즈·포화·자기 간섭을 확인하세요.
                단일축 추정치를 근거 없이 3축 성능으로 일반화하지 마세요.
              </li>
              <li>
                출처 진술, 계산 결과, 가정, 문서 충돌을 구분하세요. 누락된
                수치와 근거는 만들지 말고 확인 질문으로 남기세요.
              </li>
              <li>
                변경 제안과 영향받는 요구·시험·모델 요소를 표로 제출하세요. 최종
                승인 여부는 판단하지 마세요.
              </li>
            </ol>
          </section>
          <section>
            <h3>
              <FileCheck2 />
              04 산출물과 수용 기준
            </h3>
            <p>
              항목 | 기능 | 입력·출력 | 속성·단위 | 출처 | 상태 | 검증 방법의
              표, 불확실성 목록, 검토자 질문 목록을 제출한다. 모든 수치에 근거
              또는 가정 표시가 있어야 하며 토크와 에너지를 혼동하지 않는다.
            </p>
          </section>
          <section>
            <h3>
              <ShieldCheck />
              05 검토와 인계
            </h3>
            <p>작성자: __________　검토자: __________　일자: __________</p>
            <p>
              판정: □ 수정 요청　□ 추가 근거 필요　□ 승인
              <br />
              승인 기록·근거 링크: __________________________________
            </p>
          </section>
          <footer>
            교육용 Prompt Manual · 실제 승인 기록이 아님 <span>1 / 1</span>
          </footer>
        </article>
      </MathRich>
    </section>
  );
}
