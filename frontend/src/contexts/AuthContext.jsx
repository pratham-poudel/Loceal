// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('userData');

      if (token && userData) {
        const parsedUserData = JSON.parse(userData);
        setUser(parsedUserData);
        setUserType(parsedUserData.userType);
        setIsVerified(parsedUserData.isVerified !== false);

        // Optional: Verify token with backend
        // You can add an API call here to validate the token
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const checkVerificationStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      // Try to call a protected endpoint to check if user is verified
      // You'll need to create a /customer/profile endpoint in your backend
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData?.userType === 'customer') {
        // For now, we'll rely on localStorage since we don't have a profile endpoint
        // In production, you should call an API endpoint
        return userData.isVerified !== false;
      }

      return true; // Default to true if we can't check
    } catch (error) {
      console.error('Error checking verification status:', error);
      return false;
    }
  };

  const login = async (userData, token, type) => {
    const userWithVerification = {
      ...userData,
      userType: type,
      isVerified: userData.isVerified !== false
    };

    localStorage.setItem('token', token);
    localStorage.setItem('userData', JSON.stringify(userWithVerification));

    setUser(userWithVerification);
    setUserType(type);
    setIsVerified(userWithVerification.isVerified);
  };

  const updateVerificationStatus = (status) => {
    setIsVerified(status);

    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const updatedUserData = { ...userData, isVerified: status };
      localStorage.setItem('userData', JSON.stringify(updatedUserData));
      setUser(updatedUserData);
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
    // State
    user,
    userType,
    isVerified,
    loading,
    checkVerificationStatus,

    // Methods
    login,
    logout,
    updateVerificationStatus,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;