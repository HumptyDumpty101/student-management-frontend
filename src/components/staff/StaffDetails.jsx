import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider,
  Paper
} from '@mui/material';
import {
  Email,
  Phone,
  Badge,
  Business,
  Person,
  Security
} from '@mui/icons-material';

const StaffDetails = ({ open, onClose, staff }) => {
  if (!staff) return null;

  const formatPermissions = (permissions) => {
    if (!permissions) return [];
    
    const permissionsList = [];
    
    // Students permissions
    if (permissions.students) {
      Object.entries(permissions.students).forEach(([action, allowed]) => {
        if (allowed) {
          permissionsList.push(`Students: ${action.charAt(0).toUpperCase() + action.slice(1)}`);
        }
      });
    }
    
    // Staff permissions
    if (permissions.staff) {
      Object.entries(permissions.staff).forEach(([action, allowed]) => {
        if (allowed) {
          permissionsList.push(`Staff: ${action.charAt(0).toUpperCase() + action.slice(1)}`);
        }
      });
    }
    
    return permissionsList;
  };

  const permissions = formatPermissions(staff.permissions);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
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
        Staff Member Details
      </DialogTitle>
      
      <DialogContent sx={{ 
        pb: 2,
        px: { xs: 1, sm: 3 }
      }}>
        <Box sx={{ 
          maxHeight: { xs: 'calc(100vh - 140px)', sm: '75vh' }, 
          overflowY: 'auto', 
          pr: { xs: 0, sm: 1 }
        }}>
          {/* Header with Avatar and Basic Info */}
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                <Avatar
                  src={staff.profilePhoto?.url}
                  alt={`${staff.name?.firstName} ${staff.name?.lastName}`}
                  sx={{ width: 80, height: 80, fontSize: '2rem' }}
                >
                  {staff.name?.firstName?.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    {staff.name?.firstName} {staff.name?.lastName}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip 
                      label={staff.department} 
                      color="primary" 
                      variant="outlined"
                      icon={<Business />}
                    />
                    <Chip 
                      label={staff.isActive ? 'Active' : 'Inactive'} 
                      color={staff.isActive ? 'success' : 'error'}
                      variant="filled"
                    />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Grid container spacing={3}>
            {/* Contact Information */}
            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600, mb: 2 }}>
                    Contact Information
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Email color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1">
                        {staff.email || 'Not provided'}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Phone color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Phone
                      </Typography>
                      <Typography variant="body1">
                        {staff.phone || 'Not provided'}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Badge color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Staff ID
                      </Typography>
                      <Typography variant="body1">
                        {staff.staffId || 'Not generated'}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Account Information */}
            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600, mb: 2 }}>
                    Account Information
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Department
                    </Typography>
                    <Typography variant="body1">
                      {staff.department}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Typography variant="body1">
                      {staff.isActive ? 'Active' : 'Inactive'}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Created At
                    </Typography>
                    <Typography variant="body1">
                      {staff.createdAt ? new Date(staff.createdAt).toLocaleDateString() : 'Unknown'}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Typography variant="body1">
                      {staff.updatedAt ? new Date(staff.updatedAt).toLocaleDateString() : 'Unknown'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Permissions */}
            <Grid item xs={12}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600, mb: 2 }}>
                    <Security sx={{ mr: 1, verticalAlign: 'middle' }} />
                    System Permissions
                  </Typography>
                  
                  {permissions.length > 0 ? (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {permissions.map((permission, index) => (
                        <Chip
                          key={index}
                          label={permission}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No permissions assigned
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ 
        px: { xs: 2, sm: 3 }, 
        py: 2 
      }}>
        <Button onClick={onClose} size="large">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StaffDetails;