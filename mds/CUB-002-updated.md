# CUB-002 — Updated

## [WorkedExample] Worked Example을 소제목 토글과 실무 전환 흐름으로 제공

## A. Task Details

- **No.** CUB-002
- **Epic:** WorkedExample
- **Branch:** `onboarding_training`
- **Target URL:** `http://localhost:3000/?admin=1#anatomy`
- **Status:** Yellow — 구현 및 자동 검증 완료, Human Inspection 및 원격 push 대기
- **Local commits:**
  - `2217694 feat: add worked example disclosure`
  - `75893bb feat: refine ADCS worked example workflow`
- **Remote state:** `origin/onboarding_training`보다 로컬 브랜치가 2개 커밋 앞섬

## B. Problem Identification

Worked Example이 항상 펼쳐진 긴 본문으로 제공되어 입력값, 계산, 결과와 실제 ADCS 적용 흐름을 단계적으로 읽기 어려웠다. 또한 limitation 수식과 문장이 붙어 보이고, `τ = Iα`가 여러 섹션에 반복될 가능성이 있었다.

교육용 입력값과 실제 Deneb 성능값의 차이는 삭제하거나 숨기지 않는다.

## C. Implemented Outcome

### 1. Toggle interaction

- `Worked Example · 원리를 적용하면`을 `<details>` 기반 토글로 제공한다.
- 펼치기/접기 상태를 표시하고 키보드 기본 조작을 지원한다.
- 토글 조작으로 다른 학습 상태가 초기화되지 않는다.

### 2. Core calculation

기존 순서를 유지한다.

1. **입력값**
   `m = 0.1 A·m², B = 30 µT, θ = 90°`
2. **계산**
   `|τ| = |m||B|sinθ = 0.1 × (30 × 10⁻⁶) × sin90° N·m`
3. **결과**
   `|τ| = 3 × 10⁻⁶ N·m = 3 µN·m`

카드 상단에는 다음 주의문을 유지한다.

> 교육용 가정 · Deneb 실제 성능값 아님

### 3. Important Limitation

두 관계를 하나의 문장으로 합치지 않고, 간격이 있는 별도 inline 항목으로 표시한다.

- `m ⟂ B` → `Maximum torque`
- `m ∥ B` → `Zero torque`

수학 기호와 문구가 `Maximum torquem ∥ B`처럼 시각적으로 연결되지 않도록 각 항목에 독립된 컨테이너, 간격 및 테두리를 적용한다. 작은 화면에서는 세로로 배치한다.

### 4. What This Result Means

다음 두 문장만 간결하게 제공한다.

> 3 µN·m는 주어진 조건에서 생성되는 순간 토크의 크기입니다.

> 이 토크 값만으로 detumbling 성능을 결정할 수는 없습니다.

이어지는 bridge 문장:

> Detumbling을 평가하려면 이 토크가 위성의 회전 상태를 시간에 따라 어떻게 변화시키는지 계산해야 합니다.

별도의 `What Happens Next?` 섹션은 만들지 않는다.

### 5. In Practice

실제 ADCS 엔지니어링으로 이어지는 세로형 workflow를 제공한다.

#### 01 Rotational response

`τ = Iα`

Torque와 위성의 관성은 회전 상태가 얼마나 빠르게 변하는지를 결정합니다.

↓

#### 02 Real spacecraft

`3-axis inertia matrix + axis coupling`

실제 위성은 하나의 독립된 축이 아니라 서로 결합된 3축으로 회전합니다.

↓

#### 03 Engineering simulation

`MATLAB / Simulink`

3축 동역학을 시간에 따라 계산하여 `ω(t)`, attitude response, detumbling behaviour를 검증합니다.

`τ = Iα`는 Worked Example 안에서 한 번만 표시한다. 전체 3축 Euler rigid-body equation은 추가하지 않는다. 이 섹션의 목적은 완전한 동역학 모델을 가르치는 것이 아니라 단순 토크 계산에서 실무 모델링과 시뮬레이션으로 전환되는 흐름을 보여주는 것이다.

## D. Acceptance Criteria

- [x] Worked Example을 펼치고 접을 수 있다.
- [x] 입력값 → 계산 → 결과 순서를 유지한다.
- [x] 교육용 가정과 실제 Deneb 성능값의 차이를 표시한다.
- [x] 두 limitation 관계를 독립된 시각 항목으로 표시한다.
- [x] `What Happens Next?`를 제거한다.
- [x] `τ = Iα`를 In Practice 01에서 한 번만 표시한다.
- [x] In Practice를 01 → 02 → 03 세로 workflow로 표시한다.
- [x] CubSpace dark theme과 기존 Worked Example 카드 스타일을 유지한다.
- [x] 모바일에서 limitation 항목과 workflow가 세로 방향으로 읽힌다.
- [x] 전체 3축 Euler 방정식을 Worked Example에 추가하지 않는다.

## E. Files Changed

- `components/engineering-note.tsx`
- `src/data/engineering.ts`
- `app/globals.css`

최종 상태에는 연결된 ADCS anatomy 및 review 개선 파일도 커밋 `75893bb`에 포함되어 있다.

## F. Verification

- `git diff --check`: 통과
- Node test: 9 tests passed
- Production build: 통과
- Desktop local preview: limitation 두 항목의 분리 및 간격 확인
- Current URL: `http://localhost:3000/?admin=1#anatomy`

## G. Sign-off / Publish State

- **Implementation:** 완료
- **Automated verification:** 완료
- **Human inspection:** 대기
- **Sign-off:** Yellow
- **GitHub push:** 인증 문제로 미완료
- **Publish:** 미진행

GitHub push가 완료되고 지정 승인자가 화면을 확인한 뒤에만 Green/Done으로 변경한다.

## H. VS Code Recovery Prompt

다른 세션에서 다시 확인하거나 복구해야 할 경우 아래 프롬프트를 사용한다.

```text
현재 저장소의 onboarding_training 브랜치에서 작업해줘. 먼저 git status와 git log를 확인하고 로컬 커밋 2217694와 75893bb가 존재하는지 확인해. 기존 변경을 덮어쓰거나 새 worktree를 만들지 마.

CUB-002의 최종 구현은 CUB-002-updated.md를 기준으로 검증해. Worked Example의 Input → Calculation → Result, 분리된 limitation 두 항목, 간결한 What This Result Means, bridge 문장, 3단계 In Practice workflow를 유지해야 한다. What Happens Next?는 없어야 하며 τ = Iα는 In Practice 01에 한 번만 표시해야 한다. 전체 3축 Euler equation은 Worked Example에 추가하지 마.

구현이 이미 충족되면 코드를 재작성하지 말고 테스트, production build, desktop 화면과 spacing만 확인해. 내 명시적 요청 없이 기존 로컬 변경을 삭제하거나 force push하지 마.
```
