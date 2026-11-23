import {
  calculateThreePhaseRectifier,
  type ThreePhaseTopology
} from '../calculators/three-phase-rectifier';
import { formatResult as formatNumber } from '../lib/result-presentation';

document.querySelectorAll<HTMLElement>('[data-three-phase-calc]').forEach(root => {
  const form = root.querySelector<HTMLFormElement>('form')!;
  const errorEl = root.querySelector<HTMLElement>('[data-tp-error]')!;
  const vDcOutput = root.querySelector<HTMLElement>('[data-tp-vdc]')!;
  const vPeakOutput = root.querySelector<HTMLElement>('[data-tp-vpeak]')!;
  const vMinOutput = root.querySelector<HTMLElement>('[data-tp-vmin]')!;
  const rippleVppOutput = root.querySelector<HTMLElement>('[data-tp-vpp]')!;
  const rippleFreqOutput = root.querySelector<HTMLElement>('[data-tp-freq]')!;
  const rippleFactorOutput = root.querySelector<HTMLElement>('[data-tp-factor]')!;
  const diodePivOutput = root.querySelector<HTMLElement>('[data-tp-piv]')!;
  const formulaOutput = root.querySelector<HTMLElement>('[data-tp-formula]')!;

  function getField(name: string): HTMLInputElement | HTMLSelectElement {
    return form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement;
  }

  function update() {
    try {
      const lineVoltageRms = parseFloat((getField('lineVoltageRms') as HTMLInputElement).value);
      const frequency = parseFloat((getField('frequency') as HTMLInputElement).value);
      const diodeDrop = parseFloat((getField('diodeDrop') as HTMLInputElement).value);
      const topology = (getField('topology') as HTMLSelectElement).value as ThreePhaseTopology;

      if (isNaN(lineVoltageRms) || lineVoltageRms <= 0) throw new Error('Enter a valid line-to-line AC RMS voltage.');
      if (isNaN(frequency) || frequency <= 0) throw new Error('Enter a valid AC frequency (e.g. 50 or 60 Hz).');

      const result = calculateThreePhaseRectifier({
        lineVoltageRms,
        frequency,
        diodeDrop: isNaN(diodeDrop) || diodeDrop < 0 ? 0.7 : diodeDrop,
        topology
      });

      errorEl.hidden = true;
      errorEl.textContent = '';

      vDcOutput.textContent = `${formatNumber(result.vDcAvg)} V`;
      vPeakOutput.textContent = `${formatNumber(result.vPeak)} V`;
      vMinOutput.textContent = `${formatNumber(result.vMin)} V`;
      rippleVppOutput.textContent = `${formatNumber(result.rippleVpp)} V`;
      rippleFreqOutput.textContent = `${result.rippleFrequency} Hz`;
      rippleFactorOutput.textContent = `${formatNumber(result.rippleFactorPercent)} %`;
      diodePivOutput.textContent = `${formatNumber(result.diodePiv)} V`;
      formulaOutput.textContent = result.formula;
    } catch (err: unknown) {
      errorEl.hidden = false;
      errorEl.textContent = err instanceof Error ? err.message : 'Invalid calculation inputs.';
      vDcOutput.textContent = '—';
      vPeakOutput.textContent = '—';
      vMinOutput.textContent = '—';
      rippleVppOutput.textContent = '—';
      rippleFreqOutput.textContent = '—';
      rippleFactorOutput.textContent = '—';
      diodePivOutput.textContent = '—';
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
