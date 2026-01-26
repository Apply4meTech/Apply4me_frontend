'use client';

import React, { useState } from 'react';
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
} from '@mui/material';
import { useOnboarding } from './OnboardingContext';

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
  const [jobTitleInput, setJobTitleInput] = useState('');

  const handleChange = (field) => (e) => {
    let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    
    // Prevent negative values for salary fields
    if (['minAcceptableSalary', 'preferredSalaryMin', 'preferredSalaryMax'].includes(field)) {
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
            freeSolo
            multiple
            options={[]}
            value={formData.primaryJobTitles || []}
            onChange={(event, newValue) => {
              // Limit to 3 job titles
              if (newValue.length <= 3) {
                updateFormData('primaryJobTitles', newValue);
              }
            }}
            inputValue={jobTitleInput}
            onInputChange={(event, newInputValue) => {
              setJobTitleInput(newInputValue);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && jobTitleInput.trim() && formData.primaryJobTitles.length < 3) {
                event.preventDefault();
                const trimmedValue = jobTitleInput.trim();
                if (!formData.primaryJobTitles.includes(trimmedValue)) {
                  updateFormData('primaryJobTitles', [...formData.primaryJobTitles, trimmedValue]);
                  setJobTitleInput('');
                }
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Enter job title and press Enter"
                error={errors.primaryJobTitles ? true : false}
                helperText={errors.primaryJobTitles || (formData.primaryJobTitles.length >= 3 ? 'Maximum 3 job titles reached' : 'Press Enter to add job title')}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
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
              borderRadius: '8px',
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
              borderRadius: '8px',
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
              borderRadius: '8px',
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
              borderRadius: '8px',
            },
          }}
        />

        {/* Remote Only Toggle */}
        <FormControlLabel
          control={
            <Switch
              checked={formData.remoteOnly}
              onChange={handleChange('remoteOnly')}
              color="primary"
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

        {/* Compensation - Min Acceptable Salary */}
        <TextField
          fullWidth
          label="Compensation - Min acceptable salary"
          type="number"
          value={formData.minAcceptableSalary}
          onChange={handleChange('minAcceptableSalary')}
          placeholder="e.g., 80000"
          inputProps={{ min: 0 }}
          InputProps={{
            startAdornment: <Typography sx={{ mr: 1, color: '#64748b' }}>$</Typography>,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
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
                  borderRadius: '8px',
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
                  borderRadius: '8px',
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
              color="primary"
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
                    borderRadius: '8px',
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


