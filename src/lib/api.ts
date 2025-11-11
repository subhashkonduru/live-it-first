export const API_BASE = (window as any).__API_BASE__ || (import.meta as any).env.VITE_API_BASE || 'http://localhost:4000';

export async function apiGet(path: string) {
  const headers: Record<string,string> = {};
  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiPost(path: string, body: any, opts: { isForm?: boolean } = {}) {
  const headers: Record<string,string> = {};
  let bodyData: BodyInit;
  if (opts.isForm) {
    bodyData = body; // FormData
  } else {
    headers['Content-Type'] = 'application/json';
    bodyData = JSON.stringify(body);
  }
  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { method: 'POST', headers, body: bodyData });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export default { apiGet, apiPost };

export async function apiDelete(path: string) {
  const headers: Record<string,string> = {};
  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { method: 'DELETE', headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiPatch(path: string, body: any) {
  const headers: Record<string,string> = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { method: 'PATCH', headers, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
