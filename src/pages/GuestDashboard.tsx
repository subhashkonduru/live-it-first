import React, { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { apiGet } from '@/lib/api';
import resolveMediaUrl from '@/lib/media';
import { Link } from 'react-router-dom';

const GuestDashboard = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  useEffect(() => {
    if (!userId) return setLoading(false);
    let cancelled = false;
    apiGet(`/api/bookings/guest/${userId}`)
      .then(data => { if (!cancelled) setBookings(data); })
      .catch(()=>{})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [userId]);

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-6 py-24">
        <h1 className="text-3xl font-bold mb-6">Guest Dashboard</h1>
        {!userId ? (
          <div className="bg-card p-4 rounded max-w-xl">
            <p className="mb-3">You're not signed in. <Link to="/login" className="text-primary underline">Sign in</Link> to view your bookings.</p>
          </div>
        ) : loading ? (
          <p>Loading…</p>
        ) : bookings.length === 0 ? (
          <p className="text-muted-foreground">You have no bookings yet. Discover stays on the <Link to="/search" className="text-primary underline">search</Link> page.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map(b => (
              <article key={b._id} className="bg-card p-4 rounded shadow-sm">
                <div className="flex items-start gap-4">
                  <img src={resolveMediaUrl(b.property && b.property.media && b.property.media[0])} alt={b.property?.title || 'property'} className="w-28 h-20 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{b.property?.title || 'Untitled'}</h3>
                    <p className="text-sm text-muted-foreground">{new Date(b.checkIn).toLocaleDateString()} → {new Date(b.checkOut).toLocaleDateString()} • {b.durationDays} days</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-sm ${b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-800'}`}>{b.status}</span>
                      <Link to={`/listing/${b.property?._id}`} className="text-primary underline text-sm">View listing</Link>
                      <Link to={`/bookings/${b._id}`} className="text-primary underline text-sm">View booking</Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default GuestDashboard;
