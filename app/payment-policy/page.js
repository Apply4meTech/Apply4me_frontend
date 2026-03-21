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
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'inherit',
        }}
      >
        {/* Header - Solid deep blue */}
        <Box
          sx={{
            background: '#0D3370',
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
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              <span>💳</span> Payment Policy
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem' },
                color: 'rgba(255, 255, 255, 0.95)',
              }}
            >
              ApplyForMe
            </Typography>
          </Container>
        </Box>

        {/* Main Content - White background */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: '#FFFFFF',
            py: { xs: 5, md: 8 },
            px: { xs: 1.5, md: 2 },
          }}
        >
          <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
            <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '0.875rem', mb: 2 }}>
              Last updated: 19 March 2026
            </Typography>
            <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', mb: 2 }}>
              This Payment Policy explains how payments are processed, terms related to payment, and your rights when purchasing services from ApplyForMe Pty Ltd (&quot;ApplyForMe&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
            </Typography>
            <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', mb: 4 }}>
              By purchasing any services from ApplyForMe, you agree to the terms of this policy.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {/* Section 1 */}
              <Box>
                <Typography component="h2" sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', mb: 1.5 }}>
                  1. Payment Methods
                </Typography>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', mb: 1.5 }}>
                  We accept payments through secure third-party payment processors. Accepted payment methods may include:
                </Typography>
                <Box component="ul" sx={{ color: '#1f2937', lineHeight: 2, pl: 3, fontSize: '1rem', mb: 1.5 }}>
                  <li>Credit and debit cards (e.g., Visa, Mastercard, American Express)</li>
                  <li>Other methods as displayed at checkout (e.g., Apple Pay, Google Pay)</li>
                </Box>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem' }}>
                  Payment details are processed securely by our payment partners. ApplyForMe does not store credit card numbers or sensitive financial data on our own servers.
                </Typography>
              </Box>

              {/* Section 2 */}
              <Box>
                <Typography component="h2" sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', mb: 1.5 }}>
                  2. When Payment Is Collected
                </Typography>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', mb: 1.5 }}>
                  Full payment is required at the time of purchase. Services are not activated until your payment has been successfully processed.
                </Typography>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem' }}>
                  All charges will appear on your billing statement as rendered by our payment processor.
                </Typography>
              </Box>

              {/* Section 3 */}
              <Box>
                <Typography component="h2" sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', mb: 1.5 }}>
                  3. Currency and Taxes
                </Typography>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', mb: 1.5 }}>
                  All prices are listed in Australian Dollars (AUD), unless otherwise specified.
                </Typography>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem' }}>
                  You are responsible for any applicable local taxes, duties, or government charges based on your location.
                </Typography>
              </Box>

              {/* Section 4 */}
              <Box>
                <Typography component="h2" sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', mb: 1.5 }}>
                  4. Fees Are for Services, Not Outcomes
                </Typography>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', mb: 2 }}>
                  By purchasing, you agree that:
                </Typography>
                <Box component="ul" sx={{ color: '#1f2937', lineHeight: 2, pl: 3, fontSize: '1rem' }}>
                  <li>Fees are charged for the professional services provided and the time invested</li>
                  <li>Fees are not a guarantee of interviews, employment outcomes, employer responses, job offers, or specific results</li>
                  <li>No portion of payment is refundable based on outcomes or results not being achieved.</li>
                </Box>
              </Box>

              {/* Section 5 */}
              <Box>
                <Typography component="h2" sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', mb: 1.5 }}>
                  5. Recurring Fees
                </Typography>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem' }}>
                  Unless stated otherwise at the time of purchase, all services are offered as one-time payments only. There are no recurring subscriptions or automatic renewals unless explicitly agreed with you in writing.
                </Typography>
              </Box>

              {/* Section 6 - Refunds (Pink/peach callout box) */}
              <Box sx={{ p: 4, bgcolor: '#FDE8E8', borderRadius: '24px' }}>
                <Typography component="h2" sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', mb: 1.5 }}>
                  6. Refunds and Cancellations
                </Typography>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', mb: 2 }}>
                  Refunds may be permitted only in accordance with the Terms of Service and as required by law (e.g., Australian Consumer Law).
                </Typography>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', mb: 2 }}>
                  ApplyForMe&apos;s refund terms are outlined in the Terms of Service. Please review the Terms of Service for details on eligibility for cancellation and refund conditions.
                </Typography>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem' }}>
                  If you believe you are entitled to a refund under consumer protection law, please contact our support team.
                </Typography>
              </Box>

              {/* Section 7 */}
              <Box>
                <Typography component="h2" sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', mb: 1.5 }}>
                  7. Failed or Declined Payments
                </Typography>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', mb: 2 }}>
                  If your payment is declined or fails for any reason:
                </Typography>
                <Box component="ul" sx={{ color: '#1f2937', lineHeight: 2, pl: 3, fontSize: '1rem', mb: 2 }}>
                  <li>You will be notified at checkout or via email</li>
                  <li>Services will not be activated until the payment is completed</li>
                  <li>You must resolve payment issues before access to your dashboard or service delivery begins</li>
                </Box>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem' }}>
                  ApplyForMe reserves the right to suspend or cancel orders with unresolved payment issues.
                </Typography>
              </Box>

              {/* Section 8 */}
              <Box>
                <Typography component="h2" sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', mb: 1.5 }}>
                  8. Chargebacks and Disputes
                </Typography>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', mb: 2 }}>
                  A chargeback or payment dispute initiated through your financial institution without first contacting ApplyForMe is considered a breach of our Terms of Service.
                </Typography>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', mb: 2 }}>
                  If you have a concern about your payment, contact us before initiating a chargeback, so we can assist you directly.
                </Typography>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', mb: 1.5 }}>
                  Chargebacks may result in:
                </Typography>
                <Box component="ul" sx={{ color: '#1f2937', lineHeight: 2, pl: 3, fontSize: '1rem' }}>
                  <li>Suspension of your account</li>
                  <li>Termination of services</li>
                  <li>Reporting to payment processors or credit networks</li>
                </Box>
              </Box>

              {/* Section 9 */}
              <Box>
                <Typography component="h2" sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', mb: 1.5 }}>
                  9. Security of Payment Information
                </Typography>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', mb: 1.5 }}>
                  Payments are processed through secure, PCI-compliant third-party gateways.
                </Typography>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem' }}>
                  While we make reasonable efforts to ensure the platform is secure, we do not guarantee the security of data transmitted over the internet.
                </Typography>
              </Box>

              {/* Section 10 */}
              <Box>
                <Typography component="h2" sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', mb: 1.5 }}>
                  10. Contact for Payment Questions
                </Typography>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', mb: 1.5 }}>
                  If you have any questions regarding billing, payments, or issues with your transaction, please contact:
                </Typography>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', fontWeight: 600 }}>
                  ApplyForMe Pty Ltd
                </Typography>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem' }}>
                  📧 <a href="mailto:contactus@applyforme.com.au" style={{ color: '#2563eb', textDecoration: 'none' }}>contactus@applyforme.com.au</a>
                </Typography>
              </Box>

              {/* Section 11 */}
              <Box>
                <Typography component="h2" sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', mb: 1.5 }}>
                  11. Changes to Payment Policy
                </Typography>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', mb: 1.5 }}>
                  ApplyForMe may update this Payment Policy from time to time.
                </Typography>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem', mb: 1.5 }}>
                  We will notify customers of material changes via email or through notices on our website.
                </Typography>
                <Typography sx={{ color: '#1f2937', lineHeight: 1.8, fontSize: '1rem' }}>
                  The version of the policy displayed on the website at the time of purchase is the version that applies to your transaction.
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </MainLayout>
  );
}
