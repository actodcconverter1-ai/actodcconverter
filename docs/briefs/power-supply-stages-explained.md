# Editorial brief: AC-to-DC power-supply stages

Status: manuscript drafted for root review; no claimed professional or laboratory review. Checked 5 November 2026 against the primary references below.

- Primary query: AC to DC power supply stages.
- Secondary queries: AC to DC conversion process; rectification filtering regulation; transformer versus switching power supply stages.
- Long-tail intent: why a bridge rectifier does not produce regulated DC; where isolation occurs in an offline switching supply.
- Target URL: `/blog/power-supply-stages-explained/`.
- Search intent: explain the signal and energy path through representative complete supplies. The homepage gives a broad introduction; this article resolves component-order and isolation misunderstandings in depth.
- Reader level: beginner moving toward intermediate circuit concepts; assumes only voltage, current, and a sine-wave idea.
- Core entities: AC RMS, transformer, rectifier bridge, diode forward voltage, reservoir capacitor, ripple, linear regulator, switching regulator, dropout, isolation barrier, flyback, load.
- Relationships: rectification establishes polarity; capacitance stores energy; regulation requires operating conditions; isolation position differs between conventional and isolated offline switching architectures.
- Questions: Does a bridge isolate? Is smoothed DC regulated? Why is 12 V AC not automatically 12 V DC? Does every supply have the same stages?
- H2 structure: read the signal path; input conditions; conventional transformer path; isolated switching path; rectification; smoothing; regulation; worked example; questions.
- H3 structure: three final questions about isolation, capacitor smoothing, and final-output specifications.
- Internal links: calculator, full-wave bridge operation, RMS/peak/average conventions, half/full-wave comparison, capacitor ESR, calculator limitations.
- Featured asset: `/images/blogs/power-supply-stages-explained.webp`; two-path overview with different isolation-transformer locations.
- Supporting visuals: `/images/education/conversion-stages.svg`; `/images/education/regulated-supply.svg`. Captions must identify representative topology and input-valley headroom. Images are explanatory blocks, not construction-ready mains schematics.
- Worked example: 12 V RMS, 50 Hz bridge, 0.7 V/diode, 0.1 A and 1,000 µF; top about 15.57 V, ripple 1 Vpp, average 15.07 V, valley 14.57 V. Hypothetical 12 V linear stage has 2.57 V modeled valley headroom and approximately 0.307 W pass-element loss excluding quiescent loss.
- E-E-A-T safeguards: no invented author qualifications, bench measurements, safety certification, or guaranteed regulation; identify idealizations, include primary references, distinguish electrical calculations from component selection and safety verification.
- Technical review points: isolated flyback transformer follows primary rectification; switching frequency is separate from line frequency; autotransformer not assumed isolating; fixed diode drop and small-ripple model are bounded approximations.
- Manuscript counts: 1,309 lexical words; 1,309 whitespace words, excluding YAML frontmatter.

## Primary reference map

1. [ROHM conventional transformer system](https://techweb.rohm.com/product/power-ic/acdc/6/): representative stage order.
2. [ROHM isolated flyback basics](https://techweb.rohm.com/product/power-ic/acdc/846/): primary rectification, switching, isolation and secondary rectification.
3. [Hammond rectifier guide](https://www.hammfg.com/electronics/transformers/rectifier): configuration/filter distinctions.
4. [TI TIDUB95](https://www.ti.com/lit/ug/tidub95/tidub95.pdf), section 3.1: capacitor charge and doubled line-frequency charging pattern.
5. [TI SLVA118](https://www.ti.com/lit/an/slva118/slva118.pdf): LDO headroom, current and thermal operating considerations.

Publication gate: verify generated images and their mobile readability; check cited URLs, internal links, formula regression results and metadata in rendered HTML. Root decides publication after this review.
