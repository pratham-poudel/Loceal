// src/pages/Seller/SellerOrders.jsx - SIMPLIFIED VERSION
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sellerAPI } from '../../lib/api';
import { Package, MessageCircle, Filter, Key, CheckCircle } from 'lucide-react';

const SellerOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [generatingOTP, setGeneratingOTP] = useState(null);
  const [verifyingOTP, setVerifyingOTP] = useState(null);
  const [otpInputs, setOtpInputs] = useState({});
  const [otpValues, setOtpValues] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await sellerAPI.getOrders();
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateOTP = async (orderId) => {
    try {
      setGeneratingOTP(orderId);
      const response = await sellerAPI.generateOTP(orderId);
      await fetchOrders(); // Refresh orders
      alert('OTP sent to customer successfully! Ask them to share the OTP with you.');
    } catch (error) {
      console.error('Error generating OTP:', error);
      alert(error.response?.data?.message || 'Failed to generate OTP. Please try again.');
    } finally {
      setGeneratingOTP(null);
    }
  };

  const handleVerifyOTP = async (orderId) => {
    const otpRaw = otpValues[orderId] || '';
    const otp = String(otpRaw).trim();

    if (!otp || otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setVerifyingOTP(orderId);
      await sellerAPI.verifyOTP(orderId, { otp });
      alert('Order completed successfully! Payment received and order marked as complete.');
      setOtpInputs(prev => ({ ...prev, [orderId]: false }));
      setOtpValues(prev => ({ ...prev, [orderId]: '' }));
      await fetchOrders(); // Refresh orders
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert(error.response?.data?.message || 'Invalid OTP. Please check with the customer.');
    } finally {
      setVerifyingOTP(null);
    }
  };

  const toggleOTPInput = (orderId) => {
    setOtpInputs(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
    if (!otpInputs[orderId]) {
      setOtpValues(prev => ({
        ...prev,
        [orderId]: ''
      }));
    }
  };

  const handleOTPChange = (orderId, value) => {
    // Only allow numbers and limit to 6 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setOtpValues(prev => ({
      ...prev,
      [orderId]: numericValue
    }));
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.orderStatus === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canGenerateOTP = (orderStatus) => {
    return ["pending", "confirmed"].includes(orderStatus);
  };

  const hasOTPGenerated = (order) => {
    return order.otpVerification && order.otpVerification.code && !order.otpVerification.verified;
  };

  const isOTPExpired = (order) => {
    if (!order.otpVerification || !order.otpVerification.expiresAt) return false;
    return new Date(order.otpVerification.expiresAt) < new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
              <p className="text-gray-600">
                Manage customer orders and complete transactions with OTP
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input-field w-auto"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Order #{order.orderNumber}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                      {hasOTPGenerated(order) && (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          OTP Generated
                        </span>
                      )}
                      {hasOTPGenerated(order) && isOTPExpired(order) && (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                          OTP Expired
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600">
                      Customer: <span className="font-medium">{order.customer.name}</span> •
                      Phone: <span className="font-medium">{order.customer.phone}</span>
                    </p>
                    {order.customer.defaultAddress && (
                      <p className="text-gray-600 text-sm mt-1">
                        Location: {order.customer.defaultAddress.address.street}, {order.customer.defaultAddress.address.city}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                    <span className="text-2xl font-bold text-primary-600">
                      ₹{order.totalAmount}
                    </span>
                    <button
                      onClick={() => navigate(`/seller/chat/${order._id}`)}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat</span>
                    </button>
                  </div>
                </div>

                {/* Order Details */}
                <div className="border-t pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Product Info */}
                    <div className="flex space-x-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                        {order.productSnapshot?.images?.[0] ? (
                          <img
                            src={order.productSnapshot.images[0]}
                            alt={order.productSnapshot.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Package className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{order.productSnapshot.title}</h4>
                        <p className="text-gray-600 text-sm mt-1">
                          {order.quantity} × ₹{order.pricePerUnit} per unit
                        </p>
                        <p className="text-primary-600 font-semibold">
                          Total: ₹{order.totalAmount}
                        </p>
                      </div>
                    </div>

                    {/* Order Timeline */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Order placed</span>
                        <span className="font-medium">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {order.otpVerification?.generatedAt && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">OTP generated</span>
                          <span className="font-medium">
                            {new Date(order.otpVerification.generatedAt).toLocaleString()}
                          </span>
                        </div>
                      )}

                      {order.otpVerification?.expiresAt && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">OTP expires</span>
                          <span className="font-medium">
                            {new Date(order.otpVerification.expiresAt).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                      {/* Generate OTP Button - Show only for pending orders without active OTP */}
                      {order.orderStatus === "pending" && (!order.otpVerification || !order.otpVerification.code || order.otpVerification.verified) && (
                        <button
                          onClick={() => handleGenerateOTP(order._id)}
                          disabled={generatingOTP === order._id}
                          className="w-full btn-primary flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
                        >
                          {generatingOTP === order._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <Key className="w-4 h-4" />
                          )}
                          <span>
                            {generatingOTP === order._id ? 'Generating OTP...' : 'Generate OTP'}
                          </span>
                        </button>
                      )}

                      {/* OTP Input Section - Show when OTP is generated and not verified */}
                      {order.otpVerification && order.otpVerification.code && !order.otpVerification.verified && order.orderStatus === "pending" && (
                        <div className="space-y-3">
                          {!otpInputs[order._id] ? (
                            <button
                              onClick={() => toggleOTPInput(order._id)}
                              className="w-full btn-secondary flex items-center justify-center space-x-2 text-sm"
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span>Enter OTP to Complete</span>
                            </button>
                          ) : (
                            <div className="space-y-2">
                              <div className="flex space-x-2">
                                <input
                                  type="text"
                                  value={otpValues[order._id] || ''}
                                  onChange={(e) => handleOTPChange(order._id, e.target.value)}
                                  placeholder="Enter 6-digit OTP"
                                  className="input-field flex-1 text-center text-lg font-mono tracking-widest"
                                  maxLength={6}
                                />
                                <button
                                  onClick={() => handleVerifyOTP(order._id)}
                                  disabled={verifyingOTP === order._id || !otpValues[order._id] || otpValues[order._id].length !== 6}
                                  className="btn-primary px-4 disabled:opacity-50"
                                >
                                  {verifyingOTP === order._id ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                  ) : (
                                    'Verify'
                                  )}
                                </button>
                              </div>
                              <button
                                onClick={() => toggleOTPInput(order._id)}
                                className="w-full text-sm text-gray-600 hover:text-gray-800"
                              >
                                Cancel
                              </button>
                            </div>
                          )}

                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-blue-800 text-sm font-medium">OTP Instructions</p>
                            <p className="text-blue-700 text-xs mt-1">
                              Ask the customer to share the OTP they received via email.
                              Enter it above to complete the order.
                            </p>
                            {order.otpVerification?.attempts > 0 && !isOTPExpired(order) && (
                              <p className="text-yellow-800 text-xs mt-1 font-medium">
                                Attempts remaining: {Math.max(0, 3 - order.otpVerification.attempts)}
                              </p>
                            )}
                            {isOTPExpired(order) && (
                              <p className="text-red-700 text-xs mt-1 font-medium">
                                ⚠️ OTP has expired. Please generate a new OTP.
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* ✅ FIX: Regenerate OTP Button - Only show when OTP is expired */}
                      {order.otpVerification && order.otpVerification.code && isOTPExpired(order) && !order.otpVerification.verified && order.orderStatus === "pending" && (
                        <button
                          onClick={() => handleGenerateOTP(order._id)}
                          disabled={generatingOTP === order._id}
                          className="w-full btn-primary flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
                        >
                          {generatingOTP === order._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <Key className="w-4 h-4" />
                          )}
                          <span>
                            {generatingOTP === order._id ? 'Regenerating OTP...' : 'Regenerate OTP'}
                          </span>
                        </button>
                      )}

                      {/* Completed Order */}
                      {order.orderStatus === 'completed' && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-green-800 text-sm font-medium">Order Completed</p>
                          <p className="text-green-700 text-xs mt-1">
                            Payment received and order marked as complete on {new Date(order.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {orders.length === 0 ? 'No orders yet' : 'No orders match your filter'}
            </h2>
            <p className="text-gray-600 mb-6">
              {orders.length === 0
                ? "Customer orders will appear here when they place orders from your products."
                : "Try selecting a different filter to see more orders."
              }
            </p>
            {orders.length === 0 && (
              <button
                onClick={() => navigate('/seller/products')}
                className="btn-primary"
              >
                Manage Products
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerOrders;