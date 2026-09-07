# Prolog 첫 튜토리얼 — 가족관계 예제로 배우기

`family.pl`을 열어놓고, 아래 질의를 하나씩 직접 쳐보면서 읽으세요. 여기 나온 모든 결과는
실제로 SWI-Prolog에서 실행해서 확인한 것입니다.

```bash
swipl -s family.pl
```

프롬프트가 `?-`로 바뀌면 준비된 겁니다. 각 질의 끝에는 마침표(`.`)를 꼭 붙이세요.

---

## 1. 사실(Fact) — 그냥 진술문입니다

`family.pl`에 이렇게 적혀 있습니다.

```prolog
parent(tom, bob).
parent(tom, liz).
parent(bob, ann).
parent(bob, pat).
parent(pat, jim).
```

`parent(tom, bob).`은 "tom이 bob의 부모다"라는 사실 하나입니다. 코드가 아니라 그냥 진술문이에요.
가계도로 그리면 이렇습니다.

```
tom ─┬─ bob ─┬─ ann
     │       └─ pat ─ jim
     └─ liz
```

## 2. 질의(Query) — 사실에게 물어보기

```prolog
?- parent(tom, bob).
true.
```

`tom`이 `bob`의 부모냐고 물으니 `true`가 나옵니다. 이미 알고 있는 사실을 그대로 물어본 거예요.

이제 **변수**를 넣어봅니다. Prolog에서 대문자로 시작하는 이름(`X`, `Y`, `Name`...)은 전부 변수입니다.

```prolog
?- parent(tom, X).
X = bob ;
X = liz.
```

`X`가 뭐가 될 수 있는지 물었더니, Prolog가 사실 목록을 훑으면서 **맞아떨어지는 모든 값**을
하나씩 찾아줍니다. 세미콜론(`;`)을 치면 "다른 답도 있으면 더 보여줘"라는 뜻이에요. 이게
Prolog의 첫 번째 특징입니다 — **하나의 질문에 답이 여러 개 있을 수 있고, Prolog가 전부 찾아준다.**

방향을 반대로 물어볼 수도 있습니다.

```prolog
?- parent(X, jim).
X = pat.
```

똑같은 사실 `parent/2` 하나로 "누가 tom의 자식인가"도, "jim의 부모가 누구인가"도 물을 수
있다는 게 중요합니다. 우리는 함수를 "입력→출력" 한 방향으로만 쓰는 데 익숙한데, Prolog의
사실·규칙은 방향이 없어요. 어느 쪽이든 채워서 물어보면 나머지를 찾아줍니다.

## 3. 규칙(Rule) — 사실로부터 새로운 관계 만들기

```prolog
grandparent(X, Z) :- parent(X, Y), parent(Y, Z).
```

읽는 법: "X가 Y의 부모이고, Y가 Z의 부모이면, X는 Z의 조부모다." `:-`는 "만약 ~라면"이고,
쉼표(`,`)는 "그리고(AND)"입니다.

```prolog
?- grandparent(tom, X).
X = ann ;
X = pat.
```

여기서 `Y`는 어디에도 안 보이죠? `Y`는 규칙 안에서만 쓰이는 **중간 변수**입니다. Prolog가
내부적으로 "Y가 bob이면? liz면?" 하고 다 시도해보면서, 두 조건을 동시에 만족시키는 조합을
찾아줍니다. 이게 **단일화(Unification)** 예요 — 변수에 값을 끼워 맞춰보면서 규칙 전체를
참으로 만드는 값을 찾는 과정입니다.

형제 관계도 같은 방식으로 만들 수 있습니다.

```prolog
sibling(X, Y) :- parent(P, X), parent(P, Y), X \= Y.
```

"P가 X의 부모이고, P가 Y의 부모이고, X와 Y가 다른 사람이면, X와 Y는 형제다." (`\=`는 "다르다")

```prolog
?- sibling(ann, X).
X = pat.
```

## 4. 재귀(Recursion) — 이게 Prolog의 진짜 힘입니다

"조상"을 정의해봅시다. 부모는 당연히 조상이고, 부모의 부모도 조상이고, 그 위도 계속 조상입니다
— 몇 대를 거슬러 올라가든요. 이걸 규칙 하나로 어떻게 쓸까요?

```prolog
ancestor(X, Y) :- parent(X, Y).                    % 기저(base) case
ancestor(X, Y) :- parent(X, Z), ancestor(Z, Y).     % 재귀(recursive) case
```

