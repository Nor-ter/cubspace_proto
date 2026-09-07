:- encoding(utf8).
% =====================================================================
% cubesat.pl — 지난 가족관계 튜토리얼과 정확히 같은 구조를, ACRUX-2의
% 실제 서브시스템/컴포넌트 계층(RPT-ENG-031, ConOps 근거)으로 다시 짠 것.
%
% 실행법: swipl -s cubesat.pl
% =====================================================================

% ---- 사실(Facts) : System < Subsystem < Component 계층 ----
% (개요 문서 6.1절 "Part-pair < Component < Subsystem < System" 그대로)
consists_of(acrux2, adcs).
consists_of(acrux2, eps).
consists_of(acrux2, comms).
consists_of(acrux2, obc).
consists_of(acrux2, payload).

consists_of(adcs, magnetorquer).           % Deneb Space 마그네토크커
consists_of(eps, battery_pack).            % 18650 Li-ion x3 (ConOps §2.1)
consists_of(eps, thermal_heater).          % 배터리 히터 (ConOps §3.1.1)
consists_of(comms, lora_module).           % LoRa (ConOps §4.1.2)
consists_of(comms, antenna).               % Endurosat 안테나 (ConOps §3.1.3)
consists_of(obc, atmega_mcu).              % ATMega MCU (ConOps §4.1.1)
consists_of(payload, etp_panel).           % ETP 태양광 패널 (ConOps §5.2)

% ---- 속성(가족예제의 male/female과 같은 역할) ----
% "미션 크리티컬 컴포넌트" — ConOps §7.1 Critical Failure Modes 근거
critical(antenna).      % 안테나 전개 실패 = 미션 종료급 (ConOps §7.1)
critical(battery_pack). % 배터리 열관리 실패 = 영구손상 위험 (ConOps §7.1)

% ---- 규칙(Rules) ----
% family.pl의 father/mother와 같은 패턴: "이 하위요소가 크리티컬한가"
critical_subcomponent(X, Y) :- consists_of(X, Y), critical(Y).

% family.pl의 grandparent와 같은 패턴: 두 단계 아래(System→Subsystem→Component)
assembly(X, Z) :- consists_of(X, Y), consists_of(Y, Z).

% family.pl의 sibling과 같은 패턴: 같은 상위요소 아래 있는 컴포넌트
sibling_component(X, Y) :- consists_of(P, X), consists_of(P, Y), X \= Y.

% ---- 재귀(Recursion) : family.pl의 ancestor와 같은 패턴 ----
% "System이 궁극적으로 무엇을 포함하는가" — 몇 단계든 상관없이
contains(X, Y) :- consists_of(X, Y).
contains(X, Y) :- consists_of(X, Z), contains(Z, Y).

% ---- 음성 실패(Negation as failure) : family.pl의 unrelated와 같은 패턴 ----
component(X) :- consists_of(X, _).
component(X) :- consists_of(_, X).

independent(X, Y) :-
    component(X), component(Y), X \= Y,
    \+ contains(X, Y),
    \+ contains(Y, X).
