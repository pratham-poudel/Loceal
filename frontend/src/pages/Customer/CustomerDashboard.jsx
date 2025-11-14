// src/pages/Customer/CustomerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLocation } from '../../hooks/useLocation';
import { productAPI, orderAPI } from '../../lib/api';
import { ShoppingBag, Package, MessageCircle, MapPin, Search } from 'lucide-react';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const { location, getCurrentLocation } = useLocation();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    activeOrders: 0,
    cartItems: 0,
    nearbyProducts: 0
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [location]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch products based on current location
      const params = {};
      if (location) {
        params.lat = location.latitude;
        params.lng = location.longitude;
        params.maxDistance = 10;
      }

      const [productsResponse, activeOrdersResponse] = await Promise.all([
        productAPI.getProducts(params),
        orderAPI.getActiveOrders()
      ]);

      setStats({
        activeOrders: activeOrdersResponse.data.orders.length,
        cartItems: 0, // You might want to fetch cart count
        nearbyProducts: productsResponse.data.products.length
      });

      setRecentProducts(productsResponse.data.products.slice(0, 4));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    getCurrentLocation();
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
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600 mb-4">
                Discover local products and connect with sellers in your area
              </p>
              
              {/* Location Info */}
              <div className="flex items-center space-x-4">
                {location ? (
                  <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">Using current location</span>
                  </div>
                ) : (
                  <button
                    onClick={handleUseCurrentLocation}
                    className="flex items-center text-primary-600 hover:text-primary-700"
                  >
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">Use current location for better results</span>
                  </button>
                )}
              </div>
            </div>
            
            <Link
              to="/customer/products"
              className="btn-primary flex items-center space-x-2 mt-4 md:mt-0"
            >
              <Search className="w-5 h-5" />
              <span>Browse Products</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Orders</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.activeOrders}</p>
              </div>
              <div className="bg-primary-100 p-3 rounded-xl">
                <Package className="text-primary-600 w-6 h-6" />
              </div>
            </div>
            <Link 
              to="/customer/orders/active" 
              className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-4 inline-block"
            >
              View orders →
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Cart Items</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.cartItems}</p>
              </div>
              <div className="bg-primary-100 p-3 rounded-xl">
                <ShoppingBag className="text-primary-600 w-6 h-6" />
              </div>
            </div>
            <Link 
              to="/customer/cart" 
              className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-4 inline-block"
            >
              View cart →
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Nearby Products</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.nearbyProducts}</p>
              </div>
              <div className="bg-primary-100 p-3 rounded-xl">
                <MessageCircle className="text-primary-600 w-6 h-6" />
              </div>
            </div>
            <Link 
              to="/customer/products" 
              className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-4 inline-block"
            >
              Browse all →
            </Link>
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Products Near You</h2>
            <Link 
              to="/customer/products" 
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View all
            </Link>
          </div>

          {recentProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentProducts.map((product) => (
                <div key={product._id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-48 bg-gray-100">
                    {product.images?.[0]?.url ? (
                      <img 
                        src={product.images[0].url} 
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Package className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 truncate">{product.title}</h3>
                    <p className="text-primary-600 font-bold text-lg mb-2">₹{product.price}</p>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>{product.distance} km away</span>
                      <span>{product.unit}</span>
                    </div>
                    <button
                      onClick={() => navigate(`/customer/products/${product._id}`)}
                      className="w-full mt-3 bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No products found in your area</p>
              <button
                onClick={handleUseCurrentLocation}
                className="btn-primary"
              >
                Use Current Location
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Link
            to="/customer/products"
            className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow border-2 border-transparent hover:border-primary-200"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-primary-100 p-3 rounded-xl">
                <Search className="text-primary-600 w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Browse All Products</h3>
                <p className="text-gray-600 text-sm mt-1">Discover more local products with advanced filters</p>
              </div>
            </div>
          </Link>

          <Link
            to="/customer/orders/active"
            className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow border-2 border-transparent hover:border-primary-200"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-primary-100 p-3 rounded-xl">
                <MessageCircle className="text-primary-600 w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Active Orders</h3>
                <p className="text-gray-600 text-sm mt-1">Chat with sellers and coordinate meetings</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;