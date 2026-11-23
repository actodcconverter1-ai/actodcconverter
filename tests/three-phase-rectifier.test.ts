import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateThreePhaseRectifier,
  defaultThreePhaseInput
} from '../src/calculators/three-phase-rectifier.ts';

test('calculates correct DC output for 400V 50Hz 3-phase bridge', () => {
  const result = calculateThreePhaseRectifier(defaultThreePhaseInput);

  // Ideal DC average = 1.35047 * 400 ≈ 540.19 V -> minus 1.4V = 538.79 -> 538.8 V
  assert.equal(result.vDcAvg, 538.8);
  // Vpeak = sqrt(2) * 400 - 1.4 ≈ 565.68 - 1.4 = 564.28 -> 564.3 V
  assert.equal(result.vPeak, 564.3);
  // Ripple frequency = 6 * 50 = 300 Hz
  assert.equal(result.rippleFrequency, 300);
  assert.equal(result.rippleFactorPercent, 4.04);
  // PIV = sqrt(2) * 400 ≈ 565.7 V
  assert.equal(result.diodePiv, 565.7);
});

test('calculates correct DC output for 208V 60Hz 3-phase bridge', () => {
  const result = calculateThreePhaseRectifier({
    lineVoltageRms: 208,
    frequency: 60,
    diodeDrop: 0.7,
    topology: 'six-pulse-bridge'
  });

  // Ideal DC avg = 1.35047 * 208 ≈ 280.9 V -> minus 1.4 = 279.5 V
  assert.equal(result.vDcAvg, 279.5);
  // Ripple frequency = 6 * 60 = 360 Hz
  assert.equal(result.rippleFrequency, 360);
});

test('calculates 3-pulse half-wave rectifier values correctly', () => {
  const result = calculateThreePhaseRectifier({
    lineVoltageRms: 400,
    frequency: 50,
    diodeDrop: 0.7,
    topology: 'three-pulse-half-wave'
  });

  // Ripple frequency = 3 * 50 = 150 Hz
  assert.equal(result.rippleFrequency, 150);
  assert.equal(result.rippleFactorPercent, 17.7);
  assert.ok(result.vDcAvg > 260 && result.vDcAvg < 280);
});

test('rejects non-positive inputs', () => {
  assert.throws(() => calculateThreePhaseRectifier({ ...defaultThreePhaseInput, lineVoltageRms: 0 }), /positive number/);
  assert.throws(() => calculateThreePhaseRectifier({ ...defaultThreePhaseInput, frequency: -60 }), /positive number/);
  assert.throws(() => calculateThreePhaseRectifier({ ...defaultThreePhaseInput, diodeDrop: -0.1 }), /negative/);
});
