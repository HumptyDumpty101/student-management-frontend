import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../utils/apiClient';

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/api/v1/auth/login', credentials);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed'
      );
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refresh',
  async (refreshToken, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/api/v1/auth/refresh', {
        refreshToken
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Token refresh failed'
      );
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/api/v1/auth/me');
      return response.data.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get user data'
      );
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (refreshToken, { rejectWithValue }) => {
    try {
      await apiClient.post('/api/v1/auth/logout', { refreshToken });
      return true;
    } catch (error) {
      return true;
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/api/v1/auth/change-password', passwordData);
      return response.data.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Password change failed'
      );
    }
  }
);

const initialState = {
  user: null,
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: !!localStorage.getItem('refreshToken'),
  loading: false,
  error: null,
  isInitialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
    clearAuth: (state) => {
      state.user = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('refreshToken');
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Refresh Token
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.refreshToken = action.payload.refreshToken;
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(refreshToken.rejected, (state) => {
        state.user = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        localStorage.removeItem('refreshToken');
      })
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isInitialized = true;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
        localStorage.removeItem('refreshToken');
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        localStorage.removeItem('refreshToken');
      })
      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        localStorage.removeItem('refreshToken');
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setInitialized, clearAuth } = authSlice.actions;
export default authSlice.reducer;