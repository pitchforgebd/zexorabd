/**
 * One-time (but safely re-runnable) seed: writes the current hardcoded
 * homepage content (hero slides, stats, "why choose us" reasons, supplier
 * section copy) into site_settings, matching Phase 4's migration approach.
 * Re-running upserts by setting_key, so it's safe to run again.
 *
 * Usage: npx tsx scripts/seed-site-settings.ts
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../server/.env') });

// Mirrors src/components/HeroSlider.tsx's `slides` array.
const heroSettings = {
  slides: [
    {
      image: 'https://i.ibb.co.com/zWcjLZnx/Home-Banner-3.jpg',
      title: 'Zexora Corporation',
      subtitle: 'A Diversified Multi-Sector Business Group',
      description: 'Performance. Partnership. Progress.',
    },
    {
      image: 'https://i.ibb.co.com/1tNwZTLN/Home-Page-Banner-1-1.jpg',
      title: 'Global Sourcing Network',
      subtitle: 'Connecting Markets Worldwide',
      description: 'Verified suppliers from 9+ countries worldwide ensuring supply chain resilience.',
    },
    {
      image: 'https://i.ibb.co.com/fdnGRcV3/Home-Page-Banner-1-2.jpg',
      title: 'Industrial Excellence',
      subtitle: 'Quality Across 6 Specialized Divisions',
      description: 'From chemicals to packaging, our expertise drives sustainable long-term value.',
    },
    {
      image: 'https://i.ibb.co.com/SDLSJ9b7/Home-Page-Banner-1-3.jpg',
      title: 'Commitment to Quality',
      subtitle: 'Delivering Excellence Globally',
      description: 'Empowering businesses with superior products and unmatched service.',
    },
    {
      image: 'https://i.ibb.co.com/jZRsLkPc/Home-Page-Banner-1-4.jpg',
      title: 'Sustainable Partnerships',
      subtitle: 'Building the Future Together',
      description: 'Fostering innovation and sustainable growth across industries.',
    },
    {
      image: 'https://i.ibb.co.com/sTDp13Y/Home-Page-Banner-1-5.jpg',
      title: 'Empowering Industries',
      subtitle: 'Comprehensive B2B Solutions',
      description: 'Your trusted partner for end-to-end industrial and corporate supply.',
    },
  ],
};

// Mirrors src/pages/Home.tsx's `statBoxes` array.
const statsSettings = {
  items: [
    { value: '2024', label: 'Established' },
    { value: '15+', label: 'Years of Experience' },
    { value: '6', label: 'Business Divisions' },
  ],
};

// Mirrors src/pages/Home.tsx's `reasons` array + Section 4 heading copy.
const whyChooseUsSettings = {
  heading: 'Why Choose Zexora Corporation?',
  subheading: 'Built on experience. Driven by performance. Trusted by industry.',
  reasons: [
    { title: 'Reliable Global Sourcing Network', desc: 'Verified suppliers from 9+ countries worldwide' },
    { title: 'Consistent Industrial Quality', desc: 'Strict quality standards maintained at every supply stage' },
    { title: 'Competitive Commercial Support', desc: 'Transparent pricing and sustainable long-term value' },
    { title: 'Deep Technical Product Knowledge', desc: '15+ years of hands-on industry expertise' },
    { title: 'Fast & Efficient Supply Chain', desc: 'End-to-end logistics coordination and on-time delivery' },
    { title: 'Long-Term Partnership Approach', desc: 'We build relationships, not just transactions' },
    { title: 'Import & Indenting Support', desc: 'Full commercial and documentation support for imports' },
    { title: 'Multi-Sector Capability', desc: '9 divisions under one trusted corporate platform' },
  ],
};

// Mirrors src/components/SupplierLogos.tsx's hardcoded heading copy.
const suppliersSettings = {
  heading: 'Our Global Suppliers',
  subheading: 'Partner Network',
  description:
    'We collaborate with industry-leading manufacturers and suppliers to deliver uncompromising quality and excellence worldwide.',
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

  const entries: [string, unknown][] = [
    ['home.hero', heroSettings],
    ['home.stats', statsSettings],
    ['home.whyChooseUs', whyChooseUsSettings],
    ['home.suppliers', suppliersSettings],
  ];

  for (const [key, value] of entries) {
    await conn.query(
      `INSERT INTO site_settings (setting_key, setting_value) VALUES (:key, :value)
       ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
      { key, value: JSON.stringify(value) }
    );
    console.log(`Seeded setting: ${key}`);
  }

  await conn.end();
  console.log('Seed complete.');
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
