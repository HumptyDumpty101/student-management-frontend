import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  LocationOn,
  School,
  People,
  ContactEmergency,
  Badge,
  CalendarMonth,
  Grade
} from '@mui/icons-material';

const StudentDetails = ({ open, onClose, student }) => {
  if (!student) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
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
        px: { xs: 2, sm: 3 }
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 1.5, sm: 2 },
          flexDirection: { xs: 'column', sm: 'row' },
          textAlign: { xs: 'center', sm: 'left' }
        }}>
          <Avatar
            src={student.profilePhoto?.url}
            sx={{ 
              width: { xs: 80, sm: 60 }, 
              height: { xs: 80, sm: 60 }, 
              bgcolor: 'primary.main' 
            }}
          >
            {student.name?.firstName?.[0]}{student.name?.lastName?.[0]}
          </Avatar>
          <Box>
            <Typography 
              variant="h5" 
              fontWeight="bold"
              sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
            >
              {student.name?.firstName} {student.name?.lastName}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Student ID: {student.studentId}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ 
        pb: 2,
        px: { xs: 1, sm: 3 },
        maxHeight: { xs: 'calc(100vh - 140px)', sm: '75vh' },
        overflowY: 'auto'
      }}>
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {/* Basic Information */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Person />
                  Basic Information
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><Badge /></ListItemIcon>
                    <ListItemText primary="Student ID" secondary={student.studentId} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CalendarMonth /></ListItemIcon>
                    <ListItemText 
                      primary="Date of Birth" 
                      secondary={`${formatDate(student.dateOfBirth)} (${getAge(student.dateOfBirth)} years old)`} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Person /></ListItemIcon>
                    <ListItemText primary="Gender" secondary={student.gender} />
                  </ListItem>
                  {student.email && (
                    <ListItem>
                      <ListItemIcon><Email /></ListItemIcon>
                      <ListItemText primary="Email" secondary={student.email} />
                    </ListItem>
                  )}
                  {student.bloodGroup && (
                    <ListItem>
                      <ListItemText primary="Blood Group" secondary={student.bloodGroup} />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Academic Information */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <School />
                  Academic Information
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Standard" secondary={student.standard} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Section" secondary={student.section} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Roll Number" secondary={student.rollNumber} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Grade /></ListItemIcon>
                    <ListItemText 
                      primary="Overall Grade" 
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip label={student.overallGrade} size="small" color="primary" />
                          <Typography variant="body2">
                            ({student.overallPercentage}%)
                          </Typography>
                        </Box>
                      } 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Admission Date" secondary={formatDate(student.admissionDate)} />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <LocationOn />
                  Contact Information
                </Typography>
                <Grid container spacing={{ xs: 2, sm: 3 }}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Address</Typography>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="body2">
                        {student.contactInfo?.address?.street}<br/>
                        {student.contactInfo?.address?.city}, {student.contactInfo?.address?.state}<br/>
                        PIN: {student.contactInfo?.address?.pinCode}
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Emergency Contact</Typography>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <List dense>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon><ContactEmergency /></ListItemIcon>
                          <ListItemText 
                            primary={student.contactInfo?.emergencyContact?.name}
                            secondary={student.contactInfo?.emergencyContact?.relationship}
                          />
                        </ListItem>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon><Phone /></ListItemIcon>
                          <ListItemText secondary={student.contactInfo?.emergencyContact?.phone} />
                        </ListItem>
                      </List>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Parent Information */}
          <Grid item xs={12}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <People />
                  Parent Information
                </Typography>
                <Grid container spacing={{ xs: 2, sm: 3 }}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Father's Details</Typography>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <List dense>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemText primary="Name" secondary={student.parentInfo?.father?.name} />
                        </ListItem>
                        {student.parentInfo?.father?.occupation && (
                          <ListItem sx={{ px: 0 }}>
                            <ListItemText primary="Occupation" secondary={student.parentInfo.father.occupation} />
                          </ListItem>
                        )}
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon><Phone /></ListItemIcon>
                          <ListItemText secondary={student.parentInfo?.father?.phone} />
                        </ListItem>
                        {student.parentInfo?.father?.email && (
                          <ListItem sx={{ px: 0 }}>
                            <ListItemIcon><Email /></ListItemIcon>
                            <ListItemText secondary={student.parentInfo.father.email} />
                          </ListItem>
                        )}
                      </List>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Mother's Details</Typography>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <List dense>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemText primary="Name" secondary={student.parentInfo?.mother?.name} />
                        </ListItem>
                        {student.parentInfo?.mother?.occupation && (
                          <ListItem sx={{ px: 0 }}>
                            <ListItemText primary="Occupation" secondary={student.parentInfo.mother.occupation} />
                          </ListItem>
                        )}
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon><Phone /></ListItemIcon>
                          <ListItemText secondary={student.parentInfo?.mother?.phone} />
                        </ListItem>
                        {student.parentInfo?.mother?.email && (
                          <ListItem sx={{ px: 0 }}>
                            <ListItemIcon><Email /></ListItemIcon>
                            <ListItemText secondary={student.parentInfo.mother.email} />
                          </ListItem>
                        )}
                      </List>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ 
        px: { xs: 2, sm: 3 }, 
        py: 2
      }}>
        <Button 
          onClick={onClose} 
          size="large"
          fullWidth={{ xs: true, sm: false }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StudentDetails;