const config = require('../config');
const siteSettingsService = require('./siteSettings');

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Converts plain text into safe HTML, preserving line breaks - used for
// long free-text fields (a message, a cover letter) inside the table-based
// email layout below.
function textToHtml(str) {
  return escapeHtml(str).replace(/\n/g, '<br>');
}

/**
 * Renders a branded notification email as an HTML string. Table-based
 * layout with inline styles throughout - email clients (Outlook especially)
 * don't reliably support flexbox/grid or <style> blocks, so this sticks to
 * the lowest-common-denominator approach that actually renders consistently
 * across Gmail/Outlook/Apple Mail.
 *
 * `rows`: [{ label, value, multiline?, href? }] - value is HTML-escaped
 * automatically; pass multiline: true for long free-text fields so
 * newlines render as <br> instead of being collapsed, or href to render
 * value as a link (e.g. a CV download URL).
 * `cta`: optional { label, url } button (e.g. "View in Admin Panel").
 */
async function renderNotificationEmail({ heading, intro, rows, cta }) {
  const settings = await siteSettingsService.getAll();
  const siteInfo = settings['global.siteInfo'] || {};
  const companyName = siteInfo.companyName || 'Zexora Corporation';
  const logo = siteInfo.logo || '/logo.png';
  const logoUrl = logo.startsWith('http') ? logo : `${config.siteUrl}${logo}`;

  const rowsHtml = rows
    .filter((r) => r.value !== undefined && r.value !== null && r.value !== '')
    .map(
      (r) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #eef0f3;font-size:13px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.04em;vertical-align:top;width:150px;">${escapeHtml(r.label)}</td>
          <td style="padding:10px 0 10px 16px;border-bottom:1px solid #eef0f3;font-size:15px;color:#1a1a1a;line-height:1.6;">${
            r.href
              ? `<a href="${escapeHtml(r.href)}" style="color:#2B2B9B;text-decoration:underline;">${escapeHtml(r.value)}</a>`
              : r.multiline
                ? textToHtml(r.value)
                : escapeHtml(r.value)
          }</td>
        </tr>`
    )
    .join('');

  const ctaHtml = cta
    ? `
        <tr>
          <td style="padding-top:28px;">
            <a href="${escapeHtml(cta.url)}" style="display:inline-block;background:#2B2B9B;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 28px;border-radius:999px;">${escapeHtml(cta.label)}</a>
          </td>
        </tr>`
    : '';

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:#1A1A1A;padding:24px 32px;">
              <img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(companyName)}" height="28" style="height:28px;width:auto;display:block;filter:brightness(0) invert(1);">
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px 32px;">
              <h1 style="margin:0 0 8px;font-size:20px;color:#1a1a1a;">${escapeHtml(heading)}</h1>
              ${intro ? `<p style="margin:0 0 24px;font-size:14px;color:#6b7280;line-height:1.6;">${escapeHtml(intro)}</p>` : '<div style="height:8px;"></div>'}
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${rowsHtml}
              </table>
              <table role="presentation" cellpadding="0" cellspacing="0">${ctaHtml}</table>
            </td>
          </tr>
          <tr>
            <td style="background:#f9fafb;padding:18px 32px;border-top:1px solid #eef0f3;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">Sent automatically from the ${escapeHtml(companyName)} website.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

module.exports = { renderNotificationEmail };
