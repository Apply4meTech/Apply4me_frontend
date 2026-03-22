'use client';

import React from 'react';
import { Box, Typography, FormControlLabel, Checkbox } from '@mui/material';
import Link from 'next/link';
import { useOnboarding } from './OnboardingContext';

export default function OnboardingStep9() {
  const { formData, updateFormData, errors } = useOnboarding();

  const handleCheckboxChange = (field) => (e) => {
    updateFormData(field, e.target.checked);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a', mb: 3 }}>
        Consent & Authorisation
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.consentInfoAccurate || false}
              onChange={handleCheckboxChange('consentInfoAccurate')}
              sx={{
                color: errors.consentInfoAccurate ? '#dc2626' : '#d1d5db',
                '&.Mui-checked': { color: '#1e3a8a' },
              }}
            />
          }
          label={
            <Typography sx={{ fontSize: '0.9375rem' }}>
              Information is accurate and up to date <span style={{ color: '#dc2626' }}>*</span>
            </Typography>
          }
        />
        {errors.consentInfoAccurate && (
          <Typography sx={{ fontSize: '0.75rem', color: '#dc2626', ml: 4 }}>{errors.consentInfoAccurate}</Typography>
        )}

        <FormControlLabel
          control={
            <Checkbox
              checked={formData.consentSubmitApplications || false}
              onChange={handleCheckboxChange('consentSubmitApplications')}
              sx={{
                color: errors.consentSubmitApplications ? '#dc2626' : '#d1d5db',
                '&.Mui-checked': { color: '#1e3a8a' },
              }}
            />
          }
          label={
            <Typography sx={{ fontSize: '0.9375rem' }}>
              Authorise ApplyForMe to submit applications on my behalf <span style={{ color: '#dc2626' }}>*</span>
            </Typography>
          }
        />
        {errors.consentSubmitApplications && (
          <Typography sx={{ fontSize: '0.75rem', color: '#dc2626', ml: 4 }}>{errors.consentSubmitApplications}</Typography>
        )}

        <FormControlLabel
          control={
            <Checkbox
              checked={formData.consentAccountCreation || false}
              onChange={handleCheckboxChange('consentAccountCreation')}
              sx={{
                color: errors.consentAccountCreation ? '#dc2626' : '#d1d5db',
                '&.Mui-checked': { color: '#1e3a8a' },
              }}
            />
          }
          label={
            <Typography sx={{ fontSize: '0.9375rem' }}>
              Authorise account creation where required <span style={{ color: '#dc2626' }}>*</span>
            </Typography>
          }
        />
        {errors.consentAccountCreation && (
          <Typography sx={{ fontSize: '0.75rem', color: '#dc2626', ml: 4 }}>{errors.consentAccountCreation}</Typography>
        )}

        <FormControlLabel
          control={
            <Checkbox
              checked={formData.consentTermsAndPrivacy || false}
              onChange={handleCheckboxChange('consentTermsAndPrivacy')}
              sx={{
                color: errors.consentTermsAndPrivacy ? '#dc2626' : '#d1d5db',
                '&.Mui-checked': { color: '#1e3a8a' },
              }}
            />
          }
          label={
            <Typography sx={{ fontSize: '0.9375rem' }}>
              Agree to{' '}
              <Link href="/terms-of-service" style={{ fontWeight: 600, color: '#1e3a8a', textDecoration: 'none' }}>
                Terms of Service
              </Link>
              {' and '}
              <Link href="/privacy-policy" style={{ fontWeight: 600, color: '#1e3a8a', textDecoration: 'none' }}>
                Privacy Policy
              </Link>{' '}
              <span style={{ color: '#dc2626' }}>*</span>
            </Typography>
          }
        />
        {errors.consentTermsAndPrivacy && (
          <Typography sx={{ fontSize: '0.75rem', color: '#dc2626', ml: 4 }}>{errors.consentTermsAndPrivacy}</Typography>
        )}
      </Box>
    </Box>
  );
}
