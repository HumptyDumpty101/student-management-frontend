import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  Box,
  Typography,
  Divider,
  FormControlLabel,
  Checkbox,
  FormGroup
} from '@mui/material';
import { useFormValidation } from '../../hooks/useFormValidation';
import { staffValidationSchema } from '../../utils/validation';
import { StyledTextField } from '../common';

const StaffForm = ({ open, onClose, onSubmit, staff = null, loading = false }) => {
  const isEdit = Boolean(staff);
  
  const initialValues = {
    name: {
      firstName: staff?.name?.firstName || '',
      lastName: staff?.name?.lastName || ''
    },
    email: staff?.email || '',
    phone: staff?.phone || '',
    department: staff?.department || '',
    position: staff?.position || '',
    permissions: {
      students: {
        create: staff?.permissions?.students?.create || false,
        read: staff?.permissions?.students?.read || false,
        update: staff?.permissions?.students?.update || false,
        delete: staff?.permissions?.students?.delete || false
      },
      staff: {
        create: staff?.permissions?.staff?.create || false,
        read: staff?.permissions?.staff?.read || false,
        update: staff?.permissions?.staff?.update || false,
        delete: staff?.permissions?.staff?.delete || false
      }
    },
    password: '',
    confirmPassword: ''
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit
  } = useFormValidation(staffValidationSchema, initialValues);

  const handleFormSubmit = async () => {
    await handleSubmit(async (formData) => {
      const { confirmPassword, ...dataToSubmit } = formData;
      await onSubmit(dataToSubmit);
      onClose();
    });
  };

  const departments = ['Administration', 'Academics', 'Sports', 'Arts', 'Science', 'Mathematics', 'Languages', 'Social Studies'];
  const positions = ['Principal', 'Vice Principal', 'Head Teacher', 'Teacher', 'Assistant Teacher', 'Admin Staff', 'Sports Coach', 'Librarian'];

  const handlePermissionChange = (module, action, checked) => {
    handleChange(`permissions.${module}.${action}`, checked);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        {isEdit ? 'Edit Staff Member' : 'Add New Staff Member'}
      </DialogTitle>
      <DialogContent sx={{ pb: 2 }}>
        <Box sx={{ maxHeight: '70vh', overflowY: 'auto', pr: 1 }}>
          <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <StyledTextField
              fullWidth
              label="First Name"
              value={values.name.firstName}
              onChange={(e) => handleChange('name.firstName', e.target.value)}
              onBlur={() => handleBlur('name.firstName')}
              error={touched['name.firstName'] && !!errors['name.firstName']}
              helperText={touched['name.firstName'] && errors['name.firstName']}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <StyledTextField
              fullWidth
              label="Last Name"
              value={values.name.lastName}
              onChange={(e) => handleChange('name.lastName', e.target.value)}
              onBlur={() => handleBlur('name.lastName')}
              error={touched['name.lastName'] && !!errors['name.lastName']}
              helperText={touched['name.lastName'] && errors['name.lastName']}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <StyledTextField
              fullWidth
              label="Email"
              type="email"
              value={values.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              error={touched.email && !!errors.email}
              helperText={touched.email && errors.email}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <StyledTextField
              fullWidth
              label="Phone"
              value={values.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              onBlur={() => handleBlur('phone')}
              error={touched.phone && !!errors.phone}
              helperText={touched.phone && errors.phone}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <StyledTextField
              select
              fullWidth
              label="Department"
              value={values.department}
              onChange={(e) => handleChange('department', e.target.value)}
              onBlur={() => handleBlur('department')}
              error={touched.department && !!errors.department}
              helperText={touched.department && errors.department}
              required
            >
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </StyledTextField>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <StyledTextField
              select
              fullWidth
              label="Position"
              value={values.position}
              onChange={(e) => handleChange('position', e.target.value)}
              onBlur={() => handleBlur('position')}
              error={touched.position && !!errors.position}
              helperText={touched.position && errors.position}
              required
            >
              {positions.map((pos) => (
                <MenuItem key={pos} value={pos}>
                  {pos}
                </MenuItem>
              ))}
            </StyledTextField>
          </Grid>

          {/* Password Fields (only for new staff) */}
          {!isEdit && (
            <>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={values.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  error={touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  value={values.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  onBlur={() => handleBlur('confirmPassword')}
                  error={touched.confirmPassword && !!errors.confirmPassword}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                  required
                />
              </Grid>
            </>
          )}

          {/* Permissions */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Permissions
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>
              Student Management
            </Typography>
            <FormGroup sx={{ pl: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.permissions.students.create}
                    onChange={(e) => handlePermissionChange('students', 'create', e.target.checked)}
                  />
                }
                label="Create Students"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.permissions.students.read}
                    onChange={(e) => handlePermissionChange('students', 'read', e.target.checked)}
                  />
                }
                label="View Students"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.permissions.students.update}
                    onChange={(e) => handlePermissionChange('students', 'update', e.target.checked)}
                  />
                }
                label="Update Students"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.permissions.students.delete}
                    onChange={(e) => handlePermissionChange('students', 'delete', e.target.checked)}
                  />
                }
                label="Delete Students"
              />
            </FormGroup>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>
              Staff Management
            </Typography>
            <FormGroup sx={{ pl: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.permissions.staff.create}
                    onChange={(e) => handlePermissionChange('staff', 'create', e.target.checked)}
                  />
                }
                label="Create Staff"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.permissions.staff.read}
                    onChange={(e) => handlePermissionChange('staff', 'read', e.target.checked)}
                  />
                }
                label="View Staff"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.permissions.staff.update}
                    onChange={(e) => handlePermissionChange('staff', 'update', e.target.checked)}
                  />
                }
                label="Update Staff"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.permissions.staff.delete}
                    onChange={(e) => handlePermissionChange('staff', 'delete', e.target.checked)}
                  />
                }
                label="Delete Staff"
              />
            </FormGroup>
          </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting} size="large">
          Cancel
        </Button>
        <Button
          onClick={handleFormSubmit}
          variant="contained"
          disabled={isSubmitting}
          size="large"
        >
          {isSubmitting ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StaffForm;