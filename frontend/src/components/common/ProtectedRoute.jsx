// src/components/common/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, requireVerification = true }) => {
  const { user, loading, isVerified } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to={userType === 'seller' ? '/seller/login' : '/customer/login'} replace />;
  }

  // Check if verification is required and user is not verified
  if (requireVerification && !isVerified) {
    return <Navigate to="/pending-verification" replace />;
  }

  return children;
};

export default ProtectedRoute;