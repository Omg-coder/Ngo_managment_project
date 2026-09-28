import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { apiFetch } from '../api/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // defaults to 'user'
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: { name, email, password, role }
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Registration successful! Redirecting to sign in...');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setError(data.message || 'Registration failed.');
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
          <h2 className="text-2xl font-serif text-forest">Create an Account</h2>
          <p className="text-xs text-charcoal-muted mt-1">
            Join the HopeHarbor network as a volunteer, donor, or administrator.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-xs">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-sand-light border border-mustard text-forest text-xs">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal-muted mb-1 font-medium">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Ananya Sharma"
              className="w-full bg-paper border border-sand px-3 py-2 text-sm text-charcoal focus:outline-none focus:border-forest"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal-muted mb-1 font-medium">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="e.g. ananya@example.com"
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

          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal-muted mb-1 font-medium">
              Account Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-paper border border-sand px-3 py-2 text-sm text-charcoal focus:outline-none focus:border-forest"
            >
              <option value="user">User (Standard Member / Contributor)</option>
              <option value="admin">Admin (Full Administrative Access)</option>
            </select>
            <p className="text-[11px] text-charcoal-muted mt-1">
              Select 'admin' if you need full permissions to add/edit/delete volunteers and donors for this demo.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-forest text-paper font-medium text-sm hover:bg-forest-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-sand text-center text-xs text-charcoal-muted">
          Already registered?{' '}
          <Link to="/login" className="text-forest font-medium hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
