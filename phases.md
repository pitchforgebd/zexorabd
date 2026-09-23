# Zexora Corporation — Dynamic Website Roadmap

## Ground Rules

- **One phase at a time.** Work only on the current active phase.
- **Stop after finishing a phase.** Do not start the next phase until the user has reviewed and approved it.
- Each phase should leave the site in a working state (nothing half-broken left behind).
- Target stack constraints (fixed by hosting environment):
  - **Hosting:** cPanel (shared hosting) — must have **"Setup Node.js App" (Phusion Passenger)** support. This is a hard requirement now that the backend is Node.js; **must be verified in Phase 0** before anything else is built, since not all cPanel accounts include it.
  - **Database:** MySQL
  - **Backend:** **Node.js (Express) REST API** — connects to MySQL via `mysql2` driver (lightweight, prepared statements, no heavy ORM needed for this scope).
  - **CMS:** Custom-built headless CMS (admin panel + Node/MySQL API), not a 3rd-party SaaS CMS
  - **Frontend:** Existing React + Vite SPA, adapted to pull content **and layout/design decisions** from the API instead of hardcoded `src/data/*.ts` files and fixed JSX structure
  - **Design dynamics:** Confirmed scope — admin can control **section visibility, section order, and pre-built layout variants per section**, per page (see Phase 7). This is a *bounded site configurator*, not a free-form drag-and-drop page builder (explicitly out of scope — too large for this hosting/timeline).
  - **SEO:** With a Node.js backend, real server-side rendering becomes possible (unlike a PHP-only setup). Exact approach — lightweight Express+React SSR of public pages vs. a bot-only prerender middleware vs. a later Next.js migration — will be decided in Phase 0/Phase 9, but the goal is genuinely crawlable HTML + meta tags, not just client-side `<Helmet>` tags.
- Status legend: `Not Started` / `In Progress` / `Blocked` / `Done`

---

## Phase 0 — Architecture & Decisions Confirmation
**Status:** Done — awaiting your approval to move to Phase 1

**Goal:** Lock every open technical decision before any code is written, so later phases don't require rework.

**Decisions confirmed:**
- **cPanel Node.js App (Passenger) support:** ✅ Confirmed available on the hosting plan.
- **Domain/API structure:** API mounted under the same domain at `/api/*`, reverse-proxied to the Node app via cPanel's Node.js Selector-generated Passenger config. No separate API subdomain — simpler DNS/CORS story. Revisit later only if needed.
- **Folder layout:**
  - Repo root = the existing frontend (Vite/React), unchanged in structure.
  - New `/server` directory = Node/Express backend, its own `package.json`/`node_modules`, deployed as the cPanel "Application root".
  - `server/uploads/` for CVs and CMS-uploaded images, served via an Express static route.
  - Built frontend (`dist/`) deployed to the domain's public web root; `/api/*` requests proxied to the Node app.
- **Admin panel delivery:** React admin UI lives inside the same SPA under `/admin`, authenticated via an httpOnly session cookie issued by the Express API (not a separate app).
- **SEO rendering approach (principle):** Vite SSR pattern — Express renders public marketing pages server-side via `react-dom/server` (a dedicated `entry-server.tsx`) so crawlers receive real HTML + meta tags. The admin panel stays client-side-only (CSR); it doesn't need SEO. Full detail finalized in Phase 9.
- **DB driver:** `mysql2` (promise-based pool), no heavy ORM. Schema managed as versioned plain `.sql` migration files (Phase 1).
- **Backend conventions:** `server/src/{routes,controllers,db,middleware,utils}`; JSON response envelope `{ success, data?, error?: { message, code } }`; config via `server/.env` (gitignored) with a committed `.env.example`.
- **Local dev environment verified:** Node v22.17.0 / npm 10.9.2.
- **Git repository initialized**, baseline snapshot committed (`0bb90bc`) before any dynamic-site changes.

**Deliverable:** ✅ Decisions documented above, repo under version control, Node.js hosting support verified.

---

## Phase 1 — Database Design
**Status:** Done — awaiting your approval to move to Phase 2

**Goal:** Design the MySQL schema that will back the entire CMS.

