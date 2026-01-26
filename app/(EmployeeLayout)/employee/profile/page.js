'use client';

import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, TextField, Avatar, Button, Input } from '@mui/material';
import { useSelector } from 'react-redux';
import DescriptionIcon from '@mui/icons-material/Description';

export default function EmployeeProfilePage() {
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    employeeCode: user?.employeeCode || '',
    resume: null,
    resumeFileName: user?.resumeFileName || '',
  });

  const handleChange = (field) => (e) => {
    if (field === 'resume') {
      const file = e.target.files[0];
      if (file) {
        setFormData({ ...formData, resume: file, resumeFileName: file.name });
      }
    } else {
      setFormData({ ...formData, [field]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Profile data:', formData);
    alert('Profile updated successfully!');
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
          My Profile
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 4, borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <Avatar sx={{ bgcolor: '#2463eb', width: 120, height: 120, fontSize: '3rem' }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'E'}
              </Avatar>
            </Box>
          </Grid>

          <Grid item xs={12} md={9}>
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField fullWidth label="Name" value={formData.name} onChange={handleChange('name')} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
                <TextField fullWidth label="Email" type="email" value={formData.email} onChange={handleChange('email')} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
                <TextField fullWidth label="Phone no" value={formData.phone} onChange={handleChange('phone')} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
                <TextField fullWidth label="Address" multiline rows={2} value={formData.address} onChange={handleChange('address')} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
                <TextField fullWidth label="Employee Code" value={formData.employeeCode} onChange={handleChange('employeeCode')} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
                
                <Box>
                  <Typography sx={{ fontSize: '0.875rem', color: '#64748b', mb: 1 }}>Resume</Typography>
                  <Button variant="outlined" component="label" startIcon={<DescriptionIcon />} sx={{ borderRadius: '8px', textTransform: 'none', borderColor: '#e2e8f0', color: '#0f172a', '&:hover': { borderColor: '#2463eb', bgcolor: '#eff6ff' } }}>
                    {formData.resumeFileName || 'Choose File'}
                    <Input type="file" accept=".pdf,.doc,.docx" onChange={handleChange('resume')} sx={{ display: 'none' }} />
                  </Button>
                  {formData.resumeFileName && <Typography sx={{ fontSize: '0.75rem', color: '#64748b', mt: 1 }}>Selected: {formData.resumeFileName}</Typography>}
                </Box>

                <Button type="submit" variant="contained" sx={{ bgcolor: '#2463eb', color: 'white', px: 4, py: 1.5, borderRadius: '8px', fontSize: '1rem', fontWeight: 600, textTransform: 'none', '&:hover': { bgcolor: '#1e40af' } }}>
                  Save Changes
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

