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
    // Add access token to requests
    const state = store.getState();
    const accessToken = state.auth.accessToken || localStorage.getItem('accessToken');
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
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
      (error.response?.data?.message === 'Access token has expired' || 
       error.response?.data?.message === 'Invalid token' ||
       error.response?.data?.message === 'jwt expired' ||
       error.response?.data?.message === 'Token expired' ||
       error.response?.data?.error === 'jwt expired') &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const state = store.getState();
        let currentRefreshToken = state.auth.refreshToken;
        
        // If no refresh token in state, try to get it from localStorage
        if (!currentRefreshToken) {
          currentRefreshToken = localStorage.getItem('refreshToken');
        }

        if (currentRefreshToken) {
          const refreshResult = await store.dispatch(refreshToken(currentRefreshToken)).unwrap();
          
          // Update the original request with the new access token
          originalRequest.headers.Authorization = `Bearer ${refreshResult.accessToken}`;
          
          // Retry the original request
          return apiClient(originalRequest);
        } else {
          // No refresh token available, clear auth and redirect
          store.dispatch(clearAuth());
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          return Promise.reject(error);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        store.dispatch(clearAuth());
        // Only redirect to login if not already on login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle other 401 errors (like invalid refresh token)
    if (error.response?.status === 401 && !originalRequest._retry) {
      store.dispatch(clearAuth());
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
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