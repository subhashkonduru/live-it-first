import React, { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { apiGet } from '@/lib/api';

const HostDashboard = () => {
  const [propsList, setPropsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  useEffect(() => {
    if (!userId) return setLoading(false);
    let cancelled = false;
    apiGet(`/api/properties?owner=${userId}`).then(list => { if (!cancelled) setPropsList(list || []); }).catch(()=>{}).finally(()=>{ if(!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [userId]);

  async function toggleAvailability(p:any) {
    try {
      const base = (window as any).__API_BASE__ || (import.meta as any).env.VITE_API_BASE || 'http://localhost:4000';
      const token = localStorage.getItem('token');
      const res = await fetch(`${base}/api/properties/${p._id}`, {
        method: 'PATCH',
        headers: Object.assign({ 'Content-Type': 'application/json' }, token ? { Authorization: `Bearer ${token}` } : {}),
        body: JSON.stringify({ available: !p.available })
      });
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();
      setPropsList(ps => ps.map(x => x._id === updated._id ? updated : x));
    } catch (err) {
      console.error('update failed', err);
      alert('Failed to update property');
    }
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-6 py-24">
        <h1 className="text-3xl font-bold mb-4">Host Dashboard</h1>
        {!userId ? (
          <div className="bg-card p-4 rounded max-w-xl">
            <p className="mb-3">You're not signed in as a host. <a href="/login" className="text-primary underline">Sign in</a> with your host account to manage listings.</p>
          </div>
        ) : loading ? (
          <p>Loading…</p>
        ) : (
          <div className="space-y-4">
            {propsList.length === 0 ? (
              <p className="text-muted-foreground">You have no listings yet. Create a new listing from the Host page.</p>
            ) : (
              propsList.map(p => (
                <div key={p._id} className="bg-card p-4 rounded flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{p.title}</div>
                    <div className="text-sm text-muted-foreground">{p.description ? p.description.slice(0,120) : ''}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-muted-foreground">Available</label>
                    <input type="checkbox" checked={!!p.available} onChange={() => toggleAvailability(p)} />
                    <a href={`/listing/${p._id}`} className="text-primary underline text-sm">View</a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default HostDashboard;
