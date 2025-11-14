import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
// import { CartProvider } from './contexts/CartContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';

import CustomerLogin from './pages/Auth/CustomerLogin';
import CustomerRegister from './pages/Auth/CustomerRegister';
import SellerLogin from './pages/Auth/SellerLogin';
import SellerRegister from './pages/Auth/SellerRegister';


import HomePage from './pages/Home/HomePage';

function App() {
  return (
    <AuthProvider>
      {/* <CartProvider> */}
        <Router>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/customer/login" element={<CustomerLogin />} />
                <Route path="/customer/register" element={<CustomerRegister />} />
                <Route path="/seller/login" element={<SellerLogin />} />
                <Route path="/seller/register" element={<SellerRegister />} />

                {/* Customer Routes */}
                {/* <Route path="/customer/dashboard" element={<CustomerDashboard />} />
                <Route path="/customer/products" element={<ProductList />} />
                <Route path="/customer/products/:productId" element={<ProductDetails />} />
                <Route path="/customer/cart" element={<Cart />} />
                <Route path="/customer/orders/active" element={<ActiveOrders />} />
                <Route path="/customer/orders/completed" element={<CompletedOrders />} />
                <Route path="/customer/chat/:orderId" element={<Chat />} /> */}

                {/* Seller Routes */}
                {/* <Route path="/seller/dashboard" element={<SellerDashboard />} />
                <Route path="/seller/products" element={<ProductManagement />} />
                <Route path="/seller/products/add" element={<AddProduct />} />
                <Route path="/seller/products/edit/:productId" element={<AddProduct />} />
                <Route path="/seller/orders" element={<SellerOrders />} />
                <Route path="/seller/chat/:orderId" element={<SellerChat />} /> */}
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      {/* </CartProvider> */}
    </AuthProvider>
  );
}

export default App;