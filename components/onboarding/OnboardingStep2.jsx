'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  MenuItem,
  Typography,
  Chip,
  Autocomplete,
  Grid,
  CircularProgress,
  InputAdornment,
  Button,
} from '@mui/material';
import { useOnboarding } from './OnboardingContext';

const OTHERS_OPTION = '__OTHERS__';
const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
  return url.endsWith('/api') ? url.slice(0, -4) : url;
};

const seniorityLevels = [
  'Intern',
  'Junior',
  'Mid level',
  'Senior/Lead',
];

const jobTypes = [
  'Full time',
  'Part-time',
  'Contract',
  'Internship',
];

const workLocations = [
  'Remote',
  'Hybrid',
  'On-site',
];

export default function OnboardingStep2() {
  const { formData, updateFormData, errors, setFieldError } = useOnboarding();
  const [jobTitlesMasterList, setJobTitlesMasterList] = useState([]);
  const [loadingJobTitles, setLoadingJobTitles] = useState(true);
  const [showCustomJobTitleInput, setShowCustomJobTitleInput] = useState(false);
  const [customJobTitleValue, setCustomJobTitleValue] = useState('');
  const [addingCustomTitle, setAddingCustomTitle] = useState(false);
  const API_URL = getApiUrl();

  useEffect(() => {
    const fetchJobTitles = async () => {
      try {
        setLoadingJobTitles(true);
        const res = await fetch(`${API_URL}/api/job-titles`);
        const data = await res.json();
        if (data.success && Array.isArray(data.jobTitles)) {
          setJobTitlesMasterList(data.jobTitles);
        }
      } catch (err) {
        console.error('Error fetching job titles:', err);
      } finally {
        setLoadingJobTitles(false);
      }
    };
    fetchJobTitles();
  }, []);

  const options = [...jobTitlesMasterList, OTHERS_OPTION];

  const handleAddCustomJobTitle = async () => {
    const trimmed = customJobTitleValue?.trim();
    if (!trimmed || formData.primaryJobTitles?.length >= 3) return;
    if (formData.primaryJobTitles?.includes(trimmed)) {
      setCustomJobTitleValue('');
      setShowCustomJobTitleInput(false);
      return;
    }
    setAddingCustomTitle(true);
    try {
      await fetch(`${API_URL}/api/job-titles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: trimmed }),
      });
      setJobTitlesMasterList((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
      updateFormData('primaryJobTitles', [...(formData.primaryJobTitles || []), trimmed]);
      setCustomJobTitleValue('');
      setShowCustomJobTitleInput(false);
    } catch (err) {
      console.error('Error adding job title:', err);
      updateFormData('primaryJobTitles', [...(formData.primaryJobTitles || []), trimmed]);
      setCustomJobTitleValue('');
      setShowCustomJobTitleInput(false);
    } finally {
      setAddingCustomTitle(false);
    }
  };

  const handleChange = (field) => (e) => {
    let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    
    // Prevent negative values for salary fields
    if (['preferredSalaryMin', 'preferredSalaryMax'].includes(field)) {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue < 0) {
        value = 0;
      }
    }
    
    updateFormData(field, value);
  };

  const handleJobTypeChange = (jobType) => {
    const currentTypes = formData.jobTypes || [];
    if (currentTypes.includes(jobType)) {
      updateFormData(
        'jobTypes',
        currentTypes.filter((type) => type !== jobType)
      );
    } else {
      updateFormData('jobTypes', [...currentTypes, jobType]);
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a', mb: 3 }}>
        Job Preferences & Compensation
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Primary Job Title (Max 3) */}
        <Box>
          <Typography sx={{ fontSize: '0.875rem', color: '#64748b', mb: 1 }}>
            Primary Job Title (Max 3) <span style={{ color: '#dc2626' }}>*</span>
          </Typography>
          <Autocomplete
            multiple
            options={options}
            value={formData.primaryJobTitles || []}
            loading={loadingJobTitles}
            getOptionLabel={(option) => (option === OTHERS_OPTION ? 'Others (enter custom)' : option)}
            onChange={(event, newValue) => {
              const filtered = newValue.filter((v) => v !== OTHERS_OPTION);
              if (newValue.includes(OTHERS_OPTION)) {
                setShowCustomJobTitleInput(true);
              }
              if (filtered.length <= 3) {
                updateFormData('primaryJobTitles', filtered);
              }
            }}
            filterOptions={(opts, { inputValue }) => {
              const list = opts.filter((o) => o !== OTHERS_OPTION);
              const others = opts.find((o) => o === OTHERS_OPTION);
              if (!inputValue) return opts;
              const search = inputValue.toLowerCase();
              const filtered = list.filter((o) => o.toLowerCase().includes(search));
              return others !== undefined ? [...filtered, OTHERS_OPTION] : filtered;
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select from list or choose Others for custom"
                error={!!errors.primaryJobTitles}
                helperText={errors.primaryJobTitles || (formData.primaryJobTitles?.length >= 3 ? 'Maximum 3 job titles reached' : 'Select from list or choose Others to enter custom job title')}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingJobTitles ? <CircularProgress size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '24px',
                    '& fieldset': { borderColor: '#d1d5db' },
                  },
                }}
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props} key={option}>
                {option === OTHERS_OPTION ? 'Others (enter custom)' : option}
              </Box>
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const { key, ...chipProps } = getTagProps({ index });
                return (
                  <Chip
                    key={key}
                    label={option}
                    {...chipProps}
                    sx={{
                      bgcolor: '#eff6ff',
                      color: '#2463eb',
                      '& .MuiChip-deleteIcon': {
                        color: '#2463eb',
                      },
                    }}
                  />
                );
              })
            }
          />
          {showCustomJobTitleInput && (
            <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Enter your job title"
                value={customJobTitleValue}
                onChange={(e) => setCustomJobTitleValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomJobTitle();
                  }
                }}
                disabled={formData.primaryJobTitles?.length >= 3 || addingCustomTitle}
                InputProps={{
                  endAdornment: addingCustomTitle ? (
                    <InputAdornment position="end">
                      <CircularProgress size={20} />
                    </InputAdornment>
                  ) : null,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '24px',
                    '& fieldset': { borderColor: '#d1d5db' },
                  },
                }}
              />
              <Button
                variant="contained"
                size="small"
                onClick={handleAddCustomJobTitle}
                disabled={!customJobTitleValue?.trim() || formData.primaryJobTitles?.length >= 3 || addingCustomTitle}
                sx={{
                  bgcolor: '#2463eb',
                  textTransform: 'none',
                  borderRadius: '24px',
                }}
              >
                Add
              </Button>
              <Button
                size="small"
                onClick={() => {
                  setShowCustomJobTitleInput(false);
                  setCustomJobTitleValue('');
                }}
                sx={{ textTransform: 'none' }}
              >
                Cancel
              </Button>
            </Box>
          )}
        </Box>

        {/* Total Years of Experience */}
        <TextField
          fullWidth
          label="Total years of Experience"
          type="number"
          value={formData.totalYearsExperience}
          onChange={handleChange('totalYearsExperience')}
          inputProps={{ min: 0, max: 50 }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '24px',
              '& fieldset': { borderColor: '#d1d5db' },
            },
          }}
        />

        {/* Seniority Level */}
        <TextField
          fullWidth
          select
          label="Seniority level"
          value={formData.seniorityLevel}
          onChange={handleChange('seniorityLevel')}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '24px',
              '& fieldset': { borderColor: '#d1d5db' },
            },
          }}
        >
          <MenuItem value="">
            <em>Select seniority level</em>
          </MenuItem>
          {seniorityLevels.map((level) => (
            <MenuItem key={level} value={level}>
              {level}
            </MenuItem>
          ))}
        </TextField>

        {/* Job Type */}
        <Box>
          <Typography sx={{ fontSize: '0.875rem', color: '#64748b', mb: 1 }}>
            Job type
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {jobTypes.map((type) => (
              <Chip
                key={type}
                label={type}
                onClick={() => handleJobTypeChange(type)}
                color={formData.jobTypes?.includes(type) ? 'primary' : 'default'}
                sx={{
                  cursor: 'pointer',
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Remote / Hybrid / On-site */}
        <TextField
          fullWidth
          select
          label="Remote / Hybrid / On-site"
          value={formData.workLocation}
          onChange={handleChange('workLocation')}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '24px',
              '& fieldset': { borderColor: '#d1d5db' },
            },
          }}
        >
          <MenuItem value="">
            <em>Select work location preference</em>
          </MenuItem>
          {workLocations.map((location) => (
            <MenuItem key={location} value={location}>
              {location}
            </MenuItem>
          ))}
        </TextField>

        {/* Location Preference */}
        <TextField
          fullWidth
          label="Location Preference"
          value={formData.locationPreference}
          onChange={handleChange('locationPreference')}
          placeholder="e.g., San Francisco, CA or New York, NY"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '24px',
              '& fieldset': { borderColor: '#d1d5db' },
            },
          }}
        />

        {/* Remote Only Toggle */}
        <FormControlLabel
          control={
            <Switch
              checked={formData.remoteOnly}
              onChange={handleChange('remoteOnly')}
              sx={{
                '& .MuiSwitch-track': { bgcolor: '#d1d5db !important', borderRadius: '14px' },
                '& .MuiSwitch-thumb': { bgcolor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' },
                '&.Mui-checked .MuiSwitch-track': { bgcolor: '#1e3a8a !important' },
                '&.Mui-checked .MuiSwitch-thumb': { bgcolor: '#ffffff' },
              }}
            />
          }
          label="Remote only"
          sx={{
            '& .MuiFormControlLabel-label': {
              color: '#0f172a',
              fontWeight: 500,
            },
          }}
        />

        {/* Preferred Salary Range */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Preferred Salary Min"
              type="number"
              value={formData.preferredSalaryMin}
              onChange={handleChange('preferredSalaryMin')}
              placeholder="e.g., 90000"
              inputProps={{ min: 0 }}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1, color: '#64748b' }}>$</Typography>,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '24px',
                  '& fieldset': { borderColor: '#d1d5db' },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Preferred Salary Max"
              type="number"
              value={formData.preferredSalaryMax}
              onChange={handleChange('preferredSalaryMax')}
              placeholder="e.g., 120000"
              inputProps={{ min: 0 }}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1, color: '#64748b' }}>$</Typography>,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '24px',
                  '& fieldset': { borderColor: '#d1d5db' },
                },
              }}
            />
          </Grid>
        </Grid>

        {/* Equity Preference */}
        <FormControlLabel
          control={
            <Switch
              checked={formData.equityPreference}
              onChange={handleChange('equityPreference')}
              sx={{
                '& .MuiSwitch-track': { bgcolor: '#d1d5db !important', borderRadius: '14px' },
                '& .MuiSwitch-thumb': { bgcolor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' },
                '&.Mui-checked .MuiSwitch-track': { bgcolor: '#1e3a8a !important' },
                '&.Mui-checked .MuiSwitch-thumb': { bgcolor: '#ffffff' },
              }}
            />
          }
          label="Equity Preference"
          sx={{
            '& .MuiFormControlLabel-label': {
              color: '#0f172a',
              fontWeight: 500,
            },
          }}
        />

        {/* Skills */}
        <Box>
          <Typography sx={{ fontSize: '0.875rem', color: '#64748b', mb: 1 }}>
            Skills
          </Typography>
          <Autocomplete
            freeSolo
            multiple
            options={[]}
            value={formData.skills || []}
            onChange={(event, newValue) => {
              updateFormData('skills', newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Enter skills and press Enter"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '24px',
                    '& fieldset': { borderColor: '#d1d5db' },
                  },
                }}
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const { key, ...chipProps } = getTagProps({ index });
                return (
                  <Chip
                    key={key}
                    label={option}
                    {...chipProps}
                    sx={{
                      bgcolor: '#eff6ff',
                      color: '#2463eb',
                      '& .MuiChip-deleteIcon': {
                        color: '#2463eb',
                      },
                    }}
                  />
                );
              })
            }
          />
        </Box>
      </Box>
    </Box>
  );
}


