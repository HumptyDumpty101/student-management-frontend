import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { store } from './store';
import { getCurrentUser } from './store/slices/authSlice';
import { tokenStorage } from './utils/tokenStorage';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import StaffPage from './pages/StaffPage';
import ProfilePage from './pages/ProfilePage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import GlobalSnackbar from './components/GlobalSnackbar';
import LoadingScreen from './components/LoadingScreen';

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
      const refreshToken = tokenStorage.getRefreshToken();
      const storedUser = tokenStorage.getUser();

      if (refreshToken && storedUser) {
        try {
          await dispatch(getCurrentUser()).unwrap();
        } catch (error) {
          tokenStorage.clear();
        }
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
          path="students/*"
          element={
            <ProtectedRoute requiredPermission="students.read">
              <StudentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="staff/*"
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
              <GlobalSnackbar />
            </AppInitializer>
          </Router>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;