import { calculateRectifier, defaults } from '../calculators/rectifier';
export const calculator = {
  id: 'ac-dc-rectifier', type: 'single-phase-sine-rectifier', name: 'AC to DC converter',
  defaults, calculate: calculateRectifier,
  modes: [
    { id: 'bridge-filtered', label: 'Bridge + smoothing capacitor', description: 'Approximate loaded DC; fixed diode drop, constant current, small ripple.' },
    { id: 'full-wave', label: 'Ideal full-wave · no filter', description: 'Ideal rectified sine average, zero diode loss, resistive load.' },
    { id: 'half-wave', label: 'Ideal half-wave · no filter', description: 'Complete-cycle average, zero diode loss, resistive load.' },
  ],
  formulas: [
    ['Sine peak', 'Vpk = √2 × Vrms'], ['Filtered bridge peak', 'Vtop ≈ Vpk − 2 × Vf'],
    ['Filtered bridge ripple', 'ΔVpp ≈ I ÷ (2 × f × C)'], ['Filtered bridge average', 'Vdc ≈ Vtop − ΔVpp ÷ 2'],
    ['Ideal full-wave average', 'Vdc = 2 × Vpk ÷ π'], ['Ideal half-wave average', 'Vdc = Vpk ÷ π'],
  ],
  assumptions: [
    'Input is single-phase sinusoidal AC RMS at the rectifier input. Frequency is the AC input frequency in Hz.',
    'Filtered mode assumes a constant-current load, instant recharge at each crest, fixed forward drop per diode, and approximately linear discharge. Entered µF is converted to farads.',
    'Filtered estimates are rejected when ripple exceeds 20% of the available peak. This is a tool guardrail, not a claimed accuracy bound.',
    'Unfiltered modes use ideal zero-drop diodes and a resistive load. They report a pulsating waveform average, not smooth DC.',
    'Transformer regulation, winding resistance, diode dynamics, capacitor ESR/tolerance, inrush, and regulator dropout are excluded. Zero load is a limiting case; leakage is omitted.',
    'This estimates unregulated rectifier voltage. It does not predict regulated adapters, switch-mode converters, three-phase rectifiers, or available output current.',
  ],
  references: [
    { title: 'Hammond Manufacturing — rectifier design guide', url: 'https://www.hammfg.com/electronics/transformers/rectifier' },
    { title: 'Texas Instruments TIDUB95 — section 3.1, capacitor charge and ripple', url: 'https://www.ti.com/lit/ug/tidub95/tidub95.pdf' },
  ],
} as const;
