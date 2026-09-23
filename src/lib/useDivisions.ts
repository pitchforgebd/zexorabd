import { useEffect, useState } from 'react';
import { apiFetch, ApiError } from './api';
import type { DivisionDetail, DivisionSummary } from './types';

export function useDivisionsList() {
  const [divisions, setDivisions] = useState<DivisionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    apiFetch<DivisionSummary[]>('/api/divisions')
      .then((data) => {
        if (!cancelled) setDivisions(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : 'Failed to load divisions');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { divisions, loading, error };
}

export function useDivision(slug: string | undefined) {
  const [division, setDivision] = useState<DivisionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);
    setDivision(null);
    setError(null);
    apiFetch<DivisionDetail>(`/api/divisions/${slug}`)
      .then((data) => {
        if (!cancelled) setDivision(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : 'Failed to load division');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { division, loading, error };
}
