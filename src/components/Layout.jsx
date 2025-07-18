import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Dashboard,
  People,
  School,
  Settings,
  Logout,
  Menu as MenuIcon,
  AccountCircle
} from '@mui/icons-material';
import { logout } from '../store/slices/authSlice';
import { toggleSidebar, setSidebarOpen } from '../store/slices/uiSlice';

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { user } = useSelector(state => state.auth);
  const { sidebarOpen } = useSelector(state => state.ui);
  const [anchorEl, setAnchorEl] = useState(null);

  const drawerWidth = 280;

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

  const handleLogout = () => {
    const refreshToken = localStorage.getItem('refreshToken');
    dispatch(logout(refreshToken));
    navigate('/login');
    setAnchorEl(null);
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
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => dispatch(toggleSidebar())}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Student Management System
          </Typography>
          <IconButton
            color="inherit"
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <Avatar sx={{ bgcolor: 'secondary.main' }}>
              {user?.name?.firstName?.charAt(0) || user?.fullName?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => { setAnchorEl(null); navigate('/profile'); }}>
              <AccountCircle sx={{ mr: 1 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={() => setAnchorEl(null)}>
              <Settings sx={{ mr: 1 }} />
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
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

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;