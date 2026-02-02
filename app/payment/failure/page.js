'use client';

import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import MainLayout from '../../../components/layouts/MainLayout';
import Link from 'next/link';

export default function PaymentFailure() {
  return (
    <MainLayout>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F8FAFC',
          padding: { xs: '2rem', md: '0' },
        }}
      >
        <Container maxWidth="sm">
          <Box
            sx={{
              backgroundColor: '#FFFFFF',
              borderRadius: '1rem',
              padding: { xs: '2rem', md: '3rem' },
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              textAlign: 'center',
            }}
          >
            <ErrorOutlineIcon
              sx={{
                fontSize: '5rem',
                color: '#EF4444',
                marginBottom: '1.5rem',
              }}
            />
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: '1.5rem', md: '2rem' },
                fontWeight: 700,
                color: '#1E293B',
                marginBottom: '1rem',
                fontFamily: 'inherit',
              }}
            >
              Payment Failed
            </Typography>
            <Typography
              sx={{
                fontSize: '1rem',
                color: '#64748B',
                marginBottom: '2rem',
                fontFamily: 'inherit',
                lineHeight: 1.6,
              }}
            >
              We couldn't process your payment. This could be due to insufficient funds, network issues, or payment gateway problems. Please try again or contact support if the issue persists.
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: '1rem',
                justifyContent: 'center',
              }}
            >
              <Button
                component={Link}
                href="/pricing"
                variant="contained"
                sx={{
                  backgroundColor: '#2563EB',
                  color: '#FFFFFF',
                  padding: '0.75rem 2rem',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#1E3A8A',
                  },
                }}
              >
                Try Again
              </Button>
              <Button
                component={Link}
                href="/dashboard"
                variant="outlined"
                sx={{
                  borderColor: '#2563EB',
                  color: '#2563EB',
                  padding: '0.75rem 2rem',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#1E3A8A',
                    backgroundColor: 'rgba(37, 99, 235, 0.04)',
                  },
                }}
              >
                Go to Dashboard
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </MainLayout>
  );
}

