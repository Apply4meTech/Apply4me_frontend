'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  const { formData, updateFormData, errors, setFieldError, updateMultipleFields } = useOnboarding();
  const [countries, setCountries] = useState([]);
  const [phoneCodes, setPhoneCodes] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingPhoneCodes, setLoadingPhoneCodes] = useState(true);
  
  // Address autocomplete states
  const [addressInput, setAddressInput] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const autocompleteRef = useRef(null);
  const debounceTimerRef = useRef(null);
  
  // Get API URL
  const getApiUrl = () => {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
    return url.endsWith('/api') ? url.slice(0, -4) : url;
  };
  const API_URL = getApiUrl();
  
  // Sync addressInput with formData.address on mount and when formData changes
  useEffect(() => {
    // Build address from components if available, otherwise use address field
    if (formData.houseNumber || formData.streetName || formData.suburb) {
      const builtAddress = `${formData.houseNumber || ''} ${formData.streetName || ''}, ${formData.suburb || ''}, ${formData.state || ''} ${formData.postcode || ''}`.trim();
      if (builtAddress && builtAddress !== addressInput) {
        setAddressInput(builtAddress);
      }
    } else if (formData.address && formData.address !== addressInput) {
      setAddressInput(formData.address);
    }
  }, [formData.address, formData.houseNumber, formData.streetName, formData.suburb, formData.state, formData.postcode]);

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

  // Fetch address suggestions from backend API
  const fetchAddressSuggestions = async (input) => {
    if (!input || input.trim().length < 2) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoadingAddress(true);
    try {
      const response = await fetch(`${API_URL}/api/address/suggestions?input=${encodeURIComponent(input.trim())}`);
      const data = await response.json();

      if (data.success && data.suggestions) {
        setAddressSuggestions(data.suggestions);
        setShowSuggestions(true);
      } else {
        setAddressSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      setAddressSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoadingAddress(false);
    }
  };

  // Handle address input change with debouncing
  const handleAddressInputChange = (event, newInputValue) => {
    const value = newInputValue || event.target.value;
    setAddressInput(value);
    
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // If user clears the input, clear all address fields
    if (!value) {
      updateMultipleFields({
        houseNumber: '',
        streetName: '',
        suburb: '',
        state: '',
        postcode: '',
        address: ''
      });
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Save manual entry to address field
    updateFormData('address', value);

    // Debounce API call
    debounceTimerRef.current = setTimeout(() => {
      fetchAddressSuggestions(value);
    }, 300);
  };

  // Handle address selection
  const handleAddressSelect = async (suggestion) => {
    setAddressInput(suggestion.description);
    setShowSuggestions(false);
    setAddressSuggestions([]);

    // Fetch place details to get address components
    if (suggestion.placeId) {
      try {
        setLoadingAddress(true);
        const response = await fetch(`${API_URL}/api/address/details?placeId=${encodeURIComponent(suggestion.placeId)}`);
        const data = await response.json();

        if (data.success && data.place) {
          const { formattedAddress, addressComponents } = data.place;
          setAddressInput(formattedAddress);
          updateMultipleFields({
            houseNumber: addressComponents.houseNumber || '',
            streetName: addressComponents.streetName || '',
            suburb: addressComponents.suburb || '',
            state: addressComponents.state || '',
            postcode: addressComponents.postcode || '',
            address: formattedAddress
          });
        }
      } catch (error) {
        console.error('Error fetching place details:', error);
      } finally {
        setLoadingAddress(false);
      }
    }
  };

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
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


        {/* Address Autocomplete */}
        <Box sx={{ position: 'relative' }}>
          <TextField
            id="address-autocomplete-input"
            fullWidth
            label="Address"
            placeholder="Start typing your address (e.g., 20a esther)"
            value={addressInput || formData.address || ''}
            onChange={(e) => {
              handleAddressInputChange(e, e.target.value);
            }}
            onFocus={() => {
              if (addressSuggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            onBlur={() => {
              // Delay hiding suggestions to allow click events
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            error={!!errors.address}
            helperText={errors.address || 'Start typing to see address suggestions'}
            InputProps={{
              endAdornment: loadingAddress ? <CircularProgress size={20} /> : null,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />
          
          {/* Address Suggestions Dropdown */}
          {showSuggestions && addressSuggestions.length > 0 && (
            <Box
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                zIndex: 1000,
                mt: 0.5,
                bgcolor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                maxHeight: '300px',
                overflowY: 'auto',
              }}
            >
              {addressSuggestions.map((suggestion, index) => (
                <Box
                  key={suggestion.placeId || index}
                  onClick={() => handleAddressSelect(suggestion)}
                  sx={{
                    p: 1.5,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: '#f8fafc',
                    },
                    borderBottom: index < addressSuggestions.length - 1 ? '1px solid #e2e8f0' : 'none',
                  }}
                >
                  <Typography sx={{ fontSize: '0.875rem', color: '#0f172a' }}>
                    {suggestion.description}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
          
          {/* Display parsed address components */}
          {(formData.houseNumber || formData.streetName || formData.suburb || formData.state || formData.postcode) && (
            <Box sx={{ mt: 2, p: 2, bgcolor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#64748b', mb: 1, fontWeight: 600 }}>
                Address Details:
              </Typography>
              <Grid container spacing={1}>
                {formData.houseNumber && (
                  <Grid item xs={12} sm={6}>
                    <Typography sx={{ fontSize: '0.75rem', color: '#0f172a' }}>
                      <strong>House Number:</strong> {formData.houseNumber}
                    </Typography>
                  </Grid>
                )}
                {formData.streetName && (
                  <Grid item xs={12} sm={6}>
                    <Typography sx={{ fontSize: '0.75rem', color: '#0f172a' }}>
                      <strong>Street:</strong> {formData.streetName}
                    </Typography>
                  </Grid>
                )}
                {formData.suburb && (
                  <Grid item xs={12} sm={6}>
                    <Typography sx={{ fontSize: '0.75rem', color: '#0f172a' }}>
                      <strong>Suburb:</strong> {formData.suburb}
                    </Typography>
                  </Grid>
                )}
                {formData.state && (
                  <Grid item xs={12} sm={6}>
                    <Typography sx={{ fontSize: '0.75rem', color: '#0f172a' }}>
                      <strong>State:</strong> {formData.state}
                    </Typography>
                  </Grid>
                )}
                {formData.postcode && (
                  <Grid item xs={12} sm={6}>
                    <Typography sx={{ fontSize: '0.75rem', color: '#0f172a' }}>
                      <strong>Postcode:</strong> {formData.postcode}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </Box>

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


