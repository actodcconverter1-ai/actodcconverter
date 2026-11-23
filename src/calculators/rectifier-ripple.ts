/**
 * Rectifier Ripple Voltage & Ripple Factor Calculator Engine
 * Calculates peak-to-peak ripple (ΔVpp), RMS ripple, DC average, valley voltage,
 * and ripple factor percentage (γ) for capacitor-filtered rectifiers.
 */

export type RectifierRippleTopology = 'full-wave' | 'half-wave';
export type LoadType = 'current' | 'resistance';

export interface RectifierRippleInput {
  rms: number;                   // AC secondary RMS voltage (V)
  frequency: number;             // Line frequency (Hz)
  diodeDrop?: number;            // Forward drop per conducting diode (V), default 0.7
  capacitanceUf: number;         // Filter capacitance in microfarads (µF)
  loadType?: LoadType;           // 'current' (A) or 'resistance' (Ω)
  loadValue: number;             // Current in Amperes or Resistance in Ohms
  topology?: RectifierRippleTopology; // 'full-wave' (default) or 'half-wave'
}

export interface RectifierRippleResult {
  vPeak: number;                 // Peak voltage after diode drops (V)
  vDcAvg: number;                // Average DC output voltage (V)
  vValley: number;               // Valley (minimum) output voltage (V)
  rippleVpp: number;             // Peak-to-peak ripple voltage (V)
  rippleVrms: number;            // RMS ripple voltage (V)
  rippleFactorPercent: number;   // Ripple factor γ (%) = (V_ripple_rms / V_dc_avg) * 100
  rippleFrequency: number;       // Repetition frequency of ripple (Hz)
  formula: string;               // Step-by-step formula description
}

export const defaultRippleInput: RectifierRippleInput = {
  rms: 12,
  frequency: 50,
  diodeDrop: 0.7,
  capacitanceUf: 2200,
  loadType: 'current',
  loadValue: 0.5,
  topology: 'full-wave'
};

export function calculateRectifierRipple(input: RectifierRippleInput): RectifierRippleResult {
  const { rms, frequency, capacitanceUf, loadValue } = input;
  const diodeDrop = input.diodeDrop ?? 0.7;
  const topology = input.topology ?? 'full-wave';
  const loadType = input.loadType ?? 'current';

  if (!Number.isFinite(rms) || rms <= 0) {
    throw new TypeError('AC RMS voltage must be a positive number.');
  }
  if (!Number.isFinite(frequency) || frequency <= 0) {
    throw new TypeError('AC frequency must be a positive number.');
  }
  if (!Number.isFinite(capacitanceUf) || capacitanceUf <= 0) {
    throw new TypeError('Capacitance must be a positive number greater than 0.');
  }
  if (!Number.isFinite(loadValue) || loadValue <= 0) {
    throw new TypeError('Load value must be a positive number greater than 0.');
  }
  if (!Number.isFinite(diodeDrop) || diodeDrop < 0) {
    throw new TypeError('Diode forward drop cannot be negative.');
  }

  const numDiodes = topology === 'full-wave' ? 2 : 1;
  const rippleFrequency = topology === 'full-wave' ? 2 * frequency : frequency;
  const cFarads = capacitanceUf * 1e-6;

  // Unloaded peak voltage after diode conduction
  const rawPeak = Math.SQRT2 * rms;
  const vPeak = rawPeak - (numDiodes * diodeDrop);

  if (vPeak <= 0) {
    throw new RangeError('AC RMS input is too low to overcome the rectifier diode forward drop.');
  }

  let iLoad: number;
  if (loadType === 'current') {
    iLoad = loadValue;
  } else {
    // If resistance R is given, iterative approximation: I ≈ Vpeak / (R + 1/(2*f*C))
    // Linear first order: I ≈ Vpeak / R
    iLoad = vPeak / loadValue;
  }

  // Linear discharge approximation: ΔVpp = I / (f_ripple * C)
  let rippleVpp = iLoad / (rippleFrequency * cFarads);

  // Guard against non-physical ripple where ripple exceeds peak voltage
  if (rippleVpp > vPeak) {
    rippleVpp = vPeak;
  }

  const vValley = Math.max(0, vPeak - rippleVpp);
  const vDcAvg = vPeak - (rippleVpp / 2);

  // Triangular approximation of ripple waveform: Vrms = ΔVpp / (2 * √3)
  const rippleVrms = rippleVpp / (2 * Math.sqrt(3));

  // Ripple factor: γ = (Vripple_rms / Vdc_avg) * 100%
  const rippleFactorPercent = vDcAvg > 0 ? (rippleVrms / vDcAvg) * 100 : 0;

  const formula = `Vpeak = (${rms} × √2) − (${numDiodes} × ${diodeDrop}) = ${vPeak.toFixed(2)} V → ΔVpp = ${iLoad.toFixed(2)} A / (${rippleFrequency} Hz × ${capacitanceUf} µF) = ${rippleVpp.toFixed(2)} V → Vdc(avg) = ${vDcAvg.toFixed(2)} V, γ = ${rippleFactorPercent.toFixed(2)}%`;

  return {
    vPeak: Math.round(vPeak * 100) / 100,
    vDcAvg: Math.round(vDcAvg * 100) / 100,
    vValley: Math.round(vValley * 100) / 100,
    rippleVpp: Math.round(rippleVpp * 100) / 100,
    rippleVrms: Math.round(rippleVrms * 1000) / 1000,
    rippleFactorPercent: Math.round(rippleFactorPercent * 100) / 100,
    rippleFrequency,
    formula
  };
}
