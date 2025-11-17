// src/lib/api.js
import axios from 'axios';

// const API_BASE_URL = 'http://localhost:3000';
const API_BASE_URL = 'http://13.202.153.166:3000/';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  customer: {
    login: (credentials) => api.post('/customer/login', credentials),
    register: (userData) => api.post('/customer/register', userData),
    verifyEmail: (token) => api.get(`/customer/verifyCustomer/${token}`),
    getProfile: () => api.get('/customer/profile'), // Add this
  },
  seller: {
    login: (credentials) => api.post('/seller/login', credentials),
    register: (userData) => api.post('/seller/register', userData),
    verifyEmail: (token) => api.get(`/seller/verifySeller/${token}`),
    getProfile: () => api.get('/seller/profile'), // Add this
  },
};

export const productAPI = {
  getProducts: (params) => api.get('/customer/products', { params }),
  getProduct: (id) => api.get(`/customer/products/${id}`),
};

export const cartAPI = {
  getCart: () => api.get('/customer/cart'),
  addToCart: (data) => api.post('/customer/cart/add', data),
  updateCart: (productId, data) => api.put(`/customer/cart/update/${productId}`, data),
  removeFromCart: (productId) => api.delete(`/customer/cart/remove/${productId}`),
  clearCart: () => api.delete('/customer/cart/clear'),
};

export const orderAPI = {
  createOrder: (data) => api.post('/customer/orders', data),
  getActiveOrders: () => api.get('/customer/orders/active'),
  getCompletedOrders: () => api.get('/customer/orders/completed'),
  getOrder: (id) => api.get(`/customer/orders/${id}`),
  cancelOrder: (id) => api.put(`/customer/orders/${id}/cancel`),
  verifyOTP: (id, otp) => api.post(`/customer/orders/${id}/verify-otp`, { otp }),
};

export const sellerAPI = {
  getProducts: () => api.get('/seller/products'),
  getProduct: (id) => api.get(`/seller/products/${id}`),
  createProduct: (data) => api.post('/seller/products', data),
  updateProduct: (id, data) => api.put(`/seller/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/seller/products/${id}`),
  getOrderWithChat: (id) => api.get(`/seller/orders/${id}`), // newly added for getting chat
  getOrders: (params) => api.get('/seller/orders', {params}),
  initiatePayment: (id) => api.post(`/seller/orders/${id}/initiate-payment`),
  verifyOTP: (id, otp) => api.post(`/seller/orders/${id}/verify-otp`, { otp }),
};

export const chatAPI = {
  getMessages: (orderId, userType) => api.get(`/api/chat/${userType}/orders/${orderId}/messages`),
  sendMessage: (orderId, userType, data) => api.post(`/api/chat/${userType}/orders/${orderId}/messages`, data),
};

export default api;