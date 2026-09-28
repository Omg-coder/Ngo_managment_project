import React, { createContext, useContext, useState, useEffect } from 'react';
import { setAuthToken, registerAuthCallbacks, apiFetch } from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('ngo_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('ngo_access_token') || '';
  });

  // Keep api.js in sync with current token
  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  // Register callbacks so api.js can inform AuthContext about refreshes or logouts
  useEffect(() => {
    registerAuthCallbacks({
      onTokenRefreshed: (newToken) => {
        setToken(newToken);
      },
      onLogout: () => {
        logout();
      }
    });
  }, []);

  const login = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem('ngo_user', JSON.stringify(userData));
    localStorage.setItem('ngo_access_token', accessToken);
    setAuthToken(accessToken);
  };

  const logout = async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setToken('');
      localStorage.removeItem('ngo_user');
      localStorage.removeItem('ngo_access_token');
      setAuthToken('');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
