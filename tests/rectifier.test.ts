import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRectifier, defaults, parseNumber, type RectifierInput } from '../src/calculators/rectifier.ts';
const close = (actual: number, expected: number, tolerance = 1e-10) => assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
test('12 V filtered bridge independently worked example', () => { const r = calculateRectifier(defaults); close(r.peak, 15.57056274847714); close(r.ripple, 1); close(r.average, 15.07056274847714); close(r.valley, 14.57056274847714); assert.equal(r.rippleFrequency, 100); });
test('24 V, 60 Hz, 0.2 A, 2200 µF example', () => { const r = calculateRectifier({ ...defaults, rms: 24, frequency: 60, current: .2, capacitance: 2200 }); close(r.ripple, .7575757575757576); close(r.average, 32.16233761816640); assert.equal(r.rippleFrequency, 120); });
test('ideal full-wave published rounded 0.9 RMS agrees', () => { const r = calculateRectifier({ ...defaults, mode: 'full-wave' }); close(r.average, 10.80379579388527); close(r.peak, 16.97056274847714); assert.equal(r.valley, 0); assert.equal(r.rippleFrequency, 100); });
test('ideal half-wave complete-cycle average', () => { const r = calculateRectifier({ ...defaults, mode: 'half-wave' }); close(r.average, 5.401897896942637); assert.equal(r.rippleFrequency, 50); });
test('independent numerical integration of rectified sine', () => {
  const n = 100000; let full = 0; let half = 0;
  for (let i = 0; i < n; i++) { const v = 10 * Math.sin((i + .5) * 2 * Math.PI / n); full += Math.abs(v); half += Math.max(0, v); }
  close(calculateRectifier({ ...defaults, mode: 'full-wave', rms: 7.0710678118654755 }).average, full / n, 2e-8);
  close(calculateRectifier({ ...defaults, mode: 'half-wave', rms: 7.0710678118654755 }).average, half / n, 2e-8);
});
test('zero load limiting case has no ripple', () => { const r = calculateRectifier({ ...defaults, current: 0 }); assert.equal(r.average, r.peak); assert.equal(r.ripple, 0); });
test('zero input and zero load return zero', () => assert.equal(calculateRectifier({ ...defaults, rms: 0, current: 0 }).average, 0));
test('zero input with positive load rejected', () => assert.throws(() => calculateRectifier({ ...defaults, rms: 0 }), /diode/));
test('below bridge threshold with no load returns zero', () => assert.equal(calculateRectifier({ ...defaults, rms: .5, current: 0 }).peak, 0));
test('large ripple rejected', () => assert.throws(() => calculateRectifier({ ...defaults, capacitance: 1 }), /20%/));
test('20% ripple boundary accepted, above rejected', () => { const input = { ...defaults, rms: 10 / Math.SQRT2, diodeDrop: 0, capacitance: 1000, current: .2 }; close(calculateRectifier(input).average, 9); assert.throws(() => calculateRectifier({ ...input, current: .20001 }), /20%/); });
test('upper supported bounds produce finite result', () => { const r = calculateRectifier({ ...defaults, rms: 1000, frequency: 1000, current: 100, capacitance: 1000000, diodeDrop: 2 }); assert.ok(Number.isFinite(r.average)); });
test('minimum valid C and frequency with zero load', () => assert.ok(calculateRectifier({ ...defaults, frequency: 1, capacitance: 1, current: 0 }).average > 0));
test('irrelevant filtered settings ignored in ideal model', () => close(calculateRectifier({ ...defaults, mode: 'full-wave', capacitance: NaN, diodeDrop: NaN, current: NaN }).average, 10.80379579388527));
for (const [key, values] of Object.entries({ rms: [-1, 1001, NaN, Infinity], frequency: [0, 1001, NaN], diodeDrop: [-.1, 2.1, NaN], current: [-1, 101, NaN], capacitance: [0, 1000001, NaN] })) for (const value of values) test(`reject ${key} ${value}`, () => assert.throws(() => calculateRectifier({ ...defaults, [key]: value })));
test('unsupported model rejected', () => assert.throws(() => calculateRectifier({ ...defaults, mode: 'bad' } as unknown as RectifierInput)));
for (const raw of ['', ' ', '12V', '0x10', '1,000', 'Infinity', '1e999', '1e-999', '<script>']) test(`parse rejects ${JSON.stringify(raw)}`, () => assert.throws(() => parseNumber(raw, 'Input')));
test('decimal and exponent notation parse', () => { assert.equal(parseNumber('1e3', 'Input'), 1000); assert.equal(parseNumber('.25', 'Input'), .25); assert.equal(parseNumber('0e3', 'Input'), 0); });
