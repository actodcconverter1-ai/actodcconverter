import {
  calculateSmoothingCapacitor,
  type RectifierType
} from '../calculators/smoothing-capacitor';
import { formatResult as formatNumber } from '../lib/result-presentation';

document.querySelectorAll<HTMLElement>('[data-smoothing-calc]').forEach(root => {
  const form = root.querySelector<HTMLFormElement>('form')!;
  const errorEl = root.querySelector<HTMLElement>('[data-sc-error]')!;
  const capOutput = root.querySelector<HTMLElement>('[data-sc-capacitance]')!;
  const stdOutput = root.querySelector<HTMLElement>('[data-sc-standard]')!;
  const voltOutput = root.querySelector<HTMLElement>('[data-sc-voltage]')!;
  const freqOutput = root.querySelector<HTMLElement>('[data-sc-freq]')!;
  const formulaOutput = root.querySelector<HTMLElement>('[data-sc-formula]')!;

  function getField(name: string): HTMLInputElement | HTMLSelectElement {
    return form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement;
  }

  function update() {
    try {
      const current = parseFloat((getField('current') as HTMLInputElement).value);
      const rippleVoltage = parseFloat((getField('rippleVoltage') as HTMLInputElement).value);
      const frequency = parseFloat((getField('frequency') as HTMLInputElement).value);
      const rectifierType = (getField('rectifierType') as HTMLSelectElement).value as RectifierType;
      const rms = parseFloat((getField('rms') as HTMLInputElement).value);

      if (isNaN(current) || current <= 0) throw new Error('Enter a valid load current greater than 0.');
      if (isNaN(rippleVoltage) || rippleVoltage <= 0) throw new Error('Enter a valid ripple voltage greater than 0.');
      if (isNaN(frequency) || frequency <= 0) throw new Error('Enter a valid AC frequency (e.g. 50 or 60 Hz).');

      const result = calculateSmoothingCapacitor({
        current,
        rippleVoltage,
        frequency,
        rectifierType,
        rms: isNaN(rms) || rms <= 0 ? undefined : rms
      });

      errorEl.hidden = true;
      errorEl.textContent = '';

      capOutput.textContent = `${formatNumber(Math.round(result.capacitanceUf))} µF`;
      stdOutput.textContent = `${formatNumber(result.recommendedStandardUf)} µF`;
      voltOutput.textContent = result.recommendedVoltageRating ? `${result.recommendedVoltageRating} V` : '—';
      freqOutput.textContent = `${result.rippleFrequency} Hz`;
      formulaOutput.textContent = `${result.formula} → C = ${current} / (${result.rippleFrequency} × ${rippleVoltage}) = ${formatNumber(Math.round(result.capacitanceUf))} µF`;
    } catch (err: unknown) {
      errorEl.hidden = false;
      errorEl.textContent = err instanceof Error ? err.message : 'Invalid calculation inputs.';
      capOutput.textContent = '—';
      stdOutput.textContent = '—';
      voltOutput.textContent = '—';
      freqOutput.textContent = '—';
      formulaOutput.textContent = 'Correct the inputs above to update the calculation.';
    }
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    update();
  });

  form.addEventListener('input', () => {
    update();
  });

  form.addEventListener('reset', () => {
    setTimeout(update, 10);
  });
});
