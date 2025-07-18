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
  MenuItem
} from '@mui/material';
import { MoreVert, Edit, Delete, Visibility } from '@mui/icons-material';

const StudentList = ({ students, onView, onEdit, onDelete, userPermissions }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedStudent, setSelectedStudent] = React.useState(null);

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

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Student</TableCell>
            <TableCell>Student ID</TableCell>
            <TableCell>Standard</TableCell>
            <TableCell>Grade</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Typography variant="body2" color="text.secondary">
                  No students found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            students.map((student) => (
              <TableRow key={student._id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={student.profilePhoto?.url}
                      alt={`${student.name.firstName} ${student.name.lastName}`}
                    >
                      {student.name.firstName.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">
                        {`${student.name.firstName} ${student.name.lastName}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {student.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{student.studentId}</TableCell>
                <TableCell>
                  <Chip 
                    label={`${student.standard}-${student.section}`} 
                    size="small" 
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={student.overallGrade} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={student.isActive ? 'Active' : 'Inactive'} 
                    size="small" 
                    color={student.isActive ? 'success' : 'error'}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={(e) => handleMenuClick(e, student)}
                    size="small"
                  >
                    <MoreVert />
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