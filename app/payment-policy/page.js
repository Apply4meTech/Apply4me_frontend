'use client';

import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import MainLayout from '../../components/layouts/MainLayout';

export default function PaymentPolicy() {
  return (
    <MainLayout>
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: '#f6f6f8',
          fontFamily: '"Manrope", sans-serif',
        }}
      >

        <Box
          sx={{
            background: 'linear-gradient(180deg, #1E3A8A 0%, #0F172A 100%)',
            py: { xs: 8, md: 12 },
            textAlign: 'center',
          }}
        >
          <Container maxWidth="lg">
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 700,
                color: '#FFFFFF',
                marginBottom: '1rem',
              }}
            >
              💳 Payment & Refund Policy
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '1rem', md: '1.25rem' },
                color: 'rgba(255, 255, 255, 0.8)',
                maxWidth: '600px',
                margin: '0 auto',
              }}
            >
              ApplyForMe
            </Typography>
          </Container>
        </Box>

        {/* Content Section */}
        <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {/* Section 1 */}
            <Box>
              <Typography
                component="h2"
                sx={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#1E293B',
                  mb: 2,
                }}
              >
                1. Payments
              </Typography>
              <Box component="ul" sx={{ color: '#475569', lineHeight: 2, pl: 3 }}>
                <li>All payments are <strong>one-time, upfront</strong></li>
                <li>Prices are listed in <strong>AUD</strong></li>
                <li>Payments are processed securely via <strong>third-party payment gateways</strong></li>
              </Box>
            </Box>

            {/* Section 2 */}
            <Box>
              <Typography
                component="h2"
                sx={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#1E293B',
                  mb: 2,
                }}
              >
                2. Service Commencement
              </Typography>
              <Box component="ul" sx={{ color: '#475569', lineHeight: 2, pl: 3 }}>
                <li>Work begins once onboarding is completed and required details are provided</li>
                <li>Applications may begin immediately after confirmation</li>
              </Box>
            </Box>

            {/* Section 3 */}
            <Box sx={{ p: 3, bgcolor: '#fee2e2', borderRadius: '8px', borderLeft: '4px solid #ef4444' }}>
              <Typography
                component="h2"
                sx={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#1E293B',
                  mb: 2,
                }}
              >
                3. Refund Policy
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8, mb: 2 }}>
                <strong>No refunds</strong> once job applications have started.
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8 }}>
                Refunds may be considered <strong>only if the service has not commenced</strong>.
              </Typography>
            </Box>

            {/* Section 4 */}
            <Box>
              <Typography
                component="h2"
                sx={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#1E293B',
                  mb: 2,
                }}
              >
                4. Chargebacks
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8 }}>
                Unauthorised chargebacks may result in <strong>service termination</strong>.
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </MainLayout>
  );
}

