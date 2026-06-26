import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import api from '../utils/api';

// Global auth context — stores user session, persists token in localStorage, and
// provides login/logout helpers to every component in the tree.
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Attaches or removes the JWT Bearer header on both axios instances.
  const setAuthHeader = (t) => {
    if (t) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${t}`;
      api.defaults.headers.common['Authorization'] = `Bearer ${t}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
      delete api.defaults.headers.common['Authorization'];
    }
  };

  // On mount or token change, verify the session by calling GET /api/auth/me.
  useEffect(() => {
    if (token) {
      setAuthHeader(token);
      api.get('/api/auth/me')
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
          setAuthHeader(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  // Saves token + user data after a successful login or registration.
  const login = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    setAuthHeader(newToken);
    setToken(newToken);
    setUser(userData);
  };

  // Clears everything on logout.
  const logout = () => {
    localStorage.removeItem('token');
    setAuthHeader(null);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Convenience hook so any component can access auth state without importing Context.
export const useAuth = () => useContext(AuthContext);