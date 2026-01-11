import axios from 'axios';
import { buildUrl, API_URLS, getHeaders } from '../constants/API_URLS';

/**
 * Get user's cart
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Cart data
 */
export const getCart = async (token) => {
    try {
        const url = buildUrl(API_URLS.CART);
        console.log('📡 Fetching cart from:', url);
        
        const response = await axios.get(url, {
            headers: getHeaders(token),
            timeout: 10000,
        });
        
        console.log('✅ Cart fetched:', response.data);
        
        if (response.data && response.data.success) {
            return response.data;
        }
        return response.data;
    } catch (error) {
        console.error('❌ Error fetching cart:', error.message);
        throw error;
    }
};

/**
 * Validate cart items
 * @param {Array} items - Cart items to validate
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Validation result
 */
export const validateCart = async (items, token) => {
    try {
        const url = buildUrl(API_URLS.CART_VALIDATE);
        console.log('📡 Validating cart:', url);
        
        const response = await axios.post(url, { items }, {
            headers: getHeaders(token),
            timeout: 10000,
        });
        
        console.log('✅ Cart validated:', response.data);
        
        if (response.data && response.data.success) {
            return response.data;
        }
        return response.data;
    } catch (error) {
        console.error('❌ Error validating cart:', error.message);
        throw error;
    }
};

/**
 * Sync local cart with backend
 * @param {Array} cartItems - Local cart items
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Sync result
 */
export const syncCartWithBackend = async (cartItems, token) => {
    try {
        // Validate cart items first
        const validatedItems = await validateCart(
            cartItems.map(item => ({
                productId: item.product._id,
                quantity: item.qty
            })),
            token
        );
        
        return validatedItems;
    } catch (error) {
        console.error('❌ Error syncing cart:', error.message);
        throw error;
    }
};
