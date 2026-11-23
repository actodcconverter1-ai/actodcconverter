import {
  calculateRectifierRipple,
  type RectifierRippleTopology,
  type LoadType
} from '../calculators/rectifier-ripple';
import { formatResult as formatNumber } from '../lib/result-presentation';

document.querySelectorAll<HTMLElement>('[data-ripple-calc]').forEach(root => {
  const form = root.querySelector<HTMLFormElement>('form')!;
  const errorEl = root.querySelector<HTMLElement>('[data-rr-error]')!;
  const vPeakOutput = root.querySelector<HTMLElement>('[data-rr-vpeak]')!;
  const vDcAvgOutput = root.querySelector<HTMLElement>('[data-rr-vdc]')!;
  const vValleyOutput = root.querySelector<HTMLElement>('[data-rr-vvalley]')!;
  const rippleVppOutput = root.querySelector<HTMLElement>('[data-rr-vpp]')!;
  const rippleFactorOutput = root.querySelector<HTMLElement>('[data-rr-factor]')!;
  const rippleFreqOutput = root.querySelector<HTMLElement>('[data-rr-freq]')!;
  const formulaOutput = root.querySelector<HTMLElement>('[data-rr-formula]')!;

  function getField(name: string): HTMLInputElement | HTMLSelectElement {
    return form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement;
  }

  function update() {
    try {
      const rms = parseFloat((getField('rms') as HTMLInputElement).value);
      const frequency = parseFloat((getField('frequency') as HTMLInputElement).value);
      const diodeDrop = parseFloat((getField('diodeDrop') as HTMLInputElement).value);
      const capacitanceUf = parseFloat((getField('capacitanceUf') as HTMLInputElement).value);
      const loadType = (getField('loadType') as HTMLSelectElement).value as LoadType;
      const loadValue = parseFloat((getField('loadValue') as HTMLInputElement).value);
      const topology = (getField('topology') as HTMLSelectElement).value as RectifierRippleTopology;

      if (isNaN(rms) || rms <= 0) throw new Error('Enter a valid AC RMS input voltage greater than 0.');
      if (isNaN(frequency) || frequency <= 0) throw new Error('Enter a valid AC frequency (e.g. 50 or 60 Hz).');
      if (isNaN(capacitanceUf) || capacitanceUf <= 0) throw new Error('Enter a valid filter capacitance in µF.');
      if (isNaN(loadValue) || loadValue <= 0) throw new Error('Enter a valid load current or resistance greater than 0.');

      const result = calculateRectifierRipple({
        rms,
        frequency,
        diodeDrop: isNaN(diodeDrop) || diodeDrop < 0 ? 0.7 : diodeDrop,
        capacitanceUf,
        loadType,
        loadValue,
        topology
      });

      errorEl.hidden = true;
      errorEl.textContent = '';

      vPeakOutput.textContent = `${formatNumber(result.vPeak)} V`;
      vDcAvgOutput.textContent = `${formatNumber(result.vDcAvg)} V`;
      vValleyOutput.textContent = `${formatNumber(result.vValley)} V`;
      rippleVppOutput.textContent = `${formatNumber(result.rippleVpp)} V`;
      rippleFactorOutput.textContent = `${formatNumber(result.rippleFactorPercent)} %`;
      rippleFreqOutput.textContent = `${result.rippleFrequency} Hz`;
      formulaOutput.textContent = result.formula;
    } catch (err: unknown) {
      errorEl.hidden = false;
      errorEl.textContent = err instanceof Error ? err.message : 'Invalid calculation inputs.';
      vPeakOutput.textContent = '—';
      vDcAvgOutput.textContent = '—';
      vValleyOutput.textContent = '—';
      rippleVppOutput.textContent = '—';
      rippleFactorOutput.textContent = '—';
      rippleFreqOutput.textContent = '—';
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
