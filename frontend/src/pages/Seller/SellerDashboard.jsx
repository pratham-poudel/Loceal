// src/pages/Seller/SellerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { sellerAPI, orderAPI } from '../../lib/api';
import { Package, Users, DollarSign, TrendingUp, Plus } from 'lucide-react';

const SellerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeOrders: 0,
    totalRevenue: 0,
    totalSales: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [productsResponse, ordersResponse] = await Promise.all([
        sellerAPI.getProducts(),
        sellerAPI.getOrders()
      ]);

      const products = productsResponse.data.products || [];
      const orders = ordersResponse.data.orders || [];

      // Calculate stats
      const activeOrders = orders.filter(order => 
        ['pending', 'confirmed', 'meeting_scheduled', 'ready_for_pickup'].includes(order.orderStatus)
      ).length;

      const totalRevenue = orders
        .filter(order => order.orderStatus === 'completed')
        .reduce((sum, order) => sum + order.totalAmount, 0);

      setStats({
        totalProducts: products.length,
        activeOrders,
        totalRevenue,
        totalSales: user.totalSales || 0
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.businessName}!
              </h1>
              <p className="text-gray-600">
                Manage your products and connect with local customers
              </p>
            </div>
            
            <Link
              to="/seller/products/add"
              className="btn-primary flex items-center space-x-2 mt-4 md:mt-0"
            >
              <Plus className="w-5 h-5" />
              <span>Add Product</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Products</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalProducts}</p>
              </div>
              <div className="bg-primary-100 p-3 rounded-xl">
                <Package className="text-primary-600 w-6 h-6" />
              </div>
            </div>
            <Link 
              to="/seller/products" 
              className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-4 inline-block"
            >
              Manage products →
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Orders</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.activeOrders}</p>
              </div>
              <div className="bg-primary-100 p-3 rounded-xl">
                <Users className="text-primary-600 w-6 h-6" />
              </div>
            </div>
            <Link 
              to="/seller/orders" 
              className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-4 inline-block"
            >
              View orders →
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">₹{stats.totalRevenue}</p>
              </div>
              <div className="bg-primary-100 p-3 rounded-xl">
                <DollarSign className="text-primary-600 w-6 h-6" />
              </div>
            </div>
            <div className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-4 inline-block">
              Lifetime earnings
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Sales</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalSales}</p>
              </div>
              <div className="bg-primary-100 p-3 rounded-xl">
                <TrendingUp className="text-primary-600 w-6 h-6" />
              </div>
            </div>
            <div className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-4 inline-block">
              Orders completed
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
              <Link 
                to="/seller/orders" 
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View all
              </Link>
            </div>

            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Order #{order.orderNumber}</p>
                      <p className="text-sm text-gray-600">
                        {order.customer.name} • {order.quantity} × {order.product.title}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary-600">₹{order.totalAmount}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.orderStatus === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No orders yet</p>
                <p className="text-sm text-gray-500 mt-1">Your orders will appear here</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Link
              to="/seller/products/add"
              className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow block border-2 border-transparent hover:border-primary-200"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-primary-100 p-3 rounded-xl">
                  <Plus className="text-primary-600 w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Add New Product</h3>
                  <p className="text-gray-600 text-sm mt-1">List a new product for local customers</p>
                </div>
              </div>
            </Link>

            <Link
              to="/seller/products"
              className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow block border-2 border-transparent hover:border-primary-200"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-primary-100 p-3 rounded-xl">
                  <Package className="text-primary-600 w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Manage Products</h3>
                  <p className="text-gray-600 text-sm mt-1">View and edit your product listings</p>
                </div>
              </div>
            </Link>

            <Link
              to="/seller/orders"
              className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow block border-2 border-transparent hover:border-primary-200"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-primary-100 p-3 rounded-xl">
                  <Users className="text-primary-600 w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Order Management</h3>
                  <p className="text-gray-600 text-sm mt-1">Process and manage customer orders</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;