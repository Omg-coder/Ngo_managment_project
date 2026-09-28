import React from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="border-b border-sand bg-forest text-paper sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        {/* NGO Brand & Identity */}
        <Link to="/" className="flex flex-col group">
          <span className="font-serif text-xl sm:text-2xl font-semibold tracking-wide text-paper group-hover:text-mustard transition-colors">
            HopeHarbor Initiative
          </span>
          <span className="text-xs text-sand-light tracking-wider uppercase font-light">
            Community Outreach & Relief Network
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6 text-sm">
          <Link 
            to="/" 
            className="text-paper hover:text-mustard transition-colors"
          >
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link 
                to="/dashboard" 
                className="text-paper hover:text-mustard transition-colors"
              >
                Dashboard
              </Link>

              {user?.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className="text-mustard hover:text-paper font-medium transition-colors"
                >
                  Admin Portal
                </Link>
              )}

              <div className="flex items-center gap-3 pl-2 border-l border-forest-light">
                <span className="text-xs text-sand-light hidden sm:inline">
                  {user?.name} <span className="text-mustard">({user?.role})</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="text-xs px-3 py-1.5 border border-sand text-paper hover:bg-forest-dark transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link 
                to="/login" 
                className="text-paper hover:text-mustard transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="px-3.5 py-1.5 bg-mustard text-forest-dark font-medium hover:bg-mustard-hover transition-colors text-xs tracking-wide"
              >
                Join Us
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
