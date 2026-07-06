'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { Box, Container, Typography, Button, CircularProgress, TextField, Alert } from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import MainLayout from '../../../components/layouts/MainLayout';
import stripeService from '../../../utils/stripeService';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51SxLXK2Rp5kvhBdCpK4srBsylbANEUbN5O8BaP55FSJW57A6ZSXI3F2sWJx8Z3qaAqVwL4GIQvxzJBrNECMc5lpF00CJBNvuG2'
);

function CouponSection({ paymentIntentId, token, onFullDiscountApplied }) {
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState(null);
  const [couponError, setCouponError] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsApplying(true);
    setCouponError(null);
    setCouponMessage(null);

    const result = await stripeService.validateCoupon(
      { code: couponCode.trim(), payment_intent_id: paymentIntentId },
      token
    );

    setIsApplying(false);

    if (!result.success) {
      setCouponError(result.message);
      setAppliedCoupon(null);
      return;
    }

    if (result.data?.isFullDiscount) {
      setAppliedCoupon(result.data.code);
      setCouponMessage('100% off applied — no payment required.');
      onFullDiscountApplied(result.data.code);
    } else {
      setCouponError('Only 100% off coupons are supported at checkout.');
      setAppliedCoupon(null);
    }
  };

  return (
    <Box sx={{ marginBottom: '2rem' }}>
      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#1E293B', marginBottom: '0.75rem' }}>
        Have a coupon code?
      </Typography>
      <Box sx={{ display: 'flex', gap: '0.75rem' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          disabled={!!appliedCoupon || isApplying}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '0.5rem' } }}
        />
        <Button
          variant="outlined"
          onClick={handleApplyCoupon}
          disabled={!couponCode.trim() || !!appliedCoupon || isApplying}
          sx={{ textTransform: 'none', whiteSpace: 'nowrap', borderRadius: '0.5rem' }}
        >
          {isApplying ? <CircularProgress size={20} /> : 'Apply'}
        </Button>
      </Box>
      {couponMessage && (
        <Alert severity="success" sx={{ marginTop: '0.75rem' }}>
          {couponMessage}
        </Alert>
      )}
      {couponError && (
        <Alert severity="error" sx={{ marginTop: '0.75rem' }}>
          {couponError}
        </Alert>
      )}
    </Box>
  );
}

