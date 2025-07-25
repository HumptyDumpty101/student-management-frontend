import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Snackbar, Alert, Slide } from '@mui/material';
import { hideSnackbar } from '../../store/slices/uiSlice';

const SlideTransition = (props) => {
  return <Slide {...props} direction="left" />;
};

const GlobalSnackbar = () => {
  const dispatch = useDispatch();
  const { snackbar } = useSelector(state => state.ui);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(hideSnackbar());
  };

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      TransitionComponent={SlideTransition}
    >
      <Alert
        onClose={handleClose}
        severity={snackbar.severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalSnackbar;