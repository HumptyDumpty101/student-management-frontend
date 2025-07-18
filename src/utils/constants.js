export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const ROLES = {
  SUPER_ADMIN: 'superAdmin',
  STAFF: 'staff'
};

export const PERMISSIONS = {
  STUDENTS: {
    CREATE: 'students.create',
    READ: 'students.read',
    UPDATE: 'students.update',
    DELETE: 'students.delete'
  },
  STAFF: {
    CREATE: 'staff.create',
    READ: 'staff.read',
    UPDATE: 'staff.update',
    DELETE: 'staff.delete'
  }
};

export const STANDARDS = ['KG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];

export const SECTIONS = ['A', 'B', 'C', 'D'];

export const GENDERS = ['Male', 'Female', 'Other'];

export const GRADES = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'];

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const DEPARTMENTS = ['Administration', 'Academics', 'Sports', 'Arts', 'Science'];

export const RELATIONSHIPS = ['Father', 'Mother', 'Guardian', 'Sibling', 'Other'];

export const PAGINATION_LIMITS = [10, 25, 50, 100];

export const SORT_ORDERS = {
  ASC: 'asc',
  DESC: 'desc'
};

export const DIALOG_TYPES = {
  ADD_STUDENT: 'addStudent',
  EDIT_STUDENT: 'editStudent',
  STUDENT_DETAILS: 'studentDetails',
  ADD_STAFF: 'addStaff',
  EDIT_STAFF: 'editStaff',
  STAFF_DETAILS: 'staffDetails',
  PERMISSIONS: 'permissions',
  CONFIRM_DELETE: 'confirmDelete'
};

export const SNACKBAR_SEVERITY = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};