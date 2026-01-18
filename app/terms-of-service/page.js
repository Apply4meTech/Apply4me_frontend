'use client';

import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import MainLayout from '../../components/layouts/MainLayout';

export default function TermsOfService() {
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
              Terms of Service
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '1rem', md: '1.25rem' },
                color: 'rgba(255, 255, 255, 0.8)',
                maxWidth: '600px',
                margin: '0 auto',
              }}
            >
              Please read these terms carefully before using our services
            </Typography>
            <Typography
              sx={{
                fontSize: '0.875rem',
                color: 'rgba(255, 255, 255, 0.6)',
                mt: 2,
              }}
            >
              Last updated: January 18, 2026
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
                1. Acceptance of Terms
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8 }}>
                By accessing and using Apply For Me (&quot;the Service&quot;), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our Service. These terms apply to all visitors, users, and others who access or use the Service.
              </Typography>
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
                2. Description of Service
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8, mb: 2 }}>
                Apply For Me is a premium job application concierge service that helps job seekers by:
              </Typography>
              <Box component="ul" sx={{ color: '#475569', lineHeight: 2, pl: 3 }}>
                <li>Applying to jobs on your behalf based on your preferences and qualifications</li>
                <li>Optimizing and tailoring your resume for specific job applications</li>
                <li>Tracking and managing your job applications</li>
                <li>Providing career guidance and application strategy support</li>
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
                3. User Accounts
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8 }}>
                To use our Service, you must create an account and provide accurate, complete, and current information. You are responsible for safeguarding your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized access to or use of your account. We reserve the right to disable any account at any time if we believe you have violated these Terms.
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
                4. User Responsibilities
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8, mb: 2 }}>
                As a user of our Service, you agree to:
              </Typography>
              <Box component="ul" sx={{ color: '#475569', lineHeight: 2, pl: 3 }}>
                <li>Provide accurate and truthful information about your qualifications, experience, and job preferences</li>
                <li>Not misrepresent your identity or professional background</li>
                <li>Keep your account information up to date</li>
                <li>Not use the Service for any illegal or unauthorized purpose</li>
                <li>Comply with all applicable laws and regulations</li>
              </Box>
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
                5. Payment Terms
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8 }}>
                Certain features of the Service require payment. By subscribing to a paid plan, you agree to pay all applicable fees. Fees are non-refundable except as required by law or as explicitly stated in our refund policy. We reserve the right to change our pricing with reasonable notice. Continued use of the Service after price changes constitutes acceptance of the new pricing.
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
                6. No Guarantee of Employment
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8 }}>
                While we strive to provide high-quality job application services, Apply For Me does not guarantee job interviews, job offers, or employment. The outcome of job applications depends on many factors beyond our control, including employer decisions, market conditions, and your qualifications. Our service is designed to maximize your chances but cannot guarantee specific results.
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
                7. Intellectual Property
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8 }}>
                The Service and its original content, features, and functionality are owned by Apply For Me Inc. and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You retain ownership of any content you provide to us, but grant us a license to use it for providing the Service.
              </Typography>
            </Box>

            {/* Section 8 */}
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
                8. Limitation of Liability
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8 }}>
                To the maximum extent permitted by law, Apply For Me Inc. shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or other intangible losses, resulting from your use of the Service. Our total liability shall not exceed the amount you paid us in the twelve months prior to the claim.
              </Typography>
            </Box>

            {/* Section 9 */}
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
                9. Changes to Terms
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8 }}>
                We reserve the right to modify or replace these Terms at any time. Material changes will be notified via email or through the Service. Your continued use of the Service after changes constitutes acceptance of the new Terms. We encourage you to review these Terms periodically.
              </Typography>
            </Box>

            {/* Section 10 */}
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
                10. Contact Us
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8 }}>
                If you have any questions about these Terms of Service, please contact us at:
              </Typography>
              <Box sx={{ mt: 2, p: 3, bgcolor: '#f1f5f9', borderRadius: '8px' }}>
                <Typography sx={{ color: '#1E293B', fontWeight: 600 }}>Apply For Me Inc.</Typography>
                <Typography sx={{ color: '#475569' }}>Email: legal@applyforme.com</Typography>
                <Typography sx={{ color: '#475569' }}>Address: 123 Career Street, San Francisco, CA 94102</Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </MainLayout>
  );
}
