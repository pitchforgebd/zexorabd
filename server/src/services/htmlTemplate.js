const fs = require('fs');
const path = require('path');
const config = require('../config');

const TEMPLATE_PATH = path.join(config.distDir, 'index.html');

let cachedTemplate = null;

function loadTemplate() {
  // Cached after first read - the built index.html doesn't change without a
  // redeploy, which restarts the Node process anyway (fresh cache).
  if (cachedTemplate === null) {
    cachedTemplate = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  }
  return cachedTemplate;
}

function templateExists() {
  return fs.existsSync(TEMPLATE_PATH);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const DEFAULT_SOCIAL = {
  facebook: 'https://www.facebook.com/zexoracorporation',
  instagram: 'https://www.instagram.com/zexoracorporation',
  linkedin: 'https://www.linkedin.com/company/zexoracorporation',
  youtube: 'https://www.youtube.com/@zexoracorporation',
};

// Falls back to these defaults if the admin hasn't saved Website Settings
// yet (siteInfo is undefined) - keeps this schema working even before
// Phase 13's global.siteInfo row exists.
function organizationJsonLd(siteInfo) {
  const logo = siteInfo?.logo || '/logo.png';
  const social = siteInfo?.social || DEFAULT_SOCIAL;
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteInfo?.companyName || 'Zexora Corporation',
    url: config.siteUrl,
    logo: logo.startsWith('http') ? logo : `${config.siteUrl}${logo}`,
    sameAs: [social.facebook, social.instagram, social.linkedin, social.youtube].filter(Boolean),
  };
}

function breadcrumbJsonLd(breadcrumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Render the built index.html with per-request SEO values substituted for
 * the %%SEO_*%% tokens (see index.html). meta comes from seoResolver.
 */
function renderPage(meta) {
  const jsonLdBlocks = [organizationJsonLd(meta.siteInfo)];
  if (meta.breadcrumbs) jsonLdBlocks.push(breadcrumbJsonLd(meta.breadcrumbs));
  // JSON.stringify doesn't escape "<", so a division name or news title
  // (admin-editable, e.g. via breadcrumbJsonLd) containing "</script>" would
  // otherwise close this tag early and let whatever follows execute as HTML
  // for every visitor. \u003c is valid inside a JSON string and still
  // parses back to "<" when a crawler/JSON-LD consumer reads the tag.
  const jsonLdHtml = jsonLdBlocks
    .map((block) => `<script type="application/ld+json">${JSON.stringify(block).replace(/</g, '\\u003c')}</script>`)
    .join('\n  ');

  const favicon = meta.siteInfo?.favicon || '/favicon.png';
  const faviconUrl = favicon.startsWith('http') ? favicon : `${config.siteUrl}${favicon}`;

  return loadTemplate()
    .replace(/%%SEO_TITLE%%/g, escapeHtml(meta.title))
    .replace(/%%SEO_DESCRIPTION%%/g, escapeHtml(meta.description))
    .replace(/%%SEO_CANONICAL%%/g, escapeHtml(meta.canonicalUrl))
    .replace(/%%SEO_OG_IMAGE%%/g, escapeHtml(meta.ogImage))
    .replace(/%%SEO_FAVICON%%/g, escapeHtml(faviconUrl))
    .replace('%%SEO_JSONLD%%', jsonLdHtml);
}

module.exports = { renderPage, templateExists };
