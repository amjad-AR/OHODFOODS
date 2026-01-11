import axios from 'axios';
import { buildUrl, API_URLS, getHeaders } from '../constants/API_URLS';

export const registerUser = async (payload) => {
    try {
        const url = buildUrl(API_URLS.REGISTER);
        console.log('📡 Registering user to:', url, payload);
        
        const res = await axios.post(url, payload, { 
            headers: getHeaders(),
            timeout: 10000,
        });
        
        console.log('✅ User registered successfully:', res.data);
        return res.data;
    } catch (err) {
        console.error('❌ registerUser error:', err.response?.data || err.message);
        throw err;
    }
};

export const loginUser = async (payload) => {
    try {
        const url = buildUrl(API_URLS.LOGIN);
        console.log('📡 Logging in user to:', url, payload);
        
        const res = await axios.post(url, payload, { 
            headers: getHeaders(),
            timeout: 10000,
        });
        
        console.log('✅ User logged in successfully:', res.data);
        return res.data;
    } catch (err) {
        console.error('❌ loginUser error:', err.response?.data || err.message);
        throw err;
    }
};
