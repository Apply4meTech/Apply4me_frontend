'use client';

import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Button from '../../Button';

export default function CTASection() {
  return (
    <Box
      sx={{
        backgroundColor: '#0F172A',
        padding: { xs: '4rem 1.5rem', md: '6rem 2rem' },
        textAlign: 'center',
      }}
    >
      <Container maxWidth="lg">
        {/* Headline */}
        <Typography
          component="h2"
          sx={{
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
            fontWeight: 700,
            color: '#FFFFFF',
            marginBottom: '1.5rem',
            fontFamily: 'inherit',
            lineHeight: 1.2,
          }}
        >
          Stop Applying. Start Delegating.
        </Typography>

        {/* Description */}
        <Typography
          component="p"
          sx={{
            fontSize: { xs: '1rem', md: '1.125rem' },
            color: '#FFFFFF',
            marginBottom: '2.5rem',
            fontFamily: 'inherit',
            lineHeight: 1.6,
            maxWidth: '42rem',
            margin: '0 auto 2.5rem',
            opacity: 0.9,
          }}
        >
          Join thousands of professionals who have accelerated their careers with our premium service.
        </Typography>

        {/* CTA Button */}
        <Box
          sx={{
            marginBottom: '1rem',
          }}
        >
          <Button variant="primary">
            Start Your Free Trial
          </Button>
        </Box>

        {/* Disclaimer */}
        <Typography
          component="p"
          sx={{
            fontSize: { xs: '0.875rem', md: '1rem' },
            color: '#FFFFFF',
            fontFamily: 'inherit',
            opacity: 0.8,
          }}
        >
          No credit card required for consultation.
        </Typography>
      </Container>
    </Box>
  );
}

