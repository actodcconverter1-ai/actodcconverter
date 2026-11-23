import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBleederResistor,
  findStandardResistance,
  findStandardPowerRating,
  defaultBleederInput
} from '../src/calculators/bleeder-resistor.ts';

test('calculates correct bleeder resistor value and power for default 160V 1000µF 5s input', () => {
  const result = calculateBleederResistor(defaultBleederInput);

  // ln(160 / 50) = ln(3.2) ≈ 1.16315
  // R = 5 / (0.001 * 1.16315) ≈ 4298.6 -> 4299 Ohms
  assert.equal(result.resistanceOhms, 4299);
  // Nearest lower standard E12 decade: 4.298 -> 3.9k (3900 Ohms)
  assert.equal(result.standardResistanceOhms, 3900);
  // Power at 3900 Ohms: 160^2 / 3900 = 25600 / 3900 ≈ 6.56 W
  assert.equal(result.powerDissipationWatts, 6.56);
  // Recommended wattage (2x safety factor): 6.56 * 2 = 13.12 -> 15 W
  assert.equal(result.recommendedPowerRatingWatts, 15);
  // Bleed current = 160 / 3900 * 1000 ≈ 41.0 mA
  assert.equal(result.bleedCurrentMa, 41.0);
});

test('findStandardResistance rounds down safely to guarantee discharge speed', () => {
  assert.equal(findStandardResistance(4500), 3900);
  assert.equal(findStandardResistance(10000), 10000);
  assert.equal(findStandardResistance(25000), 22000);
  assert.equal(findStandardResistance(95000), 82000);
});

test('findStandardPowerRating selects appropriate safety ratings', () => {
  assert.equal(findStandardPowerRating(0.1), 0.25);
  assert.equal(findStandardPowerRating(0.4), 1);
  assert.equal(findStandardPowerRating(2.0), 5);
  assert.equal(findStandardPowerRating(8.0), 20);
});

test('rejects safe voltage equal to or higher than operating voltage', () => {
  assert.throws(() => calculateBleederResistor({ ...defaultBleederInput, initialVoltage: 50, safeVoltage: 50 }), RangeError);
  assert.throws(() => calculateBleederResistor({ ...defaultBleederInput, initialVoltage: 40, safeVoltage: 50 }), RangeError);
});

test('rejects negative or zero parameters', () => {
  assert.throws(() => calculateBleederResistor({ ...defaultBleederInput, initialVoltage: 0 }), TypeError);
  assert.throws(() => calculateBleederResistor({ ...defaultBleederInput, capacitanceUf: -100 }), TypeError);
  assert.throws(() => calculateBleederResistor({ ...defaultBleederInput, targetDischargeTimeSeconds: 0 }), TypeError);
});