function FreeCheckoutForm({ paymentIntentId, couponCode, returnTo }) {
  const router = useRouter();
  const { token } = useSelector((state) => state.auth);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleActivate = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    const result = await stripeService.redeemCoupon(
      { code: couponCode, payment_intent_id: paymentIntentId },
      token
    );

    if (result.success) {
      const qs = returnTo ? `&return_to=${returnTo}` : '';
      router.push(`/payment/success?payment_intent=${paymentIntentId}${qs}`);
    } else {
      setErrorMessage(result.message || 'Failed to activate plan.');
      setIsProcessing(false);
    }
  };

  return (
    <Box>
      <Typography sx={{ color: '#64748B', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
        Your coupon covers the full amount. Click below to activate your plan — no card needed.
      </Typography>
      {errorMessage && (
        <Typography sx={{ color: '#EF4444', marginBottom: '1rem', fontSize: '0.875rem' }}>
          {errorMessage}
        </Typography>
      )}
      <Button
        onClick={handleActivate}
        disabled={isProcessing}
        variant="contained"
        fullWidth
        sx={{
          backgroundColor: '#16A34A',
          color: '#FFFFFF',
          padding: '0.75rem 2rem',
          borderRadius: '0.5rem',
          fontSize: '1rem',
          fontWeight: 600,
          textTransform: 'none',
          '&:hover': { backgroundColor: '#15803D' },
          '&:disabled': { backgroundColor: '#94A3B8' },
        }}
      >
        {isProcessing ? (
          <>
            <CircularProgress size={20} sx={{ marginRight: '0.5rem', color: '#FFFFFF' }} />
            Activating...
          </>
        ) : (
          'Activate Plan (Free)'
        )}
      </Button>
    </Box>
  );
}

function CheckoutForm({ clientSecret, paymentIntentId, returnTo }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { token } = useSelector((state) => state.auth);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setErrorMessage(submitError.message);
        setIsProcessing(false);
        return;
      }

      const baseUrl = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');
      const returnUrl = `${baseUrl}/payment/success?payment_intent=${paymentIntentId}${returnTo ? `&return_to=${returnTo}` : ''}`;
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: { return_url: returnUrl },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message);
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Verify payment on backend
        try {
          const verifyResult = await stripeService.verifyPayment(
            { payment_intent_id: paymentIntentId },
            token
          );

          if (verifyResult.success) {
            const qs = returnTo ? `&return_to=${returnTo}` : '';
            router.push(`/payment/success?payment_intent=${paymentIntentId}${qs}`);
          } else {
            setErrorMessage('Payment verification failed. Please contact support.');
            setIsProcessing(false);
          }
        } catch (verifyError) {
          console.error('Payment verification error:', verifyError);
          setErrorMessage('Payment verification failed. Please contact support.');
          setIsProcessing(false);
        }
      } else {
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setErrorMessage('An error occurred. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ marginBottom: '2rem' }}>
        <PaymentElement />
      </Box>
      
      {errorMessage && (
        <Typography
          sx={{
            color: '#EF4444',
            marginBottom: '1rem',
            fontSize: '0.875rem',
          }}
        >
          {errorMessage}
        </Typography>
      )}

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        variant="contained"
        fullWidth
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
          '&:disabled': {
            backgroundColor: '#94A3B8',
          },
        }}
      >
        {isProcessing ? (
          <>
            <CircularProgress size={20} sx={{ marginRight: '0.5rem', color: '#FFFFFF' }} />
            Processing...
          </>
        ) : (
          'Pay Now'
        )}
      </Button>
    </form>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token } = useSelector((state) => state.auth);
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const [returnTo, setReturnTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appliedCouponCode, setAppliedCouponCode] = useState(null);

  useEffect(() => {
    const paymentIntent = searchParams.get('payment_intent');
    const secret = searchParams.get('client_secret');
    const returnToParam = searchParams.get('return_to');

    if (!paymentIntent || !secret) {
      router.push('/pricing');
      return;
    }

    setPaymentIntentId(paymentIntent);
    setClientSecret(decodeURIComponent(secret));
    setReturnTo(returnToParam);
    setLoading(false);
  }, [searchParams, router]);

  if (loading || !clientSecret) {
    return (
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
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
    },
    defaultValues: {
      billingDetails: {
        address: {
          country: 'AU', // Set default country to Australia
        },
      },
    },
  };

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
            }}
          >
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: '1.5rem', md: '2rem' },
                fontWeight: 700,
                color: '#1E293B',
                marginBottom: '0.5rem',
                fontFamily: 'inherit',
              }}
            >
              Complete Your Payment
            </Typography>
            <Typography
              sx={{
                fontSize: '1rem',
                color: '#64748B',
                marginBottom: '2rem',
                fontFamily: 'inherit',
              }}
            >
              {appliedCouponCode
                ? 'Apply your coupon to activate your plan for free.'
                : 'Please enter your payment details to complete your subscription.'}
            </Typography>

            <CouponSection
              paymentIntentId={paymentIntentId}
              token={token}
              onFullDiscountApplied={setAppliedCouponCode}
            />

            {appliedCouponCode ? (
              <FreeCheckoutForm
                paymentIntentId={paymentIntentId}
                couponCode={appliedCouponCode}
                returnTo={returnTo}
              />
            ) : (
              <Elements options={options} stripe={stripePromise}>
                <CheckoutForm clientSecret={clientSecret} paymentIntentId={paymentIntentId} returnTo={returnTo} />
              </Elements>
            )}
          </Box>
        </Container>
      </Box>
    </MainLayout>
  );
}

function CheckoutFallback() {
  return (
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
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutFallback />}>
      <CheckoutContent />
    </Suspense>
  );
}

