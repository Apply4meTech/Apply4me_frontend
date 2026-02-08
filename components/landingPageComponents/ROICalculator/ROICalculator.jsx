'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography, TextField } from '@mui/material';
import Button from '../../Button';

const DEFAULT_APPLICATIONS = 1000;

export default function ROICalculator() {
  const [hourlyIncome, setHourlyIncome] = useState('20');
  const [minutesPerJob, setMinutesPerJob] = useState('10');
  const [hoursSaved, setHoursSaved] = useState(167);
  const [calculatedSavings, setCalculatedSavings] = useState(3333);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  const recalc = (hourly, minutes) => {
    const h = Math.max(0, parseFloat(hourly) || 0);
    const m = Math.max(0, parseFloat(minutes) || 0);
    const totalMinutes = DEFAULT_APPLICATIONS * m;
    const hrs = totalMinutes / 60;
    const savings = hrs * h;
    setHoursSaved(Math.round(hrs));
    setCalculatedSavings(Math.round(savings));
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const handleCalculate = () => {
    recalc(hourlyIncome, minutesPerJob);
  };

  const handleHourlyChange = (e) => {
    const raw = e.target.value;
    setHourlyIncome(raw);
    recalc(raw, minutesPerJob);
  };

  const handleMinutesChange = (e) => {
    const raw = e.target.value;
    setMinutesPerJob(raw);
    recalc(hourlyIncome, raw);
  };

  return (
    <Box
      sx={{
        padding: { xs: '3rem 1.5rem', md: '5rem 2rem' },
        backgroundColor: '#EDF2F7',
      }}
    >
      <Container maxWidth="lg">
        <Box
          ref={ref}
          sx={{
            display: 'flex',
            backgroundColor: '#FFFFFF',
            borderRadius: '1rem',
            padding: { xs: '1.5rem', md: '2.5rem' },
            boxShadow: '0 0.125rem 0.5rem rgba(0, 0, 0, 0.1)',
            flexDirection: { xs: 'column', lg: 'row' },
            gap: { xs: '1.5rem', md: '2rem' },
            alignItems: 'stretch',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
          }}
        >
          {/* Left Card - ROI Calculator */}
          <Box
            sx={{
              flex:0.6,
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
                fontSize: { xs: '1.875rem', md: '2.25rem' },
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
                fontSize: '1.125rem',
                color: '#6B7280',
                lineHeight: 1.75,
                fontFamily: 'inherit',
              }}
            >
              Don't let job hunting become a second unpaid job. Calculate your potential ROI by delegating the grunt work to us.
            </Typography>

            {/* Input: Hourly income */}
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
                Your hourly income ($)
              </Typography>
              <TextField
                type="number"
                value={hourlyIncome}
                onChange={handleHourlyChange}
                placeholder="20"
                inputProps={{ min: 0, step: 1 }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#FFFFFF',
                    borderRadius: '0.5rem',
                    '& fieldset': { borderColor: '#E5E7EB' },
                    '&:hover fieldset': { borderColor: '#D1D5DB' },
                    '&.Mui-focused fieldset': { borderColor: '#3B82F6' },
                  },
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '1rem', md: '1.125rem' },
                    padding: { xs: '0.75rem', md: '0.875rem' },
                    fontFamily: 'inherit',
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <Box component="span" sx={{ color: '#6B7280', marginRight: '0.5rem', fontSize: { xs: '1rem', md: '1.125rem' } }}>
                      $
                    </Box>
                  ),
                }}
              />
            </Box>

            {/* Input: Minutes per job */}
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
                Minutes per job application
              </Typography>
              <TextField
                type="number"
                value={minutesPerJob}
                onChange={handleMinutesChange}
                placeholder="10"
                inputProps={{ min: 0, step: 1 }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#FFFFFF',
                    borderRadius: '0.5rem',
                    '& fieldset': { borderColor: '#E5E7EB' },
                    '&:hover fieldset': { borderColor: '#D1D5DB' },
                    '&.Mui-focused fieldset': { borderColor: '#3B82F6' },
                  },
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '1rem', md: '1.125rem' },
                    padding: { xs: '0.75rem', md: '0.875rem' },
                    fontFamily: 'inherit',
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <Box component="span" sx={{ color: '#6B7280', marginLeft: '0.5rem', fontSize: { xs: '1rem', md: '1.125rem' } }}>
                      min
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
              flex: { xs: 1, md: 0.4 },
              backgroundColor: '#1E293B',
              borderRadius: '1rem',
              padding: { xs: '2rem', md: '2.5rem' },
              paddingBottom: { xs: '2.375rem', md: '2.875rem' },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: { xs: 'auto', md: '60%' },
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              overflow: 'hidden',
              maxHeight:'350px',
              margin:'auto'
            }}
          >
            {/* Blue gradient in bottom right corner */}
            <Box
              sx={{
                position: 'absolute',
                bottom: '0.375rem',
                right: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to top left, rgba(37, 99, 235, 0.3) 0%, rgba(37, 99, 235, 0.15) 30%, transparent 60%)',
                clipPath: 'polygon(100% 100%, 100% 70%, 0% 100%)',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />

           
            <Box sx={{ position: 'relative', zIndex: 2 }}>
              {/* Header */}
              <Typography
                component="h3"
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: '#94A3B8',
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
                    fontSize: { xs: '3rem', sm: '4rem', md: '4.5rem' },
                    fontWeight: 700,
                    color: '#FFFFFF',
                    fontFamily: 'inherit',
                    lineHeight: 1,
                  }}
                >
                  ${calculatedSavings.toLocaleString()}+
                </Typography>
              </Box>

              {/* Hours Saved - Green Pill */}
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  color: '#10B981',
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  marginBottom: '1.5rem',
                  width: 'fit-content',
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
                    d="M7 17L17 7M17 7H7M17 7V17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <Typography
                  component="span"
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: '#10B981',
                    fontFamily: 'inherit',
                  }}
                >
                  {hoursSaved.toLocaleString()}+ Hours Saved
                </Typography>
              </Box>

              {/* Disclaimer */}
              <Typography
                component="p"
                sx={{
                  fontSize: '0.75rem',
                  color: '#94A3B8',
                  fontFamily: 'inherit',
                  lineHeight: 1.5,
                }}
              >
                Based on {DEFAULT_APPLICATIONS.toLocaleString()} applications at {minutesPerJob || '0'} min per job and ${hourlyIncome || '0'}/hr.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

