import test from'node:test';import assert from'node:assert/strict';
import{formatResult}from'../src/lib/result-presentation.ts';
import{readDecimalInput,metricLabel}from'../src/lib/result-presentation.ts';
test('decimal entry accepts a dot, comma and Arabic decimal digits without grouping',()=>{for(const raw of['12.5','12,5','١٢٫٥'])assert.equal(readDecimalInput(raw,0,1000),12.5);for(const raw of['','12,5.6','1,2,3','Infinity','1e999','1e-999','-1','1001'])assert.throws(()=>readDecimalInput(raw,0,1000));});
test('locale output and regulator labels explicitly retain the minimum-input basis',()=>{assert.equal(formatResult(15.0705627,'fr'),'15,071');assert.equal(formatResult(1e-8,'de'),'<0,001');assert.equal(metricLabel('Estimated stage loss','regulated'),'Stage loss at minimum DC input');assert.equal(metricLabel('Output crest','filtered'),'Output crest');});
test('result display rounds without changing the supplied numeric value',()=>{const value=15.07056274847714;assert.equal(formatResult(value),'15.071');assert.equal(value,15.07056274847714);assert.equal(formatResult(10.803795793),'10.804');});
test('very small nonzero results are not presented as exactly zero',()=>{assert.equal(formatResult(1e-8),'<0.001');assert.equal(formatResult(-1e-8),'>-0.001');assert.equal(formatResult(0),'0');assert.equal(formatResult(-0),'0');});
