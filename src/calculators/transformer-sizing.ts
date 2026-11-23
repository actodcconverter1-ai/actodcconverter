/**
 * Transformer VA & Secondary Sizing Calculator Engine
 * Calculates the required transformer secondary AC RMS voltage, secondary RMS current,
 * and minimum VA power rating to achieve a target regulated or smoothed DC output.
 */

export type TransformerTopology = 'bridge' | 'center-tapped' | 'half-wave';

export interface TransformerSizingInput {
  targetDcVoltage: number;   // Target DC voltage at capacitor/regulator input (V)
  dcLoadCurrent: number;     // Maximum continuous DC load current (A)
  diodeDrop?: number;        // Forward drop per diode (V), default 0.7
  rippleVoltage?: number;    // Peak-to-peak ripple allowance (V), default 10% of target DC
  topology?: TransformerTopology; // Default 'bridge'
}

export interface TransformerSizingResult {
  vSecRms: number;           // Secondary RMS voltage required (V)
  iSecRms: number;           // Secondary AC RMS current (A)
  nominalVa: number;         // Calculated minimum VA rating (V * A)
  recommendedVa: number;     // Next standard transformer rating with safety margin (VA)
  vPeak: number;             // Peak secondary voltage required (V)
  rippleFrequency: number;   // Ripple repetition frequency (Hz) at 50Hz line
  formula: string;           // Step-by-step calculation string
}

export const standardVaRatings: readonly number[] = [
  5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 80, 100,
  120, 150, 160, 200, 250, 300, 400, 500, 600, 800, 1000
];

export function findNextStandardVa(calculatedVa: number): number {
  // Add 25% safety / thermal margin for continuous operation
  const minimumRecommended = calculatedVa * 1.25;
  for (const rating of standardVaRatings) {
    if (rating >= minimumRecommended) return rating;
  }
  // If larger than 1000, round up to next 100 VA
  return Math.ceil(minimumRecommended / 100) * 100;
}

export const defaultTransformerInput: TransformerSizingInput = {
  targetDcVoltage: 12,
  dcLoadCurrent: 1.0,
  diodeDrop: 0.7,
  rippleVoltage: 1.2,
  topology: 'bridge'
};

export function calculateTransformerSizing(input: TransformerSizingInput): TransformerSizingResult {
  const vDc = input.targetDcVoltage;
  const iDc = input.dcLoadCurrent;
  const vf = input.diodeDrop ?? 0.7;
  const ripple = input.rippleVoltage ?? (vDc * 0.1);
  const topology = input.topology ?? 'bridge';

  if (!Number.isFinite(vDc) || vDc <= 0) {
    throw new TypeError('Target DC voltage must be a positive number.');
  }
  if (!Number.isFinite(iDc) || iDc <= 0) {
    throw new TypeError('DC load current must be a positive number.');
  }
  if (!Number.isFinite(vf) || vf < 0) {
    throw new TypeError('Diode forward drop cannot be negative.');
  }
  if (!Number.isFinite(ripple) || ripple < 0) {
    throw new TypeError('Ripple voltage cannot be negative.');
  }

  let numDiodeDrops: number;
  let currentFactor: number;
  let formulaTopology: string;

  switch (topology) {
    case 'bridge':
      numDiodeDrops = 2;
      currentFactor = 1.8; // Standard secondary RMS current factor for bridge rectifier with capacitor filter
      formulaTopology = 'Bridge (2 drops, Irms ≈ 1.8 × Idc)';
      break;
    case 'center-tapped':
      numDiodeDrops = 1;
      currentFactor = 1.2; // Each half conducts half-wave; total equivalent primary VA factor ≈ 1.5 - 1.6
      formulaTopology = 'Center-tapped (1 drop per half, Irms ≈ 1.2 × Idc per leg)';
      break;
    case 'half-wave':
      numDiodeDrops = 1;
      currentFactor = 2.2; // High crest factor and core DC magnetization
      formulaTopology = 'Half-wave (1 drop, Irms ≈ 2.2 × Idc)';
      break;
    default:
      throw new TypeError(`Unknown rectifier topology: ${topology}`);
  }

  // Peak voltage needed at transformer secondary to provide Vdc after diode drop and half of ripple peak-to-peak
  const vPeak = vDc + (numDiodeDrops * vf) + (ripple / 2);
  const vSecRms = vPeak / Math.SQRT2;
  const iSecRms = iDc * currentFactor;
  
  // For center-tapped, secondary has two legs (Vsec - 0 - Vsec), total winding VA = 2 * (vSecRms * iSecRms)
  const nominalVa = topology === 'center-tapped' 
    ? 2 * vSecRms * iSecRms 
    : vSecRms * iSecRms;

  const recommendedVa = findNextStandardVa(nominalVa);

  const formula = `Vpeak = ${vDc} + (${numDiodeDrops} × ${vf}) + (${ripple}/2) = ${vPeak.toFixed(2)} V → Vrms = ${vSecRms.toFixed(2)} V, Irms = ${iSecRms.toFixed(2)} A, VA = ${nominalVa.toFixed(1)} VA (${formulaTopology})`;

  return {
    vSecRms: Math.round(vSecRms * 100) / 100,
    iSecRms: Math.round(iSecRms * 100) / 100,
    nominalVa: Math.round(nominalVa * 10) / 10,
    recommendedVa,
    vPeak: Math.round(vPeak * 100) / 100,
    rippleFrequency: topology === 'half-wave' ? 50 : 100,
    formula
  };
}
