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

const StudentList = ({ students, onView, onEdit, onDelete, userPermissions }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedStudent, setSelectedStudent] = React.useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleMenuClick = (event, student) => {
    setAnchorEl(event.currentTarget);
    setSelectedStudent(student);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStudent(null);
  };

  const handleAction = (action) => {
    if (selectedStudent) {
      switch (action) {
        case 'view':
          onView(selectedStudent);
          break;
        case 'edit':
          onEdit(selectedStudent);
          break;
        case 'delete':
          onDelete(selectedStudent);
          break;
      }
    }
    handleMenuClose();
  };

  // Mobile Card Layout
  const renderMobileCards = () => {
    if (students.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            No students found
          </Typography>
        </Box>
      );
    }

    return (
      <Stack spacing={2}>
        {students.map((student) => (
          <Card key={student._id} variant="outlined">
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={student.profilePhoto?.url}
                  alt={`${student.name.firstName} ${student.name.lastName}`}
                  sx={{ width: 48, height: 48 }}
                >
                  {student.name.firstName.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {`${student.name.firstName} ${student.name.lastName}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    ID: {student.studentId}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip 
                      label={`${student.standard}-${student.section}`} 
                      size="small" 
                      variant="outlined"
                    />
                    <Chip 
                      label={student.overallGrade} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                    <Chip 
                      label={student.isActive ? 'Active' : 'Inactive'} 
                      size="small" 
                      color={student.isActive ? 'success' : 'error'}
                    />
                  </Box>
                </Box>
                <IconButton
                  onClick={(e) => handleMenuClick(e, student)}
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
          {userPermissions?.students?.update && (
            <MenuItem onClick={() => handleAction('edit')}>
              <Edit sx={{ mr: 1 }} />
              Edit
            </MenuItem>
          )}
          {userPermissions?.students?.delete && (
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
          minWidth: { xs: 380, sm: 600, md: 750 },
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
            <TableCell sx={{ minWidth: { xs: 160, sm: 180 }, width: { xs: '40%', sm: '35%' } }}>Student</TableCell>
            <TableCell sx={{ minWidth: { xs: 100, sm: 120 }, width: { xs: '25%', sm: '20%' } }}>Student ID</TableCell>
            <TableCell sx={{ minWidth: 90, width: '15%', display: { xs: 'none', sm: 'table-cell' } }}>Standard</TableCell>
            <TableCell sx={{ minWidth: 80, width: '10%', display: { xs: 'none', md: 'table-cell' } }}>Grade</TableCell>
            <TableCell sx={{ minWidth: { xs: 80, sm: 100 }, width: { xs: '25%', sm: '15%' } }}>Status</TableCell>
            <TableCell sx={{ minWidth: 60, width: { xs: '10%', sm: '5%' } }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={{ xs: 4, sm: 5, md: 6 }} align="center">
                <Typography variant="body2" color="text.secondary">
                  No students found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            students.map((student) => (
              <TableRow key={student._id} hover>
                <TableCell sx={{ width: { xs: '40%', sm: '35%' }, p: { xs: 1, sm: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1.5 } }}>
                    <Avatar
                      src={student.profilePhoto?.url}
                      alt={`${student.name.firstName} ${student.name.lastName}`}
                      sx={{ width: { xs: 28, sm: 36 }, height: { xs: 28, sm: 36 } }}
                    >
                      {student.name.firstName.charAt(0)}
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
                        {`${student.name.firstName} ${student.name.lastName}`}
                      </Typography>
                      {student.email && (
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            fontSize: { xs: '0.625rem', sm: '0.75rem' },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: { xs: 'none', sm: 'block' }
                          }}
                        >
                          {student.email}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ width: { xs: '25%', sm: '20%' }, p: { xs: 1, sm: 2 } }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      fontWeight: 500,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {student.studentId}
                  </Typography>
                </TableCell>
                <TableCell sx={{ width: '15%', display: { xs: 'none', sm: 'table-cell' }, p: 2 }}>
                  <Chip 
                    label={`${student.standard}-${student.section}`} 
                    size="small" 
                    variant="outlined"
                  />
                </TableCell>
                <TableCell sx={{ width: '10%', display: { xs: 'none', md: 'table-cell' }, p: 2 }}>
                  <Chip 
                    label={student.overallGrade} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                </TableCell>
                <TableCell sx={{ width: { xs: '25%', sm: '15%' }, p: { xs: 1, sm: 2 } }}>
                  <Chip 
                    label={student.isActive ? 'Active' : 'Inactive'} 
                    size="small" 
                    color={student.isActive ? 'success' : 'error'}
                    sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                  />
                </TableCell>
                <TableCell sx={{ width: { xs: '10%', sm: '5%' }, p: { xs: 0.5, sm: 2 } }}>
                  <IconButton
                    onClick={(e) => handleMenuClick(e, student)}
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
        {userPermissions?.students?.update && (
          <MenuItem onClick={() => handleAction('edit')}>
            <Edit sx={{ mr: 1 }} />
            Edit
          </MenuItem>
        )}
        {userPermissions?.students?.delete && (
          <MenuItem onClick={() => handleAction('delete')}>
            <Delete sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        )}
      </Menu>
    </TableContainer>
  );
};

export default StudentList;