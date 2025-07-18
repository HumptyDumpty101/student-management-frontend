import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Dashboard,
  People,
  School
} from '@mui/icons-material';
import { setSidebarOpen } from '../../store/slices/uiSlice';

const Sidebar = ({ drawerWidth }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { user } = useSelector(state => state.auth);
  const { sidebarOpen } = useSelector(state => state.ui);

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard', permission: null },
    { text: 'Students', icon: <School />, path: '/students', permission: 'students.read' },
    ...(user?.role === 'superAdmin' ? [
      { text: 'Staff', icon: <People />, path: '/staff', permission: null }
    ] : []),
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      dispatch(setSidebarOpen(false));
    }
  };

  const canAccess = (permission) => {
    if (!permission) return true;
    if (user?.role === 'superAdmin') return true;
    const [module, action] = permission.split('.');
    return user?.permissions?.[module]?.[action] || false;
  };

  const drawer = (
    <Box>
      <Box sx={{ p: 2, textAlign: 'center', borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" color="primary" fontWeight="bold">
          School Management
        </Typography>
      </Box>
      <List>
        {menuItems.filter(item => canAccess(item.permission)).map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              sx={{ 
                px: 3, 
                py: 1.5,
                bgcolor: location.pathname.startsWith(item.path) ? 'primary.light' : 'transparent',
                color: location.pathname.startsWith(item.path) ? 'primary.contrastText' : 'inherit',
                '&:hover': {
                  bgcolor: location.pathname.startsWith(item.path) ? 'primary.light' : 'action.hover'
                }
              }}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon sx={{ 
                color: location.pathname.startsWith(item.path) ? 'primary.contrastText' : 'primary.main' 
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{ 
                  fontWeight: location.pathname.startsWith(item.path) ? 600 : 500
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      <Drawer
        variant="temporary"
        open={sidebarOpen}
        onClose={() => dispatch(setSidebarOpen(false))}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;

