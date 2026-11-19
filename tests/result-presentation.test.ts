import test from'node:test';import assert from'node:assert/strict';
import{formatResult}from'../src/lib/result-presentation.ts';
test('result display rounds without changing the supplied numeric value',()=>{const value=15.07056274847714;assert.equal(formatResult(value),'15.071');assert.equal(value,15.07056274847714);assert.equal(formatResult(10.803795793),'10.804');});
test('very small nonzero results are not presented as exactly zero',()=>{assert.equal(formatResult(1e-8),'<0.001');assert.equal(formatResult(-1e-8),'>-0.001');assert.equal(formatResult(0),'0');assert.equal(formatResult(-0),'0');});
