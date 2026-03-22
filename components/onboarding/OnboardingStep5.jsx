'use client';

import React from 'react';
import { Box, TextField, MenuItem, Typography } from '@mui/material';
import { useOnboarding } from './OnboardingContext';

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '24px',
    '& fieldset': { borderColor: '#d1d5db' },
  },
};

export default function OnboardingStep5() {
  const { formData, updateFormData } = useOnboarding();

  const handleChange = (field) => (e) => {
    updateFormData(field, e.target.value);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a', mb: 3 }}>
        Compliance & Checks
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          fullWidth
          select
          label="Police Check"
          value={formData.policeCheck || ''}
          onChange={handleChange('policeCheck')}
          sx={inputSx}
          SelectProps={{ displayEmpty: true, renderValue: (v) => v || 'Select...' }}
        >
          <MenuItem value=""><em>Select...</em></MenuItem>
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
          <MenuItem value="Willing to obtain">Willing to obtain</MenuItem>
        </TextField>

        <TextField
          fullWidth
          select
          label="Working With Children Check"
          value={formData.workingWithChildrenCheck || ''}
          onChange={handleChange('workingWithChildrenCheck')}
          sx={inputSx}
          SelectProps={{ displayEmpty: true, renderValue: (v) => v || 'Select...' }}
        >
          <MenuItem value=""><em>Select...</em></MenuItem>
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
          <MenuItem value="Not applicable">Not applicable</MenuItem>
        </TextField>

        <TextField
          fullWidth
          label="Security Clearance"
          value={formData.securityClearance}
          onChange={handleChange('securityClearance')}
          placeholder="Level and type if applicable"
          sx={inputSx}
        />

        <TextField
          fullWidth
          select
          label="Driver's Licence"
          value={formData.driversLicence || ''}
          onChange={handleChange('driversLicence')}
          sx={inputSx}
          SelectProps={{ displayEmpty: true, renderValue: (v) => v || 'Select...' }}
        >
          <MenuItem value=""><em>Select...</em></MenuItem>
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </TextField>
      </Box>
    </Box>
  );
}
