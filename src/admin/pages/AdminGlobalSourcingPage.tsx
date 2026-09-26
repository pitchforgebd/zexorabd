import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { apiFetch, ApiError } from '../../lib/api';
import type { GlobalSourcingContent, SiteSettings } from '../../lib/types';
import { TitledIconItemsEditor } from './editors';
import StringListEditor from '../divisions/StringListEditor';

const EMPTY: GlobalSourcingContent = {
  hero: { title: '', subtitle: '' },
  intro: {
    eyebrow: '',
    heading: '',
    description: '',
    stat1Value: '',
    stat1Label: '',
    stat2Value: '',
    stat2Label: '',
    mapCalloutHeading: '',
    mapCalloutText: '',
  },
  countries: { heading: '', subheading: '', items: [] },
  businessModels: { heading: '', items: [] },
  commitment: { heading: '', items: [] },
  cta: { heading: '', text: '' },
};

export default function AdminGlobalSourcingPage() {
  const [c, setC] = useState<GlobalSourcingContent>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<SiteSettings>('/api/admin/site-settings')
      .then((settings) => {
        if (settings['page.globalSourcing']) setC(settings['page.globalSourcing']);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load content'))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setSavedMsg(null);
    try {
      await apiFetch('/api/admin/site-settings/page.globalSourcing', { method: 'PUT', body: JSON.stringify({ value: c }) });
      setSavedMsg('Saved.');
      setTimeout(() => setSavedMsg(null), 3000);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  function updateCountry(i: number, patch: Partial<{ flag: string; name: string; items: string }>) {
    setC((prev) => ({ ...prev, countries: { ...prev.countries, items: prev.countries.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) } }));
  }
  function removeCountry(i: number) {
    setC((prev) => ({ ...prev, countries: { ...prev.countries, items: prev.countries.items.filter((_, idx) => idx !== i) } }));
  }

  if (loading) return <p className="text-body-text">Loading…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-8 max-w-3xl">
      <Link to="/admin/pages" className="text-sm text-body-text hover:text-primary-blue mb-2 inline-block">← Static Pages</Link>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">Global Sourcing Page</h1>
          <p className="text-body-text text-sm">/global-sourcing</p>
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
        <h2 className="font-bold text-primary-dark">Intro & Map Callout</h2>
        <input value={c.intro.eyebrow} onChange={(e) => setC({ ...c, intro: { ...c.intro, eyebrow: e.target.value } })} placeholder="Eyebrow" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
        <input value={c.intro.heading} onChange={(e) => setC({ ...c, intro: { ...c.intro, heading: e.target.value } })} placeholder="Heading" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
        <textarea value={c.intro.description} onChange={(e) => setC({ ...c, intro: { ...c.intro, description: e.target.value } })} rows={4} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-y" />
        <div className="grid grid-cols-2 gap-3">
          <input value={c.intro.stat1Value} onChange={(e) => setC({ ...c, intro: { ...c.intro, stat1Value: e.target.value } })} placeholder="Stat 1 value (e.g. 9+)" className="px-3 py-2 rounded-lg border border-gray-200 text-sm" />
          <input value={c.intro.stat1Label} onChange={(e) => setC({ ...c, intro: { ...c.intro, stat1Label: e.target.value } })} placeholder="Stat 1 label" className="px-3 py-2 rounded-lg border border-gray-200 text-sm" />
          <input value={c.intro.stat2Value} onChange={(e) => setC({ ...c, intro: { ...c.intro, stat2Value: e.target.value } })} placeholder="Stat 2 value (e.g. 100%)" className="px-3 py-2 rounded-lg border border-gray-200 text-sm" />
          <input value={c.intro.stat2Label} onChange={(e) => setC({ ...c, intro: { ...c.intro, stat2Label: e.target.value } })} placeholder="Stat 2 label" className="px-3 py-2 rounded-lg border border-gray-200 text-sm" />
        </div>
        <input value={c.intro.mapCalloutHeading} onChange={(e) => setC({ ...c, intro: { ...c.intro, mapCalloutHeading: e.target.value } })} placeholder="Map callout heading (e.g. Global Reach)" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
        <textarea value={c.intro.mapCalloutText} onChange={(e) => setC({ ...c, intro: { ...c.intro, mapCalloutText: e.target.value } })} rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-y" />
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
        <h2 className="font-bold text-primary-dark">Countries We Source From</h2>
        <input value={c.countries.heading} onChange={(e) => setC({ ...c, countries: { ...c.countries, heading: e.target.value } })} placeholder="Heading" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
        <input value={c.countries.subheading} onChange={(e) => setC({ ...c, countries: { ...c.countries, subheading: e.target.value } })} placeholder="Subheading" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
        <div className="space-y-2">
          {c.countries.items.map((country, i) => (
            <div key={i} className="flex gap-2 items-start border border-gray-200 rounded-xl p-3">
              <input value={country.flag} onChange={(e) => updateCountry(i, { flag: e.target.value })} placeholder="🇨🇳" className="w-16 px-2 py-2 rounded-lg border border-gray-200 text-sm text-center" />
              <div className="flex-1 space-y-2">
                <input value={country.name} onChange={(e) => updateCountry(i, { name: e.target.value })} placeholder="Country name" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
                <input value={country.items} onChange={(e) => updateCountry(i, { items: e.target.value })} placeholder="What's sourced from here" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
              </div>
              <button type="button" onClick={() => removeCountry(i)} className="text-gray-400 hover:text-red-600 px-2">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setC((prev) => ({ ...prev, countries: { ...prev.countries, items: [...prev.countries.items, { flag: '', name: '', items: '' }] } }))}
          className="flex items-center gap-1 text-xs font-medium text-primary-blue hover:text-accent-hover"
        >
          <Plus className="w-3.5 h-3.5" /> Add country
        </button>
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
        <h2 className="font-bold text-primary-dark">Business Models</h2>
        <input value={c.businessModels.heading} onChange={(e) => setC({ ...c, businessModels: { ...c.businessModels, heading: e.target.value } })} placeholder="Heading" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
        <TitledIconItemsEditor label="Models" items={c.businessModels.items} onChange={(items) => setC({ ...c, businessModels: { ...c.businessModels, items } })} />
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
        <h2 className="font-bold text-primary-dark">Sourcing Commitment</h2>
        <input value={c.commitment.heading} onChange={(e) => setC({ ...c, commitment: { ...c.commitment, heading: e.target.value } })} placeholder="Heading" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
        <StringListEditor label="Commitments" items={c.commitment.items} onChange={(items) => setC({ ...c, commitment: { ...c.commitment, items } })} />
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
        <h2 className="font-bold text-primary-dark">Closing CTA</h2>
        <input value={c.cta.heading} onChange={(e) => setC({ ...c, cta: { ...c.cta, heading: e.target.value } })} placeholder="Heading" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
        <textarea value={c.cta.text} onChange={(e) => setC({ ...c, cta: { ...c.cta, text: e.target.value } })} rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-y" />
      </section>
    </div>
  );
}
