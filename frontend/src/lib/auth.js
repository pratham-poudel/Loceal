// src/lib/auth.js
import { authAPI } from './api';

// Token management
export const tokenManager = {
  getToken: () => {
    return localStorage.getItem('token');
  },
  
  setToken: (token) => {
    localStorage.setItem('token', token);
  },
  
  removeToken: () => {
    localStorage.removeItem('token');
  },
  
  isValid: (token) => {
    if (!token) return false;
    
    try {
      // Simple check for JWT structure
      const parts = token.split('.');
      return parts.length === 3;
    } catch {
      return false;
    }
  }
};

// User data management
export const userManager = {
  getUser: () => {
    try {
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  },
  
  setUser: (userData) => {
    localStorage.setItem('userData', JSON.stringify(userData));
  },
  
  removeUser: () => {
    localStorage.removeItem('userData');
  },
  
  updateUser: (updates) => {
    const currentUser = userManager.getUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      userManager.setUser(updatedUser);
      return updatedUser;
    }
    return null;
  }
};

// Authentication checks
export const authUtils = {
  isAuthenticated: () => {
    return !!tokenManager.getToken() && !!userManager.getUser();
  },
  
  isVerified: () => {
    const user = userManager.getUser();
    return user ? user.isVerified !== false : false;
  },
  
  getUserType: () => {
    const user = userManager.getUser();
    return user ? user.userType : null;
  },
  
  requiresVerification: (userType) => {
    const user = userManager.getUser();
    return user && user.userType === userType && !user.isVerified;
  }
};

// Route protection helpers
export const routeGuard = {
  canAccessCustomer: () => {
    const userType = authUtils.getUserType();
    const isVerified = authUtils.isVerified();
    return authUtils.isAuthenticated() && userType === 'customer' && isVerified;
  },
  
  canAccessSeller: () => {
    const userType = authUtils.getUserType();
    const isVerified = authUtils.isVerified();
    return authUtils.isAuthenticated() && userType === 'seller' && isVerified;
  },
  
  shouldRedirectToVerification: () => {
    return authUtils.isAuthenticated() && !authUtils.isVerified();
  },
  
  getLoginRedirect: () => {
    const userType = authUtils.getUserType();
    return userType === 'seller' ? '/seller/login' : '/customer/login';
  }
};

// Login/Logout helpers
export const authHelpers = {
  handleLogin: async (userData, token, userType) => {
    tokenManager.setToken(token);
    
    const userWithType = {
      ...userData,
      userType: userType,
      isVerified: userData.isVerified !== false
    };
    
    userManager.setUser(userWithType);
    
    return userWithType;
  },
  
  handleLogout: () => {
    tokenManager.removeToken();
    userManager.removeUser();
  },
  
  handleVerificationUpdate: (verified) => {
    return userManager.updateUser({ isVerified: verified });
  }
};

// Export everything
export default {
  tokenManager,
  userManager,
  authUtils,
  routeGuard,
  authHelpers
};