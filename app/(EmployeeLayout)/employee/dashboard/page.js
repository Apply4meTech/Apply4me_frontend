'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Button, 
  IconButton, 
  Menu, 
  MenuItem, 
  Chip, 
  Select, 
  FormControl, 
  InputLabel,
  ListItemIcon, 
  ListItemText,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Input,
  TablePagination,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSelector } from 'react-redux';
import MuiLink from '@mui/material/Link';
import Link from 'next/link';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import EmailIcon from '@mui/icons-material/Email';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PeopleIcon from '@mui/icons-material/People';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DescriptionIcon from '@mui/icons-material/Description';
import AssignmentIcon from '@mui/icons-material/Assignment';
import NoteIcon from '@mui/icons-material/Note';
import SettingsIcon from '@mui/icons-material/Settings';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Tooltip from '@mui/material/Tooltip';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import ViewDataModal from '../../../../components/employee/ViewDataModal';
import NotesModal from '../../../../components/employee/NotesModal';
import CreateEmployeeModal from '../../../../components/employee/CreateEmployeeModal';
import AllEmployeesModal from '../../../../components/employee/AllEmployeesModal';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
const getApiUrl = () => {
  const url = API_URL;
  return url.endsWith('/api') ? url.slice(0, -4) : url;
};

export default function EmployeeDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [viewDataOpen, setViewDataOpen] = useState(false);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [createEmployeeOpen, setCreateEmployeeOpen] = useState(false);
  const [allEmployeesOpen, setAllEmployeesOpen] = useState(false);
  const [viewMode, setViewMode] = useState('view');
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailData, setEmailData] = useState({ emailAddress: '', subject: '', body: '', sent: false });
  const [sendingEmail, setSendingEmail] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadFileType, setUploadFileType] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [autoAssignEnabled, setAutoAssignEnabled] = useState(true);
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [employeeStats, setEmployeeStats] = useState([]);
  
  const [dashboardData, setDashboardData] = useState({
    totalJobs: 0,
    totalCompleted: 0,
    totalPending: 0,
    totalInProgress: 0,
    customerCount: 0,
    customerList: [],
    jobs: [],
  });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({ status: 'all', search: '', sortBy: 'title', sortOrder: 'asc' });
  const isSuperAdmin = user?.role === 'super_admin';

  useEffect(() => {
    if (isSuperAdmin) {
      fetchSettings();
      fetchEmployeeStats();
    }
  }, [isSuperAdmin]);

  useEffect(() => {
    fetchDashboardData();
  }, [filters, pagination.page, pagination.limit]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.search && { search: filters.search }),
        sortBy: filters.sortBy || 'title',
        sortOrder: filters.sortOrder || 'asc'
      });

      const response = await fetch(`${getApiUrl()}/api/employee/dashboard?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch dashboard data');
      }

      if (data.success) {
        setDashboardData(data.data);
        if (data.data.pagination) {
          setPagination(data.data.pagination);
        }
        return data.data;
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
    return null;
  };

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, search: searchInput.trim() }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleClear = () => {
    setSearchInput('');
    setFilters(prev => ({ ...prev, search: '' }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSortByTitle = () => {
    setFilters(prev => ({
      ...prev,
      sortBy: 'title',
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (e, page) => {
    setPagination(prev => ({ ...prev, page: page + 1 }));
  };

  const handleRowsPerPageChange = (e) => {
    setPagination(prev => ({
      ...prev,
      limit: parseInt(e.target.value, 10),
      page: 1
    }));
  };

  const handleMenuOpen = (event, job) => {
    setAnchorEl(event.currentTarget);
    setSelectedJob(job);
  };

  const handleMenuClose = (clearJob = true) => {
    setAnchorEl(null);
    if (clearJob) {
      setSelectedJob(null);
    }
  };

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link);
    handleMenuClose();
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${getApiUrl()}/api/employee/jobs/${jobId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Refresh dashboard data
        fetchDashboardData();
      } else {
        alert(data.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleAction = (action) => {
    if (action === 'view' || action === 'fill') {
      if (selectedJob) {
        setViewMode(action);
        setViewDataOpen(true);
        handleMenuClose(false); // Don't clear selectedJob yet
        return; // Return early to preserve selectedJob
      }
    } else if (action === 'notes') {
      if (selectedJob) {
        setNotesDialogOpen(true);
        handleMenuClose(false);
        return;
      }
    } else if (action === 'email') {
      if (selectedJob) {
        setEmailData({
          emailAddress: selectedJob.emailData?.emailAddress || selectedJob.applicantEmail || '',
          subject: selectedJob.emailData?.subject || '',
          body: selectedJob.emailData?.body || '',
          sent: selectedJob.emailData?.sent || false
        });
        setEmailDialogOpen(true);
        handleMenuClose(false); // Don't clear selectedJob yet
        return; // Return early
      }
    } else if (action === 'upload-resume') {
      if (selectedJob) {
        setUploadFileType('resume');
        setUploadDialogOpen(true);
        handleMenuClose(false); // Don't clear selectedJob yet
        return; // Return early
      }
    } else if (action === 'upload-coverletter') {
      if (selectedJob) {
        setUploadFileType('coverLetter');
        setUploadDialogOpen(true);
        handleMenuClose(false); // Don't clear selectedJob yet
        return; // Return early
      }
    } else if (action === 'upload-screenshot') {
      if (selectedJob) {
        setUploadFileType('screenshotProof');
        setUploadDialogOpen(true);
        handleMenuClose(false); // Don't clear selectedJob yet
        return; // Return early
      }
    } else if (action === 'assign') {
      if (isSuperAdmin && selectedJob) {
        // Keep selectedJob for the dialog
        fetchEmployees();
        setAssignDialogOpen(true);
        handleMenuClose(false); // Don't clear selectedJob
        return; // Return early
      }
    } else if (action === 'unassign') {
      if (isSuperAdmin && confirm('Are you sure you want to unassign this job?')) {
        handleUnassignJob();
      }
    } else if (action === 'delete') {
      if (confirm('Are you sure you want to delete this job?')) {
        handleDeleteJob();
      }
    }
    handleMenuClose();
  };

  const handleSaveEmail = async (sendEmail = false) => {
    if (!selectedJob) return;

    // Validate email address if sending
    if (sendEmail && !emailData.emailAddress?.trim()) {
      alert('Please enter an email address to send the email');
      return;
    }

    if (sendEmail && !emailData.subject?.trim()) {
      alert('Please enter a subject for the email');
      return;
    }

    try {
      setSendingEmail(sendEmail);
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${getApiUrl()}/api/employee/jobs/${selectedJob.id}/email`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...emailData,
          sendEmail: sendEmail
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (sendEmail && data.emailSent) {
          alert('Email sent successfully!');
        } else if (sendEmail && !data.emailSent) {
          alert('Failed to send email: ' + (data.details || 'Unknown error'));
        } else {
          alert('Email data saved successfully');
        }
        setEmailDialogOpen(false);
        fetchDashboardData();
      } else {
        alert(data.error || 'Failed to save email data');
      }
    } catch (error) {
      console.error('Error saving/sending email:', error);
      alert('Failed to ' + (sendEmail ? 'send' : 'save') + ' email');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedJob || !uploadFileType) return;

    try {
      setUploading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${getApiUrl()}/api/employee/jobs/${selectedJob.id}/files/${uploadFileType}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(`${uploadFileType} uploaded successfully`);
        setUploadDialogOpen(false);
        setUploadFileType(null);
        fetchDashboardData();
      } else {
        alert(data.error || 'Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteJob = async () => {
    if (!selectedJob) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${getApiUrl()}/api/employee/jobs/${selectedJob.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('Job deleted successfully');
        fetchDashboardData();
      } else {
        alert(data.error || 'Failed to delete job');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job');
    }
  };

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${getApiUrl()}/api/auth/employee/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setEmployees(data.employees || []);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const handleAssignJob = async () => {
    if (!selectedJob || !selectedEmployeeId) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${getApiUrl()}/api/employee/jobs/${selectedJob.id}/assign`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ employeeId: selectedEmployeeId })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('Job assigned successfully');
        setAssignDialogOpen(false);
        setSelectedEmployeeId('');
        setSelectedJob(null); // Clear selected job after assignment
        fetchDashboardData();
      } else {
        alert(data.error || 'Failed to assign job');
      }
    } catch (error) {
      console.error('Error assigning job:', error);
      alert('Failed to assign job');
    }
  };

  const handleUnassignJob = async () => {
    if (!selectedJob) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${getApiUrl()}/api/employee/jobs/${selectedJob.id}/unassign`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('Job unassigned successfully');
        fetchDashboardData();
      } else {
        alert(data.error || 'Failed to unassign job');
      }
    } catch (error) {
      console.error('Error unassigning job:', error);
      alert('Failed to unassign job');
    }
  };

  const fetchSettings = async () => {
    try {
      setLoadingSettings(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${getApiUrl()}/api/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAutoAssignEnabled(data.settings.autoAssignEnabled);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoadingSettings(false);
    }
  };

  const fetchEmployeeStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${getApiUrl()}/api/settings/employee-stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setEmployeeStats(data.employeeStats || []);
      }
    } catch (error) {
      console.error('Error fetching employee stats:', error);
    }
  };

  const handleToggleAutoAssign = async (event) => {
    const newValue = event.target.checked;
    setAutoAssignEnabled(newValue);

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${getApiUrl()}/api/settings`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ autoAssignEnabled: newValue })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        // Revert on error
        setAutoAssignEnabled(!newValue);
        alert(data.error || 'Failed to update settings');
      } else {
        alert(`Auto-assign ${newValue ? 'enabled' : 'disabled'} successfully`);
        fetchEmployeeStats(); // Refresh stats
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      // Revert on error
      setAutoAssignEnabled(!newValue);
      alert('Failed to update settings');
    }
  };

  const getStatusColor = (status) => {
    const statusMap = {
      'pending': { bg: '#fef3c7', color: '#d97706' },
      'assigned': { bg: '#f3e8ff', color: '#9333ea' },
      'in_progress': { bg: '#dbeafe', color: '#1d4ed8' },
      'applied': { bg: '#eff6ff', color: '#2463eb' },
      'response': { bg: '#dcfce7', color: '#16a34a' },
      'rejected': { bg: '#fee2e2', color: '#dc2626' },
      'completed': { bg: '#dcfce7', color: '#16a34a' }
    };
    return statusMap[status] || { bg: '#f1f5f9', color: '#64748b' };
  };

  const formatStatus = (status) => {
    if (status === 'in_progress') return 'In Progress';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        justifyContent: { sm: 'space-between' }, 
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: { xs: 2, sm: 0 }
      }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: { xs: 0, sm: 1 } }}>
          Dashboard
        </Typography>
        {isSuperAdmin && (
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, flexWrap: 'nowrap', minWidth: 0 }}>
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
                px: { xs: 2, sm: 3 },
                py: 1,
                flex: { xs: 1, sm: 'none' },
                minWidth: 0,
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
                px: { xs: 2, sm: 3 },
                py: 1,
                flex: { xs: 1, sm: 'none' },
                minWidth: 0,
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

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Auto-Assign Settings (Super Admin Only) */}
      {isSuperAdmin && (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: '12px', 
            border: '1px solid #e2e8f0', 
            bgcolor: 'white' 
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <SettingsIcon sx={{ color: '#2463eb', fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
              <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1.125rem' }, fontWeight: 600, color: '#0f172a' }}>
                Auto-Assign Settings
              </Typography>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={autoAssignEnabled}
                  onChange={handleToggleAutoAssign}
                  disabled={loadingSettings}
                  size="small"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#2463eb',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#2463eb',
                    },
                  }}
                />
              }
              label={
                <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, color: '#64748b' }}>
                  {autoAssignEnabled ? 'Enabled' : 'Disabled'}
                </Typography>
              }
            />
          </Box>
          <Typography sx={{ fontSize: '0.875rem', color: '#64748b', mb: 2 }}>
            When enabled, new jobs will be automatically assigned to the employee with the least pending jobs.
            When disabled, only manual assignment by super admin is allowed.
          </Typography>
          
          {/* Employee Statistics */}
          {employeeStats.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', mb: 1.5 }}>
                Employee Workload (Sorted by Pending Jobs)
              </Typography>
              <Grid container spacing={2}>
                {employeeStats.map((emp) => (
                  <Grid item xs={12} sm={6} md={4} key={emp.id}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        bgcolor: '#f8fafc',
                      }}
                    >
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', mb: 0.5 }}>
                        {emp.name}
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: '#64748b', mb: 1 }}>
                        {emp.email}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box>
                          <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>Pending</Typography>
                          <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#f59e0b' }}>
                            {emp.pendingJobs}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>Total</Typography>
                          <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>
                            {emp.totalJobs}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Paper>
      )}

      {/* Summary Boxes */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
            <Typography sx={{ fontSize: '0.875rem', color: '#64748b', mb: 1 }}>
              {isSuperAdmin ? 'Total Jobs' : 'Total Jobs Assigned'}
            </Typography>
            <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a' }}>
              {dashboardData.totalJobs}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
            <Typography sx={{ fontSize: '0.875rem', color: '#64748b', mb: 1 }}>
              {isSuperAdmin ? 'Total Completed' : 'My Completed'}
            </Typography>
            <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: '#16a34a' }}>
              {dashboardData.totalCompleted}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
            <Typography sx={{ fontSize: '0.875rem', color: '#64748b', mb: 1 }}>
              {isSuperAdmin ? 'Total Pending' : 'My Pending'}
            </Typography>
            <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: '#f59e0b' }}>
              {dashboardData.totalPending}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
            <Typography sx={{ fontSize: '0.875rem', color: '#64748b', mb: 1 }}>
              {isSuperAdmin ? 'Total In Progress' : 'My In Progress'}
            </Typography>
            <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: '#1d4ed8' }}>
              {dashboardData.totalInProgress ?? 0}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Tooltip
            arrow
            placement="top"
            enterDelay={200}
            disableInteractive={false}
            disableHoverListener={(dashboardData.customerCount ?? 0) === 0}
            slotProps={{
              tooltip: {
                sx: {
                  maxWidth: 380,
                  bgcolor: '#1e293b',
                  p: 1.5,
                  borderRadius: '10px',
                },
              },
            }}
            title={
              (dashboardData.customerList?.length ?? 0) > 0 ? (
                <Box>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#e2e8f0', mb: 1 }}>
                    {isSuperAdmin ? 'All registered customers' : 'Your customers'}
                  </Typography>
                  <Box sx={{ maxHeight: 240, overflowY: 'auto', pr: 0.5 }}>
                    {dashboardData.customerList.map((c) => (
                      <Box
                        key={c.id}
                        sx={{
                          py: 0.75,
                          borderBottom: '1px solid rgba(255,255,255,0.08)',
                          '&:last-child': { borderBottom: 'none' },
                        }}
                      >
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc', lineHeight: 1.3 }}>
                          {c.name}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', wordBreak: 'break-all' }}>
                          {c.email}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  {isSuperAdmin && (
                    <Typography
                      component={Link}
                      href="/employee/admin/customers"
                      sx={{
                        display: 'block',
                        mt: 1.25,
                        fontSize: '0.7rem',
                        color: '#93c5fd',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      Open Customers for full onboarding →
                    </Typography>
                  )}
                </Box>
              ) : (
                <Typography sx={{ fontSize: '0.8rem' }}>No customers yet</Typography>
              )
            }
          >
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                bgcolor: 'white',
                cursor: (dashboardData.customerCount ?? 0) > 0 ? 'help' : 'default',
                transition: 'box-shadow 0.2s, border-color 0.2s',
                '&:hover':
                  (dashboardData.customerCount ?? 0) > 0
                    ? {
                        borderColor: '#c4b5fd',
                        boxShadow: '0 4px 12px rgba(124, 58, 237, 0.12)',
                      }
                    : {},
              }}
            >
              <Typography sx={{ fontSize: '0.875rem', color: '#64748b', mb: 1 }}>
                {isSuperAdmin ? 'Total Customers' : 'My Customers'}
              </Typography>
              <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: '#7c3aed' }}>
                {dashboardData.customerCount ?? 0}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', mt: 0.5 }}>
                {isSuperAdmin
                  ? 'Hover for names & emails · full profile in Customers'
                  : 'Hover for names & emails on your assigned jobs'}
              </Typography>
            </Paper>
          </Tooltip>
        </Grid>
      </Grid>

      {/* Search & Filters - Accordion for mobile */}
      <Accordion
        defaultExpanded={false}
        sx={{
          mb: 3,
          borderRadius: '12px !important',
          border: '1px solid #e2e8f0',
          '&:before': { display: 'none' },
          boxShadow: 'none',
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            bgcolor: '#f8fafc',
            borderRadius: '12px',
            '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 1 },
          }}
        >
          <SearchIcon sx={{ color: '#64748b' }} />
          <Typography sx={{ fontWeight: 600, color: '#0f172a' }}>
            Search & Filters
            {(filters.search || filters.status !== 'all') && (
              <Chip label="Active" size="small" sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} />
            )}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, flexWrap: 'wrap' }}>
            <TextField
              fullWidth
              placeholder="Search by company, job title..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#64748b' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ flex: { md: 1 }, minWidth: { md: 200 }, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Button variant="contained" onClick={handleSearch} sx={{ textTransform: 'none', borderRadius: '8px' }}>
                Search
              </Button>
              <Button variant="outlined" onClick={handleClear} startIcon={<ClearIcon />} sx={{ textTransform: 'none', borderRadius: '8px' }}>
                Clear
              </Button>
            </Box>
            <FormControl sx={{ minWidth: { xs: '100%', md: 160 } }}>
              <InputLabel>Status</InputLabel>
              <Select value={filters.status} label="Status" onChange={(e) => handleFilterChange('status', e.target.value)} sx={{ borderRadius: '8px' }}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="assigned">Assigned</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Jobs Table */}
      <Paper elevation={0} sx={{ borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table sx={{ '& .MuiTableCell-root': { whiteSpace: 'nowrap' } }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem', width: '60px', whiteSpace: 'nowrap' }}>SR No</TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: '#0f172a',
                    fontSize: '0.875rem',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    userSelect: 'none',
                    minWidth: 140,
                    '&:hover': { bgcolor: '#f1f5f9' }
                  }}
                  onClick={handleSortByTitle}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    Job Title
                    {filters.sortBy === 'title' && (
                      filters.sortOrder === 'asc' ? (
                        <ArrowUpwardIcon sx={{ fontSize: '1rem', color: '#2463eb' }} />
                      ) : (
                        <ArrowDownwardIcon sx={{ fontSize: '1rem', color: '#2463eb' }} />
                      )
                    )}
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>User Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>Company Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>Link</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>Resume</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>Cover Letter</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>Uploaded Files</TableCell>
                {isSuperAdmin && (
                  <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>Assigned To</TableCell>
                )}
                <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {                dashboardData.jobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isSuperAdmin ? 12 : 11} sx={{ textAlign: 'center', py: 6 }}>
                    <Typography sx={{ color: '#64748b' }}>No jobs found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                dashboardData.jobs.map((job, index) => {
                  const statusColors = getStatusColor(job.status);
                  const hasResume = !!job.resume;
                  const hasCoverLetter = !!job.coverLetter;
                  const hasScreenshot = !!job.screenshotProof;
                  const hasNotes = job.notes && job.notes.trim().length > 0;
                  const fileCount = (hasResume ? 1 : 0) + (hasCoverLetter ? 1 : 0) + (hasScreenshot ? 1 : 0) + (hasNotes ? 1 : 0);
                  const hasFiles = hasResume || hasCoverLetter || hasScreenshot;
                  
                  return (
                    <TableRow key={job.id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                      <TableCell sx={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>
                        {(pagination.page - 1) * pagination.limit + index + 1}
                      </TableCell>
                      <TableCell sx={{ color: '#0f172a', fontSize: '0.875rem', fontWeight: 600 }}>
                        {job.jobTitle || '—'}
                      </TableCell>
                      <TableCell sx={{ color: '#0f172a', fontSize: '0.875rem', fontWeight: 500 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {job.canCustomizeResume && (
                            <Tooltip title={`User has ${job.userPlanName || 'Pro'} plan – add job description in Fill Data to customize resume`}>
                              <AutoAwesomeIcon sx={{ color: '#16a34a', fontSize: '1.1rem' }} />
                            </Tooltip>
                          )}
                          {job.userId ? (
                            <Link
                              href={`/employee/customers/${job.userId}`}
                              style={{
                                color: '#2463eb',
                                textDecoration: 'none',
                                fontWeight: 500,
                                fontSize: '0.875rem',
                              }}
                            >
                              <Box
                                component="span"
                                sx={{
                                  '&:hover': { textDecoration: 'underline' },
                                }}
                              >
                                {job.userName || job.applicant || 'N/A'}
                              </Box>
                            </Link>
                          ) : (
                            job.userName || job.applicant || 'N/A'
                          )}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: '#0f172a', fontSize: '0.875rem', fontWeight: 600 }}>
                        {job.company}
                      </TableCell>
                      <TableCell>
                        {job.link ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <MuiLink
                              href={job.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                color: '#2463eb',
                                fontSize: '0.875rem',
                                textDecoration: 'none',
                                '&:hover': { textDecoration: 'underline' },
                                maxWidth: '200px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              View Link
                            </MuiLink>
                            <IconButton 
                              size="small" 
                              onClick={() => handleCopyLink(job.link)} 
                              sx={{ color: '#64748b', p: 0.5 }}
                            >
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        ) : (
                          <Typography sx={{ color: '#94a3b8', fontSize: '0.875rem', fontStyle: 'italic' }}>
                            No link
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <Select 
                            value={job.status} 
                            onChange={(e) => handleStatusChange(job.id, e.target.value)} 
                            sx={{ 
                              fontSize: '0.875rem', 
                              height: '32px',
                              bgcolor: statusColors.bg,
                              color: statusColors.color,
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: statusColors.color,
                              }
                            }}
                          >
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="assigned">Assigned</MenuItem>
                            <MenuItem value="in_progress">In Progress</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {job.userResumes?.length > 0 ? (
                            job.userResumes.map((r, i) => (
                              <Tooltip key={i} title={`${r.label}: ${r.fileName}`}>
                                <IconButton
                                  size="small"
                                  onClick={() => window.open(r.url, '_blank')}
                                  sx={{
                                    color: r.type === 'ats' ? '#16a34a' : '#2463eb',
                                    '&:hover': { bgcolor: r.type === 'ats' ? '#dcfce7' : '#eff6ff' },
                                    p: 0.5,
                                  }}
                                >
                                  <DescriptionIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            ))
                          ) : (
                            <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem', fontStyle: 'italic' }}>—</Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {job.coverLetter?.url || job.coverLetter?.key ? (
                          <Tooltip title={job.coverLetter.fileName}>
                            <IconButton
                              size="small"
                              onClick={() => window.open(job.coverLetter?.url || '#', '_blank')}
                              sx={{ color: '#16a34a', '&:hover': { bgcolor: '#dcfce7' }, p: 0.5 }}
                            >
                              <DescriptionIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem', fontStyle: 'italic' }}>—</Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                        {job.date ? new Date(job.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setSelectedJob(job);
                            setViewMode(fileCount === 0 ? 'fill' : 'view');
                            setViewDataOpen(true);
                          }}
                          sx={{
                            textTransform: 'none',
                            fontSize: '0.75rem',
                            borderColor: fileCount > 0 ? '#2463eb' : '#16a34a',
                            color: fileCount > 0 ? '#2463eb' : '#16a34a',
                            '&:hover': {
                              borderColor: fileCount > 0 ? '#1d4ed8' : '#15803d',
                              bgcolor: fileCount > 0 ? '#eff6ff' : '#dcfce7',
                            },
                          }}
                        >
                          {fileCount > 0 ? `View Files & Notes (${fileCount})` : 'Upload Files'}
                        </Button>
                      </TableCell>
                      {isSuperAdmin && (
                        <TableCell sx={{ color: '#0f172a', fontSize: '0.875rem' }}>
                          {job.assignedTo || 'Unassigned'}
                        </TableCell>
                      )}
                      <TableCell>
                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, job)}>
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={pagination.total}
          page={pagination.page - 1}
          onPageChange={handlePageChange}
          rowsPerPage={pagination.limit}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Rows per page:"
          sx={{
            borderTop: '1px solid #e2e8f0',
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { fontSize: '0.875rem' },
          }}
        />
      </Paper>

      {/* Action Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {isSuperAdmin && !selectedJob?.assignedTo && (
          <MenuItem onClick={() => handleAction('assign')}>
            <ListItemIcon><AssignmentIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Assign Employee</ListItemText>
          </MenuItem>
        )}
        {isSuperAdmin && selectedJob?.assignedTo && (
          <MenuItem onClick={() => handleAction('unassign')}>
            <ListItemIcon><AssignmentIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Unassign Employee</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={() => handleAction('fill')}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Fill Data</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('notes')}>
          <ListItemIcon><NoteIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Notes</ListItemText>
        </MenuItem>
        {isSuperAdmin && (
          <MenuItem onClick={() => handleAction('email')}>
            <ListItemIcon><EmailIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Send Email</ListItemText>
          </MenuItem>
        )}
        {isSuperAdmin && (
          <MenuItem onClick={() => handleAction('delete')} sx={{ color: '#ef4444' }}>
            <ListItemIcon sx={{ color: 'inherit' }}><DeleteIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        )}
      </Menu>

      {/* Email Dialog */}
      <Dialog open={emailDialogOpen} onClose={() => {
        setEmailDialogOpen(false);
        setSelectedJob(null); // Clear selectedJob when dialog closes
      }} maxWidth="sm" fullWidth>
        <DialogTitle>Send Email</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              required
              value={emailData.emailAddress}
              onChange={(e) => setEmailData({ ...emailData, emailAddress: e.target.value })}
              helperText="Recipient email address"
            />
            <TextField
              fullWidth
              label="Subject"
              required
              value={emailData.subject}
              onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
              helperText="Email subject line"
            />
            <TextField
              fullWidth
              label="Email Body"
              multiline
              rows={6}
              value={emailData.body}
              onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
              helperText="Email message content"
            />
            {selectedJob && (
              <Box sx={{ mt: 1, p: 2, bgcolor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', mb: 1 }}>
                  Job Information:
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>
                  <strong>Job:</strong> {selectedJob.jobTitle} at {selectedJob.company}
                </Typography>
                {(selectedJob.resume || selectedJob.coverLetter || selectedJob.screenshotProof) && (
                  <Typography sx={{ fontSize: '0.75rem', color: '#64748b', mt: 0.5 }}>
                    <strong>Attachments:</strong> Files will be automatically attached to the email
                  </Typography>
                )}
              </Box>
            )}
            {emailData.sent && (
              <Alert severity="success" sx={{ mt: 1 }}>
                Email was previously sent on {emailData.sentAt ? new Date(emailData.sentAt).toLocaleString() : 'unknown date'}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => {
              setEmailDialogOpen(false);
              setSelectedJob(null);
            }}
            disabled={sendingEmail}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => handleSaveEmail(false)} 
            variant="outlined"
            disabled={sendingEmail}
            sx={{ mr: 1 }}
          >
            Save Only
          </Button>
          <Button 
            onClick={() => handleSaveEmail(true)} 
            variant="contained"
            disabled={sendingEmail || !emailData.emailAddress?.trim() || !emailData.subject?.trim()}
            startIcon={sendingEmail ? <CircularProgress size={16} /> : <EmailIcon />}
            sx={{
              bgcolor: '#2463eb',
              '&:hover': { bgcolor: '#1d4ed8' },
              '&:disabled': { bgcolor: '#cbd5e1' }
            }}
          >
            {sendingEmail ? 'Sending...' : 'Send Email'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* File Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={() => { 
        setUploadDialogOpen(false); 
        setUploadFileType(null);
        setSelectedJob(null); // Clear selectedJob when dialog closes
      }} maxWidth="sm" fullWidth>
        <DialogTitle>Upload {uploadFileType === 'resume' ? 'Resume' : uploadFileType === 'coverLetter' ? 'Cover Letter' : 'Screenshot Proof'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Input
              type="file"
              accept={uploadFileType === 'screenshotProof' ? 'image/*,.pdf' : '.pdf,.doc,.docx,.txt'}
              onChange={handleFileUpload}
              disabled={uploading}
              fullWidth
            />
            {uploading && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                <CircularProgress size={20} />
                <Typography>Uploading...</Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setUploadDialogOpen(false); setUploadFileType(null); }}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* View/Fill Data Modal */}
      <ViewDataModal 
        open={viewDataOpen} 
        onClose={() => {
          setViewDataOpen(false);
          setSelectedJob(null); // Clear selectedJob when dialog closes
        }} 
        job={selectedJob} 
        mode={viewMode}
        onUpdate={async () => {
          const data = await fetchDashboardData();
          if (data?.jobs && selectedJob) {
            const freshJob = data.jobs.find((j) => j.id === selectedJob.id);
            if (freshJob) setSelectedJob(freshJob);
          }
        }}
      />

      {/* Notes Modal */}
      <NotesModal
        open={notesDialogOpen}
        onClose={() => {
          setNotesDialogOpen(false);
          setSelectedJob(null);
        }}
        job={selectedJob}
        onUpdate={async () => {
          const data = await fetchDashboardData();
          if (data?.jobs && selectedJob) {
            const freshJob = data.jobs.find((j) => j.id === selectedJob.id);
            if (freshJob) setSelectedJob(freshJob);
          }
        }}
      />
      
      {/* Create Employee Modal */}
      <CreateEmployeeModal 
        open={createEmployeeOpen} 
        onClose={() => setCreateEmployeeOpen(false)}
        onSuccess={() => {
          setCreateEmployeeOpen(false);
          // Optionally refresh employee list
        }}
      />
      
      {/* All Employees Modal */}
      <AllEmployeesModal 
        open={allEmployeesOpen} 
        onClose={() => setAllEmployeesOpen(false)}
      />

      {/* Assign Employee Dialog */}
      <Dialog open={assignDialogOpen} onClose={() => { 
        setAssignDialogOpen(false); 
        setSelectedEmployeeId('');
        setSelectedJob(null);
      }} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Job to Employee</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            {loadingEmployees ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <FormControl fullWidth>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', mb: 1 }}>
                  Select Employee
                </Typography>
                <Select
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  displayEmpty
                  sx={{ borderRadius: '8px', minWidth: '200px' }}
                  renderValue={(value) => {
                    if (!value) return <em style={{ color: '#94a3b8' }}>Select an employee</em>;
                    const emp = employees.find(e => (e._id || e.id) === value);
                    return emp ? `${emp.name} (${emp.email})` : value;
                  }}
                >
                  <MenuItem value="" disabled>
                    <em>Select an employee</em>
                  </MenuItem>
                  {employees
                    .filter(emp => emp.role === 'employee' && emp.isActive)
                    .map((employee) => (
                      <MenuItem key={employee._id || employee.id} value={employee._id || employee.id}>
                        {employee.name} ({employee.email})
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setAssignDialogOpen(false); setSelectedEmployeeId(''); }}>Cancel</Button>
          <Button 
            onClick={handleAssignJob} 
            variant="contained" 
            disabled={!selectedEmployeeId || loadingEmployees}
            sx={{ 
              bgcolor: '#2463eb', 
              textTransform: 'none',
              '&:hover': { bgcolor: '#1d4ed8' },
              '&:disabled': { bgcolor: '#cbd5e1', color: '#94a3b8' }
            }}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
