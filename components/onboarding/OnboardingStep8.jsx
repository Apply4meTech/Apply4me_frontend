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

export default function OnboardingStep8() {
  const { formData, updateFormData, errors } = useOnboarding();

  const handleChange = (field) => (e) => {
    updateFormData(field, e.target.value);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a', mb: 3 }}>
        Additional Information
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          fullWidth
          label="LinkedIn Profile URL"
          type="url"
          value={formData.linkedinProfile}
          onChange={handleChange('linkedinProfile')}
          placeholder="https://linkedin.com/in/yourprofile"
          error={!!errors.linkedinProfile}
          helperText={errors.linkedinProfile}
          sx={inputSx}
        />

        <TextField
          fullWidth
          label="Portfolio / Website"
          type="url"
          value={formData.portfolioWebsite}
          onChange={handleChange('portfolioWebsite')}
          placeholder="https://yourportfolio.com"
          error={!!errors.portfolioWebsite}
          helperText={errors.portfolioWebsite}
          sx={inputSx}
        />

        <TextField
          fullWidth
          label="Anything Else We Should Know?"
          multiline
          rows={4}
          value={formData.anythingElse}
          onChange={handleChange('anythingElse')}
          placeholder="Open-ended additional context"
          sx={inputSx}
        />
      </Box>
    </Box>
  );
}
