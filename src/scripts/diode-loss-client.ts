import {
  calculateDiodeLoss,
  type DiodeLossTopology
} from '../calculators/diode-loss';
import { formatResult as formatNumber } from '../lib/result-presentation';

document.querySelectorAll<HTMLElement>('[data-diode-loss-calc]').forEach(root => {
  const form = root.querySelector<HTMLFormElement>('form')!;
  const errorEl = root.querySelector<HTMLElement>('[data-dl-error]')!;
  const totalPowerOutput = root.querySelector<HTMLElement>('[data-dl-total-power]')!;
  const perDiodePowerOutput = root.querySelector<HTMLElement>('[data-dl-diode-power]')!;
  const thetaJaOutput = root.querySelector<HTMLElement>('[data-dl-theta-ja]')!;
  const thetaSaOutput = root.querySelector<HTMLElement>('[data-dl-theta-sa]')!;
  const adviceOutput = root.querySelector<HTMLElement>('[data-dl-advice]')!;
  const formulaOutput = root.querySelector<HTMLElement>('[data-dl-formula]')!;

  function getField(name: string): HTMLInputElement | HTMLSelectElement {
    return form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement;
  }

  function update() {
    try {
      const loadCurrent = parseFloat((getField('loadCurrent') as HTMLInputElement).value);
      const diodeDrop = parseFloat((getField('diodeDrop') as HTMLInputElement).value);
      const topology = (getField('topology') as HTMLSelectElement).value as DiodeLossTopology;
      const ambientTemp = parseFloat((getField('ambientTemp') as HTMLInputElement).value);
      const maxJunctionTemp = parseFloat((getField('maxJunctionTemp') as HTMLInputElement).value);

      if (isNaN(loadCurrent) || loadCurrent <= 0) throw new Error('Enter a valid load current greater than 0.');
      if (isNaN(diodeDrop) || diodeDrop <= 0) throw new Error('Enter a valid diode forward drop greater than 0.');

      const result = calculateDiodeLoss({
        loadCurrent,
        diodeDrop,
        topology,
        ambientTemp: isNaN(ambientTemp) ? 25 : ambientTemp,
        maxJunctionTemp: isNaN(maxJunctionTemp) ? 125 : maxJunctionTemp
      });

      errorEl.hidden = true;
      errorEl.textContent = '';

      totalPowerOutput.textContent = `${formatNumber(result.totalPowerLossWatts)} W`;
      perDiodePowerOutput.textContent = `${formatNumber(result.perDiodePowerWatts)} W`;
      thetaJaOutput.textContent = `${formatNumber(result.maxThermalResistanceJa)} °C/W`;
      thetaSaOutput.textContent = `${formatNumber(result.requiredHeatsinkSa)} °C/W`;
      adviceOutput.textContent = result.heatsinkRecommendation;
      formulaOutput.textContent = result.formula;
    } catch (err: unknown) {
      errorEl.hidden = false;
      errorEl.textContent = err instanceof Error ? err.message : 'Invalid calculation inputs.';
      totalPowerOutput.textContent = '—';
      perDiodePowerOutput.textContent = '—';
      thetaJaOutput.textContent = '—';
      thetaSaOutput.textContent = '—';
      adviceOutput.textContent = '—';
      formulaOutput.textContent = 'Correct the inputs above to update the calculation.';
    }
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    update();
  });

  form.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('input', update);
    input.addEventListener('change', update);
  });
});
