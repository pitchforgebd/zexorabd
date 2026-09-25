# Database — Phase 1 Notes

`schema.sql` is the versioned source of truth for the MySQL schema. Apply it
against a fresh database, don't hand-edit structure through phpMyAdmin.

## Requires MySQL 5.7.8+ / MariaDB 10.2.7+ (JSON column support)

Several tables use native `JSON` columns (`divisions.philosophy`,
`divisions.industries`, `site_settings.setting_value`, `page_sections.config`,
etc). Confirm the cPanel-provided MySQL/MariaDB version supports `JSON`
before deploying (Phase 13) — virtually all current cPanel hosts do, but this
is cheap to double-check.

## Entity relationships

```
divisions (1) ───< product_categories (1) ───< product_subcategories (1) ───< product_items
   │
   └── bullet-list content stored inline as JSON columns
       (philosophy, industries, reasons, commitment, strengths,
        markets, sourcing_steps) — not separate tables, see schema
       comments for why.

news_posts, photo_gallery, video_gallery, suppliers   → standalone content tables
career_applications, contact_messages                  → standalone form-submission tables
admin_users                                             → standalone (Phase 3 auth)
seo_meta        → polymorphic 1:1 via page_key (e.g. "division:chemicals", "news:<slug>", "home")
site_settings   → generic key/value store for homepage misc content (Phase 6)
page_sections   → polymorphic per page_key + section_key (Phase 7 design dynamics)
```

## Seeding (done — Phases 4/6/9)

The original hardcoded content (`src/data/divisions.ts`, `suppliers.ts`,
`seoData.ts`, and the homepage/page-sections defaults) was migrated into
these tables by one-off scripts under `/scripts` (`migrate-divisions.ts`,
`seed-site-settings.ts`, `seed-page-sections.ts`, `seed-seo-meta.ts`) and
the source files were then deleted (Phase 10) once the CMS was confirmed
working — MySQL is now the only source of truth for this content. Setting
up a fresh environment means restoring a DB dump/export, not re-running
those scripts (most no longer have source files to read from).
