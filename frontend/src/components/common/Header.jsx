// src/components/common/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ShoppingCart, User, Store, LogOut, Home } from 'lucide-react';

const Header = () => {
  const { user, logout, userType } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-primary-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary-500 w-10 h-10 rounded-lg flex items-center justify-center">
              <Store className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold">Loceal</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <Link to="/" className="hover:text-primary-200 transition-colors flex items-center space-x-1">
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>

            {!user ? (
              <>
                <Link to="/customer/login" className="hover:text-primary-200 transition-colors flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>Customer</span>
                </Link>
                <Link to="/seller/login" className="hover:text-primary-200 transition-colors flex items-center space-x-1">
                  <Store className="w-4 h-4" />
                  <span>Seller</span>
                </Link>
              </>
            ) : (
              <>
                {userType === 'customer' && (
                  <>
                    <Link to="/customer/dashboard" className="hover:text-primary-200 transition-colors">
                      Dashboard
                    </Link>
                    <Link to="/customer/products" className="hover:text-primary-200 transition-colors">
                      Products
                    </Link>
                    <Link to="/customer/cart" className="hover:text-primary-200 transition-colors flex items-center space-x-1">
                      <ShoppingCart className="w-4 h-4" />
                      <span>Cart</span>
                    </Link>
                    <Link to="/customer/orders/active" className="hover:text-primary-200 transition-colors">
                      Orders
                    </Link>
                  </>
                )}
                {userType === 'seller' && (
                  <>
                    <Link to="/seller/dashboard" className="hover:text-primary-200 transition-colors">
                      Dashboard
                    </Link>
                    <Link to="/seller/products" className="hover:text-primary-200 transition-colors">
                      My Products
                    </Link>
                    <Link to="/seller/orders" className="hover:text-primary-200 transition-colors">
                      Orders
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="hover:text-primary-200 transition-colors flex items-center space-x-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;