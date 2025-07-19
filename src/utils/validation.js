import * as yup from 'yup';

// Student validation schema
export const studentValidationSchema = yup.object({
  name: yup.object({
    firstName: yup
      .string()
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name cannot exceed 50 characters')
      .required('First name is required'),
    lastName: yup
      .string()
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name cannot exceed 50 characters')
      .required('Last name is required'),
  }),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .nullable(),
  dateOfBirth: yup
    .date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .required('Date of birth is required'),
  gender: yup
    .string()
    .oneOf(['Male', 'Female', 'Other'], 'Please select a valid gender')
    .required('Gender is required'),
  standard: yup
    .string()
    .oneOf(['KG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'])
    .required('Standard is required'),
  section: yup
    .string()
    .oneOf(['A', 'B', 'C', 'D'], 'Section must be A, B, C, or D')
    .required('Section is required'),
  rollNumber: yup
    .number()
    .positive('Roll number must be positive')
    .integer('Roll number must be an integer')
    .required('Roll number is required'),
  contactInfo: yup.object({
    address: yup.object({
      street: yup.string().required('Street address is required'),
      city: yup.string().required('City is required'),
      state: yup.string().required('State is required'),
      pinCode: yup
        .string()
        .matches(/^[0-9]{6}$/, 'PIN code must be 6 digits')
        .required('PIN code is required'),
    }),
    emergencyContact: yup.object({
      name: yup.string().required('Emergency contact name is required'),
      relationship: yup
        .string()
        .oneOf(['Father', 'Mother', 'Guardian', 'Sibling', 'Other'])
        .required('Relationship is required'),
      phone: yup
        .string()
        .required('Emergency contact phone is required')
        .test('phone-validation', function(value) {
          if (!value) return true;
          if (!/^[0-9]+$/.test(value)) {
            return this.createError({ message: 'Phone number must contain only digits' });
          }
          if (value.length < 10) {
            return this.createError({ message: 'Phone number must be at least 10 digits' });
          }
          if (value.length > 10) {
            return this.createError({ message: 'Phone number cannot exceed 10 digits' });
          }
          return true;
        }),
    }),
  }),
  parentInfo: yup.object({
    father: yup.object({
      name: yup.string().required('Father name is required'),
      phone: yup
        .string()
        .required('Father phone is required')
        .test('phone-validation', function(value) {
          if (!value) return true;
          if (!/^[0-9]+$/.test(value)) {
            return this.createError({ message: 'Phone number must contain only digits' });
          }
          if (value.length < 10) {
            return this.createError({ message: 'Phone number must be at least 10 digits' });
          }
          if (value.length > 10) {
            return this.createError({ message: 'Phone number cannot exceed 10 digits' });
          }
          return true;
        }),
      email: yup.string().email('Please enter a valid email').nullable(),
    }),
    mother: yup.object({
      name: yup.string().required('Mother name is required'),
      phone: yup
        .string()
        .required('Mother phone is required')
        .test('phone-validation', function(value) {
          if (!value) return true;
          if (!/^[0-9]+$/.test(value)) {
            return this.createError({ message: 'Phone number must contain only digits' });
          }
          if (value.length < 10) {
            return this.createError({ message: 'Phone number must be at least 10 digits' });
          }
          if (value.length > 10) {
            return this.createError({ message: 'Phone number cannot exceed 10 digits' });
          }
          return true;
        }),
      email: yup.string().email('Please enter a valid email').nullable(),
    }),
  }),
  bloodGroup: yup
    .string()
    .oneOf(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .nullable(),
});

// Staff validation schema
export const staffValidationSchema = yup.object({
  name: yup.object({
    firstName: yup
      .string()
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name cannot exceed 50 characters')
      .required('First name is required'),
    lastName: yup
      .string()
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name cannot exceed 50 characters')
      .required('Last name is required'),
  }),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  phone: yup
    .string()
    .required('Phone number is required')
    .test('phone-validation', function(value) {
      if (!value) return true; // Let required handle empty values
      if (!/^[0-9]+$/.test(value)) {
        return this.createError({ message: 'Phone number must contain only digits' });
      }
      if (value.length < 10) {
        return this.createError({ message: 'Phone number must be at least 10 digits' });
      }
      if (value.length > 10) {
        return this.createError({ message: 'Phone number cannot exceed 10 digits' });
      }
      return true;
    }),
  department: yup
    .string()
    .oneOf(['Administration', 'Academics', 'Sports', 'Arts', 'Science'])
    .required('Department is required'),
  permissions: yup.object({
    students: yup.object({
      create: yup.boolean().required(),
      read: yup.boolean().required(),
      update: yup.boolean().required(),
      delete: yup.boolean().required()
    }).required(),
    staff: yup.object({
      create: yup.boolean().required(),
      read: yup.boolean().required(),
      update: yup.boolean().required(),
      delete: yup.boolean().required()
    }).required()
  }).required(),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

// Login validation schema
export const loginValidationSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});