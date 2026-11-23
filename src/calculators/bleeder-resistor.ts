/**
 * Bleeder Resistor Safety Calculator Engine
 * Calculates the required bleeder resistor resistance (Ohms), time constant (tau),
 * continuous operating power loss (Watts), bleed current (mA), and recommended
 * standard resistor power rating to discharge filter capacitors to safe voltage.
 */

export interface BleederResistorInput {
  initialVoltage: number;            // Normal operating DC capacitor voltage (V)
  capacitanceUf: number;             // Total filter capacitance in microfarads (µF)
  targetDischargeTimeSeconds: number;// Desired time to reach safe voltage (seconds)
  safeVoltage?: number;              // Target safe voltage threshold (V, default 50V)
}

export interface BleederResistorResult {
  resistanceOhms: number;            // Calculated maximum resistance (Ohms)
  standardResistanceOhms: number;    // Nearest standard E12/E24 resistance (Ohms)
  timeConstantSeconds: number;       // RC time constant tau = R * C (seconds)
  powerDissipationWatts: number;     // Continuous power dissipation at V_initial (Watts)
  recommendedPowerRatingWatts: number; // Recommended standard resistor power rating (Watts)
  bleedCurrentMa: number;            // Continuous quiescent bleed current (mA)
  formula: string;                   // Step-by-step calculation string
}

export const standardPowerRatings: readonly number[] = [
  0.25, 0.5, 1, 2, 3, 5, 7, 10, 15, 20, 25, 50, 100
];

const E12_VALUES = [1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2];

export function findStandardResistance(ohms: number): number {
  if (ohms <= 0) return 0;
  const decade = Math.pow(10, Math.floor(Math.log10(ohms)));
  const normalized = ohms / decade;

  // For a bleeder resistor, we must round DOWN to the nearest standard value
  // so the discharge time is GUARANTEED to be less than or equal to the target time!
  let best = E12_VALUES[0];
  for (const val of E12_VALUES) {
    if (val <= normalized) {
      best = val;
    } else {
      break;
    }
  }
  return Math.round(best * decade);
}

export function findStandardPowerRating(watts: number): number {
  // Apply a 2x thermal safety factor for reliable continuous duty
  const minimumSafe = watts * 2.0;
  for (const rating of standardPowerRatings) {
    if (rating >= minimumSafe) return rating;
  }
  return Math.ceil(minimumSafe / 10) * 10;
}

export const defaultBleederInput: BleederResistorInput = {
  initialVoltage: 160,
  capacitanceUf: 1000,
  targetDischargeTimeSeconds: 5,
  safeVoltage: 50
};

export function calculateBleederResistor(input: BleederResistorInput): BleederResistorResult {
  const { initialVoltage, capacitanceUf, targetDischargeTimeSeconds } = input;
  const safeVoltage = input.safeVoltage ?? 50;

  if (!Number.isFinite(initialVoltage) || initialVoltage <= 0) {
    throw new TypeError('Operating DC voltage must be a positive number.');
  }
  if (!Number.isFinite(capacitanceUf) || capacitanceUf <= 0) {
    throw new TypeError('Capacitance must be a positive number.');
  }
  if (!Number.isFinite(targetDischargeTimeSeconds) || targetDischargeTimeSeconds <= 0) {
    throw new TypeError('Target discharge time must be a positive number of seconds.');
  }
  if (!Number.isFinite(safeVoltage) || safeVoltage <= 0) {
    throw new TypeError('Safe threshold voltage must be a positive number.');
  }
  if (safeVoltage >= initialVoltage) {
    throw new RangeError('Safe voltage threshold must be strictly lower than operating voltage.');
  }

  const cFarads = capacitanceUf * 1e-6;
  const voltageRatio = initialVoltage / safeVoltage;
  const lnRatio = Math.log(voltageRatio);

  // R = t / (C * ln(V0 / Vsafe))
  const resistanceOhms = targetDischargeTimeSeconds / (cFarads * lnRatio);
  const standardResistanceOhms = findStandardResistance(resistanceOhms);

  // Recalculate using the standard resistance for accurate practical power loss
  const practicalR = standardResistanceOhms > 0 ? standardResistanceOhms : resistanceOhms;
  const timeConstantSeconds = practicalR * cFarads;
  const powerDissipationWatts = (initialVoltage * initialVoltage) / practicalR;
  const recommendedPowerRatingWatts = findStandardPowerRating(powerDissipationWatts);
  const bleedCurrentMa = (initialVoltage / practicalR) * 1000;

  const formula = `R = t / [C × ln(V0/Vsafe)] = ${targetDischargeTimeSeconds} / [(${capacitanceUf}µF) × ln(${initialVoltage}/${safeVoltage})] = ${Math.round(resistanceOhms)} Ω → Standard E12: ${standardResistanceOhms} Ω, P = V² / R = ${powerDissipationWatts.toFixed(2)} W (Rating: ${recommendedPowerRatingWatts} W)`;

  return {
    resistanceOhms: Math.round(resistanceOhms),
    standardResistanceOhms,
    timeConstantSeconds: Math.round(timeConstantSeconds * 100) / 100,
    powerDissipationWatts: Math.round(powerDissipationWatts * 100) / 100,
    recommendedPowerRatingWatts,
    bleedCurrentMa: Math.round(bleedCurrentMa * 10) / 10,
    formula
  };
}
