import axios from 'axios';
import { getToken } from './auth';

import isTokenExpired from './jwt';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

axiosInstance.interceptors.request.use(async (config) => {
    const token = await getToken(); 
    if (isTokenExpired(token)) {
        window.location.href = `/auth/login?redirect=${window.location.pathname}`;
        return Promise.reject(new Error('Token is expired'));
    }

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;