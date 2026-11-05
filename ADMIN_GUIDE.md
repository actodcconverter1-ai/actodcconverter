# Editorial dashboard

## Local operation

Use the documented supported Node runtime, then `npm ci`, `npm run build`, and `npm run admin`. Open `http://127.0.0.1:4322/admin/`. No GitHub or Cloudflare credentials are needed for local editing. The server binds only to 127.0.0.1, checks its Host header, rejects cross-origin writes, and requires a custom request header. Do not expose this local server through a public tunnel or change its binding to a network interface.

Use Posts → Add new post. The main editor is Markdown with formatting controls and a sanitized live preview. Supply a lowercase URL slug, article text, byline, date, categories, tags, and summary. Drafts may be incomplete. Publication requires descriptive metadata and an existing repository featured image with alt text. The initial 20-article corpus is audited for 1,500–1,800 words per article. Per-post search preview and length guidance are editorial checks, not ranking guarantees.

Save draft persists a Markdown file with status draft. Publish writes published status; update retains it. Trash changes status to trash without deleting source; restore returns a post to draft. Only published posts enter static pages, related articles, categories, and sitemap. The Rebuild website button runs the fixed Astro build command against saved source and reports success/failure. Unsaved editor text remains unsaved until a save button is used.

Media library accepts PNG/JPEG/WebP/AVIF up to 5 MB per file. SVG is viewable for the supplied trusted diagrams/icons but cannot be uploaded through the editor. Use unique descriptive filenames; existing files are not silently overwritten. “Use featured” sets the post feature path; “Insert” adds Markdown image syntax. Update generated alt text to describe the specific image. Media deletion is refused while a post or settings record references that path. Unused media moves to `.content-trash/media` outside public assets; restore places it in `public/images/uploads`. Public site images update with a build; the dashboard reads repository media immediately.

SEO settings control default title suffix, social image/alt, social handle, robots directive, and the public indexing switch. Advanced settings control site name, wordmark, HTTPS canonical origin, brand colors, logo/favicon, description, and contact channel. These save `src/config/editorial.json`; no secrets belong there.

Ads manager supports header, sidebar, article-top, article-bottom, and footer slots. Set campaign ID/name, headline/copy, optional repository image and alt, HTTPS destination, enabled state, and optional UTC date range. Preview, save, enable/disable, or remove campaigns. Slots render sponsored image/text links with `rel=sponsored`. Date windows are evaluated when the site builds; a future date alone does not schedule a rebuild. No ad-network scripts, auctions, or tracking statistics are implied. There are no fake inventory metrics.

## Production login without Zero Trust

The review Worker is https://ac-to-dc-converter.actodcconverter1.workers.dev. No Zero Trust subscription or card is required by this application. No credentials belong in `.env`, source, browser storage, or chat.

1. Open `/admin/password-setup/` over HTTPS. Choose a unique password of at least 20 characters and retain it privately. The browser generates a salted PBKDF2-SHA256 verifier locally; the setup page does not upload or save the original password.
2. In Cloudflare → Worker → Settings → Variables and Secrets, add an encrypted Secret `ADMIN_PASSWORD_HASH` containing only that generated verifier. The original password must never be configured there. `ADMIN_EMAILS` and the random `ADMIN_SESSION_SECRET` have already been provisioned as encrypted secrets.
3. Add an encrypted Worker Secret `GITHUB_TOKEN`: a fine-grained token restricted to `actodcconverter1-ai/actodcconverter` with Contents read/write permission. Never put it into project files, frontend settings or chat. Last inspection found this secret absent.
4. Sign in at `/admin/login/` using the privately configured editor email and original password. Login sends the password over HTTPS for verification, without storing it. Sessions use signed eight-hour HttpOnly/Secure/SameSite=Strict cookies. Five attempts per minute per IP are enforced by the Cloudflare rate-limit binding; this is a per-location approximate limit. Rotating the verifier or signing key invalidates existing sessions. Sign out clears the cookie.
5. Workers Builds is connected and automatic deployment was verified for commit `483cf8a`. Its configuration is the repository, branch `main`, root `/`, supported Node 24.16.0, build `npm run verify`, deploy `npx wrangler deploy`. Public GitHub repository coordinates are already configured. A saved post commits source; successful automatic deployment makes it public. `/build-info.json` exposes only the built commit and timestamp for deployment verification.
6. Test a private login, draft save/reload, publication and the resulting commit-to-live deployment. These live positive tests remain pending until the owner configures the verifier and GitHub write secret. Local automated tests do not establish live credentials or automatic-deployment success.
7. The owner will add the domain later. Configure a public contact channel and review legal content before enabling indexing; review deployments intentionally remain noindex.

The setup page cannot register an editor or change the active verifier: only the Cloudflare account owner can configure that secret. Password reset uses the same local generator and secret replacement. GitHub stores editorial source and commit history; calculator inputs stay in the visitor's browser.

## Operational limits and recovery

Two editors saving the same file receive a conflict rather than silent last-writer loss. Reload and merge intentionally. Local writes are serialized; rollback restores file contents on an operation failure. Production multi-file slug changes and media trash/restore are one Git tree commit, and a concurrent branch change is rejected. Git history also provides a recovery path after committed edits.

GitHub rate limits, repository permissions, token expiry, and build queues can delay changes. The dashboard reports errors and distinguishes saved source from public publication. Public site behavior does not require GitHub API calls on every visit. Admin content is not stored in localStorage. Large repositories whose Git tree is truncated are rejected explicitly. Long-running local builds are serialized by the build endpoint; it cannot execute user-selected shell commands.

Current exclusions: no WordPress runtime/plugins, Gutenberg block compatibility, user/role provisioning UI, email delivery service, network ad-account management, automatic schedule-time rebuilds, or collaborative live editing. These are not represented by dummy controls.
