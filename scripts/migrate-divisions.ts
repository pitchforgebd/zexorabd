/**
 * One-time (but safely re-runnable) migration: reads the current hardcoded
 * src/data/divisions.ts, divisionImages.ts, and suppliers.ts, and inserts
 * their content into MySQL so the live copy isn't lost during the Phase 4
 * CMS migration. Re-running it is safe — divisions are upserted by slug,
 * and each division's product tree / gallery is fully replaced from the
 * source file on every run (so this script, not manual DB edits, stays the
 * source of truth until the admin panel takes over).
 *
 * Usage: npx tsx scripts/migrate-divisions.ts
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import { divisions, divisionData } from '../src/data/divisions';
import { divisionImages } from '../src/data/divisionImages';
import { supplierImages } from '../src/data/suppliers';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../server/.env') });

const ICON_NAMES: Record<string, string> = {
  chemicals: 'FlaskConical',
  equipment: 'Cog',
  power: 'Zap',
  apparel: 'Shirt',
  printpack: 'Printer',
  fashion: 'ShoppingBag',
};

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
  for (const summary of divisions) {
    const content = divisionData[summary.id];
    if (!content) {
      console.warn(`Skipping ${summary.id}: no divisionData entry`);
      continue;
    }

    const galleryForCover = divisionImages[summary.id] || [];

    await conn.query(
      `INSERT INTO divisions
         (slug, name, industry, tagline, overview, brand_positioning, icon, cover_image, sort_order,
          philosophy, industries, reasons, commitment, strengths, markets, sourcing_steps, is_active)
       VALUES
         (:slug, :name, :industry, :tagline, :overview, :brandPositioning, :icon, :coverImage, :sortOrder,
          :philosophy, :industries, :reasons, :commitment, :strengths, :markets, :sourcingSteps, 1)
       ON DUPLICATE KEY UPDATE
         name = VALUES(name), industry = VALUES(industry), tagline = VALUES(tagline),
         overview = VALUES(overview), brand_positioning = VALUES(brand_positioning),
         icon = VALUES(icon), cover_image = VALUES(cover_image), sort_order = VALUES(sort_order),
         philosophy = VALUES(philosophy), industries = VALUES(industries), reasons = VALUES(reasons),
         commitment = VALUES(commitment), strengths = VALUES(strengths), markets = VALUES(markets),
         sourcing_steps = VALUES(sourcing_steps)`,
      {
        slug: summary.id,
        name: content.name,
        industry: content.industry || null,
        tagline: content.tagline,
        overview: content.overview,
        brandPositioning: content.brandPositioning || null,
        coverImage: galleryForCover[0]?.url || null,
        icon: ICON_NAMES[summary.id] || null,
        sortOrder: sortOrder++,
        philosophy: content.philosophy ? JSON.stringify(content.philosophy) : null,
        industries: JSON.stringify(content.industries || []),
        reasons: JSON.stringify(content.reasons || []),
        commitment: JSON.stringify(content.commitment || []),
        strengths: JSON.stringify(content.strengths || []),
        markets: JSON.stringify(content.markets || []),
        // Only apparel uses `sourcing` today; normalize {title, items[]} -> {title, description}
        sourcingSteps: JSON.stringify(
          ((content as any).sourcing || []).map((s: { title: string; items: string[] }) => ({
            title: s.title,
            description: (s.items || []).join(' '),
          }))
        ),
      }
    );

    const [[{ id: divisionId }]] = (await conn.query('SELECT id FROM divisions WHERE slug = :slug', {
      slug: summary.id,
    })) as unknown as [{ id: number }[]];

    // Rebuild the product tree fresh every run.
    await conn.query('DELETE FROM product_categories WHERE division_id = :divisionId', { divisionId });
    let catOrder = 0;
    for (const cat of content.products) {
      const [catResult] = (await conn.query(
        'INSERT INTO product_categories (division_id, category_name, description, sort_order) VALUES (:divisionId, :categoryName, :description, :sortOrder)',
        { divisionId, categoryName: cat.category, description: cat.description || null, sortOrder: catOrder++ }
      )) as unknown as [mysql.ResultSetHeader];
      const categoryId = catResult.insertId;

      let subOrder = 0;
      for (const sub of cat.subcategories) {
        const [subResult] = (await conn.query(
          'INSERT INTO product_subcategories (category_id, sub_name, description, sort_order) VALUES (:categoryId, :subName, :description, :sortOrder)',
          { categoryId, subName: sub.subName || null, description: sub.description || null, sortOrder: subOrder++ }
        )) as unknown as [mysql.ResultSetHeader];
        const subcategoryId = subResult.insertId;

        let itemOrder = 0;
        for (const text of sub.items) {
          await conn.query(
            'INSERT INTO product_items (subcategory_id, item_text, sort_order) VALUES (:subcategoryId, :itemText, :sortOrder)',
            { subcategoryId, itemText: text, sortOrder: itemOrder++ }
          );
        }
      }
    }

    // Rebuild the gallery fresh every run too.
    await conn.query('DELETE FROM division_gallery_images WHERE division_id = :divisionId', { divisionId });
    let imgOrder = 0;
    for (const img of galleryForCover) {
      await conn.query(
        'INSERT INTO division_gallery_images (division_id, image_path, sort_order) VALUES (:divisionId, :imagePath, :sortOrder)',
        { divisionId, imagePath: img.url, sortOrder: imgOrder++ }
      );
    }

    console.log(`Migrated division: ${summary.id} (${content.products.length} categories, ${galleryForCover.length} gallery images)`);
  }

  // Suppliers: insert any not already present (by image_path).
  let supplierOrder = 0;
  for (const s of supplierImages) {
    const [existing] = await conn.query('SELECT id FROM suppliers WHERE image_path = :url', { url: s.url });
    if ((existing as unknown[]).length === 0) {
      await conn.query('INSERT INTO suppliers (image_path, sort_order, is_active) VALUES (:url, :sortOrder, 1)', {
        url: s.url,
        sortOrder: supplierOrder,
      });
    }
    supplierOrder++;
  }
  console.log(`Migrated suppliers: ${supplierImages.length}`);

  await conn.end();
  console.log('Migration complete.');
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
