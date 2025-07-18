// Export utility functions
export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle nested objects and arrays
        if (typeof value === 'object' && value !== null) {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        }
        // Handle strings with commas
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(',')
    )
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const exportStudentsToCSV = (students) => {
  if (!students || students.length === 0) {
    alert('No students to export');
    return;
  }

  // Transform student data for CSV export
  const exportData = students.map(student => ({
    'Student ID': student.studentId,
    'First Name': student.name?.firstName || '',
    'Last Name': student.name?.lastName || '',
    'Email': student.email || '',
    'Date of Birth': student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : '',
    'Gender': student.gender || '',
    'Standard': student.standard || '',
    'Section': student.section || '',
    'Roll Number': student.rollNumber || '',
    'Overall Grade': student.overallGrade || '',
    'Overall Percentage': student.overallPercentage || '',
    'Blood Group': student.bloodGroup || '',
    'Status': student.isActive ? 'Active' : 'Inactive',
    'Created At': student.createdAt ? new Date(student.createdAt).toLocaleDateString() : ''
  }));

  const filename = `students_export_${new Date().toISOString().split('T')[0]}`;
  exportToCSV(exportData, filename);
};

export const exportStaffToCSV = (staff) => {
  if (!staff || staff.length === 0) {
    alert('No staff to export');
    return;
  }

  // Transform staff data for CSV export
  const exportData = staff.map(member => ({
    'Employee ID': member.employeeId,
    'First Name': member.name?.firstName || '',
    'Last Name': member.name?.lastName || '',
    'Email': member.email || '',
    'Phone': member.phone || '',
    'Department': member.department || '',
    'Position': member.position || '',
    'Role': member.role || '',
    'Status': member.isActive ? 'Active' : 'Inactive',
    'Created At': member.createdAt ? new Date(member.createdAt).toLocaleDateString() : ''
  }));

  const filename = `staff_export_${new Date().toISOString().split('T')[0]}`;
  exportToCSV(exportData, filename);
};