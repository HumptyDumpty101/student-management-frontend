import React, { useState, useEffect, useCallback } from 'react';
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
import { studentValidationSchema } from '../../utils/validation';
import { StyledTextField } from '../common';

const StudentForm = ({ open, onClose, onSubmit, student = null, loading = false }) => {
  const isEdit = Boolean(student);
  const [submissionError, setSubmissionError] = useState(null);
  const [showErrors, setShowErrors] = useState(false);
  
  const initialValues = {
    name: {
      firstName: student?.name?.firstName || '',
      lastName: student?.name?.lastName || ''
    },
    email: student?.email || '',
    dateOfBirth: student?.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : '',
    gender: student?.gender || '',
    standard: student?.standard || '',
    section: student?.section || '',
    rollNumber: student?.rollNumber || '',
    overallGrade: student?.overallGrade || 'C',
    overallPercentage: student?.overallPercentage || 0,
    contactInfo: {
      address: {
        street: student?.contactInfo?.address?.street || '',
        city: student?.contactInfo?.address?.city || '',
        state: student?.contactInfo?.address?.state || '',
        pinCode: student?.contactInfo?.address?.pinCode || ''
      },
      emergencyContact: {
        name: student?.contactInfo?.emergencyContact?.name || '',
        relationship: student?.contactInfo?.emergencyContact?.relationship || '',
        phone: student?.contactInfo?.emergencyContact?.phone || ''
      }
    },
    parentInfo: {
      father: {
        name: student?.parentInfo?.father?.name || '',
        occupation: student?.parentInfo?.father?.occupation || '',
        phone: student?.parentInfo?.father?.phone || '',
        email: student?.parentInfo?.father?.email || ''
      },
      mother: {
        name: student?.parentInfo?.mother?.name || '',
        occupation: student?.parentInfo?.mother?.occupation || '',
        phone: student?.parentInfo?.mother?.phone || '',
        email: student?.parentInfo?.mother?.email || ''
      }
    },
    bloodGroup: student?.bloodGroup || ''
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
    setValues,
    validateForm,
    setIsSubmitting
  } = useFormValidation(studentValidationSchema, initialValues);

  // Update form values when student prop changes (for edit mode)
  useEffect(() => {
    if (student && open) {
      const updatedValues = {
        name: {
          firstName: student.name?.firstName || '',
          lastName: student.name?.lastName || ''
        },
        email: student.email || '',
        dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : '',
        gender: student.gender || '',
        standard: student.standard || '',
        section: student.section || '',
        rollNumber: student.rollNumber || '',
        overallGrade: student.overallGrade || 'C',
        overallPercentage: student.overallPercentage || 0,
        contactInfo: {
          address: {
            street: student.contactInfo?.address?.street || '',
            city: student.contactInfo?.address?.city || '',
            state: student.contactInfo?.address?.state || '',
            pinCode: student.contactInfo?.address?.pinCode || ''
          },
          emergencyContact: {
            name: student.contactInfo?.emergencyContact?.name || '',
            relationship: student.contactInfo?.emergencyContact?.relationship || '',
            phone: student.contactInfo?.emergencyContact?.phone || ''
          }
        },
        parentInfo: {
          father: {
            name: student.parentInfo?.father?.name || '',
            occupation: student.parentInfo?.father?.occupation || '',
            phone: student.parentInfo?.father?.phone || '',
            email: student.parentInfo?.father?.email || ''
          },
          mother: {
            name: student.parentInfo?.mother?.name || '',
            occupation: student.parentInfo?.mother?.occupation || '',
            phone: student.parentInfo?.mother?.phone || '',
            email: student.parentInfo?.mother?.email || ''
          }
        },
        bloodGroup: student.bloodGroup || ''
      };
      setValues(updatedValues);
    }
  }, [student, open, setValues]);

  const handleFormSubmit = useCallback(async () => {
    console.log('StudentForm: Create button clicked');
    setSubmissionError(null);
    setShowErrors(false);
    
    // Step 1: Validate form
    const isValid = await validateForm();
    console.log('StudentForm: Validation result:', isValid);
    
    if (!isValid) {
      setShowErrors(true);
      return;
    }
    
    // Step 2: Submit to server
    try {
      setIsSubmitting(true);
      console.log('StudentForm: Processing form data:', values);
      
      // Clean up the form data before submission
      const cleanedData = {
        ...values,
        // Remove empty string fields that should be null/undefined
        email: values.email || undefined,
        bloodGroup: values.bloodGroup || undefined,
        parentInfo: {
          ...values.parentInfo,
          father: {
            ...values.parentInfo.father,
            email: values.parentInfo.father.email || undefined,
            occupation: values.parentInfo.father.occupation || undefined,
          },
          mother: {
            ...values.parentInfo.mother,
            email: values.parentInfo.mother.email || undefined,
            occupation: values.parentInfo.mother.occupation || undefined,
          }
        }
      };
      
      console.log('StudentForm: Cleaned data for submission:', cleanedData);
      
      // Wait for server response
      await onSubmit(cleanedData);
      
      // Only close if we get here (success)
      console.log('StudentForm: Submission successful, closing dialog');
      onClose();
    } catch (error) {
      console.error('StudentForm: Submission error:', error);
      // Show error and keep modal open
      setSubmissionError(error.message || error || 'Failed to save student. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, values, onSubmit, onClose]);

  const standards = ['KG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];
  const sections = ['A', 'B', 'C', 'D'];
  const genders = ['Male', 'Female', 'Other'];
  const relationships = ['Father', 'Mother', 'Guardian', 'Sibling', 'Other'];
  const grades = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'];
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const getFieldLabel = (fieldPath) => {
    const fieldMapping = {
      'name.firstName': 'First Name',
      'name.lastName': 'Last Name',
      'email': 'Email',
      'dateOfBirth': 'Date of Birth',
      'gender': 'Gender',
      'standard': 'Standard',
      'section': 'Section',
      'rollNumber': 'Roll Number',
      'contactInfo.address.street': 'Street Address',
      'contactInfo.address.city': 'City',
      'contactInfo.address.state': 'State',
      'contactInfo.address.pinCode': 'Pin Code',
      'contactInfo.emergencyContact.name': 'Emergency Contact Name',
      'contactInfo.emergencyContact.relationship': 'Emergency Contact Relationship',
      'contactInfo.emergencyContact.phone': 'Emergency Contact Phone',
      'parentInfo.father.name': "Father's Name",
      'parentInfo.father.phone': "Father's Phone",
      'parentInfo.father.email': "Father's Email",
      'parentInfo.mother.name': "Mother's Name",
      'parentInfo.mother.phone': "Mother's Phone",
      'parentInfo.mother.email': "Mother's Email"
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
        {isEdit ? 'Edit Student' : 'Add New Student'}
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
                        error={touched['name.firstName'] && !!errors['name.firstName']}
                        helperText={touched['name.firstName'] && errors['name.firstName']}
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
                        value={getNestedValue('email') || ''}
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
                        label="Date of Birth"
                        type="date"
                        value={getNestedValue('dateOfBirth') || ''}
                        onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                        onBlur={() => handleBlur('dateOfBirth')}
                        error={touched.dateOfBirth && !!errors.dateOfBirth}
                        helperText={touched.dateOfBirth && errors.dateOfBirth}
                        InputLabelProps={{ shrink: true }}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        select
                        fullWidth
                        label="Gender"
                        value={getNestedValue('gender') || ''}
                        onChange={(e) => handleChange('gender', e.target.value)}
                        onBlur={() => handleBlur('gender')}
                        error={touched.gender && !!errors.gender}
                        helperText={touched.gender && errors.gender}
                        required
                      >
                        {genders.map((gender) => (
                          <MenuItem key={gender} value={gender}>
                            {gender}
                          </MenuItem>
                        ))}
                      </StyledTextField>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        select
                        fullWidth
                        label="Blood Group"
                        value={getNestedValue('bloodGroup') || ''}
                        onChange={(e) => handleChange('bloodGroup', e.target.value)}
                      >
                        {bloodGroups.map((group) => (
                          <MenuItem key={group} value={group}>
                            {group}
                          </MenuItem>
                        ))}
                      </StyledTextField>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Academic Information Section */}
            <Grid item xs={12}>
              <Card elevation={2} sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 3, fontWeight: 600 }}>
                    Academic Information
                  </Typography>
                  <Grid container spacing={{ xs: 2, sm: 3 }}>
                    <Grid item xs={12} sm={4}>
                      <StyledTextField
                        select
                        fullWidth
                        label="Standard"
                        value={getNestedValue('standard') || ''}
                        onChange={(e) => handleChange('standard', e.target.value)}
                        onBlur={() => handleBlur('standard')}
                        error={touched.standard && !!errors.standard}
                        helperText={touched.standard && errors.standard}
                        required
                      >
                        {standards.map((standard) => (
                          <MenuItem key={standard} value={standard}>
                            {standard}
                          </MenuItem>
                        ))}
                      </StyledTextField>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <StyledTextField
                        select
                        fullWidth
                        label="Section"
                        value={getNestedValue('section') || ''}
                        onChange={(e) => handleChange('section', e.target.value)}
                        onBlur={() => handleBlur('section')}
                        error={touched.section && !!errors.section}
                        helperText={touched.section && errors.section}
                        required
                      >
                        {sections.map((section) => (
                          <MenuItem key={section} value={section}>
                            {section}
                          </MenuItem>
                        ))}
                      </StyledTextField>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <StyledTextField
                        fullWidth
                        label="Roll Number"
                        type="number"
                        value={getNestedValue('rollNumber') || ''}
                        onChange={(e) => handleChange('rollNumber', parseInt(e.target.value) || '')}
                        onBlur={() => handleBlur('rollNumber')}
                        error={touched.rollNumber && !!errors.rollNumber}
                        helperText={touched.rollNumber && errors.rollNumber}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <StyledTextField
                        select
                        fullWidth
                        label="Overall Grade"
                        value={getNestedValue('overallGrade') || ''}
                        onChange={(e) => handleChange('overallGrade', e.target.value)}
                      >
                        {grades.map((grade) => (
                          <MenuItem key={grade} value={grade}>
                            {grade}
                          </MenuItem>
                        ))}
                      </StyledTextField>
                    </Grid>
                    
                    <Grid item xs={12} sm={8}>
                      <StyledTextField
                        fullWidth
                        label="Overall Percentage (%)"
                        type="number"
                        value={getNestedValue('overallPercentage') || ''}
                        onChange={(e) => handleChange('overallPercentage', parseFloat(e.target.value) || 0)}
                        inputProps={{ min: 0, max: 100 }}
                        helperText="Enter percentage between 0 and 100"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Contact Information Section */}
            <Grid item xs={12}>
              <Card elevation={2} sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 3, fontWeight: 600 }}>
                    Contact Information
                  </Typography>
                  <Grid container spacing={{ xs: 2, sm: 3 }}>
                    <Grid item xs={12}>
                      <StyledTextField
                        fullWidth
                        label="Street Address"
                        value={getNestedValue('contactInfo.address.street') || ''}
                        onChange={(e) => handleChange('contactInfo.address.street', e.target.value)}
                        onBlur={() => handleBlur('contactInfo.address.street')}
                        error={touched['contactInfo.address.street'] && !!errors['contactInfo.address.street']}
                        helperText={touched['contactInfo.address.street'] && errors['contactInfo.address.street']}
                        multiline
                        rows={2}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <StyledTextField
                        fullWidth
                        label="City"
                        value={getNestedValue('contactInfo.address.city') || ''}
                        onChange={(e) => handleChange('contactInfo.address.city', e.target.value)}
                        onBlur={() => handleBlur('contactInfo.address.city')}
                        error={touched['contactInfo.address.city'] && !!errors['contactInfo.address.city']}
                        helperText={touched['contactInfo.address.city'] && errors['contactInfo.address.city']}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <StyledTextField
                        fullWidth
                        label="State"
                        value={getNestedValue('contactInfo.address.state') || ''}
                        onChange={(e) => handleChange('contactInfo.address.state', e.target.value)}
                        onBlur={() => handleBlur('contactInfo.address.state')}
                        error={touched['contactInfo.address.state'] && !!errors['contactInfo.address.state']}
                        helperText={touched['contactInfo.address.state'] && errors['contactInfo.address.state']}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <StyledTextField
                        fullWidth
                        label="Pin Code"
                        value={getNestedValue('contactInfo.address.pinCode') || ''}
                        onChange={(e) => handleChange('contactInfo.address.pinCode', e.target.value)}
                        onBlur={() => handleBlur('contactInfo.address.pinCode')}
                        error={touched['contactInfo.address.pinCode'] && !!errors['contactInfo.address.pinCode']}
                        helperText={touched['contactInfo.address.pinCode'] && errors['contactInfo.address.pinCode']}
                        required
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Emergency Contact Section */}
            <Grid item xs={12}>
              <Card elevation={2} sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 3, fontWeight: 600 }}>
                    Emergency Contact
                  </Typography>
                  <Grid container spacing={{ xs: 2, sm: 3 }}>
                    <Grid item xs={12} sm={4}>
                      <StyledTextField
                        fullWidth
                        label="Contact Name"
                        value={getNestedValue('contactInfo.emergencyContact.name') || ''}
                        onChange={(e) => handleChange('contactInfo.emergencyContact.name', e.target.value)}
                        onBlur={() => handleBlur('contactInfo.emergencyContact.name')}
                        error={touched['contactInfo.emergencyContact.name'] && !!errors['contactInfo.emergencyContact.name']}
                        helperText={touched['contactInfo.emergencyContact.name'] && errors['contactInfo.emergencyContact.name']}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <StyledTextField
                        select
                        fullWidth
                        label="Relationship"
                        value={getNestedValue('contactInfo.emergencyContact.relationship') || ''}
                        onChange={(e) => handleChange('contactInfo.emergencyContact.relationship', e.target.value)}
                        onBlur={() => handleBlur('contactInfo.emergencyContact.relationship')}
                        error={touched['contactInfo.emergencyContact.relationship'] && !!errors['contactInfo.emergencyContact.relationship']}
                        helperText={touched['contactInfo.emergencyContact.relationship'] && errors['contactInfo.emergencyContact.relationship']}
                        required
                      >
                        {relationships.map((rel) => (
                          <MenuItem key={rel} value={rel}>
                            {rel}
                          </MenuItem>
                        ))}
                      </StyledTextField>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <StyledTextField
                        fullWidth
                        label="Phone Number"
                        value={getNestedValue('contactInfo.emergencyContact.phone') || ''}
                        onChange={(e) => handleChange('contactInfo.emergencyContact.phone', e.target.value)}
                        onBlur={() => handleBlur('contactInfo.emergencyContact.phone')}
                        error={touched['contactInfo.emergencyContact.phone'] && !!errors['contactInfo.emergencyContact.phone']}
                        helperText={touched['contactInfo.emergencyContact.phone'] && errors['contactInfo.emergencyContact.phone']}
                        required
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Parent Information Section */}
            <Grid item xs={12}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 3, fontWeight: 600 }}>
                    Parent Information
                  </Typography>
                  <Grid container spacing={{ xs: 2, sm: 4 }}>
                    <Grid item xs={12} sm={6}>
                      <Paper elevation={1} sx={{ p: 3, backgroundColor: 'grey.50' }}>
                        <Typography variant="subtitle1" gutterBottom color="secondary" sx={{ fontWeight: 500, mb: 2 }}>
                          Father's Details
                        </Typography>
                        <Grid container spacing={{ xs: 1, sm: 2 }}>
                          <Grid item xs={12}>
                            <StyledTextField
                              fullWidth
                              label="Father's Name"
                              value={getNestedValue('parentInfo.father.name') || ''}
                              onChange={(e) => handleChange('parentInfo.father.name', e.target.value)}
                              onBlur={() => handleBlur('parentInfo.father.name')}
                              error={touched['parentInfo.father.name'] && !!errors['parentInfo.father.name']}
                              helperText={touched['parentInfo.father.name'] && errors['parentInfo.father.name']}
                              required
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <StyledTextField
                              fullWidth
                              label="Father's Occupation"
                              value={getNestedValue('parentInfo.father.occupation') || ''}
                              onChange={(e) => handleChange('parentInfo.father.occupation', e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <StyledTextField
                              fullWidth
                              label="Father's Phone"
                              value={getNestedValue('parentInfo.father.phone') || ''}
                              onChange={(e) => handleChange('parentInfo.father.phone', e.target.value)}
                              onBlur={() => handleBlur('parentInfo.father.phone')}
                              error={touched['parentInfo.father.phone'] && !!errors['parentInfo.father.phone']}
                              helperText={touched['parentInfo.father.phone'] && errors['parentInfo.father.phone']}
                              required
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <StyledTextField
                              fullWidth
                              label="Father's Email"
                              type="email"
                              value={getNestedValue('parentInfo.father.email') || ''}
                              onChange={(e) => handleChange('parentInfo.father.email', e.target.value)}
                              onBlur={() => handleBlur('parentInfo.father.email')}
                              error={touched['parentInfo.father.email'] && !!errors['parentInfo.father.email']}
                              helperText={touched['parentInfo.father.email'] && errors['parentInfo.father.email']}
                            />
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Paper elevation={1} sx={{ p: 3, backgroundColor: 'grey.50' }}>
                        <Typography variant="subtitle1" gutterBottom color="secondary" sx={{ fontWeight: 500, mb: 2 }}>
                          Mother's Details
                        </Typography>
                        <Grid container spacing={{ xs: 1, sm: 2 }}>
                          <Grid item xs={12}>
                            <StyledTextField
                              fullWidth
                              label="Mother's Name"
                              value={getNestedValue('parentInfo.mother.name') || ''}
                              onChange={(e) => handleChange('parentInfo.mother.name', e.target.value)}
                              onBlur={() => handleBlur('parentInfo.mother.name')}
                              error={touched['parentInfo.mother.name'] && !!errors['parentInfo.mother.name']}
                              helperText={touched['parentInfo.mother.name'] && errors['parentInfo.mother.name']}
                              required
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <StyledTextField
                              fullWidth
                              label="Mother's Occupation"
                              value={getNestedValue('parentInfo.mother.occupation') || ''}
                              onChange={(e) => handleChange('parentInfo.mother.occupation', e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <StyledTextField
                              fullWidth
                              label="Mother's Phone"
                              value={getNestedValue('parentInfo.mother.phone') || ''}
                              onChange={(e) => handleChange('parentInfo.mother.phone', e.target.value)}
                              onBlur={() => handleBlur('parentInfo.mother.phone')}
                              error={touched['parentInfo.mother.phone'] && !!errors['parentInfo.mother.phone']}
                              helperText={touched['parentInfo.mother.phone'] && errors['parentInfo.mother.phone']}
                              required
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <StyledTextField
                              fullWidth
                              label="Mother's Email"
                              type="email"
                              value={getNestedValue('parentInfo.mother.email') || ''}
                              onChange={(e) => handleChange('parentInfo.mother.email', e.target.value)}
                              onBlur={() => handleBlur('parentInfo.mother.email')}
                              error={touched['parentInfo.mother.email'] && !!errors['parentInfo.mother.email']}
                              helperText={touched['parentInfo.mother.email'] && errors['parentInfo.mother.email']}
                            />
                          </Grid>
                        </Grid>
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

export default StudentForm;