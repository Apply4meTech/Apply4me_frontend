'use client';

import React from 'react';
import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  MenuItem,
  Typography,
} from '@mui/material';
import { useOnboarding } from './OnboardingContext';

const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'India',
  'Singapore',
  'Netherlands',
  'Sweden',
  'Other',
];

export default function OnboardingStep1() {
  const { formData, updateFormData, errors, setFieldError } = useOnboarding();

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    updateFormData(field, value);
    
    // Basic validation
    if (field === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setFieldError('email', 'Please enter a valid email address');
    } else if (field === 'phone' && value && !/^[\d\s\-\+\(\)]+$/.test(value)) {
      setFieldError('phone', 'Please enter a valid phone number');
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a', mb: 3 }}>
        Personal Information
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Full Name */}
        <TextField
          fullWidth
          label="Full Name"
          value={formData.fullName}
          onChange={handleChange('fullName')}
          required
          error={!!errors.fullName}
          helperText={errors.fullName}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
        />

        {/* Email */}
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          required
          error={!!errors.email}
          helperText={errors.email}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
        />

        {/* Phone Number */}
        <TextField
          fullWidth
          label="Phone number"
          type="tel"
          value={formData.phone}
          onChange={handleChange('phone')}
          placeholder="+1 (555) 123-4567"
          error={!!errors.phone}
          helperText={errors.phone}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
        />

        {/* Address */}
        <TextField
          fullWidth
          label="Address"
          value={formData.address}
          onChange={handleChange('address')}
          multiline
          rows={2}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
        />

        {/* Open to Relocate */}
        <FormControlLabel
          control={
            <Switch
              checked={formData.openToRelocate}
              onChange={handleChange('openToRelocate')}
              color="primary"
            />
          }
          label="Open to relocate?"
          sx={{
            '& .MuiFormControlLabel-label': {
              color: '#0f172a',
              fontWeight: 500,
            },
          }}
        />

        {/* Country of Work */}
        <TextField
          fullWidth
          select
          label="Country of work"
          value={formData.countryOfWork}
          onChange={handleChange('countryOfWork')}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
        >
          <MenuItem value="">
            <em>Select a country</em>
          </MenuItem>
          {countries.map((country) => (
            <MenuItem key={country} value={country}>
              {country}
            </MenuItem>
          ))}
        </TextField>

        {/* Visa Sponsorship Required */}
        <FormControlLabel
          control={
            <Switch
              checked={formData.visaSponsorshipRequired}
              onChange={handleChange('visaSponsorshipRequired')}
              color="primary"
            />
          }
          label="Visa sponsorship required?"
          sx={{
            '& .MuiFormControlLabel-label': {
              color: '#0f172a',
              fontWeight: 500,
            },
          }}
        />
      </Box>
    </Box>
  );
}


