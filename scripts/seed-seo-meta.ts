/**
 * One-time (but safely re-runnable) seed: writes the existing hardcoded SEO
 * copy (from src/data/seoData.ts and each page's inline <SEO> props) into
 * seo_meta, so switching to the admin-editable/server-injected system in
 * Phase 9 causes no regression in existing title/description content.
 *
 * Usage: npx tsx scripts/seed-seo-meta.ts
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../server/.env') });

const entries: { pageKey: string; title: string; description: string }[] = [
  {
    pageKey: 'home',
    title: 'Zexora Corporation | Diversified Multi-Sector Business Group Bangladesh',
    description:
      'Zexora Corporation is a leading diversified business group in Bangladesh offering industrial chemicals, printing solutions, global sourcing, logistics, garments, power solutions and more.',
  },
  {
    pageKey: 'about',
    title: 'About Zexora Corporation | 15+ Years Industry Experience | Dhaka Bangladesh',
    description:
      'Learn about Zexora Corporation — a professionally managed multi-sector business group built on 15+ years of industry expertise across chemicals, packaging, sourcing, and logistics in Bangladesh.',
  },
  {
    pageKey: 'ceo-message',
    title: 'Message from Founder & CEO | Zexora Corporation',
    description: 'Read the message from the Founder & CEO of Zexora Corporation.',
  },
  {
    pageKey: 'vision-mission',
    title: 'Vision, Mission & Values | Zexora Corporation Bangladesh',
    description:
      'Discover the vision, mission and core values that drive Zexora Corporation — trust, integrity, responsibility, creativity and excellence across all business divisions.',
  },
  {
    pageKey: 'divisions-list',
    title: 'Our Business Divisions | Zexora Corporation Bangladesh',
    description:
      'Zexora operates through 6 specialized business divisions covering industrial chemicals, equipment, power, apparel, printing, and fashion.',
  },
  {
    pageKey: 'global-sourcing',
    title: 'Global Sourcing Network | Zexora Corporation Bangladesh',
    description:
      'Zexora maintains an active global sourcing network, connecting Bangladeshi industries with world-class manufacturers of industrial materials and equipment.',
  },
  {
    pageKey: 'career',
    title: 'Career Application Form | Zexora Corporation',
    description: 'Join Our Team / Apply For A Position at Zexora Corporation.',
  },
  {
    pageKey: 'media-centre-news',
    title: 'News & Updates | Media Centre | Zexora Corporation',
    description: 'Stay updated with the latest news and announcements from Zexora Corporation.',
  },
  {
    pageKey: 'media-centre-photos',
    title: 'Photo Gallery | Media Centre | Zexora Corporation',
    description: 'Explore the photo gallery of Zexora Corporation events and operations.',
  },
  {
    pageKey: 'media-centre-videos',
    title: 'Video Gallery | Media Centre | Zexora Corporation',
    description: 'Explore the video gallery of Zexora Corporation operations and showcases.',
  },
  {
    pageKey: 'contact',
    title: 'Contact Zexora Corporation | Dhaka Bangladesh | info@zexora.com.bd',
    description:
      'Contact Zexora Corporation for industrial chemicals, sourcing, logistics, equipment and business partnership inquiries. Located in Fakirapool, Motijheel, Dhaka-1000.',
  },
  // Division overrides - hand-written copy, better than the auto-generated
  // "<name> | Zexora Corporation" fallback seoResolver.js would otherwise use.
  {
    pageKey: 'division:chemicals',
    title: 'Industrial Chemicals & Printing Inks Supplier Bangladesh | Zexora',
    description:
      'Zexora supplies high-performance industrial chemicals, printing inks, textile chemicals, solvents and pharmaceutical raw materials to manufacturers across Bangladesh.',
  },
  {
    pageKey: 'division:equipment',
    title: 'Industrial Equipment & Machinery Supplier Bangladesh | Zexora',
    description:
      'Zexora supplies air compressors, generators, forklifts, welding machines, hydraulic lifts and industrial spare parts to factories and workshops across Bangladesh.',
  },
  {
    pageKey: 'division:power',
    title: 'UPS IPS Solar Power Backup Solutions Bangladesh | Zexora',
    description:
      'Zexora Power Solutions provides UPS, IPS, solar panels, LiFePO4 batteries, voltage stabilizers and complete solar packages for homes, offices and industries in Bangladesh.',
  },
  {
    pageKey: 'division:apparel',
    title: 'Garments Manufacturing & Textile Sourcing Bangladesh | Zexora',
    description:
      'Zexora Apparel & Garments offers end-to-end garment production management, textile sourcing, quality inspection and export coordination for global fashion buyers.',
  },
  {
    pageKey: 'division:printpack',
    title: 'Commercial Printing & Packaging Services Bangladesh | Zexora',
    description:
      'Zexora Print & Pack offers visiting cards, brochures, FMCG packaging, pharmaceutical packaging, UV coating, lamination and foil stamping services in Bangladesh.',
  },
  {
    pageKey: 'division:fashion',
    title: 'Premium Fashion & Lifestyle Products Bangladesh | Zexora',
    description:
      'Zexora Fashion & Lifestyle offers premium apparel, curated lifestyle collections, boutique product sourcing and private label development for discerning consumers in Bangladesh.',
  },
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

  for (const entry of entries) {
    await conn.query(
      `INSERT INTO seo_meta (page_key, title, meta_description) VALUES (:pageKey, :title, :description)
       ON DUPLICATE KEY UPDATE title = VALUES(title), meta_description = VALUES(meta_description)`,
      entry
    );
    console.log(`Seeded seo_meta: ${entry.pageKey}`);
  }

  await conn.end();
  console.log('Seed complete.');
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
