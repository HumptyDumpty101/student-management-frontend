import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../utils/apiClient';

// Async thunks
export const fetchStudents = createAsyncThunk(
  'students/fetchStudents',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/api/v1/students', { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch students'
      );
    }
  }
);

export const fetchStudent = createAsyncThunk(
  'students/fetchStudent',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/api/v1/students/${id}`);
      return response.data.data.student;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch student'
      );
    }
  }
);

export const createStudent = createAsyncThunk(
  'students/createStudent',
  async (studentData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/api/v1/students', studentData);
      return response.data.data.student;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create student'
      );
    }
  }
);

export const updateStudent = createAsyncThunk(
  'students/updateStudent',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/api/v1/students/${id}`, data);
      return response.data.data.student;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update student'
      );
    }
  }
);

export const deleteStudent = createAsyncThunk(
  'students/deleteStudent',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/api/v1/students/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete student'
      );
    }
  }
);

export const uploadStudentPhoto = createAsyncThunk(
  'students/uploadPhoto',
  async ({ id, photo }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('photo', photo);
      
      const response = await apiClient.post(
        `/api/v1/students/${id}/photo`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return { id, photoUrl: response.data.data.photoUrl };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to upload photo'
      );
    }
  }
);

export const deleteStudentPhoto = createAsyncThunk(
  'students/deletePhoto',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/api/v1/students/${id}/photo`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete photo'
      );
    }
  }
);

const initialState = {
  students: [],
  selectedStudent: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalStudents: 0,
    hasNext: false,
    hasPrev: false,
  },
  filters: {
    search: '',
    standard: '',
    section: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  loading: false,
  error: null,
  actionLoading: {
    create: false,
    update: false,
    delete: false,
    photo: false,
  },
};

const studentSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSelectedStudent: (state) => {
      state.selectedStudent = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetStudents: (state) => {
      state.students = [];
      state.pagination = initialState.pagination;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Students
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload.students;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Single Student
      .addCase(fetchStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedStudent = action.payload;
      })
      .addCase(fetchStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Student
      .addCase(createStudent.pending, (state) => {
        state.actionLoading.create = true;
        state.error = null;
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.actionLoading.create = false;
        state.students.unshift(action.payload);
        state.pagination.totalStudents += 1;
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.actionLoading.create = false;
        state.error = action.payload;
      })
      // Update Student
      .addCase(updateStudent.pending, (state) => {
        state.actionLoading.update = true;
        state.error = null;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.actionLoading.update = false;
        const index = state.students.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
          state.students[index] = action.payload;
        }
        if (state.selectedStudent?._id === action.payload._id) {
          state.selectedStudent = action.payload;
        }
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.actionLoading.update = false;
        state.error = action.payload;
      })
      // Delete Student
      .addCase(deleteStudent.pending, (state) => {
        state.actionLoading.delete = true;
        state.error = null;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.actionLoading.delete = false;
        state.students = state.students.filter(s => s._id !== action.payload);
        state.pagination.totalStudents -= 1;
        if (state.selectedStudent?._id === action.payload) {
          state.selectedStudent = null;
        }
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.actionLoading.delete = false;
        state.error = action.payload;
      })
      // Upload Photo
      .addCase(uploadStudentPhoto.pending, (state) => {
        state.actionLoading.photo = true;
        state.error = null;
      })
      .addCase(uploadStudentPhoto.fulfilled, (state, action) => {
        state.actionLoading.photo = false;
        const { id, photoUrl } = action.payload;
        const student = state.students.find(s => s._id === id);
        if (student) {
          student.profilePhoto = { url: photoUrl };
        }
        if (state.selectedStudent?._id === id) {
          state.selectedStudent.profilePhoto = { url: photoUrl };
        }
      })
      .addCase(uploadStudentPhoto.rejected, (state, action) => {
        state.actionLoading.photo = false;
        state.error = action.payload;
      })
      // Delete Photo
      .addCase(deleteStudentPhoto.fulfilled, (state, action) => {
        const id = action.payload;
        const student = state.students.find(s => s._id === id);
        if (student) {
          student.profilePhoto = { url: null };
        }
        if (state.selectedStudent?._id === id) {
          state.selectedStudent.profilePhoto = { url: null };
        }
      });
  },
});

export const { setFilters, clearSelectedStudent, clearError, resetStudents } = studentSlice.actions;
export default studentSlice.reducer;