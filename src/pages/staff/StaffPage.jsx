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
import { Search, Add } from '@mui/icons-material';
import { ConfirmDialog, StyledTextField } from '../../components/common';
import { StaffForm, StaffList, StaffDetails } from '../../components/staff';
import { 
  fetchStaff, 
  createStaff, 
  updateStaff, 
  updateStaffPermissions,
  deleteStaff,
  setFilters,
  clearSelectedStaff 
} from '../../store/slices/staffSlice';
import { showSnackbar, openDialog, closeDialog } from '../../store/slices/uiSlice';

const StaffPage = () => {
  const dispatch = useDispatch();
  const { staff, pagination, filters, loading, actionLoading } = useSelector(state => state.staff);
  const { dialogs } = useSelector(state => state.ui);
  
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, staff: null });

  useEffect(() => {
    dispatch(fetchStaff({ ...filters, page: 1 }));
  }, [dispatch, filters.search, filters.department, filters.isActive, filters.sortBy]);

  const handleSearch = (value) => {
    dispatch(setFilters({ search: value, page: 1 }));
  };

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value, page: 1 }));
  };

  const handlePageChange = (event, page) => {
    dispatch(fetchStaff({ ...filters, page }));
  };

  const handleCreateStaff = async (staffData) => {
    console.log('StaffPage: handleCreateStaff called with:', staffData);
    try {
      console.log('StaffPage: Dispatching createStaff with .unwrap()...');
      // This is the key fix - use .unwrap() to get error throwing behavior
      await dispatch(createStaff(staffData)).unwrap();
      
      console.log('StaffPage: createStaff was successful');
      dispatch(showSnackbar({ message: 'Staff member created successfully', severity: 'success' }));
      // Success - form will handle closing the dialog
    } catch (error) {
      console.error('StaffPage: handleCreateStaff error caught:', error);
      // Re-throw error so the form can handle it
      throw error;
    }
  };

  const handleUpdateStaff = async (staffData) => {
    console.log('StaffPage: handleUpdateStaff called with:', staffData);
    
    try {
      // Always update basic staff info first (without permissions)
      const { permissions, ...staffDataWithoutPermissions } = staffData;
      
      if (Object.keys(staffDataWithoutPermissions).length > 0) {
        console.log('StaffPage: Updating basic staff data...');
        await dispatch(updateStaff({ 
          id: selectedStaff._id, 
          data: staffDataWithoutPermissions 
        })).unwrap();
      }

      // Then update permissions separately using the dedicated endpoint
      if (permissions) {
        console.log('StaffPage: Updating staff permissions...');
        await dispatch(updateStaffPermissions({ 
          id: selectedStaff._id, 
          permissions: permissions 
        })).unwrap();
      }
      
      console.log('StaffPage: Update was successful');
      dispatch(showSnackbar({ message: 'Staff member updated successfully', severity: 'success' }));
      setSelectedStaff(null);
      // Success - form will handle closing the dialog
    } catch (error) {
      console.error('StaffPage: handleUpdateStaff error caught:', error);
      // Re-throw error so the form can handle it
      throw error;
    }
  };

  const handleDeleteStaff = async () => {
    try {
      await dispatch(deleteStaff(confirmDialog.staff._id)).unwrap();
      dispatch(showSnackbar({ message: 'Staff member deleted successfully', severity: 'success' }));
      setConfirmDialog({ open: false, staff: null });
    } catch (error) {
      dispatch(showSnackbar({ message: error, severity: 'error' }));
    }
  };

  const handleViewStaff = (staff) => {
    setSelectedStaff(staff);
    dispatch(openDialog('staffDetails'));
  };

  const handleEditStaff = (staff) => {
    setSelectedStaff(staff);
    dispatch(openDialog('editStaff'));
  };

  const handleDeleteClick = (staff) => {
    setConfirmDialog({ open: true, staff });
  };

  const userPermissions = {
    staff: {
      create: true,
      read: true,
      update: true,
      delete: true
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
          Staff Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => dispatch(openDialog('addStaff'))}
          sx={{ 
            alignSelf: { xs: 'stretch', sm: 'auto' },
            py: { xs: 1.5, sm: 1 }
          }}
        >
          Add Staff
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={{ xs: 2, sm: 3 }} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                placeholder="Search staff..."
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
            <Grid size={{ xs: 12, md: 3 }}>
              <StyledTextField
                select
                fullWidth
                label="Department"
                value={filters.department || ''}
                onChange={(e) => handleFilterChange('department', e.target.value)}
              >
                <MenuItem value="">All Departments</MenuItem>
                {['Administration', 'Academics', 'Sports', 'Arts', 'Science'].map((dept) => (
                  <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                ))}
              </StyledTextField>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <StyledTextField
                select
                fullWidth
                label="Status"
                value={filters.isActive ?? ''}
                onChange={(e) => handleFilterChange('isActive', e.target.value === '' ? null : e.target.value === 'true')}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Inactive</MenuItem>
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
                  label={`${pagination.totalStaff} Staff`}
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
            <StaffList
              staff={staff}
              onView={handleViewStaff}
              onEdit={handleEditStaff}
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

      {/* Add Staff Dialog */}
      <StaffForm
        open={dialogs.addStaff}
        onClose={() => dispatch(closeDialog('addStaff'))}
        onSubmit={handleCreateStaff}
        loading={actionLoading.create}
      />

      {/* Edit Staff Dialog */}
      <StaffForm
        open={dialogs.editStaff}
        onClose={() => {
          dispatch(closeDialog('editStaff'));
          setSelectedStaff(null);
        }}
        onSubmit={handleUpdateStaff}
        staff={selectedStaff}
        loading={actionLoading.update}
      />

      {/* Staff Details Dialog */}
      <StaffDetails
        open={dialogs.staffDetails}
        onClose={() => {
          dispatch(closeDialog('staffDetails'));
          setSelectedStaff(null);
        }}
        staff={selectedStaff}
      />

      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, staff: null })}
        onConfirm={handleDeleteStaff}
        title="Delete Staff Member"
        message={`Are you sure you want to delete ${confirmDialog.staff?.name?.firstName} ${confirmDialog.staff?.name?.lastName}? This action cannot be undone.`}
        severity="error"
      />
    </Box>
  );
};

export default StaffPage;