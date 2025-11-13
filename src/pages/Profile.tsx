import React, { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { apiGet } from '@/lib/api';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import resolveMediaUrl from '@/lib/media';
import { useNavigate, Link } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState<any|null>(null);
  const [loading, setLoading] = useState(true);
  const [listingCount, setListingCount] = useState<number | null>(null);
  const [bookingCount, setBookingCount] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
  apiGet('/api/me').then(data => { if (mounted) { setUser(data); if (data && data._id) { if (data.role === 'host') fetchListingsCount(data._id); fetchBookingsCount(data._id); } } }).catch(()=>{}).finally(()=>{ if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  async function fetchListingsCount(uid: string) {
    try {
      const res = await apiGet(`/api/properties?owner=${uid}`);
      setListingCount(Array.isArray(res) ? res.length : 0);
    } catch (err) { setListingCount(null); }
  }

  async function fetchBookingsCount(uid: string) {
    try {
      const res = await apiGet(`/api/bookings?guest=${uid}`);
      setBookingCount(Array.isArray(res) ? res.length : 0);
    } catch (err) { setBookingCount(null); }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    location.href = '/';
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-6 py-24">
        <h1 className="text-3xl font-bold mb-6">Your profile</h1>
        {loading ? <p>Loading…</p> : (
          user ? (
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              <div className="md:col-span-1">
                <Card className="panel-surface overflow-visible">
                  <CardHeader>
                    <div className="relative pb-4">
                      <div className="absolute -top-10 left-6">
                        <Avatar className="w-24 h-24 ring-4 ring-white shadow-lg">
                          {user.avatar ? <AvatarImage src={resolveMediaUrl(user.avatar)} /> : <AvatarFallback className="text-lg">{(user.name||'U').charAt(0)}</AvatarFallback>}
                        </Avatar>
                      </div>
                      <div className="ml-32">
                        <CardTitle className="text-xl">{user.name}</CardTitle>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-xs text-muted-foreground">Listings</div>
                        <div className="font-semibold text-lg">{listingCount ?? '—'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Bookings</div>
                        <div className="font-semibold text-lg">{bookingCount ?? '—'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Member</div>
                        <div className="font-semibold text-lg">{user.createdAt ? new Date(user.createdAt).getFullYear() : '—'}</div>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col sm:flex-row gap-3">
                      <Button variant="gold" size="sm" onClick={()=>navigate('/profile/edit')}>Edit profile</Button>
                      {user.role === 'host' ? (
                        <Button size="sm" onClick={()=>navigate('/dashboard/host')}>Host dashboard</Button>
                      ) : (
                        <Button variant="outline" size="sm" asChild><Link to="/host">Become a host</Link></Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-2 space-y-4">
                <Card className="panel-surface">
                  <CardHeader className="flex items-center justify-between">
                    <CardTitle>Profile details</CardTitle>
                    <div>
                      <Button variant="outline" size="sm" onClick={()=>navigate('/profile/edit')}>Edit</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Full name</div>
                        <div className="font-medium">{user.name}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Email</div>
                        <div className="font-medium">{user.email}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Role</div>
                        <div className="font-medium">{user.role}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Joined</div>
                        <div className="font-medium">{user.createdAt ? new Date(user.createdAt).toLocaleString() : '—'}</div>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground">Want to update your profile? Use the <Link to="/profile/edit" className="underline text-primary">Edit profile</Link> flow.</div>
                  </CardContent>
                </Card>

                <Card className="panel-surface">
                  <CardHeader>
                    <CardTitle>Account actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button variant="outline" size="sm" onClick={()=>{ navigator.share ? navigator.share({ title: 'My profile', text: user.name }) : alert('Share not supported'); }}>Share profile</Button>
                      <Button size="sm" onClick={()=>alert('Change password flow not implemented')}>Change password</Button>
                      {user.role === 'guest' && <Button variant="gold" size="sm" asChild><Link to="/host">Become a host</Link></Button>}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Not signed in.</p>
          )
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
