'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

export default function StatCard({ number, title, description }) {
  return (
    <Box
      sx={{
        backgroundColor: '#FFFFFF',
        borderRadius: '1rem',
        padding: { xs: '1.5rem', md: '2rem' },
        boxShadow: '0 0.25rem 0.375rem rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        flex: 1,
        minWidth: { xs: '100%', sm: 'calc(50% - 0.75rem)', md: 'auto' },
      }}
    >
      <Typography
        component="div"
        sx={{
          fontSize: { xs: '2rem', md: '2.5rem', lg: '3rem' },
          fontWeight: 700,
          color: '#3B82F6',
          fontFamily: 'inherit',
        }}
      >
        {number}
      </Typography>
      <Typography
        component="div"
        sx={{
          fontSize: { xs: '1rem', md: '1.125rem' },
          fontWeight: 600,
          color: '#000000',
          fontFamily: 'inherit',
        }}
      >
        {title}
      </Typography>
      <Typography
        component="div"
        sx={{
          fontSize: { xs: '0.875rem', md: '0.9375rem' },
          color: '#6B7280',
          fontFamily: 'inherit',
        }}
      >
        {description}
      </Typography>
    </Box>
  );
}

