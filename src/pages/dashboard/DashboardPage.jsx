import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  Avatar,
  LinearProgress,
  Divider
} from '@mui/material';
import { 
  PersonAdd, 
  Add, 
  Download, 
  School, 
  People, 
  TrendingUp,
  Assessment,
  Dashboard,
  CalendarToday
} from '@mui/icons-material';
import { fetchStudents } from '../../store/slices/studentSlice';
import { fetchStaff } from '../../store/slices/staffSlice';
import { openDialog } from '../../store/slices/uiSlice';
import { usePermissions } from '../../hooks/usePermissions';
import { exportStudentsToCSV, exportStaffToCSV } from '../../utils/exportUtils';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { students, pagination: studentPagination, loading: studentsLoading } = useSelector(state => state.students);
  const { staff, pagination: staffPagination } = useSelector(state => state.staff);
  const { permissions, checkPermission } = usePermissions();

  useEffect(() => {
    if (checkPermission('students', 'read')) {
      dispatch(fetchStudents({ limit: 10 }));
    }
    if (checkPermission('staff', 'read')) {
      dispatch(fetchStaff({ limit: 5 }));
    }
  }, [dispatch, permissions.students.read, permissions.staff.read]);

  const totalStudents = studentPagination?.totalStudents || 0;
  const activeStudents = students.filter(s => s.isActive).length;
  const totalStaff = staffPagination?.totalStaff || 0;
  const activeStaff = staff.filter(s => s.isActive).length;

  const stats = [
    { title: 'Total Students', value: totalStudents, color: 'primary', icon: <School /> },
    { title: 'Active Students', value: activeStudents, color: 'success', icon: <School /> },
    ...(user?.role === 'superAdmin' ? [
      { title: 'Total Staff', value: totalStaff, color: 'secondary', icon: <People /> },
      { title: 'Active Staff', value: activeStaff, color: 'warning', icon: <People /> }
    ] : [])
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleExportReports = () => {
    if (checkPermission('students', 'read') && students.length > 0) {
      exportStudentsToCSV(students);
    } else if (checkPermission('staff', 'read') && staff.length > 0) {
      exportStaffToCSV(staff);
    } else {
      alert('No data available to export or insufficient permissions');
    }
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };


  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: '100%',
      p: { xs: 1, sm: 2, md: 3 },
      minHeight: '100vh',
      bgcolor: 'grey.50'
    }}>
      {/* Header Section */}
      <Paper 
        elevation={0}
        sx={{ 
          p: { xs: 2, sm: 3, md: 4 }, 
          mb: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography 
                variant="h3" 
                fontWeight="bold" 
                sx={{ 
                  fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
                  mb: 1
                }}
              >
                {getGreeting()}, {user?.name?.firstName || user?.fullName || 'User'}!
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  opacity: 0.9,
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  mb: 1
                }}
              >
                Welcome to your Student Management Dashboard
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.8 }}>
                <CalendarToday sx={{ fontSize: '1rem' }} />
                <Typography variant="body2">
                  {getCurrentDate()}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: { xs: 'center', md: 'flex-end' },
                mt: { xs: 2, md: 0 }
              }}>
                <Avatar 
                  sx={{ 
                    width: { xs: 80, sm: 120 }, 
                    height: { xs: 80, sm: 120 },
                    fontSize: { xs: '2rem', sm: '3rem' },
                    bgcolor: 'rgba(255,255,255,0.2)',
                    border: '3px solid rgba(255,255,255,0.3)'
                  }}
                >
                  <Dashboard sx={{ fontSize: 'inherit' }} />
                </Avatar>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box 
          sx={{ 
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.1)',
            zIndex: 0
          }} 
        />
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
                }
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box 
                    sx={{ 
                      p: 2,
                      borderRadius: 2,
                      bgcolor: `${stat.color}.50`,
                      color: `${stat.color}.main`
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <TrendingUp sx={{ color: 'success.main', fontSize: 20 }} />
                </Box>
                <Typography 
                  variant="h3" 
                  fontWeight="bold" 
                  color={`${stat.color}.main`}
                  sx={{ fontSize: { xs: '2rem', sm: '2.5rem' } }}
                >
                  {stat.value}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  {stat.title}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.min((stat.value / 100) * 100, 100)}
                  sx={{ 
                    mt: 2, 
                    height: 6, 
                    borderRadius: 3,
                    bgcolor: `${stat.color}.100`,
                    '& .MuiLinearProgress-bar': {
                      bgcolor: `${stat.color}.main`,
                      borderRadius: 3
                    }
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Card 
        sx={{ 
          mb: 4,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box 
              sx={{ 
                p: 1.5,
                borderRadius: 2,
                bgcolor: 'primary.50',
                color: 'primary.main'
              }}
            >
              <Assessment />
            </Box>
            <Typography variant="h5" fontWeight="600">
              Quick Actions
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {checkPermission('students', 'create') && (
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  variant="contained"
                  startIcon={<PersonAdd />}
                  size="large"
                  fullWidth
                  onClick={() => dispatch(openDialog('addStudent'))}
                  sx={{ 
                    py: 2,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 600
                  }}
                >
                  Add New Student
                </Button>
              </Grid>
            )}
            {checkPermission('staff', 'create') && (
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  size="large"
                  fullWidth
                  onClick={() => dispatch(openDialog('addStaff'))}
                  sx={{ 
                    py: 2,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 600
                  }}
                >
                  Add New Staff
                </Button>
              </Grid>
            )}
            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant="outlined"
                startIcon={<Download />}
                size="large"
                fullWidth
                onClick={handleExportReports}
                sx={{ 
                  py: 2,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 600
                }}
              >
                Export Reports
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Navigation Cards */}
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid item xs={12} sm={6}>
          <Card 
            sx={{ 
              height: '100%',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
              }
            }}
            onClick={() => navigate('/students')}
          >
            <CardContent sx={{ p: { xs: 3, sm: 4 }, textAlign: 'center' }}>
              <Box 
                sx={{ 
                  p: 3,
                  borderRadius: 3,
                  bgcolor: 'primary.50',
                  color: 'primary.main',
                  display: 'inline-flex',
                  mb: 2
                }}
              >
                <School sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h5" fontWeight="600" sx={{ mb: 1 }}>
                Manage Students
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                View, add, edit, and manage all student records
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                {totalStudents}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Students
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {user?.role === 'superAdmin' && (
          <Grid item xs={12} sm={6}>
            <Card 
              sx={{ 
                height: '100%',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
                }
              }}
              onClick={() => navigate('/staff')}
            >
              <CardContent sx={{ p: { xs: 3, sm: 4 }, textAlign: 'center' }}>
                <Box 
                  sx={{ 
                    p: 3,
                    borderRadius: 3,
                    bgcolor: 'secondary.50',
                    color: 'secondary.main',
                    display: 'inline-flex',
                    mb: 2
                  }}
                >
                  <People sx={{ fontSize: 40 }} />
                </Box>
                <Typography variant="h5" fontWeight="600" sx={{ mb: 1 }}>
                  Manage Staff
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  View, add, edit, and manage all staff members
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="secondary.main">
                  {totalStaff}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Staff
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default DashboardPage;