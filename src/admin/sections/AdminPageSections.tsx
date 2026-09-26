import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { apiFetch, ApiError } from '../../lib/api';
import type { PageSection } from '../../lib/types';

// Flat rather than per-page: several pages share a section_key (e.g. every
// page has a "hero"), and the same label reads correctly on all of them -
// no need for a page-scoped label map.
const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero Banner',
  'about-snapshot': 'About Snapshot (Who We Are + Stats)',
  'divisions-grid': 'Business Divisions Grid',
  'why-choose-us': 'Why Choose Us',
  industries: 'Industries We Serve',
  'global-sourcing': 'Global Sourcing Network',
  suppliers: 'Supplier Logos',
  'sister-concerns': 'Sister Concerns',
  'vision-mission': 'Vision & Mission Snapshot',
  cta: 'Call to Action Banner',
  'who-we-are': 'Who We Are',
  'competitive-advantage': 'Competitive Advantage',
  'our-vision': 'Our Vision',
  message: "CEO's Message (photo + timeline)",
  'vision-mission-text': 'Vision & Mission Text',
  'core-values': 'Core Values',
  'intro-map': 'Intro & World Map',
  countries: 'Countries We Source From',
  'business-models': 'Business Models',
  'commitment-cta': 'Sourcing Commitment & CTA',
};

const PAGE_OPTIONS = [
  { key: 'home', label: 'Home' },
  { key: 'about', label: 'About' },
  { key: 'ceo-message', label: 'CEO Message' },
  { key: 'vision-mission', label: 'Vision & Mission' },
  { key: 'global-sourcing', label: 'Global Sourcing' },
];

const VARIANT_OPTIONS: Record<string, { value: string; label: string }[]> = {
  hero: [
    { value: 'slider', label: 'Rotating Slider' },
    { value: 'static', label: 'Static Banner (first slide only)' },
  ],
  'divisions-grid': [
    { value: 'cards', label: 'Large Image Cards' },
    { value: 'compact', label: 'Compact Icon Grid' },
  ],
  'why-choose-us': [
    { value: 'grid', label: '4-Column Icon Grid' },
    { value: 'list', label: 'Vertical Checklist' },
  ],
};

export default function AdminPageSections() {
  const [pageKey, setPageKey] = useState('home');
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  function load(key: string) {
    setLoading(true);
    setError(null);
    apiFetch<PageSection[]>(`/api/admin/pages/${key}/sections`)
      .then((data) => setSections([...data].sort((a, b) => a.sortOrder - b.sortOrder)))
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load sections'))
      .finally(() => setLoading(false));
  }

  useEffect(() => load(pageKey), [pageKey]);

  function toggleVisible(key: string) {
    setSections((s) => s.map((sec) => (sec.sectionKey === key ? { ...sec, isVisible: !sec.isVisible } : sec)));
  }

  function setVariant(key: string, variant: string) {
    setSections((s) => s.map((sec) => (sec.sectionKey === key ? { ...sec, layoutVariant: variant } : sec)));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;
    const reordered = [...sections];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setSections(reordered);
  }

  async function handleSave() {
    setSaving(true);
    setSavedMessage(null);
    try {
      const payload = sections.map((s, idx) => ({
        sectionKey: s.sectionKey,
        isVisible: s.isVisible,
        sortOrder: idx,
        layoutVariant: s.layoutVariant,
        config: s.config,
      }));
      await apiFetch(`/api/admin/pages/${pageKey}/sections`, { method: 'PUT', body: JSON.stringify({ sections: payload }) });
      setSavedMessage('Saved.');
      setTimeout(() => setSavedMessage(null), 3000);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">Page Sections</h1>
          <p className="text-body-text text-sm">Show/hide, reorder, and switch layout styles — no code changes needed.</p>
        </div>
        <div className="flex items-center gap-3">
          {savedMessage && <span className="text-sm text-green-600 font-medium">{savedMessage}</span>}
          <button
            onClick={handleSave}
            disabled={saving || loading || !!error}
            className="bg-primary-blue text-white px-5 py-2.5 rounded-xl font-medium hover:bg-accent-hover transition-colors text-sm disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-5">
        {PAGE_OPTIONS.map((p) => (
          <button
            key={p.key}
            onClick={() => setPageKey(p.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              pageKey === p.key ? 'bg-primary-blue text-white' : 'bg-white text-body-text border border-gray-200 hover:border-primary-blue/40'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {loading && <p className="text-body-text mt-6">Loading…</p>}
      {error && <p className="text-red-600 mt-6">{error}</p>}

      {!loading && !error && (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100 mt-6">
        {sections.map((section, idx) => {
          const variants = VARIANT_OPTIONS[section.sectionKey];
          return (
            <div key={section.sectionKey} className={`flex items-center gap-4 p-4 ${section.isVisible ? '' : 'bg-gray-50/50'}`}>
              <div className="flex flex-col text-gray-300">
                <button disabled={idx === 0} onClick={() => move(idx, -1)} className="disabled:opacity-20 hover:text-primary-blue">▲</button>
                <button disabled={idx === sections.length - 1} onClick={() => move(idx, 1)} className="disabled:opacity-20 hover:text-primary-blue">▼</button>
              </div>

              <div className="flex-1 min-w-0">
                <p className={`font-medium ${section.isVisible ? 'text-primary-dark' : 'text-gray-400'}`}>
                  {SECTION_LABELS[section.sectionKey] || section.sectionKey}
                </p>
              </div>

              {variants && (
                <select
                  value={section.layoutVariant}
                  onChange={(e) => setVariant(section.sectionKey, e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700"
                >
                  {variants.map((v) => (
                    <option key={v.value} value={v.value}>{v.label}</option>
                  ))}
                </select>
              )}

              <button
                onClick={() => toggleVisible(section.sectionKey)}
                className={`p-2 rounded-lg ${section.isVisible ? 'text-primary-blue hover:bg-blue-50' : 'text-gray-400 hover:bg-gray-100'}`}
                title={section.isVisible ? 'Visible — click to hide' : 'Hidden — click to show'}
              >
                {section.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}
