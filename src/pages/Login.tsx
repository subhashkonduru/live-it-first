import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { apiPost } from '@/lib/api';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Lock } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsError(false);
    setIsLoading(true);
    setStatus('Signing in…');
    try {
      const res = await apiPost('/api/auth/login', { email, password });
      if (res.token) localStorage.setItem('token', res.token);
      if (res.user && res.user._id) localStorage.setItem('userId', res.user._id);
      if (res.user && res.user.role) localStorage.setItem('userRole', res.user.role);
      setStatus('Signed in — redirecting…');
      setTimeout(() => navigate('/'), 400);
    } catch (err: any) {
      const msg = (err && err.message) ? err.message : String(err || 'Unknown error');
      let friendly = 'Sign in failed: ' + msg;
      if (msg.includes('Failed to fetch')) {
        friendly = 'Cannot reach API (http://localhost:4000). Is the backend running?';
      }
      setStatus(friendly);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-background/60 to-background/80">
      <Navigation />

      <main className="container mx-auto px-6 py-20 flex justify-center">
        <section className="w-full max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Welcome back</h1>
            <p className="mt-2 text-lg text-muted-foreground">Sign in to manage your stays and listings.</p>
          </div>

          <div className="panel-luxe border-border backdrop-blur-md rounded-3xl p-8">
            <form onSubmit={handleLogin} className="grid grid-cols-1 gap-6">
              <div className="stagger-child" style={{ animationDelay: '120ms' }}>
                <div className="floating">
                  <div className="relative mt-2">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground"><Mail className="h-4 w-4" /></div>
                    <Input id="email" aria-label="Email" className="pl-10" value={email} onChange={e => setEmail(e.target.value)} placeholder=" " />
                    <Label htmlFor="email" className="floating-label">Email</Label>
                  </div>
                </div>
              </div>

              <div className="stagger-child" style={{ animationDelay: '220ms' }}>
                <div className="floating">
                  <div className="relative mt-2">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground"><Lock className="h-4 w-4" /></div>
                    <Input id="password" type="password" aria-label="Password" className="pl-10" value={password} onChange={e => setPassword(e.target.value)} placeholder=" " />
                    <Label htmlFor="password" className="floating-label">Password</Label>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <Checkbox checked={remember} onCheckedChange={(v:any)=>setRemember(Boolean(v))} />
                  <span className="text-sm">Remember me</span>
                </label>
                <Link to="/forgot" className="text-sm underline text-muted-foreground">Forgot password?</Link>
              </div>

              <div className="stagger-child flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" style={{ animationDelay: '340ms' }}>
                <Button type="submit" variant="premium" size="lg" className={`w-full sm:w-auto ${isLoading ? 'opacity-60 pointer-events-none' : ''}`}>{isLoading ? 'Signing in…' : 'Sign in'}</Button>
                <Link to="/register" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">Create account</Button>
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <div className="text-sm text-muted-foreground">or</div>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="stagger-child flex gap-3" style={{ animationDelay: '460ms' }}>
                <Button variant="outline" size="default" className="flex-1">Continue with Google</Button>
                <Button variant="outline" size="default" className="flex-1">Continue with Apple</Button>
              </div>

              <div className="stagger-child flex gap-2 mt-2" style={{ animationDelay: '560ms' }}>
                <Button variant="ghost" size="sm" onClick={() => { setEmail('guest@example.com'); setPassword('password'); }} className="text-sm text-muted-foreground">Use demo guest</Button>
                <Button variant="ghost" size="sm" onClick={() => { setEmail('host@example.com'); setPassword('password'); }} className="text-sm text-muted-foreground">Use demo host</Button>
              </div>

              {status && (
                <div aria-live="polite" className={`text-sm mt-2 ${isError ? 'text-destructive' : 'text-emerald-500'}`}>{status}</div>
              )}
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
