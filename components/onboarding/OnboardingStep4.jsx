'use client';

import React from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  IconButton,
  Checkbox,
  FormControlLabel,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useOnboarding } from './OnboardingContext';

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '24px',
    '& fieldset': { borderColor: '#d1d5db' },
  },
};

const emptyRow = () => ({
  jobTitle: '',
  company: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  responsibilities: '',
});

export default function OnboardingStep4() {
  const { formData, updateFormData, errors } = useOnboarding();

  const history =
    Array.isArray(formData.employmentHistory) && formData.employmentHistory.length > 0
      ? formData.employmentHistory
      : [emptyRow()];

  const setHistory = (next) => {
    updateFormData('employmentHistory', next);
  };

  const updateRow = (index, field, value) => {
    const next = [...history];
    const row = { ...next[index], [field]: value };
    if (field === 'isCurrent' && value === true) {
      row.endDate = '';
    }
    next[index] = row;
    setHistory(next);
  };

  const addRow = () => {
    setHistory([...history, emptyRow()]);
  };

  const removeRow = (index) => {
    if (history.length <= 1) return;
    setHistory(history.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a', mb: 1 }}>
        Employment History
      </Typography>
      <Typography sx={{ fontSize: '0.875rem', color: '#64748b', mb: 3 }}>
        Add each role with dates. Use &quot;Add another position&quot; for earlier jobs.
      </Typography>

      {errors.employmentHistory && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>
          {errors.employmentHistory}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {history.map((row, index) => (
          <Box
            key={index}
            sx={{
              p: 2.5,
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              bgcolor: index === 0 ? '#f8fafc' : '#fff',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9375rem' }}>
                {index === 0 ? 'Most recent role *' : `Previous role ${index}`}
              </Typography>
              {history.length > 1 && (
                <IconButton size="small" onClick={() => removeRow(index)} aria-label="Remove role" sx={{ color: '#94a3b8' }}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              )}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Job title *"
                value={row.jobTitle}
                onChange={(e) => updateRow(index, 'jobTitle', e.target.value)}
                placeholder="e.g. Software Engineer"
                sx={inputSx}
              />
              <TextField
                fullWidth
                label="Company *"
                value={row.company}
                onChange={(e) => updateRow(index, 'company', e.target.value)}
                placeholder="Company name"
                sx={inputSx}
              />

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <TextField
                  label="Start date *"
                  type="date"
                  value={row.startDate || ''}
                  onChange={(e) => updateRow(index, 'startDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ ...inputSx, flex: '1 1 160px', minWidth: 160 }}
                />
                <TextField
                  label="End date"
                  type="date"
                  value={row.endDate || ''}
                  onChange={(e) => updateRow(index, 'endDate', e.target.value)}
                  disabled={row.isCurrent}
                  InputLabelProps={{ shrink: true }}
                  sx={{ ...inputSx, flex: '1 1 160px', minWidth: 160 }}
                />
              </Box>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!row.isCurrent}
                    onChange={(e) => updateRow(index, 'isCurrent', e.target.checked)}
                    sx={{ color: '#2463eb' }}
                  />
                }
                label="I currently work here"
              />

              <TextField
                fullWidth
                label="Key responsibilities (this role)"
                multiline
                rows={3}
                value={row.responsibilities || ''}
                onChange={(e) => updateRow(index, 'responsibilities', e.target.value)}
                placeholder="Main duties and achievements for this position"
                sx={inputSx}
              />
            </Box>
          </Box>
        ))}

        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addRow}
          sx={{
            alignSelf: 'flex-start',
            borderRadius: '24px',
            textTransform: 'none',
            borderColor: '#cbd5e1',
            color: '#0f172a',
          }}
        >
          Add another position
        </Button>

        <TextField
          fullWidth
          label="Key achievements (overall, optional)"
          multiline
          rows={3}
          value={formData.keyAchievements}
          onChange={(e) => updateFormData('keyAchievements', e.target.value)}
          placeholder="Stand-out wins across your career (optional)"
          sx={inputSx}
        />
      </Box>
    </Box>
  );
}
