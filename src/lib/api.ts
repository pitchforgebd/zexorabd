export class ApiError extends Error {
  code: string;
  status: number;
  constructor(message: string, status: number, code: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

type SuccessEnvelope<T> = { success: true; data: T };
type ErrorEnvelope = { success: false; error: { message: string; code: string } };

// Basic in-memory GET cache: de-dupes concurrent identical requests (e.g.
// two Home sections both calling useSiteSettings() on the same render) into
// one HTTP call, and reuses the result for a short window on re-navigation.
// Admin routes are deliberately excluded - an admin who just saved an edit
// needs to see it immediately, not a stale cached list.
const GET_CACHE = new Map<string, { promise: Promise<unknown>; timestamp: number }>();
const CACHE_TTL_MS = 30_000;

function isCacheable(path: string, method: string): boolean {
  return method === 'GET' && !path.startsWith('/api/admin/');
}

async function performFetch<T>(path: string, method: string, options: RequestInit): Promise<T> {
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (method !== 'GET' && method !== 'HEAD') {
    const csrfToken = readCookie('csrf_token');
    if (csrfToken) headers.set('X-CSRF-Token', csrfToken);
  }

  const res = await fetch(path, { ...options, method, headers, credentials: 'include' });
  const body = (await res.json()) as SuccessEnvelope<T> | ErrorEnvelope;

  if (body.success === false) {
    const errorBody: ErrorEnvelope = body;
    throw new ApiError(errorBody.error.message, res.status, errorBody.error.code);
  }
  return body.data;
}

/**
 * Shared fetch wrapper for the Node/Express API. Used by both the public
 * site (GET-only, no session needed) and the admin panel (adds the CSRF
 * header automatically on mutating requests once a session exists). Paths
 * are always relative (/api/...) - same-origin in both dev (via Vite's
 * proxy) and production (the Node app serves the whole site, Phase 9), so
 * there's no separate API base URL to configure per environment.
 */
export async function apiFetch<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const method = (options.method || 'GET').toUpperCase();

  if (isCacheable(path, method)) {
    const cached = GET_CACHE.get(path);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.promise as Promise<T>;
    }
    const promise = performFetch<T>(path, method, options);
    GET_CACHE.set(path, { promise, timestamp: Date.now() });
    promise.catch(() => GET_CACHE.delete(path)); // don't cache failures
    return promise;
  }

  return performFetch<T>(path, method, options);
}
