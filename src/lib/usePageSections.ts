import { useEffect, useState } from 'react';
import { apiFetch, ApiError } from './api';
import type { PageSection } from './types';

export function usePageSections(pageKey: string) {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<PageSection[]>(`/api/pages/${pageKey}/sections`)
      .then(setSections)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load page layout'))
      .finally(() => setLoading(false));
  }, [pageKey]);

  return { sections, loading, error };
}
