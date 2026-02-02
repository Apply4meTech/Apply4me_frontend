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
              Last updated: [Insert Date]
            </Typography>
          </Container>
        </Box>

        {/* Content Section */}
        <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {/* Introduction */}
            <Box sx={{ p: 3, bgcolor: '#fef3c7', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
              <Typography sx={{ color: '#475569', lineHeight: 1.8, fontStyle: 'italic' }}>
                This Terms of Service (&quot;Agreement&quot;) is a legally binding contract between <strong>ApplyForMe Pty Ltd</strong> (&quot;ApplyForMe,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) and the person or entity that purchases, accesses, or uses our services (&quot;Customer,&quot; &quot;you,&quot; or &quot;your&quot;). By clicking &quot;I agree,&quot; completing a purchase, or using the Services, you agree to be bound by this Agreement.
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8, mt: 2, fontStyle: 'italic' }}>
                <strong>ApplyForMe is a career support service. We are not a recruitment agency, employment agency, or employer and we do not provide legal, immigration, or hiring advice.</strong>
              </Typography>
            </Box>

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
                1. Definitions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography sx={{ color: '#475569', lineHeight: 1.8 }}>
                    <strong>&quot;Services&quot;</strong> means ApplyForMe&apos;s human-assisted job application services, including resume and cover letter preparation, form completion, job submission, profile optimisation, dashboards, extensions, and all related software or systems.
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: '#475569', lineHeight: 1.8 }}>
                    <strong>&quot;Customer Content&quot;</strong> means all information you provide (including resumes, personal data, credentials, job preferences) and all documents generated for you.
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: '#475569', lineHeight: 1.8 }}>
                    <strong>&quot;Third-Party Platforms&quot;</strong> means job boards, employer websites, ATS platforms, and recruitment systems including LinkedIn, Seek, Indeed, company career portals, and similar services.
                  </Typography>
                </Box>
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
                2. Nature of the Services
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8, mb: 2 }}>
                ApplyForMe provides <strong>career services and job-application assistance only</strong>.
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8, mb: 2 }}>
                We do <strong>not</strong>:
              </Typography>
              <Box component="ul" sx={{ color: '#475569', lineHeight: 2, pl: 3 }}>
                <li>Act as a recruiter, staffing firm, or employment agency</li>
                <li>Represent employers</li>
                <li>Guarantee interviews, job offers, salary, or employment</li>
              </Box>
              <Typography sx={{ color: '#475569', lineHeight: 1.8, mt: 2 }}>
                All hiring decisions are made solely by employers.
              </Typography>
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
                3. Authorization to Act on Your Behalf
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8, mb: 2 }}>
                By using our Services, you authorize ApplyForMe and our staff or contractors to:
              </Typography>
              <Box component="ul" sx={{ color: '#475569', lineHeight: 2, pl: 3 }}>
                <li>Prepare resumes, cover letters, and application responses</li>
                <li>Log into Third-Party Platforms using credentials you provide</li>
                <li>Submit applications and communications on your behalf</li>
              </Box>
              <Typography sx={{ color: '#475569', lineHeight: 1.8, mt: 2 }}>
                You confirm that all information you provide is accurate and lawful.
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8, mt: 1 }}>
                You accept full responsibility for all applications submitted under your name.
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8, mt: 1 }}>
                You acknowledge that Third-Party Platforms may restrict, block, or suspend accounts and that ApplyForMe is <strong>not responsible</strong> for such actions.
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
                4. Client Responsibilities
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8, mb: 2 }}>
                You agree that:
              </Typography>
              <Box component="ul" sx={{ color: '#475569', lineHeight: 2, pl: 3 }}>
                <li>You will not provide false or misleading information</li>
                <li>You will not violate employer, platform, or legal rules</li>
                <li>You will not use our Services for fraud, misrepresentation, or unlawful activity</li>
              </Box>
              <Typography sx={{ color: '#475569', lineHeight: 1.8, mt: 2 }}>
                We may terminate your service immediately for any breach.
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
                5. Fees & Payments
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8 }}>
                All fees are charged as stated at checkout.
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8, mt: 1 }}>
                You are paying for <strong>services and effort</strong>, not employment outcomes.
              </Typography>
            </Box>

            {/* Section 6 - NO REFUNDS */}
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
                6. NO REFUNDS – FINAL POLICY
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8, mb: 2 }}>
                All payments to ApplyForMe are <strong>final and non-refundable</strong>.
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8, mb: 2 }}>
                Due to the nature of our services — including onboarding, assignment of human assistants, and immediate processing — <strong>we do not provide refunds, credits, or reversals under any circumstances once a purchase has been made.</strong>
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8, mb: 2 }}>
                This includes, without limitation:
              </Typography>
              <Box component="ul" sx={{ color: '#475569', lineHeight: 2, pl: 3, mb: 2 }}>
                <li>Not receiving interviews</li>
                <li>Employer rejections</li>
                <li>Delays or restrictions by job platforms</li>
                <li>Change of mind</li>
                <li>Dissatisfaction with results</li>
              </Box>
              <Typography sx={{ color: '#475569', lineHeight: 1.8, mb: 2 }}>
                By purchasing, you expressly:
              </Typography>
              <Box component="ul" sx={{ color: '#475569', lineHeight: 2, pl: 3, mb: 2 }}>
                <li>Waive your right to refunds</li>
                <li>Waive your right to chargebacks or payment disputes</li>
                <li>Agree that payment is for service, not results</li>
              </Box>
              <Typography sx={{ color: '#475569', lineHeight: 1.8 }}>
                Any chargeback or payment dispute will be treated as a <strong>material breach</strong> of this Agreement and may result in termination, collections, and reporting to payment processors.
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
                7. No Guarantees
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8, mb: 2 }}>
                ApplyForMe does not guarantee:
              </Typography>
              <Box component="ul" sx={{ color: '#475569', lineHeight: 2, pl: 3 }}>
                <li>Interviews</li>
                <li>Offers</li>
                <li>Employment</li>
                <li>Employer responses</li>
              </Box>
              <Typography sx={{ color: '#475569', lineHeight: 1.8, mt: 2 }}>
                All hiring decisions are outside our control.
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
              <Typography sx={{ color: '#475569', lineHeight: 1.8, mb: 2 }}>
                To the maximum extent permitted by law, ApplyForMe shall not be liable for:
              </Typography>
              <Box component="ul" sx={{ color: '#475569', lineHeight: 2, pl: 3 }}>
                <li>Lost opportunities</li>
                <li>Lost income</li>
                <li>Career outcomes</li>
                <li>Emotional distress</li>
              </Box>
              <Typography sx={{ color: '#475569', lineHeight: 1.8, mt: 2 }}>
                Our total liability shall never exceed the amount you paid us.
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
                9. Data & Security
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8 }}>
                We use reasonable security measures. However, no system is 100% secure.
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8, mt: 1 }}>
                Our maximum liability for any data issue is limited to the fees you paid us.
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
                10. Intellectual Property
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8 }}>
                You own your personal documents.
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8, mt: 1 }}>
                We own all software, systems, processes, templates, and tools.
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
                11. Indemnification
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8 }}>
                You agree to indemnify and hold harmless ApplyForMe from any claims arising from:
              </Typography>
              <Box component="ul" sx={{ color: '#475569', lineHeight: 2, pl: 3, mt: 1 }}>
                <li>Your information</li>
                <li>Your applications</li>
                <li>Your interactions with employers</li>
                <li>Your violation of this Agreement</li>
              </Box>
            </Box>

            {/* Section 12 */}
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
                12. Governing Law
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8 }}>
                This Agreement is governed by the laws of <strong>Australia</strong>.
              </Typography>
            </Box>

            {/* Section 13 */}
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
                13. Contact
              </Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.8, mb: 2 }}>
                For support or legal questions:
              </Typography>
              <Box sx={{ mt: 2, p: 3, bgcolor: '#f1f5f9', borderRadius: '8px' }}>
                <Typography sx={{ color: '#1E293B', fontWeight: 600 }}>ApplyForMe Pty Ltd</Typography>
                <Typography sx={{ color: '#475569' }}>📧 <a href="mailto:contactus@applyforme.com.au" style={{ color: '#2463eb', textDecoration: 'none' }}>contactus@applyforme.com.au</a></Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </MainLayout>
  );
}
