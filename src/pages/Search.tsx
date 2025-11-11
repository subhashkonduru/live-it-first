import React, { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { apiGet } from '@/lib/api';
import resolveMediaUrl from '@/lib/media';
import { PropertyCard } from '@/components/PropertyCard';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // render a property card without calling hooks inside map
  const ItemCard = ({ p }: { p: any }) => {
    const rawId = p._id || '';
    return (
      <div
        key={rawId}
        role="link"
        onClick={() => { if (rawId) navigate(`/listing/${rawId}`); }}
        className="block cursor-pointer"
      >
        <PropertyCard
          image={resolveMediaUrl(p.media && p.media.length ? p.media[0] : undefined)}
          title={p.title || 'Untitled'}
          location={p.location || p.city || '—'}
          duration={p.duration || '3 days'}
          price={(p.price && (p.price.baseRate || p.price.baseRate === 0)) ? Number(p.price.baseRate) : (p.pricing?.trial || 0)}
          rating={p.rating}
          reviews={p.reviews}
          experienceType={p.experienceType || 'Stay'}
          availability={p.available ? 'Available Now' : 'Booking Soon'}
        />
      </div>
    );
  };
  useEffect(() => {
    let cancelled = false;
    apiGet('/api/properties')
      .then(data => { if (!cancelled) setItems(data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-6 py-24">
        <h1 className="text-3xl font-bold mb-6">Search Experiences</h1>
        {loading ? (
          <p>Loading…</p>
        ) : (
          items.length === 0 ? (
            <p className="text-muted-foreground">No properties found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map(p => (
                    <ItemCard key={p._id} p={p} />
                  ))}
                </div>
          )
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Search;
