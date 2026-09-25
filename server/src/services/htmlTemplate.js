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

function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Zexora Corporation',
    url: config.siteUrl,
    logo: `${config.siteUrl}/logo.png`,
    sameAs: [
      'https://www.facebook.com/zexoracorporation',
      'https://www.instagram.com/zexoracorporation',
      'https://www.linkedin.com/company/zexoracorporation',
      'https://www.youtube.com/@zexoracorporation',
    ],
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
  const jsonLdBlocks = [organizationJsonLd()];
  if (meta.breadcrumbs) jsonLdBlocks.push(breadcrumbJsonLd(meta.breadcrumbs));
  // JSON.stringify doesn't escape "<", so a division name or news title
  // (admin-editable, e.g. via breadcrumbJsonLd) containing "</script>" would
  // otherwise close this tag early and let whatever follows execute as HTML
  // for every visitor. \u003c is valid inside a JSON string and still
  // parses back to "<" when a crawler/JSON-LD consumer reads the tag.
  const jsonLdHtml = jsonLdBlocks
    .map((block) => `<script type="application/ld+json">${JSON.stringify(block).replace(/</g, '\\u003c')}</script>`)
    .join('\n  ');

  return loadTemplate()
    .replace(/%%SEO_TITLE%%/g, escapeHtml(meta.title))
    .replace(/%%SEO_DESCRIPTION%%/g, escapeHtml(meta.description))
    .replace(/%%SEO_CANONICAL%%/g, escapeHtml(meta.canonicalUrl))
    .replace(/%%SEO_OG_IMAGE%%/g, escapeHtml(meta.ogImage))
    .replace('%%SEO_JSONLD%%', jsonLdHtml);
}

module.exports = { renderPage, templateExists };