**What was built:**
- `database/schema.sql` — full `CREATE TABLE` schema: `admin_users`, `divisions`, `product_categories`, `product_subcategories`, `product_items`, `suppliers`, `news_posts`, `photo_gallery`, `video_gallery`, `career_applications`, `contact_messages`, `seo_meta`, `site_settings`, `page_sections` (the last three exist now so Phases 6/7/9 need no schema changes later).
- `database/README.md` — entity-relationship notes, a MySQL/MariaDB JSON-support version caveat to double check at deployment time, and the seeding plan.
- Product catalog (division → category → subcategory → item) is fully relational with FKs (`ON DELETE CASCADE`) since it needs real CRUD + reordering in the admin.
- Simpler bullet-list division content (industries, reasons, commitment, strengths, markets, philosophy, sourcing steps) is stored as `JSON` columns directly on `divisions` rather than one table per list — it's page copy, not queryable catalog data; keeps the schema from exploding into a dozen near-identical list tables.
- Everything CRUD-relevant has `sort_order` for drag-reorder support in the admin later.

**Deliverable:** ✅ `/database/schema.sql` + `/database/README.md` (ER description).

---

## Phase 2 — Backend API Core
**Status:** Done — awaiting your approval to move to Phase 3

**Goal:** Stand up the Node.js/Express REST API skeleton that all CMS modules will build on.

**What was built (`/server`):**
- `app.js` — Passenger-compatible entry point (listens on `process.env.PORT`, per cPanel Node.js App requirements).
- `src/createApp.js` — Express app factory: `helmet`, `compression`, JSON/urlencoded body parsing, `morgan` logging, conditional `cors`, static `/uploads` serving, mounts `/api`, then 404 + centralized error handler.
- `src/db/pool.js` — `mysql2/promise` connection pool (prepared statements via named placeholders, no string-concatenated SQL).
- `src/utils/response.js` — standard envelope helpers (`ok`, `created`, `fail`, `ApiError`) used by every route from here on.
- `src/middleware/{notFound,errorHandler,validate}.js` — 404 handler, centralized error handler (masks internals in production), and an `express-validator` wrapper ready for Phase 3+ mutating routes.
- `src/routes/health.js` + `src/routes/index.js` — `GET /api/health` (checks real DB connectivity), with the router pre-wired for every module coming in Phases 4–9.
- `src/config/index.js` — `.env`-driven config (DB, CORS, session secret, mail — mail/session values unused until Phases 3/8 but defined now).
- `.env.example` committed; real `.env` gitignored.
- `.gitignore` updated so `server/uploads/**` (runtime CV/image uploads) is excluded from git while the folder structure itself is kept via `.gitkeep`.

**Verified working, not just written:**
- Created a local dev MySQL database and applied `database/schema.sql` against real MySQL 8.0.30 — all 14 tables created cleanly, no FK/JSON errors.
- Booted the server locally and hit the live endpoints:
  - `GET /api/health` → `{"success":true,"data":{"status":"ok","db":"connected","time":"..."}}`
  - `GET /api/nope` → `{"success":false,"error":{"message":"Route not found: GET /api/nope","code":"NOT_FOUND"}}`
- Dev server stopped afterward; nothing left running.

**Deliverable:** ✅ Working `/api/health` endpoint (DB-backed) + shared framework code for every later module.

---

## Phase 3 — Admin Authentication & Panel Shell
**Status:** Done

**Goal:** Secure login system and the base admin dashboard shell.

**Backend (`/server`):**
- `src/session.js` — `express-session` backed by `express-mysql-session` (own `sessions` table, auto-created), httpOnly/`sameSite=lax` cookie, 8h rolling expiry.
- `src/middleware/csrf.js` — double-submit-cookie CSRF protection (non-httpOnly `csrf_token` cookie + required `X-CSRF-Token` header on every mutating `/api/*` request). Avoids the unmaintained `csurf` package.
- `src/middleware/requireAuth.js`, `src/middleware/rateLimiters.js` (login limited to 10 attempts/15min).
- `src/routes/auth.js` — `POST /login` (bcryptjs compare, session regenerate on success, constant error message whether the email exists or not), `POST /logout`, `GET /me`.
- `bcryptjs` chosen over native `bcrypt` deliberately — no compiled bindings, so it can't fail to install on cPanel shared hosting without a build toolchain.
- `scripts/createAdmin.js` — CLI-only admin provisioning (`node scripts/createAdmin.js --name ... --email ... --password ...`). There is **no public registration endpoint**, by design.

