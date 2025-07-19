import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Pagination,
  MenuItem,
  Chip
} from '@mui/material';
import { Search, Add, FilterList } from '@mui/icons-material';
import { StudentList, StudentForm, StudentDetails } from '../../components/students';
import { ConfirmDialog, StyledTextField } from '../../components/common';
import { 
  fetchStudents, 
  createStudent, 
  updateStudent, 
  deleteStudent,
  setFilters,
  clearSelectedStudent 
} from '../../store/slices/studentSlice';
import { showSnackbar, openDialog, closeDialog } from '../../store/slices/uiSlice';

const StudentsPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { students, pagination, filters, loading, actionLoading } = useSelector(state => state.students);
  const { dialogs } = useSelector(state => state.ui);
  
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, student: null });

  useEffect(() => {
    dispatch(fetchStudents({ ...filters, page: 1 }));
  }, [dispatch, filters.search, filters.standard, filters.section, filters.sortBy, filters.isActive]);

  const handleSearch = (value) => {
    dispatch(setFilters({ search: value, page: 1 }));
  };

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value, page: 1 }));
  };

  const handlePageChange = (event, page) => {
    dispatch(fetchStudents({ ...filters, page }));
  };

  const handleCreateStudent = async (studentData) => {
    await dispatch(createStudent(studentData)).unwrap();
    dispatch(showSnackbar({ message: 'Student created successfully', severity: 'success' }));
    // Form will handle closing the dialog
  };

  const handleUpdateStudent = async (studentData) => {
    await dispatch(updateStudent({ id: selectedStudent._id, data: studentData })).unwrap();
    dispatch(showSnackbar({ message: 'Student updated successfully', severity: 'success' }));
    setSelectedStudent(null);
    // Form will handle closing the dialog
  };

  const handleDeleteStudent = async () => {
    try {
      await dispatch(deleteStudent(confirmDialog.student._id)).unwrap();
      dispatch(showSnackbar({ message: 'Student deleted successfully', severity: 'success' }));
      setConfirmDialog({ open: false, student: null });
    } catch (error) {
      dispatch(showSnackbar({ message: error, severity: 'error' }));
    }
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    dispatch(openDialog('studentDetails'));
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    dispatch(openDialog('editStudent'));
  };

  const handleDeleteClick = (student) => {
    setConfirmDialog({ open: true, student });
  };

  const canCreate = user?.role === 'superAdmin' || user?.permissions?.students?.create;
  const canUpdate = user?.role === 'superAdmin' || user?.permissions?.students?.update;
  const canDelete = user?.role === 'superAdmin' || user?.permissions?.students?.delete;

  const userPermissions = {
    students: {
      create: canCreate,
      read: true,
      update: canUpdate,
      delete: canDelete
    }
  };

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: '100vw',
      p: { xs: 1, sm: 2, md: 3 },
      overflowX: 'hidden',
      boxSizing: 'border-box'
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center' },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 },
        mb: 3 
      }}>
        <Typography 
          variant="h4" 
          fontWeight="bold"
          sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}
        >
          Students Management
        </Typography>
        {canCreate && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => dispatch(openDialog('addStudent'))}
            sx={{ 
              alignSelf: { xs: 'stretch', sm: 'auto' },
              py: { xs: 1.5, sm: 1 }
            }}
          >
            Add Student
          </Button>
        )}
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={{ xs: 2, sm: 3 }} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                placeholder="Search students..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <StyledTextField
                select
                fullWidth
                label="Standard"
                value={filters.standard || ''}
                onChange={(e) => handleFilterChange('standard', e.target.value)}
              >
                <MenuItem value="">All Standards</MenuItem>
                {['KG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'].map((std) => (
                  <MenuItem key={std} value={std}>{std}</MenuItem>
                ))}
              </StyledTextField>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <StyledTextField
                select
                fullWidth
                label="Section"
                value={filters.section || ''}
                onChange={(e) => handleFilterChange('section', e.target.value)}
              >
                <MenuItem value="">All Sections</MenuItem>
                {['A', 'B', 'C', 'D'].map((section) => (
                  <MenuItem key={section} value={section}>{section}</MenuItem>
                ))}
              </StyledTextField>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <StyledTextField
                select
                fullWidth
                label="Sort By"
                value={filters.sortBy || 'createdAt'}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <MenuItem value="createdAt">Created Date</MenuItem>
                <MenuItem value="name.firstName">Name</MenuItem>
                <MenuItem value="studentId">Student ID</MenuItem>
                <MenuItem value="standard">Standard</MenuItem>
              </StyledTextField>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: { xs: 'center', md: 'flex-start' },
                gap: 1 
              }}>
                <Chip
                  label={`${pagination.totalStudents} Students`}
                  color="primary"
                  variant="outlined"
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ overflow: 'hidden' }}>
        <CardContent sx={{ 
          p: { xs: 1, sm: 2, md: 3 },
          '&:last-child': { pb: { xs: 1, sm: 2, md: 3 } }
        }}>
          <Box sx={{ 
            width: '100%',
            maxWidth: '100%',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <StudentList
              students={students}
              onView={handleViewStudent}
              onEdit={handleEditStudent}
              onDelete={handleDeleteClick}
              userPermissions={userPermissions}
            />
          </Box>
          
          {pagination.totalPages > 1 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 3,
              px: { xs: 1, sm: 0 }
            }}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.currentPage}
                onChange={handlePageChange}
                color="primary"
                size={{ xs: 'small', sm: 'medium' }}
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Add Student Dialog */}
      <StudentForm
        open={dialogs.addStudent}
        onClose={() => dispatch(closeDialog('addStudent'))}
        onSubmit={handleCreateStudent}
        loading={actionLoading.create}
      />

      {/* Edit Student Dialog */}
      <StudentForm
        open={dialogs.editStudent}
        onClose={() => {
          dispatch(closeDialog('editStudent'));
          setSelectedStudent(null);
        }}
        onSubmit={handleUpdateStudent}
        student={selectedStudent}
        loading={actionLoading.update}
      />

      {/* Student Details Dialog */}
      <StudentDetails
        open={dialogs.studentDetails}
        onClose={() => {
          dispatch(closeDialog('studentDetails'));
          setSelectedStudent(null);
        }}
        student={selectedStudent}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, student: null })}
        onConfirm={handleDeleteStudent}
        title="Delete Student"
        message={`Are you sure you want to delete ${confirmDialog.student?.name?.firstName} ${confirmDialog.student?.name?.lastName}? This action cannot be undone.`}
        severity="error"
      />
    </Box>
  );
};

export default StudentsPage;