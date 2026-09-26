import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch, ApiError } from '../../lib/api';
import type { VisionMissionContent, SiteSettings } from '../../lib/types';
import { IconItemsEditor, TitledIconItemsEditor, TitledItemsEditor } from './editors';
import StringListEditor from '../divisions/StringListEditor';

const EMPTY: VisionMissionContent = {
  hero: { title: '', subtitle: '' },
  vision: { heading: '', text: '' },
  mission: { heading: '', intro: '', commitmentHeading: '', commitments: [] },
  coreValues: { heading: '', items: [] },
  whyChooseUs: { heading: '', items: [] },
  industries: { heading: '', items: [] },
};

export default function AdminVisionMissionPage() {
  const [c, setC] = useState<VisionMissionContent>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<SiteSettings>('/api/admin/site-settings')
      .then((settings) => {
        if (settings['page.visionMission']) setC(settings['page.visionMission']);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load content'))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setSavedMsg(null);
    try {
      await apiFetch('/api/admin/site-settings/page.visionMission', { method: 'PUT', body: JSON.stringify({ value: c }) });
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
          <h1 className="text-2xl font-bold text-primary-dark">Vision & Mission Page</h1>
          <p className="text-body-text text-sm">/vision-mission</p>
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
        <h2 className="font-bold text-primary-dark">Vision</h2>
        <input value={c.vision.heading} onChange={(e) => setC({ ...c, vision: { ...c.vision, heading: e.target.value } })} placeholder="Heading" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
        <textarea value={c.vision.text} onChange={(e) => setC({ ...c, vision: { ...c.vision, text: e.target.value } })} rows={5} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-y" />
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
        <h2 className="font-bold text-primary-dark">Mission</h2>
        <input value={c.mission.heading} onChange={(e) => setC({ ...c, mission: { ...c.mission, heading: e.target.value } })} placeholder="Heading" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
        <textarea value={c.mission.intro} onChange={(e) => setC({ ...c, mission: { ...c.mission, intro: e.target.value } })} rows={3} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-y" />
        <input value={c.mission.commitmentHeading} onChange={(e) => setC({ ...c, mission: { ...c.mission, commitmentHeading: e.target.value } })} placeholder="Commitment list heading (e.g. We are committed to:)" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
        <StringListEditor label="Commitments" items={c.mission.commitments} onChange={(commitments) => setC({ ...c, mission: { ...c.mission, commitments } })} />
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
        <h2 className="font-bold text-primary-dark">Core Values</h2>
        <input value={c.coreValues.heading} onChange={(e) => setC({ ...c, coreValues: { ...c.coreValues, heading: e.target.value } })} placeholder="Heading" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
        <TitledIconItemsEditor label="Values" items={c.coreValues.items} onChange={(items) => setC({ ...c, coreValues: { ...c.coreValues, items } })} />
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
        <h2 className="font-bold text-primary-dark">Why Choose Us</h2>
        <input value={c.whyChooseUs.heading} onChange={(e) => setC({ ...c, whyChooseUs: { ...c.whyChooseUs, heading: e.target.value } })} placeholder="Heading" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
        <TitledItemsEditor label="Reasons" items={c.whyChooseUs.items} onChange={(items) => setC({ ...c, whyChooseUs: { ...c.whyChooseUs, items } })} />
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
        <h2 className="font-bold text-primary-dark">Industries We Serve</h2>
        <input value={c.industries.heading} onChange={(e) => setC({ ...c, industries: { ...c.industries, heading: e.target.value } })} placeholder="Heading" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
        <IconItemsEditor label="Industries" items={c.industries.items} onChange={(items) => setC({ ...c, industries: { ...c.industries, items } })} />
      </section>
    </div>
  );
}
