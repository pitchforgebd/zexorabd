/**
 * One-time migration: adds any new global.siteInfo fields to an existing
 * row without touching anything the admin may have already customized
 * (unlike seedSiteInfo.js, which resets everything back to defaults). Safe
 * to re-run, including after new fields are added here later - only fills
 * in whatever's still missing.
 *
 * Usage: node scripts/migrateSiteInfoFields.js
 */
const siteSettingsService = require('../src/services/siteSettings');
const pool = require('../src/db/pool');

const NEW_FIELD_DEFAULTS = {
  favicon: '/favicon.png',
  ogImage: '/logo.png',
  whatsappQrImage: '',
  footerLogo: '',
};

async function main() {
  const settings = await siteSettingsService.getAll();
  const current = settings['global.siteInfo'];
  if (!current) {
    console.log('No global.siteInfo row yet - run seedSiteInfo.js first.');
    await pool.end();
    return;
  }

  const missing = Object.keys(NEW_FIELD_DEFAULTS).filter((k) => !(k in current));
  if (missing.length === 0) {
    console.log('global.siteInfo already has all fields - nothing to do.');
    await pool.end();
    return;
  }

  const updated = { ...current };
  for (const key of missing) updated[key] = NEW_FIELD_DEFAULTS[key];
  await siteSettingsService.set('global.siteInfo', updated);
  console.log(`Added missing field(s) to global.siteInfo: ${missing.join(', ')}`);
  await pool.end();
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exitCode = 1;
});
