import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { apiPost } from '@/lib/api';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleRegister(e:any) {
    e.preventDefault();
    setStatus('Creating account…');
    try {
      const res = await apiPost('/api/auth/register', { name, email, password });
  if (res.token) localStorage.setItem('token', res.token);
  if (res.user && res.user._id) localStorage.setItem('userId', res.user._id);
  if (res.user && res.user.role) localStorage.setItem('userRole', res.user.role);
      setStatus('Account created');
      navigate('/');
    } catch (err:any) {
      setStatus('Registration failed: ' + (err.message || String(err)));
    }
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-6 py-24">
        <h1 className="text-3xl font-bold mb-4">Create account</h1>
        <form onSubmit={handleRegister} className="max-w-md space-y-4">
          <div>
            <label className="block mb-1">Full name</label>
            <input className="input w-full" value={name} onChange={e=>setName(e.target.value)} />
          </div>
          <div>
            <label className="block mb-1">Email</label>
            <input className="input w-full" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block mb-1">Password</label>
            <input type="password" className="input w-full" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          <div>
            <button className="btn btn-primary">Create account</button>
          </div>
          <div className="text-sm text-muted-foreground">Already have an account? <Link to="/login" className="text-primary underline">Sign in</Link></div>
          {status && <p className="text-sm mt-2">{status}</p>}
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
