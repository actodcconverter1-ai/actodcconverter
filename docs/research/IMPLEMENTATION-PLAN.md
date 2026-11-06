# Upgrade implementation plan — 5 November 2026

## Evidence and decisions before implementation

The existing Astro/TypeScript static site, GitHub-backed authenticated dashboard and Cloudflare automatic deployment stay in place. Existing source URLs and the 20 reviewed technical articles are retained. No master template is extracted. The owner has not attached the custom domain; the workers.dev review remains intentionally noindex until the owner completes launch configuration.

Search sample (not an asserted universal ranking): Easyo Calculator exposes rectifier/diode/smoothing controls but describes its smoothing result as a peak approximation; GetZenQuery combines calculator and circuit/topology education; ToolsRail adds related calculator navigation; Altium's original engineering overview distinguishes a complete supply from a transformer/bridge alone. Opportunity: explain model scope beside results, calculate topology-dependent loaded ripple, distinguish regulation from rectification, connect rigorous narrower guides to a readable broad homepage. No competitor speed scores, search volumes or rankings are invented.

Sources: https://easyocalculator.com/ac-to-dc-converter-calculator/ ; https://www.getzenquery.com/tools/ac-to-dc-converter/ ; https://www.toolsrail.com/electric-engineering/ac-to-dc-converter-calculator.php ; https://resources.altium.com/p/how-to-design-an-ac-to-dc-converter-circuit-in-altium-designer

## Homepage / keyword architecture

Homepage is the broad AC to DC converter educational hub with calculator, definition, process, rectifier types, circuit diagrams, components, applicable formulas, common output levels, applications, converter/inverter comparison, efficiency/ripple, limits, FAQs and contextual guides. The dedicated calculator URL targets interactive calculation and methodology. Existing 20 articles keep narrower intentions; five additions cover supply stages, selecting a supply, linear/switching comparison, single/three phase, and why supplies/chargers/LED drivers differ. Candidate keywords in the supplied prompt are the starting set; no separate search-volume dataset was attached.

Documents in docs/research and docs/briefs record keyword-to-URL mapping, entity relationships, Google guidance, source-backed editorial decisions and article briefs. There is no mechanical entity-density or word-count ranking claim. Existing 1,500–1,800-word articles need not be cut merely because the new approximate guidance is 1,200–1,500; new articles use the new guidance where depth supports it.

## Calculator contracts

A basic constant-drop single-phase model handles half-wave (one diode), center-tapped full-wave (one diode, RMS per half-secondary) and bridge (two diodes). Let Vm=sqrt(2) Vrms, D=nVf, theta=asin(D/Vm). If D>=Vm, output is zero. Full-wave average = [2 Vm cos(theta)-D(pi-2theta)]/pi; half-wave average is half that. This integrates the clipped sine rather than subtracting D from an ideal complete-cycle average. Zero-drop results must agree with existing ideal tools and independent numerical integration.

Filtered mode uses the correct diode path and recharge frequency f for half-wave, 2f for full-wave/bridge. Current load uses the existing linear discharge charge-balance approximation; resistance load uses exponential RC discharge between assumed instantaneous crest recharges. All supported configurations retain a small-ripple guardrail, disclosed as a model scope limit rather than an accuracy guarantee. RMS conventions and current/capacitance units stay explicit.

Regulator analysis separates a linear/LDO stage from a step-down switching stage with user-supplied efficiency. Linear Pin=Vin(Iout+Iq), Pout=Vout Iout, Ploss=(Vin-Vout)Iout+Vin Iq. Switching loss uses only supplied stage efficiency. Minimum input must cover requested output plus supplied headroom; no unknown current/thermal capability or full AC-DC efficiency is predicted. Zero-power efficiency is undefined. Thermal design, isolation and component ratings remain external engineering checks.

Primary references: Hammond rectifier guide https://www.hammfg.com/electronics/transformers/rectifier ; TI capacitor/ripple discussion TIDUB95 section3.1 https://www.ti.com/lit/ug/tidub95/tidub95.pdf ; TI regulator seminar https://www.ti.com/lit/ml/slup415/slup415.pdf . Existing ideal APIs and URLs remain compatible.

## Trust, diagrams and content

Use original SVG educational schematics/waveforms and optimized WebP editorial feature assets; diagrams are explanatory low-voltage models, never mains construction instructions. A truthful editorial profile states no verified professional credentials or laboratory measurements. Sources and model validation are explicit. Safety content distinguishes PV DC, AC-grid conversion, chemistry-specific charging and LED current regulation.

## Contact, privacy and operations

Implement a real private contact inbox, rather than pretending that a local report download sends a message. Use a dedicated Cloudflare D1 free-tier database binding, encrypted message bodies with a generated Worker secret, input/body bounds, same-origin requests, rate limits, a honeypot and a short-lived signed timing challenge. No private owner email or API key appears publicly or in project env files. Owner reads submissions in the authenticated dashboard. No email-delivery claim or external notification is made. Retain submissions for 30 days and archive through the private inbox. If account storage permission is unavailable, complete and test code locally and report the exact deployment blocker.

## SEO and verification

Google primary documentation governs title/snippet decisions, crawlability, sitemap and structured data. No FAQ rich-result promise; current Google updates deprecate FAQ rich results in 2026. Review noindex remains crawlable, and its sitemap excludes noindex URLs. Production sitemap is populated only after explicit indexing activation. Canonicals retain the owner's intended domain pending domain attachment; this is documented as a launch gate, not a verified domain deployment.

Validation: independent mathematical integration/boundary tests; contact encryption/CSRF/replay/input/privacy tests; full existing dashboard regression tests; 25-article quality audit; generated metadata/link/schema/image/heading/sitemap checks; desktop/mobile browser interaction and keyboard checks; measured lab performance when tooling is available, explicitly separate from unavailable field CWV; real GitHub-to-Cloudflare commit verification. Final report separates COMPLETED, PARTIAL, UNVERIFIED and OUTSTANDING.
