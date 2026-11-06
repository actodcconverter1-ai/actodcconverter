# Editorial brief: linear versus switching supplies

Status: manuscript drafted for root review; technical arithmetic examples are explicitly hypothetical and not laboratory measurements. Checked 5 November 2026.

- Primary query: linear vs switching AC to DC power supplies.
- Secondary queries: linear regulator heat; LDO efficiency; switching power supply noise; regulator versus complete supply efficiency.
- Long-tail queries: is buck duty cycle efficiency; how does quiescent current change LDO loss; why average input voltage is insufficient for dropout.
- Target URL: `/blog/linear-vs-switching-power-supplies/`.
- Search intent: compare architecture and tradeoffs at a consistent boundary. Existing unregulated/regulated article explains output control; this article distinguishes regulator mechanisms and loss accounting.
- Reader level: intermediate beginner comfortable with volts, amperes, watts and simple algebra.
- Entities: linear pass element, LDO, switching regulator, transformer, rectifier, dropout voltage, quiescent current, bias supply, junction temperature, thermal resistance, duty ratio, buck converter, real input power, apparent power, power factor, ripple, noise, PSRR.
- Relationships: extra voltage headroom increases linear pass loss; quiescent loss can dominate at light load; duty ratio controls switching timing, while efficiency compares powers; a downstream LDO may follow a switching preregulator.
- Questions: Which boundary is being compared? What happens at input valleys? Is switching always more efficient? Is linear output ripple-free? Which approach meets this load?
- H2 structure: regulator/system distinction; linear headroom; loss equations; worked example; thermal assessment; switching loss balance; same-boundary efficiency; noise/response comparison; questions.
- H3 structure: switching efficiency universality; linear ripple; choosing between approaches.
- Internal links: unregulated/regulated supplies, calculator, power-supply selection guide.
- Featured visual: `/images/blogs/linear-vs-switching-power-supplies.webp`; two architecture paths with their regulation and loss locations.
- Supporting diagrams: `/images/education/conversion-stages.svg` and `/images/education/regulated-supply.svg`; show isolation sequence and worst-case input headroom, respectively.
- Worked example: 12 V to 5 V, 0.2 A output, assumed 1 mA Iq: Pout=1 W, Pin=2.412 W, loss=1.412 W, efficiency≈41.46%. At 1 mA output with the same hypothetical Iq, efficiency≈20.83%. These exclude all prior AC stages.
- Formula assumptions: single-rail simple positive LDO uses Iin=Iout+Iq; separate bias rails require their own power terms; loss=(Vin−Vout)Iout+VinIq. Ideal buck continuous-conduction duty relation Vout≈D Vin is not an efficiency formula. Complete AC-to-DC efficiency requires real input watts.
- E-E-A-T: no universal efficiency/noise ranking; no invented component ratings; no claimed junction-temperature result without applicable thermal data; examples are arithmetic checks only; primary semiconductor references anchor device caveats.
- Manuscript counts: 1,289 lexical words; 1,334 whitespace words, excluding YAML frontmatter.

## Primary reference map

1. [ROHM transformer architecture](https://techweb.rohm.com/product/power-ic/acdc/6/) and [switching architecture](https://techweb.rohm.com/product/power-ic/acdc/12621/): compare complete signal paths.
2. [TI SLVA118](https://www.ti.com/lit/an/slva118/slva118.pdf): dropout, efficiency and thermal operating requirements.
3. [TI TPS7A11 datasheet](https://www.ti.com/lit/ds/symlink/tps7a11.pdf): efficiency accounting with an additional bias input.
4. [TI TPS735-Q1 datasheet](https://www.ti.com/lit/ds/symlink/tps735-q1.pdf): voltage-drop loss and thermal-layout context; no transfer of its product ratings to a hypothetical regulator.
5. [ROHM buck operating principles](https://techweb.rohm.com/product/power-ic/dcdc/696/): controlled switching and output regulation.
6. [TI low-IQ LDO training](https://www.ti.com/video/series/linear-ldo-low-iq-regulators.html): complementary switching and linear stages.

Publication gate: check formulas against independent arithmetic, verify captions and references, and inspect generated metadata. Do not present approximate regulator efficiency as measured complete-supply efficiency.
