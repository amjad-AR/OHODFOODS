import { API_URLS, buildUrl, getHeaders } from '../constants/API_URLS';
import axios from 'axios';

/**
 * Fetch all products with optional filters
 * @param {Object} options - Filter options (category, tag, search, page, limit)
 * @returns {Promise<Object>} Products list and pagination info
 */
export const fetchAllProducts = async (options = {}) => {
    try {
        const { category, tag, search, page = 1, limit = 10 } = options;
        const params = {};
        if (category) params.category = category;
        if (tag) params.tag = tag;
        if (search) params.search = search;
        params.page = page;
        params.limit = limit;

        const url = buildUrl(API_URLS.PRODUCTS);
        console.log('📡 Fetching products from:', url, 'with params:', params);
        console.log('📡 Full URL with params:', `${url}?${new URLSearchParams(params).toString()}`);
        
        const response = await axios.get(url, {
            params,
            headers: getHeaders(),
            timeout: 15000, // 15 seconds timeout (increased for network delays)
            validateStatus: function (status) {
                return status < 500; // Don't throw for 4xx errors
            },
        });
        
        console.log('✅ Products fetched successfully:', response.data);
        
        // Backend returns { success, data, pagination }
        // Return the full response object so components can access data and pagination
        if (response.data && response.data.success) {
            return response.data;
        }
        // Fallback for direct data response
        return response.data;
    } catch (error) {
        console.error('❌ Error fetching products:', error.message);
        if (error.response) {
            console.error('Response error:', error.response.data);
        } else if (error.request) {
            console.error('No response received. Check if backend is running.');
        }
        throw error;
    }
};

/**
 * Fetch a single product by ID
 * @param {string} productId - Product ID
 * @returns {Promise<Object>} Product details
 */
export const fetchProductById = async (productId) => {
    try {
        const url = buildUrl(API_URLS.PRODUCT_DETAIL(productId));
        console.log('📡 Fetching product by ID from:', url);
        
        const response = await axios.get(url, { 
            headers: getHeaders(),
            timeout: 10000,
        });
        
        console.log('✅ Product fetched:', response.data);
        
        // Backend returns { success, data }
        if (response.data && response.data.success) {
            return response.data;
        }
        // Fallback for direct data response
        return response.data;
    } catch (error) {
        console.error(`❌ Error fetching product ${productId}:`, error.message);
        throw error;
    }
};

/**
 * Fetch products by category
 * @param {string} category - Category name (raw_ingredients, ready_products, beverages)
 * @returns {Promise<Object>} Products by category
 */
export const fetchProductsByCategory = async (category) => {
    try {
        const url = buildUrl(API_URLS.PRODUCTS_BY_CATEGORY(category));
        console.log('📡 Fetching products by category from:', url);
        
        const response = await axios.get(url, { 
            headers: getHeaders(),
            timeout: 10000,
        });
        
        console.log('✅ Category products fetched:', response.data);
        
        // Backend returns { success, data }
        if (response.data && response.data.success) {
            return response.data;
        }
        // Fallback for direct data response
        return response.data;
    } catch (error) {
        console.error(`❌ Error fetching products by category ${category}:`, error.message);
        throw error;
    }
};

/**
 * Search products
 * @param {string} searchTerm - Search term
 * @returns {Promise<Object>} Search results
 */
export const searchProducts = async (searchTerm) => {
    try {
        return fetchAllProducts({ search: searchTerm });
    } catch (error) {
        console.error('❌ Error searching products:', error.message);
        throw error;
    }
};

/**
 * Filter products by tag
 * @param {string} tag - Tag to filter by
 * @returns {Promise<Object>} Filtered products
 */
export const filterProductsByTag = async (tag) => {
    try {
        return fetchAllProducts({ tag });
    } catch (error) {
        console.error(`❌ Error filtering products by tag ${tag}:`, error.message);
        throw error;
    }
};

/**
 * Update a product by ID
 * @param {string} productId - Product ID
 * @param {Object} productData - Updated product data
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Updated product
 */
export const updateProduct = async (productId, productData, token) => {
    try {
        const url = buildUrl(API_URLS.PRODUCT_UPDATE(productId));
        console.log('📡 Updating product:', url, 'with data:', productData);
        
        const response = await axios.put(url, productData, {
            headers: getHeaders(token),
            timeout: 15000,
        });
        
        console.log('✅ Product updated successfully:', response.data);
        
        // Backend returns { success, data }
        if (response.data && response.data.success) {
            return response.data;
        }
        // Fallback for direct data response
        return response.data;
    } catch (error) {
        console.error(`❌ Error updating product ${productId}:`, error.message);
        if (error.response) {
            console.error('Response error:', error.response.data);
        } else if (error.request) {
            console.error('No response received. Check if backend is running.');
        }
        throw error;
    }
};

/**
 * Create a new product
 * @param {Object} productData - New product data
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Created product
 */
export const createProduct = async (productData, token) => {
    try {
        const url = buildUrl(API_URLS.PRODUCT_CREATE);
        console.log('📡 Creating product:', url, 'with data:', productData);
        
        const response = await axios.post(url, productData, {
            headers: getHeaders(token),
            timeout: 15000,
        });
        
        console.log('✅ Product created successfully:', response.data);
        
        // Backend returns { success, data }
        if (response.data && response.data.success) {
            return response.data;
        }
        // Fallback for direct data response
        return response.data;
    } catch (error) {
        console.error('❌ Error creating product:', error.message);
        if (error.response) {
            console.error('Response error:', error.response.data);
        } else if (error.request) {
            console.error('No response received. Check if backend is running.');
        }
        throw error;
    }
};

/**
 * Delete a product by ID
 * @param {string} productId - Product ID
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Deletion result
 */
export const deleteProduct = async (productId, token) => {
    try {
        const url = buildUrl(API_URLS.PRODUCT_DELETE(productId));
        console.log('📡 Deleting product:', url);
        
        const response = await axios.delete(url, {
            headers: getHeaders(token),
            timeout: 10000,
        });
        
        console.log('✅ Product deleted successfully:', response.data);
        
        // Backend returns { success, message }
        if (response.data && response.data.success) {
            return response.data;
        }
        // Fallback for direct data response
        return response.data;
    } catch (error) {
        console.error(`❌ Error deleting product ${productId}:`, error.message);
        if (error.response) {
            console.error('Response error:', error.response.data);
        } else if (error.request) {
            console.error('No response received. Check if backend is running.');
        }
        throw error;
    }
};