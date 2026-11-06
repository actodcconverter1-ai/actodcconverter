# Editorial brief: choosing an AC-to-DC supply

Status: manuscript drafted for root review. Research checked 5 November 2026; no product endorsement or fabricated hands-on testing.

- Primary query: how to choose an AC to DC power supply.
- Secondary queries: power supply voltage and current rating; DC power budget; power supply derating; matching an adapter.
- Long-tail queries: can a higher-current adapter replace an original; does extra wattage handle motor startup; why connector shape is insufficient.
- Target URL: `/blog/choosing-ac-to-dc-power-supply/`.
- Search intent: build an equipment-requirements checklist before selecting a supply. Excludes live product recommendations and mains wiring instructions.
- Reader level: beginner/intermediate users who can consult equipment specifications; no assumption that a reader can safely design an offline supply.
- Entities: constant voltage, constant current, load profile, continuous current, peak current, output tolerance, polarity, connector, real power, derating, ambient temperature, ventilation, input range, isolation, overcurrent and overtemperature protection.
- Relationships: load determines operating demand; supply current rating is capability; thermal derating modifies available output; transient capability is distinct from continuous rating; matching voltage does not establish charging/USB/LED control compatibility.
- Questions: What voltage must match? Does a larger current rating force current? What margin is appropriate? How do nominal 5/9/12/24/48 V systems differ? Can AC voltage establish available DC current?
- H2 structure: expected output type; voltage/tolerance/polarity; continuous versus temporary demand; power example; derating; input/installation category; protection behavior; ripple and noise; final questions.
- H3 structure: higher-current replacement; margin percentage; available DC current.
- Internal links: unregulated versus regulated supplies; complete conversion stages; output measurements; smoothing-capacitor calculation; calculator; AC voltage versus DC current.
- Featured visual: `/images/blogs/choosing-ac-to-dc-power-supply.webp`; selection decision diagram joining load/interface/environment checks. A topology schematic is less useful here than an explicit requirements matrix.
- Table: nominal voltage levels 5/9/12/24/48 V with a different compatibility question for each. No claim that a nominal level defines safety or interface compatibility.
- Worked example: hypothetical 12 V, 2 A load = 24 W continuous, 3 A startup = 36 W during the stated interval. Hypothetical 36 W supply derated to 80% permits 28.8 W or 2.4 A continuous; startup is still unproven.
- E-E-A-T controls: 80% is explicitly an assumed example, not universal manufacturer guidance; no magic safety margin; no live recommendations or unverifiable certification claims; system protection and installation remain separate assessments.
- Technical checks: wattage must not replace current limits; USB negotiation not inferred from voltage; high-current rating does not excuse wrong polarity/voltage; input selector behavior must come from actual instructions.
- Manuscript counts: 1,343 lexical words; 1,377 whitespace words, excluding YAML frontmatter.

## Primary reference map

1. [MEAN WELL installation manuals](https://www.meanwell.com/productManual.aspx): product-family-specific installation and derating context.
2. [MEAN WELL technical FAQ](https://www.meanwell.com/qa.aspx): model-dependent mounting/input/output/protection questions.
3. [MEAN WELL configurable-supply selection method](https://configurable.meanwell.com/aboutstory.aspx): separate output, input/phase and system-feature selection decisions.

Publication gate: check the correct featured visual, citations, final public metadata, linked guides and readability. Editorial choice deliberately avoids an unsupported universal headroom percentage or a shopping list that would require continuing price/availability research.
