// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { store } from './store';
import { getCurrentUser, setInitialized, clearAuth, refreshToken } from './store/slices/authSlice';
import { createStudent } from './store/slices/studentSlice';
import { createStaff } from './store/slices/staffSlice';
import { showSnackbar, closeDialog } from './store/slices/uiSlice';
import { tokenStorage } from './utils/tokenStorage';

// Layout
import { Layout } from './components/layout';

// Pages
import LoginPage from './pages/auth/LoginPage';
import UnauthorizedPage from './pages/auth/UnauthorizedPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import { StudentsPage } from './pages/students';
import { StaffPage } from './pages/staff';
import ProfilePage from './pages/profile/ProfilePage';

// Components
import { ProtectedRoute, ErrorBoundary, GlobalSnackbar, LoadingScreen } from './components/common';
import StudentForm from './components/students/StudentForm';
import StaffForm from './components/staff/StaffForm';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: { default: '#f5f5f5' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
  },
});

// App initialization component
const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, isInitialized, user } = useSelector(state => state.auth);

  useEffect(() => {
    const initializeApp = async () => {
      const accessToken = tokenStorage.getAccessToken();
      const storedRefreshToken = tokenStorage.getRefreshToken();
      const storedUser = tokenStorage.getUser();

      if (accessToken && storedRefreshToken) {
        try {
          // If we have both tokens, try to get current user data
          await dispatch(getCurrentUser()).unwrap();
        } catch (error) {
          // If getting current user fails, clear stored data and mark as initialized
          console.warn('Failed to get current user on initialization:', error);
          dispatch(clearAuth());
          tokenStorage.clear();
        }
      } else if (storedRefreshToken && !accessToken) {
        // We have refresh token but no access token, try to refresh
        try {
          await dispatch(refreshToken(storedRefreshToken)).unwrap();
          await dispatch(getCurrentUser()).unwrap();
        } catch (error) {
          console.warn('Failed to refresh token on initialization:', error);
          dispatch(clearAuth());
          tokenStorage.clear();
        }
      } else {
        // No stored tokens, mark as initialized
        dispatch(setInitialized());
      }
    };

    if (!isInitialized) {
      initializeApp();
    }
  }, [dispatch, isInitialized]);

  useEffect(() => {
    if (user) {
      tokenStorage.setUser(user);
    } else {
      tokenStorage.setUser(null);
    }
  }, [user]);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return children;
};

// Main App Routes
const AppRoutes = () => {
  const { isAuthenticated } = useSelector(state => state.auth);

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
        }
      />
      
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route
          path="students"
          element={
            <ProtectedRoute requiredPermission="students.read">
              <StudentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="staff"
          element={
            <ProtectedRoute requiredRole="superAdmin">
              <StaffPage />
            </ProtectedRoute>
          }
        />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

// Modal Components
const AppModals = () => {
  const dispatch = useDispatch();
  const { dialogs } = useSelector(state => state.ui);

  const handleStudentSubmit = async (studentData) => {
    console.log('App.jsx: handleStudentSubmit called with data:', studentData);
    try {
      console.log('App.jsx: Dispatching createStudent action');
      await dispatch(createStudent(studentData)).unwrap();
      console.log('App.jsx: Student created successfully');
      dispatch(showSnackbar({ message: 'Student created successfully', severity: 'success' }));
      dispatch(closeDialog('addStudent'));
    } catch (error) {
      console.error('App.jsx: Error creating student:', error);
      dispatch(showSnackbar({ message: error || 'Failed to create student', severity: 'error' }));
    }
  };

  const handleStaffSubmit = async (staffData) => {
    try {
      await dispatch(createStaff(staffData)).unwrap();
      dispatch(showSnackbar({ message: 'Staff member created successfully', severity: 'success' }));
      dispatch(closeDialog('addStaff'));
    } catch (error) {
      dispatch(showSnackbar({ message: error || 'Failed to create staff member', severity: 'error' }));
    }
  };

  return (
    <>
      <StudentForm
        open={dialogs.addStudent}
        onClose={() => dispatch(closeDialog('addStudent'))}
        onSubmit={handleStudentSubmit}
      />
      <StaffForm
        open={dialogs.addStaff}
        onClose={() => dispatch(closeDialog('addStaff'))}
        onSubmit={handleStaffSubmit}
      />
    </>
  );
};

// Main App Component
const App = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <AppInitializer>
              <AppRoutes />
              <AppModals />
              <GlobalSnackbar />
            </AppInitializer>
          </Router>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;