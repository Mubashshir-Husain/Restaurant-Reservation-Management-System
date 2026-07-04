import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5500/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add Authorization Token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle specific API errors (like 401 Unauthorized)
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // If we are not on login page, we can trigger window reload or handled by Redux
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // Return a clean error message
    const message = error.response?.data?.message || 'Something went wrong';
    const details = error.response?.data?.details || null;
    
    return Promise.reject({
      status: error.response?.status || 500,
      message,
      details,
    });
  }
);

export default api;
