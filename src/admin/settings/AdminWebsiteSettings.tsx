import { useEffect, useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { apiFetch, ApiError } from '../../lib/api';
import type { SiteInfo, SiteSettings } from '../../lib/types';

const EMPTY: SiteInfo = {
  logo: '',
  footerLogo: '',
  favicon: '',
  ogImage: '',
  companyName: '',
  tagline: '',
  email: '',
  phone: '',
  whatsapp: '',
  whatsappQrImage: '',
  address: '',
  businessHours: '',
  mapEmbedUrl: '',
  social: { facebook: '', instagram: '', linkedin: '', youtube: '' },
};

type ImageField = 'logo' | 'footerLogo' | 'favicon' | 'ogImage' | 'whatsappQrImage';

export default function AdminWebsiteSettings() {
  const [info, setInfo] = useState<SiteInfo>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [uploadingField, setUploadingField] = useState<ImageField | null>(null);
  const fileInputRefs = {
    logo: useRef<HTMLInputElement>(null),
    footerLogo: useRef<HTMLInputElement>(null),
    favicon: useRef<HTMLInputElement>(null),
    ogImage: useRef<HTMLInputElement>(null),
    whatsappQrImage: useRef<HTMLInputElement>(null),
  };

  useEffect(() => {
    apiFetch<SiteSettings>('/api/admin/site-settings')
      .then((settings) => {
        if (settings['global.siteInfo']) setInfo({ ...EMPTY, ...settings['global.siteInfo'] });
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  function update<K extends keyof SiteInfo>(key: K, value: SiteInfo[K]) {
    setInfo((s) => ({ ...s, [key]: value }));
  }

  function updateSocial(key: keyof SiteInfo['social'], value: string) {
    setInfo((s) => ({ ...s, social: { ...s.social, [key]: value } }));
  }

  async function handleImageUpload(field: ImageField, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingField(field);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const result = await apiFetch<{ url: string }>('/api/admin/site-settings/upload-image', { method: 'POST', body: fd });
      update(field, result.url);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Image upload failed');
    } finally {
      setUploadingField(null);
      const ref = fileInputRefs[field].current;
      if (ref) ref.value = '';
    }
  }

  async function handleSave() {
    setSaving(true);
    setSavedMsg(null);
    try {
      await apiFetch('/api/admin/site-settings/global.siteInfo', { method: 'PUT', body: JSON.stringify({ value: info }) });
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">Website Settings</h1>
          <p className="text-body-text text-sm">Logo, contact info, social links, and social-sharing details for the whole site.</p>
        </div>
        <div className="flex items-center gap-3">
          {savedMsg && <span className="text-sm text-green-600 font-medium">{savedMsg}</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary-blue text-white px-5 py-2.5 rounded-xl font-medium hover:bg-accent-hover transition-colors text-sm disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Brand */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-bold text-primary-dark">Brand</h2>
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-xl bg-light-gray border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
            {info.logo ? (
              <img src={info.logo} alt="Logo" className="w-full h-full object-contain p-2" />
            ) : (
              <span className="text-gray-300 text-xs">No logo</span>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Logo</p>
            <input ref={fileInputRefs.logo} type="file" accept="image/*" onChange={(e) => handleImageUpload('logo', e)} className="hidden" id="logo-upload" />
            <label
              htmlFor="logo-upload"
              className="cursor-pointer inline-flex items-center gap-2 text-sm font-medium text-primary-blue hover:text-accent-hover border border-primary-blue/30 rounded-lg px-4 py-2"
            >
              <ImagePlus className="w-4 h-4" /> {uploadingField === 'logo' ? 'Uploading…' : 'Upload logo'}
            </label>
            <p className="text-xs text-gray-400 mt-1">Shown in the header, and in the footer too unless a footer-specific logo is set below.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-xl bg-[#0A0D14] border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
            {info.footerLogo ? (
              <img src={info.footerLogo} alt="Footer logo" className="w-full h-full object-contain p-2" />
            ) : info.logo ? (
              <img src={info.logo} alt="Footer logo (auto)" className="w-full h-full object-contain p-2 brightness-0 invert" />
            ) : (
              <span className="text-gray-500 text-xs">No logo</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-gray-700 mb-1">Footer Logo (optional)</p>
            </div>
            <div className="flex items-center gap-2">
              <input ref={fileInputRefs.footerLogo} type="file" accept="image/*" onChange={(e) => handleImageUpload('footerLogo', e)} className="hidden" id="footer-logo-upload" />
              <label
                htmlFor="footer-logo-upload"
                className="cursor-pointer inline-flex items-center gap-2 text-sm font-medium text-primary-blue hover:text-accent-hover border border-primary-blue/30 rounded-lg px-4 py-2"
              >
                <ImagePlus className="w-4 h-4" /> {uploadingField === 'footerLogo' ? 'Uploading…' : 'Upload footer logo'}
              </label>
              {info.footerLogo && (
                <button
                  type="button"
                  onClick={() => update('footerLogo', '')}
                  className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-red-600 border border-gray-200 rounded-lg px-3 py-2"
                >
                  <X className="w-4 h-4" /> Use main logo
                </button>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              The footer background is dark, so the main logo is auto-inverted to white by default. Upload a
              dedicated version here (e.g. one with its own colors) to use that instead.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-light-gray border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
            {info.favicon ? (
              <img src={info.favicon} alt="Favicon" className="w-8 h-8 object-contain" />
            ) : (
              <span className="text-gray-300 text-[10px]">None</span>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Favicon</p>
            <input ref={fileInputRefs.favicon} type="file" accept="image/*" onChange={(e) => handleImageUpload('favicon', e)} className="hidden" id="favicon-upload" />
            <label
              htmlFor="favicon-upload"
              className="cursor-pointer inline-flex items-center gap-2 text-sm font-medium text-primary-blue hover:text-accent-hover border border-primary-blue/30 rounded-lg px-4 py-2"
            >
              <ImagePlus className="w-4 h-4" /> {uploadingField === 'favicon' ? 'Uploading…' : 'Upload favicon'}
            </label>
            <p className="text-xs text-gray-400 mt-1">The small icon shown in browser tabs. A square image works best (e.g. 512×512).</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
          <input value={info.companyName} onChange={(e) => update('companyName', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
          <textarea value={info.tagline} onChange={(e) => update('tagline', e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none" />
        </div>
      </section>

      {/* Social Sharing */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-bold text-primary-dark">Social Sharing</h2>
        <div className="flex items-center gap-4">
          <div className="w-32 h-20 rounded-xl bg-light-gray border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
            {info.ogImage ? (
              <img src={info.ogImage} alt="Social share image" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-300 text-xs">No image</span>
            )}
          </div>
          <div>
            <input ref={fileInputRefs.ogImage} type="file" accept="image/*" onChange={(e) => handleImageUpload('ogImage', e)} className="hidden" id="ogimage-upload" />
            <label
              htmlFor="ogimage-upload"
              className="cursor-pointer inline-flex items-center gap-2 text-sm font-medium text-primary-blue hover:text-accent-hover border border-primary-blue/30 rounded-lg px-4 py-2"
            >
              <ImagePlus className="w-4 h-4" /> {uploadingField === 'ogImage' ? 'Uploading…' : 'Upload share image'}
            </label>
            <p className="text-xs text-gray-400 mt-1">
              Shown when a page is shared on Facebook, WhatsApp, LinkedIn, etc. Used as the default for any page that
              doesn't set its own image in SEO. Recommended size: 1200×630.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-bold text-primary-dark">Contact Info</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input value={info.email} onChange={(e) => update('email', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone (with country code, e.g. +8801...)</label>
            <input value={info.phone} onChange={(e) => update('phone', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number (with country code)</label>
            <input value={info.whatsapp} onChange={(e) => update('whatsapp', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
            <p className="text-xs text-gray-400 mt-1">Used to auto-generate the footer's QR code, unless a custom one is uploaded below.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Hours</label>
            <input value={info.businessHours} onChange={(e) => update('businessHours', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea value={info.address} onChange={(e) => update('address', e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Embed URL</label>
          <input value={info.mapEmbedUrl} onChange={(e) => update('mapEmbedUrl', e.target.value)} placeholder="https://www.google.com/maps/embed?..." className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-mono" />
          <p className="text-xs text-gray-400 mt-1">From Google Maps: Share → Embed a map → copy the src="..." URL.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp QR Code</label>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-xl bg-light-gray border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
              {info.whatsappQrImage ? (
                <img src={info.whatsappQrImage} alt="Custom WhatsApp QR" className="w-full h-full object-contain p-1" />
              ) : (
                <span className="text-gray-300 text-[10px] text-center px-2">Auto-generated</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <input ref={fileInputRefs.whatsappQrImage} type="file" accept="image/*" onChange={(e) => handleImageUpload('whatsappQrImage', e)} className="hidden" id="qr-upload" />
                <label
                  htmlFor="qr-upload"
                  className="cursor-pointer inline-flex items-center gap-2 text-sm font-medium text-primary-blue hover:text-accent-hover border border-primary-blue/30 rounded-lg px-4 py-2"
                >
                  <ImagePlus className="w-4 h-4" /> {uploadingField === 'whatsappQrImage' ? 'Uploading…' : 'Upload custom QR'}
                </label>
                {info.whatsappQrImage && (
                  <button
                    type="button"
                    onClick={() => update('whatsappQrImage', '')}
                    className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-red-600 border border-gray-200 rounded-lg px-3 py-2"
                  >
                    <X className="w-4 h-4" /> Use auto-generated
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Optional. By default the QR code is generated automatically from the WhatsApp number above. Upload
                your own branded QR image here to use that instead.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-bold text-primary-dark">Social Links</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
            <input value={info.social.facebook} onChange={(e) => updateSocial('facebook', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
            <input value={info.social.instagram} onChange={(e) => updateSocial('instagram', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
            <input value={info.social.linkedin} onChange={(e) => updateSocial('linkedin', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">YouTube</label>
            <input value={info.social.youtube} onChange={(e) => updateSocial('youtube', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
          </div>
        </div>
      </section>
    </div>
  );
}
