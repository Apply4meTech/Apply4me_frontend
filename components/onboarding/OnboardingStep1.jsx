'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Typography,
  CircularProgress,
  Autocomplete,
} from '@mui/material';
import { useOnboarding } from './OnboardingContext';

const WORK_RIGHTS_OPTIONS = [
  { value: 'Citizen', label: 'Citizen' },
  { value: 'Permanent Resident', label: 'Permanent Resident' },
  { value: 'Visa Holder', label: 'Visa Holder' },
];

export default function OnboardingStep1() {
  const { formData, updateFormData, errors, setFieldError } = useOnboarding();
  const [phoneCodes, setPhoneCodes] = useState([]);
  const [loadingPhoneCodes, setLoadingPhoneCodes] = useState(true);

  useEffect(() => {
    const fetchPhoneCodes = async () => {
      try {
        setLoadingPhoneCodes(true);
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,idd,cca2');
        const data = await response.json();
        const phoneCodeList = data
          .map((country) => ({
            name: country.name.common,
            phoneCode: country.idd?.root ? `${country.idd.root}${country.idd.suffixes?.[0] || ''}` : '',
            code: country.cca2,
            display: `${country.name.common} (${country.idd?.root ? `${country.idd.root}${country.idd.suffixes?.[0] || ''}` : ''})`,
          }))
          .filter((country) => country.phoneCode)
          .sort((a, b) => a.name.localeCompare(b.name));
        setPhoneCodes(phoneCodeList);
      } catch (error) {
        setPhoneCodes([
          { name: 'Australia', phoneCode: '+61', code: 'AU', display: 'Australia (+61)' },
          { name: 'United Kingdom', phoneCode: '+44', code: 'GB', display: 'United Kingdom (+44)' },
          { name: 'India', phoneCode: '+91', code: 'IN', display: 'India (+91)' },
        ]);
      } finally {
        setLoadingPhoneCodes(false);
      }
    };
    fetchPhoneCodes();
  }, []);

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    updateFormData(field, value);
    if (field === 'workRightsInAustralia' && value !== 'Visa Holder') {
      updateFormData('visaType', '');
      setFieldError('visaType', '');
    }
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '24px',
      '& fieldset': { borderColor: '#d1d5db' },
    },
  };

  const showVisaType = formData.workRightsInAustralia === 'Visa Holder';

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a', mb: 3 }}>
        Personal Details
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Full Name * */}
        <TextField
          fullWidth
          label="Full Name *"
          value={formData.fullName}
          onChange={handleChange('fullName')}
          required
          error={!!errors.fullName}
          helperText={errors.fullName}
          placeholder="As per official documents"
          sx={inputSx}
        />

        <TextField
          fullWidth
          label="Email Address *"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          required
          error={!!errors.email}
          helperText={errors.email}
          sx={inputSx}
        />

        {/* Phone Number * (with country code) */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <Box sx={{ flex: { sm: 5 } }}>
            <Autocomplete
              fullWidth
              options={phoneCodes}
              getOptionLabel={(option) => option?.display || ''}
              value={phoneCodes.find((c) => c.phoneCode === formData.phoneCode) || null}
              onChange={(_, newValue) => updateFormData('phoneCode', newValue?.phoneCode || '+61')}
              loading={loadingPhoneCodes}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Country Code"
                  error={!!errors.phoneCode}
                  helperText={errors.phoneCode}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: loadingPhoneCodes ? <CircularProgress size={20} /> : params.InputProps.endAdornment,
                  }}
                  sx={inputSx}
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props} key={option.code}>
                  {option.display}
                </Box>
              )}
            />
          </Box>
          <Box sx={{ flex: { sm: 7 } }}>
            <TextField
              fullWidth
              label="Phone Number *"
              type="tel"
              value={formData.phone}
              onChange={handleChange('phone')}
              placeholder="1234567890"
              required
              error={!!errors.phone}
              helperText={errors.phone}
              sx={inputSx}
            />
          </Box>
        </Box>

        {/* Current Location * */}
        <TextField
          fullWidth
          label="Current Location *"
          value={formData.currentLocation}
          onChange={handleChange('currentLocation')}
          required
          error={!!errors.currentLocation}
          helperText={errors.currentLocation}
          placeholder="City, State (e.g. Sydney, NSW)"
          sx={inputSx}
        />

        {/* Work Rights in Australia * */}
        <TextField
          fullWidth
          select
          label="Work Rights in Australia *"
          value={formData.workRightsInAustralia || ''}
          onChange={handleChange('workRightsInAustralia')}
          required
          error={!!errors.workRightsInAustralia}
          helperText={errors.workRightsInAustralia}
          sx={inputSx}
          InputLabelProps={{ shrink: true }}
          SelectProps={{ displayEmpty: true, renderValue: (v) => v || 'Select...' }}
        >
          <MenuItem value="">
            <em>Select...</em>
          </MenuItem>
          {WORK_RIGHTS_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>

        {/* Visa Type (shown only when Visa Holder selected) */}
        <TextField
          fullWidth
          label="Visa Type"
          value={formData.visaType}
          onChange={handleChange('visaType')}
          error={!!errors.visaType}
          helperText={errors.visaType}
          placeholder="e.g. Skilled Independent (subclass 189)"
          sx={{
            ...inputSx,
            display: showVisaType ? 'block' : 'none',
          }}
        />
      </Box>
    </Box>
  );
}
