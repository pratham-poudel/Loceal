// src/components/common/ProductCard.jsx
import React from 'react';
import { Package, Star, MapPin } from 'lucide-react'; 
const ProductCard = ({ product, onViewDetails, onAddToCart }) => {
  const {
    _id,
    title,
    price,
    unit,
    images,
    rating,
    distance,
    sellerLocation,
    stock
  } = product;

  // ✅ ADD: Extract address string from sellerLocation object
  const getLocationText = () => {
    if (!sellerLocation) return null;
    
    if (typeof sellerLocation === 'string') {
      return sellerLocation;
    }
    
    // Handle address object structure
    if (sellerLocation.address) {
      return sellerLocation.address;
    }
    
    if (sellerLocation.street && sellerLocation.city) {
      return `${sellerLocation.street}, ${sellerLocation.city}`;
    }
    
    if (sellerLocation.street) {
      return sellerLocation.street;
    }
    
    return 'Location available';
  };

  const locationText = getLocationText();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <div 
      onClick={onViewDetails}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group"
    >
      {/* Product Image */}
      <div className="h-48 bg-gray-100 relative overflow-hidden">
        {images?.[0]?.url ? (
          <img 
            src={images[0].url} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Package className="w-12 h-12" />
          </div>
        )}
        
        {/* Stock Badge */}
        {stock < 10 && stock > 0 && (
          <div className="absolute top-3 right-3 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
            Low Stock
          </div>
        )}
        {stock === 0 && (
          <div className="absolute top-3 right-3 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
            Out of Stock
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {title}
        </h3>

        {/* Rating and Distance */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">
              {rating?.average || 0} ({rating?.count || 0})
            </span>
          </div>
          {distance && (
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <MapPin className="w-3 h-3" />
              <span>{distance} km</span>
            </div>
          )}
        </div>

        {/* Price and Unit */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-primary-600">₹{price}</span>
          <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
            per {unit}
          </span>
        </div>

        {/* Location */}
        {locationText && (
          <p className="text-xs text-gray-500 mb-3 line-clamp-1">
            {locationText}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={onViewDetails}
            className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors text-center"
          >
            View Details
          </button>
          {onAddToCart && stock > 0 && (
            <button
              onClick={handleAddToCart}
              className="flex-1 border border-primary-500 text-primary-600 hover:bg-primary-50 py-2 px-4 rounded-lg text-sm font-medium transition-colors text-center"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;