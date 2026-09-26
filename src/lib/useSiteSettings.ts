import { useEffect, useState } from 'react';
import { apiFetch, ApiError } from './api';
import type { SiteInfo, SiteSettings, Supplier } from './types';

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<SiteSettings>('/api/site-settings')
      .then(setSettings)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load site settings'))
      .finally(() => setLoading(false));
  }, []);

  return { settings, loading, error };
}

// Same values as server/scripts/seedSiteInfo.js - used so Header/Footer/
// Contact render sensible content on first paint (before the fetch
// resolves) and never break if global.siteInfo hasn't been saved yet.
export const DEFAULT_SITE_INFO: SiteInfo = {
  logo: '/logo.png',
  footerLogo: '',
  favicon: '/favicon.png',
  ogImage: '/logo.png',
  companyName: 'Zexora Corporation',
  tagline:
    'A diversified multi-sector business group committed to excellence, innovation, and long-term value creation across industries.',
  email: 'info@zexora.com.bd',
  phone: '+880 1855 939 450',
  whatsapp: '+8801855939450',
  whatsappQrImage: '',
  address: '292, Inner Circular Road, Shatabdi Centre, Fakirapool, Motijheel, Dhaka-1000',
  businessHours: 'Saturday–Thursday: 9:00 AM – 6:00 PM\nFriday: Closed',
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.3843701617134!2d90.4185923!3d23.733669!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b9e75f0afbbd%3A0x5f71646b22407002!2sZexora%20Corporation!5e0!3m2!1sen!2sbd!4v1782203946425!5m2!1sen!2sbd',
  social: {
    facebook: 'https://www.facebook.com/zexoracorporation',
    instagram: 'https://www.instagram.com/zexoracorporation',
    linkedin: 'https://www.linkedin.com/company/zexoracorporation',
    youtube: 'https://www.youtube.com/@zexoracorporation',
  },
};

/** Convenience hook: merged, always-populated site info (no null/optional handling needed at call sites). */
export function useSiteInfo(): SiteInfo {
  const { settings } = useSiteSettings();
  const saved = settings?.['global.siteInfo'];
  if (!saved) return DEFAULT_SITE_INFO;
  return { ...DEFAULT_SITE_INFO, ...saved, social: { ...DEFAULT_SITE_INFO.social, ...saved.social } };
}

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<Supplier[]>('/api/suppliers')
      .then(setSuppliers)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load suppliers'))
      .finally(() => setLoading(false));
  }, []);

  return { suppliers, loading, error };
}
