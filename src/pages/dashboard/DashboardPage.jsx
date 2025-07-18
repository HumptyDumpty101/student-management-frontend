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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Paper
} from '@mui/material';
import { PersonAdd, Add, Download, School, People, Lock } from '@mui/icons-material';
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

  const renderStudentTable = () => {
    if (!checkPermission('students', 'read')) {
      return (
        <Card sx={{ opacity: 0.6, backgroundColor: '#f5f5f5' }}>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 200,
                color: 'text.secondary'
              }}
            >
              <Lock sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h6" align="center">
                No Permission
              </Typography>
              <Typography variant="body2" align="center">
                You don't have permission to view students
              </Typography>
            </Box>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Student Records {totalStudents > 0 && `(${Math.min(10, students.length)} of ${totalStudents})`}
            </Typography>
            <Button
              variant="contained"
              size="medium"
              onClick={() => navigate('/students')}
              sx={{ borderRadius: 2 }}
            >
              View All Students
            </Button>
          </Box>
          <TableContainer 
            component={Paper} 
            variant="outlined" 
            sx={{ 
              borderRadius: 2,
              maxHeight: 600,
              overflow: 'auto'
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: 'grey.50' }}>Student ID</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: 'grey.50' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: 'grey.50' }}>Standard</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: 'grey.50' }}>Grade</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: 'grey.50' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studentsLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        Loading students...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No students found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  students.slice(0, 10).map((student) => (
                    <TableRow 
                      key={student._id} 
                      hover 
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: 'action.hover',
                          cursor: 'pointer'
                        }
                      }}
                    >
                      <TableCell sx={{ fontWeight: 500 }}>{student.studentId}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {`${student.name.firstName} ${student.name.lastName}`}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={`${student.standard}-${student.section}`} 
                          size="small" 
                          variant="outlined"
                          sx={{ borderRadius: 1 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={student.overallGrade} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                          sx={{ borderRadius: 1 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={student.isActive ? 'Active' : 'Inactive'} 
                          size="small" 
                          color={student.isActive ? 'success' : 'error'}
                          sx={{ borderRadius: 1 }}
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
    );
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          {getGreeting()}, {user?.name?.firstName || user?.fullName || 'User'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome to your dashboard
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

      {/* Quick Actions Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' }, 
                gap: 2,
                justifyContent: 'flex-start'
              }}>
                {checkPermission('students', 'create') && (
                  <Button
                    variant="contained"
                    startIcon={<PersonAdd />}
                    size="large"
                    onClick={() => dispatch(openDialog('addStudent'))}
                    sx={{ minWidth: 200 }}
                  >
                    Add New Student
                  </Button>
                )}
                {checkPermission('staff', 'create') && (
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    size="large"
                    onClick={() => dispatch(openDialog('addStaff'))}
                    sx={{ minWidth: 200 }}
                  >
                    Add New Staff
                  </Button>
                )}
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  size="large"
                  onClick={handleExportReports}
                  sx={{ minWidth: 200 }}
                >
                  Export Reports
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Student Table - Full Width */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {renderStudentTable()}
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;