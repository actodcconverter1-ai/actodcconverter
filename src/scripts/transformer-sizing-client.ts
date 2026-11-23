import {
  calculateTransformerSizing,
  type TransformerTopology
} from '../calculators/transformer-sizing';
import { formatResult as formatNumber } from '../lib/result-presentation';

document.querySelectorAll<HTMLElement>('[data-transformer-calc]').forEach(root => {
  const form = root.querySelector<HTMLFormElement>('form')!;
  const errorEl = root.querySelector<HTMLElement>('[data-ts-error]')!;
  const vSecOutput = root.querySelector<HTMLElement>('[data-ts-vsec]')!;
  const iSecOutput = root.querySelector<HTMLElement>('[data-ts-isec]')!;
  const nominalVaOutput = root.querySelector<HTMLElement>('[data-ts-nominal-va]')!;
  const recVaOutput = root.querySelector<HTMLElement>('[data-ts-rec-va]')!;
  const formulaOutput = root.querySelector<HTMLElement>('[data-ts-formula]')!;

  function getField(name: string): HTMLInputElement | HTMLSelectElement {
    return form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement;
  }

  function update() {
    try {
      const targetDcVoltage = parseFloat((getField('targetDcVoltage') as HTMLInputElement).value);
      const dcLoadCurrent = parseFloat((getField('dcLoadCurrent') as HTMLInputElement).value);
      const diodeDrop = parseFloat((getField('diodeDrop') as HTMLInputElement).value);
      const rippleVoltage = parseFloat((getField('rippleVoltage') as HTMLInputElement).value);
      const topology = (getField('topology') as HTMLSelectElement).value as TransformerTopology;

      if (isNaN(targetDcVoltage) || targetDcVoltage <= 0) throw new Error('Enter a target DC voltage greater than 0.');
      if (isNaN(dcLoadCurrent) || dcLoadCurrent <= 0) throw new Error('Enter a continuous DC current greater than 0.');

      const result = calculateTransformerSizing({
        targetDcVoltage,
        dcLoadCurrent,
        diodeDrop: isNaN(diodeDrop) || diodeDrop < 0 ? 0.7 : diodeDrop,
        rippleVoltage: isNaN(rippleVoltage) || rippleVoltage < 0 ? undefined : rippleVoltage,
        topology
      });

      errorEl.hidden = true;
      errorEl.textContent = '';

      vSecOutput.textContent = `${formatNumber(result.vSecRms)} V`;
      iSecOutput.textContent = `${formatNumber(result.iSecRms)} A`;
      nominalVaOutput.textContent = `${formatNumber(result.nominalVa)} VA`;
      recVaOutput.textContent = `${formatNumber(result.recommendedVa)} VA`;
      formulaOutput.textContent = result.formula;
    } catch (err: unknown) {
      errorEl.hidden = false;
      errorEl.textContent = err instanceof Error ? err.message : 'Invalid calculation inputs.';
      vSecOutput.textContent = '—';
      iSecOutput.textContent = '—';
      nominalVaOutput.textContent = '—';
      recVaOutput.textContent = '—';
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
