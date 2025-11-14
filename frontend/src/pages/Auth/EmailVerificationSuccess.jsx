// src/pages/Auth/EmailVerificationSuccess.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../lib/api';
import { CheckCircle, XCircle, LogIn, Home } from 'lucide-react';

const EmailVerificationSuccess = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      setLoading(true);

      if (!token) {
        setSuccess(false);
        setMessage('Invalid verification link');
        return;
      }

      // Call the backend verification endpoint
      const response = await authAPI.customer.verifyEmail(token);

      setSuccess(true);
      setMessage(response.data.message || 'Email verified successfully!');

      // Update localStorage if user is logged in
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData) {
        userData.isVerified = true;
        localStorage.setItem('userData', JSON.stringify(userData));
      }
    } catch (error) {
      setSuccess(false);
      setMessage(
        error.response?.data?.message ||
        'Verification failed. The link may have expired or is invalid.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-900 to-primary-700 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Verifying your email...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 to-primary-700 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 ${success ? 'bg-green-100' : 'bg-red-100'
              }`}>
              {success ? (
                <CheckCircle className="text-green-600 w-8 h-8" />
              ) : (
                <XCircle className="text-red-600 w-8 h-8" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              {success ? 'Email Verified!' : 'Verification Failed'}
            </h1>
            <p className="text-gray-600 mt-2">{message}</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {success ? (
              <>
                <button
                  onClick={() => navigate('/customer/login')}
                  className="w-full btn-primary flex items-center justify-center space-x-2 py-3"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Sign In to Continue</span>
                </button>

                <Link
                  to="/"
                  className="w-full btn-secondary flex items-center justify-center space-x-2 py-3"
                >
                  <Home className="w-5 h-5" />
                  <span>Back to Home</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/customer/login"
                  className="w-full btn-primary flex items-center justify-center space-x-2 py-3"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Go to Login</span>
                </Link>

                <Link
                  to="/"
                  className="w-full btn-secondary flex items-center justify-center space-x-2 py-3"
                >
                  <Home className="w-5 h-5" />
                  <span>Back to Home</span>
                </Link>
              </>
            )}
          </div>

          {/* Additional Info */}
          {!success && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm text-center">
                If you're having trouble verifying your email, please try registering again or contact support.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationSuccess;