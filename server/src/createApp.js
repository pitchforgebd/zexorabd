const fs = require('fs');
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const config = require('./config');
const sessionMiddleware = require('./session');
const csrf = require('./middleware/csrf');
const { apiLimiter } = require('./middleware/rateLimiters');
const apiRouter = require('./routes');
const sitemapRouter = require('./routes/sitemap');
const robotsRouter = require('./routes/robots');
const seoResolver = require('./services/seoResolver');
const htmlTemplate = require('./services/htmlTemplate');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1); // behind cPanel's Apache/Passenger reverse proxy

  // cPanel terminates TLS at Apache/LiteSpeed in front of the Node app, so
  // req.secure reads X-Forwarded-Proto (trust proxy, above) rather than the
  // raw socket. Only enforced in production - local/dev runs plain HTTP.
  if (config.isProduction) {
    app.use((req, res, next) => {
      if (req.secure) return next();
      return res.redirect(308, `https://${req.headers.host}${req.originalUrl}`);
    });
  }

  // Helmet's default CSP (img-src 'self' data:, connect-src 'self', no
  // frame-src) is fine for pure JSON API responses, but this app also now
  // serves the actual site HTML (Phase 9), which hot-links external images
  // (ibb.co, Unsplash, YouTube/QR-code thumbnails), fetches a topojson file
  // from a CDN for the world map, and embeds a Google Maps iframe on the
  // Contact page. Without loosening these directives every one of those was
  // silently blocked - caught by actually loading pages in a real browser
  // and reading the console, not just by the API tests passing.
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          'img-src': ["'self'", 'data:', 'https:'],
          'connect-src': ["'self'", 'https:'],
          'frame-src': ["'self'", 'https://www.google.com'],
        },
      },
      // Helmet sends this by default regardless of NODE_ENV. Browsers are
      // supposed to ignore Strict-Transport-Security received over plain
      // HTTP (RFC 6797), but not every browser/embedded engine honors that
      // correctly - found via cross-browser QA testing (Phase 12), where it
      // broke every subsequent request in one engine after the first
      // plain-HTTP response. Only meaningful once we're actually on HTTPS.
      hsts: config.isProduction,
    })
  );
  app.use(compression());
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan(config.isProduction ? 'combined' : 'dev'));

  if (config.corsOrigin.length > 0) {
    app.use(cors({ origin: config.corsOrigin, credentials: true }));
  }

  app.use(cookieParser());
  app.use(sessionMiddleware);
  app.use('/api', csrf);
  app.use('/api', apiLimiter);

  // Uploaded filenames are randomized per-file (crypto.randomBytes) and
  // never reused, so a far-future immutable cache is safe - a URL either
  // 404s or always resolves to the exact same bytes.
  app.use(
    '/uploads',
    express.static(config.uploadsDir, { maxAge: '1y', immutable: true })
  );
  app.use('/api', apiRouter);
  app.use(sitemapRouter);
  app.use(robotsRouter);

  // In production the Node app serves the built frontend directly (not
  // split between Apache-static + Node-API) so it can inject per-route SEO
  // meta into index.html before sending it - see phases.md Phase 9/0.
  const distExists = fs.existsSync(config.distDir);
  if (distExists) {
    app.use(
      express.static(config.distDir, {
        index: false,
        setHeaders: (res, filePath) => {
          // Vite fingerprints everything under assets/ (index-<hash>.js) so
          // those are safe to cache forever; a content change ships under a
          // new filename. Anything else in dist (favicon, robots.txt, etc.)
          // gets a short cache instead since it isn't fingerprinted.
          if (filePath.includes(`${path.sep}assets${path.sep}`)) {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          } else {
            res.setHeader('Cache-Control', 'public, max-age=3600');
          }
        },
      })
    );
  }

  // SPA fallback for everything else, with server-rendered SEO meta. Always
  // fresh - this is the one response whose content (per-route SEO tags)
  // must never be served stale from a cache.
  app.get('*', async (req, res, next) => {
    if (!distExists || !htmlTemplate.templateExists()) {
      return next(); // no build available (e.g. running the API alone in dev) - fall through to 404
    }
    try {
      // /admin/* is its own SPA subtree with its own client-side routing
      // and auth gating (ProtectedRoute) - seoResolver only knows the
      // public route list, so it would otherwise treat every admin page as
      // "not found" and serve it with an incorrect 404 status even though
      // it renders and works fine. Always 200 here; robots.txt already
      // disallows /admin/ for crawlers regardless.
      const isAdminPath = req.path === '/admin' || req.path.startsWith('/admin/');
      const meta = await seoResolver.resolveForPath(req.path);
      res.status(!isAdminPath && meta.notFound ? 404 : 200);
      res.set('Content-Type', 'text/html');
      res.set('Cache-Control', 'no-store');
      // Belt-and-suspenders alongside robots.txt's Disallow: /admin/ - a
      // noindex meta tag also stops an already-indexed admin URL (e.g. one
      // crawled before robots.txt existed) from lingering in search results.
      return res.send(htmlTemplate.renderPage(isAdminPath ? { ...meta, noIndex: true } : meta));
    } catch (err) {
      return next(err);
    }
  });

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
