import { useEffect, useRef, useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { apiFetch, ApiError } from '../../lib/api';
import type { SiteInfo, SiteSettings } from '../../lib/types';

const EMPTY: SiteInfo = {
  logo: '',
  companyName: '',
  tagline: '',
  email: '',
  phone: '',
  whatsapp: '',
  address: '',
  businessHours: '',
  mapEmbedUrl: '',
  social: { facebook: '', instagram: '', linkedin: '', youtube: '' },
};

export default function AdminWebsiteSettings() {
  const [info, setInfo] = useState<SiteInfo>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

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

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const result = await apiFetch<{ url: string }>('/api/admin/site-settings/upload-image', { method: 'POST', body: fd });
      update('logo', result.url);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Logo upload failed');
    } finally {
      setUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = '';
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
          <p className="text-body-text text-sm">Logo, contact info, and social links shown across the whole site.</p>
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
            <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" id="logo-upload" />
            <label
              htmlFor="logo-upload"
              className="cursor-pointer inline-flex items-center gap-2 text-sm font-medium text-primary-blue hover:text-accent-hover border border-primary-blue/30 rounded-lg px-4 py-2"
            >
              <ImagePlus className="w-4 h-4" /> {uploadingLogo ? 'Uploading…' : 'Upload logo'}
            </label>
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
            <p className="text-xs text-gray-400 mt-1">Used for the footer's "Connect on WhatsApp" QR code link.</p>
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
