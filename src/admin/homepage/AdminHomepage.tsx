import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, ImagePlus } from 'lucide-react';
import { apiFetch, ApiError } from '../../lib/api';
import { slugify } from '../../lib/slugify';
import StringListEditor from '../divisions/StringListEditor';
import type { HeroSlide, SiteSettings, StatItem, WhyChooseReason, SisterConcern } from '../../lib/types';

function emptySlide(): HeroSlide {
  return { image: '', title: '', subtitle: '', description: '' };
}
function emptyStat(): StatItem {
  return { value: '', label: '' };
}
function emptyReason(): WhyChooseReason {
  return { title: '', desc: '' };
}
function emptyConcern(): SisterConcern {
  return {
    logo: '',
    coverImage: '',
    name: '',
    tagline: '',
    description: '',
    whatWeDo: [],
    whoWeServe: '',
    howStructured: '',
    stats: { founded: '', headOffice: '', customersServed: '', leadershipExperience: '', coverage: '', industry: '' },
    profileNote: '',
    websiteUrl: '',
  };
}

function SavedBadge({ message }: { message: string | null }) {
  if (!message) return null;
  return <span className="text-sm text-green-600 font-medium">{message}</span>;
}

export default function AdminHomepage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [stats, setStats] = useState<StatItem[]>([]);
  const [whyHeading, setWhyHeading] = useState('');
  const [whySubheading, setWhySubheading] = useState('');
  const [reasons, setReasons] = useState<WhyChooseReason[]>([]);
  const [supHeading, setSupHeading] = useState('');
  const [supSubheading, setSupSubheading] = useState('');
  const [supDescription, setSupDescription] = useState('');
  const [concernHeading, setConcernHeading] = useState('');
  const [concernSubheading, setConcernSubheading] = useState('');
  const [concerns, setConcerns] = useState<SisterConcern[]>([]);

  const [savedHero, setSavedHero] = useState<string | null>(null);
  const [savedStats, setSavedStats] = useState<string | null>(null);
  const [savedWhy, setSavedWhy] = useState<string | null>(null);
  const [savedSuppliers, setSavedSuppliers] = useState<string | null>(null);
  const [savedConcerns, setSavedConcerns] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [uploadingSlideIdx, setUploadingSlideIdx] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingUploadIdx = useRef<number | null>(null);
  const [uploadingConcernIdx, setUploadingConcernIdx] = useState<number | null>(null);
  const concernFileInputRef = useRef<HTMLInputElement>(null);
  const pendingConcernUploadIdx = useRef<number | null>(null);
  const [uploadingConcernCoverIdx, setUploadingConcernCoverIdx] = useState<number | null>(null);
  const concernCoverFileInputRef = useRef<HTMLInputElement>(null);
  const pendingConcernCoverUploadIdx = useRef<number | null>(null);

  useEffect(() => {
    apiFetch<SiteSettings>('/api/admin/site-settings')
      .then((settings) => {
        setHeroSlides(settings['home.hero']?.slides || []);
        setStats(settings['home.stats']?.items || []);
        setWhyHeading(settings['home.whyChooseUs']?.heading || '');
        setWhySubheading(settings['home.whyChooseUs']?.subheading || '');
        setReasons(settings['home.whyChooseUs']?.reasons || []);
        setSupHeading(settings['home.suppliers']?.heading || '');
        setSupSubheading(settings['home.suppliers']?.subheading || '');
        setSupDescription(settings['home.suppliers']?.description || '');
        setConcernHeading(settings['home.sisterConcerns']?.heading || '');
        setConcernSubheading(settings['home.sisterConcerns']?.subheading || '');
        setConcerns(settings['home.sisterConcerns']?.items || []);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  async function saveKey(key: string, value: unknown, setSavedMsg: (m: string | null) => void) {
    setSaving(key);
    try {
      await apiFetch(`/api/admin/site-settings/${key}`, { method: 'PUT', body: JSON.stringify({ value }) });
      setSavedMsg('Saved.');
      setTimeout(() => setSavedMsg(null), 3000);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Failed to save');
    } finally {
      setSaving(null);
    }
  }

  function updateSlide(i: number, patch: Partial<HeroSlide>) {
    setHeroSlides((slides) => slides.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }

  function triggerSlideImageUpload(i: number) {
    pendingUploadIdx.current = i;
    fileInputRef.current?.click();
  }

  async function handleSlideImageSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const idx = pendingUploadIdx.current;
    if (!file || idx === null) return;
    setUploadingSlideIdx(idx);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const result = await apiFetch<{ url: string }>('/api/admin/site-settings/upload-image', { method: 'POST', body: fd });
      updateSlide(idx, { image: result.url });
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Image upload failed');
    } finally {
      setUploadingSlideIdx(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function updateConcern(i: number, patch: Partial<SisterConcern>) {
    setConcerns((c) => c.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  }

  function triggerConcernLogoUpload(i: number) {
    pendingConcernUploadIdx.current = i;
    concernFileInputRef.current?.click();
  }

  async function handleConcernLogoSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const idx = pendingConcernUploadIdx.current;
    if (!file || idx === null) return;
    setUploadingConcernIdx(idx);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const result = await apiFetch<{ url: string }>('/api/admin/site-settings/upload-image', { method: 'POST', body: fd });
      updateConcern(idx, { logo: result.url });
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Logo upload failed');
    } finally {
      setUploadingConcernIdx(null);
      if (concernFileInputRef.current) concernFileInputRef.current.value = '';
    }
  }

  function triggerConcernCoverUpload(i: number) {
    pendingConcernCoverUploadIdx.current = i;
    concernCoverFileInputRef.current?.click();
  }

  async function handleConcernCoverSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const idx = pendingConcernCoverUploadIdx.current;
    if (!file || idx === null) return;
    setUploadingConcernCoverIdx(idx);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const result = await apiFetch<{ url: string }>('/api/admin/site-settings/upload-image', { method: 'POST', body: fd });
      updateConcern(idx, { coverImage: result.url });
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Cover image upload failed');
    } finally {
      setUploadingConcernCoverIdx(null);
      if (concernCoverFileInputRef.current) concernCoverFileInputRef.current.value = '';
    }
  }

  if (loading) return <p className="text-body-text">Loading…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-primary-dark">Homepage & Suppliers</h1>
        <p className="text-body-text text-sm">Edit the content shown on the public homepage.</p>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleSlideImageSelected} className="hidden" />
      <input ref={concernFileInputRef} type="file" accept="image/*" onChange={handleConcernLogoSelected} className="hidden" />
      <input ref={concernCoverFileInputRef} type="file" accept="image/*" onChange={handleConcernCoverSelected} className="hidden" />

      {/* Hero Slider */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-primary-dark">Hero Slider</h2>
          <div className="flex items-center gap-3">
            <SavedBadge message={savedHero} />
            <button
              onClick={() => saveKey('home.hero', { slides: heroSlides }, setSavedHero)}
              disabled={saving === 'home.hero'}
              className="bg-primary-blue text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60"
            >
              {saving === 'home.hero' ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {heroSlides.map((slide, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-4 flex gap-4">
              <div className="w-32 h-20 rounded-lg overflow-hidden bg-light-gray shrink-0 relative">
                {slide.image ? (
                  <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No image</div>
                )}
                <button
                  type="button"
                  onClick={() => triggerSlideImageUpload(i)}
                  className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <ImagePlus className="w-5 h-5 text-white" />
                </button>
                {uploadingSlideIdx === i && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs">…</div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input value={slide.title} onChange={(e) => updateSlide(i, { title: e.target.value })} placeholder="Title" className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm" />
                <input value={slide.subtitle} onChange={(e) => updateSlide(i, { subtitle: e.target.value })} placeholder="Subtitle" className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm" />
                <input value={slide.description} onChange={(e) => updateSlide(i, { description: e.target.value })} placeholder="Description" className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm" />
              </div>
              <button onClick={() => setHeroSlides((s) => s.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-600 p-2 self-start">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => setHeroSlides((s) => [...s, emptySlide()])}
          className="mt-4 flex items-center gap-2 text-sm font-medium text-primary-blue hover:text-accent-hover border border-dashed border-primary-blue/40 rounded-xl px-4 py-2.5 w-full justify-center"
        >
          <Plus className="w-4 h-4" /> Add slide
        </button>
      </section>

      {/* Stats */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-primary-dark">Stats</h2>
          <div className="flex items-center gap-3">
            <SavedBadge message={savedStats} />
            <button
              onClick={() => saveKey('home.stats', { items: stats }, setSavedStats)}
              disabled={saving === 'home.stats'}
              className="bg-primary-blue text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60"
            >
              {saving === 'home.stats' ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
        <div className="space-y-3">
          {stats.map((stat, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={stat.value}
                onChange={(e) => setStats((s) => s.map((x, idx) => (idx === i ? { ...x, value: e.target.value } : x)))}
                placeholder="Value (e.g. 15+)"
                className="w-32 px-3 py-2 rounded-lg border border-gray-200 text-sm"
              />
              <input
                value={stat.label}
                onChange={(e) => setStats((s) => s.map((x, idx) => (idx === i ? { ...x, label: e.target.value } : x)))}
                placeholder="Label (e.g. Years of Experience)"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm"
              />
              <button onClick={() => setStats((s) => s.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-600 px-2">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button onClick={() => setStats((s) => [...s, emptyStat()])} className="mt-3 text-xs font-medium text-primary-blue hover:text-accent-hover">
          + Add stat
        </button>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-primary-dark">Why Choose Us</h2>
          <div className="flex items-center gap-3">
            <SavedBadge message={savedWhy} />
            <button
              onClick={() => saveKey('home.whyChooseUs', { heading: whyHeading, subheading: whySubheading, reasons }, setSavedWhy)}
              disabled={saving === 'home.whyChooseUs'}
              className="bg-primary-blue text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60"
            >
              {saving === 'home.whyChooseUs' ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
        <div className="space-y-3 mb-4">
          <input value={whyHeading} onChange={(e) => setWhyHeading(e.target.value)} placeholder="Section heading" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
          <input value={whySubheading} onChange={(e) => setWhySubheading(e.target.value)} placeholder="Section subheading" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
        </div>
        <div className="space-y-3">
          {reasons.map((reason, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={reason.title}
                onChange={(e) => setReasons((r) => r.map((x, idx) => (idx === i ? { ...x, title: e.target.value } : x)))}
                placeholder="Reason title"
                className="w-1/3 px-3 py-2 rounded-lg border border-gray-200 text-sm"
              />
              <input
                value={reason.desc}
                onChange={(e) => setReasons((r) => r.map((x, idx) => (idx === i ? { ...x, desc: e.target.value } : x)))}
                placeholder="Reason description"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm"
              />
              <button onClick={() => setReasons((r) => r.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-600 px-2">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button onClick={() => setReasons((r) => [...r, emptyReason()])} className="mt-3 text-xs font-medium text-primary-blue hover:text-accent-hover">
          + Add reason
        </button>
      </section>

      {/* Suppliers text + link to logo manager */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-primary-dark">Supplier Section Text</h2>
          <div className="flex items-center gap-3">
            <SavedBadge message={savedSuppliers} />
            <button
              onClick={() => saveKey('home.suppliers', { heading: supHeading, subheading: supSubheading, description: supDescription }, setSavedSuppliers)}
              disabled={saving === 'home.suppliers'}
              className="bg-primary-blue text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60"
            >
              {saving === 'home.suppliers' ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
        <div className="space-y-3 mb-4">
          <input value={supSubheading} onChange={(e) => setSupSubheading(e.target.value)} placeholder="Eyebrow text (e.g. Partner Network)" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
          <input value={supHeading} onChange={(e) => setSupHeading(e.target.value)} placeholder="Heading" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
          <textarea value={supDescription} onChange={(e) => setSupDescription(e.target.value)} placeholder="Description" rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none" />
        </div>
        <Link to="/admin/homepage/suppliers" className="inline-flex items-center gap-2 text-sm font-medium text-primary-blue hover:text-accent-hover border border-primary-blue/30 rounded-lg px-4 py-2">
          Manage Supplier Logos →
        </Link>
      </section>

      {/* Sister Concerns */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-primary-dark">Sister Concerns</h2>
          <div className="flex items-center gap-3">
            <SavedBadge message={savedConcerns} />
            <button
              onClick={() => saveKey('home.sisterConcerns', { heading: concernHeading, subheading: concernSubheading, items: concerns }, setSavedConcerns)}
              disabled={saving === 'home.sisterConcerns'}
              className="bg-primary-blue text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60"
            >
              {saving === 'home.sisterConcerns' ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
        <p className="text-body-text text-sm mb-4">Related/subsidiary companies shown on the homepage. Leave empty to hide the section entirely.</p>
        <div className="space-y-3 mb-4">
          <input value={concernSubheading} onChange={(e) => setConcernSubheading(e.target.value)} placeholder="Eyebrow text (e.g. Subsidiaries & Ecosystem)" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
          <input value={concernHeading} onChange={(e) => setConcernHeading(e.target.value)} placeholder="Heading (e.g. Our Sister Concerns)" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
        </div>
        <div className="space-y-4">
          {concerns.map((concern, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-4">
              <div className="flex gap-4">
                <div className="flex flex-col gap-2 shrink-0">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-light-gray relative">
                    {concern.logo ? (
                      <img src={concern.logo} alt={concern.name} className="w-full h-full object-contain p-1" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No logo</div>
                    )}
                    <button
                      type="button"
                      onClick={() => triggerConcernLogoUpload(i)}
                      className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <ImagePlus className="w-5 h-5 text-white" />
                    </button>
                    {uploadingConcernIdx === i && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs">…</div>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400 text-center">Logo</span>

                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-light-gray relative">
                    {concern.coverImage ? (
                      <img src={concern.coverImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px] text-center px-1">
                        No cover (uses gradient)
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => triggerConcernCoverUpload(i)}
                      className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <ImagePlus className="w-5 h-5 text-white" />
                    </button>
                    {uploadingConcernCoverIdx === i && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs">…</div>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400 text-center">Card background</span>
                </div>
                <div className="flex-1 space-y-2">
                  <input value={concern.name} onChange={(e) => updateConcern(i, { name: e.target.value })} placeholder="Company name" className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm" />
                  <input value={concern.tagline} onChange={(e) => updateConcern(i, { tagline: e.target.value })} placeholder="Tagline" className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm" />
                  <textarea value={concern.description} onChange={(e) => updateConcern(i, { description: e.target.value })} placeholder="Overview (shown on /company)" rows={3} className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm resize-y" />
                  <input value={concern.websiteUrl} onChange={(e) => updateConcern(i, { websiteUrl: e.target.value })} placeholder="Official website URL (optional - shown as 'Visit Website' on /company)" className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm" />
                  <p className="text-xs text-gray-400">
                    Section on /company: <span className="font-mono">/company#{slugify(concern.name) || '...'}</span>
                  </p>
                </div>
                <button onClick={() => setConcerns((c) => c.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-600 p-2 self-start">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                <StringListEditor
                  label="What We Do"
                  items={concern.whatWeDo}
                  onChange={(whatWeDo) => updateConcern(i, { whatWeDo })}
                  placeholder="e.g. Supply and commission printing, converting and post-press machinery"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Who We Serve</label>
                  <textarea value={concern.whoWeServe} onChange={(e) => updateConcern(i, { whoWeServe: e.target.value })} rows={2} className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm resize-y" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">How We're Structured</label>
                  <textarea value={concern.howStructured} onChange={(e) => updateConcern(i, { howStructured: e.target.value })} rows={2} className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm resize-y" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stats box</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input value={concern.stats.founded} onChange={(e) => updateConcern(i, { stats: { ...concern.stats, founded: e.target.value } })} placeholder="Founded (e.g. 2024)" className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm" />
                    <input value={concern.stats.headOffice} onChange={(e) => updateConcern(i, { stats: { ...concern.stats, headOffice: e.target.value } })} placeholder="Head Office" className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm" />
                    <input value={concern.stats.customersServed} onChange={(e) => updateConcern(i, { stats: { ...concern.stats, customersServed: e.target.value } })} placeholder="Customers Served (e.g. 100+)" className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm" />
                    <input value={concern.stats.leadershipExperience} onChange={(e) => updateConcern(i, { stats: { ...concern.stats, leadershipExperience: e.target.value } })} placeholder="Leadership Experience" className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm" />
                    <input value={concern.stats.coverage} onChange={(e) => updateConcern(i, { stats: { ...concern.stats, coverage: e.target.value } })} placeholder="Coverage" className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm" />
                    <input value={concern.stats.industry} onChange={(e) => updateConcern(i, { stats: { ...concern.stats, industry: e.target.value } })} placeholder="Industry" className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm" />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Leave any field blank to hide just that one - the whole box hides itself if all six are empty.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Profile box text</label>
                  <textarea value={concern.profileNote} onChange={(e) => updateConcern(i, { profileNote: e.target.value })} placeholder="e.g. A downloadable PDF profile is being prepared. Request a copy and we will send it directly." rows={2} className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm resize-y" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => setConcerns((c) => [...c, emptyConcern()])}
          className="mt-4 flex items-center gap-2 text-sm font-medium text-primary-blue hover:text-accent-hover border border-dashed border-primary-blue/40 rounded-xl px-4 py-2.5 w-full justify-center"
        >
          <Plus className="w-4 h-4" /> Add sister concern
        </button>
      </section>
    </div>
  );
}
