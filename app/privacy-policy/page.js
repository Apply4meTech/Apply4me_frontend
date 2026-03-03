'use client';

import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import MainLayout from '../../components/layouts/MainLayout';

export default function PrivacyPolicy() {
  return (
    <MainLayout>
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: '#f6f6f8',
          fontFamily: '"Manrope", sans-serif',
        }}
      >
        {/* Hero Section */}
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
              Privacy Policy
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '1rem', md: '1.25rem' },
                color: 'rgba(255, 255, 255, 0.8)',
                maxWidth: '600px',
                margin: '0 auto',
              }}
            >
              Your privacy is important to us. Learn how we collect, use, and protect your data.
            </Typography>
            <Typography
              sx={{
                fontSize: '0.875rem',
                color: 'rgba(255, 255, 255, 0.6)',
                mt: 2,
              }}
            >
              Last updated: [Add date]
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
                1. Information We Collect
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8, mb: 2 }}>
                We may collect the following information:
              </Typography>
              <Box component="ul" sx={{ color: '#475569', lineHeight: 2, pl: 3 }}>
                <li>Full name</li>
                <li>Email address and contact details</li>
                <li>Resume and supporting documents</li>
                <li>Job preferences (role, location, salary)</li>
                <li>LinkedIn profile URL</li>
                <li>Payment details (processed securely via third-party gateways)</li>
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
                2. How We Use Your Information
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8, mb: 2 }}>
                We use your information to:
              </Typography>
              <Box component="ul" sx={{ color: '#475569', lineHeight: 2, pl: 3 }}>
                <li>Provide job application assistance</li>
                <li>Apply to jobs on your behalf</li>
                <li>Communicate service updates</li>
                <li>Improve our services</li>
                <li>Comply with legal obligations</li>
              </Box>
            </Box>

            {/* Section 3 */}
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
                3. Data Sharing
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8 }}>
                We do <strong>not</strong> sell or rent your data.
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8, mt: 1 }}>
                Your information is shared <strong>only internally</strong> with authorised team members assisting with your service.
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
                4. Data Storage & Security
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8 }}>
                We take reasonable steps to protect your personal data from misuse, loss, or unauthorised access.
              </Typography>
            </Box>

            {/* Section 5 */}
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
                5. Data Retention
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8 }}>
                We retain data only for as long as required to deliver services or meet legal requirements.
              </Typography>
            </Box>

            {/* Section 6 */}
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
                6. Your Rights
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8 }}>
                You may request access, correction, or deletion of your data by contacting us.
              </Typography>
            </Box>

            {/* Section 7 */}
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
                7. Contact
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8, mb: 2 }}>
                For any questions or requests regarding your privacy, please contact us:
              </Typography>
              <Box sx={{ mt: 2, p: 3, bgcolor: '#f1f5f9', borderRadius: '8px' }}>
                <Typography sx={{ color: '#1E293B', fontWeight: 600 }}>ApplyForMe</Typography>
                <Typography sx={{ color: '#475569' }}>📧 Contact: contactus@applyforme.com.au</Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </MainLayout>
  );
}

