import axios from 'axios';
import { store } from '../store';
import { refreshToken, clearAuth } from '../store/slices/authSlice';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true, // Critical for cookie-based auth
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor - handles auth headers
apiClient.interceptors.request.use(
  (config) => {
    // For file uploads, don't set Content-Type (let browser set it)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handles token refresh and errors
apiClient.interceptors.response.use(
  (response) => {
    // Log response time in development
    if (import.meta.env.VITE_ENVIRONMENT === 'development') {
      const endTime = new Date();
      const duration = endTime - response.config.metadata.startTime;
      console.log(`API Call: ${response.config.method.toUpperCase()} ${response.config.url} - ${duration}ms`);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        type: 'NETWORK_ERROR'
      });
    }

    // Handle 401 errors with token refresh
    if (
      error.response?.status === 401 &&
      error.response?.data?.message === 'Access token has expired' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const state = store.getState();
        const currentRefreshToken = state.auth.refreshToken;

        if (currentRefreshToken) {
          await store.dispatch(refreshToken(currentRefreshToken)).unwrap();
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        store.dispatch(clearAuth());
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other HTTP errors
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        `HTTP ${error.response?.status}: ${error.response?.statusText}` ||
                        'An unexpected error occurred';

    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      errors: error.response?.data?.errors || [],
      type: 'API_ERROR'
    });
  }
);

export default apiClient;