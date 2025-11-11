import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { apiPost } from '@/lib/api';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e:any) {
    e.preventDefault();
    setIsError(false);
    setIsLoading(true);
    setStatus('Signing in…');
    try {
      const res = await apiPost('/api/auth/login', { email, password });
  // store token if provided
  if (res.token) localStorage.setItem('token', res.token);
  if (res.user && res.user._id) localStorage.setItem('userId', res.user._id);
  if (res.user && res.user.role) localStorage.setItem('userRole', res.user.role);
      setStatus('Signed in — redirecting…');
      setIsLoading(false);
      navigate('/');
    } catch (err:any) {
      const msg = (err && err.message) ? err.message : String(err || 'Unknown error');
      let friendly = 'Sign in failed: ' + msg;
      if (msg.includes('Failed to fetch')) {
        friendly = 'Cannot reach API (http://localhost:4000). Is the backend running?';
      }
      setStatus(friendly);
      setIsError(true);
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-6 py-24">
        <h1 className="text-3xl font-bold mb-4">Sign in</h1>
        <form onSubmit={handleLogin} className="max-w-md space-y-4">
          <div>
            <label className="block mb-1">Email</label>
            <input className="input w-full" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block mb-1">Password</label>
            <input type="password" className="input w-full" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          <div>
            <button disabled={isLoading} className={`btn btn-primary ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}>
              {isLoading ? 'Signing in…' : 'Sign in'}
            </button>
          </div>
          <div className="text-sm text-muted-foreground">Don't have an account? <Link to="/register" className="text-primary underline">Create one</Link></div>

          <div className="flex gap-2 mt-2">
            <button type="button" onClick={()=>{ setEmail('guest@example.com'); setPassword('password'); }} className="btn">Use demo guest</button>
            <button type="button" onClick={()=>{ setEmail('host@example.com'); setPassword('password'); }} className="btn">Use demo host</button>
          </div>

          {status && (
            <p className={`text-sm mt-2 ${isError ? 'text-destructive' : 'text-emerald-600'}`}>{status}</p>
          )}
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
