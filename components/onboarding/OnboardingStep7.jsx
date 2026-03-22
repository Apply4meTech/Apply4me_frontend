'use client';

import React from 'react';
import { Box, TextField, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { useOnboarding } from './OnboardingContext';

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '24px',
    '& fieldset': { borderColor: '#d1d5db' },
  },
};

const APPLY_OPTIONS = [
  { value: 'jobs_i_provide', label: 'Apply only to jobs I provide' },
  { value: 'apply_on_my_behalf', label: 'Apply to relevant roles on my behalf' },
  { value: 'both', label: 'Both' },
];

export default function OnboardingStep7() {
  const { formData, updateFormData, errors } = useOnboarding();

  const handleChange = (field) => (e) => {
    updateFormData(field, e.target.value);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a', mb: 3 }}>
        Application Preferences
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <FormControl component="fieldset" error={!!errors.howToApply} sx={{ mb: 1 }}>
          <FormLabel component="legend" sx={{ fontSize: '0.875rem', color: '#64748b', mb: 1 }}>
            How Would You Like Us to Apply? <span style={{ color: '#dc2626' }}>*</span>
          </FormLabel>
          <RadioGroup
            value={formData.howToApply || ''}
            onChange={handleChange('howToApply')}
          >
            {APPLY_OPTIONS.map((opt) => (
              <FormControlLabel
                key={opt.value}
                value={opt.value}
                control={
                  <Radio sx={{ '&.Mui-checked': { color: '#1e3a8a' } }} />
                }
                label={opt.label}
                sx={{ '& .MuiFormControlLabel-label': { color: '#0f172a' } }}
              />
            ))}
          </RadioGroup>
          {errors.howToApply && (
            <Typography sx={{ fontSize: '0.75rem', color: '#dc2626', mt: 0.5 }}>{errors.howToApply}</Typography>
          )}
        </FormControl>

        <TextField
          fullWidth
          label="Companies or Organisations to Avoid"
          multiline
          rows={3}
          value={formData.companiesToAvoid}
          onChange={handleChange('companiesToAvoid')}
          placeholder="Optional. List any employers to exclude."
          sx={inputSx}
        />
      </Box>
    </Box>
  );
}
