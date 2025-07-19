import React, { useState, useCallback } from 'react';
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
  FormGroup,
  Card,
  CardContent,
  Paper,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  Collapse
} from '@mui/material';
import { useFormValidation } from '../../hooks/useFormValidation';
import { staffValidationSchema } from '../../utils/validation';
import { StyledTextField } from '../common';

const StaffForm = ({ open, onClose, onSubmit, staff = null, loading = false }) => {
  const isEdit = Boolean(staff);
  const [submissionError, setSubmissionError] = useState(null);
  const [showErrors, setShowErrors] = useState(false);
  
  const initialValues = {
    name: {
      firstName: staff?.name?.firstName || '',
      lastName: staff?.name?.lastName || ''
    },
    email: staff?.email || '',
    phone: staff?.phone || '',
    department: staff?.department || '',
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
    handleSubmit,
    getNestedValue,
    validateForm,
    setIsSubmitting
  } = useFormValidation(staffValidationSchema, initialValues);

  const handleFormSubmit = useCallback(async () => {
    setSubmissionError(null);
    setShowErrors(false);
    
    // Step 1: Validate form
    const isValid = await validateForm();
    
    if (!isValid) {
      setShowErrors(true);
      return;
    }
    
    // Step 2: Submit to server
    try {
      setIsSubmitting(true);
      
      // Clean up the form data before submission
      const { confirmPassword, ...cleanedData } = values;
      
      // Wait for server response
      await onSubmit(cleanedData);
      
      // Only close if we get here (success)
      onClose();
    } catch (error) {
      // Show error and keep modal open
      setSubmissionError(error.message || error || 'Failed to save staff member. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, values, onSubmit, onClose]);

  const departments = ['Administration', 'Academics', 'Sports', 'Arts', 'Science'];

  const handlePermissionChange = (module, action, checked) => {
    handleChange(`permissions.${module}.${action}`, checked);
  };

  const getFieldLabel = (fieldPath) => {
    const fieldMapping = {
      'name.firstName': 'First Name',
      'name.lastName': 'Last Name',
      'email': 'Email',
      'phone': 'Phone',
      'department': 'Department',
      'password': 'Password',
      'confirmPassword': 'Confirm Password'
    };
    return fieldMapping[fieldPath] || fieldPath.split('.').pop();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      fullScreen={{ xs: true, sm: false }}
      sx={{
        '& .MuiDialog-paper': {
          maxHeight: { xs: '100vh', sm: '90vh' },
          margin: { xs: 0, sm: 2 },
          width: { xs: '100%', sm: 'calc(100% - 32px)' }
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 2,
        fontSize: { xs: '1.25rem', sm: '1.5rem' },
        fontWeight: 600
      }}>
        {isEdit ? 'Edit Staff Member' : 'Add New Staff Member'}
      </DialogTitle>
      <DialogContent sx={{ 
        pb: 2,
        px: { xs: 1, sm: 3 },
        maxHeight: { xs: 'calc(100vh - 140px)', sm: '75vh' },
        overflowY: 'auto'
      }}>
        <Box sx={{ 
          pr: { xs: 0, sm: 1 }
        }}>
          <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mt: 1 }}>
            {/* Basic Information Section */}
            <Grid item xs={12}>
              <Card elevation={2} sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 3, fontWeight: 600 }}>
                    Basic Information
                  </Typography>
                  <Grid container spacing={{ xs: 2, sm: 3 }}>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="First Name"
                        value={getNestedValue('name.firstName') || ''}
                        onChange={(e) => handleChange('name.firstName', e.target.value)}
                        onBlur={() => handleBlur('name.firstName')}
                        error={(touched['name.firstName'] || showErrors) && !!errors['name.firstName']}
                        helperText={(touched['name.firstName'] || showErrors) && errors['name.firstName']}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="Last Name"
                        value={getNestedValue('name.lastName') || ''}
                        onChange={(e) => handleChange('name.lastName', e.target.value)}
                        onBlur={() => handleBlur('name.lastName')}
                        error={(touched['name.lastName'] || showErrors) && !!errors['name.lastName']}
                        helperText={(touched['name.lastName'] || showErrors) && errors['name.lastName']}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={getNestedValue('email') || ''}
                        onChange={(e) => handleChange('email', e.target.value)}
                        onBlur={() => handleBlur('email')}
                        error={(touched.email || showErrors) && !!errors.email}
                        helperText={(touched.email || showErrors) && errors.email}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="Phone"
                        value={getNestedValue('phone') || ''}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        onBlur={() => handleBlur('phone')}
                        error={(touched.phone || showErrors) && !!errors.phone}
                        helperText={(touched.phone || showErrors) && errors.phone}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        select
                        fullWidth
                        label="Department"
                        value={getNestedValue('department') || ''}
                        onChange={(e) => handleChange('department', e.target.value)}
                        onBlur={() => handleBlur('department')}
                        error={(touched.department || showErrors) && !!errors.department}
                        helperText={(touched.department || showErrors) && errors.department}
                        required
                      >
                        {departments.map((dept) => (
                          <MenuItem key={dept} value={dept}>
                            {dept}
                          </MenuItem>
                        ))}
                      </StyledTextField>
                    </Grid>
                    
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Password Section (only for new staff) */}
            {!isEdit && (
              <Grid item xs={12}>
                <Card elevation={2} sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 3, fontWeight: 600 }}>
                      Account Security
                    </Typography>
                    <Grid container spacing={{ xs: 2, sm: 3 }}>
                      <Grid item xs={12} sm={6}>
                        <StyledTextField
                          fullWidth
                          label="Password"
                          type="password"
                          value={getNestedValue('password') || ''}
                          onChange={(e) => handleChange('password', e.target.value)}
                          onBlur={() => handleBlur('password')}
                          error={(touched.password || showErrors) && !!errors.password}
                          helperText={(touched.password || showErrors) && errors.password}
                          required
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <StyledTextField
                          fullWidth
                          label="Confirm Password"
                          type="password"
                          value={getNestedValue('confirmPassword') || ''}
                          onChange={(e) => handleChange('confirmPassword', e.target.value)}
                          onBlur={() => handleBlur('confirmPassword')}
                          error={(touched.confirmPassword || showErrors) && !!errors.confirmPassword}
                          helperText={(touched.confirmPassword || showErrors) && errors.confirmPassword}
                          required
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Permissions Section */}
            <Grid item xs={12}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 3, fontWeight: 600 }}>
                    System Permissions
                  </Typography>
                  <Grid container spacing={{ xs: 2, sm: 4 }}>
                    <Grid item xs={12} sm={6}>
                      <Paper elevation={1} sx={{ p: 3, backgroundColor: 'primary.50' }}>
                        <Typography variant="subtitle1" gutterBottom color="primary" sx={{ fontWeight: 500, mb: 2 }}>
                          Student Management
                        </Typography>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={getNestedValue('permissions.students.create') || false}
                                onChange={(e) => handlePermissionChange('students', 'create', e.target.checked)}
                                color="primary"
                              />
                            }
                            label="Create Students"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={getNestedValue('permissions.students.read') || false}
                                onChange={(e) => handlePermissionChange('students', 'read', e.target.checked)}
                                color="primary"
                              />
                            }
                            label="View Students"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={getNestedValue('permissions.students.update') || false}
                                onChange={(e) => handlePermissionChange('students', 'update', e.target.checked)}
                                color="primary"
                              />
                            }
                            label="Update Students"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={getNestedValue('permissions.students.delete') || false}
                                onChange={(e) => handlePermissionChange('students', 'delete', e.target.checked)}
                                color="primary"
                              />
                            }
                            label="Delete Students"
                          />
                        </FormGroup>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Paper elevation={1} sx={{ p: 3, backgroundColor: 'secondary.50' }}>
                        <Typography variant="subtitle1" gutterBottom color="secondary" sx={{ fontWeight: 500, mb: 2 }}>
                          Staff Management
                        </Typography>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={getNestedValue('permissions.staff.create') || false}
                                onChange={(e) => handlePermissionChange('staff', 'create', e.target.checked)}
                                color="secondary"
                              />
                            }
                            label="Create Staff"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={getNestedValue('permissions.staff.read') || false}
                                onChange={(e) => handlePermissionChange('staff', 'read', e.target.checked)}
                                color="secondary"
                              />
                            }
                            label="View Staff"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={getNestedValue('permissions.staff.update') || false}
                                onChange={(e) => handlePermissionChange('staff', 'update', e.target.checked)}
                                color="secondary"
                              />
                            }
                            label="Update Staff"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={getNestedValue('permissions.staff.delete') || false}
                                onChange={(e) => handlePermissionChange('staff', 'delete', e.target.checked)}
                                color="secondary"
                              />
                            }
                            label="Delete Staff"
                          />
                        </FormGroup>
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
        
        {/* Error Summary Section */}
        <Collapse in={showErrors && Object.keys(errors).length > 0}>
          <Box sx={{ mt: 3, mb: 2 }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              <AlertTitle>Please fix the following errors:</AlertTitle>
              <List dense>
                {Object.entries(errors).map(([field, error]) => (
                  <ListItem key={field} sx={{ py: 0.5 }}>
                    <ListItemText 
                      primary={`${getFieldLabel(field)}: ${error}`}
                      primaryTypographyProps={{ fontSize: '0.875rem' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Alert>
          </Box>
        </Collapse>
        
        {/* Submission Error Section */}
        <Collapse in={!!submissionError}>
          <Box sx={{ mt: 2, mb: 2 }}>
            <Alert severity="error">
              <AlertTitle>Submission Failed</AlertTitle>
              {submissionError}
            </Alert>
          </Box>
        </Collapse>
      </DialogContent>
      <DialogActions sx={{ 
        px: { xs: 2, sm: 3 }, 
        py: 2,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 1, sm: 0 }
      }}>
        <Button 
          onClick={onClose} 
          disabled={isSubmitting} 
          size="large"
          fullWidth={{ xs: true, sm: false }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleFormSubmit}
          variant="contained"
          disabled={isSubmitting}
          size="large"
          fullWidth={{ xs: true, sm: false }}
        >
          {isSubmitting ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StaffForm;