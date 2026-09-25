const fs = require('fs');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const config = require('./config');
const sessionMiddleware = require('./session');
const csrf = require('./middleware/csrf');
const apiRouter = require('./routes');
const sitemapRouter = require('./routes/sitemap');
const seoResolver = require('./services/seoResolver');
const htmlTemplate = require('./services/htmlTemplate');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1); // behind cPanel's Apache/Passenger reverse proxy

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

  app.use('/uploads', express.static(config.uploadsDir));
  app.use('/api', apiRouter);
  app.use(sitemapRouter);

  // In production the Node app serves the built frontend directly (not
  // split between Apache-static + Node-API) so it can inject per-route SEO
  // meta into index.html before sending it - see phases.md Phase 9/0.
  const distExists = fs.existsSync(config.distDir);
  if (distExists) {
    app.use(express.static(config.distDir, { index: false }));
  }

  // SPA fallback for everything else, with server-rendered SEO meta.
  app.get('*', async (req, res, next) => {
    if (!distExists || !htmlTemplate.templateExists()) {
      return next(); // no build available (e.g. running the API alone in dev) - fall through to 404
    }
    try {
      const meta = await seoResolver.resolveForPath(req.path);
      res.set('Content-Type', 'text/html');
      return res.send(htmlTemplate.renderPage(meta));
    } catch (err) {
      return next(err);
    }
  });

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
