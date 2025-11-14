// src/pages/Customer/CompletedOrders.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../../lib/api';
import { Package, Star, MessageCircle, CheckCircle } from 'lucide-react';

const CompletedOrders = () => {
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompletedOrders();
  }, []);

  const fetchCompletedOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getCompletedOrders();
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching completed orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRateSeller = (orderId) => {
    // Navigate to rating page or open rating modal
    alert('Rating feature will be implemented soon!');
  };

  const handleChat = (orderId) => {
    navigate(`/customer/chat/${orderId}`);
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Completed Orders</h1>
              <p className="text-gray-600">
                Review your past orders and rate your experience
              </p>
            </div>
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">{orders.length} completed orders</span>
            </div>
          </div>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Order #{order.orderNumber}
                      </h3>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Completed
                      </span>
                    </div>
                    <p className="text-gray-600">
                      Seller: <span className="font-medium">{order.seller.businessName}</span> • 
                      Completed on: <span className="font-medium">
                        {new Date(order.updatedAt).toLocaleDateString()}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                    <span className="text-2xl font-bold text-primary-600">
                      ₹{order.totalAmount}
                    </span>
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

                    {/* Meeting Details */}
                    <div className="space-y-2">
                      {order.meetingDetails?.scheduledTime && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Meeting date</span>
                          <span className="font-medium">
                            {new Date(order.meetingDetails.scheduledTime).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Payment method</span>
                        <span className="font-medium capitalize">
                          {order.paymentMethod || 'Cash on Delivery'}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                      <button
                        onClick={() => handleRateSeller(order._id)}
                        className="w-full btn-primary flex items-center justify-center space-x-2 text-sm"
                      >
                        <Star className="w-4 h-4" />
                        <span>Rate Seller</span>
                      </button>
                      
                      <button
                        onClick={() => handleChat(order._id)}
                        className="w-full btn-secondary flex items-center justify-center space-x-2 text-sm"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>View Chat</span>
                      </button>

                      {/* Report Issue */}
                      <button
                        onClick={() => alert('Report feature coming soon!')}
                        className="w-full border border-red-300 text-red-600 hover:bg-red-50 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                      >
                        Report Issue
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No completed orders</h2>
            <p className="text-gray-600 mb-6">
              You haven't completed any orders yet. Complete your first order to see it here!
            </p>
            <button
              onClick={() => navigate('/customer/products')}
              className="btn-primary"
            >
              Browse Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedOrders;