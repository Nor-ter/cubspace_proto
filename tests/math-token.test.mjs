import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function load(file) {
  const source = fs.readFileSync(new URL(file, import.meta.url), 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const compiledModule = { exports: {} };
  vm.runInNewContext(output, {
    module: compiledModule,
    exports: compiledModule.exports,
    require: (name) => {
      throw new Error(name);
    },
    console,
  });
  return compiledModule.exports;
}
const { findMathTokens } = load('../frontend/src/lib/mathToken.ts');
test('math tokens respect word boundaries while preserving units and formulas', () => {
  assert.equal(findMathTokens('command/telemetry communication').join('|'), '');
  assert.equal(
    findMathTokens('10 mm, 0.31 W, rad/s').join('|'),
    '10 mm|0.31 W|rad/s',
  );
  assert.equal(
    findMathTokens('P=VI, τ=m×B, m=0.1 A·m²').join('|'),
    'P=VI|τ=m×B|m=0.1 A·m²',
  );
});
