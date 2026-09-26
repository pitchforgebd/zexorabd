import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';

// index.html carries %%SEO_*%% tokens that the Node server (server/src/
// createApp.js) substitutes per-request in production. Vite's own dev
// server never goes through that code, so without this plugin the tokens
// would render literally (e.g. the browser tab would show "%%SEO_TITLE%%").
// This just fills in sensible static defaults for local development.
function devSeoPlaceholders(): Plugin {
  return {
    name: 'dev-seo-placeholders',
    apply: 'serve', // dev server only - the production build must keep the raw tokens for Express to substitute
    transformIndexHtml(html) {
      return html
        .replace(/%%SEO_TITLE%%/g, 'Zexora Corporation | Diversified Multi-Sector Business Group Bangladesh')
        .replace(
          /%%SEO_DESCRIPTION%%/g,
          'Zexora Corporation is a leading diversified business group in Bangladesh offering industrial chemicals, printing solutions, global sourcing, logistics, garments, power solutions and more.'
        )
        .replace(/%%SEO_CANONICAL%%/g, 'https://zexora.com.bd/')
        .replace(/%%SEO_OG_IMAGE%%/g, 'https://zexora.com.bd/logo.png')
        .replace(/%%SEO_FAVICON%%/g, '/favicon.png')
        .replace(/%%SEO_JSONLD%%/g, '')
        .replace(/%%SEO_TRACKING%%/g, '');
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), devSeoPlaceholders()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      // Dev-only proxy to the Node/Express API (server/), so the frontend
      // can call relative /api and /uploads paths exactly as it will in
      // production on cPanel (same-origin, reverse-proxied by Passenger).
      proxy: {
        '/api': { target: 'http://localhost:3001', changeOrigin: true },
        '/uploads': { target: 'http://localhost:3001', changeOrigin: true },
      },
    },
  };
});