**Frontend (`src/admin`):**
- `api.ts` — fetch wrapper: attaches the CSRF header on mutating requests, unwraps the `{success, data}` / `{success:false, error}` envelope.
- `AuthContext.tsx` / `ProtectedRoute.tsx` — session-aware auth state (checks `GET /api/auth/me` on load), redirects unauthenticated users to `/admin/login`.
- `AdminLogin.tsx`, `AdminLayout.tsx` (sidebar shell), `AdminDashboard.tsx`, `AdminPlaceholder.tsx` (stub pages for every module still to come — Divisions, News & Media, Homepage & Suppliers, Page Sections, Career Applications, Contact Messages, SEO — each says which phase will build it).
- Wired into `App.tsx` as a separate `/admin/*` route tree, deliberately **outside** the public `Layout` (no public Header/Footer on admin pages).
- `vite.config.ts` — dev-only proxy of `/api` and `/uploads` to the Node server, so the frontend calls relative paths exactly as it will in production (same-origin behind Passenger).

**Verified, not just written:**
- Backend: full curl-driven test of the auth flow — unauthenticated `/me` (401), login rejected without CSRF header (403), login rejected with wrong password (401), successful login + session cookie, authenticated `/me`, logout, `/me` after logout (401 again). All passed.
- Frontend: ran both dev servers and drove a real headless-Chromium session through the whole flow (`/admin` → redirect to login → log in → dashboard → click a placeholder module → sign out → redirected to login → re-visiting `/admin` bounces to login again). Screenshots confirmed correct rendering at every step; no uncaught JS errors (only expected benign 401 network log lines during the logged-out `/me` check, which the app already handles gracefully).
- `tsc --noEmit` clean for all new admin code (the project's pre-existing unrelated type error in `src/data/divisions.ts`/`Divisions.tsx` — a `sourcing` field missing from the `DivisionContent` type — predates this work and is left alone; that file is retired in Phase 10 anyway).
- Dev servers and the temporary Playwright browser install were both cleaned up after testing; nothing left running.

**Deliverable:** ✅ Working, secured `/admin` login + dashboard shell with navigation to every future CMS module.

---

## Phase 4 — CMS Module: Divisions & Products
**Status:** Done — awaiting your approval to move to Phase 5

**Goal:** Replace the hardcoded `src/data/divisions.ts` with database-backed content manageable from the admin panel.

**Schema correction found mid-phase:** the live site has a per-division "Visuals & Products" photo gallery (`src/data/divisionImages.ts`, ~130 images across 6 divisions) that Phase 1's schema missed entirely. Added `database/migrations/001_division_gallery_images.sql` (a `division_gallery_images` table) — the first entry in an incremental-migrations folder that sits alongside the Phase 1 `schema.sql` snapshot.

**Backend (`/server`):**
- `src/services/divisions.js` — shared read/write logic: list, get-by-slug-or-id (with full nested product tree + gallery), create, full-update (transactional replace of the entire category→subcategory→item tree on every save), delete, slug-uniqueness check, reorder.
- `src/db/transaction.js` — small `withTransaction()` helper wrapping begin/commit/rollback/release.
- `src/middleware/imageUpload.js` — `multer`-based image upload factory (randomized filenames, JPEG/PNG/WEBP/GIF only, 8MB cap, never trusts client-supplied filenames).
- `src/routes/divisions.js` — public `GET /api/divisions`, `GET /api/divisions/:slug`.
- `src/routes/admin/divisions.js` — full authenticated CRUD (`GET/POST/PUT/DELETE /api/admin/divisions[/:id]`), `PATCH .../reorder`, cover-image and gallery-image upload/delete endpoints. Deleting a division now also best-effort deletes its uploaded cover + gallery files from disk (caught this gap myself before it shipped, fixed before committing).

**Data migration:**
- `scripts/migrate-divisions.ts` (root, run via `npx tsx`) — safely re-runnable script that reads the existing `src/data/divisions.ts`, `divisionImages.ts`, and `suppliers.ts` and upserts everything into MySQL (divisions upserted by slug, each division's product tree and gallery fully rebuilt from source on every run, suppliers inserted if not already present). Also backfills `cover_image` from each division's first gallery image, since the homepage needed a thumbnail source.

**Frontend:**
- `src/lib/{api.ts,types.ts,icons.ts,useDivisions.ts}` — the API client (moved out of `src/admin` since it's now shared with the public site), typed API shapes, a small curated icon-name→component map (see below), and `useDivisionsList`/`useDivision` hooks.
- `src/pages/Divisions.tsx` (listing + `DivisionTemplate` detail), `src/components/Footer.tsx`, and `src/pages/Home.tsx` all now fetch from the API instead of importing the static data files — the whole site's division content is DB-driven, not just the `/divisions` routes.
- `src/admin/divisions/` — `AdminDivisionsList` (table with reorder arrows, create, delete), `AdminDivisionEdit` (full editor: basic info, cover image upload, optional philosophy section, five bullet-list editors, optional sourcing steps, the full category→subcategory→item product tree editor, gallery upload/delete grid), `ProductsEditor`, `StringListEditor`.

**Bug caught and fixed before committing:** initially used lucide-react's `icons` registry object for dynamic icon lookup by name — this pulled in every icon in the library and bloated the production bundle from 664KB to 1.39MB (confirmed by diffing build output against the pre-Phase-4 baseline). Replaced with a small explicitly-imported map of just the icons actually used; bundle is now 656KB, slightly *smaller* than before this phase.

**Verified, not just written:**
- Migration script run against a real local MySQL 8 database: 6 divisions, 18 categories, 43 subcategories, 300 items, 123 gallery images, 32 suppliers — counts double-checked by direct SQL query.
- Full curl-driven test of the admin API: CSRF-rejected/validated/successful create, full nested-tree update, slug-collision rejection, cover-image and gallery-image upload (plus non-image-file rejection), gallery-image delete, reorder, delete with cascade verified at the DB level (orphan categories/gallery rows = 0 after deleting a test division with children).
- Full Playwright browser run covering both sides at once: home page and `/divisions` listing and detail pages rendering DB content, admin login → open the real "chemicals" division → edit its tagline → save → confirmed the change appears live on the public page → reverted it back, all in one session. Screenshots reviewed; no uncaught JS errors.
- `tsc --noEmit` and `vite build` both clean (the one pre-existing unrelated type error in `src/data/divisions.ts` is untouched, as before).
- All dev servers, the temporary Playwright browser, and stray processes were stopped/cleaned up after testing.

**Deliverable:** ✅ Divisions pages (and the homepage/footer division references) are fully DB-driven; admin can edit a division's full content, including its product catalog, without a code deploy.

---

## Phase 5 — CMS Module: News & Media Centre
**Status:** Done — awaiting your approval to move to Phase 6

**Goal:** Turn the currently-empty News/Photo Gallery/Video Gallery pages into real, manageable content.

**Backend (`/server`):**
- `src/services/{news,photoGallery,videoGallery}.js` — same conventions as Phase 4's divisions module.
- Public: `GET /api/news` (paginated, published-only), `GET /api/news/:slug`, `GET /api/photo-gallery`, `GET /api/video-gallery` (both published-only, ordered by `sort_order`).
- Admin: full CRUD under `/api/admin/{news,photo-gallery,video-gallery}` — news has title/slug/excerpt/body/cover-image + publish toggle; photo gallery is direct multi-image upload (no separate "create" step) with publish/hide toggle, delete, reorder; video gallery stores a title + external video URL (YouTube/Vimeo) with an optional uploaded thumbnail.
- Photo/video gallery each have a `PATCH /reorder` route — **deliberately registered before their `PATCH /:id` route**, otherwise Express would match the literal path segment `reorder` as an `:id` parameter and reroute it into the wrong handler. Caught this by testing the reorder call directly, not just by reading the code.

**Frontend:**
- `src/lib/useMedia.ts` — `useNewsList`, `useNewsPost`, `usePhotoGallery`, `useVideoGallery` hooks.
- Public `News.tsx` (paginated grid), a new `NewsDetail.tsx` (individual post page — didn't exist before, needed once posts became real), `PhotoGallery.tsx`, and `VideoGallery.tsx` (auto-derives a YouTube thumbnail from the video URL when the admin didn't upload one) now render real data instead of static placeholders.
- `src/admin/media/` — `AdminMediaHub` (landing page linking to the three sub-sections), `AdminNewsList`/`AdminNewsEdit`, `AdminPhotoGallery` (upload grid with publish/hide/delete), `AdminVideoGallery` (list with inline edit, thumbnail upload).

**Bug caught and fixed before committing:** publishing a post by toggling "Published" in the edit form (as opposed to publishing at creation time) never set `published_at` — only the create endpoint handled that. Found it by actually looking at the rendered public news list (the newly-published test article was missing its date badge) rather than trusting the API response alone. Fixed so `published_at` is set the first time a post becomes published and preserved on every edit after that; verified with a fresh curl sequence (create draft → publish → edit again → timestamp unchanged).

**Verified, not just written:**
- Full curl-driven test of every new endpoint: news create/publish-filtering, photo upload + reorder (specifically re-testing the route-order fix), video create + reorder, plus the `published_at` bug reproduction and fix confirmation.
- Playwright browser pass: public News/PhotoGallery/VideoGallery pages, admin login → Media hub → create a draft news post → edit its body → save → publish it → confirmed it appears on the live public news list with the rest of the admin screens (photo gallery, video gallery) loading correctly. Screenshots reviewed; no uncaught JS errors.
- `tsc --noEmit` and `vite build` both clean (685.74KB bundle — a reasonable ~29KB increase for three new CRUD modules, no repeat of the earlier bundle-bloat mistake).
- All test data (news posts, uploaded test images, stray upload files) cleaned out of the local dev database before committing; dev servers stopped.

**Deliverable:** ✅ Media Centre section (News with pagination and individual post pages, Photo Gallery, Video Gallery) is fully functional and editable from the admin panel.

---

## Phase 6 — CMS Module: Homepage & Supplier Content
**Status:** Not Started

**Goal:** Move remaining hardcoded content (hero slider text/images, stats, supplier logos, "why choose us") into the CMS.

**Tasks:**
- `site_settings` admin screens for homepage sections' content (text, numbers, images).
- Supplier logo manager (replacing the hardcoded ibb.co URL list with server-hosted uploads).
- Frontend wiring for `HeroSlider`, `StatBox`, `SupplierLogos`, `WhyChooseGrid`.

**Deliverable:** Homepage content is fully editable without touching code.

> Note: this phase covers *content* inside sections. *Whether a section shows, its order, and its visual variant* is handled next, in Phase 7.

---

## Phase 7 — Page & Section Layout Control (Design Dynamics)
**Status:** Not Started

**Goal:** Let admin control page composition — which sections appear, in what order, and which pre-built layout variant each section uses — without a developer or code deploy. (Scope confirmed: section visibility + ordering + variant picking; **not** a free-form drag-and-drop page builder.)

**Tasks:**
- Finalize `page_sections` table usage: `page_key`, `section_key`, `is_visible`, `sort_order`, `layout_variant`, `config` (JSON for variant-specific settings, e.g. background color/image, CTA style).
- Audit and refactor key reusable components (`HeroBanner`/`HeroSlider`, `StatBox`, `WhyChooseGrid`, `IndustriesGrid`, `SupplierLogos`, `CTABanner`, `DivisionCard` grid, etc.) so each supports 2–3 pre-built layout variants — a bounded set, not infinite custom design, to keep this realistically buildable.
- Admin UI: per-page "Section Manager" — toggle visibility, drag-and-drop reorder (writes `sort_order`), variant picker dropdown per section, variant-specific config fields.
- Public API endpoint: `GET /api/pages/{page_key}/sections` → ordered list of visible sections with their variant + config.
- Frontend: a dynamic section renderer — React fetches the section list for the current page and renders the matching component + variant in order, skipping hidden ones.
- Apply across: Home, About, Divisions listing, individual division pages, Contact/Career info areas (form fields themselves stay fixed — only surrounding layout/sections are configurable).

**Deliverable:** Admin can hide/show and reorder sections on any covered page, and switch each section between a few pre-designed layout styles, live — no developer needed for everyday design changes.

---

## Phase 8 — Contact & Career Forms Backend
**Status:** Not Started

**Goal:** Replace the fragile Google Apps Script + client-only EmailJS flow with a proper server-side pipeline, while keeping email notifications.

**Tasks:**
- `POST /api/contact` — stores message in `contact_messages`, sends notification email via `nodemailer` (SMTP).
- `POST /api/career` — stores application in `career_applications`, stores uploaded CV file server-side under `/uploads/cv` (via `multer`, with type/size validation), sends notification email via `nodemailer`.
- Admin inbox screens to view/manage contact messages and job applications (mark read, export, delete).
- Remove dependency on Google Apps Script/Google Drive once this is verified working.

**Deliverable:** Both forms work end-to-end through the new backend; admin can see submissions directly in the panel.

---

## Phase 9 — SEO Infrastructure
**Status:** Not Started

**Goal:** Make every page genuinely SEO-friendly, not just client-side `<Helmet>` tags that crawlers may not execute.

**Tasks:**
- Per-page SEO fields editable in admin (`seo_meta` table): title, meta description, OG image, canonical URL — for divisions, news posts, and static pages.
- Finalize and implement the server-side rendering strategy for crawlers (decided in principle in Phase 0): Express-side SSR of the React app for public routes, or a bot-detecting prerender middleware, injecting real `<title>`/meta/OG tags into the HTML response before it reaches the crawler.
- Auto-generated `sitemap.xml` (regenerated when content changes) and `robots.txt` review.
- JSON-LD structured data (Organization, Product, BreadcrumbList where relevant).
- Clean, human-readable URL slugs for all dynamic content.
- Image `alt` text sourced from CMS fields.

**Deliverable:** Site passes basic SEO audit (Lighthouse SEO score, valid structured data, sitemap submitted to Search Console).

---

## Phase 10 — Frontend Integration Cleanup
**Status:** Not Started

**Goal:** Finish migrating the React app fully off static data files and fixed layouts.

**Tasks:**
- Remove/retire `src/data/divisions.ts`, `suppliers.ts`, `seoData.ts` once their DB-backed equivalents are confirmed working (keep as fallback only if explicitly wanted).
- Centralized API client, loading/error states, basic caching.
- Environment-based API base URL (`.env` for dev vs. production).

**Deliverable:** No content or layout decision is hardcoded in the frontend build; everything renders from the API.

---

## Phase 11 — Security & Performance Hardening
**Status:** Not Started

**Goal:** Production-harden before go-live.

**Tasks:**
- Audit all API endpoints for SQL injection, XSS, file-upload abuse, auth bypass.
- Rate limiting on public form endpoints (spam/abuse protection).
- HTTPS enforcement, secure cookies/session config (`secure`, `httpOnly`, `sameSite`).
- Image optimization/compression pipeline for uploads.
- Caching headers for static assets; basic query caching where useful.
- Process resilience under Passenger (auto-restart on crash), and an automated MySQL backup strategy on cPanel (cron + `mysqldump`).

**Deliverable:** Security checklist signed off; backups verified restorable.

---

## Phase 12 — QA & Testing
**Status:** Not Started

**Goal:** Verify everything works end-to-end before deployment.

**Tasks:**
- Cross-browser and mobile responsiveness pass.
- Full admin CRUD testing for every module, including Section Manager (visibility/order/variant changes).
- Contact/career form submission testing (including file upload edge cases).
- SEO validation (structured data testing tool, sitemap validity, verifying crawlers see rendered content).
- Broken link / 404 check across all routes.

**Deliverable:** QA sign-off checklist.

---

## Phase 13 — cPanel Deployment
**Status:** Not Started

**Goal:** Ship to production.

**Tasks:**
- Create production MySQL database + user via cPanel, import schema.
- Set up the Node.js app via cPanel's "Setup Node.js App", pointing it at the deployed backend code; run `npm install` through the provided interface/terminal.
- Upload/build the React frontend (`dist/`) to the appropriate served directory.
- Configure `.htaccess`/Passenger routing so `/api/*` hits the Node app and other routes serve the SPA (or SSR output, per Phase 9).
- Set environment variables via cPanel's Node.js App UI (DB credentials, mail settings, session secret) — not committed to git.
- SSL certificate check (AutoSSL/Let's Encrypt via cPanel).
- DNS/domain pointing verification.

**Deliverable:** Live production site fully functional on the real domain.

---

## Phase 14 — Documentation & Handover
**Status:** Not Started

**Goal:** Make the CMS usable by non-technical staff without developer involvement.

**Tasks:**
- Admin user guide (screenshots): how to edit a division, publish news, view form submissions, use the Section Manager to rearrange a page.
- Credentials handover (admin accounts, DB access).
- Backup/restore instructions.
- Notes on how to request future developer changes (what's code vs. what's CMS-editable), and how to restart the Node app on cPanel if needed.

**Deliverable:** Handover document delivered; client can self-serve content and layout updates.

---

## Progress Log
*(Updated as each phase is approved/completed.)*

| Phase | Status | Approved On |
|---|---|---|
| 0 | Done | 2026-09-23 |
| 1 | Done | 2026-09-23 |
| 2 | Done | 2026-09-23 |
| 3 | Done | 2026-09-24 |
| 4 | Done | 2026-09-24 |
| 5 | Done (awaiting approval) | — |
| 6 | Not Started | — |
| 7 | Not Started | — |
| 8 | Not Started | — |
| 9 | Not Started | — |
| 10 | Not Started | — |
| 11 | Not Started | — |
| 12 | Not Started | — |
| 13 | Not Started | — |
| 14 | Not Started | — |
