import React, { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { apiGet, apiDelete, apiPost } from '@/lib/api';

const AdminDashboard = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [props, setProps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([apiGet('/api/admin/users'), apiGet('/api/admin/properties')])
      .then(([u, p]) => { if (!cancelled) { setUsers(u); setProps(p); } })
      .catch(()=>{})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  async function handleDeleteProperty(id: string) {
    if (!confirm('Delete this property? This action cannot be undone.')) return;
    try {
      await apiDelete(`/api/admin/properties/${id}`);
      setProps(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error('Failed to delete property', err);
      alert('Delete failed. Check console for details.');
    }
  }

  async function handleChangeRole(userId: string, newRole: string) {
    if (!confirm(`Set role to ${newRole} for this user?`)) return;
    try {
      const res = await apiPost(`/api/admin/users/${userId}/role`, { role: newRole });
      setUsers(prev => prev.map(u => (u._id === userId ? res.user : u)));
    } catch (err) {
      console.error('Failed to change role', err);
      alert('Role change failed. Check console for details.');
    }
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-6 py-24">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        {loading ? <p>Loading…</p> : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="bg-card p-4 rounded">
              <h2 className="font-semibold mb-3">Users</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left"><th>Name</th><th>Email</th><th>Role</th></tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td></tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="bg-card p-4 rounded">
              <h2 className="font-semibold mb-3">Properties</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left"><th>Title</th><th>Host</th><th>Price</th></tr>
                </thead>
                <tbody>
                  {props.map(p => (
                    <tr key={p._id}>
                      <td className="py-2">{p.title}</td>
                      <td className="py-2">{p.host || p.owner?.name || '—'}</td>
                      <td className="py-2">{p.price || (p.pricing?.trial||0)}</td>
                      <td className="py-2">
                        <button className="text-sm text-destructive underline" onClick={() => handleDeleteProperty(p._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
