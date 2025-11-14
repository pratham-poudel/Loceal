// add or edit product
// src/pages/Seller/AddProduct.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { sellerAPI } from '../../lib/api';
import { ArrowLeft, Save, Upload, Package } from 'lucide-react';

const AddProduct = () => {
  const { productId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isEditing = !!productId;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subCategory: '',
    price: '',
    unit: 'piece',
    minimumOrder: 1,
    stock: '',
    expiryDate: '',
    tags: ''
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const units = [
    'kg', 'gram', 'liter', 'ml', 'piece', 'dozen', 'bundle', 'packet'
  ];

  useEffect(() => {
    if (isEditing) {
      fetchProductDetails();
    }
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await sellerAPI.getProduct(productId);
      const product = response.data.product;
      
      setFormData({
        title: product.title || '',
        description: product.description || '',
        category: product.category || '',
        subCategory: product.subCategory || '',
        price: product.price || '',
        unit: product.unit || 'piece',
        minimumOrder: product.minimumOrder || 1,
        stock: product.stock || '',
        expiryDate: product.expiryDate ? new Date(product.expiryDate).toISOString().split('T')[0] : '',
        tags: product.tags ? product.tags.join(', ') : ''
      });
      
      setImages(product.images || []);
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // In a real app, you'd upload these to a cloud service
    // For now, we'll just store the file objects
    setImages(prev => [...prev, ...files.slice(0, 5 - prev.length)]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.title || !formData.description || !formData.category || 
        !formData.price || !formData.stock) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (formData.price < 0 || formData.stock < 0) {
      setError('Price and stock cannot be negative');
      setLoading(false);
      return;
    }

    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        minimumOrder: parseInt(formData.minimumOrder),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        expiryDate: formData.expiryDate || null
      };

      if (isEditing) {
        await sellerAPI.updateProduct(productId, submitData);
      } else {
        await sellerAPI.createProduct(submitData);
      }

      navigate('/seller/products');
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} product`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/seller/products')}
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Products</span>
            </button>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditing ? 'Edit Product' : 'Add New Product'}
              </h1>
              <p className="text-gray-600">
                {isEditing ? 'Update your product information' : 'Create a new product listing'}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Title */}
                  <div className="md:col-span-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Product Title *
                    </label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      required
                      value={formData.title}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter product title"
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      required
                      value={formData.description}
                      onChange={handleChange}
                      className="input-field resize-none"
                      placeholder="Describe your product in detail"
                      rows="4"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sub Category */}
                  <div>
                    <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700 mb-2">
                      Sub Category
                    </label>
                    <input
                      id="subCategory"
                      name="subCategory"
                      type="text"
                      value={formData.subCategory}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Optional sub category"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing & Inventory */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Pricing & Inventory</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Price */}
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹) *
                    </label>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={formData.price}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="0.00"
                    />
                  </div>

                  {/* Unit */}
                  <div>
                    <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-2">
                      Unit *
                    </label>
                    <select
                      id="unit"
                      name="unit"
                      required
                      value={formData.unit}
                      onChange={handleChange}
                      className="input-field"
                    >
                      {units.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>

                  {/* Stock */}
                  <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity *
                    </label>
                    <input
                      id="stock"
                      name="stock"
                      type="number"
                      min="0"
                      required
                      value={formData.stock}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="0"
                    />
                  </div>

                  {/* Minimum Order */}
                  <div>
                    <label htmlFor="minimumOrder" className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Order
                    </label>
                    <input
                      id="minimumOrder"
                      name="minimumOrder"
                      type="number"
                      min="1"
                      value={formData.minimumOrder}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="1"
                    />
                  </div>

                  {/* Expiry Date */}
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      id="expiryDate"
                      name="expiryDate"
                      type="date"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  id="tags"
                  name="tags"
                  type="text"
                  value={formData.tags}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Separate tags with commas (e.g., organic, fresh, local)"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Add relevant tags to help customers find your product
                </p>
              </div>

              {/* Images */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Product Images</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  {/* Existing Images */}
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        {image.url ? (
                          <img 
                            src={image.url} 
                            alt={`Product ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img 
                            src={URL.createObjectURL(image)} 
                            alt={`Product ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <span className="w-4 h-4 block">×</span>
                      </button>
                    </div>
                  ))}

                  {/* Upload Button */}
                  {images.length < 5 && (
                    <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 transition-colors cursor-pointer flex flex-col items-center justify-center">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600 text-center">
                        Add Image<br />
                        <span className="text-xs">({5 - images.length} remaining)</span>
                      </span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                
                <p className="text-sm text-gray-500">
                  Upload up to 5 images. First image will be used as the main display image.
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => navigate('/seller/products')}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  <span>{isEditing ? 'Update Product' : 'Create Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;