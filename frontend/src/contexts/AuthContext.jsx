// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../lib/api';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(true); // Default to true for existing users

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // You might want to verify token with backend
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData) {
          setUser(userData);
          setUserType(userData.userType);
          setIsVerified(userData.isVerified !== false); // Check verification status
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData, token, type) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userData', JSON.stringify({ 
      ...userData, 
      userType: type,
      isVerified: userData.isVerified 
    }));
    setUser(userData);
    setUserType(type);
    setIsVerified(userData.isVerified !== false);
  };

  const updateVerificationStatus = (status) => {
    setIsVerified(status);
    // Update in localStorage as well
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      userData.isVerified = status;
      localStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setUser(null);
    setUserType(null);
    setIsVerified(true);
  };

  const value = {
    user,
    userType,
    isVerified,
    login,
    logout,
    loading,
    updateVerificationStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};