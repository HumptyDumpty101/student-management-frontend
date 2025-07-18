import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import studentReducer from './slices/studentSlice';
import staffReducer from './slices/staffSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    students: studentReducer,
    staff: staffReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

