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
                1. Introduction
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8 }}>
                Apply For Me Inc. (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our job application concierge service. Please read this policy carefully to understand our practices regarding your personal data.
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
                2. Information We Collect
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8, mb: 2 }}>
                We collect information that you provide directly to us, including:
              </Typography>
              <Box component="ul" sx={{ color: '#475569', lineHeight: 2, pl: 3 }}>
                <li><strong>Account Information:</strong> Name, email address, phone number, and password</li>
                <li><strong>Profile Information:</strong> Resume, work history, education, skills, and career preferences</li>
                <li><strong>Payment Information:</strong> Credit card details and billing address (processed securely by our payment providers)</li>
                <li><strong>Communication Data:</strong> Messages and correspondence with our team</li>
                <li><strong>Usage Data:</strong> How you interact with our Service, including pages visited and features used</li>
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
                3. How We Use Your Information
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8, mb: 2 }}>
                We use the information we collect to:
              </Typography>
              <Box component="ul" sx={{ color: '#475569', lineHeight: 2, pl: 3 }}>
                <li>Provide, maintain, and improve our job application services</li>
                <li>Apply to jobs on your behalf using your profile information</li>
                <li>Customize and tailor your resume for specific job applications</li>
                <li>Process payments and send related information</li>
                <li>Send you technical notices, updates, and support messages</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Monitor and analyze trends, usage, and activities</li>
                <li>Detect, investigate, and prevent fraudulent transactions and abuse</li>
              </Box>
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
                4. Information Sharing
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8, mb: 2 }}>
                We may share your information in the following situations:
              </Typography>
              <Box component="ul" sx={{ color: '#475569', lineHeight: 2, pl: 3 }}>
                <li><strong>With Employers:</strong> We submit your application materials to potential employers as part of our service</li>
                <li><strong>Service Providers:</strong> With third-party vendors who perform services on our behalf</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li><strong>With Your Consent:</strong> In any other situation with your explicit permission</li>
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
                5. Data Security
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8 }}>
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include encryption, secure servers, and regular security assessments. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
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
                6. Data Retention
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8 }}>
                We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy. When you delete your account, we will delete or anonymize your personal information within 30 days, unless we are required to retain it for legal or legitimate business purposes.
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
                7. Your Rights
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8, mb: 2 }}>
                Depending on your location, you may have the following rights regarding your personal data:
              </Typography>
              <Box component="ul" sx={{ color: '#475569', lineHeight: 2, pl: 3 }}>
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Objection:</strong> Object to certain processing of your data</li>
                <li><strong>Withdrawal:</strong> Withdraw consent where processing is based on consent</li>
              </Box>
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
                8. Cookies and Tracking
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8 }}>
                We use cookies and similar tracking technologies to track activity on our Service and hold certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or indicate when a cookie is being sent. However, some features of our Service may not function properly without cookies.
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
                9. Children&apos;s Privacy
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8 }}>
                Our Service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately, and we will take steps to delete such information.
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
                10. Changes to This Policy
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8 }}>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. You are advised to review this Privacy Policy periodically for any changes. Changes are effective when they are posted on this page.
              </Typography>
            </Box>

            {/* Section 11 */}
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
                11. Contact Us
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8 }}>
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </Typography>
              <Box sx={{ mt: 2, p: 3, bgcolor: '#f1f5f9', borderRadius: '8px' }}>
                <Typography sx={{ color: '#1E293B', fontWeight: 600 }}>Apply For Me Inc.</Typography>
                <Typography sx={{ color: '#475569' }}>Email: privacy@applyforme.com</Typography>
                <Typography sx={{ color: '#475569' }}>Address: 123 Career Street, San Francisco, CA 94102</Typography>
                <Typography sx={{ color: '#475569', mt: 1 }}>Data Protection Officer: dpo@applyforme.com</Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </MainLayout>
  );
}
