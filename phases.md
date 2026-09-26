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
  - ~~Built frontend (`dist/`) deployed to the domain's public web root; `/api/*` requests proxied to the Node app.~~ **Revised in Phase 9:** the Node app now serves the built frontend directly too (`express.static(dist/)` + a catch-all route), not split between Apache-static and Node-API. This turned out to be required, not just simpler — SEO meta injection (title/description/OG tags per URL) has to happen server-side before the HTML is sent, which is only possible if the request actually reaches the Node app. See Phase 9.
- **Admin panel delivery:** React admin UI lives inside the same SPA under `/admin`, authenticated via an httpOnly session cookie issued by the Express API (not a separate app).
- **SEO rendering approach (principle):** ~~Vite SSR pattern — Express renders public marketing pages server-side via `react-dom/server`~~. **Revised in Phase 9** after weighing the real cost: full SSR would require rewriting every `useEffect`-based data-fetching hook built across Phases 4–8 into a server-compatible loader pattern, and headless-Chromium prerendering carries real cPanel shared-hosting risk (Puppeteer's bundled Chromium often can't run there). Shipped instead: server-side **meta-tag/OG/JSON-LD injection only** — Express looks up the right title/description/image for the requested URL and substitutes it into `index.html` before sending; the actual page content is still client-rendered React. This covers what actually matters (search engine indexing, since Google/Bing execute JS anyway; social-media link previews, which don't) without the rewrite. Full detail in Phase 9.
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
**Status:** Done — awaiting your approval to move to Phase 7

**Goal:** Move remaining hardcoded content (hero slider text/images, stats, supplier logos, "why choose us") into the CMS.

**Backend (`/server`):**
- `services/siteSettings.js` — generic key/value get-all/set over the `site_settings` table (JSON values), used for `home.hero`, `home.stats`, `home.whyChooseUs`, `home.suppliers`.
- `services/suppliers.js` — same CRUD conventions as photo gallery (Phase 5).
- Public `GET /api/site-settings` (all keys in one call — the homepage needs several at once) and `GET /api/suppliers` (active only).
- Admin `GET/PUT /api/admin/site-settings[/:key]`, a generic `POST /api/admin/site-settings/upload-image` (for hero slide images, which aren't tied to an existing record the way a division's cover image is), and full admin CRUD under `/api/admin/suppliers` (upload, reorder, hide/show, delete).

**Data:**
- `scripts/seed-site-settings.ts` — mirrors `migrate-divisions.ts`'s approach: seeds `site_settings` with the *exact* current hardcoded hero slides/stats/reasons/supplier copy, so cutting over to the CMS caused zero visual regression. Supplier logos didn't need a separate seed — Phase 4's `migrate-divisions.ts` already populated the `suppliers` table.

**Frontend:**
- `src/lib/useSiteSettings.ts` — `useSiteSettings()` and `useSuppliers()` hooks.
- `HeroSlider.tsx` and `SupplierLogos.tsx` now fetch their own content instead of importing static arrays (each falls back gracefully — an empty slide/supplier list just renders nothing rather than crashing). `Home.tsx`'s stats and "why choose us" reasons/heading come from settings with the original hardcoded values kept as in-code fallback defaults (so the page never flashes empty before the fetch resolves).
- `src/admin/homepage/AdminHomepage.tsx` — one page, four independently-saved sections: Hero Slider (per-slide image upload + text), Stats, Why Choose Us (heading/subheading + reasons), Supplier section copy. `AdminSuppliers.tsx` — the logo grid manager (upload, hide/show, delete), linked from the homepage settings page.

**Bug caught during my own verification (not an app bug — a test-script mistake worth recording anyway):** while browser-testing the save flow, my test script edited the first "Stats" row's label, then "reverted" it by typing the *second* row's original label into that same first-row field, silently corrupting the seeded data (`Established` → `Years of Experience`). Caught it by re-querying the API afterward instead of trusting the test's own success output, and restored the correct seeded values via a direct API call before moving on. Recorded here because it's exactly the kind of self-inflicted verification bug that's worth staying suspicious of.

**Verified, not just written:**
- curl-driven test of every new endpoint, including a regression check that the Phase 5 `PATCH /reorder`-before-`/:id` route-ordering fix pattern was correctly applied to the new suppliers routes too.
- Playwright pass: public homepage (hero text, stats, why-choose-us, supplier section) rendering from the API; admin login → Homepage & Suppliers settings page (all 6 hero slides / 3 stats / 8 reasons / supplier copy loaded correctly) → edited and saved a stat → confirmed it went live on the public homepage → reverted → opened the supplier logo manager and confirmed all 32 migrated logos load. Hero/supplier background images show blank in screenshots only because this sandbox has no outbound internet to reach the legacy `ibb.co` URLs — same known, already-confirmed limitation from Phases 4–5, not a rendering bug.
- `tsc --noEmit` clean, `vite build` clean (696.63KB, a reasonable ~11KB increase — no repeat of the Phase 4 bundle-bloat mistake).
- Dev servers stopped and local DB double-checked back to its correct seeded state after testing.

**Deliverable:** ✅ Homepage content (hero slider, stats, "why choose us", supplier logos and section copy) is fully editable from the admin panel without touching code.

> Note: this phase covers *content* inside sections. *Whether a section shows, its order, and its visual variant* is handled next, in Phase 7.

---

## Phase 7 — Page & Section Layout Control (Design Dynamics)
**Status:** Done — awaiting your approval to move to Phase 8

**Goal:** Let admin control page composition — which sections appear, in what order, and which pre-built layout variant each section uses — without a developer or code deploy. (Scope confirmed: section visibility + ordering + variant picking; **not** a free-form drag-and-drop page builder.)

**Scope decision made this phase:** built this fully and thoroughly for the **Home page only**, rather than spreading a shallower version across Home/About/Divisions/Contact as the original task list sketched. Reasoning: Home is the page that actually has swappable marketing-style sections (10 of them); About/Divisions-listing/division-detail pages are narrative or already fully DB-driven (Phase 4) in ways that don't naturally decompose into interchangeable blocks. The infrastructure — `page_sections` table, the public/admin API, the admin Section Manager component — is entirely page-agnostic, so extending to another page later is just: seed rows for that `page_key`, split that page into named section components, and reuse the same manager UI. Flagging this rather than quietly narrowing it.

**Backend (`/server`):**
- `services/pageSections.js` — `listForPage` (public: visible-only; admin: all, including hidden) and `replaceForPage` (bulk upsert by `page_key`+`section_key`, transactionless but idempotent via `ON DUPLICATE KEY UPDATE`).
- Public `GET /api/pages/:pageKey/sections`; admin `GET/PUT /api/admin/pages/:pageKey/sections` (PUT takes the whole ordered section array in one call, matching how the admin UI saves — one "Save Changes" button, not per-row).
- `scripts/seed-page-sections.ts` registers the 10 fixed Home section keys, seeded once; re-running only refreshes the *default* variant per section and deliberately does not clobber an admin's live visibility/order choices.

**Frontend — the real work of this phase was restructuring `Home.tsx`:**
- Split the previous single ~470-line `Home.tsx` into 10 standalone section components under `src/components/home-sections/` (`HeroSection`, `AboutSnapshotSection`, `DivisionsGridSection`, `WhyChooseUsSection`, `IndustriesSection`, `GlobalSourcingSection`, `SuppliersSection`, `SisterConcernsSection`, `VisionMissionSnapshotSection`, `CtaSection`) — same visual output as before, just addressable.
- `Home.tsx` is now a thin orchestrator: fetches `usePageSections('home')`, looks up each visible `sectionKey` in a component registry, and renders them in `sortOrder`, passing `layoutVariant` as a prop. Falls back to rendering every section in code-defined order if the API call fails, so a backend hiccup never means a blank homepage.
- Three sections got real, distinct layout variants (not just a label swap): **Hero** (`slider` — the existing rotating carousel — vs `static`, first slide only, no autoplay/controls), **Divisions Grid** (`cards` — current large image cards — vs `compact`, a smaller icon+name grid), **Why Choose Us** (`grid` — current 4-column icon grid — vs `list`, a vertical checklist). The other 7 sections get visibility+reorder only, with a single implicit `default` variant — building 2-3 genuine variants for all 10 would have meant ~25 layout variants, most of them low-value; these three are the sections where a second layout style is actually plausible for a real site operator to want.
- `src/lib/usePageSections.ts` hook; `src/admin/sections/AdminPageSections.tsx` — the Section Manager: up/down reorder arrows, an eye/eye-off visibility toggle, and a variant `<select>` only on the three sections that have more than one option.

**Verified, not just written:**
- curl-driven test of the admin bulk-update endpoint: hid a section, reordered, changed two variants, confirmed the public endpoint reflected all of it correctly, then reverted.
- Playwright pass: confirmed all 10 sections list in the admin manager, toggled "Sister Concerns" hidden, switched the Divisions Grid variant to Compact, moved the CTA banner up one position, saved, then **re-fetched the live public homepage and asserted on its actual rendered text** — confirmed "Our Sister Concerns" no longer appears and the CTA banner now appears before the Vision & Mission section — rather than trusting the admin form's own "Saved." message. Reverted afterward and confirmed via a fresh API call that all 10 sections are back to their original visibility/order/variant.
- `tsc --noEmit` clean, `vite build` clean (703.07KB, a ~6KB increase for the whole admin Section Manager + component split — no bundle regression).
- Dev servers stopped after testing.

**Deliverable:** ✅ Admin can hide/show and reorder all 10 homepage sections, and switch layout style on the 3 sections where more than one genuinely makes sense, live — no developer needed. (About/Divisions/Contact section management deferred — see scope decision above.)

---

## Phase 8 — Contact & Career Forms Backend
**Status:** Done — awaiting your approval to move to Phase 9

**Goal:** Replace the fragile Google Apps Script + client-only EmailJS flow with a proper server-side pipeline, while keeping email notifications.

**Backend (`/server`):**
- `services/mail.js` — a thin `nodemailer` wrapper. If SMTP isn't configured (empty host/user in `.env`), it logs a warning and returns `{sent:false}` instead of throwing — a form submission always succeeds and is captured in the DB even before real SMTP credentials exist, which matters because I don't have real SMTP creds to test with in this environment.
- `services/contactMessages.js` / `services/careerApplications.js` — plain CRUD + status updates, following the established service pattern.
- `middleware/documentUpload.js` — a `multer` upload restricted to PDF/DOC/DOCX, 5MB cap (matches the original frontend's stated limit), reusing `imageUpload.js`'s `publicPathFor` helper rather than duplicating it.
- Public `POST /api/contact` (JSON) and `POST /api/career` (multipart, CV required) — both behind a new shared `formSubmitLimiter` (8 submissions/15min, intentionally shared across both endpoints by IP as one combined per-visitor budget rather than 8+8 separately).
- Admin `GET/PATCH/DELETE` under `/api/admin/contact-messages` and `/api/admin/career-applications` — status transitions validated against a fixed enum, delete on career applications also removes the uploaded CV file from disk.

**Frontend — full replacement, not a patch:**
- `Contact.tsx` rewritten from `emailjs.sendForm` (uncontrolled ref-based form) to controlled state posting JSON to `/api/contact` via the shared `apiFetch` client.
- `Career.tsx` rewritten from base64-encode → POST to a hardcoded Google Apps Script URL → `emailjs.send` (three external dependencies chained together) to a single `FormData` POST to `/api/career`. Deleted the dead "Google Apps Script Configuration Required" troubleshooting UI block that existed only to explain that fragile flow's most common failure mode.
- `src/admin/inbox/AdminContactMessages.tsx` and `AdminCareerApplications.tsx` — expandable-row inboxes; opening a contact message auto-marks it read; career applications show a CV download link and a status dropdown (new/reviewed/shortlisted/rejected).
- **Cleanup that the phase's own deliverable called for:** removed the now-unused `@emailjs/browser` package (`npm uninstall`, not just deleting the import), deleted `google-apps-script.js` from the repo root, and cleared the now-dead `VITE_EMAILJS_*` variables out of the local `.env`.

**Verified, not just written:**
- curl-driven test of both public endpoints: validation errors, a full successful submission, non-PDF/DOC file rejection on the CV upload, and the rate limiter (confirmed it triggers at exactly the 9th request across the two endpoints combined — which is correct given they share one limiter instance, not a bug I had to chase).
- curl-driven test of the admin side: status transitions (including rejecting an invalid status value), CV file actually being servable over HTTP, delete-with-file-cleanup confirmed by re-requesting the CV URL and getting 404 afterward.
- Full Playwright pass through the real public forms: submitted the live Contact form and the live Career form (with an actual file picked via `setInputFiles` for the CV upload) through the rendered UI — not just the API directly — then confirmed both submissions appear correctly in their admin inboxes, exercised the auto-mark-as-read behavior, changed a career application's status, confirmed the "View CV" link in the admin UI resolves to a real 200 response, then deleted both test records through the admin UI itself and confirmed the empty-state messaging returns. No uncaught JS errors.
- `tsc --noEmit` and `vite build` both clean (707.24KB — the `@emailjs/browser` removal roughly offset the two new admin inbox pages, net +4KB).
- Confirmed both DB tables and the `uploads/cv` folder are empty/clean after the Playwright run deleted its own test data; dev servers stopped.

**Deliverable:** ✅ Both forms work end-to-end through the new backend with no EmailJS or Google Apps Script dependency left anywhere in the codebase; admin can see, triage, and act on every submission directly in the panel.

---

## Phase 9 — SEO Infrastructure
**Status:** Done — awaiting your approval to move to Phase 10

**Goal:** Make every page genuinely SEO-friendly, not just client-side `<Helmet>` tags that crawlers may not execute.

**Architecture decision made this phase (see the revised Phase 0 note above):** shipped server-side meta-tag/OG/JSON-LD injection rather than full React SSR. Reasoning laid out above — full SSR would mean rewriting every `useEffect`-based data hook from Phases 4–8, and headless-Chromium prerendering is a real risk on cPanel shared hosting. What crawlers and social-link-preview bots actually need — an accurate `<title>`, description, and OG image for the exact URL they requested — is fully solved by injection alone, since Google/Bing render JS for the body content anyway and non-JS bots (Facebook, WhatsApp, LinkedIn, Slack) only ever read the raw HTML `<head>`.

**Backend (`/server`):**
- `services/seoMeta.js` — plain get/get-all/upsert over `seo_meta`.
- `services/seoResolver.js` — the actual per-URL logic: static pages resolve straight from `seo_meta`; `/divisions/:slug` and `/media-centre/news/:slug` build sensible defaults from the division/post's own data (tagline/excerpt, cover image) and let an optional `seo_meta` row (keyed `division:<slug>` / `news:<slug>`) override any field. Unrecognized paths fall back to the site default rather than erroring. Relative `/uploads/...` image paths are resolved to absolute URLs, since OG images must be absolute for link previews to work.
- `services/htmlTemplate.js` — reads the built `index.html` once (cached) and substitutes `%%SEO_*%%` tokens per request; also emits Organization JSON-LD sitewide and BreadcrumbList JSON-LD on division/news detail pages.
- `routes/sitemap.js` — `GET /sitemap.xml`, regenerated fresh on every request (no stale-cache step) from the static route list plus live divisions/published news.
- Admin `GET/PUT /api/admin/seo-meta[/:pageKey]`.
- `createApp.js` now serves the built frontend directly (`express.static(dist/)` + a catch-all that resolves SEO meta and renders the injected HTML) — the deployment-approach change noted above.

**A real bug caught by actually loading pages in a browser, not just checking API responses:** Helmet's default Content Security Policy (`img-src 'self' data:`, no `connect-src` beyond self, no `frame-src`) had been present since Phase 2 but never mattered because Vite's dev server — not Express — was the one serving HTML during Phases 3–8's testing. The moment Express started serving the actual site (this phase), that default CSP silently blocked *every* external image on the site — every division's ibb.co-hosted images, Unsplash hero backgrounds, YouTube/QR-code thumbnails, the Google Maps embed, and the world-map's CDN-hosted topojson fetch — over 4,000 console violations on a single page load. Caught it by running the real Playwright pass against the Express-served build (not the Vite dev server) and actually reading the console output rather than trusting that title/meta assertions passing meant the page was fine. Fixed by widening `img-src`/`connect-src`/`frame-src` to the specific hosts and `https:` broadly, re-ran, confirmed zero CSP violations.

**Frontend:**
- `index.html` now carries `%%SEO_TITLE%%`/`%%SEO_DESCRIPTION%%`/`%%SEO_CANONICAL%%`/`%%SEO_OG_IMAGE%%`/`%%SEO_JSONLD%%` tokens. A dev-only Vite plugin (`apply: 'serve'` — confirmed this restriction after first catching it running during `vite build` too and stripping the tokens from the production output) fills in static defaults so local `npm run dev` doesn't show literal `%%...%%` in the browser tab.
- `SEO.tsx` now manages **only** `<title>` client-side, not description/OG/Twitter meta. Reasoning: react-helmet-async has no way to know about tags the server already rendered into the initial HTML, so if it also rendered `<meta name="description">` etc., every page would ship two competing description tags. `<title>` is safe to keep client-managed since a document only ever has one.
- `src/admin/seo/AdminSeoSettings.tsx` — manages the 11 static-page `seo_meta` entries. `SeoOverrideSection.tsx` — a reusable card dropped into `AdminDivisionEdit.tsx` and `AdminNewsEdit.tsx` for per-item overrides, keyed off the *original* loaded slug (not the live-editing draft) so mid-edit slug changes don't orphan the override.
- `scripts/seed-seo-meta.ts` migrates every existing hardcoded `<SEO title=... />` value (from `seoData.ts` and each page's inline props) into `seo_meta`, so switching to the admin-editable system caused zero content regression.
- `robots.txt` now disallows `/admin/`; the static `public/sitemap.xml` placeholder is deleted (superseded by the dynamic route).

**Verified, not just written:**
- curl: home/division/static-page meta injection, a division correctly falling back to its own cover image as `og:image` when no override is set, an unknown slug falling back to the site default, admin SEO update reflecting immediately in the next page fetch, sitemap.xml content, robots.txt content.
- Full Playwright pass run **against the Express-served production build** (not the Vite dev server) — the same code path cPanel will actually run: home page load, client-side SPA navigation to a division (title updates correctly), a direct deep-link load of that same division (server-injected title matches), admin login, SEO settings list and an entry expanding with its seeded data, a division's SEO Override section pre-populated correctly, sitemap.xml and robots.txt fetched in a real browser tab. This run is what surfaced the CSP bug above.
- `tsc --noEmit` and `vite build` both clean (714.03KB); confirmed the SEO token-preservation fix by grepping the built `dist/index.html` before and after.
- Confirmed via direct DB query that nothing was left modified from the verification run; dev server stopped.

**Deliverable:** ✅ Every page has real, admin-editable, server-rendered SEO meta and a working sitemap/robots.txt/structured-data setup. (Lighthouse/Search-Console submission itself is a one-time manual step for whoever manages the live domain once it's deployed — not something to automate here.)

---

## Phase 10 — Frontend Integration Cleanup
**Status:** Done — awaiting your approval to move to Phase 11

**Goal:** Finish migrating the React app fully off static data files and fixed layouts.

**Deleted (all confirmed zero remaining references first — see the grep-driven approach below):** `src/data/{divisions,divisionImages,suppliers,seoData}.ts`, `src/components/SEO.tsx`, `src/admin/AdminPlaceholder.tsx` (already fully replaced by real screens as of Phase 9), and `scripts/migrate-divisions.ts` (a one-time script whose whole job was reading files that no longer exist — its role is now documented in `database/README.md` instead). Uninstalled `react-helmet-async` and `@emailjs/browser` was already gone since Phase 8. `src/data/` no longer exists as a directory.

**Closed a gap deliberately left open in Phase 9:** back then, the client-side `<title>` on SPA navigation was left pointing at the old hardcoded `seoData.ts` values ("crawlers never see client-side updates anyway" — true, but it meant an admin editing a title in `/admin/seo` wouldn't actually be visible to a real visitor navigating in-app, only to a fresh page load). Fixed properly this phase instead of leaving it as permanent debt:
- New public `GET /api/page-meta?path=<path>` reuses `seoResolver.resolveForPath()` — the *exact same* logic that decides server-injected meta on first load.
- `src/lib/usePageMeta.ts` + `<RouteTitleSync />` (mounted once inside `<Router>`) call it on every route change and set `document.title` directly. One source of truth for "what's this URL's title" now, not two.
- This made `react-helmet-async` fully redundant — `SEO.tsx` was its only consumer, and a `<title>` element is safe to manage with a single `useEffect` (a document only ever has one, unlike `<meta>` tags, which is why Phase 9 specifically avoided having Helmet render those). Removed the dependency and the doubled-up `HelmetProvider` that had been wrapping the app twice (once in `main.tsx`, once in `App.tsx` — harmless but redundant, cleaned up along the way).
- Removed all 12 pages' individual `<SEO title=... description=... />` calls — title is now handled globally; description/OG were already server-only since Phase 9.

**A pre-existing latent bug removed along the way, not just papered over:** `Divisions.tsx`'s per-division detail page did `seoData.divisions[data.slug]` and then read `.title` off the result with no null check — any division added through the admin panel (Phase 4 made that possible) wouldn't have a matching hardcoded `seoData` entry, so that lookup would return `undefined` and `.title` would throw, crashing the page. Deleting the hardcoded lookup entirely (in favor of the server-resolved title) removes the bug as a side effect rather than requiring a separate fix.

**Basic caching (`src/lib/api.ts`):** added an in-memory `Map` cache for `GET` requests only, deliberately excluding `/api/admin/*` (an admin who just saved an edit needs to see it immediately, not a 30-second-stale list). This solves two real things at once: concurrent identical requests (e.g. Home's `AboutSnapshotSection` and `WhyChooseUsSection` both calling `useSiteSettings()` on the same render, noted but not fixed back in Phase 7) now share one in-flight promise instead of firing duplicate HTTP calls, and repeated navigation within a 30s window reuses the cached result. No new dependency (no React Query) — kept in line with the project's existing minimal-dependency approach. Trade-off noted: a visitor already browsing could see public data up to 30s stale after an admin edit elsewhere; acceptable for a low-traffic corporate site and explicitly not attempted for admin routes.

**"Environment-based API base URL" — reassessed, not implemented:** the task as originally written predates Phase 0/9's same-origin architecture. Every `apiFetch` call already uses relative `/api/...` paths, which work correctly in dev (via Vite's proxy) and production (the Node app serves everything, Phase 9) without any base URL to configure. Adding one now would work against that deliberate design rather than complete it, so this task is satisfied by not doing it — documented in `api.ts`'s own comment rather than left silently unaddressed.

**Verified, not just written:**
- `grep`-verified zero remaining references before deleting each file (not just "I think nothing uses this anymore").
- `tsc --noEmit` — **fully clean, zero errors**, for the first time in this project's phases (previously always had one pre-existing unrelated error from the now-deleted `divisions.ts`).
- `vite build` clean; bundle dropped from 714.03KB to 692.67KB (~21KB, matching the `react-helmet-async` + dead-data-file removal).
- Full Playwright pass over all 11 public routes plus admin login, run against the Express-served production build: confirmed every page still renders and shows its correct, distinct, DB-sourced title (including three of my own test-script assertions that were wrong, not app bugs — generic text like "CEO"/"News"/"Vision" matched *hidden* nav dropdown items and timed out waiting for visibility; fixed by asserting on more specific page text and re-verifying each one individually). Explicitly confirmed client-side SPA navigation updates `document.title` via `waitForFunction`, not just eyeballing it.
- Confirmed the pre-existing `divisions.ts` type error is gone rather than just silent.

**Deliverable:** ✅ No content is hardcoded in the frontend build; `tsc` and the bundle are both clean; the SEO title-consistency gap flagged in Phase 9 is closed.

---

## Phase 11 — Security & Performance Hardening
**Status:** Done

**Goal:** Production-harden before go-live.

**Tasks:**
- Audit all API endpoints for SQL injection, XSS, file-upload abuse, auth bypass.
- Rate limiting on public form endpoints (spam/abuse protection).
- HTTPS enforcement, secure cookies/session config (`secure`, `httpOnly`, `sameSite`).
- Image optimization/compression pipeline for uploads.
- Caching headers for static assets; basic query caching where useful.
- Process resilience under Passenger (auto-restart on crash), and an automated MySQL backup strategy on cPanel (cron + `mysqldump`).

**What was built:**

- **Full checklist and rationale:** `server/SECURITY.md` — every item below is recorded there with its verification method; this section is the narrative version.

**Two real vulnerabilities found and fixed during the audit** (not just a pass/fail checklist — actual bugs caught by adversarial testing):

1. **File-upload extension confusion.** `imageUpload.js`/`documentUpload.js` validated only `file.mimetype` (client-claimed, from the multipart `Content-Type` header) but saved the file using `path.extname(file.originalname)` (fully client-controlled). A file named `shell.php` with a spoofed `Content-Type: image/jpeg` would pass the mimetype check and land on disk as `<random>.php` — a real RCE path if that directory were ever reachable by a PHP-enabled webserver ahead of Node. Fixed by replacing the extension source with a fixed `MIME_TO_EXT` lookup keyed off the *validated* mimetype, so the saved extension is always one of a small code-controlled set, never client input. Added `server/uploads/.htaccess` as defense-in-depth (disables script execution) in case Apache ever serves that directory directly.
2. **Unescaped JSON-LD (stored XSS via admin content).** `htmlTemplate.js` built `<script type="application/ld+json">` blocks with `JSON.stringify()`, which does not escape `<`. A division name or news title (admin-editable, flows into `breadcrumbJsonLd()`) containing `</script><script>...` would close the tag early and inject live script into every visitor's page — not just the admin's own session. Fixed by escaping `<` to `<` in the JSON-LD payload before embedding (valid JSON, breaks the HTML tag-close sequence). The Phase 9 `escapeHtml()` calls on title/description/canonical/og:image were unaffected and re-confirmed correct.

**Also implemented:**
- **Image optimization** — new `optimizeImage()` in `imageUpload.js` using `jimp` (pure-JS, no native bindings — same shared-hosting-portability reasoning as `bcryptjs` over `bcrypt` in Phase 3). Resizes to max 1920px width, re-compresses JPEGs at quality 82, skips GIFs (Jimp doesn't reliably round-trip animated ones), best-effort (a corrupt/unsupported file is left untouched rather than failing the admin's save). Wired into all 6 image-upload endpoints: divisions (cover + gallery), news cover, photo gallery, suppliers, video gallery thumbnail, homepage/site-settings generic upload.
- **General API rate limiting** — `apiLimiter` (300 req/min per client across all `/api/*`) added as a defense-in-depth backstop behind the existing narrower `loginLimiter` and `formSubmitLimiter`.
- **HTTPS enforcement** — production-only redirect middleware using `req.secure` (works correctly behind `trust proxy` since cPanel terminates TLS at Apache/LiteSpeed in front of the Node app); inactive in dev so local HTTP still works. Helmet's default HSTS header was already active.
- **Cache headers** — `/uploads/*` and `dist/assets/*` (both have immutable, content-derived/randomized filenames) get a 1-year immutable cache; other `dist/` files get 1 hour; the SPA-fallback HTML (server-injects per-route SEO meta, must never be stale) gets `Cache-Control: no-store`.
- **Automated MySQL backups** — `scripts/backupDatabase.js` (`mysqldump` piped through gzip, timestamped, retention pruning, default keep 14) and `scripts/restoreDatabase.js`, both plain Node scripts (no shell script needed) meant to run via a daily cPanel cron job. Matches the `scripts/createAdmin.js` style already in the repo.
- **Process resilience** — deliberately *not* extra application code: cPanel's "Setup Node.js App" runs the app under Phusion Passenger, which already guarantees process respawn on crash. Documented as a reasoned no-op rather than left silently unaddressed.

**Audited and confirmed already correct (no changes needed):**
- SQL injection — grep-audited every query across `services/*.js` and `routes/**/*.js`; 100% named placeholders. The two places with conditionally-built SQL (`slugExists()`, `getDivision()`'s dynamic WHERE) only vary fixed SQL structure by code logic, never interpolate user input.
- Auth bypass — all 10 admin route mounts in `routes/index.js` have `requireAuth` at the `router.use()` level; no gaps.
- CSRF, session/cookie config, CSP — all already correct from Phases 3 and 9; re-verified, not re-implemented.

**Verified, not just written:**
- `node -c` syntax-checked every modified file.
- Live end-to-end test of the extension-confusion fix: uploaded a file named `notreal.php` with a spoofed `image/jpeg` Content-Type through the real running server — saved as `.jpg`, confirmed via directory listing that zero `.php` files exist anywhere under `uploads/`. A genuinely non-image file with an honest mimetype was correctly rejected. Repeated for the public, unauthenticated `career.js` CV-upload path (uses `documentUpload.js`, the sibling fix) — same result.
- Live end-to-end test of the JSON-LD XSS fix: set a real division's name to `XSSTEST</script><script>alert(1)</script>` in the dev DB, requested its page from the running server, and confirmed the served HTML shows `</script><script>` (inert) rather than a literal closing tag — then restored the original name.
- Live image-optimization test: generated a 3000×2000 (164KB) JPEG, uploaded it through the real `upload-image` endpoint, and confirmed the file saved to disk was resized to 1920×1280 and compressed to ~68KB.
- Cache headers confirmed via `curl -I` against the running server: fingerprinted assets get `max-age=31536000, immutable`; the SPA-fallback HTML gets `no-store`.
- Rate limiter confirmed active via response headers (`RateLimit-Limit`, `RateLimit-Remaining`) on a real request.
- HTTPS-redirect middleware confirmed inert in dev (`NODE_ENV` not `production`) so local testing wasn't broken.
- Backup/restore round-trip verified for real: ran `scripts/backupDatabase.js` against the live dev database, restored the resulting `.sql.gz` into a throwaway database (`zexora_cms_restoretest`), confirmed row counts matched the source (6 divisions), then dropped the throwaway database and deleted the local backup artifact.
- Full login → authenticated upload flow re-tested after all middleware changes (rate limiter, cache headers, HTTPS-redirect) landed, to confirm nothing broke the legitimate path.

**Scope note:** the local dev admin account's password was temporarily reset to a known test value during this phase's live-upload testing (no way to test authenticated upload endpoints otherwise without the original password, which wasn't recorded anywhere). This only affects the local development database, not production.

**Deliverable:** ✅ Security checklist signed off (`server/SECURITY.md`), including two real vulnerabilities found and fixed, not just a pass/fail pass. Backups verified restorable via an actual restore-and-compare, not just "the script ran without error."

---

## Phase 12 — QA & Testing
**Status:** Done

**Goal:** Verify everything works end-to-end before deployment.

**Tasks:**
- Cross-browser and mobile responsiveness pass.
- Full admin CRUD testing for every module, including Section Manager (visibility/order/variant changes).
- Contact/career form submission testing (including file upload edge cases).
- SEO validation (structured data testing tool, sitemap validity, verifying crawlers see rendered content).
- Broken link / 404 check across all routes.

**What was built:**

- **Full checklist and rationale:** `QA_SIGNOFF.md` (repo root) — every item below is recorded there with its verification method; this section is the narrative version.
- Installed Firefox and WebKit for Playwright (only Chromium was cached from earlier phases) for genuine 3-engine cross-browser coverage, not just Chromium-only testing.

**Four real bugs found and fixed** (via actual cross-browser/adversarial testing, not just a pass/fail checklist):

1. **`AuthProvider` wrapped the entire app**, not just `/admin/*`. Every public pageview from an anonymous visitor fired an `/api/auth/me` check that predictably 401s — wasted DB session-store lookup and a console error on every single page load, site-wide, for every visitor who never intended to log in. Found via the cross-browser console-error sweep. Fixed by restructuring `App.tsx` so `AuthProvider` only wraps the admin route subtree (React Router layout-route pattern: `<Route element={<AuthProvider><Outlet/></AuthProvider>}>` wrapping `admin/login` + the `admin` tree).
2. **Helmet sent `Strict-Transport-Security` unconditionally**, regardless of `NODE_ENV`. Browsers are supposed to ignore HSTS received over plain HTTP (RFC 6797) since it's meaningless before there's actually HTTPS to enforce, but not every engine honors that correctly — traced WebKit's "SSL connect error" on every route back to this (confirmed via a from-scratch temp browser profile that it's now a Windows OS-level HSTS cache artifact from my own earlier testing, not a live defect - real users on a real HTTPS production domain would never hit this). Fixed by gating `hsts: config.isProduction` in the Helmet config (`server/src/createApp.js`).
3. **No catch-all route existed in React Router at all.** Any mistyped, old, or crawler-guessed URL rendered a completely blank white page — no header, no footer, no message, nothing rendered. Found by deliberately requesting a nonexistent path as part of the broken-link check calibration. Added a real `NotFound` page (`src/pages/NotFound.tsx`) as the `*` fallback, and taught the server to answer with an actual `404` status for genuinely unmatched paths instead of always `200` (`seoResolver.resolveForPath` now returns a `notFound` flag computed from the same route-matching logic it already had; `createApp.js`'s SPA-fallback handler applies it).
   - **Self-caught regression**: the first cut of that 404 logic didn't know about `/admin/*` (outside `seoResolver`'s public-route knowledge), so every working admin page started answering `404` even though it rendered and functioned correctly - caught immediately by re-running the admin CRUD regression suite after the change, which still passed 16/16 on content/behavior but the console showed a new wave of 404s. Fixed by scoping the 404 status to non-admin paths only.
4. **Two dead footer links**: `/privacy-policy` and `/terms-of-service` had no matching route (hit the blank-page bug above). Found via the broken-link crawler. Real legal copy isn't something to fabricate on a live business site, so these now serve an honest "this page is being finalized" placeholder (`src/pages/LegalPlaceholder.tsx`) rather than either a dead link or invented legal text - flagged explicitly in `QA_SIGNOFF.md`'s Content Notes for the client to supply real copy before launch.

**Also found, investigated, and fixed at the CSS level (not a component bug):** horizontal scroll on mobile/tablet for several pages, traced to two causes that were both invisible-by-design but still expanded the page's real scrollable width: the `FadeIn` scroll-reveal animation's pre-trigger `translateX(40px)` offset, and the homepage supplier-logo marquee being deliberately wider than the viewport. Fixed with `overflow-x: hidden` on both `html` and `body` in `src/index.css` (had to be on both - `body`-only didn't actually constrain `document.documentElement.scrollWidth`, verified by measuring before/after).

**Verified, not just written — every fix was re-tested against the live server after applying it:**
- Rebuilt (`vite build`) and re-ran the full cross-browser/responsive suite after each fix, not just once at the end - caught the admin-404 regression this way.
- `tsc --noEmit` clean after every frontend change.
- 19 public routes × 3 browsers (desktop) + 19 routes × 2 more viewports (mobile/tablet, Chromium) = 475 individual checks; final run: 456 passed, the remaining 19 all the same confirmed-non-issue (WebKit HSTS-cache artifact, one console-error check per route).
- Admin CRUD: 16/16 real-UI checks (login, all 6 content modules, Section Manager's 3 distinct behaviors, logout) - re-run twice more after the App.tsx/createApp.js changes to confirm no regressions, all data reverted/deleted and DB confirmed clean each time.
- Forms: contact happy-path + invalid-email rejection; career happy-path with a real PDF through the actual file picker; career file-type rejection verified as a real server-side boundary (ran the malicious-mimetype request through the browser's own cookie/CSRF context, not a bare unauthenticated fetch, so the check actually exercised `documentUpload.js`'s allowlist rather than just getting stopped by CSRF first).
- SEO: 146/146 checks (sitemap XML validity + completeness, robots.txt, per-route title/description uniqueness, canonical correctness, JSON-LD parseability) - including re-confirming the Phase 11 JSON-LD XSS escaping still holds.
- Broken links: 27/27 - crawled real `<a href>`s from all 19 pages rather than guessing a link list, then fixed the two real dead links found and re-crawled clean.
- All QA-created test data (news posts, video gallery entries, contact messages, career applications + their uploaded CV files, division edits, section-manager changes) explicitly deleted/reverted; confirmed via direct DB queries that every table was back to its pre-Phase-12 row count before sign-off.

**Scope note:** the local dev admin password was reset again this phase (via `scripts/createAdmin.js`, not raw SQL) to run the authenticated admin-UI tests - local dev database only, not production.

**Deliverable:** ✅ QA sign-off checklist complete (`QA_SIGNOFF.md`), including 4 real bugs found and fixed (not just a pass/fail pass) and 3 content gaps clearly flagged for the client rather than silently papered over.

---

## Phase 13 — Global Website Settings
**Status:** Done

**Goal:** Move site-wide content (contact info, logo, social links, and similar global config) out of hardcoded component source and into a single admin-managed settings panel — currently `Header.tsx`/`Footer.tsx`/`Contact.tsx` hardcode the email, phone, address, and social links, and the logo is a static file in `public/` with no admin upload path.

**Tasks:**
- Extend `site_settings` (or a new dedicated table, decided during implementation) to cover: company name, email, phone, address, social links (Facebook/Instagram/LinkedIn/YouTube), and site logo.
- Admin UI: a "Website Settings" page (new sidebar entry) to edit all of the above, including logo upload (reusing the Phase 11 image-optimization pipeline).
- Refactor `Header.tsx`, `Footer.tsx`, and `Contact.tsx` to read these values from the API instead of hardcoded strings/JSX.
- SEO/JSON-LD (`Organization` schema in `htmlTemplate.js`) should also pull from these settings rather than its own hardcoded copy, so the two never drift apart.

**What was built:**

- **No new backend routes at all** — the existing generic `site_settings` machinery from Phase 6 (`siteSettingsService.set(key, value)`, the admin `PUT /api/admin/site-settings/:key` endpoint, and the generic `upload-image` endpoint) already handled an arbitrary new key and a logo upload without any code changes. Just added a new key: `global.siteInfo`.
- `global.siteInfo` covers: logo, company name, tagline, email, phone, WhatsApp number, address, business hours, Google Maps embed URL, and 4 social links — a full inventory of everything that was hardcoded across `Header.tsx`, `Footer.tsx`, and `Contact.tsx`.
- New admin page `src/admin/settings/AdminWebsiteSettings.tsx` (sidebar entry: "Website Settings", placed second, right under Dashboard) — same save-per-section pattern as `AdminHomepage.tsx`, logo upload reuses the Phase 11 image-optimization pipeline.
- `src/lib/useSiteSettings.ts` gained a `useSiteInfo()` convenience hook (and an exported `DEFAULT_SITE_INFO` matching the seed data) so `Header`/`Footer`/`Contact` don't each need their own null-handling/merge logic — one shared source of defaults instead of three copies drifting apart.
- `Header.tsx` (logo), `Footer.tsx` (logo, tagline, social links, email, phone, address), and `Contact.tsx` (email, phone, address, business hours, Google Maps embed URL) all refactored to read from `useSiteInfo()` instead of hardcoded JSX/strings.
- **WhatsApp QR code is now generated live** from the settings-driven WhatsApp number (via the same `api.qrserver.com` service the old `onError` fallback already used), instead of a static pre-generated file — so changing the number in Website Settings immediately produces a correct QR code with no regeneration step. The static `public/whatsapp-qr.png` (from the earlier content-gap fix) is kept only as an `onError` fallback if the QR-generation service itself is ever unreachable.
- Server-side JSON-LD `Organization` schema (`htmlTemplate.js`) now takes an optional `siteInfo` argument and pulls company name/logo/social links from it, with the original hardcoded values kept as its own fallback defaults (so it still works correctly even before `global.siteInfo` exists). `seoResolver.js` fetches `global.siteInfo` once per request and merges it into every `resolveForPath()` result via a wrapper (`resolveForPath` → `resolveCore` + merge), rather than threading it through all 5 of `resolveCore`'s individual return sites.
- `server/scripts/seedSiteInfo.js` — one-time seed script (matches the `migrateExternalImages.js`/`createAdmin.js` precedent) that populates `global.siteInfo` with the exact values that were previously hardcoded, so switching the components to read from the API didn't change anything visually until the admin actually edits something.

**Verified, not just written:**
- `tsc --noEmit` clean after every change.
- Ran the seed script, then confirmed via `curl` that the server-rendered JSON-LD `Organization` block on `/` now reflects the seeded settings (not the old hardcoded literals).
- Full Playwright pass confirming Header logo, Footer email/phone/address, the live WhatsApp QR code's encoded URL, and the Contact page's email/map all correctly reflect `global.siteInfo` — zero console errors.
- **Live edit-to-publish round-trip test**: logged into the real admin UI, changed the tagline, saved, reloaded the admin page to confirm persistence, then loaded the actual public homepage and confirmed the new tagline appeared in the footer immediately — not just that the save API call succeeded.
- **Logo upload round-trip test**: uploaded a real test image through the admin UI's file picker, confirmed the returned `/uploads/homepage/...` path updated the preview, saved, and confirmed the new logo rendered on the public homepage's header — then reverted and deleted the test upload file.
- Re-ran the full Phase 12 admin-CRUD regression suite (16/16) and the cross-browser/responsive public-route smoke suite after this phase's changes, since `Header`/`Footer` render on every single public page — any regression here would have shown up everywhere, not just on one page.
- All test edits (tagline, logo) explicitly reverted; confirmed via direct DB query that `global.siteInfo` was back to its seeded values before sign-off.

**Deliverable:** ✅ Every piece of site-wide contact/brand info is editable from one admin screen (`/admin/settings`); zero hardcoded contact info or logo path left in `Header.tsx`/`Footer.tsx`/`Contact.tsx` source, and the server-rendered SEO schema stays in sync automatically.

---

## Phase 14 — Dynamic Static Pages
**Status:** Done

**Goal:** Bring About, CEO Message, Vision & Mission, and Global Sourcing under CMS control — these four pages are currently 100% hardcoded (confirmed zero `apiFetch`/data-hook usage), unlike Home/Divisions/News which are already fully dynamic.

**Tasks:**
- Design a content schema per page (likely a flexible JSON-per-section model, similar to `page_sections.config`, rather than one bespoke table per page — decided during implementation based on how varied each page's layout actually is).
- Admin UI to edit each page's content.
- Refactor the four public page components to render from fetched data instead of hardcoded JSX/text.
- SEO meta for these pages (already server-resolved via `seoResolver.js`'s `STATIC_PAGE_KEYS`) continues to work unchanged.

**What was built:**

- **Content schema decision**: one JSON blob per page in `site_settings` (`page.about`, `page.ceoMessage`, `page.visionMission`, `page.globalSourcing`), matching the existing `home.*` key convention exactly rather than inventing a new mechanism — no new tables, no new backend routes (same generic `site_settings` machinery Phase 13 also relied on).
- **Deliberate scope line, matching the Phase 7 precedent** (Section Manager scoped to visibility/order, not a full page builder): every heading, paragraph, and list item's *text* is admin-editable, including full add/remove control over repeating lists (division items, core values, industries, countries, business models, etc.). Page *layout and decorative structure* (which section appears where, gradient/card treatment, the CEO page's alternating timeline-dot colors, the emphasis-box/pull-quote placement) stays in code. This was a conscious call, not a limitation discovered late — making every layout choice admin-configurable for four bespoke, differently-structured pages would be page-builder-scope work, not "make the content editable" scope.
- **Icon selection reuses the existing Divisions precedent** (`src/lib/icons.ts`'s small, explicitly-imported `ICON_MAP` — chosen in Phase 4 specifically to avoid a ~700KB bundle bloat from lucide-react's full icon registry) rather than introducing a new, less safe mechanism. Extended it with the ~18 new icons these four pages actually use (Beaker, Globe, Truck, Plane, Target, ShieldCheck, Heart, TrendingUp, Award, Package, Pill, Layers, PaintRoller, Droplet, Factory, Ship, Handshake, Box) and exported `ICON_NAMES` for the new admin `<select>` icon pickers.
- Four new admin pages under `/admin/pages/*` (About, CEO Message, Vision & Mission, Global Sourcing), grouped behind a hub page (`AdminPagesHub.tsx`) matching the existing `AdminMediaHub.tsx` pattern, plus one new sidebar entry ("Static Pages") rather than four separate top-level nav items.
- Four reusable editor sub-components (`src/admin/pages/editors.tsx`: `ParagraphListEditor`, `IconItemsEditor`, `TitledIconItemsEditor`, `TitledItemsEditor`) shared across all four admin pages' repeating-list fields, plus reuse of the existing `StringListEditor` from the Divisions admin — avoided writing the same add/remove/edit list logic four-to-six times over.
- `server/scripts/seedStaticPages.js` — one-time seed capturing the exact current hardcoded content for all four pages (same pattern as `seedSiteInfo.js`/`migrateExternalImages.js`), so switching the public pages to read from the API changed nothing visually until an admin edits something.
- All four public page components (`About.tsx`, `CeoMessage.tsx`, `VisionMission.tsx`, `GlobalSourcing.tsx`) refactored to render from `useSiteSettings()` with an inline default matching the seed data (same established pattern as `WhyChooseUsSection.tsx`), so a missing/not-yet-saved settings key never breaks the page.

**Verified, not just written:**
- `tsc --noEmit` clean after every change.
- Ran the seed script, rebuilt, and did a full visual diff pass (Playwright screenshots) of all four refactored pages against the original design — caught and correctly diagnosed a false alarm: `fullPage` screenshots taken without first scrolling left several `FadeIn` (scroll-triggered, `IntersectionObserver`-based) sections showing as blank, even though the text was genuinely present in the DOM (confirmed via `innerText` extraction and zero console/page errors). Re-captured with an explicit scroll-through step first, which confirmed every section, icon, and list item renders identically to the original hardcoded version.
- Live edit-to-publish round trip on the About page: logged into the real admin UI, changed the hero title, saved, confirmed persistence via reload, then confirmed the new title appeared on the live public page - then reverted.
- Spot-tested the reusable list editors' add/remove interactions directly (not just that the save button works): added and removed a division item, added a paragraph - confirmed the DOM count changes correctly, and confirmed via direct DB query that unsaved test interactions never touched the database.
- Re-ran the full Phase 12 admin-CRUD regression suite (16/16) and the cross-browser/responsive public-route smoke suite (same pass rate as Phase 13, modulo the already-documented WebKit/Windows HSTS-cache artifact) after adding 4 new admin routes and a new sidebar entry, since routing/layout changes here risk every admin page, not just the new ones.
- All test edits reverted or deleted; confirmed via direct DB query that every `page.*` settings key was back to its seeded values before sign-off.

**Deliverable:** ✅ All four pages (About, CEO Message, Vision & Mission, Global Sourcing) are fully editable from the admin panel — every heading, paragraph, and list item, with full add/remove control — with no code deploy required for a content change. SEO meta for these routes was unaffected (still resolved via `seoResolver.js`'s existing `STATIC_PAGE_KEYS`, untouched by this phase).

---

## Phase 15 — Admin Dashboard Redesign
**Status:** Done

**Goal:** Replace the current placeholder dashboard (a static welcome message, no real data) with a genuinely useful overview screen.

**Tasks:**
- Real widgets: content counts (divisions, news posts, gallery items), recent contact messages/career applications, recently edited content.
- Quick-links to the most-used admin sections.
- Visual polish matching the rest of the admin panel's design language.

**What was built:**

- **New backend, unlike Phases 13/14**: this is the one recent phase where the generic `site_settings` machinery genuinely didn't fit — a dashboard needs cross-table aggregates (counts, "most recently updated N"), not a single JSON blob. Added `server/src/services/dashboard.js` (`getSummary()`) and `GET /api/admin/dashboard`, using `COUNT(*)`/`SUM(status = ...)` queries run in parallel via `Promise.all`, not fetching full row sets just to read `.length` — deliberately avoided the shortcut of reusing the existing list endpoints for this.
- Response shape: `counts` (divisions, news posts split published/draft, photo/video gallery, suppliers, contact messages split total/unread, career applications split total/new) plus `recent` (last 5 each of contact messages, career applications, news posts, divisions - each ordered by the most relevant timestamp, `updated_at` for content that gets edited, `created_at` for inbound submissions).
- Rebuilt `AdminDashboard.tsx`: 7 clickable stat cards (each linking straight to its admin section) with warn-colored badges for anything needing attention (unread messages, new applications, draft posts); a Quick Links row to the 4 least-discoverable admin sections (Website Settings, Static Pages, Page Sections, SEO - the ones without their own obvious top-level content, unlike Divisions/News/etc. which are already one click away in the sidebar); four "recent activity" panels, each row itself a link to that item's edit page, with relative timestamps ("3h ago") and status pills matching each section's own color convention (green/gray for published/draft, amber for unread/new).

**Verified, not just written:**
- `tsc --noEmit` clean.
- Tested the dashboard in both states that matter: with the database mostly empty (confirmed every "recent activity" panel shows a correct, non-broken empty state - "No messages yet." etc. - rather than an empty list with no explanation) and with real data (inserted one temporary test row into `contact_messages`, `career_applications`, and `news_posts`, confirmed all three badges and status pills render correctly, then deleted them).
- Clicked through from the dashboard itself: a news-post row navigated to that post's real edit page, a division row navigated to that division's real edit page, and a "View all" link navigated to the right list page - confirmed via the resulting URL each time, not just that the link element existed.
- Re-ran the full Phase 12 admin-CRUD regression suite (16/16, including the login → dashboard-renders flow specifically) and the cross-browser/responsive public-route smoke suite - this phase only touches the admin panel, so the public-site suite's unchanged pass rate confirms zero cross-contamination.
- All temporary test data deleted after verification; confirmed via direct DB query.

**Incidental find while re-running the smoke suite**: Firefox flagged the CEO Message page's photo (`Image corrupt or truncated`) - it was still hot-linked to `i.ibb.co.com`, the same free host flagged in Phase 12's QA_SIGNOFF and largely migrated in Phase 13. It had slipped through that migration because `page.ceoMessage.photo` didn't exist as a field until Phase 14, which ran after Phase 13's one-time migration script. Extended `server/scripts/migrateExternalImages.js` with a `migrateCeoPhoto()` step (idempotent, same pattern as the rest of the script) rather than a one-off fix, so the tool stays the single source of truth for "is anything still hot-linked to ibb.co" - ran it, confirmed the photo is now served from local `/uploads`, and re-ran the full cross-browser suite clean.

**Deliverable:** ✅ The dashboard now shows real content counts, flags what needs attention (unread messages, new applications, drafts), links straight into the sections an admin actually uses, and surfaces recent activity with working click-through - not just a greeting.

---

## Phase 16 — Extended Section Manager
**Status:** Done

**Goal:** Extend the Phase 7 Section Manager pattern (currently Home-page-only, by deliberate original scope decision) to the pages made dynamic in Phase 14.

**Tasks:**
- Extend `page_sections` usage (or its Phase 14 equivalent) to cover visibility/order/variant control for About, CEO Message, Vision & Mission, and Global Sourcing.
- Admin UI: extend the existing Section Manager screen to let the admin pick which page they're managing, rather than being hardcoded to `home`.

**What was built:**

- **Zero backend changes** — unlike Phase 15, this is back to the Phase 13/14 pattern of the existing architecture already fitting. `page_sections` (`page_key` + `section_key`, unique together) and both the public (`GET /pages/:pageKey/sections`) and admin (`GET`/`PUT /admin/pages/:pageKey/sections`) routes were *already* fully generic, taking `pageKey` as a route param rather than being hardcoded to `home` — confirmed by reading the actual route/service code before writing anything, rather than assuming a rewrite was needed.
- **The real work was frontend**, and it's the one genuinely large piece of this phase: Phase 14's four pages were each written as a single monolithic component reading one JSON blob (the right call for "make the content editable," per that phase's own scope note) - but Section Manager's visibility/reorder/variant control operates at the *section* level, which requires the Home-page architecture instead: one small component per section, registered in a `SECTION_REGISTRY` map, rendered in a loop driven by `usePageSections(pageKey)`. Retrofitted all four pages into that pattern:
  - **About** → 6 sections (hero, who-we-are, divisions-grid, competitive-advantage, our-vision, cta)
  - **CEO Message** → 3 sections (hero, message [photo + timeline together, since the sticky two-column layout doesn't split further without breaking the design], cta - reusing the existing shared `CTABanner` component directly as a section)
  - **Vision & Mission** → 5 sections (hero, vision-mission-text, core-values, why-choose-us, industries)
  - **Global Sourcing** → 5 sections (hero, intro-map, countries, business-models, commitment-cta)
  - Each page's Phase 14 content hook (`useAboutContent()` etc.) and its `DEFAULT_CONTENT` fallback moved into a shared file per page (`src/components/{page}-sections/use{Page}Content.ts`) so the new small section components don't each need their own copy of the (large) default object.
- **Admin UI**: `AdminPageSections.tsx` gained a page-picker (5 tabs: Home, About, CEO Message, Vision & Mission, Global Sourcing) replacing the hardcoded `PAGE_KEY = 'home'` constant; switching tabs re-fetches that page's sections. `SECTION_LABELS` stayed a single flat map rather than becoming page-scoped - several pages share a `section_key` name (every page has a `hero`; Home and Vision & Mission both have `why-choose-us`/`industries`), and the same label reads correctly on all of them, so a shared map was the simpler, equally-correct choice over a nested per-page structure.
- **Scope line, matching the Phase 7 original decision** (Home: 3 of 10 sections got genuine 2-variant layouts, the rest visibility/reorder only): none of the four newly-dynamic pages got new layout variants invented for them - `layoutVariant` stays `'default'` for all of their sections. Inventing genuine alternate layouts for sections that never had one wasn't asked for and would be new design work, not "extend the section manager."
- `server/scripts/seedPageSections.js` — one-time seed registering each page's section list in `page_sections` (mirroring each page's `SECTION_REGISTRY` order exactly), so Section Manager had rows to manage from the start rather than an empty screen.

**Verified, not just written:**
- `tsc --noEmit` clean after every page's split (checked incrementally, one page at a time, rather than writing all four and debugging together).
- Full visual diff (Playwright screenshots, scrolled-through to trigger `FadeIn` correctly per the Phase 14 lesson) of all four newly-section-based pages against their pre-split appearance - pixel-identical, zero console errors.
- Live functional test of the actual admin-facing behavior, not just that the page loads: switched between all 5 page tabs and confirmed each one's real section count and labels; hid a real section (About's "Who We Are") through the actual UI, saved, and confirmed it was genuinely gone from the live public page (not just toggled in local state) - then restored it and confirmed it came back; reordered a real section (Global Sourcing's Intro & Map above Hero), saved, reloaded the admin page to confirm the new order persisted server-side, then reverted.
- Re-ran the Phase 12 admin-CRUD regression suite (16/16, including the pre-existing Home Section Manager check) and the full cross-browser/responsive public-route smoke suite - unchanged pass rate confirms the four-page architecture retrofit didn't regress anything on the pages that weren't touched.
- All test edits reverted; confirmed via direct DB query that `page_sections` rows for both `about` and `global-sourcing` were back to their seeded visibility/order.

**Deliverable:** ✅ Section-level visibility, reorder, and (where applicable) variant control is available on Home, About, CEO Message, Vision & Mission, and Global Sourcing - the same admin screen, picked by page, with zero backend changes required because the underlying data model was already page-agnostic.

---

## Phase 16.5 — Email Notifications & Website Settings Enhancements
**Status:** Done

**Goal:** Client-requested follow-up (outside the original numbered plan, added between Phase 16 and Phase 17): contact/career form submissions should email directly, in a proper branded HTML format, configured via `.env` so both forms use it consistently; Website Settings was missing favicon, OG (social-share) image, and a way to use a custom WhatsApp QR code instead of only the auto-generated one.

**What was built:**

- **Email was already wired up, just plain-text** — `server/src/services/mail.js` (`sendMail()`, `nodemailer`) and both `contact.js`/`career.js` calling it already existed from Phase 8, configured entirely via `.env` (`SMTP_HOST`/`SMTP_PORT`/`SMTP_USER`/`SMTP_PASSWORD`/`MAIL_FROM`/`MAIL_TO`, all already documented in `.env.example`). What was missing was the "shundor" (nice) part: the emails were plain text only.
- New `server/src/services/emailTemplates.js` (`renderNotificationEmail()`) — a branded, table-based HTML email layout (inline styles throughout, no `<style>` blocks or flexbox/grid, since Outlook and other clients don't render those reliably): dark header bar with the site's own logo (pulled live from `global.siteInfo`, so it updates automatically if the admin changes the logo), a heading + intro line, a clean labeled-field table, an optional CTA button, and a footer line. Supports multiline values (a message or cover letter, rendered with real line breaks) and link values (used for the CV download link).
- `mail.js`'s `sendMail()` now accepts an optional `html` alongside `text` — `text` is always still sent too, as the plain-text fallback every real email client honors when HTML can't render. Both `contact.js` and `career.js` now build this HTML version and pass it through; the career email includes a direct "Download attached CV" link (absolute URL, since email clients can't resolve relative paths) and both include a "View in Admin Panel" button linking straight to the right admin list page.
- **Website Settings** (`SiteInfo` type, admin UI, `Header`/`Footer`/`htmlTemplate.js`/`seoResolver.js`) gained three fields:
  - **Favicon** — was a static `/favicon.png` with zero admin control. Added a `%%SEO_FAVICON%%` token (`index.html`, `htmlTemplate.js`, and the Vite dev-mode placeholder plugin, matching exactly how `%%SEO_OG_IMAGE%%` already worked) so the browser-tab icon is now admin-uploadable and served per-request from `global.siteInfo`.
  - **OG (social-share) image** — previously every page without its own SEO override fell back to the *logo* as its share-preview image (a decent-enough default, but logos and OG images have different ideal aspect ratios and purposes). Added a dedicated `ogImage` field; `seoResolver.js`'s fallback chain is now page's-own-image → site-wide `ogImage` → hardcoded logo, so the site-wide default is now something the admin actually controls without it colliding with the logo setting.
  - **Custom WhatsApp QR** — the footer's QR code (added in Phase 13, made "live" from the WhatsApp number in Phase 15) is still auto-generated by default, but `whatsappQrImage` lets the admin upload a specific branded QR image to use instead, with a "Use auto-generated" button to clear it back to the default behavior.
- One-time DB migration (`server/scripts/migrateSiteInfoFields.js`) adds these three fields to an *existing* `global.siteInfo` row without touching anything already customized — deliberately not just re-running `seedSiteInfo.js` (which is a full reset-to-defaults tool), since that would have silently discarded any real settings the admin had already saved.

**Verified, not just written:**
- `tsc --noEmit` clean; both backend template/service files syntax-checked.
- **Real end-to-end SMTP send test**, not just HTML-string inspection: generated a temporary Ethereal test-SMTP account, pointed a throwaway script directly at `emailTemplates.js` + a real transporter, sent both a contact-message and a career-application test email, and visually reviewed the actual rendered result via Ethereal's message viewer (branded header, clean field table, working CTA button, working CV download link) - then confirmed the *underlying HTML source* independently, since Ethereal's own preview viewer turned out to apply its own default text color that isn't present in the actual email HTML sent.
- **Real integration test through the live API**, not just the template function: temporarily set real (test) SMTP credentials in `.env`, restarted the server, and submitted both the contact form and the career form (with a real file upload) through the actual running endpoints - confirmed both sent successfully with no errors logged, then reverted `.env` to its original state and deleted the test DB rows/uploaded file.
- **Confirmed graceful degradation still works** with `.env` back to no SMTP configured: submitted a contact form again and confirmed it still succeeds (201, DB row created) with only the pre-existing "SMTP not configured - skipping" warning logged, not an error - the existing Phase 8 design (form submission always succeeds regardless of email delivery) wasn't broken by this change.
- Favicon/OG-image/QR upload all tested live through the real admin UI: uploaded a real test image for each, saved, and confirmed via the actual public page that the favicon `<link>` tag, the `og:image` meta tag, and the footer's QR `<img>` all reflected the new values - then cleared the QR back to auto-generated and confirmed the footer reverted correctly.
- Re-ran the Phase 12 admin-CRUD regression suite (16/16) and the full cross-browser/responsive public-route smoke suite after all changes, confirming no regressions elsewhere.
- All test settings reverted to defaults and test upload files deleted; confirmed via direct DB query.

**Deliverable:** ✅ Both public forms send a properly branded HTML notification email (configured entirely via `.env`, matching the client's request), with the DB row remaining the source of truth regardless of email delivery success. Website Settings now also covers favicon, OG/social-share image, and an optional custom WhatsApp QR code.

---

## Phase 17 — cPanel Deployment
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

## Phase 18 — Documentation & Handover
**Status:** Not Started

**Goal:** Make the CMS usable by non-technical staff without developer involvement.

**Tasks:**
- Admin user guide (screenshots): how to edit a division, publish news, view form submissions, use the Section Manager to rearrange a page, manage Website Settings.
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
| 5 | Done | 2026-09-24 |
| 6 | Done | 2026-09-24 |
| 7 | Done | 2026-09-24 |
| 8 | Done | 2026-09-24 |
| 9 | Done | 2026-09-26 |
| 10 | Done | 2026-09-26 |
| 11 | Done | 2026-09-26 |
| 12 | Done | 2026-09-26 |
| 13 | Done | 2026-09-26 |
| 14 | Done | 2026-09-26 |
| 15 | Done | 2026-09-26 |
| 16 | Done | 2026-09-26 |
| 16.5 | Done | 2026-09-27 |
| 17 | Not Started | — |
| 18 | Not Started | — |
