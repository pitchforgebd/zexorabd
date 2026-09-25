import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ImagePlus, Trash2, X } from 'lucide-react';
import { apiFetch, ApiError } from '../../lib/api';
import type { DivisionDetail, GalleryImage } from '../../lib/types';
import StringListEditor from './StringListEditor';
import ProductsEditor, { type EditCategory } from './ProductsEditor';
import SeoOverrideSection from '../seo/SeoOverrideSection';

type FormState = {
  name: string;
  slug: string;
  industry: string;
  tagline: string;
  overview: string;
  brandPositioning: string;
  icon: string;
  isActive: boolean;
  philosophy: { intro: string; beliefs: string[]; closing: string } | null;
  industries: string[];
  reasons: string[];
  commitment: string[];
  strengths: string[];
  markets: string[];
  sourcingSteps: { title: string; description: string }[];
  products: EditCategory[];
};

function toFormState(d: DivisionDetail): FormState {
  return {
    name: d.name,
    slug: d.slug,
    industry: d.industry || '',
    tagline: d.tagline || '',
    overview: d.overview || '',
    brandPositioning: d.brandPositioning || '',
    icon: d.icon || '',
    isActive: d.isActive,
    philosophy: d.philosophy,
    industries: d.industries,
    reasons: d.reasons,
    commitment: d.commitment,
    strengths: d.strengths,
    markets: d.markets,
    sourcingSteps: d.sourcingSteps,
    products: d.products.map((c) => ({
      category: c.category,
      description: c.description || '',
      subcategories: c.subcategories.map((s) => ({
        subName: s.subName || '',
        description: s.description || '',
        items: s.items.map((i) => i.text),
      })),
    })),
  };
}

