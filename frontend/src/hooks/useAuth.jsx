import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('resume_ats_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await authService.getMe();
        setUser(data.user);
      } catch (err) {
        localStorage.removeItem('resume_ats_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const signIn = async (credentials) => {
    const { data } = await authService.login(credentials);
    if (data.token) {
      localStorage.setItem('resume_ats_token', data.token);
      try {
        const { data: me } = await authService.getMe();
        setUser(me.user);
      } catch {
        setUser(data.user);
      }
    }
    return data;
  };

  const signUp = async (userData) => {
    const { data } = await authService.register(userData);
    if (data.token) {
      localStorage.setItem('resume_ats_token', data.token);
      try {
        const { data: me } = await authService.getMe();
        setUser(me.user);
      } catch {
        setUser(data.user);
      }
    }
    return data;
  };

  const signOut = () => {
    localStorage.removeItem('resume_ats_token');
    setUser(null);
  };

  const refreshUser = async () => {
    const token = localStorage.getItem('resume_ats_token');
    if (!token) return;
    try {
      const { data } = await authService.getMe();
      setUser(data.user);
    } catch {
      setUser(null);
    }
  };

  const value = {
    signIn,
    signUp,
    signOut,
    refreshUser,
    user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
