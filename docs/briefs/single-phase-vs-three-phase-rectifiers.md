# Content brief: single-phase vs three-phase rectifiers

- Primary keyword: single-phase vs three-phase rectifiers.
- Secondary keywords: six-pulse bridge, three-phase rectifier output voltage, line-to-line RMS, rectifier ripple frequency.
- Long-tail intent: why three-phase ripple is 300 Hz at 50 Hz; when 1.35 times line voltage applies; whether the single-phase calculator supports industrial bridges.
- Audience: readers comfortable with RMS voltage who need to compare topology and model assumptions.
- Distinct purpose: compare input systems and pulse sequences; do not duplicate the site's single-phase diode-loss or capacitor-sizing articles.
- Entities/relationships: three phase voltages 120° apart → highest/lowest phase selection → six line-to-line segments per cycle → 6f ripple; filtering and source impedance determine actual loaded output.
- Questions: phase-neutral vs line-line voltage? Does six-pulse mean six phases? Is a neutral required? Is 1.35 a filtered capacitor voltage? Are SCR and diode bridges interchangeable?
- Structure: input definition; topology comparison; conduction; timing; voltage derivation and example; capacitor case; losses/harmonics; controlled rectifiers; applications; calculator boundary; FAQs; conclusion.
- Internal links: /blog/rms-peak-average-voltage/, /blog/half-wave-vs-full-wave-rectifier/, /blog/rectifier-ripple-frequency/, /blog/smoothing-capacitor-calculation/, /blog/bridge-rectifier-diode-losses/, /blog/limits-of-simple-ac-to-dc-calculators/, /ac-to-dc-calculator/.
- Visuals: featured topology/pulse comparison; supporting /images/education/rectifier-types.svg. Caption explicitly distinguishes topology/pulse count from regulated output. No wiring instructions.
- Trust: cite MathWorks official model documentation for conventions, Virginia Tech thesis for commutation, ABB manufacturer guide for drive harmonics, and Hammond for filter-dependent single-phase behavior. Derive arithmetic independently. No lab claims or invented engineer credentials.
- Review: verify 3√2/π = 1.35047; 24 V line-line gives 32.4114 V mean in the specified ideal continuous-conduction model, versus a 33.9411 V line-line crest. Label 400 V example conceptual, not construction advice. Do not import the model into the single-phase calculator.
- Primary references: https://www.mathworks.com/help/simscape-electrical/ref/averagevaluerectifierthreephase.html ; https://vtechworks.lib.vt.edu/bitstream/handle/10919/30188/complete_final.pdf ; https://library.e.abb.com/public/bc35ffb4386c4c039e3a8ec20cef89c5/Technical_guide_No_6_3AFE64292714_RevF_EN.pdf ; https://www.hammfg.com/electronics/transformers/rectifier .
