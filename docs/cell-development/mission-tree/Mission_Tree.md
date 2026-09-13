# CubSpace Mission Tree — Draft

Python으로 19개 카드의 Prolog facts를 추출·대조했다. 승인된 Mission Tree가 아닌 카드의 제안 경로다. Mission leaf 아래 Cell과 Task는 업무 소속이며 물리적 하위 노드가 아니다.

```text
cubspace
└─ onboarding
   ├─ equation_blocks
   │  └─ equation_blocks_cell → CUB-001 [Red]
   ├─ worked_example
   │  └─ worked_example_cell → CUB-002 [Red]
   ├─ review_labels
   │  └─ review_labels_cell → CUB-003 [Red]
   ├─ adcs_flow
   │  └─ adcs_flow_cell → CUB-004 [Red]
   ├─ component_io
   │  └─ component_io_cell → CUB-005 [Red]
   ├─ trace_intro
   │  └─ trace_intro_cell → CUB-006 [Red]
   ├─ math_token_boundary
   │  └─ math_token_boundary_cell → CUB-007 [Red]
   ├─ energy_baseline
   │  └─ energy_baseline_cell → CUB-008 [Red]
   ├─ battery_configuration
   │  └─ battery_configuration_cell → CUB-009 [Red]
   ├─ detumble_acceptance
   │  └─ detumble_acceptance_cell → CUB-010 [Red]
   ├─ hardware_evidence
   │  └─ hardware_evidence_cell → CUB-011 [Red]
   ├─ variable_visuals
   │  └─ variable_visuals_cell → CUB-012 [Red]
   ├─ objective_curriculum
   │  └─ objective_curriculum_cell → CUB-013 [Red]
   ├─ equation_cases
   │  └─ equation_cases_cell → CUB-014 [Red]
   ├─ foundation_notes
   │  └─ foundation_notes_cell → CUB-015 [Red]
   ├─ orbit_state_schema
   │  └─ orbit_state_schema_cell → CUB-016 [Red]
   ├─ matlab_adapter
   │  └─ matlab_adapter_cell → CUB-017 [Red]
   ├─ prolog_sim_gate
   │  └─ prolog_sim_gate_cell → CUB-018 [Red]
   └─ sim_baseline
      └─ sim_baseline_cell → CUB-019 [Red]
```

| Task leaf | Task Card | Sign-off |
|---|---|---|
| `equation_blocks` | [CUB-001 · [Equation] 수식별 독립 블록과 설명 라벨](../tickets-2026-09-14/CUB-001.md) | red |
| `worked_example` | [CUB-002 · [WorkedExample] Worked Example을 소제목 토글로 제공](../tickets-2026-09-14/CUB-002.md) | red |
| `review_labels` | [CUB-003 · [ReviewLabels] 설계 검토 문구를 의미별 라벨로 분리](../tickets-2026-09-14/CUB-003.md) | red |
| `adcs_flow` | [CUB-004 · [ADCSFlow] ADCS 부품 관계를 피드백 흐름도로 표현](../tickets-2026-09-14/CUB-004.md) | red |
| `component_io` | [CUB-005 · [ComponentCard] 부품별 역할 카드와 Input/Output 의미 명확화](../tickets-2026-09-14/CUB-005.md) | red |
| `trace_intro` | [CUB-006 · [Traceability] Traceability 상단에 한 줄 정의 추가](../tickets-2026-09-14/CUB-006.md) | red |
| `math_token_boundary` | [CUB-007 · [MathText] 일반 단어 내부의 단위 수식 오인식 수정](../tickets-2026-09-14/CUB-007.md) | red |
| `energy_baseline` | [CUB-008 · [EnergyReview] SOC·DoD 운용 기준 충돌의 검토 기록 작성](../tickets-2026-09-14/CUB-008.md) | red |
| `battery_configuration` | [CUB-009 · [Configuration] 배터리 3셀 대 3–4셀 형상 충돌 추적](../tickets-2026-09-14/CUB-009.md) | red |
| `detumble_acceptance` | [CUB-010 · [Requirement] Detumbling 완료 기준의 미확정 조건 추적](../tickets-2026-09-14/CUB-010.md) | red |
| `hardware_evidence` | [CUB-011 · [ModelEvidence] Deneb·카메라·GLB의 형상 근거와 한계 정리](../tickets-2026-09-14/CUB-011.md) | red |
| `variable_visuals` | [CUB-012 · [VariableVisual] 유도보다 변수 의미와 그림을 우선 표시](../research-2026-09-14/CUB-012.md) | red |
| `objective_curriculum` | [CUB-013 · [LearningGoal] 프로젝트 관리보다 임무·학습 목표를 확장](../research-2026-09-14/CUB-013.md) | red |
| `equation_cases` | [CUB-014 · [CaseExercise] 식으로 풀어보는 사례와 오답 피드백 추가](../research-2026-09-14/CUB-014.md) | red |
| `foundation_notes` | [CUB-015 · [LearningResources] 기초 강의 PDF·영상 각주와 읽기 안내 추가](../research-2026-09-14/CUB-015.md) | red |
| `orbit_state_schema` | [CUB-016 · [InputContract] Cartesian·Keplerian·TLE 입력과 출력 계약 정의](../research-2026-09-14/CUB-016.md) | red |
| `matlab_adapter` | [CUB-017 · [PythonMATLAB] Python–MATLAB wrapper 재현 PoC 설계](../research-2026-09-14/CUB-017.md) | red |
| `prolog_sim_gate` | [CUB-018 · [PrologControl] Prolog를 입력 검증·실행 근거 추적에 연결](../research-2026-09-14/CUB-018.md) | red |
| `sim_baseline` | [CUB-019 · [Reproducibility] 논문·코드 버전과 수치 검증 기준선 고정](../research-2026-09-14/CUB-019.md) | red |

## 실행

```powershell
python build_tree.py
swipl -s queries.pl -g "forall(task_leaf(T,L,C,S),format('~w | ~w | ~w | ~w~n',[T,L,C,S])),halt."
```

Python 검증: 카드 19개, Task/leaf ID 유일성, 경로 내 순환 부재, leaf/Cell/Task 매핑과 상태 일치. Python 파서는 제한된 카드 facts 구문만 처리하며 Prolog 추론 실행을 대신하지 않는다.
