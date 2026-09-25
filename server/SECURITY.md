# Security Checklist — Phase 11

Sign-off record for the security/performance hardening pass before go-live. Each item was actually verified (curl/Playwright/direct DB testing), not just implemented and assumed correct — see `phases.md`'s Phase 11 entry for the verification detail.

## Application security

- [x] **SQL injection** — all queries use `mysql2` named placeholders (`:param`); grep-audited every `services/*.js` and `routes/**/*.js`. The two places with conditionally-built SQL (`slugExists()`, `getDivision()`'s dynamic WHERE) only vary fixed SQL *structure* by code logic, never interpolate user input directly.
- [x] **Auth bypass** — all 10 admin route mounts in `routes/index.js` have `requireAuth` applied at `router.use()` level; no gaps.
- [x] **File upload — extension confusion (found & fixed)** — `imageUpload.js`/`documentUpload.js` previously saved files using the client-supplied `originalname`'s extension while only validating `mimetype` (client-claimed, not content-verified). A file named `shell.php` with a spoofed `Content-Type: image/jpeg` would pass validation and be saved as `<random>.php`. Fixed: saved extension is now looked up from a fixed `MIME_TO_EXT` map, never derived from client input. Verified live: uploading a `.php`-named file with a spoofed image mimetype now saves as `.jpg`; a genuinely non-image file with an honest mimetype is rejected outright.
- [x] **File upload — execution defense-in-depth** — `server/uploads/.htaccess` disables script execution (PHP, CGI, etc.) for that directory, in case Apache ever serves it directly ahead of the Node proxy. Uploads are served by Express (`express.static`) in normal operation.
- [x] **XSS — server-rendered JSON-LD (found & fixed)** — `htmlTemplate.js` built `<script type="application/ld+json">` blocks via `JSON.stringify()`, which does not escape `<`. An admin-editable field that flows into breadcrumb JSON-LD (division name, news title) containing `</script><script>...` would close the tag early and inject live script into every visitor's page. Fixed by escaping `<` to `<` in the JSON-LD payload (valid JSON, safe HTML). Verified live: a division name of `XSSTEST</script><script>alert(1)</script>` now renders as `XSSTEST</script><script>alert(1)</script>` in the served HTML.
- [x] **XSS — meta tags** — `title`/`description`/`canonical`/`og:image` tokens already ran through `escapeHtml()` (HTML-entity escaping) since Phase 9; unaffected by the JSON-LD issue above, confirmed still correct.
- [x] **XSS — client-rendered content** — React auto-escapes all text content/attributes by default; no `dangerouslySetInnerHTML` usage in the frontend for CMS-sourced content.
- [x] **CSRF** — double-submit-cookie pattern on all mutating `/api/*` requests (non-httpOnly `csrf_token` cookie + required `X-CSRF-Token` header), in place since Phase 3.
- [x] **Session/cookie config** — `httpOnly`, `secure` (production), `sameSite: lax` on the session cookie; session store in MySQL via `express-mysql-session`.
- [x] **Rate limiting** — `loginLimiter` (10/15min) and `formSubmitLimiter` (8/15min, public contact/career forms) since Phase 3/8; general `apiLimiter` (300/min across all `/api/*`) added this phase as a defense-in-depth backstop against scraping/brute-force that ignores the narrower limiters.
- [x] **HTTPS enforcement** — production-only redirect middleware (`req.secure` via `trust proxy`, since cPanel terminates TLS at Apache/LiteSpeed in front of the Node app). Not active in local/dev (plain HTTP). HSTS header already present via Helmet's default config.
- [x] **CSP** — Helmet's Content-Security-Policy, customized (Phase 9) to allow the external images/CDN/Google-Maps-iframe the site actually needs, verified against real browser console output (not just "no errors in the terminal").

## Performance / operational hardening

- [x] **Image optimization** — uploaded images (all 6 upload endpoints: divisions cover+gallery, news cover, photo gallery, suppliers, video gallery thumbnail, homepage/site-settings) are resized to a max 1920px width and re-compressed (JPEG quality 82) via `jimp` (pure-JS, no native bindings — matches the `bcryptjs`-over-`bcrypt` precedent for cPanel shared-hosting portability). Verified live: a 3000×2000 164KB test upload was saved as 1920×1280, ~68KB. Best-effort — a corrupt/unsupported file is left untouched rather than failing the admin's save; animated GIFs are skipped (Jimp doesn't reliably round-trip them).
- [x] **Cache headers** — `/uploads/*` (randomized, immutable filenames) get a 1-year immutable cache; `dist/assets/*` (Vite content-hashed filenames) get a 1-year immutable cache; everything else in `dist/` gets a 1-hour cache; the SPA-fallback HTML (per-route SEO meta, must always be fresh) gets `Cache-Control: no-store`. Verified via `curl -I`.
- [x] **Client-side GET cache** — 30s in-memory de-dupe/cache for `/api/*` GET requests (excluding `/api/admin/*`), added Phase 10.
- [x] **Process resilience under Passenger** — not additional application code: cPanel's "Setup Node.js App" runs the app under Phusion Passenger, which automatically respawns the process on crash. This is Passenger's own guarantee for apps registered through that interface, not something this app needs to implement itself.
- [x] **Automated MySQL backups** — `scripts/backupDatabase.js` (`mysqldump` piped through gzip, timestamped filename, retention pruning — default keep 14) and `scripts/restoreDatabase.js`, intended to run via a daily cPanel cron job (`node scripts/backupDatabase.js`). Both are plain Node + the standard `mysqldump`/`mysql` CLIs already present on any cPanel MySQL box, no extra native dependencies.
  - **Restore verified**: a live backup of the dev database was restored into a throwaway database and row counts confirmed to match the source (6 divisions). Backup artifacts are git-ignored (`server/backups/`) — dumps are runtime data, never committed.

## Known, deliberately out of scope for this phase

- Server-side query result caching (Redis/etc.) — not needed at current scale; the client-side GET cache (Phase 10) and MySQL's own query cache/indexes are sufficient. Revisit if traffic grows.
- Full WAF/IDS — outside what a single Node app on shared cPanel hosting can reasonably provide; Helmet + rate limiting + input validation cover the realistic threat model for this site.
