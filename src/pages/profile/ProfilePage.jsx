import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  Alert
} from '@mui/material';
import { Edit, Save, Cancel } from '@mui/icons-material';
import { changePassword } from '../../store/slices/authSlice';
import { showSnackbar } from '../../store/slices/uiSlice';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector(state => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    department: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Initialize profile data when user changes
  React.useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.name?.firstName || '',
        lastName: user.name?.lastName || '',
        phone: user.phone || '',
        department: user.department || ''
      });
    }
  }, [user]);

  const handleProfileDataChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      // TODO: Add API call to update profile
      console.log('Saving profile data:', profileData);
      dispatch(showSnackbar({ message: 'Profile updated successfully', severity: 'success' }));
      setIsEditing(false);
    } catch (error) {
      dispatch(showSnackbar({ message: 'Failed to update profile', severity: 'error' }));
    }
  };

  const handleCancelEdit = () => {
    // Reset profile data to original user data
    setProfileData({
      firstName: user?.name?.firstName || '',
      lastName: user?.name?.lastName || '',
      phone: user?.phone || '',
      department: user?.department || ''
    });
    setIsEditing(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      dispatch(showSnackbar({ message: 'Passwords do not match', severity: 'error' }));
      return;
    }

    try {
      await dispatch(changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      })).unwrap();
      dispatch(showSnackbar({ 
        message: 'Password changed successfully. You will be logged out for security.', 
        severity: 'success' 
      }));
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      
      // The backend logs out the user for security, so we'll be redirected to login
      // No need to do anything else, the auth interceptor will handle the redirect
    } catch (error) {
      dispatch(showSnackbar({ message: error, severity: 'error' }));
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Profile
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '2rem'
                }}
              >
                {user?.name?.firstName?.charAt(0) || 'U'}
              </Avatar>
              <Typography variant="h6" gutterBottom>
                {user?.name?.firstName} {user?.name?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {user?.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.role === 'superAdmin' ? 'Super Administrator' : 'Staff Member'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Personal Information</Typography>
                <Button
                  startIcon={isEditing ? <Cancel /> : <Edit />}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={profileData.firstName}
                    onChange={(e) => handleProfileDataChange('firstName', e.target.value)}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={profileData.lastName}
                    onChange={(e) => handleProfileDataChange('lastName', e.target.value)}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={user?.email || ''}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={profileData.phone}
                    onChange={(e) => handleProfileDataChange('phone', e.target.value)}
                    disabled={!isEditing}
                  />
                </Grid>
                {user?.role === 'staff' && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Employee ID"
                        value={user?.employeeId || ''}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Department"
                        value={profileData.department}
                        onChange={(e) => handleProfileDataChange('department', e.target.value)}
                        disabled={!isEditing}
                      />
                    </Grid>
                  </>
                )}
              </Grid>

              {isEditing && (
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button variant="contained" startIcon={<Save />} onClick={handleSaveProfile}>
                    Save Changes
                  </Button>
                  <Button variant="outlined" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Change Password
              </Typography>
              <form onSubmit={handlePasswordChange}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Current Password"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="New Password"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                    >
                      {loading ? 'Changing...' : 'Change Password'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfilePage;