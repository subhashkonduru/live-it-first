import { API_BASE } from './api';

export function resolveMediaUrl(m?: string | null) {
  if (!m) return '/placeholder.jpg';
  try {
    if (typeof m === 'string' && m.startsWith('/uploads')) return `${API_BASE}${m}`;
  } catch (e) {
    // ignore
  }
  return m;
}

export default resolveMediaUrl;
