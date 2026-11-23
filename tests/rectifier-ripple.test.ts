import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateRectifierRipple,
  defaultRippleInput
} from '../src/calculators/rectifier-ripple.ts';

test('calculates correct ripple voltage and factor for default 12V 50Hz full-wave bridge', () => {
  const result = calculateRectifierRipple(defaultRippleInput);

  // Vpeak = 12 * sqrt(2) - 1.4 ≈ 16.97 - 1.4 = 15.57 V
  assert.equal(result.vPeak, 15.57);
  // Ripple frequency for full wave = 100 Hz
  assert.equal(result.rippleFrequency, 100);
  // ΔVpp = 0.5 / (100 * 0.0022) ≈ 2.27 V
  assert.equal(result.rippleVpp, 2.27);
  // Vdc(avg) = 15.57 - 1.135 = 14.44 V (rounded 14.435 -> 14.44 or 14.43 depending on precision)
  assert.ok(Math.abs(result.vDcAvg - 14.43) <= 0.02);
  // Vvalley = 15.57 - 2.27 = 13.30 V
  assert.ok(Math.abs(result.vValley - 13.30) <= 0.02);
  // Ripple factor γ ≈ 4.5%
  assert.ok(result.rippleFactorPercent > 4.0 && result.rippleFactorPercent < 5.0);
});

test('calculates half-wave rectifier ripple with 50 Hz ripple frequency', () => {
  const result = calculateRectifierRipple({
    rms: 12,
    frequency: 50,
    diodeDrop: 0.7,
    capacitanceUf: 2200,
    loadType: 'current',
    loadValue: 0.5,
    topology: 'half-wave'
  });

  // Half wave has 1 diode drop: Vpeak = 12 * sqrt(2) - 0.7 ≈ 16.27 V
  assert.equal(result.vPeak, 16.27);
  // Ripple frequency for half-wave = 50 Hz (double the ripple pp)
  assert.equal(result.rippleFrequency, 50);
  // ΔVpp = 0.5 / (50 * 0.0022) ≈ 4.55 V
  assert.equal(result.rippleVpp, 4.55);
});

test('supports resistive load specification', () => {
  const result = calculateRectifierRipple({
    rms: 12,
    frequency: 60,
    diodeDrop: 0.7,
    capacitanceUf: 1000,
    loadType: 'resistance',
    loadValue: 50,
    topology: 'full-wave'
  });

  assert.equal(result.rippleFrequency, 120);
  assert.ok(result.rippleVpp > 0);
  assert.ok(result.vDcAvg > 0);
});

test('rejects negative or zero parameters', () => {
  assert.throws(() => calculateRectifierRipple({ ...defaultRippleInput, rms: 0 }), /positive number/);
  assert.throws(() => calculateRectifierRipple({ ...defaultRippleInput, frequency: -50 }), /positive number/);
  assert.throws(() => calculateRectifierRipple({ ...defaultRippleInput, capacitanceUf: 0 }), /positive number/);
  assert.throws(() => calculateRectifierRipple({ ...defaultRippleInput, loadValue: -1 }), /positive number/);
});

test('throws RangeError if AC voltage cannot overcome diode drops', () => {
  assert.throws(() => calculateRectifierRipple({ ...defaultRippleInput, rms: 0.5, diodeDrop: 1.0 }), RangeError);
});
