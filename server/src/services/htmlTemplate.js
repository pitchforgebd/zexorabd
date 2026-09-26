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

// Builds the standard GA4/GTM/Search-Console snippets from just an ID/token
// (the admin pastes an ID, not a whole script - less error-prone for a
// non-technical user, and avoids storing arbitrary <script> content from
// three separate "paste your tracking code here" boxes that all do the
// same handful of things). customHeadCode is the escape hatch for anything
// else and IS injected as raw HTML by design - it's an admin-auth-gated
// "custom code" field, the same trust boundary every CMS with this feature
// relies on, not user-facing input.
function trackingHtml(seoTools) {
  if (!seoTools) return '';
  const parts = [];

  if (seoTools.googleSearchConsoleVerification) {
    parts.push(`<meta name="google-site-verification" content="${escapeHtml(seoTools.googleSearchConsoleVerification)}">`);
  }
  if (seoTools.googleTagManagerId) {
    const id = escapeHtml(seoTools.googleTagManagerId);
    parts.push(
      `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${id}');</script>`
    );
  }
  if (seoTools.googleAnalyticsId) {
    const id = escapeHtml(seoTools.googleAnalyticsId);
    parts.push(
      `<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>` +
        `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');</script>`
    );
  }
  if (seoTools.customHeadCode) {
    parts.push(seoTools.customHeadCode);
  }

  return parts.join('\n  ');
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
    .replace('%%SEO_JSONLD%%', jsonLdHtml)
    .replace('%%SEO_TRACKING%%', trackingHtml(meta.seoTools));
}

module.exports = { renderPage, templateExists };
