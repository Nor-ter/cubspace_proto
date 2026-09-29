:- encoding(utf8).
% =====================================================================
% cubesat.pl: exactly the same structure as the earlier family tutorial,
% rewritten with the actual ACRUX-2 subsystem/component hierarchy
% (based on RPT-ENG-031 and ConOps).
%
% How to run: swipl -s cubesat.pl
% =====================================================================

% ---- Facts: System < Subsystem < Component hierarchy ----
% (exactly as in overview document Section 6.1, "Part-pair < Component < Subsystem < System")
consists_of(acrux2, adcs).
consists_of(acrux2, eps).
consists_of(acrux2, comms).
consists_of(acrux2, obc).
consists_of(acrux2, payload).

consists_of(adcs, magnetorquer).           % Deneb Space magnetorquer
consists_of(eps, battery_pack).            % 18650 Li-ion x3 (ConOps §2.1)
consists_of(eps, thermal_heater).          % Battery heater (ConOps §3.1.1)
consists_of(comms, lora_module).           % LoRa (ConOps §4.1.2)
consists_of(comms, antenna).               % Endurosat antenna (ConOps §3.1.3)
consists_of(obc, atmega_mcu).              % ATMega MCU (ConOps §4.1.1)
consists_of(payload, etp_panel).           % ETP solar panel (ConOps §5.2)

% ---- Properties (same role as male/female in the family example) ----
% "Mission-critical components", based on ConOps §7.1 Critical Failure Modes
critical(antenna).      % Antenna deployment failure = mission-ending (ConOps §7.1)
critical(battery_pack). % Battery thermal management failure = risk of permanent damage (ConOps §7.1)

% ---- Rules ----
% Same pattern as father/mother in family.pl: "is this sub-element critical?"
critical_subcomponent(X, Y) :- consists_of(X, Y), critical(Y).

% Same pattern as grandparent in family.pl: two levels down (System→Subsystem→Component)
assembly(X, Z) :- consists_of(X, Y), consists_of(Y, Z).

% Same pattern as sibling in family.pl: components under the same parent element
sibling_component(X, Y) :- consists_of(P, X), consists_of(P, Y), X \= Y.

% ---- Recursion: same pattern as ancestor in family.pl ----
% "What does the System ultimately contain?", regardless of how many levels
contains(X, Y) :- consists_of(X, Y).
contains(X, Y) :- consists_of(X, Z), contains(Z, Y).

% ---- Negation as failure: same pattern as unrelated in family.pl ----
component(X) :- consists_of(X, _).
component(X) :- consists_of(_, X).

independent(X, Y) :-
    component(X), component(Y), X \= Y,
    \+ contains(X, Y),
    \+ contains(Y, X).
