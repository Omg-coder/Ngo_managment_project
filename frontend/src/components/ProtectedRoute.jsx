import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';

// ProtectedRoute: Ensures user is logged in, and optionally has the required role
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // 1. If not logged in, redirect to login page (preserving current location)
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. If specific roles are required (e.g. "admin"), verify role matches
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="bg-paper border border-sand p-8 max-w-md text-center">
          <h2 className="text-2xl font-serif text-forest mb-2">Access Restricted</h2>
          <p className="text-charcoal-muted mb-6 text-sm">
            This area requires administrative privileges. You are currently logged in as a <strong>{user.role}</strong>.
          </p>
          <Navigate to="/dashboard" replace />
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
