'use client';

import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Menu, MenuItem, Chip, Select, FormControl, ListItemIcon, ListItemText } from '@mui/material';
import { useSelector } from 'react-redux';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PeopleIcon from '@mui/icons-material/People';
import ViewDataModal from '../../../../components/employee/ViewDataModal';
import CreateEmployeeModal from '../../../../components/employee/CreateEmployeeModal';
import AllEmployeesModal from '../../../../components/employee/AllEmployeesModal';

export default function EmployeeDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [viewDataOpen, setViewDataOpen] = useState(false);
  const [createEmployeeOpen, setCreateEmployeeOpen] = useState(false);
  const [allEmployeesOpen, setAllEmployeesOpen] = useState(false);
  const [viewMode, setViewMode] = useState('view'); // 'view' or 'fill'
  
  // Check if user is super admin
  const isSuperAdmin = user?.role === 'super_admin';

  // Dummy data
  const stats = {
    totalAssigned: 25,
    totalCompleted: 18,
    totalPending: 7,
  };

  const jobs = [
    { id: 1, jobTitle: 'Senior Software Engineer', applicant: 'John Doe', status: 'Pending', link: 'https://linkedin.com/jobs/123', date: '2024-01-15' },
    { id: 2, jobTitle: 'Full Stack Developer', applicant: 'Jane Smith', status: 'Completed', link: 'https://indeed.com/job/456', date: '2024-01-14' },
    { id: 3, jobTitle: 'Frontend Developer', applicant: 'Bob Johnson', status: 'Pending', link: 'https://glassdoor.com/job/789', date: '2024-01-13' },
  ];

  const handleMenuOpen = (event, job) => {
    setAnchorEl(event.currentTarget);
    setSelectedJob(job);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedJob(null);
  };

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link);
    handleMenuClose();
  };

  const handleStatusChange = (jobId, newStatus) => {
    // Update status logic here
    console.log(`Updating job ${jobId} status to ${newStatus}`);
  };

  const handleAction = (action) => {
    if (action === 'view' || action === 'fill') {
      setViewMode(action);
      setViewDataOpen(true);
    } else if (action === 'notify') {
      // WhatsApp notification logic
      console.log('Notify on WhatsApp:', selectedJob);
    } else if (action === 'delete') {
      // Delete logic
      console.log('Delete:', selectedJob);
    } else if (action === 'email') {
      // Send email logic
      console.log('Send email:', selectedJob);
    }
    handleMenuClose();
  };

  const handleCreateEmployeeSuccess = (employee) => {
    console.log('Employee created:', employee);
    // You can add a toast notification or refresh employee list here
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
          Dashboard
        </Typography>
        {isSuperAdmin && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<PeopleIcon />}
              onClick={() => setAllEmployeesOpen(true)}
              sx={{
                borderColor: '#2463eb',
                color: '#2463eb',
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '8px',
                px: 3,
                py: 1,
                '&:hover': {
                  borderColor: '#1d4ed8',
                  bgcolor: '#e0e7ff',
                },
              }}
            >
              All Employees
            </Button>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={() => setCreateEmployeeOpen(true)}
              sx={{
                bgcolor: '#2463eb',
                color: 'white',
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '8px',
                px: 3,
                py: 1,
                '&:hover': {
                  bgcolor: '#1d4ed8',
                },
              }}
            >
              Create Employee
            </Button>
          </Box>
        )}
      </Box>

      {/* Summary Boxes */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
            <Typography sx={{ fontSize: '0.875rem', color: '#64748b', mb: 1 }}>Total Jobs Assigned</Typography>
            <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a' }}>{stats.totalAssigned}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
            <Typography sx={{ fontSize: '0.875rem', color: '#64748b', mb: 1 }}>Total Completed</Typography>
            <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: '#16a34a' }}>{stats.totalCompleted}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
            <Typography sx={{ fontSize: '0.875rem', color: '#64748b', mb: 1 }}>Total Pending</Typography>
            <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: '#f59e0b' }}>{stats.totalPending}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Jobs Table */}
      <Paper elevation={0} sx={{ borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>Job title</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>Applicant</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>Link</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                  <TableCell sx={{ color: '#0f172a', fontSize: '0.875rem' }}>{job.jobTitle}</TableCell>
                  <TableCell sx={{ color: '#0f172a', fontSize: '0.875rem' }}>{job.applicant}</TableCell>
                  <TableCell>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select value={job.status} onChange={(e) => handleStatusChange(job.id, e.target.value)} sx={{ fontSize: '0.875rem', height: '32px' }}>
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleCopyLink(job.link)} sx={{ color: '#2463eb' }}>
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                  <TableCell sx={{ color: '#64748b', fontSize: '0.875rem' }}>{new Date(job.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, job)}>
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Action Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleAction('notify')}>
          <ListItemIcon><WhatsAppIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Notify on WhatsApp</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('email')}>
          <ListItemIcon><EmailIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Send Email</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('fill')}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Fill Data</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('view')}>
          <ListItemIcon><VisibilityIcon fontSize="small" /></ListItemIcon>
          <ListItemText>View Data</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('delete')} sx={{ color: '#ef4444' }}>
          <ListItemIcon sx={{ color: 'inherit' }}><DeleteIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* View/Fill Data Modal */}
      <ViewDataModal open={viewDataOpen} onClose={() => setViewDataOpen(false)} job={selectedJob} mode={viewMode} />
      
      {/* Create Employee Modal */}
      <CreateEmployeeModal 
        open={createEmployeeOpen} 
        onClose={() => setCreateEmployeeOpen(false)}
        onSuccess={handleCreateEmployeeSuccess}
      />
      
      {/* All Employees Modal */}
      <AllEmployeesModal 
        open={allEmployeesOpen} 
        onClose={() => setAllEmployeesOpen(false)}
      />
    </Box>
  );
}

