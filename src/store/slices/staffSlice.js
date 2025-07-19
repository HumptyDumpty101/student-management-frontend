import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { staffService } from '../../services/staffService';

// Async thunks
export const fetchStaff = createAsyncThunk(
  'staff/fetchStaff',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await staffService.getStaff(params);
      return response.data;
    } catch (error) {
      console.error('fetchStaff error:', error);
      return rejectWithValue(error.message || 'Failed to fetch staff');
    }
  }
);

export const fetchStaffMember = createAsyncThunk(
  'staff/fetchStaffMember',
  async (id, { rejectWithValue }) => {
    try {
      const response = await staffService.getStaffMember(id);
      return response.data.staff;
    } catch (error) {
      console.error('fetchStaffMember error:', error);
      return rejectWithValue(error.message || 'Failed to fetch staff member');
    }
  }
);

export const createStaff = createAsyncThunk(
  'staff/createStaff',
  async (staffData, { rejectWithValue }) => {
    try {
      console.log('createStaff thunk called with:', staffData);
      const response = await staffService.createStaff(staffData);
      console.log('createStaff response:', response);
      return response.data.staff;
    } catch (error) {
      console.error('createStaff thunk error:', error);
      // The key is to return rejectWithValue with a string message
      // This will be what gets thrown when using .unwrap()
      return rejectWithValue(error.message || 'Failed to create staff member');
    }
  }
);

export const updateStaff = createAsyncThunk(
  'staff/updateStaff',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await staffService.updateStaff(id, data);
      return response.data.staff;
    } catch (error) {
      console.error('updateStaff error:', error);
      return rejectWithValue(error.message || 'Failed to update staff member');
    }
  }
);

export const deleteStaff = createAsyncThunk(
  'staff/deleteStaff',
  async (id, { rejectWithValue }) => {
    try {
      await staffService.deleteStaff(id);
      return id;
    } catch (error) {
      console.error('deleteStaff error:', error);
      return rejectWithValue(error.message || 'Failed to delete staff member');
    }
  }
);

export const updateStaffPermissions = createAsyncThunk(
  'staff/updatePermissions',
  async ({ id, permissions }, { rejectWithValue }) => {
    try {
      const response = await staffService.updatePermissions(id, permissions);
      return { id, permissions: response.data.permissions };
    } catch (error) {
      console.error('updateStaffPermissions error:', error);
      return rejectWithValue(error.message || 'Failed to update permissions');
    }
  }
);

export const activateStaff = createAsyncThunk(
  'staff/activateStaff',
  async (id, { rejectWithValue }) => {
    try {
      const response = await staffService.activateStaff(id);
      return response.data.staff;
    } catch (error) {
      console.error('activateStaff error:', error);
      return rejectWithValue(error.message || 'Failed to activate staff member');
    }
  }
);

export const deactivateStaff = createAsyncThunk(
  'staff/deactivateStaff',
  async (id, { rejectWithValue }) => {
    try {
      const response = await staffService.deactivateStaff(id);
      return response.data.staff;
    } catch (error) {
      console.error('deactivateStaff error:', error);
      return rejectWithValue(error.message || 'Failed to deactivate staff member');
    }
  }
);

const initialState = {
  staff: [],
  selectedStaff: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalStaff: 0,
    hasNext: false,
    hasPrev: false,
  },
  filters: {
    search: '',
    department: '',
    isActive: null,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  loading: false,
  error: null,
  actionLoading: {
    create: false,
    update: false,
    delete: false,
    permissions: false,
  },
};

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSelectedStaff: (state) => {
      state.selectedStaff = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetStaff: (state) => {
      state.staff = [];
      state.pagination = initialState.pagination;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Staff
      .addCase(fetchStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staff = action.payload.staff;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Single Staff Member
      .addCase(fetchStaffMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaffMember.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedStaff = action.payload;
      })
      .addCase(fetchStaffMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Staff
      .addCase(createStaff.pending, (state) => {
        state.actionLoading.create = true;
        state.error = null;
      })
      .addCase(createStaff.fulfilled, (state, action) => {
        state.actionLoading.create = false;
        state.staff.unshift(action.payload);
        state.pagination.totalStaff += 1;
      })
      .addCase(createStaff.rejected, (state, action) => {
        state.actionLoading.create = false;
        state.error = action.payload;
      })
      // Update Staff
      .addCase(updateStaff.pending, (state) => {
        state.actionLoading.update = true;
        state.error = null;
      })
      .addCase(updateStaff.fulfilled, (state, action) => {
        state.actionLoading.update = false;
        const index = state.staff.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
          state.staff[index] = action.payload;
        }
        if (state.selectedStaff?._id === action.payload._id) {
          state.selectedStaff = action.payload;
        }
      })
      .addCase(updateStaff.rejected, (state, action) => {
        state.actionLoading.update = false;
        state.error = action.payload;
      })
      // Delete Staff
      .addCase(deleteStaff.pending, (state) => {
        state.actionLoading.delete = true;
        state.error = null;
      })
      .addCase(deleteStaff.fulfilled, (state, action) => {
        state.actionLoading.delete = false;
        state.staff = state.staff.filter(s => s._id !== action.payload);
        state.pagination.totalStaff -= 1;
        if (state.selectedStaff?._id === action.payload) {
          state.selectedStaff = null;
        }
      })
      .addCase(deleteStaff.rejected, (state, action) => {
        state.actionLoading.delete = false;
        state.error = action.payload;
      })
      // Update Permissions
      .addCase(updateStaffPermissions.pending, (state) => {
        state.actionLoading.permissions = true;
        state.error = null;
      })
      .addCase(updateStaffPermissions.fulfilled, (state, action) => {
        state.actionLoading.permissions = false;
        const { id, permissions } = action.payload;
        const staff = state.staff.find(s => s._id === id);
        if (staff) {
          staff.permissions = permissions;
        }
        if (state.selectedStaff?._id === id) {
          state.selectedStaff.permissions = permissions;
        }
      })
      .addCase(updateStaffPermissions.rejected, (state, action) => {
        state.actionLoading.permissions = false;
        state.error = action.payload;
      })
      // Activate Staff
      .addCase(activateStaff.fulfilled, (state, action) => {
        const index = state.staff.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
          state.staff[index] = action.payload;
        }
        if (state.selectedStaff?._id === action.payload._id) {
          state.selectedStaff = action.payload;
        }
      })
      // Deactivate Staff
      .addCase(deactivateStaff.fulfilled, (state, action) => {
        const index = state.staff.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
          state.staff[index] = action.payload;
        }
        if (state.selectedStaff?._id === action.payload._id) {
          state.selectedStaff = action.payload;
        }
      });
  },
});

export const { setFilters, clearSelectedStaff, clearError, resetStaff } = staffSlice.actions;
export default staffSlice.reducer;