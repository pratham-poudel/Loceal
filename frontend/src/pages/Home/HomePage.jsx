// src/pages/Home/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Users, Shield, Truck } from 'lucide-react';

import BuyImage from '../../public/images/buy.png';
import ChatImage from '../../public/images/chat.jpg';
import MeetImage from '../../public/images/meet.png';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 to-primary-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Welcome to <span className="text-primary-50">Loceal</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
            Your Local Marketplace - Connect with sellers in your area, meet in person, and support local businesses
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/customer/login" 
              className="bg-white text-primary-700 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-200"
            >
              Shop as Customer
            </Link>
            <Link 
              to="/seller/login" 
              className="border-2 border-white text-white hover:bg-white hover:text-primary-700 font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-200"
            >
              Sell as Seller
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary-900 mb-12">
            Why Choose Loceal?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="text-primary-700 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-primary-900 mb-2">Local Sellers</h3>
              <p className="text-gray-600">Discover products from verified sellers in your immediate area</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-primary-700 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-primary-900 mb-2">Direct Chat</h3>
              <p className="text-gray-600">Coordinate meeting times and locations directly with sellers</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-primary-700 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-primary-900 mb-2">Secure OTP</h3>
              <p className="text-gray-600">Safe cash transactions with OTP verification during meetings</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="text-primary-700 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-primary-900 mb-2">No Shipping</h3>
              <p className="text-gray-600">Meet locally - no shipping costs or delivery delays</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-primary-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary-900 mb-12">
            How It Works
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between mb-12">
              <div className="text-center md:text-left mb-8 md:mb-0 md:w-1/2">
                <div className="bg-primary-700 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto md:mx-0 mb-4 text-xl font-bold">1</div>
                <h3 className="text-2xl font-bold text-primary-900 mb-2">Browse Local Products</h3>
                <p className="text-gray-700">Find products from sellers near your location</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg md:w-2/5">
                <img 
                  src={BuyImage}
                  alt="Browse products" 
                  className="max-w-[540px] max-h-[540px] w-auto h-auto object-cover rounded-lg mx-auto"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse items-center justify-between mb-12">
              <div className="text-center md:text-left mb-8 md:mb-0 md:w-1/2">
                <div className="bg-primary-700 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto md:mx-0 mb-4 text-xl font-bold">2</div>
                <h3 className="text-2xl font-bold text-primary-900 mb-2">Chat & Coordinate</h3>
                <p className="text-gray-700">Discuss meeting details directly with the seller</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg md:w-2/5">
                <img 
                  src={ChatImage} 
                  alt="Chat with sellers" 
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-center md:text-left mb-8 md:mb-0 md:w-1/2">
                <div className="bg-primary-700 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto md:mx-0 mb-4 text-xl font-bold">3</div>
                <h3 className="text-2xl font-bold text-primary-900 mb-2">Meet & Complete</h3>
                <p className="text-gray-700">Meet in person, verify with OTP, and complete your transaction</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg md:w-2/5">
                <img 
                  src={MeetImage} 
                  alt="Meet and complete" 
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;