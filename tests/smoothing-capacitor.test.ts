import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSmoothingCapacitor,
  findNextStandardCapacitor,
  findNextVoltageRating,
  defaultSmoothingInput
} from '../src/calculators/smoothing-capacitor.ts';

test('calculates correct capacitance for 12V 50Hz full-wave bridge at 0.5A and 1V ripple', () => {
  // C = 0.5 / (2 * 50 * 1.0) = 0.5 / 100 = 0.005 F = 5,000 µF
  const result = calculateSmoothingCapacitor(defaultSmoothingInput);
  assert.equal(result.rippleFrequency, 100);
  assert.equal(result.capacitanceFarads, 0.005);
  assert.equal(result.capacitanceUf, 5000);
  assert.equal(result.recommendedStandardUf, 6800); // Next standard E12 above 5000 is 6800
  assert.ok(result.dcPeakVoltage !== null && result.dcPeakVoltage > 15 && result.dcPeakVoltage < 16);
  assert.equal(result.recommendedVoltageRating, 25); // (15.57 * 1.5 = 23.35) -> 25V standard
});

test('calculates correct capacitance for half-wave rectifier', () => {
  // C = 0.5 / (1 * 50 * 1.0) = 0.5 / 50 = 0.010 F = 10,000 µF
  const result = calculateSmoothingCapacitor({
    ...defaultSmoothingInput,
    rectifierType: 'half-wave'
  });
  assert.equal(result.rippleFrequency, 50);
  assert.equal(result.capacitanceFarads, 0.01);
  assert.equal(result.capacitanceUf, 10000);
  assert.equal(result.recommendedStandardUf, 10000);
});

test('standard capacitor finder selects correct E12 values', () => {
  assert.equal(findNextStandardCapacitor(450), 470);
  assert.equal(findNextStandardCapacitor(1000), 1000);
  assert.equal(findNextStandardCapacitor(1050), 1500);
  assert.equal(findNextStandardCapacitor(2000), 2200);
});

test('standard voltage rating finder selects safe ratings', () => {
  assert.equal(findNextVoltageRating(12), 16);
  assert.equal(findNextVoltageRating(16), 16);
  assert.equal(findNextVoltageRating(18), 25);
  assert.equal(findNextVoltageRating(30), 35);
  assert.equal(findNextVoltageRating(48), 50);
});

test('rejects non-positive inputs with descriptive errors', () => {
  assert.throws(() => calculateSmoothingCapacitor({ ...defaultSmoothingInput, current: 0 }), /Load current/);
  assert.throws(() => calculateSmoothingCapacitor({ ...defaultSmoothingInput, frequency: -10 }), /frequency/);
  assert.throws(() => calculateSmoothingCapacitor({ ...defaultSmoothingInput, rippleVoltage: 0 }), /Ripple voltage/);
});
