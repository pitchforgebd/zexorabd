/**
 * One-time (but safely re-runnable) seed: registers the fixed set of
 * section keys that make up the Home page in page_sections, all visible,
 * in their current on-page order, with the variant that matches today's
 * live layout. This is what lets the admin Section Manager (Phase 7) show
 * something meaningful on first load instead of an empty page.
 *
 * Usage: npx tsx scripts/seed-page-sections.ts
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../server/.env') });

const homeSections = [
  { sectionKey: 'hero', layoutVariant: 'slider' },
  { sectionKey: 'about-snapshot', layoutVariant: 'default' },
  { sectionKey: 'divisions-grid', layoutVariant: 'cards' },
  { sectionKey: 'why-choose-us', layoutVariant: 'grid' },
  { sectionKey: 'industries', layoutVariant: 'default' },
  { sectionKey: 'global-sourcing', layoutVariant: 'default' },
  { sectionKey: 'suppliers', layoutVariant: 'default' },
  { sectionKey: 'sister-concerns', layoutVariant: 'default' },
  { sectionKey: 'vision-mission', layoutVariant: 'default' },
  { sectionKey: 'cta', layoutVariant: 'default' },
];

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'zexora_cms',
    namedPlaceholders: true,
  });

  let sortOrder = 0;
  for (const section of homeSections) {
    await conn.query(
      `INSERT INTO page_sections (page_key, section_key, is_visible, sort_order, layout_variant, config)
       VALUES ('home', :sectionKey, 1, :sortOrder, :layoutVariant, '{}')
       ON DUPLICATE KEY UPDATE layout_variant = VALUES(layout_variant)`,
      // Deliberately NOT overwriting is_visible/sort_order on re-run, so an
      // admin's live reordering/hiding survives a re-seed; only the variant
      // default is refreshed.
      { sectionKey: section.sectionKey, sortOrder: sortOrder++, layoutVariant: section.layoutVariant }
    );
    console.log(`Seeded page section: home.${section.sectionKey}`);
  }

  await conn.end();
  console.log('Seed complete.');
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
