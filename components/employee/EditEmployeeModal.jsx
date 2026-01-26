'use client';

import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Box, 
  Typography, 
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Switch
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EditIcon from '@mui/icons-material/Edit';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export default function EditEmployeeModal({ open, onClose, employee, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    isActive: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Populate form when employee data is available
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        password: '', // Don't populate password
        isActive: employee.isActive !== undefined ? employee.isActive : true,
      });
    }
  }, [employee]);

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [field]: value });
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    // Validation
    if (!formData.name || !formData.email) {
      setError('Name and email are required');
      setLoading(false);
      return;
    }

    if (formData.password && formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please login again.');
      }

      // Build update payload (only include password if provided)
      const updateData = {
        name: formData.name,
        email: formData.email,
        isActive: formData.isActive,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await fetch(`${API_URL}/auth/employee/${employee._id || employee.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update employee');
      }

      if (data.success) {
        setSuccess(true);
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess(data.employee);
        }

        // Close modal after 1.5 seconds
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        throw new Error(data.error || 'Failed to update employee');
      }
    } catch (err) {
      setError(err.message || 'Failed to update employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', email: '', password: '', isActive: true });
    setError(null);
    setSuccess(false);
    setShowPassword(false);
    onClose();
  };

  if (!employee) {
    return null;
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth 
      PaperProps={{ sx: { borderRadius: '12px' } }}
    >
      <DialogTitle sx={{ fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 1 }}>
        <EditIcon sx={{ color: '#2463eb' }} />
        Edit Employee
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: '8px' }}>
              Employee updated successfully!
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography component="label" sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', mb: 0.5, display: 'block' }}>
                Full Name
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter employee name"
                value={formData.name}
                onChange={handleChange('name')}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    bgcolor: 'white',
                    '& fieldset': { borderColor: '#e2e8f0' },
                    '&:hover fieldset': { borderColor: '#2463eb' },
                    '&.Mui-focused fieldset': { borderColor: '#2463eb', borderWidth: '1px' },
                  },
                }}
              />
            </Box>

            <Box>
              <Typography component="label" sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', mb: 0.5, display: 'block' }}>
                Email Address
              </Typography>
              <TextField
                fullWidth
                type="email"
                placeholder="Enter employee email"
                value={formData.email}
                onChange={handleChange('email')}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    bgcolor: 'white',
                    '& fieldset': { borderColor: '#e2e8f0' },
                    '&:hover fieldset': { borderColor: '#2463eb' },
                    '&.Mui-focused fieldset': { borderColor: '#2463eb', borderWidth: '1px' },
                  },
                }}
              />
            </Box>

            <Box>
              <Typography component="label" sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', mb: 0.5, display: 'block' }}>
                Password (leave blank to keep current password)
              </Typography>
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password (optional)"
                value={formData.password}
                onChange={handleChange('password')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: '#616e89', '&:hover': { color: '#2463eb' } }}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    bgcolor: 'white',
                    '& fieldset': { borderColor: '#e2e8f0' },
                    '&:hover fieldset': { borderColor: '#2463eb' },
                    '&.Mui-focused fieldset': { borderColor: '#2463eb', borderWidth: '1px' },
                  },
                }}
              />
            </Box>

            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={handleChange('isActive')}
                    color="primary"
                  />
                }
                label="Active Status"
                sx={{
                  '& .MuiFormControlLabel-label': {
                    color: '#0f172a',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                  },
                }}
              />
              <Typography sx={{ fontSize: '0.75rem', color: '#64748b', mt: 0.5 }}>
                Toggle to activate or deactivate this employee account
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={handleClose} 
          disabled={loading}
          sx={{ color: '#64748b', textTransform: 'none' }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading || success}
          sx={{ 
            bgcolor: '#2463eb', 
            color: 'white', 
            textTransform: 'none', 
            '&:hover': { bgcolor: '#1d4ed8' },
            '&:disabled': { bgcolor: '#93c5fd', color: 'white' }
          }}
        >
          {loading ? (
            <CircularProgress size={20} sx={{ color: 'white' }} />
          ) : (
            'Update Employee'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
