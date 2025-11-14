// src/utils/constants.js
export const APP_CONFIG = {
  NAME: 'Loceal',
  DESCRIPTION: 'Local Marketplace - Connect with sellers in your area',
  VERSION: '1.0.0',
  API_BASE_URL: 'http://localhost:3000',
  SOCKET_URL: 'http://localhost:3000'
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  MEETING_SCHEDULED: 'meeting_scheduled',
  READY_FOR_PICKUP: 'ready_for_pickup',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  DISPUTED: 'disputed'
};

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Pending',
  [ORDER_STATUS.CONFIRMED]: 'Confirmed',
  [ORDER_STATUS.MEETING_SCHEDULED]: 'Meeting Scheduled',
  [ORDER_STATUS.READY_FOR_PICKUP]: 'Ready for Pickup',
  [ORDER_STATUS.COMPLETED]: 'Completed',
  [ORDER_STATUS.CANCELLED]: 'Cancelled',
  [ORDER_STATUS.DISPUTED]: 'Disputed'
};

export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
  [ORDER_STATUS.CONFIRMED]: 'bg-blue-100 text-blue-800',
  [ORDER_STATUS.MEETING_SCHEDULED]: 'bg-purple-100 text-purple-800',
  [ORDER_STATUS.READY_FOR_PICKUP]: 'bg-green-100 text-green-800',
  [ORDER_STATUS.COMPLETED]: 'bg-gray-100 text-gray-800',
  [ORDER_STATUS.CANCELLED]: 'bg-red-100 text-red-800',
  [ORDER_STATUS.DISPUTED]: 'bg-orange-100 text-orange-800'
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  COD_PENDING: 'cod_pending',
  COD_COMPLETED: 'cod_completed'
};

export const PAYMENT_METHODS = {
  CASH: 'cash',
  ELECTRONIC: 'electronic',
  UPI: 'upi',
  CARD: 'card'
};

export const USER_TYPES = {
  CUSTOMER: 'customer',
  SELLER: 'seller',
  ADMIN: 'admin'
};

export const PRODUCT_CATEGORIES = [
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

export const PRODUCT_UNITS = [
  'kg',
  'gram',
  'liter',
  'ml',
  'piece',
  'dozen',
  'bundle',
  'packet'
];

export const MESSAGE_TYPES = {
  TEXT: 'text',
  LOCATION: 'location',
  IMAGE: 'image',
  SYSTEM: 'system'
};

export const CHAT_ROLES = {
  CUSTOMER: 'customer',
  SELLER: 'seller',
  SYSTEM: 'system'
};

export const SORT_OPTIONS = {
  DISTANCE: 'distance',
  PRICE_ASC: 'price_asc',
  PRICE_DESC: 'price_desc',
  RATING: 'rating',
  NEWEST: 'newest'
};

export const SORT_LABELS = {
  [SORT_OPTIONS.DISTANCE]: 'Distance: Nearest',
  [SORT_OPTIONS.PRICE_ASC]: 'Price: Low to High',
  [SORT_OPTIONS.PRICE_DESC]: 'Price: High to Low',
  [SORT_OPTIONS.RATING]: 'Highest Rated',
  [SORT_OPTIONS.NEWEST]: 'Newest First'
};

export const FILTER_DEFAULTS = {
  MAX_DISTANCE: 50, // km
  PRODUCTS_PER_PAGE: 10,
  DEFAULT_SORT: SORT_OPTIONS.DISTANCE
};

export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[6-9]\d{9}$/, // Indian phone numbers
  PINCODE: /^\d{6}$/,
  OTP: /^\d{6}$/,
  PRICE: /^\d+(\.\d{1,2})?$/,
  QUANTITY: /^[1-9]\d*$/
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Please login to continue.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  DEFAULT: 'Something went wrong. Please try again.'
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  REGISTER_SUCCESS: 'Registration successful!',
  PRODUCT_ADDED: 'Product added successfully!',
  PRODUCT_UPDATED: 'Product updated successfully!',
  PRODUCT_DELETED: 'Product deleted successfully!',
  ORDER_CREATED: 'Order created successfully!',
  ORDER_UPDATED: 'Order updated successfully!',
  ORDER_CANCELLED: 'Order cancelled successfully!',
  PAYMENT_INITIATED: 'OTP sent to customer successfully!',
  PAYMENT_COMPLETED: 'Payment completed successfully!',
  MESSAGE_SENT: 'Message sent successfully!'
};

export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'token',
  USER_DATA: 'userData',
  USER_TYPE: 'userType',
  CART: 'cart',
  LOCATION: 'location'
};

export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  JOIN_CHAT_ROOM: 'join_chat_room',
  LEAVE_CHAT_ROOM: 'leave_chat_room',
  SEND_MESSAGE: 'send_message',
  RECEIVE_MESSAGE: 'receive_message',
  TYPING_START: 'typing_start',
  TYPING_STOP: 'typing_stop',
  MESSAGE_READ: 'mark_messages_read',
  MESSAGES_READ: 'messages_read',
  MESSAGE_ERROR: 'message_error',
  USER_TYPING: 'user_typing'
};

// Color constants matching your design system
export const COLORS = {
  PRIMARY: {
    50: '#8686AC',
    100: '#7272A3',
    500: '#505081',
    700: '#272757',
    900: '#0F0E47'
  },
  STATUS: {
    SUCCESS: '#10B981',
    WARNING: '#F59E0B',
    ERROR: '#EF4444',
    INFO: '#3B82F6'
  }
};

// Default location (fallback if geolocation fails)
export const DEFAULT_LOCATION = {
  latitude: 28.6139, // Delhi coordinates
  longitude: 77.2090,
  city: 'Delhi',
  state: 'Delhi',
  country: 'India'
};

export default {
  APP_CONFIG,
  ORDER_STATUS,
  PAYMENT_STATUS,
  USER_TYPES,
  PRODUCT_CATEGORIES,
  PRODUCT_UNITS,
  MESSAGE_TYPES,
  SORT_OPTIONS,
  FILTER_DEFAULTS,
  VALIDATION_RULES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  LOCAL_STORAGE_KEYS,
  SOCKET_EVENTS,
  COLORS,
  DEFAULT_LOCATION
};