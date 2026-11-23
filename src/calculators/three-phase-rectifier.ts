/**
 * 3-Phase Bridge Rectifier Calculator Engine
 * Calculates average DC voltage, peak voltage, minimum trough voltage,
 * ripple frequency, native peak-to-peak ripple, and diode PIV for 3-phase rectifiers.
 */

export type ThreePhaseTopology = 'six-pulse-bridge' | 'three-pulse-half-wave';

export interface ThreePhaseInput {
  lineVoltageRms: number;        // Line-to-line AC RMS voltage (V_LL, e.g. 400V or 208V)
  frequency: number;             // Line frequency (Hz, 50 or 60)
  diodeDrop?: number;            // Forward voltage drop per conducting diode (V), default 0.7
  topology?: ThreePhaseTopology; // 'six-pulse-bridge' (default) or 'three-pulse-half-wave'
}

export interface ThreePhaseResult {
  vDcAvg: number;                // Average DC output voltage under load (V)
  vPeak: number;                 // Peak output DC voltage (V)
  vMin: number;                  // Minimum output voltage at ripple trough (V)
  rippleVpp: number;             // Native unfiltered peak-to-peak ripple (V)
  rippleFrequency: number;       // Ripple repetition frequency (Hz)
  rippleFactorPercent: number;   // Native unfiltered ripple factor (%)
  diodePiv: number;              // Diode peak inverse voltage rating required (V)
  formula: string;               // Calculation description
}

export const defaultThreePhaseInput: ThreePhaseInput = {
  lineVoltageRms: 400,
  frequency: 50,
  diodeDrop: 0.7,
  topology: 'six-pulse-bridge'
};

export function calculateThreePhaseRectifier(input: ThreePhaseInput): ThreePhaseResult {
  const vLL = input.lineVoltageRms;
  const f = input.frequency;
  const vf = input.diodeDrop ?? 0.7;
  const topology = input.topology ?? 'six-pulse-bridge';

  if (!Number.isFinite(vLL) || vLL <= 0) {
    throw new TypeError('Line-to-line RMS voltage must be a positive number.');
  }
  if (!Number.isFinite(f) || f <= 0) {
    throw new TypeError('Frequency must be a positive number.');
  }
  if (!Number.isFinite(vf) || vf < 0) {
    throw new TypeError('Diode forward drop cannot be negative.');
  }

  let vDcAvg: number;
  let vPeak: number;
  let vMin: number;
  let rippleVpp: number;
  let rippleFrequency: number;
  let rippleFactorPercent: number;
  const diodePiv = Math.SQRT2 * vLL; // Peak inverse voltage across non-conducting diode

  if (topology === 'six-pulse-bridge') {
    // 6-diode full-wave bridge: 2 diodes conduct in series at any instant
    const idealAvg = (3 * Math.SQRT2 / Math.PI) * vLL; // ≈ 1.35047 * V_LL
    vDcAvg = Math.max(0, idealAvg - (2 * vf));
    const idealPeak = Math.SQRT2 * vLL;
    vPeak = Math.max(0, idealPeak - (2 * vf));
    // Trough occurs at cos(30°) = sqrt(3)/2 ≈ 0.866025 of peak
    const idealMin = idealPeak * (Math.sqrt(3) / 2);
    vMin = Math.max(0, idealMin - (2 * vf));
    rippleVpp = vPeak - vMin;
    rippleFrequency = 6 * f; // 300 Hz at 50 Hz, 360 Hz at 60 Hz
    rippleFactorPercent = 4.04; // Theoretical unfiltered RMS ripple factor for 6-pulse
  } else {
    // 3-pulse half-wave (star-connected with neutral return)
    const vLN = vLL / Math.sqrt(3);
    const idealAvg = (3 * Math.sqrt(6) / (2 * Math.PI)) * vLN; // ≈ 1.1695 * V_LN ≈ 0.6752 * V_LL
    vDcAvg = Math.max(0, idealAvg - vf);
    const idealPeak = Math.SQRT2 * vLN;
    vPeak = Math.max(0, idealPeak - vf);
    // Trough occurs at cos(60°) = 0.5 of peak
    const idealMin = idealPeak * 0.5;
    vMin = Math.max(0, idealMin - vf);
    rippleVpp = vPeak - vMin;
    rippleFrequency = 3 * f; // 150 Hz at 50 Hz
    rippleFactorPercent = 17.7; // Theoretical unfiltered RMS ripple factor for 3-pulse
  }

  const formula = topology === 'six-pulse-bridge'
    ? `Vdc(avg) = (3√2/π) × ${vLL} − (2 × ${vf}) = ${vDcAvg.toFixed(1)} V (Vpeak = ${vPeak.toFixed(1)} V, fripple = ${rippleFrequency} Hz, native ripple ≈ 4.04%)`
    : `Vdc(avg) = (3√6/2π) × ${(vLL / Math.sqrt(3)).toFixed(1)} − ${vf} = ${vDcAvg.toFixed(1)} V (Vpeak = ${vPeak.toFixed(1)} V, fripple = ${rippleFrequency} Hz, native ripple ≈ 17.7%)`;

  return {
    vDcAvg: Math.round(vDcAvg * 10) / 10,
    vPeak: Math.round(vPeak * 10) / 10,
    vMin: Math.round(vMin * 10) / 10,
    rippleVpp: Math.round(rippleVpp * 10) / 10,
    rippleFrequency,
    rippleFactorPercent,
    diodePiv: Math.round(diodePiv * 10) / 10,
    formula
  };
}
