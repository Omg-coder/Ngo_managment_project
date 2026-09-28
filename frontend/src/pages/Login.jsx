import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      });

      const data = await res.json();

      if (res.ok) {
        // Save user and token in AuthContext (and localStorage)
        login(data.user, data.accessToken);

        // Redirect based on role or previous location
        const from = location.state?.from?.pathname;
        if (from) {
          navigate(from, { replace: true });
        } else if (data.user?.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      } else {
        setError(data.message || 'Invalid email or password.');
      }
    } catch (err) {
      setError(err.message || 'Network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-paper border border-sand p-6 sm:p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-serif text-forest">Sign In to HopeHarbor</h2>
          <p className="text-xs text-charcoal-muted mt-1">
            Access your member dashboard or administrative portal.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal-muted mb-1 font-medium">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="e.g. user@example.com"
              className="w-full bg-paper border border-sand px-3 py-2 text-sm text-charcoal focus:outline-none focus:border-forest"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal-muted mb-1 font-medium">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-paper border border-sand px-3 py-2 text-sm text-charcoal focus:outline-none focus:border-forest"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-forest text-paper font-medium text-sm hover:bg-forest-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-sand text-center text-xs text-charcoal-muted">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-forest font-medium hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
