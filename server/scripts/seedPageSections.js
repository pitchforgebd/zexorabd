/**
 * One-time seed: registers the section list for the four pages made
 * dynamic in Phase 14 (About, CEO Message, Vision & Mission, Global
 * Sourcing) in page_sections, so Phase 16's Section Manager has rows to
 * manage. Mirrors each page's SECTION_REGISTRY order exactly (see the
 * corresponding src/pages/*.tsx). Safe to re-run - replaceForPage() is an
 * upsert.
 *
 * Usage: node scripts/seedPageSections.js
 */
const pageSectionsService = require('../src/services/pageSections');
const pool = require('../src/db/pool');

const PAGES = {
  about: ['hero', 'who-we-are', 'divisions-grid', 'competitive-advantage', 'our-vision', 'cta'],
  'ceo-message': ['hero', 'message', 'cta'],
  'vision-mission': ['hero', 'vision-mission-text', 'core-values', 'why-choose-us', 'industries'],
  'global-sourcing': ['hero', 'intro-map', 'countries', 'business-models', 'commitment-cta'],
};

async function main() {
  for (const [pageKey, sectionKeys] of Object.entries(PAGES)) {
    const sections = sectionKeys.map((sectionKey, sortOrder) => ({
      sectionKey,
      isVisible: true,
      sortOrder,
      layoutVariant: 'default',
      config: {},
    }));
    await pageSectionsService.replaceForPage(pageKey, sections);
    console.log(`Seeded page_sections for "${pageKey}": ${sectionKeys.join(', ')}`);
  }
  await pool.end();
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exitCode = 1;
});
