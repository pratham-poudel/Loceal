// src/pages/Seller/SellerOrders.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sellerAPI } from '../../lib/api';
import { Package, MessageCircle, Filter, DollarSign } from 'lucide-react';

const SellerOrders = () => {
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [processingOrder, setProcessingOrder] = useState(null);

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

  const handleInitiatePayment = async (orderId) => {
    try {
      setProcessingOrder(orderId);
      await sellerAPI.initiatePayment(orderId);
      await fetchOrders(); // Refresh orders
      alert('OTP sent to customer successfully!');
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setProcessingOrder(null);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await sellerAPI.updateOrderStatus(orderId, { status: newStatus });
      await fetchOrders(); // Refresh orders
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status.');
    }
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
      case 'meeting_scheduled':
        return 'bg-purple-100 text-purple-800';
      case 'ready_for_pickup':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusActions = (status) => {
    switch (status) {
      case 'pending':
        return ['confirmed'];
      case 'confirmed':
        return ['meeting_scheduled', 'ready_for_pickup'];
      case 'meeting_scheduled':
        return ['ready_for_pickup'];
      case 'ready_for_pickup':
        return []; // OTP flow handles completion
      default:
        return [];
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
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
              <p className="text-gray-600">
                Manage customer orders and coordinate meetings
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
                {/* <option value="confirmed">Confirmed</option>
                <option value="meeting_scheduled">Meeting Scheduled</option>
                <option value="ready_for_pickup">Ready for Pickup</option> */}
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
                        {order.orderStatus.replace('_', ' ')}
                      </span>
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
                      
                      {order.meetingDetails?.scheduledTime && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Scheduled meeting</span>
                          <span className="font-medium">
                            {new Date(order.meetingDetails.scheduledTime).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                      {/* Status Update */}
                      {getStatusActions(order.orderStatus).length > 0 && (
                        <select
                          onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                          className="input-field w-full text-sm"
                        >
                          <option value="">Update Status</option>
                          {getStatusActions(order.orderStatus).map(action => (
                            <option key={action} value={action}>
                              Mark as {action.replace('_', ' ')}
                            </option>
                          ))}
                        </select>
                      )}

                      {/* Initiate Payment */}
                      {order.orderStatus === 'meeting_scheduled' && (
                        <button
                          onClick={() => handleInitiatePayment(order._id)}
                          disabled={processingOrder === order._id}
                          className="w-full btn-primary flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
                        >
                          {processingOrder === order._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <DollarSign className="w-4 h-4" />
                          )}
                          <span>
                            {processingOrder === order._id ? 'Sending OTP...' : 'Initiate Payment'}
                          </span>
                        </button>
                      )}

                      {/* OTP Instructions */}
                      {order.orderStatus === 'ready_for_pickup' && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-green-800 text-sm font-medium">OTP Sent</p>
                          <p className="text-green-700 text-xs mt-1">
                            OTP has been sent to customer. Ask them to share it with you during the meeting.
                          </p>
                        </div>
                      )}

                      {/* Completed Order */}
                      {order.orderStatus === 'completed' && (
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <p className="text-gray-800 text-sm font-medium">Order Completed</p>
                          <p className="text-gray-700 text-xs mt-1">
                            Payment received and order marked as complete.
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