import { useSelector } from 'react-redux';

export const usePermissions = () => {
  const { user } = useSelector(state => state.auth);

  const checkPermission = (module, action) => {
    if (!user) return false;
    if (user.role === 'superAdmin') return true;
    return user.permissions?.[module]?.[action] || false;
  };

  const permissions = {
    students: {
      create: checkPermission('students', 'create'),
      read: checkPermission('students', 'read'),
      update: checkPermission('students', 'update'),
      delete: checkPermission('students', 'delete'),
    },
    staff: {
      create: checkPermission('staff', 'create'),
      read: checkPermission('staff', 'read'),
      update: checkPermission('staff', 'update'),
      delete: checkPermission('staff', 'delete'),
    }
  };

  return {
    permissions,
    checkPermission,
    isSuperAdmin: user?.role === 'superAdmin',
    isStaff: user?.role === 'staff'
  };
};