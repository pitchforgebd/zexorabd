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
**Status:** Not Started

**Goal:** Lock every open technical decision before any code is written, so later phases don't require rework.

**Tasks:**
- **Critical:** Confirm the cPanel hosting plan actually includes "Setup Node.js App" (Phusion Passenger) — check Node.js version(s) available, whether `npm install` is possible via cPanel Terminal/Node selector, process memory limits, and whether the app runs as a long-lived process or per-request. If Node.js isn't available on this hosting plan, the whole stack decision needs to be revisited before Phase 1.
- Confirm domain/subdomain structure (e.g. does the Node API live on `zexora.com.bd/api/` or `api.zexora.com.bd`, and how that's proxied to the Node app under Passenger/`.htaccess`).
- Finalize folder layout for deployment (Node app root, built React `dist/`, `/uploads` for images/CVs, how Passenger's required `app.js`/`server.js` entry point maps to this).
- Decide admin panel delivery: server-rendered admin pages (Express + templating) vs. a protected route inside the React app hitting the same API with JWT/session auth. (Recommendation: React admin UI under `/admin`, same SPA, authenticated via httpOnly session cookie — keeps one frontend codebase.)
- Decide SEO rendering approach in principle (finalized in Phase 9): Express-side SSR of the React app, or a bot-detecting prerender middleware, or defer to a future Next.js migration.
- Initialize Git repository for version control (currently the project has no git history — needed before further changes for safety/rollback).
- Define naming/coding conventions for the Node backend (folder structure, response format, error format, env var handling).

**Deliverable:** A short decisions doc (or this file updated) confirming stack details + Git repo initialized + Node.js hosting support verified.

---

## Phase 1 — Database Design
**Status:** Not Started

**Goal:** Design the MySQL schema that will back the entire CMS.

**Tasks:**
- Tables for: `divisions`, `division_products`, `product_subcategories`, `suppliers`, `news_posts`, `photo_gallery`, `video_gallery`, `career_applications`, `contact_messages`, `seo_meta` (per-page SEO overrides), `admin_users`, `site_settings` (general homepage content).
- `page_sections` table planned here too (used by Phase 7): `page_key`, `section_key`, `is_visible`, `sort_order`, `layout_variant`, `config` (JSON).
- Define relationships/foreign keys (e.g. products belong to a division).
- Define indexes for anything queried by slug/URL (SEO-friendly lookups).
- Write the schema as versioned `.sql` migration files (applied via a small Node migration runner or manually through phpMyAdmin from cPanel, but always kept in version control).

**Deliverable:** `/database/schema.sql` (or migration files) + an ER diagram/description.

---

## Phase 2 — Backend API Core
**Status:** Not Started

**Goal:** Stand up the Node.js/Express REST API skeleton that all CMS modules will build on.

**Tasks:**
- Express app scaffold with the entry point Passenger expects on cPanel.
- DB connection layer using `mysql2` (connection pool, prepared statements only — no raw string concatenation, to prevent SQL injection).
- Routing structure (`/api/...`), centralized error handler, standard JSON response envelope.
- Core middleware: `helmet` (security headers), `cors` (if API/frontend end up on different origins), request body parsing, request logging.
- Input validation layer (e.g. `express-validator` or hand-written validators).
- `.env`-based configuration (DB credentials, session secret, mail settings) — kept out of the web root / git.
- cPanel-specific plumbing: Passenger restart file (`tmp/restart.txt`) workflow, `package.json` start script Passenger will call.

**Deliverable:** A working `/api/health` endpoint plus the shared framework code reused by every later module, running under cPanel's Node.js App manager.

---

## Phase 3 — Admin Authentication & Panel Shell
**Status:** Not Started

**Goal:** Secure login system and the base admin dashboard shell.

**Tasks:**
- `admin_users` table, password hashing (`bcrypt`), login endpoint, session handling (`express-session` with a MySQL-backed session store, so sessions survive app restarts).
- CSRF protection on admin forms/mutating requests.
- Basic dashboard layout/navigation in the React admin area (sidebar linking to each CMS module, most of which are empty until later phases).
- Logout, session timeout, brute-force login throttling (e.g. `express-rate-limit` on the login route).

**Deliverable:** A working, secured `/admin` login + empty dashboard shell.

---

## Phase 4 — CMS Module: Divisions & Products
**Status:** Not Started

**Goal:** Replace the hardcoded `src/data/divisions.ts` with database-backed content manageable from the admin panel.

**Tasks:**
- Admin CRUD screens: divisions, product categories, subcategories, items.
- Image upload handling for division/product images (`multer` for uploads, stored server-side under `/uploads`, not third-party hosts).
- Public API endpoints (`GET /api/divisions`, `GET /api/divisions/{slug}`) consumed by the React site.
- Data migration script (Node script) to import the current hardcoded content into MySQL (so nothing is lost).

**Deliverable:** Divisions pages on the live site are fully DB-driven; admin can edit a product line without a code deploy.

---

## Phase 5 — CMS Module: News & Media Centre
**Status:** Not Started

**Goal:** Turn the currently-empty News/Photo Gallery/Video Gallery pages into real, manageable content.

**Tasks:**
- Admin CRUD: news posts (title, body, cover image, publish date, slug), photo gallery (albums/images), video gallery (YouTube/Vimeo embeds or uploaded video links).
- Public API endpoints + pagination.
- Frontend wiring for `News.tsx`, `PhotoGallery.tsx`, `VideoGallery.tsx`.

**Deliverable:** Media Centre section is fully functional and editable.

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
| 0 | Not Started | — |
| 1 | Not Started | — |
| 2 | Not Started | — |
| 3 | Not Started | — |
| 4 | Not Started | — |
| 5 | Not Started | — |
| 6 | Not Started | — |
| 7 | Not Started | — |
| 8 | Not Started | — |
| 9 | Not Started | — |
| 10 | Not Started | — |
| 11 | Not Started | — |
| 12 | Not Started | — |
| 13 | Not Started | — |
| 14 | Not Started | — |
