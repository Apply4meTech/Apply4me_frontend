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

export default function OnboardingStep4() {
  const { formData, updateFormData, errors } = useOnboarding();

  const handleChange = (field) => (e) => {
    updateFormData(field, e.target.value);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a', mb: 3 }}>
        Employment History
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Current / Most Recent Role * */}
        <TextField
          fullWidth
          label="Current / Most Recent Role *"
          value={formData.currentRole}
          onChange={handleChange('currentRole')}
          required
          error={!!errors.currentRole}
          helperText={errors.currentRole}
          placeholder="Job title and company name"
          sx={inputSx}
        />

        {/* Previous Roles */}
        <TextField
          fullWidth
          label="Previous Roles"
          multiline
          rows={4}
          value={formData.previousRoles}
          onChange={handleChange('previousRoles')}
          error={!!errors.previousRoles}
          helperText={errors.previousRoles || 'Last 3 to 5 positions. One per line recommended'}
          placeholder="e.g. Software Engineer at Company A
Junior Developer at Company B"
          sx={inputSx}
        />

        {/* Key Responsibilities */}
        <TextField
          fullWidth
          label="Key Responsibilities"
          multiline
          rows={4}
          value={formData.keyResponsibilities}
          onChange={handleChange('keyResponsibilities')}
          error={!!errors.keyResponsibilities}
          helperText={errors.keyResponsibilities}
          placeholder="Brief description per role"
          sx={inputSx}
        />

        {/* Key Achievements */}
        <TextField
          fullWidth
          label="Key Achievements"
          multiline
          rows={4}
          value={formData.keyAchievements}
          onChange={handleChange('keyAchievements')}
          error={!!errors.keyAchievements}
          helperText={errors.keyAchievements || 'Bullet points preferred'}
          placeholder="e.g.
• Led migration of X to Y
• Reduced costs by 20%"
          sx={inputSx}
        />
      </Box>
    </Box>
  );
}
