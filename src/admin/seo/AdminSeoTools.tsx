import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, RefreshCw } from 'lucide-react';
import { apiFetch, ApiError } from '../../lib/api';
import type { SeoToolsContent, SiteSettings } from '../../lib/types';

const EMPTY: SeoToolsContent = {
  robotsTxt: '',
  googleAnalyticsId: '',
  googleTagManagerId: '',
  googleSearchConsoleVerification: '',
  customHeadCode: '',
};

const DEFAULT_ROBOTS_TXT = 'User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: https://zexora.com.bd/sitemap.xml\n';

function SavedBadge({ message }: { message: string | null }) {
  if (!message) return null;
  return <span className="text-sm text-green-600 font-medium">{message}</span>;
}

export default function AdminSeoTools() {
  const [tools, setTools] = useState<SeoToolsContent>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [savedRobots, setSavedRobots] = useState<string | null>(null);
  const [savedTracking, setSavedTracking] = useState<string | null>(null);
  const [sitemapCount, setSitemapCount] = useState<number | null>(null);
  const [sitemapChecking, setSitemapChecking] = useState(false);

  useEffect(() => {
    apiFetch<SiteSettings>('/api/admin/site-settings')
      .then((settings) => {
        const saved = settings['global.seoTools'];
        setTools(saved ? { ...EMPTY, ...saved } : { ...EMPTY, robotsTxt: DEFAULT_ROBOTS_TXT });
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load SEO tools'))
      .finally(() => setLoading(false));
    checkSitemap();
  }, []);

  function checkSitemap() {
    setSitemapChecking(true);
    fetch('/sitemap.xml')
      .then((r) => r.text())
      .then((xml) => setSitemapCount((xml.match(/<url>/g) || []).length))
      .catch(() => setSitemapCount(null))
      .finally(() => setSitemapChecking(false));
  }

  async function saveKey(key: 'robotsTxt' | 'tracking', setSavedMsg: (m: string | null) => void) {
    setSaving(key);
    try {
      await apiFetch('/api/admin/site-settings/global.seoTools', { method: 'PUT', body: JSON.stringify({ value: tools }) });
      setSavedMsg('Saved.');
      setTimeout(() => setSavedMsg(null), 3000);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Failed to save');
    } finally {
      setSaving(null);
    }
  }

  if (loading) return <p className="text-body-text">Loading…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <Link to="/admin/seo" className="text-sm text-body-text hover:text-primary-blue mb-2 inline-block">← SEO</Link>
        <h1 className="text-2xl font-bold text-primary-dark">SEO Tools</h1>
        <p className="text-body-text text-sm">Sitemap, robots.txt, and site-wide tracking/verification codes.</p>
      </div>

      {/* Sitemap */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-primary-dark mb-2">Sitemap</h2>
        <p className="text-sm text-body-text mb-4">
          Your sitemap is generated automatically and always up to date — every time a page, division, or news post
          changes, the sitemap reflects it immediately. There's nothing to manually regenerate.
        </p>
        <div className="flex items-center gap-3">
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary-blue hover:text-accent-hover border border-primary-blue/30 rounded-lg px-4 py-2"
          >
            <ExternalLink className="w-4 h-4" /> View sitemap.xml
          </a>
          <button
            onClick={checkSitemap}
            disabled={sitemapChecking}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary-blue border border-gray-200 rounded-lg px-4 py-2 disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${sitemapChecking ? 'animate-spin' : ''}`} /> Check now
          </button>
          {sitemapCount !== null && <span className="text-sm text-gray-500">{sitemapCount} URLs currently listed</span>}
        </div>
      </section>

      {/* robots.txt */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold text-primary-dark">robots.txt</h2>
          <div className="flex items-center gap-3">
            <SavedBadge message={savedRobots} />
            <button
              onClick={() => saveKey('robotsTxt', setSavedRobots)}
              disabled={saving === 'robotsTxt'}
              className="bg-primary-blue text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60"
            >
              {saving === 'robotsTxt' ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
        <p className="text-sm text-body-text mb-3">
          Controls which parts of the site search engines are allowed to crawl. Be careful editing this — a mistake
          here can accidentally block the whole site from Google.
        </p>
        <textarea
          value={tools.robotsTxt}
          onChange={(e) => setTools((t) => ({ ...t, robotsTxt: e.target.value }))}
          rows={8}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-mono resize-y"
          placeholder={DEFAULT_ROBOTS_TXT}
        />
        <a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-primary-blue hover:text-accent-hover mt-2">
          <ExternalLink className="w-3 h-3" /> View live robots.txt
        </a>
      </section>

      {/* Tracking & Verification */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-primary-dark">Tracking & Verification</h2>
          <div className="flex items-center gap-3">
            <SavedBadge message={savedTracking} />
            <button
              onClick={() => saveKey('tracking', setSavedTracking)}
              disabled={saving === 'tracking'}
              className="bg-primary-blue text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60"
            >
              {saving === 'tracking' ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
        <p className="text-sm text-body-text">
          Paste just the ID from each service — the correct tracking code is generated automatically. Leave a field
          blank to disable it. Changes apply site-wide on every page.
        </p>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Google Search Console — verification code</label>
          <input
            value={tools.googleSearchConsoleVerification}
            onChange={(e) => setTools((t) => ({ ...t, googleSearchConsoleVerification: e.target.value }))}
            placeholder="e.g. AbCdEfGhIjKlMnOpQrStUvWxYz1234567890"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-mono"
          />
          <p className="text-xs text-gray-400 mt-1">
            In Search Console: Settings → Ownership verification → HTML tag method → copy just the `content="..."` value.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Google Analytics (GA4) — Measurement ID</label>
          <input
            value={tools.googleAnalyticsId}
            onChange={(e) => setTools((t) => ({ ...t, googleAnalyticsId: e.target.value }))}
            placeholder="G-XXXXXXXXXX"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-mono"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Google Tag Manager — Container ID</label>
          <input
            value={tools.googleTagManagerId}
            onChange={(e) => setTools((t) => ({ ...t, googleTagManagerId: e.target.value }))}
            placeholder="GTM-XXXXXXX"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-mono"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Custom Code (advanced)</label>
          <textarea
            value={tools.customHeadCode}
            onChange={(e) => setTools((t) => ({ ...t, customHeadCode: e.target.value }))}
            rows={5}
            placeholder="<!-- Any other verification meta tag or <script> to inject on every page -->"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-mono resize-y"
          />
          <p className="text-xs text-gray-400 mt-1">
            For anything not covered above (Facebook Pixel, another analytics tool, etc). This is inserted exactly as
            typed, so only paste code you trust.
          </p>
        </div>
      </section>
    </div>
  );
}
