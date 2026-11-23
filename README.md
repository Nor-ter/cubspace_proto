# CubSpace

ACRUX-II 1U CubeSat을 다루는 신입 엔지니어용 온보딩 웹사이트입니다. 미션 배경, 위성 구조, 시스템 모델링 기초를 순서대로 배우고 각 단계의 퀴즈를 통과하면 다음 단계가 열립니다.

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
| `frontend/public/`                       | 3D 모델, 텍스처, 아이콘                         |

## 1-4 브랜치 변경사항

### CubeSat 학습 페이지

기존의 어두운 그리드 배경과 UI 디자인을 유지하면서, 긴 본문을 6개 갤러리와 상세 페이지로 구성했습니다.

| 상세 페이지 | 내용 |
| --- | --- |
| The CubeSat unit | CubeSat 정의, 1U·3U 모델, CP1·CP10 비교 및 실제 미션 자료 버튼 |
| Sizes, mass & a quick quiz | 1U부터 12U까지 크기 비교, 질량 분류 원본 이미지, configuration별 질량 계산 |
| LEO & other orbits | LEO·MEO·GEO·Polar·Sun-synchronous 설명, 궤도 모델 및 ACRUX-1 퀴즈 |
| Launcher + CubeSat + Dispenser | 발사체·위성·디스펜서의 역할, 실제 이미지 및 발사·사출·로켓 포획 영상 |
| Requirements & flight approval | 발사 제공자 요구사항과 CDS의 관계, 비행 문서·수락 체크리스트·기술 참고문서 |
| From concept to orbit | 개념 개발부터 궤도 운용까지의 일정 원본 이미지 |

- 상단 4개 요약 카드에서도 관련 상세 페이지를 열 수 있습니다. 질량 요약은 `~1.33 Kg/U`이며, NASA CubeSat 101의 역사적 근사값임을 표시합니다.
- 상세 페이지 제목을 확대하고, 하단 이전 버튼은 갤러리로 돌아가며 다음 버튼은 다음 상세 페이지로 이동하도록 변경했습니다.
- 질량 계산은 1U·1.5U·2U·3U·6U·12U 각각 최소·최대 질량을 입력하고 확인하는 주관식 퀴즈입니다. 05 Quiz와 공통 퀴즈 UI 및 결과 표시를 사용합니다.
- 역사적 질량 근사값, CDS의 typical maximum mass, 실제 위성 질량을 구분했습니다. CP1·CP10·ACRUX-1은 Gunter's Space Page 버튼으로 확인할 수 있습니다.
- ACRUX-1의 발사체와 궤도 문제는 궤도 상세 페이지에 별도 두 문제로 배치했습니다.
- 궤도 설명은 NASA 자료를 기준으로 정리했습니다. LEO는 160–2,000 km, MEO는 LEO와 GEO 사이, GEO는 약 35,786 km입니다. Polar와 Sun-synchronous는 고도 범위와 구분해 궤도 기하·특성으로 설명합니다.
- 궤도 모델에는 선택한 궤도를 도는 1U CubeSat과 지표면 기준 모델 고도가 표시됩니다. 모델 예시 고도와 궤도 종류의 정의를 구분하며, 거리와 시간은 교육용 표현입니다.
- 발사·사출·포획 섹션은 사용자 제공 YouTube 영상 4개를 선택해서 재생합니다. 임베드 재생이 제한되면 YouTube에서 열 수 있습니다.
- 디스펜서 사진·구조 이미지, 발사체 크기 비교 이미지, ISS ground track 이미지를 추가했습니다. 문서·수락 체크리스트·기술 참고표·일정·질량 분류는 원본 이미지를 사용합니다.
- 참고자료를 불릿 목록으로 분리하고 이미지 출처를 표시했습니다.

### 3D 뷰어

- CubeSat 크기와 궤도 등 교육용 3D 도표를 추가하고, 기존 Subsystems의 CubeSat 모델과 외형을 공유합니다.
- 마우스 드래그로 회전하며 확대·축소와 시점 초기화를 지원합니다. CubeSat 도표의 별도 Rotate 버튼은 제거했습니다.
- 3D canvas 위에서 휠을 조작하면 모델만 확대·축소되고 페이지 스크롤은 전달되지 않도록 적용했습니다.
- Subsystems는 기존 CubeSat 3D 모델을 사용합니다. 렌더링 실패 시 CAD 도면으로 고정되는 동작을 제거하고 자동 재시도 및 수동 재불러오기 버튼을 추가했습니다.
- 뷰어 해제 시 WebGL context도 반환하도록 변경해 반복 진입 시 리소스 누적을 줄였습니다.

