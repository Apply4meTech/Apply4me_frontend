'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { Box, Container, Typography, Button, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import MainLayout from '../../../components/layouts/MainLayout';
import Link from 'next/link';
import stripeService from '../../../utils/stripeService';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token } = useSelector((state) => state.auth);
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      const paymentIntentId = searchParams.get('payment_intent');
      
      if (!paymentIntentId || !token) {
        setVerifying(false);
        return;
      }

      try {
        const verifyResult = await stripeService.verifyPayment(
          { payment_intent_id: paymentIntentId },
          token
        );

        if (verifyResult.success) {
          setVerified(true);
        } else {
          console.error('Payment verification failed:', verifyResult.message);
        }
      } catch (error) {
        console.error('Payment verification error:', error);
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, token]);

  useEffect(() => {
    if (!verifying && verified) {
      // Auto-redirect to dashboard after 5 seconds
      const timer = setTimeout(() => {
        router.push('/dashboard');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [verifying, verified, router]);

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
            <CheckCircleIcon
              sx={{
                fontSize: '5rem',
                color: '#10B981',
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
              Payment Successful!
            </Typography>
            {verifying ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
                <CircularProgress sx={{ marginBottom: '1rem' }} />
                <Typography
                  sx={{
                    fontSize: '1rem',
                    color: '#64748B',
                    fontFamily: 'inherit',
                  }}
                >
                  Verifying your payment...
                </Typography>
              </Box>
            ) : (
              <Typography
                sx={{
                  fontSize: '1rem',
                  color: '#64748B',
                  marginBottom: '2rem',
                  fontFamily: 'inherit',
                  lineHeight: 1.6,
                }}
              >
                Thank you for your subscription. Your plan has been activated and you can now start using all the features.
              </Typography>
            )}
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
                href="/dashboard"
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
                Go to Dashboard
              </Button>
              <Button
                component={Link}
                href="/pricing"
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
                View Plans
              </Button>
            </Box>
            {!verifying && verified && (
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  color: '#94A3B8',
                  marginTop: '2rem',
                  fontFamily: 'inherit',
                }}
              >
                Redirecting to dashboard in 5 seconds...
              </Typography>
            )}
          </Box>
        </Container>
      </Box>
    </MainLayout>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense
      fallback={
        <MainLayout>
          <Box
            sx={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#F8FAFC',
            }}
          >
            <CircularProgress />
          </Box>
        </MainLayout>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}

