/**
 * One-time seed: populates the site_settings 'global.siteInfo' key with the
 * values that were previously hardcoded in Header.tsx/Footer.tsx/Contact.tsx,
 * so the public site's content doesn't change the moment those components
 * switch to reading from the API (Phase 13). Safe to re-run - it always
 * overwrites 'global.siteInfo' with this same seed, so only run again if
 * you actually want to reset it back to these defaults.
 *
 * Usage: node scripts/seedSiteInfo.js
 */
const siteSettingsService = require('../src/services/siteSettings');
const pool = require('../src/db/pool');

const SEED = {
  logo: '/logo.png',
  favicon: '/favicon.png',
  ogImage: '/logo.png',
  companyName: 'Zexora Corporation',
  tagline:
    'A diversified multi-sector business group committed to excellence, innovation, and long-term value creation across industries.',
  email: 'info@zexora.com.bd',
  phone: '+880 1855 939 450',
  whatsapp: '+8801855939450',
  whatsappQrImage: '',
  address: '292, Inner Circular Road, Shatabdi Centre, Fakirapool, Motijheel, Dhaka-1000',
  businessHours: 'Saturday–Thursday: 9:00 AM – 6:00 PM\nFriday: Closed',
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.3843701617134!2d90.4185923!3d23.733669!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b9e75f0afbbd%3A0x5f71646b22407002!2sZexora%20Corporation!5e0!3m2!1sen!2sbd!4v1782203946425!5m2!1sen!2sbd',
  social: {
    facebook: 'https://www.facebook.com/zexoracorporation',
    instagram: 'https://www.instagram.com/zexoracorporation',
    linkedin: 'https://www.linkedin.com/company/zexoracorporation',
    youtube: 'https://www.youtube.com/@zexoracorporation',
  },
};

async function main() {
  await siteSettingsService.set('global.siteInfo', SEED);
  console.log('Seeded global.siteInfo:', JSON.stringify(SEED, null, 2));
  await pool.end();
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exitCode = 1;
});
