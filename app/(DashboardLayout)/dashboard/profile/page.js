'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Avatar, 
  TextField,
  Button,
  Input,
} from '@mui/material';
import { useSelector } from 'react-redux';
import DescriptionIcon from '@mui/icons-material/Description';

export default function ProfilePage() {
  const { user } = useSelector((state) => state.auth);
  
  // Form state - will be replaced with API integration later
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    resume: null,
    linkedinUrl: '',
  });

  const [resumeFileName, setResumeFileName] = useState('');

  // Static ATS Score - will be replaced with API data later
  const atsScore = 85;

  const handleInputChange = (field) => (e) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        resume: file,
      });
      setResumeFileName(file.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Static implementation - will be replaced with API call later
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

      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
        }}
      >
        <Grid container spacing={4}>
          {/* Left Column - Avatar and Resume ATS Score */}
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              {/* Profile Avatar */}
              <Avatar 
                sx={{ 
                  bgcolor: '#2463eb', 
                  width: 120, 
                  height: 120, 
                  fontSize: '3rem',
                }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>

              {/* Resume ATS Score */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  width: '100%',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  bgcolor: '#f8fafc',
                  textAlign: 'center',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                  <DescriptionIcon sx={{ color: '#2463eb', fontSize: '1.5rem' }} />
                  <Typography sx={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>
                    Resume ATS Score
                  </Typography>
                </Box>
                <Typography 
                  sx={{ 
                    fontSize: '2.5rem', 
                    fontWeight: 700, 
                    color: '#2463eb',
                  }}
                >
                  {atsScore}%
                </Typography>
              </Paper>
            </Box>
          </Grid>
          
          {/* Right Column - Input Fields */}
          <Grid item xs={12} md={9} sx={{width: '70%', }}>
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              {/* Name Field */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Name"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    },
                  }}
                />
              </Box>

              {/* Email Field */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    },
                  }}
                />
              </Box>

              {/* Phone Number Field */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Phone no"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                  variant="outlined"
                  placeholder="+1 (555) 123-4567"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    },
                  }}
                />
              </Box>

              {/* Address Field */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Address"
                  value={formData.address}
                  onChange={handleInputChange('address')}
                  variant="outlined"
                  multiline
                  rows={2}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    },
                  }}
                />
              </Box>

              {/* Resume Upload Field */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ mb: 1 }}>
                  <Typography sx={{ fontSize: '0.875rem', color: '#64748b', mb: 1 }}>
                    Resume
                  </Typography>
                  <Button
                    variant="outlined"
                    component="label"
                    sx={{
                      borderRadius: '8px',
                      textTransform: 'none',
                      borderColor: '#e2e8f0',
                      color: '#0f172a',
                      '&:hover': {
                        borderColor: '#2463eb',
                        bgcolor: '#eff6ff',
                      },
                    }}
                  >
                    {resumeFileName || 'Choose File'}
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeChange}
                      sx={{ display: 'none' }}
                    />
                  </Button>
                  {resumeFileName && (
                    <Typography sx={{ fontSize: '0.75rem', color: '#64748b', mt: 1 }}>
                      Selected: {resumeFileName}
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* LinkedIn URL Field */}
              <Box sx={{ mb: 4 }}>
                <TextField
                  fullWidth
                  label="LinkedIn URL"
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={handleInputChange('linkedinUrl')}
                  variant="outlined"
                  placeholder="https://linkedin.com/in/yourprofile"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    },
                  }}
                />
              </Box>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: '#2463eb',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: '#1e40af',
                  },
                }}
              >
                Save Changes
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}


