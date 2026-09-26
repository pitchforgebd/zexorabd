/**
 * One-time seed: populates home.sisterConcerns (with the content that was
 * previously hardcoded in SisterConcernsSection.tsx) and global.seoTools
 * (robots.txt matching the current static public/robots.txt, tracking
 * fields left blank since none are currently configured). Safe to re-run -
 * always overwrites both keys with these same defaults.
 *
 * Usage: node scripts/seedSisterConcernsAndSeoTools.js
 */
const siteSettingsService = require('../src/services/siteSettings');
const pool = require('../src/db/pool');
const config = require('../src/config');

const SISTER_CONCERNS = {
  heading: 'Our Sister Concerns',
  subheading: 'Subsidiaries & Ecosystem',
  items: [
    {
      logo: 'https://i.ibb.co.com/7dbkZsNS/Proactive-Trade-International-Logo.png',
      name: 'Proactive Trade International',
      tagline: 'One-Stop Printing & Packaging Solutions',
      description:
        'Founded in 2024, Proactive Trade International is a trusted printing and packaging solutions provider in Bangladesh. Stands at the forefront of technical excellence in the printing and packaging industry.\n\nWe specialize in high-performance advanced printing & packaging industries machineries & consumables. Headquartered in Dhaka, Bangladesh, We proudly serve over 100+ top-tier printing and packaging companies.',
      websiteUrl: 'https://proactive.com.bd/',
    },
  ],
};

const SEO_TOOLS = {
  robotsTxt: `User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: ${config.siteUrl}/sitemap.xml\n`,
  googleAnalyticsId: '',
  googleTagManagerId: '',
  googleSearchConsoleVerification: '',
  customHeadCode: '',
};

async function main() {
  await siteSettingsService.set('home.sisterConcerns', SISTER_CONCERNS);
  await siteSettingsService.set('global.seoTools', SEO_TOOLS);
  console.log('Seeded home.sisterConcerns and global.seoTools');
  await pool.end();
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exitCode = 1;
});
