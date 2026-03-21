'use client';

import React from 'react';
import { Box, Container, Typography } from '@mui/material';

export default function JobSearchingCard() {
  return (
    <Box
      sx={{
        padding: { xs: '4rem 1.5rem', md: '5rem 2rem' },
        textAlign: 'center',
        backgroundColor: '#000',
      }}
    >
      <Container maxWidth="md">
        <Typography
          component="h2"
          sx={{
            fontSize: { xs: '1.75rem', md: '2.25rem' },
            fontWeight: 700,
            color: '#FFFFFF',
            marginBottom: '1rem',
            fontFamily: 'inherit',
            lineHeight: 1.2,
          }}
        >
          Built for Australian Job Seekers
        </Typography>

        <Typography
          component="p"
          sx={{
            fontSize: '1.125rem',
            color: 'rgba(255,255,255,0.8)',
            marginBottom: '2.5rem',
            fontFamily: 'inherit',
            lineHeight: 1.7,
            maxWidth: 640,
            mx: 'auto',
          }}
        >
          Searching for a job has become a full-time commitment — on average professionals spend more than 100 hours just submitting applications. By outsourcing this to us, you reclaim your evenings and weekends.
        </Typography>

        {/* Stat highlight */}
        <Box
          sx={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '1.25rem',
            padding: '1.5rem 3rem',
            textAlign: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.45)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '0.375rem',
              fontFamily: 'inherit',
            }}
          >
            Average Time Spent
          </Typography>
          <Typography
            sx={{
              fontSize: '2.5rem',
              fontWeight: 700,
              color: '#F5C518',
              fontFamily: 'inherit',
            }}
          >
            100+ Hours
          </Typography>
          <Typography
            sx={{
              fontSize: '0.8125rem',
              color: 'rgba(255,255,255,0.4)',
              marginTop: '0.25rem',
              fontFamily: 'inherit',
            }}
          >
            Time Lost on Applications
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
