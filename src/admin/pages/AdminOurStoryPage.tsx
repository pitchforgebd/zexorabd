import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { apiFetch, ApiError } from '../../lib/api';
import type { OurStoryContent, SiteSettings } from '../../lib/types';
import { ParagraphListEditor } from './editors';

const EMPTY: OurStoryContent = {
  hero: { eyebrow: '', title: '', subtitle: '' },
  paragraphs: [],
  pullQuote: '',
  milestones: [],
};

export default function AdminOurStoryPage() {
  const [c, setC] = useState<OurStoryContent>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<SiteSettings>('/api/admin/site-settings')
      .then((settings) => {
        if (settings['page.ourStory']) setC(settings['page.ourStory']);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load content'))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setSavedMsg(null);
    try {
      await apiFetch('/api/admin/site-settings/page.ourStory', { method: 'PUT', body: JSON.stringify({ value: c }) });
      setSavedMsg('Saved.');
      setTimeout(() => setSavedMsg(null), 3000);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  function updateMilestone(i: number, patch: Partial<{ label: string; title: string; description: string }>) {
    setC((prev) => ({ ...prev, milestones: prev.milestones.map((m, idx) => (idx === i ? { ...m, ...patch } : m)) }));
  }
  function removeMilestone(i: number) {
    setC((prev) => ({ ...prev, milestones: prev.milestones.filter((_, idx) => idx !== i) }));
  }

  if (loading) return <p className="text-body-text">Loading…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-8 max-w-3xl">
      <Link to="/admin/pages" className="text-sm text-body-text hover:text-primary-blue mb-2 inline-block">← Static Pages</Link>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">Our Story Page</h1>
          <p className="text-body-text text-sm">/our-story</p>
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
        <input value={c.hero.eyebrow} onChange={(e) => setC({ ...c, hero: { ...c.hero, eyebrow: e.target.value } })} placeholder="Eyebrow (e.g. Our Journey)" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
        <input value={c.hero.title} onChange={(e) => setC({ ...c, hero: { ...c.hero, title: e.target.value } })} placeholder="Title" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
        <textarea value={c.hero.subtitle} onChange={(e) => setC({ ...c, hero: { ...c.hero, subtitle: e.target.value } })} placeholder="Subtitle" rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-y" />
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
        <h2 className="font-bold text-primary-dark">Story</h2>
        <ParagraphListEditor label="Narrative paragraphs" items={c.paragraphs} onChange={(paragraphs) => setC({ ...c, paragraphs })} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pull quote (optional, shown as a standout line)</label>
          <textarea value={c.pullQuote} onChange={(e) => setC({ ...c, pullQuote: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-y" />
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-bold text-primary-dark">Milestones</h2>
        <p className="text-xs text-gray-400">Label can be a year ("2024"), a span ("15+ Years"), or a word ("Ongoing") — whatever fits.</p>
        {c.milestones.map((m, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-2">
            <div className="flex gap-2">
              <input value={m.label} onChange={(e) => updateMilestone(i, { label: e.target.value })} placeholder="Label" className="w-32 px-3 py-2 rounded-lg border border-gray-200 text-sm" />
              <input value={m.title} onChange={(e) => updateMilestone(i, { title: e.target.value })} placeholder="Title" className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium" />
              <button type="button" onClick={() => removeMilestone(i)} className="text-gray-400 hover:text-red-600 px-2">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <textarea value={m.description} onChange={(e) => updateMilestone(i, { description: e.target.value })} placeholder="Description" rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-y" />
          </div>
        ))}
        <button
          type="button"
          onClick={() => setC((prev) => ({ ...prev, milestones: [...prev.milestones, { label: '', title: '', description: '' }] }))}
          className="flex items-center gap-2 text-sm font-medium text-primary-blue hover:text-accent-hover border border-dashed border-primary-blue/40 rounded-xl px-4 py-2.5 w-full justify-center"
        >
          <Plus className="w-4 h-4" /> Add milestone
        </button>
      </section>
    </div>
  );
}
