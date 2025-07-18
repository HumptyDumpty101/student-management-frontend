import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Paper
} from '@mui/material';
import { PersonAdd, Add, Download, School, People } from '@mui/icons-material';
import { fetchStudents } from '../store/slices/studentSlice';
import { fetchStaff } from '../store/slices/staffSlice';
import { openDialog } from '../store/slices/uiSlice';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { students, pagination: studentPagination } = useSelector(state => state.students);
  const { staff, pagination: staffPagination } = useSelector(state => state.staff);

  useEffect(() => {
    dispatch(fetchStudents({ limit: 5 }));
    if (user?.role === 'superAdmin') {
      dispatch(fetchStaff({ limit: 5 }));
    }
  }, [dispatch, user?.role]);

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

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          {getGreeting()}, {user?.name?.firstName || user?.fullName || 'User'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening at your school today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color={`${stat.color}.main`}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                  <Box sx={{ color: `${stat.color}.main`, fontSize: 40 }}>
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Students */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Students
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => window.location.href = '/students'}
                >
                  View All
                </Button>
              </Box>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Student ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Standard</TableCell>
                      <TableCell>Grade</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <Typography variant="body2" color="text.secondary">
                            No students found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      students.slice(0, 5).map((student) => (
                        <TableRow key={student._id} hover>
                          <TableCell>{student.studentId}</TableCell>
                          <TableCell>{`${student.name.firstName} ${student.name.lastName}`}</TableCell>
                          <TableCell>
                            <Chip 
                              label={`${student.standard}-${student.section}`} 
                              size="small" 
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={student.overallGrade} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={student.isActive ? 'Active' : 'Inactive'} 
                              size="small" 
                              color={student.isActive ? 'success' : 'error'}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<PersonAdd />}
                  fullWidth
                  onClick={() => dispatch(openDialog('addStudent'))}
                >
                  Add New Student
                </Button>
                {user?.role === 'superAdmin' && (
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    fullWidth
                    onClick={() => dispatch(openDialog('addStaff'))}
                  >
                    Add New Staff
                  </Button>
                )}
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  fullWidth
                >
                  Export Reports
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;