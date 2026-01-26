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
  Chip
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import EditEmployeeModal from './EditEmployeeModal';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export default function AllEmployeesModal({ open, onClose }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editEmployee, setEditEmployee] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please login again.');
      }

      const response = await fetch(`${API_URL}/auth/employee/all`, {
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
    if (open) {
      fetchEmployees();
    }
  }, [open]);

  const handleRefresh = () => {
    fetchEmployees();
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
          {employees.length > 0 && (
            <Chip 
              label={`${employees.length} ${employees.length === 1 ? 'Employee' : 'Employees'}`} 
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
                  <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>Created At</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>Actions</TableCell>
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

