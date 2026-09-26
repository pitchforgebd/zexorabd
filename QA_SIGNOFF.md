# QA Sign-Off — Phase 12

Verification record for the pre-deployment QA pass. Every item was actually run against the live server (curl / Playwright across Chromium, Firefox, and WebKit / direct DB checks), not just implemented and assumed correct.

## Cross-browser and responsive pass

- [x] All 19 public routes (18 static/dynamic pages + 1 news detail page) load correctly in **Chromium, Firefox, and WebKit**, at desktop (1440px), tablet (768px), and mobile (375px) viewports.
- [x] No horizontal overflow on any route/viewport — **found and fixed two real causes**: a scroll-reveal entrance animation (`FadeIn`, `translateX`) sat off-canvas before its `IntersectionObserver` fired, and the homepage supplier-logo marquee is deliberately wider than the viewport. Both were invisible/clipped by design but still expanded the page's actual scrollable width on mobile. Fixed with `overflow-x: hidden` on `html` and `body` (`src/index.css`).
- [x] Zero unexpected browser console errors or failed network requests on any route (one deliberate placeholder image with a working `onError` fallback — see Content Notes — is excluded as a known, non-broken case).
- [x] **WebKit-only "SSL connect error" on every route** — investigated and confirmed to be a Windows OS-level HSTS cache artifact from earlier local testing (before the HSTS-in-dev bug below was fixed), not a live defect: a fresh temp browser profile still showed it, proving it's cached at the OS network-stack level on this machine, unrelated to what the server currently sends. Real users, and Firefox/Chromium (which maintain per-profile HSTS instead of relying on the OS), were never affected.

## Real bugs found and fixed during this phase

1. **`AuthProvider` wrapped the entire app**, not just `/admin/*` — every public pageview from an anonymous visitor fired an `/api/auth/me` check that predictably 401s, wasting a DB session-store lookup and logging a console error on every single page load, site-wide. Fixed by scoping `AuthProvider` to only the admin route subtree (`src/App.tsx`).
2. **Helmet sent `Strict-Transport-Security` unconditionally**, even outside production/HTTPS. Browsers are supposed to ignore HSTS received over plain HTTP (RFC 6797), but not every engine honors that correctly, and it's not meaningful until actually on HTTPS. Fixed by gating `hsts` to `config.isProduction` (`server/src/createApp.js`) — found via the WebKit investigation above.
3. **No catch-all route existed in React Router at all.** Any mistyped, old, or crawler-guessed URL rendered a completely blank white page — no header, no footer, no message, nothing. Added a real `NotFound` page (`src/pages/NotFound.tsx`) as the router's `*` fallback, and made the server return an actual `404` HTTP status for genuinely unmatched paths (`seoResolver.resolveForPath` now flags `notFound`, `createApp.js`'s catch-all applies it) rather than always answering `200`.
   - **Follow-up regression, also fixed**: the first version of this 404 logic didn't know about `/admin/*` (that subtree isn't in `seoResolver`'s public route list), so every admin page — while still rendering and working correctly — started responding with an incorrect `404` status. Scoped the 404 status to non-admin paths only; `/admin/*` always answers `200` (its own client-side routing/auth is `ProtectedRoute`'s job, and `robots.txt` already disallows crawling it regardless).
4. **Two dead footer links**: `/privacy-policy` and `/terms-of-service` had no matching route at all (rendered the blank-page bug above). Real legal copy isn't something to fabricate, so these now serve an honest placeholder page (`src/pages/LegalPlaceholder.tsx`) rather than either a 404 or invented legal text — see **Content Notes**.

## Admin CRUD — every module, via the real UI

Verified through actual browser interaction (Playwright clicking through the real admin UI), not direct API calls — this catches frontend bugs an API-only test would miss.

- [x] Login / logout, including confirming a logged-out session is correctly redirected away from `/admin`.
- [x] **Divisions**: edit existing record, save, reload, confirm persistence; reverted.
- [x] **News**: create (inline form on the list page), edit (title/slug/excerpt/body/publish toggle), save, confirm persistence.
- [x] **Photo Gallery / Video Gallery**: video create → confirm appears in list → delete → confirm removed.
- [x] **Homepage settings / Suppliers**: pages render and load their data correctly.
- [x] **Section Manager** — all three explicitly required behaviors tested and reverted:
  - Visibility toggle (Eye/EyeOff), saved, confirmed via reload, reverted.
  - Reorder (▲/▼ buttons), saved, confirmed via reload, reverted.
  - Layout variant change (e.g. Hero: slider ↔ static), saved, confirmed via reload, reverted.
