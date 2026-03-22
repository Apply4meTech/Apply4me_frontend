'use client';

import React from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { useOnboarding } from './OnboardingContext';

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '24px',
    '& fieldset': { borderColor: '#d1d5db' },
  },
};

export default function OnboardingStep6() {
  const { formData, updateFormData, errors } = useOnboarding();

  const handleChange = (field) => (e) => {
    updateFormData(field, e.target.value);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a', mb: 3 }}>
        Availability
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          fullWidth
          label="Available Start Date *"
          type="date"
          value={formData.availableStartDate || ''}
          onChange={handleChange('availableStartDate')}
          required
          error={!!errors.availableStartDate}
          helperText={errors.availableStartDate}
          placeholder="Earliest available date"
          sx={inputSx}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          fullWidth
          label="Notice Period"
          value={formData.noticePeriod}
          onChange={handleChange('noticePeriod')}
          placeholder="e.g. 2 weeks, 1 month, Immediate"
          sx={inputSx}
        />
      </Box>
    </Box>
  );
}
