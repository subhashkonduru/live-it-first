import React, { useState } from 'react';
import { apiPost } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

const HostSignInModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  if (!open) return null;

  async function signInDemoHost() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiPost('/api/auth/login', { email: process.env.VITE_SEED_HOST_EMAIL || 'host@example.com', password: 'password' });
      // expected { token, user }
      if (res.token) {
        localStorage.setItem('token', res.token);
        if (res.user) {
          localStorage.setItem('userId', res.user._id || res.user.id || '');
          localStorage.setItem('userRole', res.user.role || 'host');
        }
        onClose();
        // navigate back to host page to refresh UI
        navigate('/host', { replace: true });
        return;
      }
      setError('Unexpected response from server');
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Sign in failed');
    } finally { setLoading(false); }
  }

  function copyDemoCreds() {
    const text = `host@example.com\npassword`;
    try { navigator.clipboard.writeText(text); } catch (e) { /* ignore */ }
  }

  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-60 p-4">
      <div className="w-full max-w-2xl bg-card rounded-lg shadow-lg overflow-hidden border border-border">
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-2">Sign in as a Host</h2>
          <p className="text-sm text-muted-foreground mb-4">You need to be signed in as a host to create listings. Use the demo host account below or sign in with your own account.</p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-4 border rounded bg-card">
              <h3 className="font-medium">Demo host</h3>
              <p className="text-sm text-muted-foreground break-words">host@example.com</p>
              <p className="text-sm text-muted-foreground">password</p>
              <div className="mt-3 flex gap-2">
                <button className="btn btn-sm" onClick={copyDemoCreds}>Copy</button>
                <button className="btn btn-sm btn-primary" onClick={signInDemoHost} disabled={loading}>{loading ? 'Signing in…' : 'Sign in (demo)'}</button>
              </div>
            </div>

            <div className="p-4 border rounded bg-card">
              <h3 className="font-medium">Your account</h3>
              <p className="text-sm text-muted-foreground">Already have an account?</p>
              <div className="mt-3 flex gap-2">
                <button className="btn btn-sm" onClick={() => navigate('/register')}>Create account</button>
                <button className="btn btn-sm btn-outline" onClick={() => navigate('/login')}>Open sign in</button>
              </div>
            </div>
          </div>

          {error ? <div className="text-sm text-red-600 mb-3">{error}</div> : null}

          <div className="flex justify-end gap-2">
            <button className="btn" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostSignInModal;
