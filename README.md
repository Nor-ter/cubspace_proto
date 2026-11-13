# CubSpace

ACRUX-II 1U CubeSat을 다루는 신입 엔지니어용 온보딩 웹사이트입니다. 미션 배경, 위성 구조, 시스템 모델링 기초를 순서대로 배우고 각 단계의 퀴즈를 통과하면 다음 단계가 열립니다.

## 실행

[Node.js](https://nodejs.org/) 22.13 이상이 필요합니다.

```bash
cd frontend
npm install
npm run dev
```

<http://localhost:3000>을 엽니다. <http://localhost:3000/admin>에서는 모든 학습 페이지로 바로 가는 링크 목록을 볼 수 있습니다. 이 페이지는 검토용이며 로그인 기능은 아닙니다. 서버를 종료하려면 `Ctrl+C`를 누릅니다.

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
| `frontend/src/pages/`                    | 라우트별 화면 (`/`, `/admin`)                   |
| `frontend/src/features/`                 | 기능별 코드: 학습 진행(`course`)과 각 학습 섹션 |
| `frontend/src/components/`               | 여러 기능이 함께 쓰는 UI                        |
| `frontend/src/lib/`, `types/`, `styles/` | 공용 함수, 타입, 전역 CSS                       |
| `frontend/public/`                       | 3D 모델, 텍스처, 아이콘                         |
| `docs/`                                  | 퀴즈 작성법과 엔지니어링 내용 검토 기록         |

퀴즈를 추가하거나 고치는 방법은 [퀴즈 작성법](docs/quiz-authoring.md)을 참고하세요.
