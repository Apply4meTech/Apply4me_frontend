'use client';

import React, { useState } from 'react';
import { Box, Container, Typography, TextField } from '@mui/material';
import Button from '../../Button';

export default function ROICalculator() {
  const [hourlyRate, setHourlyRate] = useState(75);
  const [calculatedSavings, setCalculatedSavings] = useState(7500);
  const [hoursSaved] = useState(100);

  const handleCalculate = () => {
    // Calculate savings: hourly rate * hours saved
    const savings = hourlyRate * hoursSaved;
    setCalculatedSavings(savings);
  };

  const handleInputChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setHourlyRate(value);
    // Auto-calculate on input change
    setCalculatedSavings(value * hoursSaved);
  };

  return (
    <Box
      sx={{
        padding: { xs: '3rem 1.5rem', md: '5rem 2rem' },
        backgroundColor: '#F1F2F4',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            gap: { xs: '1.5rem', md: '2rem' },
            alignItems: 'stretch',
          }}
        >
          {/* Left Card - ROI Calculator */}
          <Box
            sx={{
              flex: 1,
              backgroundColor: '#FFFFFF',
              borderRadius: '1rem',
              padding: { xs: '1.5rem', md: '2.5rem' },
              boxShadow: '0 0.125rem 0.5rem rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}
          >
            {/* ROI Calculator Label */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#EFF6FF',
                color: '#3B82F6',
                padding: { xs: '0.5rem 1rem', md: '0.625rem 1.25rem' },
                borderRadius: '1.5rem',
                width: 'fit-content',
                fontSize: { xs: '0.75rem', md: '0.875rem' },
                fontWeight: 600,
                fontFamily: 'inherit',
              }}
            >
              <svg
                width="1rem"
                height="1rem"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 3V21H21M7 16L12 11L16 15L21 10M21 10V14M21 10H17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              ROI CALCULATOR
            </Box>

            {/* Headline */}
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                fontWeight: 700,
                color: '#1F2937',
                fontFamily: 'inherit',
                lineHeight: 1.2,
              }}
            >
              How much is your time really worth?
            </Typography>

            {/* Description */}
            <Typography
              component="p"
              sx={{
                fontSize: { xs: '0.875rem', md: '1rem' },
                color: '#6B7280',
                lineHeight: 1.6,
                fontFamily: 'inherit',
              }}
            >
              Don't let job hunting become a second unpaid job. Calculate your potential ROI by delegating the grunt work to us.
            </Typography>

            {/* Input Field */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Typography
                component="label"
                sx={{
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  fontWeight: 500,
                  color: '#374151',
                  fontFamily: 'inherit',
                }}
              >
                Your Hourly Rate Estimate ($)
              </Typography>
              <TextField
                type="number"
                value={hourlyRate}
                onChange={handleInputChange}
                placeholder="75"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#FFFFFF',
                    borderRadius: '0.5rem',
                    '& fieldset': {
                      borderColor: '#E5E7EB',
                    },
                    '&:hover fieldset': {
                      borderColor: '#D1D5DB',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3B82F6',
                    },
                  },
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '1rem', md: '1.125rem' },
                    padding: { xs: '0.75rem', md: '0.875rem' },
                    fontFamily: 'inherit',
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <Box
                      component="span"
                      sx={{
                        color: '#6B7280',
                        marginRight: '0.5rem',
                        fontSize: { xs: '1rem', md: '1.125rem' },
                      }}
                    >
                      $
                    </Box>
                  ),
                }}
              />
            </Box>

            {/* Calculate Button */}
            <Box sx={{ marginTop: '0.5rem' }}>
              <Button
                variant="primary"
                onClick={handleCalculate}
                fullWidth
              >
                <Box
                  component="span"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <svg
                    width="1.25rem"
                    height="1.25rem"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 7H6C4.89543 7 4 7.89543 4 9V18C4 19.1046 4.89543 20 6 20H15C16.1046 20 17 19.1046 17 18V15M9 7C9 8.10457 9.89543 9 11 9H13C14.1046 9 15 8.10457 15 7M9 7C9 5.89543 9.89543 5 11 5H13C14.1046 5 15 5.89543 15 7M15 7H18M18 7L21 10M21 10L18 13M21 10H12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Calculate Savings
                </Box>
              </Button>
            </Box>
          </Box>

          {/* Right Card - Estimated Savings */}
          <Box
            sx={{
              flex: { xs: 1, lg: '0 0 20rem' },
              backgroundColor: '#1E3A8A',
              borderRadius: '1rem',
              padding: { xs: '2rem', md: '2.5rem' },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: { xs: 'auto', lg: '100%' },
            }}
          >
            {/* Header */}
            <Typography
              component="h3"
              sx={{
                fontSize: { xs: '0.875rem', md: '1rem' },
                fontWeight: 600,
                color: '#FFFFFF',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontFamily: 'inherit',
                marginBottom: '1.5rem',
              }}
            >
              ESTIMATED SAVINGS
            </Typography>

            {/* Savings Amount */}
            <Box sx={{ marginBottom: '1.5rem' }}>
              <Typography
                component="div"
                sx={{
                  fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
                  fontWeight: 700,
                  color: '#FFFFFF',
                  fontFamily: 'inherit',
                  lineHeight: 1,
                }}
              >
                ${calculatedSavings.toLocaleString()}+
              </Typography>
            </Box>

            {/* Hours Saved */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.5rem',
              }}
            >
              <Typography
                component="span"
                sx={{
                  fontSize: { xs: '1rem', md: '1.125rem' },
                  fontWeight: 600,
                  color: '#10B981',
                  fontFamily: 'inherit',
                }}
              >
                {hoursSaved}+ Hours Saved
              </Typography>
              <svg
                width="1.25rem"
                height="1.25rem"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 17L17 7M17 7H7M17 7V17"
                  stroke="#10B981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Box>

            {/* Disclaimer */}
            <Typography
              component="p"
              sx={{
                fontSize: { xs: '0.75rem', md: '0.875rem' },
                color: '#E5E7EB',
                fontFamily: 'inherit',
                lineHeight: 1.5,
              }}
            >
              Based on average application time of {hoursSaved} hours at your entered rate.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

