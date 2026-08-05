import { API_BASE_URL } from '@/config/appInfo';

/**
 * A very small fetch wrapper.
 *
 * The template's services return mock data and never call this, but it is here
 * so that the first real endpoint you add has somewhere obvious to go, with the
 * three things every app ends up needing: a base URL, JSON in and out, and a
 * failed response turned into a thrown error instead of a silent `ok: false`.
 */

export class ApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const readToken = () => {
  try {
    return JSON.parse(localStorage.getItem('dashboard-session') || 'null')?.token || null;
  } catch {
    return null;
  }
};

export const request = async (path, { method = 'GET', body, headers, signal } = {}) => {
  const token = readToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    signal,
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : null),
      ...(token ? { Authorization: `Bearer ${token}` } : null),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  // 204 and friends have no body, and calling .json() on them throws.
  const payload = response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(payload?.message || `Request failed with status ${response.status}`, {
      status: response.status,
      data: payload,
    });
  }

  return payload;
};

export const apiClient = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
};
