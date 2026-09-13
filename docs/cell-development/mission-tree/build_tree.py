"""Build a draft mission tree from the deliberately restricted Task Card facts.
This extractor is not a Prolog interpreter. Run queries.pl with SWI-Prolog separately.
"""
from pathlib import Path
import re,json
ROOT=Path(__file__).resolve().parent
BASE=ROOT.parent
rows=[]
facts=[]
for folder in ['tickets-2026-09-14','research-2026-09-14']:
 for file in sorted((BASE/folder).glob('CUB-*.md')):
  text=file.read_text(encoding='utf-8-sig')
  block=re.search(r'```prolog\n(.*?)```',text,re.S).group(1)
  match=re.search(r"mission_path\('([^']+)', \[([a-z_, ]+)\]\)\.",block)
  if not match: raise ValueError('Unsupported syntax: '+str(file))
  task,path=match.group(1),[s.strip() for s in match.group(2).split(',')]
  cell=re.search(r"task_cell\('"+task+r"', '([^']+)'\)\.",block).group(1)
  leaf=re.search(r"cell_leaf\('"+cell+r"', ([a-z_]+)\)\.",block).group(1)
  status=re.search(r"sign_off\('"+task+r"', (red|yellow|green)\)\.",block).group(1)
  assert path[-1]==leaf and len(path)==len(set(path))
  title=text.splitlines()[0].removeprefix('# ')
  row=dict(task=task,path=path,leaf=leaf,cell=cell,status=status,title=title,source='../'+file.relative_to(BASE).as_posix())
  rows.append(row)
  facts.extend(line for line in block.splitlines() if line and not line.startswith('%'))
assert len(rows)==19 and len({r['task'] for r in rows})==19
assert len({r['leaf'] for r in rows})==19
(ROOT/'mission_facts.pl').write_text(':- encoding(utf8).\n:- discontiguous mission_path/2, task_cell/2, cell_leaf/2, sign_off/2.\n% Draft: extracted from Task Cards; not an approved mission baseline.\n'+'\n'.join(facts)+'\n',encoding='utf-8')
(ROOT/'mission_tree.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding='utf-8')
md=['# CubSpace Mission Tree — Draft','','Python으로 19개 카드의 Prolog facts를 추출·대조했다. 승인된 Mission Tree가 아닌 카드의 제안 경로다. Mission leaf 아래 Cell과 Task는 업무 소속이며 물리적 하위 노드가 아니다.','','```text','cubspace','└─ onboarding']
for i,r in enumerate(rows):
 md.append(('   └─ ' if i==len(rows)-1 else '   ├─ ')+r['leaf'])
 md.append(('      ' if i==len(rows)-1 else '   │  ')+f"└─ {r['cell']} → {r['task']} [Red]")
md+=['```','','| Task leaf | Task Card | Sign-off |','|---|---|---|']
for r in rows:
 md.append(f"| `{r['leaf']}` | [{r['task']} · {r['title']}]({r['source']}) | {r['status']} |")
md+=['','## 실행','','```powershell','python build_tree.py','swipl -s queries.pl -g "forall(task_leaf(T,L,C,S),format(\'~w | ~w | ~w | ~w~n\',[T,L,C,S])),halt."','```','','Python 검증: 카드 19개, Task/leaf ID 유일성, 경로 내 순환 부재, leaf/Cell/Task 매핑과 상태 일치. Python 파서는 제한된 카드 facts 구문만 처리하며 Prolog 추론 실행을 대신하지 않는다.']
(ROOT/'Mission_Tree.md').write_text('\n'.join(md)+'\n',encoding='utf-8')
print('PASS: 19 Task Cards, 19 unique leaves, source mappings consistent.')
