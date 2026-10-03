
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [playerProfile, setPlayerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadUser = async () => {
    const token = localStorage.getItem('sports_app_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/auth/me');
      if (res.success) {
        setUser(res.data.user);
        setPlayerProfile(res.data.profile);
      }
    } catch (err) {
      console.warn('Failed to load active session:', err.message);
      localStorage.removeItem('sports_app_token');
      setUser(null);
      setPlayerProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (loginId, password) => {
    const res = await api.post('/auth/login', { loginId, password });
    if (res.success) {
      localStorage.setItem('sports_app_token', res.data.token);
      setUser(res.data.user);
      setPlayerProfile(res.data.playerProfile);
      showToast(`Welcome back, ${res.data.user.full_name || 'Athlete'}!`, 'success');
      return res.data;
    }
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    if (res.success) {
      localStorage.setItem('sports_app_token', res.data.token);
      setUser(res.data.user);
      setPlayerProfile(res.data.playerProfile);
      showToast('Registration successful! Welcome to Sports Portal.', 'success');
      return res.data;
    }
  };

  const logout = () => {
    localStorage.removeItem('sports_app_token');
    setUser(null);
    setPlayerProfile(null);
    showToast('Logged out successfully', 'info');
  };

  // Demo Role Quick Switcher for seamless testing during evaluation
  const loginAsDemoRole = async (role) => {
    let email = 'vijay@university.edu';
    if (role === 'COACH') email = 'rahul.coach@university.edu';
    if (role === 'SPORTS_ADMIN') email = 'priya.admin@university.edu';
    if (role === 'ADMIN') email = 'admin@university.edu';

    try {
      await login(email, 'password123');
    } catch (err) {
      showToast(`Demo login failed: ${err.message}`, 'error');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        playerProfile,
        loading,
        login,
        register,
        logout,
        loginAsDemoRole,
        loadUser,
        toast,
        showToast
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
