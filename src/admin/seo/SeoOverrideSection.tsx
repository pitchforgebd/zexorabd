import { useEffect, useState } from 'react';
import { apiFetch, ApiError } from '../../lib/api';
import type { SeoMetaEntry } from '../../lib/types';

type Draft = { title: string; metaDescription: string; ogImage: string; canonicalUrl: string };
const EMPTY: Draft = { title: '', metaDescription: '', ogImage: '', canonicalUrl: '' };

/**
 * Drop-in "SEO Override" card for content that already has good defaults
 * (a division's tagline/cover image, a news post's excerpt/cover image) -
 * see server/src/services/seoResolver.js. Fields left blank here just fall
 * back to those defaults; nothing needs to be filled in unless the admin
 * wants to override.
 */
export default function SeoOverrideSection({ pageKey }: { pageKey: string | null }) {
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!pageKey) return;
    setLoading(true);
    apiFetch<SeoMetaEntry[]>('/api/admin/seo-meta')
      .then((list) => {
        const entry = list.find((e) => e.pageKey === pageKey);
        setDraft({
          title: entry?.title || '',
          metaDescription: entry?.metaDescription || '',
          ogImage: entry?.ogImage || '',
          canonicalUrl: entry?.canonicalUrl || '',
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [pageKey]);

  async function handleSave() {
    if (!pageKey) return;
    setSaving(true);
    try {
      await apiFetch(`/api/admin/seo-meta/${pageKey}`, { method: 'PUT', body: JSON.stringify(draft) });
      setSavedMessage('Saved.');
      setTimeout(() => setSavedMessage(null), 3000);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Failed to save SEO override');
    } finally {
      setSaving(false);
    }
  }

  if (!pageKey) {
    return (
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-primary-dark mb-2">SEO Override (optional)</h2>
        <p className="text-sm text-gray-400">Save this item first to set a custom SEO title/description.</p>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-bold text-primary-dark">SEO Override (optional)</h2>
        {savedMessage && <span className="text-sm text-green-600 font-medium">{savedMessage}</span>}
      </div>
      <p className="text-xs text-gray-400 mb-4">
        Leave any field blank to fall back to sensible defaults derived from the content above.
      </p>
      {loading ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
            <input
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Meta Description</label>
            <textarea
              value={draft.metaDescription}
              onChange={(e) => setDraft((d) => ({ ...d, metaDescription: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Social Preview Image URL</label>
            <input
              value={draft.ogImage}
              onChange={(e) => setDraft((d) => ({ ...d, ogImage: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
            />
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="bg-primary-blue text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save SEO Override'}
          </button>
        </div>
      )}
    </section>
  );
}
