'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  MenuItem,
  Typography,
  Grid,
  CircularProgress,
  Autocomplete,
} from '@mui/material';
import { useOnboarding } from './OnboardingContext';

export default function OnboardingStep1() {
  const { formData, updateFormData, errors, setFieldError } = useOnboarding();
  const [countries, setCountries] = useState([]);
  const [phoneCodes, setPhoneCodes] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingPhoneCodes, setLoadingPhoneCodes] = useState(true);

  // Fetch countries from REST Countries API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoadingCountries(true);
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,idd,cca2');
        const data = await response.json();
        
        const countryList = data
          .map((country) => ({
            name: country.name.common,
            phoneCode: country.idd?.root ? `${country.idd.root}${country.idd.suffixes?.[0] || ''}` : '',
            code: country.cca2,
          }))
          .filter((country) => country.phoneCode) // Filter out countries without phone codes
          .sort((a, b) => a.name.localeCompare(b.name));
        
        setCountries(countryList);
      } catch (error) {
        console.error('Error fetching countries:', error);
        // Fallback to a basic list if API fails
        setCountries([
          { name: 'United States', phoneCode: '+1', code: 'US' },
          { name: 'Canada', phoneCode: '+1', code: 'CA' },
          { name: 'United Kingdom', phoneCode: '+44', code: 'GB' },
          { name: 'Australia', phoneCode: '+61', code: 'AU' },
          { name: 'India', phoneCode: '+91', code: 'IN' },
        ]);
        setPhoneCodes([
          { name: 'United States', phoneCode: '+1', code: 'US', display: 'United States (+1)' },
          { name: 'Canada', phoneCode: '+1', code: 'CA', display: 'Canada (+1)' },
          { name: 'United Kingdom', phoneCode: '+44', code: 'GB', display: 'United Kingdom (+44)' },
          { name: 'Australia', phoneCode: '+61', code: 'AU', display: 'Australia (+61)' },
          { name: 'India', phoneCode: '+91', code: 'IN', display: 'India (+91)' },
        ]);
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // Fetch phone codes (same as countries but for phone code dropdown)
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
        console.error('Error fetching phone codes:', error);
        // Fallback
        setPhoneCodes([
          { name: 'United States', phoneCode: '+1', code: 'US', display: 'United States (+1)' },
          { name: 'Canada', phoneCode: '+1', code: 'CA', display: 'Canada (+1)' },
          { name: 'United Kingdom', phoneCode: '+44', code: 'GB', display: 'United Kingdom (+44)' },
          { name: 'Australia', phoneCode: '+61', code: 'AU', display: 'Australia (+61)' },
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
    
    // Basic validation
    if (field === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setFieldError('email', 'Please enter a valid email address');
    } else if (field === 'phone' && value && !/^[\d\s\-\+\(\)]+$/.test(value)) {
      setFieldError('phone', 'Please enter a valid phone number');
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a', mb: 3 }}>
        Personal Information
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Full Name */}
        <TextField
          fullWidth
          label="Full Name"
          value={formData.fullName}
          onChange={handleChange('fullName')}
          required
          error={!!errors.fullName}
          helperText={errors.fullName}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
        />

        {/* Email */}
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          required
          error={!!errors.email}
          helperText={errors.email}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
        />

        {/* Phone Code and Phone Number */}
        <Box
  sx={{
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    gap: 2,
    width: '100%',
  }}
>
  {/* Phone Code */}
  <Box sx={{ flex: { sm: 5 }, width: '100%' }}>
    <Autocomplete
      fullWidth
      options={phoneCodes}
      getOptionLabel={(option) => option.display || `${option.name} (${option.phoneCode})` || ''}
      value={
        phoneCodes.find((c) => c.phoneCode === formData.phoneCode) || null
      }
      onChange={(event, newValue) => {
        updateFormData('phoneCode', newValue?.phoneCode || '');
      }}
      loading={loadingPhoneCodes}
      filterOptions={(options, { inputValue }) => {
        const searchTerm = inputValue.toLowerCase();
        return options.filter((option) => {
          const name = option.name?.toLowerCase() || '';
          const phoneCode = option.phoneCode?.toLowerCase() || '';
          const display = option.display?.toLowerCase() || '';
          return name.includes(searchTerm) || phoneCode.includes(searchTerm) || display.includes(searchTerm);
        });
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          label="Phone Code"
          placeholder="Search country or code"
          error={!!errors.phoneCode}
          helperText={errors.phoneCode}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loadingPhoneCodes ? (
                  <CircularProgress size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
        />
      )}
      renderOption={(props, option) => (
        <Box component="li" {...props} key={option.code}>
          {option.display || `${option.name} (${option.phoneCode})`}
        </Box>
      )}
    />
  </Box>

  {/* Phone Number */}
  <Box sx={{ flex: { sm: 7 }, width: '100%' }}>
    <TextField
      fullWidth
      label="Phone number"
      type="tel"
      value={formData.phone}
      onChange={handleChange('phone')}
      placeholder="1234567890"
      error={!!errors.phone}
      helperText={errors.phone}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
        },
      }}
    />
  </Box>
</Box>


        {/* Address */}
        <TextField
          fullWidth
          label="Address"
          value={formData.address}
          onChange={handleChange('address')}
          multiline
          rows={2}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
        />

        {/* Open to Relocate */}
        <FormControlLabel
          control={
            <Switch
              checked={formData.openToRelocate}
              onChange={handleChange('openToRelocate')}
              color="primary"
            />
          }
          label="Open to relocate?"
          sx={{
            '& .MuiFormControlLabel-label': {
              color: '#0f172a',
              fontWeight: 500,
            },
          }}
        />

        {/* Country of Work */}
        <Autocomplete
          options={countries}
          getOptionLabel={(option) => option.name || ''}
          value={countries.find((c) => c.name === formData.countryOfWork) || null}
          onChange={(event, newValue) => {
            updateFormData('countryOfWork', newValue?.name || '');
          }}
          loading={loadingCountries}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Country of work"
              placeholder="Select a country"
              error={!!errors.countryOfWork}
              helperText={errors.countryOfWork}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loadingCountries ? <CircularProgress size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
            />
          )}
          renderOption={(props, option) => (
            <Box component="li" {...props} key={option.code}>
              {option.name}
            </Box>
          )}
        />

        {/* Visa Sponsorship Required */}
        <FormControlLabel
          control={
            <Switch
              checked={formData.visaSponsorshipRequired}
              onChange={handleChange('visaSponsorshipRequired')}
              color="primary"
            />
          }
          label="Visa sponsorship required?"
          sx={{
            '& .MuiFormControlLabel-label': {
              color: '#0f172a',
              fontWeight: 500,
            },
          }}
        />
      </Box>
    </Box>
  );
}


