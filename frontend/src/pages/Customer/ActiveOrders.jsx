// src/pages/Customer/ActiveOrders.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../../lib/api';
import OrderCard from '../../components/customer/OrderCard';
import { Package } from 'lucide-react';

const ActiveOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchActiveOrders();
  }, []);

  const fetchActiveOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getActiveOrders();
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching active orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChat = (orderId) => {
    navigate(`/customer/chat/${orderId}`);
  };

  const handleCancelOrder = async (orderId) => {
    try {
      setCancellingOrder(orderId);
      await orderAPI.cancelOrder(orderId);
      await fetchActiveOrders(); // Refresh the list
      alert('Order cancelled successfully');
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert(error.response?.data?.message || 'Failed to cancel order. Please try again.');
    } finally {
      setCancellingOrder(null);
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
              <OrderCard
                key={order._id}
                order={order}
                onCancel={handleCancelOrder}
                onChat={handleChat}
                showActions={true}
                // isCancelling={cancellingOrder === order._id} - might add later
              />
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