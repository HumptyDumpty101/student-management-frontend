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
import { 
  fetchStaff, 
  createStaff, 
  updateStaff, 
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
    try {
      await dispatch(createStaff(staffData)).unwrap();
      dispatch(showSnackbar({ message: 'Staff member created successfully', severity: 'success' }));
      dispatch(closeDialog('addStaff'));
    } catch (error) {
      dispatch(showSnackbar({ message: error, severity: 'error' }));
    }
  };

  const handleUpdateStaff = async (staffData) => {
    try {
      await dispatch(updateStaff({ id: selectedStaff._id, data: staffData })).unwrap();
      dispatch(showSnackbar({ message: 'Staff member updated successfully', severity: 'success' }));
      dispatch(closeDialog('editStaff'));
      setSelectedStaff(null);
    } catch (error) {
      dispatch(showSnackbar({ message: error, severity: 'error' }));
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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Staff Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => dispatch(openDialog('addStaff'))}
        >
          Add Staff
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
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
            <Grid item xs={12} md={3}>
              <StyledTextField
                select
                fullWidth
                label="Department"
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
              >
                <MenuItem value="">All Departments</MenuItem>
                {['Administration', 'Academics', 'Sports', 'Arts', 'Science'].map((dept) => (
                  <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                ))}
              </StyledTextField>
            </Grid>
            <Grid item xs={12} md={3}>
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
            <Grid item xs={12} md={2}>
              <Chip
                label={`${pagination.totalStaff} Staff`}
                color="primary"
                variant="outlined"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Staff List
          </Typography>
          {/* Staff list component would go here */}
        </CardContent>
      </Card>

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