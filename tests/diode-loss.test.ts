import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDiodeLoss,
  defaultDiodeLossInput
} from '../src/calculators/diode-loss.ts';

test('calculates correct power dissipation and heatsink for default 3A full-wave bridge', () => {
  const result = calculateDiodeLoss(defaultDiodeLossInput);

  // P_total = 2 * 0.8 * 3.0 = 4.8 W
  assert.equal(result.totalPowerLossWatts, 4.8);
  // Per diode = 4.8 / 4 = 1.2 W
  assert.equal(result.perDiodePowerWatts, 1.2);
  assert.equal(result.conductingDiodes, 2);
  assert.equal(result.totalDiodes, 4);

  // Delta T = 125 - 25 = 100°C -> theta_JA = 100 / 4.8 ≈ 20.83 -> 20.8 °C/W
  assert.equal(result.maxThermalResistanceJa, 20.8);
  // theta_SA = 20.83 - 2.5 = 18.33 -> 18.3 °C/W
  assert.equal(result.requiredHeatsinkSa, 18.3);
  assert.ok(result.heatsinkRecommendation.includes('Small PCB tab'));
});

test('calculates center-tapped full-wave rectifier diode losses', () => {
  const result = calculateDiodeLoss({
    loadCurrent: 5.0,
    diodeDrop: 0.5, // Schottky diode
    topology: 'center-tapped'
  });

  // Center-tapped has 1 diode conducting: P = 1 * 0.5 * 5.0 = 2.5 W
  assert.equal(result.totalPowerLossWatts, 2.5);
  // 2 total diodes: 2.5 / 2 = 1.25 W per diode
  assert.equal(result.perDiodePowerWatts, 1.25);
  assert.equal(result.conductingDiodes, 1);
});

test('calculates three-phase bridge rectifier diode losses', () => {
  const result = calculateDiodeLoss({
    loadCurrent: 10.0,
    diodeDrop: 0.9,
    topology: 'three-phase-bridge'
  });

  // 3-phase bridge has 2 diodes conducting: P = 2 * 0.9 * 10 = 18.0 W
  assert.equal(result.totalPowerLossWatts, 18.0);
  // 6 total diodes: 18 / 6 = 3.0 W per diode
  assert.equal(result.perDiodePowerWatts, 3.0);
});

test('detects when no heatsink is needed for light loads', () => {
  const result = calculateDiodeLoss({
    loadCurrent: 0.2,
    diodeDrop: 0.7,
    topology: 'full-wave-bridge'
  });

  // P = 2 * 0.7 * 0.2 = 0.28 W
  assert.equal(result.totalPowerLossWatts, 0.28);
  assert.ok(result.heatsinkRecommendation.includes('No heatsink required'));
});

test('rejects invalid inputs', () => {
  assert.throws(() => calculateDiodeLoss({ ...defaultDiodeLossInput, loadCurrent: 0 }), TypeError);
  assert.throws(() => calculateDiodeLoss({ ...defaultDiodeLossInput, diodeDrop: -0.5 }), TypeError);
  assert.throws(() => calculateDiodeLoss({ ...defaultDiodeLossInput, ambientTemp: 130, maxJunctionTemp: 125 }), RangeError);
});
