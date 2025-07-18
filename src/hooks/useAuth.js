import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { user, isAuthenticated, loading } = useSelector(state => state.auth);

  const hasPermission = (module, action) => {
    if (!user) return false;
    if (user.role === 'superAdmin') return true;
    return user.permissions?.[module]?.[action] || false;
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const isSuperAdmin = () => {
    return user?.role === 'superAdmin';
  };

  const isStaff = () => {
    return user?.role === 'staff';
  };

  return {
    user,
    isAuthenticated,
    loading,
    hasPermission,
    hasRole,
    isSuperAdmin,
    isStaff
  };
};
