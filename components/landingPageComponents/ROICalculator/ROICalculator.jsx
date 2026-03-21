'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography } from '@mui/material';

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
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => ref.current && observer.unobserve(ref.current);
  }, []);

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
        padding: { xs: '4rem 1.5rem', md: '5rem 2rem' },
        backgroundColor: '#000',
      }}
    >
      <Container maxWidth="lg">
        <Box
          ref={ref}
          sx={{
            background: 'linear-gradient(180deg, #09316f 0%, #115ace 100%)',
            borderRadius: '48px',
            padding: { xs: 2, md: 5 },
            maxWidth: 900,
            mx: 'auto',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Box
              sx={{
                display: 'inline-block',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.3)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)',
                borderRadius: '9999px',
                color: 'rgba(255,255,255,0.9)',
                fontSize: '0.6875rem',
                letterSpacing: '0.12em',
                padding: '0.375rem 1.125rem',
              }}
            >
              ROI CALCULATOR
            </Box>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
              gap: { xs: 2, lg: 4 },
              alignItems: 'stretch',
              mt: 2,
            }}
          >
            {/* Full-width header */}
            <Box
              sx={{
                gridColumn: { xs: 'auto', lg: '1 / -1' },
                textAlign: 'center',
                mb: { xs: 1.5, lg: 2.5 },
              }}
            >
              <Typography
                sx={{
                  color: '#fff',
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  fontWeight: 700,
                  lineHeight: 1.3,
                  mb: 1,
                  fontFamily: 'inherit',
                }}
              >
                How much is your time really worth?
              </Typography>
              <Typography
                sx={{
                  color: 'rgba(255,255,255,0.85)',
                  fontSize: '0.9375rem',
                  lineHeight: 1.65,
                  fontFamily: 'inherit',
                  maxWidth: 760,
                  mx: 'auto',
                }}
              >
                Calculate your potential savings by delegating the grunt work to us.
              </Typography>
            </Box>

            {/* Inputs split left/right */}
            <Box>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1fr' },
                  gap: { xs: 2, md: 2.5 },
                  alignItems: 'start',
                }}
              >
                <Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.8125rem', fontWeight: 500, mb: 0.5, fontFamily: 'inherit' }}>
                    Your hourly income ($)
                  </Typography>
                  <Box sx={{ position: 'relative' }}>
                    <Box component="span" sx={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.6)', fontSize: '0.9375rem' }}>$</Box>
                    <Box
                      component="input"
                      type="number"
                      value={hourlyIncome}
                      onChange={handleHourlyChange}
                      placeholder="20"
                      sx={{
                        width: '100%',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '9999px',
                        padding: '0.875rem 1.25rem 0.875rem 2rem',
                        fontSize: '0.9375rem',
                        color: '#fff',
                        fontFamily: 'inherit',
                        outline: 'none',
                        '&::placeholder': { color: 'rgba(255,255,255,0.4)' },
                      }}
                    />
                  </Box>
                </Box>

                <Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.8125rem', fontWeight: 500, mb: 0.5, fontFamily: 'inherit' }}>
                    Minutes per job application
                  </Typography>
                  <Box sx={{ position: 'relative' }}>
                    <Box component="span" sx={{ position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.6)', fontSize: '0.8125rem' }}>Min</Box>
                    <Box
                      component="input"
                      type="number"
                      value={minutesPerJob}
                      onChange={handleMinutesChange}
                      placeholder="10"
                      sx={{
                        width: '100%',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '9999px',
                        padding: '0.875rem 3rem 0.875rem 1.25rem',
                        fontSize: '0.9375rem',
                        color: '#fff',
                        fontFamily: 'inherit',
                        outline: 'none',
                        '&::placeholder': { color: 'rgba(255,255,255,0.4)' },
                      }}
                    />
                  </Box>
                </Box>

                <Box sx={{ mt: 0.5 }}>
                  <Box
                    component="button"
                    sx={{
                      width: '100%',
                      background: '#000',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '9999px',
                      padding: '0.875rem 1.5rem',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      textTransform: 'uppercase',
                      '&:hover': { background: '#1a1a1a' },
                    }}
                  >
                    Calculate Savings
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Right: Results card */}
            <Box
              sx={{
                background: 'linear-gradient(180deg, #000 0%, #626262 100%)',
                borderRadius: '24px',
                padding: 2.5,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: 220,
                textAlign: 'center',
              }}
            >
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.6875rem', letterSpacing: '0.12em', mb: 1, fontFamily: 'inherit' }}>
                ESTIMATED SAVINGS
              </Typography>
              <Typography sx={{ color: '#fff', fontSize: { xs: '2.5rem', md: '3rem' }, fontWeight: 700, fontFamily: 'inherit', mb: 1 }}>
                ${calculatedSavings.toLocaleString()}+
              </Typography>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  background: 'rgba(34,197,94,0.2)',
                  border: '1px solid rgba(34,197,94,0.4)',
                  color: '#4ade80',
                  borderRadius: '9999px',
                  padding: '0.375rem 1rem',
                  fontSize: '0.8125rem',
                  width: 'fit-content',
                  mx: 'auto',
                  mb: 1,
                }}
              >
                ↑ {hoursSaved.toLocaleString()}+ Hours Saved
              </Box>
              <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontFamily: 'inherit', mt: 'auto' }}>
                Based on 1,000 applications at {minutesPerJob || '0'} min per job and ${hourlyIncome || '0'}/hr.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
