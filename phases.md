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
| 5 | Done | 2026-09-24 |
| 6 | Done | 2026-09-24 |
| 7 | Done | 2026-09-24 |
| 8 | Done | 2026-09-24 |
| 9 | Done | 2026-09-26 |
| 10 | Done (awaiting approval) | — |
| 11 | Not Started | — |
| 12 | Not Started | — |
| 13 | Not Started | — |
| 14 | Not Started | — |
