import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch, ApiError } from '../../lib/api';
import type { AboutContent, SiteSettings } from '../../lib/types';
import { ParagraphListEditor, IconItemsEditor } from './editors';

const EMPTY: AboutContent = {
  hero: { title: '', subtitle: '' },
  whoWeAre: { heading: '', paragraphs: [] },
  divisionsSection: { heading: '', description: '', items: [] },
  competitiveAdvantage: { heading: '', paragraphs: [] },
  ourVision: { heading: '', paragraphs: [] },
};

export default function AdminAboutPage() {
  const [c, setC] = useState<AboutContent>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<SiteSettings>('/api/admin/site-settings')
      .then((settings) => {
        if (settings['page.about']) setC(settings['page.about']);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load content'))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setSavedMsg(null);
    try {
      await apiFetch('/api/admin/site-settings/page.about', { method: 'PUT', body: JSON.stringify({ value: c }) });
      setSavedMsg('Saved.');
      setTimeout(() => setSavedMsg(null), 3000);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-body-text">Loading…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-8 max-w-3xl">
      <Link to="/admin/pages" className="text-sm text-body-text hover:text-primary-blue mb-2 inline-block">← Static Pages</Link>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">About Page</h1>
          <p className="text-body-text text-sm">/about</p>
        </div>
        <div className="flex items-center gap-3">
          {savedMsg && <span className="text-sm text-green-600 font-medium">{savedMsg}</span>}
          <button onClick={handleSave} disabled={saving} className="bg-primary-blue text-white px-5 py-2.5 rounded-xl font-medium hover:bg-accent-hover transition-colors text-sm disabled:opacity-60">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
        <h2 className="font-bold text-primary-dark">Hero</h2>
        <input value={c.hero.title} onChange={(e) => setC({ ...c, hero: { ...c.hero, title: e.target.value } })} placeholder="Title" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
        <input value={c.hero.subtitle} onChange={(e) => setC({ ...c, hero: { ...c.hero, subtitle: e.target.value } })} placeholder="Subtitle" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
        <h2 className="font-bold text-primary-dark">Who We Are</h2>
        <input value={c.whoWeAre.heading} onChange={(e) => setC({ ...c, whoWeAre: { ...c.whoWeAre, heading: e.target.value } })} placeholder="Heading" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
        <ParagraphListEditor label="Paragraphs" items={c.whoWeAre.paragraphs} onChange={(paragraphs) => setC({ ...c, whoWeAre: { ...c.whoWeAre, paragraphs } })} />
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
        <h2 className="font-bold text-primary-dark">Business Divisions Grid</h2>
        <input value={c.divisionsSection.heading} onChange={(e) => setC({ ...c, divisionsSection: { ...c.divisionsSection, heading: e.target.value } })} placeholder="Heading" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
        <textarea value={c.divisionsSection.description} onChange={(e) => setC({ ...c, divisionsSection: { ...c.divisionsSection, description: e.target.value } })} placeholder="Description" rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-y" />
        <IconItemsEditor label="Division Items" items={c.divisionsSection.items} onChange={(items) => setC({ ...c, divisionsSection: { ...c.divisionsSection, items } })} />
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
        <h2 className="font-bold text-primary-dark">Competitive Advantage</h2>
        <input value={c.competitiveAdvantage.heading} onChange={(e) => setC({ ...c, competitiveAdvantage: { ...c.competitiveAdvantage, heading: e.target.value } })} placeholder="Heading" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
        <ParagraphListEditor label="Paragraphs" items={c.competitiveAdvantage.paragraphs} onChange={(paragraphs) => setC({ ...c, competitiveAdvantage: { ...c.competitiveAdvantage, paragraphs } })} />
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
        <h2 className="font-bold text-primary-dark">Our Vision</h2>
        <input value={c.ourVision.heading} onChange={(e) => setC({ ...c, ourVision: { ...c.ourVision, heading: e.target.value } })} placeholder="Heading" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
        <ParagraphListEditor label="Paragraphs" items={c.ourVision.paragraphs} onChange={(paragraphs) => setC({ ...c, ourVision: { ...c.ourVision, paragraphs } })} />
      </section>
    </div>
  );
}
