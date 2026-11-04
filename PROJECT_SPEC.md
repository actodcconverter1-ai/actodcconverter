# Project specification

## Required strategy and current scope

Strategic Phase 1: the first complete AC to DC calculator website. Phases 2 (extract reusable template), 3 (independent second demo), and 4 (future sites) are gated behind deployed production verification. Shared modules inside this first website are ordinary implementation structure; they are not evidence that a master template has been validated. No master or second demo has been created.

## Architecture

Astro static generation with TypeScript, Tailwind 4 Vite integration, semantic Astro components, Markdown content collections, and vanilla TypeScript interaction. No React or database. The user's later request for a fully functional editorial dashboard justifies a small Worker admin API, verified Cloudflare Access authentication, and GitHub repository writes. Local editing uses a loopback-only Node server writing the same files. Public pages stay static; no Astro SSR adapter is necessary. Package versions are resolved from npm stable tags and locked. Wrangler serves the custom 404 with a 404 response rather than an SPA success response.

Site settings: `src/config/site.config.ts`. SEO helpers: `src/config/seo.config.ts`. Model settings/references: `src/config/calculator.config.ts`. Mathematical implementation: `src/calculators/rectifier.ts`. UI: `src/components/Calculator.astro`; assumptions and explanation: `CalculatorContent.astro`; layouts: `Base.astro`. These are first-site modules; extraction and a generic calculator interface remain future work after the first-site gate.

## Rectifier math

Input is sinusoidal single-phase AC RMS. Write Vm = √2 Vrms. Ideal full-wave average = (1/(2π)) ∫₀²π |Vm sin θ|dθ = 2Vm/π. Ideal half-wave average = (1/(2π)) ∫₀π Vm sin θ dθ = Vm/π. These assume zero diode loss, no filter, and resistive load. The ideal waveforms have zero valleys and peak-to-peak ripple Vm. Ripple frequency is 2f full-wave and f half-wave.

Filtered bridge: assume constant load current, fixed forward drop Vf per diode, instant charging at each crest, and approximately linear discharge. Vtop ≈ max(0, √2 Vrms − 2Vf). Since ΔQ = IΔt = CΔV and Δt ≈ 1/(2f), ΔVpp ≈ I/(2fC). Vavg ≈ Vtop − ΔVpp/2; Vvalley ≈ Vtop − ΔVpp. The midpoint average is a derived approximation, not a direct claim that a manufacturer guarantees this output.

References: [Hammond rectifier design guide](https://www.hammfg.com/electronics/transformers/rectifier) (RMS input convention, rectifier/filter distinctions, ideal rounded average factors, losses); [TI TIDUB95 §3.1](https://www.ti.com/lit/ug/tidub95/tidub95.pdf) (charge balance and doubled full-bridge ripple frequency). The sine RMS relation and ideal averages are derived analytically and tested against independent numerical integration.

Guardrails: 0–1000 V RMS, 1–1000 Hz; filtered settings 0–2 V per diode, 0–100 A, 1–1000000 µF. Software bounds are not safety ratings. Filtered ripple above 20% of available peak is rejected as outside this tool's chosen small-ripple scope. This threshold does not claim a specific error bound. Zero input with positive load and insufficient bridge peak is rejected. Zero-load zero-input result is zero. Irrelevant filtered fields are disabled, hidden, and ignored for ideal modes. Non-finite, blank, malformed, underflowed, negative physical inputs, and unsupported modes are rejected. Display uses 8 significant digits; numerical representation does not imply physical precision.

Excluded effects: source impedance, transformer regulation, diode current/temperature curves, charge conduction angle, capacitor ESR/leakage/tolerance, inrush, component ratings, thermal limits, regulators, switch-mode converters, and three-phase models. The site cannot predict available output current or design equipment from RMS voltage alone.

## Pages and content

Homepage with working calculator, instructions, formulas, worked example, related tools, latest guides, FAQs, and footer. Twenty original educational articles with primary references and distinct diagram images; both body word counters confirm 1,500–1,800 words each. Dedicated main calculator, two meaningful ideal-model tools, blog listing/posts, nine category archives, About, Contact, Privacy, Terms, Disclaimer, 404, and a private editorial dashboard. Contact downloads a local issue report until an operator channel is configured; no submission is simulated. Policies remain prelaunch drafts pending operator identity/practices.

## SEO and security

Unique title/description, canonical, Open Graph, Twitter, WebSite/WebPage/Article/BreadcrumbList JSON-LD where applicable, internal links, generated sitemap and robots. No fabricated ratings, expertise, testimonials, or search ranking promises. The origin is actodcconverter.online; indexing stays disabled pending production review. Admin and API routes are excluded from sitemap/indexing.

All assets are repository-local. Static HTTP security headers include CSP, frame protection, nosniff, referrer policy, and restricted device permissions. Production admin needs a repository-scoped GitHub token secret and Access settings; none are shipped to the client. Calculator inputs use textContent/numeric output. Admin preview uses Marked and DOMPurify, server validation blocks script content, write origins are checked, and SHA conflicts prevent silent overwrites. Media upload types and sizes are checked; referenced images cannot be trashed; media trash remains outside public assets. Ads are image/text sponsored banners, not arbitrary script injection or tracking. Hashed `_astro` assets cache immutably; images cache one day; admin/API responses are not cached. Script inlining is disabled to honor the strict CSP. Focus styles, skip links, labels, fieldsets, live status, native FAQ controls, and responsive layouts support keyboard and small screens. Checks do not certify full accessibility or field performance.

## Editorial subsystem

`server/admin.ts` is the shared validated API contract; `server/github.ts` performs GitHub Git Data transactions with expected file hashes and non-forced reference updates. `worker/index.ts` verifies Access JWTs using JOSE and explicitly allows configured editor emails before any repository call. Public routes use the ASSETS binding; admin/API patterns always run the Worker first. `scripts/admin-server.mjs` is the loopback-only disk repository adapter with atomic file replacements, serialized writes, rollback on failure, and a fixed-command build endpoint. `src/pages/admin.astro`, `src/scripts/admin-client.ts`, and `src/styles/admin.css` implement the dashboard. The only persistent source is the repository; no browser-local storage substitutes for persistence.

Publishing is source-based: production commits trigger a separate automatic Cloudflare build/deploy; local changes require the working Rebuild website button. The editor is Markdown with a sanitized preview and formatting controls, not the WordPress/Gutenberg software itself. The ad manager controls banner placements and build-time dates; it does not provide an advertising-network account, auction, analytics, or arbitrary tracking-script execution.
