// src/components/common/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-primary-500 w-8 h-8 rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold">Loceal</span>
            </div>
            <p className="text-primary-200 mb-4 max-w-md">
              Connecting local sellers with customers in their community. Support local businesses and build stronger communities through direct, person-to-person commerce.
            </p>
            <div className="flex items-center space-x-4 text-primary-200">
              <div className="flex items-center space-x-1">
                <Phone className="w-4 h-4" />
                <span>+91 8453391908</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className="w-4 h-4" />
                <span>armaangogoi2004@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-primary-200">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/customer/login" className="hover:text-white transition-colors">Customer Login</Link></li>
              <li><Link to="/seller/login" className="hover:text-white transition-colors">Seller Login</Link></li>
              <li><Link to="/customer/register" className="hover:text-white transition-colors">Customer Sign Up</Link></li>
              <li><Link to="/seller/register" className="hover:text-white transition-colors">Seller Sign Up</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <ul className="space-y-2 text-primary-200">
              <li><a href="#" className="hover:text-white transition-colors">Our Story</a></li>
              {/* <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li> */}
              {/* <li><a href="#" className="hover:text-white transition-colors">Safety Guidelines</a></li> */}
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-200 text-sm">
            © 2025 Loceal. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-primary-200 hover:text-white transition-colors text-sm">Privacy Policy</a>
            <a href="#" className="text-primary-200 hover:text-white transition-colors text-sm">Terms of Service</a>
            {/* <a href="#" className="text-primary-200 hover:text-white transition-colors text-sm">Cookie Policy</a> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;