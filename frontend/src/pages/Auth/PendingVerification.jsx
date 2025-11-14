// src/pages/Auth/PendingVerification.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Mail, RefreshCw, Home, LogOut } from 'lucide-react';

const PendingVerification = () => {
  const { user, userType, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(userType === 'customer' ? '/customer/login' : '/seller/login');
  };

  const handleResendEmail = () => {
    // In a real app, you'd call an API to resend verification
    alert('Verification email sent! Please check your inbox.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 to-primary-700 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-primary-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Mail className="text-primary-600 w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Verify Your Email</h1>
            <p className="text-gray-600 mt-2">
              Please verify your email address to access your {userType === 'customer' ? 'shopping' : 'seller'} dashboard
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-blue-800 text-sm font-medium">Check your inbox</p>
                <p className="text-blue-700 text-xs mt-1">
                  We've sent a verification link to <strong>{user?.email}</strong>. 
                  Click the link in the email to verify your account.
                </p>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-100 text-primary-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                1
              </div>
              <span className="text-sm text-gray-700">Check your email inbox (and spam folder)</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-primary-100 text-primary-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                2
              </div>
              <span className="text-sm text-gray-700">Click the verification link in the email</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-primary-100 text-primary-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                3
              </div>
              <span className="text-sm text-gray-700">Return here and refresh the page</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full btn-primary flex items-center justify-center space-x-2 py-3"
            >
              <RefreshCw className="w-5 h-5" />
              <span>I've Verified My Email - Refresh</span>
            </button>

            <button
              onClick={handleResendEmail}
              className="w-full btn-secondary flex items-center justify-center space-x-2 py-3"
            >
              <Mail className="w-5 h-5" />
              <span>Resend Verification Email</span>
            </button>

            <div className="flex space-x-3 pt-4 border-t">
              <button
                onClick={() => navigate('/')}
                className="flex-1 btn-secondary flex items-center justify-center space-x-2 py-2"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                <LogOut className="w-4 h-4 inline mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingVerification;