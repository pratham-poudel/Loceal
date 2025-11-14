// src/components/customer/ProductFilters.jsx
import React from 'react';

const ProductFilters = ({ filters, onFilterChange }) => {
  const categories = [
    'Fruits & Vegetables',
    'Dairy & Eggs',
    'Meat & Poultry',
    'Bakery',
    'Groceries',
    'Beverages',
    'Snacks',
    'Home & Kitchen',
    'Personal Care',
    'Other'
  ];

  const handleFilterUpdate = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Category Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={filters.category}
          onChange={(e) => handleFilterUpdate('category', e.target.value)}
          className="input-field"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Distance Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Maximum Distance: {filters.maxDistance} km
        </label>
        <input
          type="range"
          min="1"
          max="100"
          value={filters.maxDistance}
          onChange={(e) => handleFilterUpdate('maxDistance', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1 km</span>
          <span>100 km</span>
        </div>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sort By
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterUpdate('sortBy', e.target.value)}
          className="input-field"
        >
          <option value="distance">Distance: Nearest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="newest">Newest First</option>
        </select>
      </div>
    </div>
  );
};

export default ProductFilters;