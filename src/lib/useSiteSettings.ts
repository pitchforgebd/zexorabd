import { useEffect, useState } from 'react';
import { apiFetch, ApiError } from './api';
import type { SiteSettings, Supplier } from './types';

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
