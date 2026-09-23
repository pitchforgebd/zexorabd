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

/**
 * Shared fetch wrapper for the Node/Express API. Used by both the public
 * site (GET-only, no session needed) and the admin panel (adds the CSRF
 * header automatically on mutating requests once a session exists).
 */
export async function apiFetch<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const method = (options.method || 'GET').toUpperCase();
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
