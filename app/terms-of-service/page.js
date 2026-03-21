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
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'inherit',
          marginTop: { xs: '-64px', md: '-72px' },
          paddingTop: { xs: '64px', md: '72px' },
          background: 'linear-gradient(to right, #0D3370 0%, #1E62D0 100%)',
        }}
      >
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
                fontSize: { xs: '1rem', md: '1.125rem' },
                color: 'rgba(255, 255, 255, 0.95)',
                maxWidth: '560px',
                margin: '0 auto',
                lineHeight: 1.6,
              }}
            >
              Please read these terms carefully before using our services
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

        {/* Content Section - White background */}
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
            {/* Introduction - Light yellow/cream box */}
            <Box sx={{ p: 3, bgcolor: '#FFF9E1', borderRadius: '16px' }}>
              <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontStyle: 'italic', fontSize: '0.9375rem' }}>
                This Terms of Service (&quot;Agreement&quot;) is a legally binding agreement between <strong>ApplyForMe Pty Ltd</strong> (&quot;ApplyForMe,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) and the individual or entity accessing or using our services (&quot;Customer,&quot; &quot;you,&quot; or &quot;your&quot;).
              </Typography>
              <Typography sx={{ color: '#1f2937', lineHeight: 1.8, mt: 2, fontStyle: 'italic', fontSize: '0.9375rem' }}>
                By purchasing, accessing, or using our Services, you agree to be bound by this Agreement.
              </Typography>
              <Typography sx={{ color: '#1f2937', lineHeight: 1.8, mt: 2, fontStyle: 'italic', fontSize: '0.9375rem' }}>
                <strong>ApplyForMe is a career support service. We are not a recruitment agency, employment agency, or employer. We do not provide legal, immigration, financial, or hiring advice.</strong>
              </Typography>
            </Box>

            {/* Section 1 */}
            <Box>
              <Typography component="h2" sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', mb: 1.5 }}>
                1. Definitions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem' }}>
                  <strong>Services</strong> means ApplyForMe&apos;s human-assisted job application support services, including resume and cover letter preparation, application submission, form completion, dashboard access, profile optimisation, and related systems.
                </Typography>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem' }}>
                  <strong>Customer Content</strong> means all information and documents you provide, including resumes, credentials, personal data, and job preferences.
                </Typography>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem' }}>
                  <strong>Third-Party Platforms</strong> means job boards, employer websites, ATS platforms, and recruitment systems such as LinkedIn, Seek, Indeed, and company career portals.
                </Typography>
              </Box>
            </Box>

            {/* Section 2 */}
            <Box>
              <Typography component="h2" sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', mb: 1.5 }}>
                2. Nature of the Services
              </Typography>
              <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', mb: 2 }}>
                ApplyForMe provides job application management and career support services only.
              </Typography>
              <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', mb: 2 }}>
                We do not:
              </Typography>
              <Box component="ul" sx={{ color: '#1f2937', lineHeight: 2, pl: 3, fontSize: '1rem' }}>
                <li>Act as a recruiter, staffing firm, or employment agency</li>
                <li>Represent employers</li>
                <li>Guarantee interviews, job offers, salary outcomes, or employment</li>
              </Box>
              <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', mt: 2 }}>
                All hiring decisions are made solely by employers.
              </Typography>
            </Box>

            {/* Section 2A */}
            <Box>
              <Typography component="h2" sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', mb: 1.5 }}>
                2A. Service Conditions
              </Typography>
              <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', fontWeight: 600, mb: 1 }}>
                Job Posting Expiry
              </Typography>
              <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', mb: 2 }}>
                ApplyForMe is not responsible for applications that cannot be submitted due to job listings expiring, being filled, withdrawn, or otherwise closed prior to submission. This includes roles with short or unspecified application windows.
              </Typography>
              <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', mb: 2 }}>
                While we make reasonable efforts to process applications promptly, submission timing may vary depending on workload, package volume, and the timely provision of information by the Customer.
              </Typography>
              <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', mb: 2 }}>
                Customers are encouraged to provide job links as early as possible to reduce the risk of expiry.
              </Typography>
              <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', fontWeight: 600, mb: 1 }}>
                Service Validity Period
              </Typography>
              <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', mb: 2 }}>
                Each purchased service package is valid for 90 days from the date of purchase unless otherwise specified in writing.
              </Typography>
              <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', mb: 2 }}>
                Any unused applications, credits, or service entitlements remaining after the 90-day period will expire and will not be carried forward or refunded.
              </Typography>
              <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem' }}>
                Customers are responsible for providing necessary information, documents, and job links within the validity period to enable service delivery.
              </Typography>
            </Box>

            {/* Section 3 */}
            <Box>
              <Typography component="h2" sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', mb: 1.5 }}>
                3. Authorisation to Act on Your Behalf
              </Typography>
              <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', mb: 2 }}>
                By using our Services, you authorise ApplyForMe and its team members to:
              </Typography>
              <Box component="ul" sx={{ color: '#1f2937', lineHeight: 2, pl: 3, fontSize: '1rem' }}>
                <li>Prepare resumes, cover letters, and application responses</li>
                <li>Submit job applications and related communications on your behalf</li>
                <li>Access Third-Party Platforms where credentials are provided by you</li>
              </Box>
              <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', mt: 2 }}>
                You confirm that all information provided is accurate, lawful, and up to date.
              </Typography>
              <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', mt: 1 }}>
                You remain solely responsible for the content and legality of applications submitted under your name.
              </Typography>
              <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', mt: 1 }}>
                ApplyForMe is not responsible for account restrictions, suspensions, or actions taken by Third-Party Platforms.
              </Typography>
            </Box>

            {/* Section 4 */}
            <Box>
              <Typography component="h2" sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', mb: 1.5 }}>
                4. Client Responsibilities
              </Typography>
              <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', mb: 2 }}>
                You agree that you will not:
              </Typography>
              <Box component="ul" sx={{ color: '#1f2937', lineHeight: 2, pl: 3, fontSize: '1rem' }}>
                <li>Provide false or misleading information</li>
                <li>Violate employer, platform, or legal requirements</li>
                <li>Use our Services for fraudulent or unlawful purposes</li>
              </Box>
              <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', mt: 2 }}>
                We reserve the right to suspend or terminate Services for any breach of this Agreement.
              </Typography>
            </Box>

            {/* Section 5 */}
            <Box>
              <Typography component="h2" sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', mb: 1.5 }}>
                5. Fees and Payments
              </Typography>
              <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem' }}>
                All fees are clearly stated at checkout.
              </Typography>
              <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', mt: 1 }}>
                Payments are made in exchange for professional services and effort, not employment outcomes.
              </Typography>
              <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', mt: 1 }}>
                Unless otherwise stated, packages are offered as one-time payments.
              </Typography>
            </Box>

            {/* Section 6 - Refund Policy */}
            <Box>
              <Typography component="h2" sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', mb: 1.5 }}>
                6. Refund Policy
              </Typography>
              <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', mb: 2 }}>
                Due to the nature of our services, which involve immediate allocation of time and manual processing, refunds are generally not available once service delivery has commenced.
              </Typography>
              <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', mb: 2 }}>
                However, nothing in this Agreement excludes, restricts, or modifies any rights you may have under the Australian Consumer Law.
              </Typography>
              <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem' }}>
                If you believe you are entitled to a remedy under consumer protection law, please contact us.
              </Typography>
            </Box>

            {/* Section 7 */}
            <Box>
              <Typography component="h2" sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', mb: 1.5 }}>
                7. No Guarantees
              </Typography>
              <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', mb: 2 }}>
                ApplyForMe does not guarantee:
              </Typography>
              <Box component="ul" sx={{ color: '#1f2937', lineHeight: 2, pl: 3, fontSize: '1rem' }}>
                <li>Interviews</li>
                <li>Job offers</li>
                <li>Employment</li>
                <li>Employer responses</li>
              </Box>
              <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', mt: 2 }}>
                All employment decisions are made independently by employers.
              </Typography>
            </Box>

            {/* Section 8 */}
            <Box>
              <Typography component="h2" sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', mb: 1.5 }}>
                8. Limitation of Liability
              </Typography>
              <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', mb: 2 }}>
                To the maximum extent permitted by law, ApplyForMe excludes liability for indirect or consequential loss, including loss of income or opportunity.
              </Typography>
              <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem' }}>
                Where liability cannot be excluded under Australian Consumer Law, our liability is limited, at our option, to:
              </Typography>
              <Box component="ul" sx={{ color: '#1f2937', lineHeight: 2, pl: 3, fontSize: '1rem', mt: 1 }}>
                <li>Re-supplying the Services; or</li>
                <li>Refunding the amount paid for the Services.</li>
              </Box>
            </Box>

            {/* Section 9 */}
            <Box>
              <Typography component="h2" sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', mb: 1.5 }}>
                9. Data and Security
              </Typography>
              <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem' }}>
                We implement reasonable security measures to protect personal information. However, no electronic system is completely secure.
              </Typography>
              <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', mt: 1 }}>
                Our <a href="/privacy-policy" style={{ color: '#2563eb', textDecoration: 'none' }}>Privacy Policy</a> explains how personal information is handled.
              </Typography>
            </Box>

            {/* Section 10 */}
            <Box>
              <Typography component="h2" sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', mb: 1.5 }}>
                10. Intellectual Property
              </Typography>
              <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem' }}>
                You retain ownership of your personal documents and personal information.
              </Typography>
              <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', mt: 1 }}>
                ApplyForMe retains ownership of all proprietary systems, processes, templates, software, and materials used to deliver the Services.
              </Typography>
            </Box>

            {/* Section 11 */}
            <Box>
              <Typography component="h2" sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', mb: 1.5 }}>
                11. Indemnity
              </Typography>
              <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', mb: 2 }}>
                You agree to indemnify ApplyForMe against claims arising from:
              </Typography>
              <Box component="ul" sx={{ color: '#1f2937', lineHeight: 2, pl: 3, fontSize: '1rem' }}>
                <li>Information you provide</li>
                <li>Applications submitted under your name</li>
                <li>Your breach of this Agreement</li>
              </Box>
            </Box>

            {/* Section 12 */}
            <Box>
              <Typography component="h2" sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', mb: 1.5 }}>
                12. Governing Law
              </Typography>
              <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem' }}>
                This Agreement is governed by the laws of Australia. Any disputes shall be subject to the jurisdiction of Australian courts.
              </Typography>
            </Box>

            {/* Section 13 */}
            <Box>
              <Typography component="h2" sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', mb: 1.5 }}>
                13. Contact
              </Typography>
              <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', fontWeight: 600 }}>
                ApplyForMe Pty Ltd
              </Typography>
              <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem' }}>
                Email: <a href="mailto:contactus@applyforme.com.au" style={{ color: '#2563eb', textDecoration: 'none' }}>contactus@applyforme.com.au</a>
              </Typography>
            </Box>
          </Box>
        </Container>
        </Box>
      </Box>
    </MainLayout>
  );
}
