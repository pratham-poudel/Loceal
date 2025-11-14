// src/components/customer/CartItem.jsx
import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { Trash2, Plus, Minus, MessageCircle } from 'lucide-react';

const CartItem = ({ item, onProceed, processing }) => {
  const { updateCartItem, removeFromCart } = useCart();
  const [updating, setUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      setUpdating(true);
      await updateCartItem(item.product._id, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (window.confirm('Remove this item from cart?')) {
      await removeFromCart(item.product._id);
    }
  };

  const subtotal = item.priceAtAdd * item.quantity;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 p-4 border border-gray-200 rounded-xl">
      {/* Product Image */}
      <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
        {item.product.images?.[0]?.url ? (
          <img 
            src={item.product.images[0].url} 
            alt={item.product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <MessageCircle className="w-8 h-8" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">{item.product.title}</h3>
        <p className="text-gray-600 text-sm mt-1">Seller: {item.seller.businessName}</p>
        <p className="text-primary-600 font-semibold text-lg mt-1">₹{item.priceAtAdd} per {item.product.unit}</p>
        
        {/* Quantity Controls */}
        <div className="flex items-center space-x-3 mt-3">
          <span className="text-sm text-gray-600">Quantity:</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={updating || item.quantity <= 1}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center font-medium">{item.quantity}</span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={updating || item.quantity >= item.product.stock}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        {/* Subtotal */}
        <div className="text-right sm:text-left">
          <p className="text-lg font-semibold text-gray-900">₹{subtotal}</p>
          <p className="text-sm text-gray-600">{item.quantity} × ₹{item.priceAtAdd}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => onProceed(item.product._id)}
            disabled={processing}
            className="btn-primary flex items-center space-x-2 px-4 py-2 text-sm disabled:opacity-50"
          >
            {processing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <MessageCircle className="w-4 h-4" />
                <span>Proceed</span>
              </>
            )}
          </button>

          <button
            onClick={handleRemove}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;