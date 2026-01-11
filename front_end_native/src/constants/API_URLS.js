// API Configuration and URLs

// Set your own IP address
// For Android Emulator use: 10.0.2.2
// For physical device use: Your device's actual IP address on the local network
// You can find your IP through cmd > ipconfig > IPv4 Address
// For web/Expo Go use: localhost or 127.0.0.1

import { Platform } from 'react-native';

// Auto-detect environment
const isExpoWeb = typeof window !== 'undefined' && window.location?.hostname === 'localhost';
const isAndroid = Platform.OS === 'android';
const isIOS = Platform.OS === 'ios';

// For development, try localhost first (works for Expo web and some emulators)
// For Android emulator, use 10.0.2.2
// For physical device, you need to set your computer's local IP
// ⚠️ IMPORTANT: Change LOCAL_IP to your computer's actual IP address
// To find your IP: Windows (cmd > ipconfig) or Mac/Linux (ifconfig)
// Example: '192.168.1.100' or '192.168.0.5'
const LOCAL_IP = '192.168.1.100'; // ⚠️ Change this to your device's real IP address
const EMULATOR_HOST = '10.0.2.2'; // For Android Emulator
const LOCALHOST = 'localhost'; // For web and Expo
const DEV_PORT = '5000';

// Determine base URL based on environment
let BASE_URL;

// Priority: Web first, then Android, then iOS, then fallback
if (isExpoWeb) {
    // For web/Expo web, use localhost
    BASE_URL = `http://${LOCALHOST}:${DEV_PORT}/api`;
} else if (isAndroid) {
    // For Android (emulator or device), use 10.0.2.2 for emulator
    // Note: For physical Android device, you need to use your computer's local IP
    BASE_URL = `http://${EMULATOR_HOST}:${DEV_PORT}/api`;
} else if (isIOS) {
    // For iOS simulator, use localhost
    // For physical iOS device, use your computer's local IP
    BASE_URL = `http://${LOCALHOST}:${DEV_PORT}/api`;
} else {
    // Fallback: assume Android emulator (most common case in React Native)
    BASE_URL = `http://${EMULATOR_HOST}:${DEV_PORT}/api`;
}

console.log('🌐 API Base URL:', BASE_URL);
console.log('🌐 Environment:', {
    isExpoWeb,
    isAndroid,
    isIOS,
    platform: Platform.OS,
    platformVersion: Platform.Version
});

export const API_URLS = {
    BASE: BASE_URL,

    // Product endpoints
    PRODUCTS: '/products',
    PRODUCT_DETAIL: (id) => `/products/${id}`,
    PRODUCTS_BY_CATEGORY: (category) => `/products/category/${category}`,
    PRODUCT_UPDATE: (id) => `/products/${id}`,
    PRODUCT_CREATE: '/products',
    PRODUCT_DELETE: (id) => `/products/${id}`,

    // User / Auth endpoints
    REGISTER: '/users/register',
    LOGIN: '/users/login',
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',

    // Cart endpoints
    CART: '/cart',
    CART_VALIDATE: '/cart/validate',

    // Order endpoints
    ORDERS: '/orders',
    ORDER_CREATE: '/orders',
    USER_ORDERS: '/orders/user',
};

// Helper function to build full URL
export const buildUrl = (endpoint) => {
    const url = `${API_URLS.BASE}${endpoint}`;
    console.log('🔗 Building URL:', url);
    return url;
};

// Helper function to get headers
export const getHeaders = (token = null) => {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    return headers;
};

