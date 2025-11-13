import React, { useEffect, useState, useMemo } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useParams, Link } from 'react-router-dom';
import { apiGet, API_BASE } from '@/lib/api';
import resolveMediaUrl from '@/lib/media';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';

const Listing = () => {
  const { id } = useParams();
  const [property, setProperty] = useState<any|null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [dateRange, setDateRange] = useState<any | undefined>(undefined);
  const [guests, setGuests] = useState(1);
  // keyboard handlers for viewer
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!viewerOpen) return;
      if (e.key === 'Escape') setViewerOpen(false);
      if (e.key === 'ArrowRight') setViewerIndex(i => i + 1);
      if (e.key === 'ArrowLeft') setViewerIndex(i => i - 1);
    }
    window.addEventListener('keydown', onKey as any);
    return () => window.removeEventListener('keydown', onKey as any);
  }, [viewerOpen]);
  useEffect(() => {
  setError(null);
  setProperty(null);
    if (!id) return;
    // validate id (Mongo ObjectId is 24 hex chars)
    const ok = /^[a-fA-F0-9]{24}$/.test(id);
    if (!ok) {
      setError('Invalid listing id. Check the URL or go back to search.');
      return;
    }
    apiGet(`/api/properties/${id}`).then(setProperty).catch((e:any) => {
      console.error('Failed to load property', e);
      setError('Failed to load listing. It may not exist or the server is unreachable.');
    });
  }, [id]);

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-6 py-24">
        {error ? (
          <div className="bg-card p-4 rounded">
            <p className="text-destructive font-medium">{error}</p>
            <p className="mt-2"><a href="/search" className="text-primary underline">Back to search</a></p>
          </div>
        ) : !property ? (
          <p>Loading…</p>
        ) : (
          <article className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div>
                <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                  <div>{property.location || property.city || 'Location unknown'}</div>
                  <div>·</div>
                  <div>{(property.guests ?? property.capacity) ? `${property.guests || property.capacity} guests` : '—'}</div>
                </div>

                {/* Hero image + thumbnails */}
                <div className="mb-4">
                  <div className="rounded overflow-hidden bg-muted">
                    <img
                      src={resolveMediaUrl(property.media && property.media.length ? property.media[viewerIndex] : '/placeholder.jpg')}
                      alt={`${property.title} hero`}
                      className="w-full h-96 object-cover cursor-zoom-in"
                      onClick={() => { setViewerOpen(true); }}
                    />
                  </div>
                  <div className="mt-3 flex gap-2 overflow-x-auto">
                    {(property.media && property.media.length > 0) ? (
                      property.media.map((m:string, i:number) => (
                        <button key={i} className={`rounded overflow-hidden shrink-0 ${i===viewerIndex? 'ring-2 ring-primary' : ''}`} onClick={() => setViewerIndex(i)}>
                          <img src={resolveMediaUrl(m)} alt={`thumb-${i}`} className="w-24 h-16 object-cover" />
                        </button>
                      ))
                    ) : (
                      <div className="rounded overflow-hidden bg-muted">
                        <img src="/placeholder.jpg" alt="placeholder" className="w-24 h-16 object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Lightbox viewer */}
                {viewerOpen && property?.media && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-75" onClick={() => setViewerOpen(false)}>
                    <div className="relative max-w-4xl w-full mx-4" onClick={e=>e.stopPropagation()}>
                      <img src={resolveMediaUrl(property.media[viewerIndex])} alt={`${property.title} viewer`} className="w-full h-auto max-h-[80vh] object-contain rounded" />
                      <button className="absolute top-3 right-3 p-2 bg-card/80 rounded" onClick={()=>setViewerOpen(false)}>Close</button>
                      {viewerIndex > 0 && <button className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-card/80 rounded" onClick={()=>setViewerIndex(i=>Math.max(0,i-1))}>Prev</button>}
                      {viewerIndex < property.media.length-1 && <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-card/80 rounded" onClick={()=>setViewerIndex(i=>Math.min(property.media.length-1,i+1))}>Next</button>}
                    </div>
                  </div>
                )}

                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">About this place</h3>
                    <p className="text-muted-foreground mb-4">{property.description}</p>

                    {/* Amenities */}
                    <h4 className="font-medium mb-2">Amenities</h4>
                    <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-muted-foreground mb-4">
                      {property.amenities && property.amenities.length > 0 ? (
                        property.amenities.map((a:string, i:number) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary/60 inline-block" />
                            <span>{a}</span>
                          </li>
                        ))
                      ) : property.sensory ? (
                        Object.keys(property.sensory).map((k:string) => (
                          <li key={k} className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary/60 inline-block" />{k}</li>
                        ))
                      ) : (
                        <li className="text-sm text-muted-foreground">No amenities listed.</li>
                      )}
                    </ul>
                  </div>

                  <div>
                    {/* Host card */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            {property.host?.avatar ? <AvatarImage src={resolveMediaUrl(property.host.avatar)} /> : <AvatarFallback>{(property.host?.name || 'H').charAt(0)}</AvatarFallback>}
                          </Avatar>
                          <div>
                            <div className="font-semibold">{property.host?.name || property.owner?.name || 'Host'}</div>
                            <div className="text-sm text-muted-foreground">Superhost • Joined {property.host?.joined ? new Date(property.host.joined).getFullYear() : '—'}</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">{property.host?.bio || 'No host bio provided.'}</p>
                        <div className="flex gap-2">
                          <Link to={`/host/${property.host?._id || property.owner?._id}`} className="text-sm underline text-primary">View profile</Link>
                          <a className="text-sm underline text-primary" href="#contact">Contact host</a>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                  {/* wrap potentially error-prone sections in an error boundary */}
                  <ErrorBoundary>
                    {/* Reviews */}
                    <section className="mt-8">
                      <h3 className="text-lg font-semibold mb-3">Reviews</h3>
                      {property.reviews && property.reviews.length > 0 ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                            <div className="font-semibold">{(property.reviews.reduce((s:any,r:any)=>s+(r.rating||0),0)/property.reviews.length).toFixed(1)}</div>
                            <div>{property.reviews.length} reviews</div>
                          </div>
                          {property.reviews.slice(0,3).map((r:any,i:number)=> (
                            <div key={i} className="p-3 bg-card rounded">
                              <div className="flex items-center justify-between">
                                <div className="text-sm font-medium">{r.authorName || 'Guest'}</div>
                                <div className="text-sm text-muted-foreground">{r.rating} ★</div>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{r.text}</p>
                            </div>
                          ))}
                          <div>
                            <Link to="#all-reviews" className="text-sm underline text-primary">Read all reviews</Link>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">No reviews yet.</div>
                      )}
                    </section>
                  </ErrorBoundary>

                
              </div>
            </div>

            <aside className="lg:col-span-1 space-y-4">
              <div className="bg-card p-4 rounded shadow-sm space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground">Trial stay</div>
                  <div className="text-2xl font-bold">${Number(property.price?.baseRate ?? property.pricing?.trial ?? 0)}</div>
                </div>

                {/* Price breakdown (client-side estimation) */}
                <div className="text-sm text-muted-foreground">
                  <div>Cleaning: ${Number(property.price?.cleaning ?? 0)}</div>
                  <div>Refundable deposit: ${Number(property.price?.refundableDeposit ?? 0)}</div>
                  <div>Platform fee: {Number(Math.round((Number(property.price?.baseRate ?? 0) * Number(property.price?.platformFeePct ?? 0.1)))).toFixed(2)}</div>
                </div>

                <div className="mt-2">
                  <Link className="btn btn-primary w-full block text-center" to={`/booking/${property._id}`}>Book this trial</Link>
                </div>
              </div>

              <div className="bg-card p-4 rounded text-sm text-muted-foreground">
                <div className="font-semibold mb-2">Quick facts</div>
                <ul className="space-y-1">
                  <li>Type: {property.experienceType || 'Stay'}</li>
                  <li>Location: {property.location || property.city || '—'}</li>
                  <li>Duration options: 3–7 days</li>
                </ul>
              </div>
            </aside>
          </article>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Listing;
