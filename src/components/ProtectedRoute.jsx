import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, requiredPermission = null, requiredRole = null }) => {
  const { user, isAuthenticated } = useSelector(state => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredPermission && user?.role !== 'superAdmin') {
    const [module, action] = requiredPermission.split('.');
    const hasPermission = user?.permissions?.[module]?.[action];
    if (!hasPermission) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;