# AC to DC Converter — first website

This is the first real site implementation, **not a validated master template**. The user requires this sequence: complete and deploy this website → verify production → extract a template → prove the extracted template with an independent second demo. Do not skip those gates.

## Install and run

Use Node 24.16.0 or a newer supported LTS release. The installed host Node 24.14.0 is below the current Astro ESLint parser's supported 24.x range; use the documented version in CI.

```sh
npm ci
npm run dev
npm run verify
npm run preview
```

`verify` runs ESLint, Astro/TypeScript checks, calculator and admin/security tests, the initial 20-article content audit, the static production build, and a generated-output audit of links, anchors, images, headings, metadata, sitemap coverage, CSP-compatible scripts, and public client JS size. It does not replace browser or deployed-site checks. `npm run preview:worker` serves the actual Workers assets and secure API configuration locally. `npm run deploy:check` verifies the Wrangler deployment bundle without publishing.

## WordPress-style editorial dashboard

```sh
npm run build
npm run admin
```

Open [the local dashboard](http://127.0.0.1:4322/admin/). It is bound to loopback and saves **real repository files**, not browser-local mock data. Posts support Markdown editing, safe live preview, formatting tools, featured images, drafts, publication, slug changes, metadata, trash, and restore. The media library uploads repository images, searches files, inserts them into the editor, and trashes/restores unused images. SEO and advanced settings persist to `src/config/editorial.json`. The banner ads manager supports placements, enable/disable, copy, images, destinations, and build-time dates. The dashboard's Rebuild website button updates the local public site from saved source.

Production uses the same dashboard with a Cloudflare Worker API. The API verifies Cloudflare Access signatures, issuer, audience, and allowed editor emails. Edits commit to the dedicated GitHub repository; Workers Builds publishes those commits. Admin routes fail closed until credentials and Access configuration are supplied. Read [ADMIN_GUIDE.md](ADMIN_GUIDE.md) for exact setup, permissions, editing workflow, and operational limits.

## Calculator

Three explicit models: capacitor-filtered single-phase bridge estimate, ideal unfiltered full-wave average, ideal unfiltered half-wave average. Inputs and assumptions live in `src/config/calculator.config.ts`; math lives in `src/calculators/rectifier.ts`. Units are visible in every label. C is entered in µF and converted to farads; current is A, frequency is input Hz, voltage is V. See PROJECT_SPEC.md for derivation, references, model bounds, and limits.

## Content and images

The initial collection has 20 original articles, each 1,500–1,800 words by both lexical and whitespace counters, with primary references and an individual original diagram. Counts and source links are recorded in `assets/editorial-manifest.json`. Markdown lives in `src/content/blog/`. Frontmatter requires title, slug, description, image, imageAlt, author, pubDate, categories, tags, seoTitle, metaDescription, and status (draft/published/trash); updatedDate is optional. Category slugs are lowercase hyphenated strings. Blog templates provide images, TOC, dates, author explanation, categories, tags, breadcrumbs, and related articles. Drafts and trash do not generate public pages.

Images are repository-local in `public/images/{logo,calculators,blogs,icons}`. Keep meaningful illustrations, dimensions, alt text, and lazy loading below the fold. `node scripts/generate-images.mjs` regenerates the original diagram assets using Sharp. Social metadata uses a PNG for broad crawler compatibility; content illustrations are WebP and icons are small SVGs.

## Separate GitHub repository and Cloudflare account

The owner authorized https://github.com/actodcconverter1-ai/actodcconverter as this website's dedicated source repository and Cloudflare account 0863917d131e2a06192ec0ce3748952a for hosting. A review deployment is live at https://ac-to-dc-converter.actodcconverter1.workers.dev. The owner will attach actodcconverter.online later. Indexing remains disabled for this review deployment. The private dashboard email is a Worker secret, not a public contact address or source setting.

The public review deployment has been verified over HTTPS: all 70 checked public pages/assets match the tested local build; unknown routes return 404. Production admin remains closed (503) pending Cloudflare Access and GitHub write-secret configuration. Automatic Git deployment is not yet connected: the current Wrangler OAuth login cannot manage Workers Builds or Access configuration (403). Do not describe these remaining integrations as complete.

1. In the dedicated GitHub account, create an empty repository for this website. Set the local remote to its exact URL, commit the reviewed files, and push `main`.
2. In the authorized Cloudflare account, connect the existing Worker `ac-to-dc-converter` to that GitHub repository through Workers Builds. Select production branch `main`, root `/`, build command `npm run verify`, deploy command `npx wrangler deploy`, and Node 24.16.0. This deploy command supports the owner's noindex review deployment. `npm run deploy` additionally enforces the later public-release contact/indexing checklist.
3. Set the build Node version to 24.16.0 or another supported LTS using Cloudflare's `NODE_VERSION` build variable. Configure the admin runtime values and GitHub secret described in ADMIN_GUIDE.md. Without them the public site still serves, while production admin routes return 503/401.
4. The intended origin is `https://actodcconverter.online`. Set branding, operator contact, and indexing through the dashboard or `src/config/editorial.json`, consumed by `site.config.ts`. Configure the Worker name in `wrangler.jsonc`. Review policies for the real operator and its practices.
5. Run `npm run verify`, `npm run deploy:check`, and `node scripts/check-release.mjs`. The release check rejects example domains, disabled indexing, and absent operator contact.
6. Authenticate Wrangler interactively in the dedicated account (`npx wrangler login`) for manual deployment, then run `npm run deploy`. Never store credentials in source. Workers Builds manages its own deployment authentication.
7. Add the actual custom domain through Worker Settings → Domains & Routes → Add → Custom Domain in the intended Cloudflare account. DNS ownership/setup must already be valid for that domain. Do not guess account IDs or mutate an unrelated domain.
8. Test the deployed hostname, HTTPS, canonical and sitemap origins, robots, headers, 404 HTTP status, calculators, report download, mobile layouts, keyboard use, and browser console. Record evidence in HANDOFF.md before calling the first site production-ready.

Only the `main` production branch should deploy to the production Worker. The included GitHub verification workflow performs checks; Cloudflare Workers Builds supplies automatic deployments after GitHub pushes. Configure required checks/branch protection if desired. No API token is checked into this repository.

Official setup references: [Astro installation](https://docs.astro.build/en/install-and-setup/), [Tailwind with Astro](https://tailwindcss.com/docs/installation/framework-guides/astro), [Cloudflare static SSG routing](https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/), [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/).

## Later reuse — gated

After this site passes real production tests, extract only components and utilities proven here into a separate master repository. Document every extracted component and configuration. Then create a second demo from that extracted repository using a different calculator engine, brand, articles, images, canonical origin, sitemap, Worker name, GitHub repository, and Cloudflare account. Search generated output for inherited first-site identifiers and repeat the complete test/deploy cycle. Only after that proof may future sites start from fresh copies of the master. No generic mathematical engine should silently apply unrelated formulas.
