// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  // Products
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id) => `/products/${id}`,
  PRODUCTS_BY_CATEGORY: (category) => `/products/category/${category}`,

  // Users
  USERS: '/users',
  USER_BY_ID: (id) => `/users/${id}`,
  REGISTER: '/users/register',
  LOGIN: '/users/login',
  PROFILE: '/users/profile',

  // Cart
  CART: '/cart',
  CART_VALIDATE: '/cart/validate',

  // Orders
  ORDERS: '/orders',
  ORDER_BY_ID: (id) => `/orders/${id}`,
  USER_ORDERS: '/orders/user',

  // Health
  HEALTH: '/health',
};

