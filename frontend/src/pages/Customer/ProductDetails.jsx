// src/pages/Customer/ProductDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { productAPI, cartAPI } from '../../lib/api';
import { Star, MapPin, Package, ShoppingCart, ArrowLeft } from 'lucide-react';

const ProductDetails = () => {
  const { productId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProduct(productId);
      setProduct(response.data.product);
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/customer/login');
      return;
    }

    try {
      setAddingToCart(true);
      await cartAPI.addToCart({
        productId: product._id,
        quantity: quantity
      });
      
      // Show success message or redirect to cart
      alert('Product added to cart successfully!');
      navigate('/customer/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/customer/products')}
            className="btn-primary"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Products</span>
        </button>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div>
              {/* Main Image */}
              <div className="bg-gray-100 rounded-2xl h-96 mb-4 flex items-center justify-center overflow-hidden">
                {product.images?.[selectedImage]?.url ? (
                  <img 
                    src={product.images[selectedImage].url} 
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="w-24 h-24 text-gray-400" />
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`bg-gray-100 rounded-lg h-20 flex items-center justify-center overflow-hidden border-2 ${
                        selectedImage === index ? 'border-primary-500' : 'border-transparent'
                      }`}
                    >
                      <img 
                        src={image.url} 
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
              
              {/* Rating and Seller */}
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-semibold text-gray-900">
                    {product.rating?.average || 0}
                  </span>
                  <span className="text-gray-600">
                    ({product.rating?.count || 0} reviews)
                  </span>
                </div>
                
                {product.seller && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{product.seller.businessName}</span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-primary-600">₹{product.price}</span>
                <span className="text-gray-600 ml-2">per {product.unit}</span>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {/* Stock Info */}
              <div className="mb-8">
                <div className="flex items-center space-x-4 text-sm">
                  <div className={`px-3 py-1 rounded-full ${
                    product.stock > 10 
                      ? 'bg-green-100 text-green-800'
                      : product.stock > 0
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.stock > 10 
                      ? 'In Stock' 
                      : product.stock > 0 
                      ? 'Low Stock' 
                      : 'Out of Stock'
                    }
                  </div>
                  <span className="text-gray-600">
                    {product.stock} units available
                  </span>
                </div>
              </div>

              {/* Add to Cart Section */}
              {product.stock > 0 ? (
                <div className="border-t pt-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <label className="text-sm font-medium text-gray-700">Quantity:</label>
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="input-field w-20"
                    >
                      {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                    <span className="text-sm text-gray-600">
                      Max: {product.stock} units
                    </span>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="w-full btn-primary py-4 text-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>
                      {addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
                    </span>
                  </button>
                </div>
              ) : (
                <div className="border-t pt-8">
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-500 py-4 px-6 rounded-lg text-lg font-semibold cursor-not-allowed"
                  >
                    Out of Stock
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12 border-t pt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Seller Information</h3>
                {product.seller && (
                  <div className="space-y-2 text-gray-600">
                    <p className="font-medium">{product.seller.businessName}</p>
                    <p>Rating: {product.seller.rating?.average || 0}/5</p>
                    <p>Total Sales: {product.seller.totalSales || 0}</p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Details</h3>
                <div className="space-y-2 text-gray-600">
                  <p>Category: {product.category}</p>
                  {product.subCategory && <p>Subcategory: {product.subCategory}</p>}
                  <p>Minimum Order: {product.minimumOrder} {product.unit}</p>
                  {product.tags && product.tags.length > 0 && (
                    <p>Tags: {product.tags.join(', ')}</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Delivery Info</h3>
                <div className="space-y-2 text-gray-600">
                  <p className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Local Pickup Only
                  </p>
                  <p>Coordinate meeting with seller</p>
                  <p>Cash on Delivery (COD)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;