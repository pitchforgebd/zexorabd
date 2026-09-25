const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

module.exports = {
  env: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  port: Number(process.env.PORT) || 3001,

  db: {
    host: required('DB_HOST', '127.0.0.1'),
    port: Number(process.env.DB_PORT) || 3306,
    user: required('DB_USER', 'root'),
    password: process.env.DB_PASSWORD || '',
    database: required('DB_NAME', 'zexora_cms'),
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
  },

  corsOrigin: (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),

  session: {
    secret: process.env.SESSION_SECRET || 'dev-only-insecure-secret',
  },

  mail: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASSWORD || '',
    from: process.env.MAIL_FROM || '',
    to: process.env.MAIL_TO || '',
  },

  uploadsDir: path.resolve(__dirname, '../../uploads'),

  // Used to build absolute canonical/OG URLs and the sitemap. Override via
  // .env once the real domain is live; this default matches the site's
  // existing robots.txt/sitemap.xml references.
  siteUrl: (process.env.SITE_URL || 'https://zexora.com.bd').replace(/\/$/, ''),

  // Where the built frontend lives, so the Node app can serve it directly
  // and inject per-route SEO meta into index.html before sending it (see
  // Phase 0's revised decision in phases.md: everything is served by the
  // Node app in production, not split between Apache-static and Node-API).
  distDir: path.resolve(__dirname, '../../../dist'),
};
