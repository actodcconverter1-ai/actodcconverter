/**
 * Diode Conduction Loss & Heatsink Sizing Calculator Engine
 * Calculates total rectifier bridge power dissipation (Watts), individual diode losses,
 * thermal rise, and required heatsink thermal resistance (θ_SA, °C/W).
 */

export type DiodeLossTopology = 'full-wave-bridge' | 'center-tapped' | 'three-phase-bridge' | 'half-wave';

export interface DiodeLossInput {
  loadCurrent: number;               // DC output load current (A)
  diodeDrop?: number;                // Forward voltage drop per conducting diode at load (V), default 0.8
  topology?: DiodeLossTopology;      // Rectifier configuration (default 'full-wave-bridge')
  ambientTemp?: number;              // Ambient temperature (°C), default 25
  maxJunctionTemp?: number;          // Maximum allowable junction temperature (°C), default 125
  thermalResistanceJc?: number;      // Package junction-to-case resistance (°C/W), default 2.0
}

export interface DiodeLossResult {
  totalPowerLossWatts: number;       // Total power dissipated in rectifier (W)
  perDiodePowerWatts: number;        // Average power dissipated per diode package (W)
  conductingDiodes: number;          // Diodes conducting in series simultaneously
  totalDiodes: number;               // Total number of diodes in circuit
  maxThermalResistanceJa: number;    // Maximum allowable junction-to-ambient resistance (°C/W)
  requiredHeatsinkSa: number;        // Maximum heatsink thermal resistance required (°C/W)
  heatsinkRecommendation: string;    // Actionable cooling advice
  formula: string;                   // Step-by-step calculation string
}

export const defaultDiodeLossInput: DiodeLossInput = {
  loadCurrent: 3.0,
  diodeDrop: 0.8,
  topology: 'full-wave-bridge',
  ambientTemp: 25,
  maxJunctionTemp: 125,
  thermalResistanceJc: 2.0
};

export function calculateDiodeLoss(input: DiodeLossInput): DiodeLossResult {
  const iDc = input.loadCurrent;
  const vf = input.diodeDrop ?? 0.8;
  const topology = input.topology ?? 'full-wave-bridge';
  const tAmb = input.ambientTemp ?? 25;
  const tJMax = input.maxJunctionTemp ?? 125;
  const thetaJc = input.thermalResistanceJc ?? 2.0;
  const thetaCs = 0.5; // Typical thermal interface pad/grease resistance (°C/W)

  if (!Number.isFinite(iDc) || iDc <= 0) {
    throw new TypeError('Load current must be a positive number of Amperes.');
  }
  if (!Number.isFinite(vf) || vf <= 0) {
    throw new TypeError('Diode forward voltage drop must be a positive number.');
  }
  if (!Number.isFinite(tAmb)) {
    throw new TypeError('Ambient temperature must be a valid number.');
  }
  if (!Number.isFinite(tJMax) || tJMax <= tAmb) {
    throw new RangeError('Maximum junction temperature must be higher than ambient temperature.');
  }

  let conductingDiodes: number;
  let totalDiodes: number;

  switch (topology) {
    case 'full-wave-bridge':
      conductingDiodes = 2;
      totalDiodes = 4;
      break;
    case 'center-tapped':
      conductingDiodes = 1;
      totalDiodes = 2;
      break;
    case 'three-phase-bridge':
      conductingDiodes = 2;
      totalDiodes = 6;
      break;
    case 'half-wave':
      conductingDiodes = 1;
      totalDiodes = 1;
      break;
    default:
      throw new TypeError(`Unknown rectifier topology: ${topology}`);
  }

  // Total continuous power dissipation: P_total = conductingDiodes * V_f * I_dc
  const totalPowerLossWatts = conductingDiodes * vf * iDc;
  const perDiodePowerWatts = totalPowerLossWatts / totalDiodes;

  // Maximum allowable junction-to-ambient thermal resistance:
  // θ_JA = (T_J_max - T_Amb) / P_total
  const tempRiseMax = tJMax - tAmb;
  const maxThermalResistanceJa = tempRiseMax / totalPowerLossWatts;

  // Required heatsink: θ_SA = θ_JA - (θ_JC + θ_CS)
  const requiredHeatsinkSa = Math.max(0, maxThermalResistanceJa - (thetaJc + thetaCs));

  let heatsinkRecommendation: string;
  if (totalPowerLossWatts < 1.0 && maxThermalResistanceJa >= 40) {
    heatsinkRecommendation = 'No heatsink required (free air convection is sufficient)';
  } else if (requiredHeatsinkSa >= 15) {
    heatsinkRecommendation = `Small PCB tab or clip-on heatsink (rating ≤ ${requiredHeatsinkSa.toFixed(1)} °C/W)`;
  } else if (requiredHeatsinkSa >= 3.0) {
    heatsinkRecommendation = `Extruded aluminum heatsink required (rating ≤ ${requiredHeatsinkSa.toFixed(1)} °C/W)`;
  } else if (requiredHeatsinkSa > 0) {
    heatsinkRecommendation = `Large heatsink with forced-air cooling fan required (rating ≤ ${requiredHeatsinkSa.toFixed(1)} °C/W)`;
  } else {
    heatsinkRecommendation = 'Exceeds passive thermal limit. Forced-air fan or paralleled bridges required.';
  }

  const formula = `P_total = ${conductingDiodes} × ${vf} V × ${iDc} A = ${totalPowerLossWatts.toFixed(2)} W (Per diode: ${perDiodePowerWatts.toFixed(2)} W) → θ_SA ≤ (${tJMax}°C − ${tAmb}°C)/${totalPowerLossWatts.toFixed(2)}W − ${thetaJc + thetaCs}°C/W = ${requiredHeatsinkSa.toFixed(1)} °C/W`;

  return {
    totalPowerLossWatts: Math.round(totalPowerLossWatts * 100) / 100,
    perDiodePowerWatts: Math.round(perDiodePowerWatts * 100) / 100,
    conductingDiodes,
    totalDiodes,
    maxThermalResistanceJa: Math.round(maxThermalResistanceJa * 10) / 10,
    requiredHeatsinkSa: Math.round(requiredHeatsinkSa * 10) / 10,
    heatsinkRecommendation,
    formula
  };
}
