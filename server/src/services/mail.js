const nodemailer = require('nodemailer');
const config = require('../config');

let transporter = null;
if (config.mail.host && config.mail.user) {
  transporter = nodemailer.createTransport({
    host: config.mail.host,
    port: config.mail.port,
    secure: config.mail.port === 465,
    auth: { user: config.mail.user, pass: config.mail.password },
  });
}

/**
 * Best-effort notification email. Never throws — a form submission must
 * succeed (the DB row is the source of truth; admin can always see it in
 * the panel) even if SMTP isn't configured yet or the send fails.
 */
async function sendMail({ subject, text }) {
  if (!transporter) {
    // eslint-disable-next-line no-console
    console.warn(`[mail] SMTP not configured - skipping email send: "${subject}"`);
    return { sent: false };
  }
  try {
    await transporter.sendMail({
      from: config.mail.from || config.mail.user,
      to: config.mail.to || config.mail.user,
      subject,
      text,
    });
    return { sent: true };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[mail] Failed to send email:', err.message);
    return { sent: false, error: err.message };
  }
}

module.exports = { sendMail };
