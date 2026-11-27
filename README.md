# CubSpace

ACRUX-II 1U CubeSat을 다루는 신입 엔지니어용 온보딩 웹사이트입니다. 미션 배경, 위성 구조, 시스템 모델링 기초를 순서대로 배우고 각 단계의 퀴즈를 통과하면 다음 단계가 열립니다.

## `onboarding_english_v2` 대비 변경 사항

아래 내용은 `onboarding_english_v2`의 `5021138`을 기준으로 `feat/onbarding_english_v2-1`에서 바뀐 점을 정리한 것입니다.

### CubeSat 페이지

- **미션 도식** — Launcher와 Dispenser 영상 사이에 Subsystems의 조립된 1U CubeSat 모델을 3/4 각도로 렌더링해 배치했습니다. 스크롤을 내리면 모델은 제목 아래에서 출발해 이동 경로의 중간에서 멈춥니다. 모델 뒤의 초록색 화살표는 **What a CubeSat is** 제목 바로 위까지 계속 뻗으며, 화살촉은 세로로 길게 표시됩니다.
- **제목 애니메이션** — About과 같은 타이핑 효과를 **CubeSat mission**, **What a CubeSat is**, **How to build a CubeSat?**에 적용했습니다. 스크롤로 제목이 화면에 들어오면 효과가 시작되며, References 제목은 일반 텍스트로 표시됩니다.
- **What a CubeSat is** — 표준 규격, 단위, 1U 크기, 역사적 질량 기준, 발사체와 배치 장치 설명에 인용 번호를 추가했습니다. Mass 행은 NASA의 2024년 소형 우주선 기술 보고서를 기준으로 나노위성의 질량 범위인 1–10 kg을 설명합니다.
- **How to build a CubeSat?** — NASA의 프로젝트 수명주기에 따라 Pre-Phase A부터 Phase F까지 일곱 단계를 표시합니다. Phase B에는 CDS를, Phase D에는 시스템 통합, 검증 및 승인, 발사 및 배치를 배치했습니다. 운영·유지는 Phase E, 임무 종료는 Phase F에서 다룹니다.
- **요약 카드와 Phase 열** — 네 카드의 제목을 **Specify**, **Build**, **Test & Launch**, **Operate & Close**로 정리했습니다. 카드 폭을 균등하게 배치하고 긴 제목은 카드 안에서 줄바꿈되도록 했습니다. Phase 표기 열의 너비를 통일해 `Pre-Phase A`가 한 줄에 들어가고 각 단계 제목이 같은 위치에서 시작합니다.
- **용어 툴팁** — NASA CubeSat 101 (2017), CubeSat Design Specification (CDS), NASA State-of-the-Art Small Spacecraft Technology 보고서, ISS 배치 경로에 짧은 영어 설명을 추가했습니다. 마우스를 올리거나 키보드로 포커스하면 설명이 바로 표시됩니다. 툴팁은 브라우저 화면을 기준으로 배치되며 상단 메뉴보다 위에 표시됩니다.
- **인용과 References** — 요약 카드와 본문 문단 끝의 인용 번호를 하단 목록과 맞췄습니다. 목록은 Subsystems와 같은 번호 열, 글꼴, 외부 링크 아이콘을 사용하며 항목 간격을 통일했습니다. CubeSat의 References 위 구분선은 숨겼습니다.
- **참고자료 상세 보기** — `[1]` NASA Systems Engineering Handbook, `[2]` NASA CubeSat 101, `[3]` CDS Rev. 14.1, `[4]` NASA State-of-the-Art Small Spacecraft Technology 보고서를 연결했습니다. `[5]` Flight certification documents, `[6]` Acceptance checklist, `[7]` Technical references는 각각 해당 갤러리 자료를 엽니다. 자료 사이를 이동하면 갤러리 상단 제목도 현재 자료에 맞춰 바뀝니다.
- **갤러리 사진과 출처** — 1U의 CP1 사진 출처를 Nanosats Database로 바꾸고 ACRUX-1 사진을 추가했습니다. 1–12U 갤러리의 3U 이미지 모음에는 CP10 (ExoCube) 사진을 추가했습니다. 각 사진은 Nanosats Database의 해당 위성 페이지에 연결됩니다.

### About 페이지

- 소개 영상을 `msp onboarding_28 Nov 26_v2.mp4`로 교체했습니다. 영상은 `frontend/public/videos/msp-onboarding.mp4`에서 제공하며, 플레이어에서 재생, 탐색, 전체 화면을 사용할 수 있습니다. About 페이지를 벗어나면 재생이 멈춥니다.
- 영상 아래 **Watch the full video on YouTube** 링크를 추가했습니다. 기존 YouTube 영상이 새 탭에서 열립니다.

### 공용 UI

- CubeSat과 Subsystems가 인용 번호 표시 컴포넌트와 References 목록 스타일을 공유합니다. 갤러리는 자료별 제목 표시를, 타이핑 컴포넌트는 특정 단어의 색상 강조를 지원합니다.

## 실행

[Node.js](https://nodejs.org/) 22.13 이상이 필요합니다.

```bash
cd frontend
npm install
npm run dev
```

<http://localhost:3000>을 엽니다. 서버를 종료하려면 `Ctrl+C`를 누릅니다.

## 명령

모든 명령은 `frontend/` 폴더에서 실행합니다.

| 명령                | 용도                                    |
| ------------------- | --------------------------------------- |
| `npm run dev`       | 개발 서버 실행                          |
| `npm run build`     | 타입 검사 후 `dist/`에 배포용 파일 생성 |
| `npm run preview`   | 빌드 결과를 로컬에서 확인               |
| `npm run lint`      | 코드 검사 (oxlint)                      |
| `npm run typecheck` | TypeScript 타입 검사                    |
| `npm run format`    | 코드 포맷 정리 (oxfmt)                  |

커밋 전에는 `npm run lint`와 `npm run build`가 통과해야 합니다.

## 프로젝트 구조

| 위치                                     | 용도                                            |
| ---------------------------------------- | ----------------------------------------------- |
| `frontend/src/pages/`                    | 라우트별 화면 (`/`, `/app`, `/story`)            |
| `frontend/src/features/`                 | 기능별 코드: 학습 진행(`course`)과 각 학습 섹션 |
| `frontend/src/components/`               | 여러 기능이 함께 쓰는 UI                        |
| `frontend/src/lib/`, `types/`, `styles/` | 공용 함수, 타입, 전역 CSS                       |
| `frontend/public/`                       | 3D 모델, 텍스처, 이미지, 영상, 아이콘           |
