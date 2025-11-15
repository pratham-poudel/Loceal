// src/pages/Customer/ProductList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from '../../hooks/useLocation';
import { productAPI } from '../../lib/api';
import ProductCard from '../../components/common/ProductCard';
import Pagination from '../../components/common/Pagination';
import ProductFilters from '../../components/customer/ProductFilters';
import { Search, Filter, MapPin, X } from 'lucide-react';

const ProductList = () => {
  const { location, getCurrentLocation } = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    sortBy: 'distance',
    maxDistance: 50
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0
  });
  const [showFilters, setShowFilters] = useState(false);

  const productsPerPage = 10;

  useEffect(() => {
    fetchProducts();
  }, [location, filters, pagination.currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const params = {
        sortBy: filters.sortBy,
        maxDistance: filters.maxDistance
      };

      // ✅ REMOVE location check - backend handles fallback!
      // Just send whatever location we have (even if null)
      if (location) {
        params.lat = location.latitude;
        params.lng = location.longitude;
      }
      // If location is null, backend will use customer's saved address

      if (filters.category) {
        params.category = filters.category;
      }

      console.log('📡 API Params:', params);

      const response = await productAPI.getProducts(params);
      const { products: allProducts } = response.data;

      // Frontend pagination logic
      const startIndex = (pagination.currentPage - 1) * productsPerPage;
      const endIndex = startIndex + productsPerPage;
      const paginatedProducts = allProducts.slice(startIndex, endIndex);

      setProducts(paginatedProducts);
      setPagination(prev => ({
        ...prev,
        totalPages: Math.ceil(allProducts.length / productsPerPage),
        totalProducts: allProducts.length
      }));
    } catch (error) {
      console.error('❌ Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchProducts();
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      sortBy: 'distance',
      maxDistance: 50
    });
    setSearchQuery('');
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Local Products</h1>
              <p className="text-gray-600">
                Discover products from sellers in your area
                {location && (
                  <span className="text-green-600 ml-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    Using your current location
                  </span>
                )}
              </p>
            </div>

            {!location && (
              <button
                onClick={getCurrentLocation}
                className="btn-primary flex items-center space-x-2"
              >
                <MapPin className="w-4 h-4" />
                <span>Use Current Location</span>
              </button>
            )}
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="input-field pl-10 pr-4"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-600 hover:text-primary-700"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Filter Toggle */}
            <div className="flex space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-secondary flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>

              {(filters.category || filters.sortBy !== 'distance' || filters.maxDistance !== 50) && (
                <button
                  onClick={clearFilters}
                  className="btn-secondary flex items-center space-x-2 bg-red-50 text-red-700 hover:bg-red-100"
                >
                  <X className="w-4 h-4" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 border-t pt-6">
              <ProductFilters
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {products.length} of {pagination.totalProducts} products
          </p>

          {/* Sort Options */}
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange({ ...filters, sortBy: e.target.value })}
            className="input-field w-auto"
          >
            <option value="distance">Distance: Nearest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest First</option>
          </select>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onViewDetails={() => navigate(`/customer/products/${product._id}`)}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">
              {location
                ? "Try adjusting your search criteria or increasing the distance range."
                : "Enable location access to see products in your area."
              }
            </p>
            {!location && (
              <button
                onClick={getCurrentLocation}
                className="btn-primary"
              >
                Use Current Location
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;