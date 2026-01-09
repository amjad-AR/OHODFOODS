import axios from 'axios';
import { API_ENDPOINTS, API_CONFIG } from '../config/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Backend returns { success, data, token?, pagination? } format
    if (response.data && typeof response.data === 'object') {
      // Handle token if present (for login/register responses)
      if ('token' in response.data && typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('token', response.data.token);
      }

      // Extract data field if present
      if ('data' in response.data) {
        const result = response.data.data;

        // Preserve pagination if present
        if ('pagination' in response.data) {
          return {
            data: result,
            pagination: response.data.pagination
          };
        }

        return result;
      }

      // If success field exists but no data field, return the whole object
      if ('success' in response.data) {
        return response.data;
      }
    }
    return response.data;
  },
  (error) => {
    // Handle different error types
    let message = 'حدث خطأ أثناء جلب البيانات';

    if (error.response) {
      // التحقق من URL الطلب لمعرفة إذا كان طلب تسجيل دخول أو تسجيل
      const requestUrl = error.config?.url || '';
      const isAuthRequest = requestUrl.includes('/login') || requestUrl.includes('/register');

      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        if (isAuthRequest) {
          // خطأ 401 عند تسجيل الدخول = بيانات غير صحيحة
          message = error.response?.data?.error || 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
        } else {
          // خطأ 401 في طلبات أخرى = انتهت صلاحية الجلسة
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
          message = 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى';
        }
      } else {
        message = error.response?.data?.error || error.response?.data?.message || error.response?.statusText || message;
      }
    } else if (error.request) {
      message = 'لم يتم الرد من الخادم. تحقق من اتصال الإنترنت';
    } else if (error.message) {
      message = error.message;
    }

    console.error('API Error:', message);
    return Promise.reject(new Error(message));
  }
);

// Products API
export const productsAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS, { params });
      // Handle response with pagination or direct array
      if (response && typeof response === 'object' && 'data' in response) {
        return Array.isArray(response.data) ? response.data : (response.data?.items || response.data?.products || []);
      }
      return Array.isArray(response) ? response : (response?.items || response?.products || []);
    } catch (error) {
      console.error('Error fetching products:', error.message);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCT_BY_ID(id));
      return response || null;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error.message);
      throw error;
    }
  },

  create: async (productData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.PRODUCTS, productData);
      return response || null;
    } catch (error) {
      console.error('Error creating product:', error.message);
      throw error;
    }
  },

  update: async (id, productData) => {
    try {
      const response = await apiClient.put(API_ENDPOINTS.PRODUCT_BY_ID(id), productData);
      return response || null;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error.message);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      await apiClient.delete(API_ENDPOINTS.PRODUCT_BY_ID(id));
      return true;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error.message);
      throw error;
    }
  },

  getByCategory: async (category) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS_BY_CATEGORY(category));
      return Array.isArray(response) ? response : (response?.items || response?.products || []);
    } catch (error) {
      console.error(`Error fetching products by category ${category}:`, error.message);
      throw error;
    }
  },
};

// Users API
export const usersAPI = {
  getAll: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USERS);
      return Array.isArray(response) ? response : (response?.items || response?.users || []);
    } catch (error) {
      console.error('Error fetching users:', error.message);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USER_BY_ID(id));
      return response || null;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error.message);
      throw error;
    }
  },

  update: async (id, userData) => {
    try {
      const response = await apiClient.put(API_ENDPOINTS.USER_BY_ID(id), userData);
      return response || null;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error.message);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      await apiClient.delete(API_ENDPOINTS.USER_BY_ID(id));
      return true;
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error.message);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      // Token will be handled by response interceptor
      const response = await apiClient.post(API_ENDPOINTS.REGISTER, userData);
      return response || null;
    } catch (error) {
      console.error('Error registering user:', error.message);
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      // Token will be handled by response interceptor
      const response = await apiClient.post(API_ENDPOINTS.LOGIN, credentials);
      return response || null;
    } catch (error) {
      console.error('Error logging in:', error.message);
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PROFILE);
      return response || null;
    } catch (error) {
      console.error('Error fetching profile:', error.message);
      throw error;
    }
  },
};

// Orders API
export const ordersAPI = {
  getAll: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ORDERS);
      return Array.isArray(response) ? response : (response?.items || response?.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error.message);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ORDER_BY_ID(id));
      return response || null;
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error.message);
      throw error;
    }
  },

  create: async (orderData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.ORDERS, orderData);
      return response || null;
    } catch (error) {
      console.error('Error creating order:', error.message);
      throw error;
    }
  },

  getUserOrders: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USER_ORDERS);
      return Array.isArray(response) ? response : (response?.items || response?.orders || []);
    } catch (error) {
      console.error('Error fetching user orders:', error.message);
      throw error;
    }
  },
};

// Cart API
export const cartAPI = {
  get: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CART);
      return response || null;
    } catch (error) {
      console.error('Error fetching cart:', error.message);
      throw error;
    }
  },

  validate: async (items) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CART_VALIDATE, { items });
      return response || null;
    } catch (error) {
      console.error('Error validating cart:', error.message);
      throw error;
    }
  },
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.HEALTH);
    return response || { status: 'unknown' };
  } catch (error) {
    console.error('Health check failed:', error.message);
    throw error;
  }
};

export default apiClient;