### Mission Tree

- 온보딩 이후 지식과 설계 이력을 이어가는 목적을 설명하도록 소개문을 교체했습니다. 마지막 문장 **Engineers may leave, the mission carries on.**을 강조합니다.
- 기존 세로 목록을 SVG 기반 interactive 2D 트리로 교체했습니다. Phase Pre-A부터 F까지 가로로 배치하고, 팀 → Manual / Workshop → Task 가지로 탐색합니다.
- Grow tree / Pause와 가지 성장 애니메이션, 확대·축소, 초기화, 팀 필터, 검색을 지원합니다. Reduced motion 설정도 반영합니다.
- 기존 80개 Task 카드와 작업 단계는 유지하며, 선택한 Task의 상세 내용을 보여줍니다. 작은 화면에서는 트리 영역 내부를 가로로 탐색할 수 있습니다.
- 실제 Mission Tree 외부 연결은 `VITE_MISSION_TREE_URL`이 설정된 경우 사용합니다.

### About: MSP 조직도

- Melbourne Space Program 소개 아래에 **CURRENT MSP ORGANISATION STRUCTURE** 섹션을 추가했습니다.
- Jenny Pham 아래 첫 줄은 Humanoid Project, ACRUX-II Project, Animatronics Project이며 Board & Operations와 Legal & Finances는 다음 줄에 배치합니다.
- 프로젝트나 운영 부문을 선택하면 인원, 역할, 하위 팀을 펼쳐 보여줍니다. Humanoid는 Hardware와 Software 조직을 함께 포함합니다.
- 조직도는 제공된 **August 2026** 자료의 시점과 보고 관계를 반영하며, 기존 UI 색상과 카드 디자인 및 모바일 레이아웃을 사용합니다.

### 주요 코드와 자료 위치

| 위치 | 내용 |
| --- | --- |
| `frontend/src/features/cubesat/` | 갤러리, 상세 페이지, 출처, 퀴즈, 영상, 교육용 3D 도표 |
| `frontend/src/components/NumericQuizAnswer.tsx` | 공통 숫자 입력 퀴즈 |
| `frontend/src/features/mission-tree/components/TaskTree.tsx` | 가로 Phase 및 가지 성장형 Mission Tree |
| `frontend/src/features/about/organisation.ts` | MSP 조직도 데이터 |
| `frontend/src/features/about/components/OrganisationStructure.tsx` | 선택형 조직도 UI |
| `frontend/src/lib/isolateCanvasWheel.ts` | 3D canvas 휠과 페이지 스크롤 분리 |
| `frontend/public/images/cubesat/` | CubeSat 원본 참고 이미지와 사용자 제공 이미지 |

### 참고자료

- [NASA State-of-the-Art of Small Spacecraft Technology (2024)](https://www.nasa.gov/wp-content/uploads/2025/02/soa-2024.pdf)
- [NASA CubeSat 101 (2017)](https://www.nasa.gov/wp-content/uploads/2017/03/nasa_csli_cubesat_101_508.pdf)
- [Cal Poly CubeSat Design Specification Rev. 14.1 (2022)](https://static1.squarespace.com/static/5418c831e4b0fa4ecac1bacd/t/62193b7fc9e72e0053f00910/1645820809779/CDS+REV14_1+2022-02-09.pdf)
- [NASA Catalog of Earth Satellite Orbits](https://science.nasa.gov/earth/earth-observatory/catalog-of-earth-satellite-orbits/)
- Gunter's Space Page: [CP1](https://space.skyrocket.de/doc_sdat/cp-1.htm), [ExoCube / CP10](https://space.skyrocket.de/doc_sdat/exocube.htm), [ACRUX-1](https://space.skyrocket.de/doc_sdat/acrux-1.htm)

### 확인

- `npm run lint`
- `npm run build` — 퀴즈 데이터 검사, TypeScript 검사, Vite 빌드 포함
- 브라우저에서 갤러리 이동, 퀴즈, 궤도 선택, 트리 탐색·검색, 조직도 선택, canvas 휠 분리 및 3D context 손실 후 복구 확인

개발 서버의 기본 포트 3000이 사용 중이면 Vite가 다음 사용 가능한 포트를 선택합니다. 터미널에 출력된 주소를 사용하세요. 이번 로컬 작업에서는 `http://localhost:3001`을 사용했습니다.
