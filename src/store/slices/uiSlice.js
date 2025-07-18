import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: false,
  theme: 'light',
  snackbar: {
    open: false,
    message: '',
    severity: 'success',
  },
  dialogs: {
    addStudent: false,
    editStudent: false,
    studentDetails: false,
    addStaff: false,
    editStaff: false,
    staffDetails: false,
    permissions: false,
    confirmDelete: false,
  },
  loading: {
    global: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    showSnackbar: (state, action) => {
      state.snackbar = {
        open: true,
        message: action.payload.message,
        severity: action.payload.severity || 'success',
      };
    },
    hideSnackbar: (state) => {
      state.snackbar.open = false;
    },
    openDialog: (state, action) => {
      state.dialogs[action.payload] = true;
    },
    closeDialog: (state, action) => {
      state.dialogs[action.payload] = false;
    },
    closeAllDialogs: (state) => {
      Object.keys(state.dialogs).forEach(dialog => {
        state.dialogs[dialog] = false;
      });
    },
    setGlobalLoading: (state, action) => {
      state.loading.global = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  showSnackbar,
  hideSnackbar,
  openDialog,
  closeDialog,
  closeAllDialogs,
  setGlobalLoading,
} = uiSlice.actions;

export default uiSlice.reducer;