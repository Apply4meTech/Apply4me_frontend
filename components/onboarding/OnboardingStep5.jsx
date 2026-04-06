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

/**
 * Compliance selects: use a static label above the field (Typography), not MUI floating `label`,
 * so empty-state "Select…" never overlaps the field name (common Outlined Select + label bug).
 */
function FieldLabel({ children }) {
  return (
    <Typography
      component="label"
      sx={{
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: 600,
        color: '#334155',
        mb: 0.75,
      }}
    >
      {children}
    </Typography>
  );
}

export default function OnboardingStep5() {
  const { formData, updateFormData } = useOnboarding();

  const handleChange = (field) => (e) => {
    updateFormData(field, e.target.value);
  };

  const emptyRenderValue = (selected) => {
    if (selected === '' || selected == null) {
      return (
        <Box component="span" sx={{ color: '#94a3b8' }}>
          Select…
        </Box>
      );
    }
    return selected;
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a', mb: 3 }}>
        Compliance & Checks
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <FieldLabel>Police Check</FieldLabel>
          <TextField
            fullWidth
            select
            value={formData.policeCheck ?? ''}
            onChange={handleChange('policeCheck')}
            sx={inputSx}
            SelectProps={{
              displayEmpty: true,
              renderValue: emptyRenderValue,
            }}
          >
            <MenuItem value="">
              <em>Select…</em>
            </MenuItem>
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
            <MenuItem value="Willing to obtain">Willing to obtain</MenuItem>
          </TextField>
        </Box>

        <Box>
          <FieldLabel>Working With Children Check</FieldLabel>
          <TextField
            fullWidth
            select
            value={formData.workingWithChildrenCheck ?? ''}
            onChange={handleChange('workingWithChildrenCheck')}
            sx={inputSx}
            SelectProps={{
              displayEmpty: true,
              renderValue: emptyRenderValue,
            }}
          >
            <MenuItem value="">
              <em>Select…</em>
            </MenuItem>
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
            <MenuItem value="Not applicable">Not applicable</MenuItem>
          </TextField>
        </Box>

        <Box>
          <FieldLabel>Security Clearance</FieldLabel>
          <TextField
            fullWidth
            value={formData.securityClearance}
            onChange={handleChange('securityClearance')}
            placeholder="Level and type if applicable"
            sx={inputSx}
          />
        </Box>

        <Box>
          <FieldLabel>Driver&apos;s Licence</FieldLabel>
          <TextField
            fullWidth
            select
            value={formData.driversLicence ?? ''}
            onChange={handleChange('driversLicence')}
            sx={inputSx}
            SelectProps={{
              displayEmpty: true,
              renderValue: emptyRenderValue,
            }}
          >
            <MenuItem value="">
              <em>Select…</em>
            </MenuItem>
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>
        </Box>
      </Box>
    </Box>
  );
}