export default function AdminDivisionEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState | null>(null);
  const [originalSlug, setOriginalSlug] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  useEffect(() => {
    apiFetch<DivisionDetail>(`/api/admin/divisions/${id}`)
      .then((d) => {
        setForm(toFormState(d));
        setOriginalSlug(d.slug);
        setCoverImage(d.coverImage);
        setGalleryImages(d.galleryImages);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load division'))
      .finally(() => setLoading(false));
  }, [id]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => (f ? { ...f, [key]: value } : f));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setSaveMessage(null);
    setError(null);
    try {
      const updated = await apiFetch<DivisionDetail>(`/api/admin/divisions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(form),
      });
      setForm(toFormState(updated));
      setOriginalSlug(updated.slug);
      setSaveMessage('Saved.');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save division');
    } finally {
      setSaving(false);
    }
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const result = await apiFetch<{ coverImage: string }>(`/api/admin/divisions/${id}/cover-image`, {
        method: 'POST',
        body: fd,
      });
      setCoverImage(result.coverImage);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Cover image upload failed');
    } finally {
      setUploadingCover(false);
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingGallery(true);
    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append('images', f));
      const uploaded = await apiFetch<GalleryImage[]>(`/api/admin/divisions/${id}/gallery-images`, {
        method: 'POST',
        body: fd,
      });
      setGalleryImages(uploaded);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Gallery upload failed');
    } finally {
      setUploadingGallery(false);
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  }

  async function handleDeleteGalleryImage(imageId: number) {
    try {
      await apiFetch(`/api/admin/divisions/${id}/gallery-images/${imageId}`, { method: 'DELETE' });
      setGalleryImages((imgs) => imgs.filter((img) => img.id !== imageId));
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Failed to delete image');
    }
  }

  if (loading) return <p className="text-body-text">Loading…</p>;
  if (error && !form) return <p className="text-red-600">{error}</p>;
  if (!form) return null;

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between sticky top-0 bg-light-gray/95 backdrop-blur z-10 py-3 -mx-1 px-1">
        <div>
          <button type="button" onClick={() => navigate('/admin/divisions')} className="text-sm text-body-text hover:text-primary-blue mb-1">
            ← Back to Divisions
          </button>
          <h1 className="text-2xl font-bold text-primary-dark">{form.name || 'Edit Division'}</h1>
        </div>
        <div className="flex items-center gap-3">
          {saveMessage && <span className="text-sm text-green-600 font-medium">{saveMessage}</span>}
          <button
            type="submit"
            disabled={saving}
            className="bg-primary-blue text-white px-5 py-2.5 rounded-xl font-medium hover:bg-accent-hover transition-colors text-sm disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg border border-red-200 text-sm">{error}</div>}

      {/* Basic info */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-bold text-primary-dark">Basic Info</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input value={form.name} onChange={(e) => update('name', e.target.value)} required className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input value={form.slug} onChange={(e) => update('slug', e.target.value)} required className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-mono" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
            <input value={form.industry} onChange={(e) => update('industry', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
            <input value={form.icon} onChange={(e) => update('icon', e.target.value)} placeholder="e.g. FlaskConical" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
            <p className="text-xs text-gray-400 mt-1">
              Supported: FlaskConical, Cog, Zap, Shirt, Printer, ShoppingBag. Unrecognized names show a default icon.
            </p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
          <input value={form.tagline} onChange={(e) => update('tagline', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Overview</label>
          <textarea value={form.overview} onChange={(e) => update('overview', e.target.value)} rows={4} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Brand Positioning (optional)</label>
          <textarea value={form.brandPositioning} onChange={(e) => update('brandPositioning', e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none" />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={form.isActive} onChange={(e) => update('isActive', e.target.checked)} className="w-4 h-4" />
          Visible on the live site
        </label>
      </section>

      {/* Cover image */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-primary-dark mb-4">Cover Image</h2>
        <div className="flex items-center gap-4">
          {coverImage ? (
            <img src={coverImage} alt="Cover" className="w-32 h-32 object-cover rounded-xl border border-gray-100" />
          ) : (
            <div className="w-32 h-32 rounded-xl bg-light-gray border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">No image</div>
          )}
          <div>
            <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" id="cover-upload" />
            <label htmlFor="cover-upload" className="cursor-pointer inline-flex items-center gap-2 text-sm font-medium text-primary-blue hover:text-accent-hover border border-primary-blue/30 rounded-lg px-4 py-2">
              <ImagePlus className="w-4 h-4" /> {uploadingCover ? 'Uploading…' : 'Upload cover image'}
            </label>
          </div>
        </div>
      </section>

      {/* Philosophy (optional section) */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-primary-dark">Philosophy Section (optional)</h2>
          {form.philosophy ? (
            <button type="button" onClick={() => update('philosophy', null)} className="text-xs text-red-500 hover:text-red-700">Remove section</button>
          ) : (
            <button
              type="button"
              onClick={() => update('philosophy', { intro: '', beliefs: [], closing: '' })}
              className="text-xs text-primary-blue hover:text-accent-hover"
            >
              + Add section
            </button>
          )}
        </div>
        {form.philosophy && (
          <div className="space-y-4">
            <textarea
              value={form.philosophy.intro}
              onChange={(e) => update('philosophy', { ...form.philosophy!, intro: e.target.value })}
              placeholder="Intro text"
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none"
            />
            <StringListEditor
              label="Beliefs"
              items={form.philosophy.beliefs}
              onChange={(beliefs) => update('philosophy', { ...form.philosophy!, beliefs })}
            />
            <textarea
              value={form.philosophy.closing}
              onChange={(e) => update('philosophy', { ...form.philosophy!, closing: e.target.value })}
              placeholder="Closing statement"
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none"
            />
          </div>
        )}
      </section>

      {/* Bullet lists */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        <h2 className="font-bold text-primary-dark">Lists</h2>
        <StringListEditor label="Industries We Serve" items={form.industries} onChange={(v) => update('industries', v)} />
        <StringListEditor label="Why Choose Us (Reasons)" items={form.reasons} onChange={(v) => update('reasons', v)} />
        <StringListEditor label="Our Commitment" items={form.commitment} onChange={(v) => update('commitment', v)} />
        <StringListEditor label="Our Strengths" items={form.strengths} onChange={(v) => update('strengths', v)} />
        <StringListEditor label="Global Markets" items={form.markets} onChange={(v) => update('markets', v)} />
      </section>

      {/* Sourcing steps (optional) */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-primary-dark mb-4">Sourcing Process Steps (optional)</h2>
        <div className="space-y-3">
          {form.sourcingSteps.map((step, i) => (
            <div key={i} className="flex gap-2 items-start bg-light-gray/50 p-3 rounded-lg">
              <div className="flex-1 space-y-2">
                <input
                  value={step.title}
                  onChange={(e) => {
                    const next = [...form.sourcingSteps];
                    next[i] = { ...next[i], title: e.target.value };
                    update('sourcingSteps', next);
                  }}
                  placeholder="Step title (e.g. 01. Requirement)"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                />
                <textarea
                  value={step.description}
                  onChange={(e) => {
                    const next = [...form.sourcingSteps];
                    next[i] = { ...next[i], description: e.target.value };
                    update('sourcingSteps', next);
                  }}
                  placeholder="Step description"
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none"
                />
              </div>
              <button
                type="button"
                onClick={() => update('sourcingSteps', form.sourcingSteps.filter((_, idx) => idx !== i))}
                className="text-gray-400 hover:text-red-600 p-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => update('sourcingSteps', [...form.sourcingSteps, { title: '', description: '' }])}
          className="mt-3 text-xs font-medium text-primary-blue hover:text-accent-hover"
        >
          + Add step
        </button>
      </section>

      {/* Products */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-primary-dark mb-4">Products & Services</h2>
        <ProductsEditor categories={form.products} onChange={(products) => update('products', products)} />
      </section>

      <SeoOverrideSection pageKey={originalSlug ? `division:${originalSlug}` : null} />

      {/* Gallery */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-primary-dark mb-4">Visuals & Products Gallery</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-4">
          {galleryImages.map((img) => (
            <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-100">
              <img src={img.url} alt={img.caption || ''} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleDeleteGalleryImage(img.id)}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <Trash2 className="w-5 h-5 text-white" />
              </button>
            </div>
          ))}
        </div>
        <input ref={galleryInputRef} type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" id="gallery-upload" />
        <label htmlFor="gallery-upload" className="cursor-pointer inline-flex items-center gap-2 text-sm font-medium text-primary-blue hover:text-accent-hover border border-primary-blue/30 rounded-lg px-4 py-2">
          <ImagePlus className="w-4 h-4" /> {uploadingGallery ? 'Uploading…' : 'Add gallery images'}
        </label>
      </section>

      <div className="flex justify-end pb-10">
        <button
          type="submit"
          disabled={saving}
          className="bg-primary-blue text-white px-6 py-3 rounded-xl font-medium hover:bg-accent-hover transition-colors disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
