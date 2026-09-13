# CubSpace Mission Tree and Task Cards

Draft knowledge snapshot derived from 19 Task Cards. All sign-off states are red. This is not an approved mission baseline.

- [Mission Tree](mission-tree/Mission_Tree.md)
- [Task Card inventory](CubSpace_Task_Card_Inventory.md)
- [Research summaries](research-2026-09-14/INDEX.md)

Rebuild from this directory:

```sh
python mission-tree/build_tree.py
swipl -s mission-tree/queries.pl -g "findall(T,task_leaf(T,_,_,_),Ts),length(Ts,19),halt."
```

Python uses only the standard library. Prolog queries require SWI-Prolog. Source PDFs, print exports, archives and local inspection intermediates are not included. Research download and PDF verification notes describe the original local investigation; their generated PDFs are not stored here.