첫 줄: "직접 부모면 조상이다." 둘째 줄: "X가 Z의 부모이고, Z가 Y의 조상이면, X도 Y의
조상이다." — 자기 자신(`ancestor`)을 정의 안에서 다시 부르고 있죠. 이게 재귀입니다.

```prolog
?- ancestor(tom, X).
X = bob ;
X = liz ;
X = ann ;
X = pat ;
X = jim.
```

`tom`의 직계 자식(`bob`, `liz`)뿐 아니라 손주(`ann`, `pat`)와 증손주(`jim`)까지 전부
찾아냅니다. 규칙은 2줄뿐인데, 가계도가 몇 대로 늘어나든 그대로 작동해요 — 세대 수만큼
규칙을 늘려 쓸 필요가 없습니다. **이게 정확히 우리 CubSpace 프로젝트에서 태스크 의존성
체인(A가 B에 의존하고, B가 C에 의존하고...)을 다룰 때 필요한 방식이에요.**

## 5. 음성 실패(Negation as Failure) — "모른다"를 표현하기

```prolog
unrelated(X, Y) :-
    person(X), person(Y), X \= Y,
    \+ ancestor(X, Y),
    \+ ancestor(Y, X).
```

`\+`는 "증명할 수 없다"는 뜻입니다. "X가 Y의 조상이라는 걸 증명 못 하고, Y가 X의 조상이라는
것도 증명 못 하면, 둘은 무관계다."

```prolog
?- unrelated(liz, jim).
true.

?- unrelated(tom, jim).
false.
```

`liz`와 `jim`은 가계도 어느 방향으로도 연결이 안 되니 `true`. `tom`은 `jim`의 조상이니(4번에서
확인) `false`. 중요한 건, Prolog가 "무관계임을 적극적으로 증명"한 게 아니라 "관계있다는
증거를 못 찾았다"는 걸 근거로 답했다는 점이에요. 이 미묘한 차이가, CubSpace에서
"검증 안 됨"과 "검증 실패"를 구분하는 것과 똑같은 원리입니다.

---

## 6. 이제 우리 `rules.pl`을 다시 보면

지난번에 만든 CubSpace 코드가 사실 이 튜토리얼과 패턴이 완전히 같습니다.

| family.pl                                                            | rules.pl                                                               | 같은 이유                            |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------ |
| `parent(tom, bob).`                                                  | `task_depends_on('TASK-ADCS-001', 'TASK-EPS-001').`                    | 둘 다 "관계"를 나타내는 사실         |
| `grandparent(X,Z) :- parent(X,Y), parent(Y,Z).`                      | `blocked(TaskId) :- task_depends_on(TaskId, Dep), \+ signed_off(Dep).` | 둘 다 조건 여러 개를 AND로 묶은 규칙 |
| `ancestor(X,Y) :- ...; ancestor(X,Y) :- parent(X,Z), ancestor(Z,Y).` | 우리가 연습 문제로 짜본 `transitively_blocked/1`                       | 둘 다 체인을 재귀로 따라감           |
| `unrelated/2`의 `\+`                                                 | `ready(TaskId) :- ..., \+ blocked(TaskId), ...`                        | 둘 다 "증명 안 됨"을 조건으로 씀     |

즉 오늘 배운 4가지(사실, 규칙+단일화, 재귀, 음성실패)가 우리 프로젝트 코드의 전부입니다.
새로운 개념은 없고, 같은 패턴을 도메인만 바꿔서 적용한 거예요.

## 7. 스스로 해볼 연습문제

`family.pl`을 열어서 아래를 추가해보세요. 정답은 알려드리지 않을게요 — 막히면 언제든
물어보세요.

1. `mother(X, Y)`를 이용해서, `pat`의 엄마가 누구인지 찾는 질의를 만들어보세요.
2. `sibling(bob, X)`를 실행하면 `liz`가 나옵니다. 왜 `X = bob` 자기 자신은 안 나오는지
   규칙을 다시 읽어보고 설명해보세요. (힌트: `X \= Y` 부분)
3. (도전) `cousin(X, Y)` — 사촌 관계를 정의해보세요. "부모끼리 형제(sibling)면 사촌이다."

3번을 풀면, 이게 바로 우리 `rules.pl`에서 "서로 다른 Cell에 속한 두 태스크가 같은
상위 요구사항을 공유하면 서로 연관됐다고 봐야 하는가?" 같은 실제 질문을 어떻게 규칙으로
옮기는지와 똑같은 사고 과정입니다.
