import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://localhost:7226/api',
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('jwtToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response.status === 401) {
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
