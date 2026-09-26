/**
 * One-time migration: downloads every division/supplier/hero image still
 * hot-linked to the free i.ibb.co.com host, re-hosts it under this app's
 * own uploads/ storage (through the same optimizeImage() pipeline as admin
 * uploads), and rewrites the DB row to point at the local copy.
 *
 * Run once, from server/: node scripts/migrateExternalImages.js
 * Safe to re-run - it only touches rows whose value still contains
 * "ibb.co", so anything already migrated is skipped automatically.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const pool = require('../src/db/pool');
const config = require('../src/config');
const { optimizeImage } = require('../src/middleware/imageUpload');

const CONCURRENCY = 4; // the source host is slow (~2-6s/image) - keep this modest

function extFromUrl(url) {
  const clean = url.split('?')[0];
  const ext = path.extname(clean).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext) ? ext : '.jpg';
}

async function downloadTo(url, subdir) {
  const dir = path.join(config.uploadsDir, subdir);
  fs.mkdirSync(dir, { recursive: true });
  const filename = `${crypto.randomBytes(16).toString('hex')}${extFromUrl(url)}`;
  const destPath = path.join(dir, filename);

  const resp = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const buf = Buffer.from(await resp.arrayBuffer());
  fs.writeFileSync(destPath, buf);

  await optimizeImage(destPath);
  return `/uploads/${subdir}/${filename}`;
}

async function runPool(items, worker) {
  let ok = 0;
  let fail = 0;
  let i = 0;
  async function next() {
    while (i < items.length) {
      const idx = i++;
      try {
        await worker(items[idx], idx);
        ok++;
      } catch (err) {
        fail++;
        console.warn(`  FAILED [${idx}]:`, err.message);
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, next));
  return { ok, fail };
}

async function migrateDivisionCovers() {
  const [rows] = await pool.query("SELECT id, slug, cover_image FROM divisions WHERE cover_image LIKE '%ibb.co%'");
  console.log(`\nDivision cover images: ${rows.length} to migrate`);
  const { ok, fail } = await runPool(rows, async (row) => {
    const newPath = await downloadTo(row.cover_image, 'divisions');
    await pool.query('UPDATE divisions SET cover_image = :newPath WHERE id = :id', { newPath, id: row.id });
    console.log(`  [${row.slug}] cover -> ${newPath}`);
  });
  console.log(`Division covers: ${ok} migrated, ${fail} failed`);
}

async function migrateDivisionGallery() {
  const [rows] = await pool.query("SELECT id, division_id, image_path FROM division_gallery_images WHERE image_path LIKE '%ibb.co%'");
  console.log(`\nDivision gallery images: ${rows.length} to migrate`);
  const { ok, fail } = await runPool(rows, async (row) => {
    const newPath = await downloadTo(row.image_path, 'divisions/gallery');
    await pool.query('UPDATE division_gallery_images SET image_path = :newPath WHERE id = :id', { newPath, id: row.id });
  });
  console.log(`Division gallery: ${ok} migrated, ${fail} failed`);
}

async function migrateSuppliers() {
  const [rows] = await pool.query("SELECT id, image_path FROM suppliers WHERE image_path LIKE '%ibb.co%'");
  console.log(`\nSupplier logos: ${rows.length} to migrate`);
  const { ok, fail } = await runPool(rows, async (row) => {
    const newPath = await downloadTo(row.image_path, 'suppliers');
    await pool.query('UPDATE suppliers SET image_path = :newPath WHERE id = :id', { newPath, id: row.id });
  });
  console.log(`Suppliers: ${ok} migrated, ${fail} failed`);
}

async function migrateHeroSlides() {
  const [rows] = await pool.query("SELECT setting_value FROM site_settings WHERE setting_key = 'home.hero'");
  if (!rows.length) return;
  const value = rows[0].setting_value;
  const slides = value.slides || [];
  const toMigrate = slides.filter((s) => typeof s.image === 'string' && s.image.includes('ibb.co'));
  console.log(`\nHomepage hero slides: ${toMigrate.length} to migrate`);
  let ok = 0;
  let fail = 0;
  for (const slide of slides) {
    if (typeof slide.image !== 'string' || !slide.image.includes('ibb.co')) continue;
    try {
      slide.image = await downloadTo(slide.image, 'homepage');
      ok++;
    } catch (err) {
      fail++;
      console.warn('  FAILED hero slide:', err.message);
    }
  }
  await pool.query('UPDATE site_settings SET setting_value = :value WHERE setting_key = :key', {
    value: JSON.stringify(value),
    key: 'home.hero',
  });
  console.log(`Hero slides: ${ok} migrated, ${fail} failed`);
}

async function main() {
  console.log('Starting external image migration (i.ibb.co.com -> local /uploads)...');
  await migrateDivisionCovers();
  await migrateDivisionGallery();
  await migrateSuppliers();
  await migrateHeroSlides();
  console.log('\nDone.');
  await pool.end();
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exitCode = 1;
});
