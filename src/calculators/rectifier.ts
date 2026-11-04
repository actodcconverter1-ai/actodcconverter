export type RectifierMode = 'bridge-filtered' | 'full-wave' | 'half-wave';
export interface RectifierInput { mode: RectifierMode; rms: number; frequency: number; diodeDrop: number; current: number; capacitance: number; }
export interface RectifierResult { average: number; peak: number; valley: number; ripple: number; rippleFrequency: number; }
export const defaults: RectifierInput = { mode: 'bridge-filtered', rms: 12, frequency: 50, diodeDrop: 0.7, current: 0.1, capacitance: 1000 };
export const limits = { rms: [0, 1000], frequency: [1, 1000], diodeDrop: [0, 2], current: [0, 100], capacitance: [1, 1000000] } as const;
export function parseNumber(raw: string, label: string): number {
  if (!raw.trim() || !/^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/.test(raw.trim())) throw new Error(`${label}: enter a number.`);
  const value = Number(raw);
  if (!Number.isFinite(value) || (value === 0 && /[1-9]/.test(raw.split(/[eE]/)[0]))) throw new Error(`${label}: value is outside the supported range.`);
  return value;
}
function range(value: number, min: number, max: number, label: string) {
  if (!Number.isFinite(value) || value < min || value > max) throw new Error(`${label} must be between ${min} and ${max}.`);
}
export function calculateRectifier(input: RectifierInput): RectifierResult {
  const { mode, rms, frequency, diodeDrop, current, capacitance } = input;
  if (!['bridge-filtered', 'full-wave', 'half-wave'].includes(mode)) throw new Error('Choose a supported rectifier model.');
  range(rms, ...limits.rms, 'AC RMS voltage (V)');
  range(frequency, ...limits.frequency, 'AC frequency (Hz)');
  const sinePeak = rms * Math.SQRT2;
  if (mode !== 'bridge-filtered') return { average: (mode === 'full-wave' ? 2 : 1) * sinePeak / Math.PI, peak: sinePeak, valley: 0, ripple: sinePeak, rippleFrequency: frequency * (mode === 'full-wave' ? 2 : 1) };
  range(diodeDrop, ...limits.diodeDrop, 'Forward drop per diode (V)');
  range(current, ...limits.current, 'Load current (A)');
  range(capacitance, ...limits.capacitance, 'Capacitance (µF)');
  const peak = Math.max(0, sinePeak - 2 * diodeDrop);
  if (peak === 0) {
    if (current > 0) throw new Error('The AC peak cannot overcome two diode drops at this load.');
    return { average: 0, peak: 0, valley: 0, ripple: 0, rippleFrequency: 2 * frequency };
  }
  const ripple = current / (2 * frequency * capacitance * 1e-6);
  // Tool guardrail for the small-ripple approximation, not an equipment design limit.
  if (ripple > 0.2 * peak * (1 + 8 * Number.EPSILON)) throw new Error('Estimated ripple exceeds 20% of the available peak. Increase capacitance, reduce load, or use a circuit simulation.');
  return { average: peak - ripple / 2, peak, valley: peak - ripple, ripple, rippleFrequency: 2 * frequency };
}
export function formatNumber(value: number): string { return new Intl.NumberFormat('en-US', { maximumSignificantDigits: 8 }).format(value); }