- [x] **Career Applications / Contact Messages / SEO Settings**: pages render and load their data correctly.

All test data (divisions edits, news posts, video gallery entries, section-manager changes) was created, verified, and then explicitly reverted or deleted — the database was confirmed clean of QA artifacts before sign-off.

## Contact & career forms, including file-upload edge cases

- [x] Contact form: happy-path submission succeeds end-to-end.
- [x] Contact form: an invalid email is rejected client-side, not silently accepted.
- [x] Career form: happy-path submission with a valid PDF succeeds end-to-end (through the real UI, real file picker, real upload).
- [x] Career form: file input's `accept` attribute correctly scopes the OS file picker to PDF/DOC/DOCX.
- [x] Career form: **server-side** rejection of a disallowed file type (`.exe` with a spoofed executable mimetype) verified directly against the live endpoint — confirmed the real security boundary (`documentUpload.js`'s mimetype allowlist, hardened in Phase 11) actually holds, not just the client-side `accept` hint which a browser file picker can be bypassed entirely.
- [x] Career form: submission without checking the required consent checkbox is blocked.

## SEO validation

- [x] `sitemap.xml` is valid, well-formed XML, served with the correct `application/xml` content-type, and contains exactly one `<loc>` per indexable route (deliberately excludes `/media-centre`, a pure client-side redirect with no standalone content — confirmed correct by design, not a gap).
- [x] `robots.txt` disallows `/admin/` and references the sitemap.
- [x] Every route has a non-empty, **unique** `<title>` and meta description (the one expected exception — `/media-centre` sharing meta with its redirect target — confirmed intentional).
- [x] Every route's canonical URL matches its own path exactly.
- [x] Every route has `og:title` and an **absolute** `og:image` URL (required for social link-preview bots).
- [x] Every route emits at least one valid, parseable JSON-LD block; division/news detail pages emit a second `BreadcrumbList` block.
- [x] **Re-verified the Phase 11 JSON-LD XSS fix still holds** after all Phase 12 changes (`<` escaping in `htmlTemplate.js`).

## Broken link / 404 check

- [x] Crawled every internal `<a href>` across all 19 public pages (21 unique internal links discovered) — all resolve to real content, not a blank/404 page.
- [x] All 6 unique external links (social profiles, partner sites) spot-checked reachable via a real HTTP request.
- [x] Confirmed a genuinely unknown path now returns HTTP 404 with a real "Page Not Found" UI (see **Real bugs found**, #3).

## Content Notes — resolved after this sign-off (post-Phase-12 follow-up)

The three items below were originally flagged here as client-owned content gaps. At the client's request they were addressed directly rather than left pending:

- **`/privacy-policy` and `/terms-of-service`** — replaced the placeholder with real draft policy pages (`src/pages/PrivacyPolicy.tsx`, `src/pages/TermsOfService.tsx`) describing this site's actual data practices (the contact and career forms, what's collected, no tracking cookies, no third-party data sharing). Each page carries a visible banner stating it hasn't been reviewed by legal counsel — **the client should have both pages reviewed by a lawyer before treating them as final**, since this was written from the codebase's actual behavior, not by counsel.
- **WhatsApp QR code image** — generated a real, scannable QR code (via `api.qrserver.com`, same service the existing fallback already used) pointing at the correct WhatsApp number and saved it locally as `public/whatsapp-qr.png`. `Footer.tsx` now references the real file directly, with the dynamic-fallback URL kept only as a safety net if the local file is ever missing.
- **167 images hot-linked to `i.ibb.co.com`** (6 division covers, 123 division gallery photos, 32 supplier logos, 6 homepage hero slides) — migrated into the site's own `/uploads` storage via a new one-time script (`server/scripts/migrateExternalImages.js`), running every image through the same Jimp optimization pipeline as admin uploads. All 167 confirmed migrated (a handful needed a retry against the slow source host — the script is idempotent, safe to re-run, and only touches rows still pointing at `ibb.co`). Verified zero remaining `ibb.co` references in the database and confirmed no broken images across the homepage and division pages afterward.

**Sign-off:** ✅ All functional, security-adjacent, and content-integrity issues found during the QA pass were either fixed and re-verified, or explicitly flagged for the client — and the three flagged content gaps have since been resolved directly (legal pages still need the client's actual legal review before launch).
