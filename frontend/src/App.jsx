import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';

import CustomerLogin from './pages/Auth/CustomerLogin';
import CustomerRegister from './pages/Auth/CustomerRegister';
import SellerLogin from './pages/Auth/SellerLogin';
import SellerRegister from './pages/Auth/SellerRegister';


import CustomerDashboard from './pages/Customer/CustomerDashboard';
import ProductList from './pages/Customer/ProductList';
import ProductDetails from './pages/Customer/ProductDetails';
import Cart from './pages/Customer/Cart';
import ActiveOrders from './pages/Customer/ActiveOrders';
import CompletedOrders from './pages/Customer/CompletedOrders';
import Chat from './pages/Customer/Chat';


import SellerDashboard from './pages/Seller/SellerDashboard';
import ProductManagement from './pages/Seller/ProductManagement';
import SellerOrders from './pages/Seller/SellerOrders';
import SellerChat from './pages/Seller/SellerChat';
import AddProduct from './pages/Seller/AddProduct';

import EmailVerificationSuccess from './pages/Auth/EmailVerificationSuccess';
import SellerEmailVerificationSuccess from './pages/Auth/SellerEmailVerificationSuccess';
import PendingVerification from './pages/Auth/PendingVerification';
import ProtectedRoute from './components/common/ProtectedRoute';


import HomePage from './pages/Home/HomePage';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/customer/verifyCustomer/:token" element={<EmailVerificationSuccess />} />
                <Route path="/seller/verifySeller/:token" element={<SellerEmailVerificationSuccess />} />
                <Route path="/pending-verification" element={<PendingVerification />} />
                
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/customer/login" element={<CustomerLogin />} />
                <Route path="/customer/register" element={<CustomerRegister />} />
                <Route path="/seller/login" element={<SellerLogin />} />
                <Route path="/seller/register" element={<SellerRegister />} />

                {/* Customer Routes */}
                <Route path="/customer/dashboard" element={
                  <ProtectedRoute>
                    <CustomerDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/customer/products" element={
                  <ProtectedRoute>
                    <ProductList />
                  </ProtectedRoute>
                } />
                <Route path="/customer/products/:productId" element={
                  <ProtectedRoute>
                    <ProductDetails />
                  </ProtectedRoute>
                } />
                <Route path="/customer/cart" element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                } />
                <Route path="/customer/orders/active" element={
                  <ProtectedRoute>
                    <ActiveOrders />
                  </ProtectedRoute>
                } />
                <Route path="/customer/orders/completed" element={
                  <ProtectedRoute>
                    <CompletedOrders />
                  </ProtectedRoute>
                } />
                <Route path="/customer/chat/:orderId" element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                } />

                {/* Seller Routes */}
                <Route path="/seller/dashboard" element={<SellerDashboard />} />
                <Route path="/seller/products" element={<ProductManagement />} />
                <Route path="/seller/products/add" element={<AddProduct />} />
                <Route path="/seller/products/edit/:productId" element={<AddProduct />} />
                <Route path="/seller/orders" element={<SellerOrders />} />
                <Route path="/seller/chat/:orderId" element={<SellerChat />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;