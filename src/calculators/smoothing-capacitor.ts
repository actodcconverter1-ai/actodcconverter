export type RectifierType = 'full-wave' | 'half-wave';

export interface SmoothingCapacitorInput {
  current: number; // Load current in Amperes (e.g., 0.5 A)
  frequency: number; // AC grid frequency in Hz (e.g., 50 or 60 Hz)
  rectifierType: RectifierType; // 'full-wave' (2f) or 'half-wave' (f)
  rippleVoltage: number; // Desired max peak-to-peak ripple in Volts (e.g., 1.0 V)
  rms?: number; // Optional input AC RMS voltage for capacitor voltage rating
}

export interface SmoothingCapacitorResult {
  capacitanceFarads: number;
  capacitanceUf: number;
  rippleFrequency: number;
  recommendedStandardUf: number;
  dcPeakVoltage: number | null;
  recommendedVoltageRating: number | null;
  formula: string;
}

export const standardCapacitorValuesUf = [
  10, 15, 22, 33, 47, 68,
  100, 150, 220, 330, 470, 680,
  1000, 1500, 2200, 3300, 4700, 6800,
  10000, 15000, 22000, 33000, 47000, 68000,
  100000
];

export const standardVoltageRatings = [
  6.3, 10, 16, 25, 35, 50, 63, 100, 160, 200, 250, 350, 400, 450, 500
];

export function findNextStandardCapacitor(requiredUf: number): number {
  for (const std of standardCapacitorValuesUf) {
    if (std >= requiredUf) return std;
  }
  return Math.ceil(requiredUf / 1000) * 1000;
}

export function findNextVoltageRating(minVoltage: number): number {
  for (const rating of standardVoltageRatings) {
    if (rating >= minVoltage) return rating;
  }
  return Math.ceil(minVoltage / 50) * 50;
}

export function calculateSmoothingCapacitor(input: SmoothingCapacitorInput): SmoothingCapacitorResult {
  if (input.current <= 0) throw new Error('Load current must be greater than zero.');
  if (input.frequency <= 0) throw new Error('AC frequency must be greater than zero.');
  if (input.rippleVoltage <= 0) throw new Error('Ripple voltage must be greater than zero.');

  const rippleFrequency = input.rectifierType === 'full-wave' ? 2 * input.frequency : input.frequency;
  // C = I / (f_ripple * Vrpp)
  const capacitanceFarads = input.current / (rippleFrequency * input.rippleVoltage);
  const capacitanceUf = capacitanceFarads * 1_000_000;
  const recommendedStandardUf = findNextStandardCapacitor(capacitanceUf);

  let dcPeakVoltage: number | null = null;
  let recommendedVoltageRating: number | null = null;

  if (typeof input.rms === 'number' && input.rms > 0) {
    const diodeDrop = input.rectifierType === 'full-wave' ? 1.4 : 0.7;
    dcPeakVoltage = Math.max(0, input.rms * Math.SQRT2 - diodeDrop);
    // Standard rule of thumb: 1.5x working margin
    const minSafeRating = dcPeakVoltage * 1.5;
    recommendedVoltageRating = findNextVoltageRating(minSafeRating);
  }

  const formula = input.rectifierType === 'full-wave'
    ? 'C = I / (2f × ΔVpp)'
    : 'C = I / (f × ΔVpp)';

  return {
    capacitanceFarads,
    capacitanceUf,
    rippleFrequency,
    recommendedStandardUf,
    dcPeakVoltage,
    recommendedVoltageRating,
    formula
  };
}

export const defaultSmoothingInput: SmoothingCapacitorInput = {
  current: 0.5,
  frequency: 50,
  rectifierType: 'full-wave',
  rippleVoltage: 1.0,
  rms: 12
};
