import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Refresh, Home, ErrorOutline } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to monitoring service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            p: 3,
            bgcolor: 'background.default'
          }}
        >
          <Paper sx={{ p: 4, maxWidth: 500, textAlign: 'center' }}>
            <ErrorOutline sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
            <Typography variant="h5" color="error" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </Button>
              <Button
                variant="outlined"
                startIcon={<Home />}
                onClick={() => window.location.href = '/'}
              >
                Go Home
              </Button>
            </Box>
            
            {process.env.NODE_ENV === 'development' && (
              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="caption" color="error" sx={{ fontFamily: 'monospace' }}>
                  {this.state.error && this.state.error.toString()}
                </Typography>
                <br />
                <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;