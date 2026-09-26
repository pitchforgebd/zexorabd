import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ImagePlus, Plus, Trash2 } from 'lucide-react';
import { apiFetch, ApiError } from '../../lib/api';
import type { CeoMessageContent, SiteSettings } from '../../lib/types';
import { ParagraphListEditor } from './editors';

const EMPTY: CeoMessageContent = {
  hero: { eyebrow: '', title: '', quote: '' },
  photo: '',
  name: '',
  title: '',
  sections: [],
  emphasisHeading: '',
  emphasisItems: [],
  closingQuote: '',
};

export default function AdminCeoMessagePage() {
  const [c, setC] = useState<CeoMessageContent>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    apiFetch<SiteSettings>('/api/admin/site-settings')
      .then((settings) => {
        if (settings['page.ceoMessage']) setC(settings['page.ceoMessage']);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load content'))
      .finally(() => setLoading(false));
  }, []);

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const result = await apiFetch<{ url: string }>('/api/admin/site-settings/upload-image', { method: 'POST', body: fd });
      setC((prev) => ({ ...prev, photo: result.url }));
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Photo upload failed');
    } finally {
      setUploadingPhoto(false);
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  }

  async function handleSave() {
    setSaving(true);
    setSavedMsg(null);
    try {
      await apiFetch('/api/admin/site-settings/page.ceoMessage', { method: 'PUT', body: JSON.stringify({ value: c }) });
      setSavedMsg('Saved.');
      setTimeout(() => setSavedMsg(null), 3000);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  function updateSection(i: number, patch: Partial<{ heading: string; paragraphs: string[] }>) {
    setC((prev) => ({ ...prev, sections: prev.sections.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) }));
  }
  function removeSection(i: number) {
    setC((prev) => ({ ...prev, sections: prev.sections.filter((_, idx) => idx !== i) }));
  }

  if (loading) return <p className="text-body-text">Loading…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-8 max-w-3xl">
      <Link to="/admin/pages" className="text-sm text-body-text hover:text-primary-blue mb-2 inline-block">← Static Pages</Link>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">CEO Message Page</h1>
          <p className="text-body-text text-sm">/ceo-message</p>
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
        <input value={c.hero.eyebrow} onChange={(e) => setC({ ...c, hero: { ...c.hero, eyebrow: e.target.value } })} placeholder="Eyebrow (e.g. Leadership)" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
        <input value={c.hero.title} onChange={(e) => setC({ ...c, hero: { ...c.hero, title: e.target.value } })} placeholder="Title" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
        <textarea value={c.hero.quote} onChange={(e) => setC({ ...c, hero: { ...c.hero, quote: e.target.value } })} placeholder="Quote" rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-y" />
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
        <h2 className="font-bold text-primary-dark">CEO Profile</h2>
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-xl bg-light-gray border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
            {c.photo ? <img src={c.photo} alt="CEO" className="w-full h-full object-cover" /> : <span className="text-gray-300 text-xs">No photo</span>}
          </div>
          <div>
            <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" id="ceo-photo-upload" />
            <label htmlFor="ceo-photo-upload" className="cursor-pointer inline-flex items-center gap-2 text-sm font-medium text-primary-blue hover:text-accent-hover border border-primary-blue/30 rounded-lg px-4 py-2">
              <ImagePlus className="w-4 h-4" /> {uploadingPhoto ? 'Uploading…' : 'Upload photo'}
            </label>
          </div>
        </div>
        <input value={c.name} onChange={(e) => setC({ ...c, name: e.target.value })} placeholder="Name" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
        <input value={c.title} onChange={(e) => setC({ ...c, title: e.target.value })} placeholder="Title (e.g. Founder & CEO)" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-primary-dark">Message Sections</h2>
        </div>
        {c.sections.map((s, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-2">
            <div className="flex gap-2">
              <input value={s.heading} onChange={(e) => updateSection(i, { heading: e.target.value })} placeholder="Section heading" className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium" />
              <button type="button" onClick={() => removeSection(i)} className="text-gray-400 hover:text-red-600 px-2">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <ParagraphListEditor label="Paragraphs" items={s.paragraphs} onChange={(paragraphs) => updateSection(i, { paragraphs })} />
          </div>
        ))}
        <button
          type="button"
          onClick={() => setC((prev) => ({ ...prev, sections: [...prev.sections, { heading: '', paragraphs: [''] }] }))}
          className="flex items-center gap-2 text-sm font-medium text-primary-blue hover:text-accent-hover border border-dashed border-primary-blue/40 rounded-xl px-4 py-2.5 w-full justify-center"
        >
          <Plus className="w-4 h-4" /> Add section
        </button>
        <p className="text-xs text-gray-400">
          The "We emphasize" box below is shown after the 2nd section, and the closing quote is shown after the last section.
        </p>
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
        <h2 className="font-bold text-primary-dark">"We Emphasize" Box</h2>
        <input value={c.emphasisHeading} onChange={(e) => setC({ ...c, emphasisHeading: e.target.value })} placeholder="Heading (e.g. We emphasize:)" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
        <ParagraphListEditor label="Numbered items" items={c.emphasisItems} onChange={(emphasisItems) => setC({ ...c, emphasisItems })} />
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
        <h2 className="font-bold text-primary-dark">Closing Quote</h2>
        <textarea value={c.closingQuote} onChange={(e) => setC({ ...c, closingQuote: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-y" />
      </section>
    </div>
  );
}
