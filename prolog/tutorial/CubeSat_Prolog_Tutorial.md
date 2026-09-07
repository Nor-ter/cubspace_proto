# Prolog 튜토리얼 (CubeSat 버전) — 같은 개념, ACRUX-2로 다시

지난번 `family.pl`(tom/bob/liz...)과 **구조가 완전히 동일**합니다. 이름만 바뀐 게 아니라
"부모-자식"이 "System이 무엇으로 구성되는가"로 바뀐 거예요. 이 대응이 왜 잘 맞는지가
핵심입니다 — 가족 트리도, MADE의 System<Subsystem<Component 계층(개요 문서 6.1절)도,
수학적으로는 **똑같은 트리 구조**이기 때문입니다. 데이터만 바뀌지 규칙의 모양은 그대로예요.

```bash
swipl -s cubesat.pl
```

---

## 1. 사실 — 계층 구조

```prolog
consists_of(acrux2, adcs).
consists_of(acrux2, eps).
consists_of(adcs, magnetorquer).
consists_of(eps, battery_pack).
```

그림으로 그리면 (실제로 ConOps에 나오는 컴포넌트들입니다):

```
acrux2 ─┬─ adcs ── magnetorquer (Deneb)
        ├─ eps  ─┬─ battery_pack (18650 x3)
        │        └─ thermal_heater
        ├─ comms ─┬─ lora_module
        │         └─ antenna (Endurosat)
        ├─ obc ── atmega_mcu
        └─ payload ── etp_panel
```

`parent(tom, bob)`이 "tom이 bob의 부모"였던 것처럼, `consists_of(acrux2, adcs)`는
"acrux2가 adcs로 구성된다"는 뜻입니다. 방향도 똑같습니다 — 큰 것(위)에서 작은 것(아래)으로.

## 2. 질의

```prolog
?- consists_of(acrux2, X).
X = adcs ;
X = eps ;
X = comms ;
X = obc ;
X = payload.
```

`parent(tom, X)`가 tom의 자식들을 다 찾아줬던 것처럼, ACRUX-2를 직접 구성하는 5개
서브시스템을 다 찾아줍니다.

```prolog
?- consists_of(X, antenna).
X = comms.
```

반대 방향 질문도 됩니다 — "안테나는 어디 소속인가?"

## 3. 규칙과 단일화

family.pl의 `father/mother`(부모 중 성별이 특정한 경우)와 같은 패턴으로, "크리티컬한
하위요소"를 정의해봅니다.

```prolog
critical(antenna).       % ConOps §7.1 — 안테나 전개 실패는 미션 종료급
critical(battery_pack).  % ConOps §7.1 — 배터리 열관리 실패는 영구손상 위험

critical_subcomponent(X, Y) :- consists_of(X, Y), critical(Y).
```

```prolog
?- critical_subcomponent(eps, X).
X = battery_pack.
```

`grandparent/2`와 같은 패턴으로 "두 단계 아래"를 찾는 규칙도 그대로 옮겨집니다.

```prolog
assembly(X, Z) :- consists_of(X, Y), consists_of(Y, Z).
```

```prolog
?- assembly(acrux2, X).
X = magnetorquer ;
X = battery_pack ;
X = thermal_heater ;
X = lora_module ;
X = antenna ;
X = atmega_mcu ;
X = etp_panel.
```

`sibling/2`와 같은 패턴 — "같은 상위요소 아래에 있는 것들":

```prolog
sibling_component(X, Y) :- consists_of(P, X), consists_of(P, Y), X \= Y.
```

```prolog
?- sibling_component(battery_pack, X).
X = thermal_heater.
```

battery_pack과 thermal_heater가 둘 다 eps 밑에 있으니 "형제"로 잡힙니다 — 사람이 아니라
컴포넌트인데도 트리 구조가 같으니 규칙이 그대로 통합니다.

## 4. 재귀 — ancestor와 완전히 같은 패턴

```prolog
contains(X, Y) :- consists_of(X, Y).
contains(X, Y) :- consists_of(X, Z), contains(Z, Y).
```

