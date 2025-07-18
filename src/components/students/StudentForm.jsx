import React, { useState } from 'react';
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
  Divider
} from '@mui/material';
import { useFormValidation } from '../../hooks/useFormValidation';
import { studentValidationSchema } from '../../utils/validation';
import { StyledTextField } from '../common';

const StudentForm = ({ open, onClose, onSubmit, student = null, loading = false }) => {
  const isEdit = Boolean(student);
  
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
    handleSubmit
  } = useFormValidation(studentValidationSchema, initialValues);

  const handleFormSubmit = async () => {
    await handleSubmit(async (formData) => {
      await onSubmit(formData);
      onClose();
    });
  };

  const standards = ['KG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];
  const sections = ['A', 'B', 'C', 'D'];
  const genders = ['Male', 'Female', 'Other'];
  const relationships = ['Father', 'Mother', 'Guardian', 'Sibling', 'Other'];
  const grades = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'];
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        {isEdit ? 'Edit Student' : 'Add New Student'}
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
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <StyledTextField
              fullWidth
              label="Date of Birth"
              type="date"
              value={values.dateOfBirth}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              onBlur={() => handleBlur('dateOfBirth')}
              error={touched.dateOfBirth && !!errors.dateOfBirth}
              helperText={touched.dateOfBirth && errors.dateOfBirth}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <StyledTextField
              select
              fullWidth
              label="Gender"
              value={values.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              onBlur={() => handleBlur('gender')}
              error={touched.gender && !!errors.gender}
              helperText={touched.gender && errors.gender}
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
              value={values.bloodGroup}
              onChange={(e) => handleChange('bloodGroup', e.target.value)}
            >
              {bloodGroups.map((group) => (
                <MenuItem key={group} value={group}>
                  {group}
                </MenuItem>
              ))}
            </StyledTextField>
          </Grid>

          {/* Academic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Academic Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <StyledTextField
              select
              fullWidth
              label="Standard"
              value={values.standard}
              onChange={(e) => handleChange('standard', e.target.value)}
              onBlur={() => handleBlur('standard')}
              error={touched.standard && !!errors.standard}
              helperText={touched.standard && errors.standard}
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
              value={values.section}
              onChange={(e) => handleChange('section', e.target.value)}
              onBlur={() => handleBlur('section')}
              error={touched.section && !!errors.section}
              helperText={touched.section && errors.section}
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
              value={values.rollNumber}
              onChange={(e) => handleChange('rollNumber', parseInt(e.target.value))}
              onBlur={() => handleBlur('rollNumber')}
              error={touched.rollNumber && !!errors.rollNumber}
              helperText={touched.rollNumber && errors.rollNumber}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <StyledTextField
              select
              fullWidth
              label="Overall Grade"
              value={values.overallGrade}
              onChange={(e) => handleChange('overallGrade', e.target.value)}
            >
              {grades.map((grade) => (
                <MenuItem key={grade} value={grade}>
                  {grade}
                </MenuItem>
              ))}
            </StyledTextField>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <StyledTextField
              fullWidth
              label="Overall Percentage"
              type="number"
              value={values.overallPercentage}
              onChange={(e) => handleChange('overallPercentage', parseFloat(e.target.value))}
              inputProps={{ min: 0, max: 100 }}
            />
          </Grid>
          
          {/* Contact Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Contact Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <StyledTextField
              fullWidth
              label="Street Address"
              value={values.contactInfo.address.street}
              onChange={(e) => handleChange('contactInfo.address.street', e.target.value)}
              multiline
              rows={2}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <StyledTextField
              fullWidth
              label="City"
              value={values.contactInfo.address.city}
              onChange={(e) => handleChange('contactInfo.address.city', e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <StyledTextField
              fullWidth
              label="State"
              value={values.contactInfo.address.state}
              onChange={(e) => handleChange('contactInfo.address.state', e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <StyledTextField
              fullWidth
              label="Pin Code"
              value={values.contactInfo.address.pinCode}
              onChange={(e) => handleChange('contactInfo.address.pinCode', e.target.value)}
            />
          </Grid>
          
          {/* Emergency Contact */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Emergency Contact
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <StyledTextField
              fullWidth
              label="Contact Name"
              value={values.contactInfo.emergencyContact.name}
              onChange={(e) => handleChange('contactInfo.emergencyContact.name', e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <StyledTextField
              select
              fullWidth
              label="Relationship"
              value={values.contactInfo.emergencyContact.relationship}
              onChange={(e) => handleChange('contactInfo.emergencyContact.relationship', e.target.value)}
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
              value={values.contactInfo.emergencyContact.phone}
              onChange={(e) => handleChange('contactInfo.emergencyContact.phone', e.target.value)}
            />
          </Grid>
          
          {/* Parent Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Parent Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom color="primary">
              Father's Details
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <StyledTextField
                fullWidth
                label="Father's Name"
                value={values.parentInfo.father.name}
                onChange={(e) => handleChange('parentInfo.father.name', e.target.value)}
              />
              <StyledTextField
                fullWidth
                label="Father's Occupation"
                value={values.parentInfo.father.occupation}
                onChange={(e) => handleChange('parentInfo.father.occupation', e.target.value)}
              />
              <StyledTextField
                fullWidth
                label="Father's Phone"
                value={values.parentInfo.father.phone}
                onChange={(e) => handleChange('parentInfo.father.phone', e.target.value)}
              />
              <StyledTextField
                fullWidth
                label="Father's Email"
                type="email"
                value={values.parentInfo.father.email}
                onChange={(e) => handleChange('parentInfo.father.email', e.target.value)}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom color="primary">
              Mother's Details
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <StyledTextField
                fullWidth
                label="Mother's Name"
                value={values.parentInfo.mother.name}
                onChange={(e) => handleChange('parentInfo.mother.name', e.target.value)}
              />
              <StyledTextField
                fullWidth
                label="Mother's Occupation"
                value={values.parentInfo.mother.occupation}
                onChange={(e) => handleChange('parentInfo.mother.occupation', e.target.value)}
              />
              <StyledTextField
                fullWidth
                label="Mother's Phone"
                value={values.parentInfo.mother.phone}
                onChange={(e) => handleChange('parentInfo.mother.phone', e.target.value)}
              />
              <StyledTextField
                fullWidth
                label="Mother's Email"
                type="email"
                value={values.parentInfo.mother.email}
                onChange={(e) => handleChange('parentInfo.mother.email', e.target.value)}
              />
            </Box>
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

export default StudentForm;