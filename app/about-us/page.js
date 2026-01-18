'use client';

import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Header from '../../components/Header';

export default function AboutUs() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #1E3A8A 0%, #0F172A 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />

      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: { xs: '3rem 1.5rem', md: '5rem 2rem' },
        }}
      >
        <Container maxWidth="lg">
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 700,
              color: '#FFFFFF',
              marginBottom: '2rem',
              textAlign: 'center',
              fontFamily: 'inherit',
            }}
          >
            About Us
          </Typography>

          <Typography
            component="p"
            sx={{
              fontSize: { xs: '1rem', md: '1.125rem' },
              color: '#FFFFFF',
              lineHeight: 1.8,
              maxWidth: '48rem',
              margin: '0 auto',
              opacity: 0.9,
              fontFamily: 'inherit',
              textAlign: 'center',
            }}
          >
            Learn more about ApplyForMe and our mission to help job seekers land their dream positions.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

