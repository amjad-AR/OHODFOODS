import axios from 'axios';
import { buildUrl, API_URLS, getHeaders } from '../constants/API_URLS';

/**
 * Create a new order
 * @param {Object} orderData - Order data including items, totalAmount, shippingAddress
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Created order
 */
export const createOrder = async (orderData, token) => {
    try {
        const url = buildUrl(API_URLS.ORDER_CREATE);
        console.log('📡 Creating order at URL:', url);
        console.log('📦 Order data:', JSON.stringify(orderData, null, 2));
        console.log('🔑 Token present:', token ? 'Yes (length: ' + token.length + ')' : 'NO TOKEN!');
        
        const headers = getHeaders(token);
        console.log('📤 Request headers:', JSON.stringify(headers, null, 2));
        
        const response = await axios.post(url, orderData, {
            headers: headers,
            timeout: 15000,
        });
        
        console.log('📥 Raw response status:', response.status);
        
        console.log('✅ Order created successfully:', response.data);
        
        if (response.data && response.data.success) {
            return response.data;
        }
        return response.data;
    } catch (error) {
        console.error('❌ Error creating order:', error.message);
        if (error.response) {
            console.error('Response error:', error.response.data);
        }
        throw error;
    }
};

/**
 * Get user's orders
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} User's orders
 */
export const getUserOrders = async (token) => {
    try {
        const url = buildUrl(API_URLS.USER_ORDERS);
        console.log('📡 Fetching user orders from:', url);
        
        const response = await axios.get(url, {
            headers: getHeaders(token),
            timeout: 10000,
        });
        
        console.log('✅ User orders fetched:', response.data);
        
        if (response.data && response.data.success) {
            return response.data;
        }
        return response.data;
    } catch (error) {
        console.error('❌ Error fetching user orders:', error.message);
        throw error;
    }
};

/**
 * Get all orders (admin only)
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} All orders
 */
export const getAllOrders = async (token) => {
    try {
        const url = buildUrl(API_URLS.ORDERS);
        console.log('📡 Fetching all orders from:', url);
        
        const response = await axios.get(url, {
            headers: getHeaders(token),
            timeout: 10000,
        });
        
        console.log('✅ All orders fetched:', response.data);
        
        if (response.data && response.data.success) {
            return response.data;
        }
        return response.data;
    } catch (error) {
        console.error('❌ Error fetching all orders:', error.message);
        throw error;
    }
};

/**
 * Get order by ID
 * @param {string} orderId - Order ID
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Order details
 */
export const getOrderById = async (orderId, token) => {
    try {
        const url = buildUrl(`/orders/${orderId}`);
        console.log('📡 Fetching order by ID:', url);
        
        const response = await axios.get(url, {
            headers: getHeaders(token),
            timeout: 10000,
        });
        
        console.log('✅ Order fetched:', response.data);
        
        if (response.data && response.data.success) {
            return response.data;
        }
        return response.data;
    } catch (error) {
        console.error(`❌ Error fetching order ${orderId}:`, error.message);
        throw error;
    }
};
