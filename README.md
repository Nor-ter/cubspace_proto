# CubSpace Onboarding Simulator — Phase 1

한국어 중심의 ACRUX-2 1U CubeSat 학습 앱입니다. 기술 용어는 English를 유지합니다. 3D, AI API, MADE 통합, 로그인 및 데이터베이스는 포함하지 않습니다.

## 실행

Node.js 22.13 이상을 사용합니다.

```powershell
cd cubspace-onboarding
npm ci
npm run dev
```

기본 개발 주소: http://localhost:3000

```powershell
npm run build
npx tsc --noEmit
node --test tests/learning.test.mjs
```

## 구현

- 6개 모듈: 임무·Power mode, 1U 개념 단면·Subsystem, 7단계 전개, MADE 계층·4개 기능 체인, RAMS·4개 고장 시나리오, 준비도·과제.
- 키보드로 사용할 수 있는 탭·Subsystem 버튼·퀴즈·위/아래 순서 변경. 자동 진행 정지·초기화, reduced-motion CSS, 밝은/어두운 테마, 반응형 레이아웃.
- 진행, 답안, 설명, 센서·히터 초안은 localStorage `cubspace-phase1-v1`에 저장됩니다. 저장소 오류 시 세션 학습과 Markdown 다운로드를 제공합니다. 초기화 확인으로 모든 학습 상태를 재설정합니다.
- 준비도: 퀴즈 9개 + 체인 1개 정답, 설명 최소 40자, Component 2개의 22개 필드, 자기 검토. 내용의 기술적 정확성을 자동 판정하지 않습니다. 완료 표시는 자격 인증이 아닙니다.
- 계층·시퀀스는 교육용 도식이며 실제 CAD나 비행 동역학·열·전력 시뮬레이션이 아닙니다.

## 구조

- `app/page.tsx`: 모듈 UI와 local state, 초기화 및 Markdown 다운로드.
- `src/data/content.ts`: 구조화된 엔티티, 입출력 Flow와 측정 속성, 단계, 고장, 퀴즈, 출처.
- `src/learning.ts`: 상태 검증·복원 및 준비도 규칙.
- `app/globals.css`: 화면·모바일·테마·접근성 스타일.
- `tests/learning.test.mjs`: 구조화 콘텐츠 무결성, 상태 복원, 채점, 순서 변경과 준비도 조건 검사.
- 공식 Sites starter의 React/TypeScript, Vite 기반 Vinext, Tailwind 및 Shadcn/Base UI를 사용합니다. 외부 폰트 요청은 없습니다.

## 출처와 불확실성

`ACRUX_2_ConOps.pdf` (9쪽)와 `ACRUX-2 CubeSat MADE Modeling.docx`를 검토했습니다. 각 학습 객체는 문서·절·해당 PDF 페이지를 참조하며 원본 문서는 배포물에 포함하지 않습니다. Product & Engineering Specification v0.1은 교육 범위와 RAMS 설명의 출처입니다. 제공되지 않은 NASA 자료, PDR 및 모델링 보고서를 읽었다고 가정하지 않습니다.

- Confirmed: 제공 문서에 명시. 승인된 기술 기준선이나 비행 검증을 의미하지 않음.
- Assumption: Current ConOps assumption 또는 교육 가정. 수치로 자동 비행 판단을 하지 않음.
- TBD: 카메라 포함, 히터 전력, 센서 사양, 일부 임계값·복구 절차.
- Conflicting: 배터리 3셀 vs 3–4셀 TBD를 보존. 전력 40% 경계 중복, 방전 깊이 목표와 SOC 기준 관계를 명시.
- Historical: 과거 자료의 상태. 미제공 PDR을 현재 기준선으로 사용하지 않음.
- Modeling 문서의 30일 임무는 ConOps 공통 성공 판정 기준으로 승격하지 않음.

문서 내 구현 지시와 기술 정보를 구분했으며 사용자 요청에 따라 Phase 2 3D는 구현하지 않았습니다. 학습 데이터는 MADE 독점 스키마를 복제하지 않습니다.

## 검증과 남은 검토

TypeScript 검사, 프로덕션 빌드 및 로직·데이터 테스트를 수행합니다. 실제 Nokyoung 사용성 검증, 화면 리더/브라우저별 실사용 검증, SME 기술 검토는 아직 수행하지 않았습니다. 이들은 완료된 것으로 표시하지 않습니다.

브라우저가 WebMCP를 지원하면 `navigate_learning_module` 도구로 1–6 모듈을 열 수 있습니다. 미지원 환경에서는 UI만 사용합니다. 지원 WebMCP 실행 환경에서의 도구 검증은 수행하지 않았으며 지원 여부가 학습 흐름을 막지 않습니다.

## 다음 단계

Phase 2에서만 선택 가능한 교육용 3D, 회전/확대, 분해 보기, 격리 및 기능 관계 강조를 추가합니다. 현재 UI와 콘텐츠 구조를 유지하면서 시각화를 확장할 수 있습니다. Phase 3의 학습자 검증과 SME 검토는 별도입니다.

검사 범위: `npm run lint`는 직접 작성한 app/src/tests를 검사합니다. 원본 Shadcn starter의 미사용 컴포넌트에는 별도 lint 진단이 있어 vendored UI를 변경하지 않고 검사 범위를 명시했습니다.
