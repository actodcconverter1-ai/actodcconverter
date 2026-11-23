import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTransformerSizing,
  findNextStandardVa,
  standardVaRatings
} from '../src/calculators/transformer-sizing.ts';

test('calculates correct transformer secondary voltage and VA for 12V 1A bridge rectifier', () => {
  const result = calculateTransformerSizing({
    targetDcVoltage: 12,
    dcLoadCurrent: 1.0,
    diodeDrop: 0.7,
    rippleVoltage: 1.2,
    topology: 'bridge'
  });

  // Vpeak = 12 + (2 * 0.7) + (1.2 / 2) = 12 + 1.4 + 0.6 = 14.0 V
  assert.equal(result.vPeak, 14.0);
  // Vrms = 14.0 / sqrt(2) ≈ 9.899 -> 9.9 V
  assert.equal(result.vSecRms, 9.9);
  // Irms = 1.0 * 1.8 = 1.8 A
  assert.equal(result.iSecRms, 1.8);
  // Nominal VA = 9.899 * 1.8 ≈ 17.82 -> 17.8 VA
  assert.equal(result.nominalVa, 17.8);
  // Recommended standard VA with 25% margin: 17.8 * 1.25 = 22.25 -> 25 VA
  assert.equal(result.recommendedVa, 25);
  assert.equal(result.rippleFrequency, 100);
});

test('calculates correct secondary specs for center-tapped full-wave rectifier', () => {
  const result = calculateTransformerSizing({
    targetDcVoltage: 12,
    dcLoadCurrent: 1.0,
    diodeDrop: 0.7,
    rippleVoltage: 1.2,
    topology: 'center-tapped'
  });

  // Vpeak = 12 + (1 * 0.7) + 0.6 = 13.3 V
  assert.equal(result.vPeak, 13.3);
  // Vrms per leg = 13.3 / sqrt(2) ≈ 9.40 V
  assert.equal(result.vSecRms, 9.4);
  // Irms per leg = 1.0 * 1.2 = 1.2 A
  assert.equal(result.iSecRms, 1.2);
  // Total nominal VA = 2 * (9.4045 * 1.2) ≈ 22.57 -> 22.6 VA
  assert.equal(result.nominalVa, 22.6);
  // Recommended standard VA with 25% margin: 22.57 * 1.25 = 28.2 -> 30 VA
  assert.equal(result.recommendedVa, 30);
});

test('calculates correct secondary specs for half-wave rectifier', () => {
  const result = calculateTransformerSizing({
    targetDcVoltage: 12,
    dcLoadCurrent: 0.5,
    diodeDrop: 0.7,
    rippleVoltage: 1.0,
    topology: 'half-wave'
  });

  // Vpeak = 12 + 0.7 + 0.5 = 13.2 V
  assert.equal(result.vPeak, 13.2);
  // Irms = 0.5 * 2.2 = 1.1 A
  assert.equal(result.iSecRms, 1.1);
  assert.equal(result.rippleFrequency, 50);
});

test('findNextStandardVa selects appropriate standard transformers', () => {
  assert.equal(findNextStandardVa(5), 10); // 5 * 1.25 = 6.25 -> 10
  assert.equal(findNextStandardVa(35), 50); // 35 * 1.25 = 43.75 -> 50
  assert.equal(findNextStandardVa(80), 100); // 80 * 1.25 = 100 -> 100
  assert.equal(findNextStandardVa(100), 150); // 100 * 1.25 = 125 -> 150
  assert.ok(standardVaRatings.includes(findNextStandardVa(10)));
});

test('rejects negative or zero voltages and currents', () => {
  assert.throws(() => calculateTransformerSizing({ targetDcVoltage: 0, dcLoadCurrent: 1 }), /positive number/);
  assert.throws(() => calculateTransformerSizing({ targetDcVoltage: 12, dcLoadCurrent: -1 }), /positive number/);
  assert.throws(() => calculateTransformerSizing({ targetDcVoltage: 12, dcLoadCurrent: 1, diodeDrop: -0.5 }), /negative/);
});
