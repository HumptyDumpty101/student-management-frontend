import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Avatar,
  Box,
  Typography,
  Menu,
  MenuItem,
  Card,
  CardContent,
  Stack,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { MoreVert, Edit, Delete, Visibility } from '@mui/icons-material';

const StaffList = ({ staff, onView, onEdit, onDelete, userPermissions }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedStaff, setSelectedStaff] = React.useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleMenuClick = (event, staffMember) => {
    setAnchorEl(event.currentTarget);
    setSelectedStaff(staffMember);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStaff(null);
  };

  const handleAction = (action) => {
    if (selectedStaff) {
      switch (action) {
        case 'view':
          onView(selectedStaff);
          break;
        case 'edit':
          onEdit(selectedStaff);
          break;
        case 'delete':
          onDelete(selectedStaff);
          break;
      }
    }
    handleMenuClose();
  };

  // Mobile Card Layout
  const renderMobileCards = () => {
    if (staff.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            No staff found
          </Typography>
        </Box>
      );
    }

    return (
      <Stack spacing={2}>
        {staff.map((staffMember) => (
          <Card key={staffMember._id} variant="outlined">
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={staffMember.profilePhoto?.url}
                  alt={`${staffMember.name.firstName} ${staffMember.name.lastName}`}
                  sx={{ width: 48, height: 48 }}
                >
                  {staffMember.name.firstName.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {`${staffMember.name.firstName} ${staffMember.name.lastName}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {staffMember.email}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip 
                      label={staffMember.department} 
                      size="small" 
                      variant="outlined"
                    />
                    <Chip 
                      label={staffMember.isActive ? 'Active' : 'Inactive'} 
                      size="small" 
                      color={staffMember.isActive ? 'success' : 'error'}
                    />
                  </Box>
                </Box>
                <IconButton
                  onClick={(e) => handleMenuClick(e, staffMember)}
                  size="small"
                >
                  <MoreVert />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    );
  };

  if (isMobile) {
    return (
      <Box>
        {renderMobileCards()}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleAction('view')}>
            <Visibility sx={{ mr: 1 }} />
            View Details
          </MenuItem>
          {userPermissions?.staff?.update && (
            <MenuItem onClick={() => handleAction('edit')}>
              <Edit sx={{ mr: 1 }} />
              Edit
            </MenuItem>
          )}
          {userPermissions?.staff?.delete && (
            <MenuItem onClick={() => handleAction('delete')}>
              <Delete sx={{ mr: 1 }} />
              Delete
            </MenuItem>
          )}
        </Menu>
      </Box>
    );
  }

  return (
    <TableContainer 
      component={Paper}
      sx={{ 
        overflowX: 'auto',
        maxWidth: 'calc(100vw - 48px)', // Account for page padding
        width: '100%',
        margin: 0,
        '& .MuiTable-root': {
          minWidth: { xs: 400, sm: 600, md: 750 },
          width: '100%',
          tableLayout: 'fixed'
        },
        '& .MuiTableCell-root': {
          wordWrap: 'break-word',
          wordBreak: 'break-word'
        }
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ minWidth: { xs: 180, sm: 200 }, width: { xs: '40%', sm: '35%' } }}>Staff Member</TableCell>
            <TableCell sx={{ minWidth: { xs: 100, sm: 120 }, width: { xs: '30%', sm: '25%' } }}>Department</TableCell>
            <TableCell sx={{ minWidth: 100, width: '20%', display: { xs: 'none', sm: 'table-cell' } }}>Email</TableCell>
            <TableCell sx={{ minWidth: { xs: 80, sm: 100 }, width: { xs: '20%', sm: '15%' } }}>Status</TableCell>
            <TableCell sx={{ minWidth: 60, width: { xs: '10%', sm: '5%' } }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {staff.length === 0 ? (
            <TableRow>
              <TableCell colSpan={{ xs: 4, sm: 5 }} align="center">
                <Typography variant="body2" color="text.secondary">
                  No staff found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            staff.map((staffMember) => (
              <TableRow key={staffMember._id} hover>
                <TableCell sx={{ width: { xs: '40%', sm: '35%' }, p: { xs: 1, sm: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1.5 } }}>
                    <Avatar
                      src={staffMember.profilePhoto?.url}
                      alt={`${staffMember.name.firstName} ${staffMember.name.lastName}`}
                      sx={{ width: { xs: 28, sm: 36 }, height: { xs: 28, sm: 36 } }}
                    >
                      {staffMember.name.firstName.charAt(0)}
                    </Avatar>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography 
                        variant="subtitle2"
                        sx={{ 
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          lineHeight: 1.2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {`${staffMember.name.firstName} ${staffMember.name.lastName}`}
                      </Typography>
                      {staffMember.email && (
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            fontSize: { xs: '0.625rem', sm: '0.75rem' },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: { xs: 'block', sm: 'none' }
                          }}
                        >
                          {staffMember.email}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ width: { xs: '30%', sm: '25%' }, p: { xs: 1, sm: 2 } }}>
                  <Chip 
                    label={staffMember.department} 
                    size="small" 
                    variant="outlined"
                    sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                  />
                </TableCell>
                <TableCell sx={{ width: '20%', display: { xs: 'none', sm: 'table-cell' }, p: 2 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontSize: '0.875rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {staffMember.email}
                  </Typography>
                </TableCell>
                <TableCell sx={{ width: { xs: '20%', sm: '15%' }, p: { xs: 1, sm: 2 } }}>
                  <Chip 
                    label={staffMember.isActive ? 'Active' : 'Inactive'} 
                    size="small" 
                    color={staffMember.isActive ? 'success' : 'error'}
                    sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                  />
                </TableCell>
                <TableCell sx={{ width: { xs: '10%', sm: '5%' }, p: { xs: 0.5, sm: 2 } }}>
                  <IconButton
                    onClick={(e) => handleMenuClick(e, staffMember)}
                    size="small"
                    sx={{ p: { xs: 0.5, sm: 1 } }}
                  >
                    <MoreVert sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleAction('view')}>
          <Visibility sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        {userPermissions?.staff?.update && (
          <MenuItem onClick={() => handleAction('edit')}>
            <Edit sx={{ mr: 1 }} />
            Edit
          </MenuItem>
        )}
        {userPermissions?.staff?.delete && (
          <MenuItem onClick={() => handleAction('delete')}>
            <Delete sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        )}
      </Menu>
    </TableContainer>
  );
};

export default StaffList;