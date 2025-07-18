import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LoadingScreen } from './index';

const ProtectedRoute = ({ children, requiredPermission = null, requiredRole = null }) => {
  const { user, isAuthenticated, isInitialized, loading } = useSelector(state => state.auth);

  // Show loading screen while authentication is being initialized or user data is being fetched
  if (!isInitialized || loading) {
    return <LoadingScreen />;
  }

  // After initialization, check authentication status
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user object exists (should be loaded after successful authentication)
  if (!user) {
    return <LoadingScreen />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredPermission) {
    // Super admin has all permissions
    if (user?.role === 'superAdmin') {
      return children;
    }
    
    // Check specific permission for other roles
    const [module, action] = requiredPermission.split('.');
    const hasPermission = user?.permissions?.[module]?.[action];
    if (!hasPermission) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;