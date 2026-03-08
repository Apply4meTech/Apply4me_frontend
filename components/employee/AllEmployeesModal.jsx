'use client';

import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Box, 
  Typography, 
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import EditEmployeeModal from './EditEmployeeModal';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
const getApiUrl = () => (API_URL.endsWith('/api') ? API_URL.slice(0, -4) : API_URL);

export default function AllEmployeesModal({ open, onClose }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editEmployee, setEditEmployee] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({ search: '', status: 'all' });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please login again.');
      }

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.status !== 'all' && { status: filters.status })
      });

      const response = await fetch(`${getApiUrl()}/api/auth/employee/all?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch employees');
      }

      if (data.success) {
        setEmployees(data.employees || []);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      } else {
        throw new Error(data.error || 'Failed to fetch employees');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch employees. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    fetchEmployees();
  }, [open, filters.search, filters.status, pagination.page, pagination.limit]);

  const handleRefresh = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchEmployees();
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth 
      PaperProps={{ sx: { borderRadius: '12px' } }}
    >
      <DialogTitle sx={{ fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PeopleIcon sx={{ color: '#2463eb' }} />
          <Typography variant="h6">All Employees</Typography>
          {(pagination.total > 0 || employees.length > 0) && (
            <Chip 
              label={`${pagination.total || employees.length} ${(pagination.total || employees.length) === 1 ? 'Employee' : 'Employees'}`} 
              size="small" 
              sx={{ ml: 1, bgcolor: '#e0e7ff', color: '#2463eb', fontWeight: 600 }}
            />
          )}
        </Box>
        <Button
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={loading}
          sx={{ 
            textTransform: 'none',
            color: '#2463eb',
            '&:hover': { bgcolor: '#e0e7ff' }
          }}
        >
          Refresh
        </Button>
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Search & Filters - Accordion for mobile */}
        {open && (
          <Accordion
            defaultExpanded={false}
            sx={{
              mb: 2,
              borderRadius: '8px !important',
              border: '1px solid #e2e8f0',
              '&:before': { display: 'none' },
              boxShadow: 'none',
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: '#f8fafc', borderRadius: '8px' }}>
              <SearchIcon sx={{ color: '#64748b', mr: 1 }} />
              <Typography sx={{ fontWeight: 600, color: '#0f172a' }}>
                Search & Filters
                {(filters.search || filters.status !== 'all') && (
                  <Chip label="Active" size="small" sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} />
                )}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  fullWidth
                  placeholder="Search by name or email..."
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
                  sx={{ flex: 1, minWidth: 180, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Button variant="contained" onClick={handleSearch} size="small" sx={{ textTransform: 'none', borderRadius: '8px' }}>
                    Search
                  </Button>
                  <Button variant="outlined" onClick={handleClear} size="small" startIcon={<ClearIcon />} sx={{ textTransform: 'none', borderRadius: '8px' }}>
                    Clear
                  </Button>
                </Box>
                <FormControl sx={{ minWidth: 140 }}>
                  <InputLabel>Status</InputLabel>
                  <Select value={filters.status} label="Status" onChange={(e) => handleFilterChange('status', e.target.value)} sx={{ borderRadius: '8px' }}>
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </AccordionDetails>
          </Accordion>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#2463eb' }} />
          </Box>
        ) : employees.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <PeopleIcon sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
            <Typography sx={{ color: '#64748b', fontSize: '1rem' }}>
              No employees found
            </Typography>
            <Typography sx={{ color: '#94a3b8', fontSize: '0.875rem', mt: 1 }}>
              Create your first employee using the "Create Employee" button
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                  <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>Created At</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow 
                    key={employee._id || employee.id} 
                    sx={{ 
                      '&:hover': { bgcolor: '#f8fafc' },
                      '&:last-child td': { borderBottom: 0 }
                    }}
                  >
                    <TableCell sx={{ color: '#0f172a', fontSize: '0.875rem' }}>
                      {employee.name || 'N/A'}
                    </TableCell>
                    <TableCell sx={{ color: '#0f172a', fontSize: '0.875rem' }}>
                      {employee.email || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={employee.role || 'employee'} 
                        size="small" 
                        sx={{ 
                          bgcolor: employee.role === 'super_admin' ? '#fef3c7' : '#dbeafe',
                          color: employee.role === 'super_admin' ? '#92400e' : '#1e40af',
                          fontWeight: 500,
                          textTransform: 'capitalize'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={employee.isActive ? 'Active' : 'Inactive'} 
                        size="small" 
                        sx={{ 
                          bgcolor: employee.isActive ? '#d1fae5' : '#fee2e2',
                          color: employee.isActive ? '#065f46' : '#991b1b',
                          fontWeight: 500
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                      {formatDate(employee.createdAt)}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setEditEmployee(employee);
                          setEditModalOpen(true);
                        }}
                        sx={{ color: '#2463eb', '&:hover': { bgcolor: '#e0e7ff' } }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {!loading && employees.length > 0 && (
          <TablePagination
            component="div"
            count={pagination.total || employees.length}
            page={Math.max(0, (pagination.page || 1) - 1)}
            onPageChange={handlePageChange}
            rowsPerPage={pagination.limit || 10}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Rows per page:"
            sx={{ borderTop: '1px solid #e2e8f0', mt: 0 }}
          />
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={onClose} 
          sx={{ color: '#64748b', textTransform: 'none' }}
        >
          Close
        </Button>
      </DialogActions>

      {/* Edit Employee Modal */}
      <EditEmployeeModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditEmployee(null);
        }}
        employee={editEmployee}
        onSuccess={(updatedEmployee) => {
          // Refresh the employee list
          fetchEmployees();
        }}
      />
    </Dialog>
  );
}

