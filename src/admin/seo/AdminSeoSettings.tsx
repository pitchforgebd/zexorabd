import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { apiFetch, ApiError } from '../../lib/api';
import type { SeoMetaEntry } from '../../lib/types';

const STATIC_PAGES: { key: string; label: string; path: string }[] = [
  { key: 'home', label: 'Home', path: '/' },
  { key: 'about', label: 'About Us', path: '/about' },
  { key: 'ceo-message', label: 'CEO Message', path: '/ceo-message' },
  { key: 'vision-mission', label: 'Vision & Mission', path: '/vision-mission' },
  { key: 'divisions-list', label: 'Divisions (Listing Page)', path: '/divisions' },
  { key: 'global-sourcing', label: 'Global Sourcing', path: '/global-sourcing' },
  { key: 'our-story', label: 'Our Story', path: '/our-story' },
  { key: 'company', label: 'Company', path: '/company' },
  { key: 'career', label: 'Career', path: '/career' },
  { key: 'media-centre', label: 'Media Centre (Hub)', path: '/media-centre' },
  { key: 'media-centre-news', label: 'Media Centre — News', path: '/media-centre/news' },
  { key: 'media-centre-photos', label: 'Media Centre — Photo Gallery', path: '/media-centre/photo-gallery' },
  { key: 'media-centre-videos', label: 'Media Centre — Video Gallery', path: '/media-centre/video-gallery' },
  { key: 'contact', label: 'Contact', path: '/contact' },
];

type Draft = { title: string; metaDescription: string; ogImage: string; canonicalUrl: string };

function toDraft(entry: SeoMetaEntry | undefined): Draft {
  return {
    title: entry?.title || '',
    metaDescription: entry?.metaDescription || '',
    ogImage: entry?.ogImage || '',
    canonicalUrl: entry?.canonicalUrl || '',
  };
}

export default function AdminSeoSettings() {
  const [entries, setEntries] = useState<Record<string, SeoMetaEntry>>({});
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<SeoMetaEntry[]>('/api/admin/seo-meta')
      .then((list) => {
        const byKey: Record<string, SeoMetaEntry> = {};
        for (const e of list) byKey[e.pageKey] = e;
        setEntries(byKey);
        const initialDrafts: Record<string, Draft> = {};
        for (const page of STATIC_PAGES) initialDrafts[page.key] = toDraft(byKey[page.key]);
        setDrafts(initialDrafts);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load SEO settings'))
      .finally(() => setLoading(false));
  }, []);

  function updateDraft(key: string, patch: Partial<Draft>) {
    setDrafts((d) => ({ ...d, [key]: { ...d[key], ...patch } }));
  }

  async function handleSave(key: string) {
    setSaving(key);
    try {
      const updated = await apiFetch<SeoMetaEntry>(`/api/admin/seo-meta/${key}`, {
        method: 'PUT',
        body: JSON.stringify(drafts[key]),
      });
      setEntries((e) => ({ ...e, [key]: updated }));
      setSavedKey(key);
      setTimeout(() => setSavedKey(null), 3000);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Failed to save');
    } finally {
      setSaving(null);
    }
  }

  if (loading) return <p className="text-body-text">Loading…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-3xl">
      <Link to="/admin/seo" className="text-sm text-body-text hover:text-primary-blue mb-2 inline-block">← SEO</Link>
      <h1 className="text-2xl font-bold text-primary-dark">Page SEO</h1>
      <p className="text-body-text text-sm mb-2">
        Per-page title, description, and social preview image. These are what search engines and links shared on
        WhatsApp/Facebook/LinkedIn actually see.
      </p>
      <p className="text-xs text-gray-400 mb-6">
        Division and news post SEO is edited on their own pages (in the "SEO Override" section), not here.
      </p>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100">
        {STATIC_PAGES.map((page) => {
          const draft = drafts[page.key] || toDraft(undefined);
          const isExpanded = expandedKey === page.key;
          return (
            <div key={page.key}>
              <button
                onClick={() => setExpandedKey(isExpanded ? null : page.key)}
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-light-gray/50"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-primary-dark">{page.label}</p>
                  <p className="text-xs text-gray-400 truncate">{entries[page.key]?.title || '(using site default)'}</p>
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                    <input
                      value={draft.title}
                      onChange={(e) => updateDraft(page.key, { title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Meta Description</label>
                    <textarea
                      value={draft.metaDescription}
                      onChange={(e) => updateDraft(page.key, { metaDescription: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Social Preview Image URL (optional)</label>
                    <input
                      value={draft.ogImage}
                      onChange={(e) => updateDraft(page.key, { ogImage: e.target.value })}
                      placeholder="Leave blank to use the site logo"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Canonical URL (optional)</label>
                    <input
                      value={draft.canonicalUrl}
                      onChange={(e) => updateDraft(page.key, { canonicalUrl: e.target.value })}
                      placeholder={`Leave blank to use https://zexora.com.bd${page.path}`}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleSave(page.key)}
                      disabled={saving === page.key}
                      className="bg-primary-blue text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60"
                    >
                      {saving === page.key ? 'Saving…' : 'Save'}
                    </button>
                    {savedKey === page.key && <span className="text-sm text-green-600 font-medium">Saved.</span>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
