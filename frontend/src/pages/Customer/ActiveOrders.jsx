// src/pages/Customer/ActiveOrders.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../../lib/api';
import OrderCard from '../../components/customer/OrderCard';
import { Package, MessageCircle, Clock } from 'lucide-react';

const ActiveOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchActiveOrders();
  }, []);

  const fetchActiveOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getActiveOrders();
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching active orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChat = (orderId) => {
    navigate(`/customer/chat/${orderId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'meeting_scheduled':
        return 'bg-purple-100 text-purple-800';
      case 'ready_for_pickup':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Waiting for seller confirmation';
      case 'confirmed':
        return 'Order confirmed by seller';
      case 'meeting_scheduled':
        return 'Meeting scheduled';
      case 'ready_for_pickup':
        return 'Ready for pickup - OTP sent';
      default:
        return status;
    }
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Active Orders</h1>
              <p className="text-gray-600">
                Manage your ongoing orders and coordinate with sellers
              </p>
            </div>
            <div className="flex items-center space-x-2 text-primary-600">
              <Package className="w-5 h-5" />
              <span className="font-semibold">{orders.length} active orders</span>
            </div>
          </div>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-sm p-6">
                {/* Order Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Order #{order.orderNumber}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                        {getStatusText(order.orderStatus)}
                      </span>
                    </div>
                    <p className="text-gray-600">
                      Seller: <span className="font-medium">{order.seller.businessName}</span>
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                    <span className="text-2xl font-bold text-primary-600">
                      ₹{order.totalAmount}
                    </span>
                    <button
                      onClick={() => handleChat(order._id)}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat</span>
                    </button>
                  </div>
                </div>

                {/* Order Details */}
                <div className="border-t pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      
                      {order.meetingDetails?.scheduledTime && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Scheduled meeting</span>
                          <span className="font-medium">
                            {new Date(order.meetingDetails.scheduledTime).toLocaleString()}
                          </span>
                        </div>
                      )}

                      {order.orderStatus === 'ready_for_pickup' && (
                        <div className="flex items-center space-x-2 text-green-600">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-medium">OTP sent to your email</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Required */}
                  {order.orderStatus === 'ready_for_pickup' && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-800 font-medium">Action Required</p>
                          <p className="text-blue-700 text-sm mt-1">
                            Check your email for OTP. Share it with the seller when you meet.
                          </p>
                        </div>
                        <button
                          onClick={() => navigate(`/customer/chat/${order._id}`)}
                          className="btn-primary text-sm"
                        >
                          View Chat
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No active orders</h2>
            <p className="text-gray-600 mb-6">
              You don't have any active orders. Start shopping to create your first order!
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

export default ActiveOrders;