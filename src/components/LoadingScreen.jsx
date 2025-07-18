import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { School } from '@mui/icons-material';

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        gap: 2
      }}
    >
      <School sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
      <CircularProgress size={60} thickness={4} />
      <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
        Loading...
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Please wait while we set up your dashboard
      </Typography>
    </Box>
  );
};

export default LoadingScreen;