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
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    apiGet('/api/me').then(data => { if (mounted) { setUser(data); if (data && data.role === 'host' && data._id) fetchListingsCount(data._id); } }).catch(()=>{}).finally(()=>{ if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  async function fetchListingsCount(uid: string) {
    try {
      const res = await apiGet(`/api/properties?owner=${uid}`);
      setListingCount(Array.isArray(res) ? res.length : 0);
    } catch (err) { setListingCount(null); }
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
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Avatar className="w-20 h-20 floaty">
                        {user.avatar ? <AvatarImage src={resolveMediaUrl(user.avatar)} /> : <AvatarFallback>{(user.name||'U').charAt(0)}</AvatarFallback>}
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{user.name}</CardTitle>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mt-2 text-sm text-muted-foreground space-y-2">
                      <div><strong>Role:</strong> <span className="font-medium">{user.role}</span></div>
                      <div><strong>Member since:</strong> <span className="font-medium">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</span></div>
                      {user.role === 'host' && listingCount !== null && (<div><strong>Listings:</strong> <span className="font-medium">{listingCount}</span></div>)}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button className="btn btn-primary" onClick={()=>navigate('/dashboard/host')}>Host dashboard</button>
                      <button className="btn" onClick={handleLogout}>Logout</button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile details</CardTitle>
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

                <Card>
                  <CardHeader>
                    <CardTitle>Account actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button className="btn btn-outline" onClick={()=>{ navigator.share ? navigator.share({ title: 'My profile', text: user.name }) : alert('Share not supported'); }}>Share profile</button>
                      <button className="btn" onClick={()=>alert('Change password flow not implemented')}>Change password</button>
                      {user.role === 'guest' && <Link to="/host" className="btn btn-primary">Become a host</Link>}
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
