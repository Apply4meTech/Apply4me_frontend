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
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'inherit',
          marginTop: { xs: '-64px', md: '-72px' },
          paddingTop: { xs: '64px', md: '72px' },
          background: 'linear-gradient(to right, #001f4d 0%, #0056b3 100%)',
        }}
      >
        {/* Hero — transparent so page gradient blends with header */}
        <Box
          sx={{
            background: 'transparent',
            py: { xs: 5, md: 7 },
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Container maxWidth="lg">
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: '2.25rem', md: '3rem' },
                fontWeight: 700,
                color: '#FFFFFF',
                marginBottom: '1rem',
              }}
            >
              Privacy Policy
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem' },
                color: 'rgba(255, 255, 255, 0.95)',
                maxWidth: '680px',
                margin: '0 auto',
                lineHeight: 1.6,
                fontWeight: 400,
              }}
            >
              This Privacy Policy outlines how ApplyForMe collects, uses, stores, and protects your personal information in accordance with the Australian Privacy Act 1988 (Cth) and the Australian Privacy Principles.
            </Typography>
            <Typography
              sx={{
                fontSize: '0.875rem',
                color: 'rgba(255, 255, 255, 0.85)',
                mt: 2,
              }}
            >
              Last updated: 19 March 2026
            </Typography>
          </Container>
        </Box>

        {/* Main Content Section - White background */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: '#FFFFFF',
            py: { xs: 5, md: 8 },
            px: { xs: 1.5, md: 2 },
          }}
        >
          <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {/* Section 1 */}
              <Box>
                <Typography
                  component="h2"
                  sx={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#111827',
                    mb: 1.5,
                  }}
                >
                  1. Information We Collect
                </Typography>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, mb: 1.5, fontSize: '1rem' }}>
                  We may collect the following personal information to deliver our services:
                </Typography>
                <Box component="ul" sx={{ color: '#1f2937', lineHeight: 2, pl: 3, m: 0, fontSize: '1rem', '& li': { mb: 0.25 } }}>
                  <li>Full name</li>
                  <li>Email address and contact details</li>
                  <li>Resume and supporting documents</li>
                  <li>Job preferences, including role, location, and salary expectations</li>
                  <li>LinkedIn profile URL (if provided)</li>
                  <li>Payment information (processed securely via third-party payment providers)</li>
                </Box>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, mt: 1, fontSize: '1rem' }}>
                  We collect only the information reasonably necessary to provide our job application management services.
                </Typography>
              </Box>

              {/* Section 2 */}
              <Box>
                <Typography
                  component="h2"
                  sx={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#111827',
                    mb: 1.5,
                  }}
                >
                  2. How We Collect Information
                </Typography>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, mb: 1.5, fontSize: '1rem' }}>
                  We collect personal information:
                </Typography>
                <Box component="ul" sx={{ color: '#1f2937', lineHeight: 2, pl: 3, m: 0, fontSize: '1rem', '& li': { mb: 0.25 } }}>
                  <li>Directly from you when you register, complete onboarding forms, or contact us</li>
                  <li>When you upload documents through our platform</li>
                  <li>Through payment providers when processing transactions</li>
                  <li>Through website analytics or cookies (if applicable)</li>
                </Box>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, mt: 1, fontSize: '1rem' }}>
                  Where reasonable and practicable, we collect information directly from you.
                </Typography>
              </Box>

              {/* Section 3 */}
              <Box>
                <Typography
                  component="h2"
                  sx={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#111827',
                    mb: 1.5,
                  }}
                >
                  3. How We Use Your Information
                </Typography>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, mb: 1.5, fontSize: '1rem' }}>
                  Your information may be used to:
                </Typography>
                <Box component="ul" sx={{ color: '#1f2937', lineHeight: 2, pl: 3, m: 0, fontSize: '1rem', '& li': { mb: 0.25 } }}>
                  <li>Provide job application management services</li>
                  <li>Submit job applications on your behalf</li>
                  <li>Communicate service updates and support</li>
                  <li>Improve and optimise our services</li>
                  <li>Comply with applicable legal and regulatory obligations</li>
                </Box>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, mt: 1, fontSize: '1rem' }}>
                  We use your information only for the purposes for which it was collected or as otherwise permitted by law.
                </Typography>
              </Box>

              {/* Section 4 */}
              <Box>
                <Typography
                  component="h2"
                  sx={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#111827',
                    mb: 1.5,
                  }}
                >
                  4. Disclosure of Personal Information
                </Typography>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, mb: 1.5, fontSize: '1rem' }}>
                  We do not sell, rent, or trade your personal information.
                </Typography>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, mb: 1.5, fontSize: '1rem' }}>
                  Your information may be disclosed:
                </Typography>
                <Box component="ul" sx={{ color: '#1f2937', lineHeight: 2, pl: 3, m: 0, fontSize: '1rem', '& li': { mb: 0.25 } }}>
                  <li>To authorised internal team members assisting with your service</li>
                  <li>To employers or job platforms strictly for the purpose of submitting applications as directed by you</li>
                  <li>To third-party service providers (such as payment processors or cloud hosting providers) where necessary to operate our services</li>
                </Box>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem' }}>
                  We take reasonable steps to ensure third-party providers handle your information securely.
                </Typography>
              </Box>

              {/* Section 5 */}
              <Box>
                <Typography
                  component="h2"
                  sx={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#111827',
                    mb: 1.5,
                  }}
                >
                  5. Overseas Disclosure
                </Typography>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, mb: 1.5, fontSize: '1rem' }}>
                  Some third-party service providers (such as cloud storage, analytics tools, or payment gateways) may store or process personal information outside Australia.
                </Typography>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem' }}>
                  By using our services, you acknowledge that your information may be transferred overseas where necessary to provide our services. We take reasonable steps to ensure that such providers comply with applicable privacy obligations.
                </Typography>
              </Box>

              {/* Section 6 */}
              <Box>
                <Typography
                  component="h2"
                  sx={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#111827',
                    mb: 1.5,
                  }}
                >
                  6. Data Storage and Security
                </Typography>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, mb: 1.5, fontSize: '1rem' }}>
                  We take reasonable technical and organisational measures to protect your personal information from misuse, interference, loss, unauthorised access, modification, or disclosure.
                </Typography>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem' }}>
                  However, no method of electronic transmission or storage is completely secure, and we cannot guarantee absolute security.
                </Typography>
              </Box>

              {/* Section 7 */}
              <Box>
                <Typography
                  component="h2"
                  sx={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#111827',
                    mb: 1.5,
                  }}
                >
                  7. Data Retention
                </Typography>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, mb: 1.5, fontSize: '1rem' }}>
                  We retain personal information only for as long as reasonably necessary to:
                </Typography>
                <Box component="ul" sx={{ color: '#1f2937', lineHeight: 2, pl: 3, m: 0, fontSize: '1rem', '& li': { mb: 0.25 } }}>
                  <li>Deliver our services</li>
                  <li>Comply with legal and regulatory obligations</li>
                  <li>Resolve disputes and enforce agreements</li>
                </Box>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem' }}>
                  When information is no longer required, it is securely deleted or de-identified.
                </Typography>
              </Box>

              {/* Section 8 */}
              <Box>
                <Typography
                  component="h2"
                  sx={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#111827',
                    mb: 1.5,
                  }}
                >
                  8. Your Rights
                </Typography>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, mb: 1.5, fontSize: '1rem' }}>
                  Under the Australian Privacy Act, you have the right to:
                </Typography>
                <Box component="ul" sx={{ color: '#1f2937', lineHeight: 2, pl: 3, m: 0, fontSize: '1rem', '& li': { mb: 0.25 } }}>
                  <li>Request access to your personal information</li>
                  <li>Request correction of inaccurate or outdated information</li>
                  <li>Request deletion of your personal information (subject to legal requirements)</li>
                </Box>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem' }}>
                  To exercise these rights, please contact us using the details below.
                </Typography>
              </Box>

              {/* Section 9 */}
              <Box>
                <Typography
                  component="h2"
                  sx={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#111827',
                    mb: 1.5,
                  }}
                >
                  9. Complaints
                </Typography>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, mb: 1.5, fontSize: '1rem' }}>
                  If you believe we have breached the Australian Privacy Principles or mishandled your personal information, you may lodge a complaint by contacting us.
                </Typography>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, mb: 1.5, fontSize: '1rem' }}>
                  We will acknowledge your complaint and aim to respond within a reasonable timeframe.
                </Typography>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem' }}>
                  If you are not satisfied with our response, you may contact the Office of the Australian Information Commissioner (OAIC) at www.oaic.gov.au.
                </Typography>
              </Box>

              {/* Section 10 - Contact */}
              <Box>
                <Typography
                  component="h2"
                  sx={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#111827',
                    mb: 1.5,
                  }}
                >
                  10. Contact Us
                </Typography>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, mb: 1.5, fontSize: '1rem' }}>
                  For privacy-related questions, requests, or complaints, please contact:
                </Typography>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', fontWeight: 600 }}>
                  ApplyForMe
                </Typography>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem' }}>
                  Email: contactus@applyforme.com.au
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </MainLayout>
  );
}
