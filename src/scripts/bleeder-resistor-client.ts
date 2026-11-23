import {
  calculateBleederResistor
} from '../calculators/bleeder-resistor';
import { formatResult as formatNumber } from '../lib/result-presentation';

document.querySelectorAll<HTMLElement>('[data-bleeder-calc]').forEach(root => {
  const form = root.querySelector<HTMLFormElement>('form')!;
  const errorEl = root.querySelector<HTMLElement>('[data-br-error]')!;
  const rCalcOutput = root.querySelector<HTMLElement>('[data-br-rcalc]')!;
  const rStdOutput = root.querySelector<HTMLElement>('[data-br-rstd]')!;
  const powerOutput = root.querySelector<HTMLElement>('[data-br-power]')!;
  const ratingOutput = root.querySelector<HTMLElement>('[data-br-rating]')!;
  const currentOutput = root.querySelector<HTMLElement>('[data-br-current]')!;
  const tauOutput = root.querySelector<HTMLElement>('[data-br-tau]')!;
  const formulaOutput = root.querySelector<HTMLElement>('[data-br-formula]')!;

  function getField(name: string): HTMLInputElement {
    return form.elements.namedItem(name) as HTMLInputElement;
  }

  function update() {
    try {
      const initialVoltage = parseFloat(getField('initialVoltage').value);
      const capacitanceUf = parseFloat(getField('capacitanceUf').value);
      const targetDischargeTimeSeconds = parseFloat(getField('targetDischargeTimeSeconds').value);
      const safeVoltage = parseFloat(getField('safeVoltage').value);

      if (isNaN(initialVoltage) || initialVoltage <= 0) throw new Error('Enter a valid operating DC voltage.');
      if (isNaN(capacitanceUf) || capacitanceUf <= 0) throw new Error('Enter a valid capacitance in µF.');
      if (isNaN(targetDischargeTimeSeconds) || targetDischargeTimeSeconds <= 0) throw new Error('Enter a positive discharge time in seconds.');

      const result = calculateBleederResistor({
        initialVoltage,
        capacitanceUf,
        targetDischargeTimeSeconds,
        safeVoltage: isNaN(safeVoltage) || safeVoltage <= 0 ? 50 : safeVoltage
      });

      errorEl.hidden = true;
      errorEl.textContent = '';

      rCalcOutput.textContent = `${formatNumber(result.resistanceOhms)} Ω`;
      rStdOutput.textContent = `${formatNumber(result.standardResistanceOhms)} Ω`;
      powerOutput.textContent = `${formatNumber(result.powerDissipationWatts)} W`;
      ratingOutput.textContent = `${formatNumber(result.recommendedPowerRatingWatts)} W`;
      currentOutput.textContent = `${formatNumber(result.bleedCurrentMa)} mA`;
      tauOutput.textContent = `${formatNumber(result.timeConstantSeconds)} s`;
      formulaOutput.textContent = result.formula;
    } catch (err: unknown) {
      errorEl.hidden = false;
      errorEl.textContent = err instanceof Error ? err.message : 'Invalid calculation inputs.';
      rCalcOutput.textContent = '—';
      rStdOutput.textContent = '—';
      powerOutput.textContent = '—';
      ratingOutput.textContent = '—';
      currentOutput.textContent = '—';
      tauOutput.textContent = '—';
      formulaOutput.textContent = 'Correct the inputs above to update the calculation.';
    }
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    update();
  });

  form.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', update);
    input.addEventListener('change', update);
  });
});
