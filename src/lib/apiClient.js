// src/lib/apiClient.js

import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Axios Interceptor: প্রতিটি রিকোয়েস্টের সাথে স্বয়ংক্রিয়ভাবে টোকেন যুক্ত করবে
apiClient.interceptors.request.use(
    (config) => {
        // চেক করুন কোডটি ব্রাউজারে চলছে কিনা
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;