```prolog
?- contains(acrux2, X).
X = adcs ;
X = eps ;
X = comms ;
X = obc ;
X = payload ;
X = magnetorquer ;
X = battery_pack ;
X = thermal_heater ;
X = lora_module ;
X = antenna ;
X = atmega_mcu ;
X = etp_panel.
```

`ancestor(tom, X)`가 tom의 후손을 몇 대든 다 찾아줬던 것처럼, `contains(acrux2, X)`는
서브시스템이든 그 아래 컴포넌트든 단계 상관없이 ACRUX-2에 속한 모든 것을 찾아줍니다.
규칙은 2줄 그대로인데, 나중에 Part-pair 레벨(예: magnetorquer 안의 코일 하나하나)까지
계층이 한 단계 더 깊어져도 이 규칙은 안 바뀝니다 — family.pl에서 증손주가 나와도
`ancestor` 규칙이 안 바뀌었던 것과 같은 이유입니다.

## 5. 음성 실패 — "서로 무관한 컴포넌트"

```prolog
independent(X, Y) :-
    component(X), component(Y), X \= Y,
    \+ contains(X, Y),
    \+ contains(Y, X).
```

```prolog
?- independent(antenna, battery_pack).
true.

?- independent(acrux2, antenna).
false.
```

antenna와 battery_pack은 서로 포함관계가 없으니(둘 다 acrux2 밑에 나란히 있을 뿐) 무관계로
잡히고, acrux2는 antenna를 포함하고 있으니 무관계가 아닙니다. `unrelated(liz, jim)`과
`unrelated(tom, jim)`의 차이와 정확히 같은 논리예요.

---

## 6. 세 층위가 이제 다 이어집니다

| 개념        | family.pl (연습용) | cubesat.pl (이번, 계층구조 연습) | rules.pl (실제 프로젝트)            |
| ----------- | ------------------ | -------------------------------- | ----------------------------------- |
| 사실        | `parent(tom, bob)` | `consists_of(acrux2, adcs)`      | `task_depends_on(A, B)`             |
| 규칙+단일화 | `grandparent/2`    | `assembly/2`                     | `blocked/1`                         |
| 재귀        | `ancestor/2`       | `contains/2`                     | `transitively_blocked/1` (연습문제) |
| 음성실패    | `unrelated/2`      | `independent/2`                  | `ready/1`                           |

cubesat.pl은 rules.pl과 도메인은 같지만(둘 다 ACRUX-2), 다루는 관계가 다릅니다 —
cubesat.pl은 **"무엇이 무엇으로 구성되는가"**(MADE 모델, Layer 1)를, rules.pl은
**"무엇이 무엇에 의존하고 무엇이 완료됐는가"**(Task Card, Layer 4~6)를 다룹니다. 실제로
Phase 1에서 MADE 모델링을 시작하면, `facts_model.pl`에 지금 cubesat.pl에 있는 것과
거의 똑같은 `consists_of`류의 사실들이 실제 MADE 모델 export로 채워지게 됩니다 — 오늘
연습한 게 바로 그 자리에 들어갈 코드의 예행연습이었던 셈이에요.

## 7. 연습문제

1. `payload` 밑에 `magnetometer`라는 컴포넌트를 하나 추가해보고(사실 한 줄),
   `sibling_component(etp_panel, magnetometer)`를 물어보면 뭐가 나올지 예상해본 뒤 확인해보세요.
2. `critical(magnetorquer)`를 추가하면 `critical_subcomponent(adcs, X)`의 결과가
   어떻게 바뀌나요?
3. (도전) `shares_subsystem(X, Y)`를 정의해서, 서로 다른 컴포넌트 두 개가 **간접적으로도**
   같은 서브시스템 계열에 속하는지(예: magnetorquer와 나중에 추가할 gyroscope) 판단하는
   규칙을 만들어보세요. `sibling_component`와 뭐가 다를지 먼저 생각해보고 시작하세요.
