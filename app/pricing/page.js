'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Box, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Button as MuiButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Button from '@/components/Button';
import MainLayout from '../../components/layouts/MainLayout';
import CompanyLogos from '../../components/CompanyLogos';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import stripeService from '../../utils/stripeService';
import planService from '../../utils/planService';
import { PRICING_ADDONS } from '../../utils/addonCatalog';
import Link from 'next/link';

/** Live payment test: charge A$1 for Premium only. Remove or set to null before production launch. */
const PREMIUM_CHECKOUT_AMOUNT_AUD = 1;

export default function Pricing() {
  const [expandedFaq, setExpandedFaq] = useState(0);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [processingPlan, setProcessingPlan] = useState(null);
  const [stripePromise, setStripePromise] = useState(null);
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [plansError, setPlansError] = useState(null);
  const [userPlan, setUserPlan] = useState(null);
  const [userPlanLoading, setUserPlanLoading] = useState(false);
  const [processingAddonCode, setProcessingAddonCode] = useState(null);
  
  const { token: reduxToken, user, isAuthenticated } = useSelector((state) => state.auth);
  const token = reduxToken || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  const router = useRouter();
  
  // Animation refs
  const [heroRef, heroVisible] = useScrollAnimation();
  const [plansRef, plansVisible] = useScrollAnimation();
  const [tableRef, tableVisible] = useScrollAnimation();
  const [logosRef, logosVisible] = useScrollAnimation();
  const [faqRef, faqVisible] = useScrollAnimation();

  // Load Stripe on component mount
  useEffect(() => {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51SxLXK2Rp5kvhBdCpK4srBsylbANEUbN5O8BaP55FSJW57A6ZSXI3F2sWJx8Z3qaAqVwL4GIQvxzJBrNECMc5lpF00CJBNvuG2';
    if (publishableKey) {
      setStripePromise(loadStripe(publishableKey));
    }
  }, []);

  // Fetch plans from API
  useEffect(() => {
    const fetchPlans = async () => {
      setPlansLoading(true);
      setPlansError(null);
      try {
        const result = await planService.getAllPlans(true);
        if (result.success) {
          // Sort plans by displayOrder
          const sortedPlans = (result.data || []).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
          setPlans(sortedPlans);
        } else {
          setPlansError(result.message || 'Failed to load plans');
          // Fallback to empty array if API fails
          setPlans([]);
        }
      } catch (error) {
        console.error('Error fetching plans:', error);
        setPlansError('Failed to load plans. Please refresh the page.');
        setPlans([]);
      } finally {
        setPlansLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Fetch user's current plan if authenticated
  useEffect(() => {
    const fetchUserPlan = async () => {
      if (!isAuthenticated || !token) {
        return;
      }

      setUserPlanLoading(true);
      try {
        const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
        const getApiUrl = () => {
          const url = API_URL;
          return url.endsWith('/api') ? url.slice(0, -4) : url;
        };
        const response = await fetch(`${getApiUrl()}/api/users/my-plan`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (data.success && data.data) {
          setUserPlan(data.data);
        }
      } catch (error) {
        console.error('Error fetching user plan:', error);
      } finally {
        setUserPlanLoading(false);
      }
    };

    fetchUserPlan();
  }, [isAuthenticated, token]);

  const isDevFakePaymentEnabled =
    process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_ENABLE_DEV_FAKE_PAYMENT === 'true';

  const handleDevFakePayment = async (plan) => {
    if (!isAuthenticated || !token) {
      router.push('/login?redirect=/pricing');
      return;
    }
    if (userPlan?.subscription?.status === 'active') {
      alert(`You already have an active plan.`);
      return;
    }
    setProcessingPayment(true);
    setProcessingPlan(plan.name);
    try {
      const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
      const base = API_URL.endsWith('/api') ? API_URL.slice(0, -4) : API_URL;
      const res = await fetch(`${base}/api/payments/stripe/dev-fake-payment`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planName: plan.name }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Dev fake payment failed');
      }
      router.push(`/payment/success?payment_intent=${data.data.payment_intent_id}`);
    } catch (err) {
      alert(err.message || 'Test payment failed');
    } finally {
      setProcessingPayment(false);
      setProcessingPlan(null);
    }
  };

  // Handle payment initiation
  const handleGetStarted = async (plan) => {
    // Check if user is authenticated
    if (!isAuthenticated || !token) {
      router.push('/login?redirect=/pricing');
      return;
    }

    // Check if user already has an active plan (subscription packages only)
    if (userPlan && userPlan.subscription && userPlan.subscription.status === 'active') {
      alert(`You already have an active plan (${userPlan.subscription.planName}). Please wait for it to expire or contact support to upgrade.`);
      router.push('/dashboard/plan');
      return;
    }

    if (!stripePromise) {
      alert('Stripe is not loaded. Please refresh the page and try again.');
      return;
    }

    setProcessingPayment(true);
    setProcessingPlan(plan.name);

    try {
      const price = Number(plan.price);
      if (!price || price <= 0) {
        alert('Invalid plan price. Please contact support.');
        setProcessingPayment(false);
        setProcessingPlan(null);
        return;
      }

      const chargeAmount =
        plan.name === 'Premium' && typeof PREMIUM_CHECKOUT_AMOUNT_AUD === 'number'
          ? PREMIUM_CHECKOUT_AMOUNT_AUD
          : price;

      // Prepare order data (one-time payment)
      const orderData = {
        amount: chargeAmount,
        customerInfo: {
          name: user?.name || user?.fullName || 'User',
          email: user?.email || '',
          phone: user?.phone || user?.phoneCode || ''
        },
        planName: plan.name,
        billingPeriod: 'onetime'
      };

      if (!orderData.customerInfo.email) {
        alert('Email is required for payment. Please update your profile.');
        setProcessingPayment(false);
        setProcessingPlan(null);
        return;
      }

      // Create Stripe payment intent
      const paymentIntentResult = await stripeService.createPaymentIntent(orderData, token);

      if (!paymentIntentResult.success) {
        alert(paymentIntentResult.message || 'Failed to create payment intent. Please try again.');
        setProcessingPayment(false);
        setProcessingPlan(null);
        return;
      }

      const paymentIntentId = paymentIntentResult.data?.payment_intent_id || paymentIntentResult.data?.id;
      const clientSecret = paymentIntentResult.client_secret || paymentIntentResult.data?.client_secret;

      if (!clientSecret || !paymentIntentId) {
        alert('Failed to initialize payment. Please try again.');
        setProcessingPayment(false);
        setProcessingPlan(null);
        return;
      }

      router.push(`/payment/checkout?payment_intent=${paymentIntentId}&client_secret=${encodeURIComponent(clientSecret)}`);

    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('Failed to initiate payment. Please try again.');
      setProcessingPayment(false);
      setProcessingPlan(null);
    }
  };

  const hasPurchasedAddon = (storageName) =>
    userPlan?.purchasedAddons?.some((a) => a.name === storageName);

  const handlePurchaseAddon = async (addon) => {
    if (!isAuthenticated || !token) {
      router.push('/login?redirect=/pricing');
      return;
    }

    if (hasPurchasedAddon(addon.storageName)) {
      alert('You already have this add-on.');
      return;
    }

    if (!stripePromise) {
      alert('Stripe is not loaded. Please refresh the page and try again.');
      return;
    }

    setProcessingPayment(true);
    setProcessingAddonCode(addon.planCode);

    try {
      const orderData = {
        amount: addon.priceAud,
        customerInfo: {
          name: user?.name || user?.fullName || 'User',
          email: user?.email || '',
          phone: user?.phone || user?.phoneCode || ''
        },
        planName: addon.planCode,
        billingPeriod: 'onetime'
      };

      if (!orderData.customerInfo.email) {
        alert('Email is required for payment. Please update your profile.');
        setProcessingPayment(false);
        setProcessingAddonCode(null);
        return;
      }

      const paymentIntentResult = await stripeService.createPaymentIntent(orderData, token);

      if (!paymentIntentResult.success) {
        alert(paymentIntentResult.message || 'Failed to create payment intent. Please try again.');
        setProcessingPayment(false);
        setProcessingAddonCode(null);
        return;
      }

      const paymentIntentId = paymentIntentResult.data?.payment_intent_id || paymentIntentResult.data?.id;
      const clientSecret = paymentIntentResult.client_secret || paymentIntentResult.data?.client_secret;

      if (!clientSecret || !paymentIntentId) {
        alert('Failed to initialize payment. Please try again.');
        setProcessingPayment(false);
        setProcessingAddonCode(null);
        return;
      }

      router.push(`/payment/checkout?payment_intent=${paymentIntentId}&client_secret=${encodeURIComponent(clientSecret)}`);
    } catch (error) {
      console.error('Error initiating add-on payment:', error);
      alert('Failed to initiate payment. Please try again.');
      setProcessingPayment(false);
      setProcessingAddonCode(null);
    }
  };


  return (
    <MainLayout>
      <Box
        sx={{
          minHeight: '100vh',
          marginTop: { xs: '-64px', md: '-72px' },
          paddingTop: { xs: '64px', md: '72px' },
          background: 'linear-gradient(180deg, #09316f 0%, #115ace 100%)',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          overflowX: 'hidden',
        }}
      >
        {/* Hero Section - Solid Deep Navy */}
        <Box
          sx={{
            background: 'transparent',
            paddingTop: { xs: '5rem', md: '5rem' },
            paddingBottom: { xs: '1.5rem', md: '2rem' },
            paddingX: { xs: '1rem', sm: '2.5rem' },
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 10 }}>
            <Box
              ref={heroRef}
              sx={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
              }}
            >
              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: '1.75rem', md: '2.25rem', lg: '3rem' },
                  fontWeight: 900,
                  color: '#FFFFFF',
                  marginBottom: '1rem',
                  textAlign: 'center',
                  fontFamily: 'inherit',
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                }}
              >
                Invest in Your Career Acceleration.
              </Typography>

              <Typography
                component="p"
                sx={{
                  fontSize: { xs: '0.9375rem', md: '1.0625rem' },
                  color: 'rgba(255,255,255,0.85)',
                  textAlign: 'center',
                  marginBottom: '0.5rem',
                  fontFamily: 'inherit',
                  maxWidth: '48rem',
                  marginX: 'auto',
                  lineHeight: 1.75,
                  fontWeight: 700,
                }}
              >
                Simple. Transparent. Built for Results.
              </Typography>
              <Typography
                component="p"
                sx={{
                  fontSize: { xs: '0.9375rem', md: '1.0625rem' },
                  color: 'rgba(255,255,255,0.85)',
                  textAlign: 'center',
                  marginBottom: '0.5rem',
                  fontFamily: 'inherit',
                  maxWidth: '48rem',
                  marginX: 'auto',
                  lineHeight: 1.75,
                }}
              >
                Choose the plan that fits your goals.
              </Typography>
              <Typography
                component="p"
                sx={{
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  color: 'rgba(255,255,255,0.7)',
                  textAlign: 'center',
                  marginBottom: '3rem',
                  fontFamily: 'inherit',
                  maxWidth: '48rem',
                  marginX: 'auto',
                  lineHeight: 1.75,
                }}
              >
                AUD · One-time payment
              </Typography>
            </Box>
          </Container>
        </Box>

      {/* Pricing Plans Section - Unified deep navy with glassmorphism cards */}
      <Box
        sx={{
          background: 'transparent',
          paddingTop: { xs: '0.75rem', md: '0.75rem' },
          paddingBottom: { xs: '4rem', md: '5rem' },
          paddingX: { xs: '1.5rem', md: '2rem' },
          flex: 1,
          position: 'relative',
        }}
      >
        <Container maxWidth="lg">
          {/* Alert if user has active plan */}
          {userPlan && userPlan.subscription && userPlan.subscription.status === 'active' && (
            <Box
              sx={{
                mt: 0,
                mb: 3,
                p: 2,
                bgcolor: '#FEF3C7',
                border: '1px solid #FCD34D',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Typography sx={{ color: '#92400E', fontSize: '0.875rem', flex: 1 }}>
                <strong>You have an active plan:</strong> {userPlan.subscription.planName}. 
                {userPlan.subscription.endDate && (
                  <> It expires on {new Date(userPlan.subscription.endDate).toLocaleDateString()}.</>
                )}
                {' '}You can view your plan details in your{' '}
                <Link href="/dashboard/plan" style={{ color: '#2563EB', textDecoration: 'underline' }}>
                  dashboard
                </Link>.
              </Typography>
            </Box>
          )}
          <Box
            ref={plansRef}
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
              gap: '2rem',
              marginTop: 0,
              position: 'relative',
              zIndex: 10,
              opacity: plansVisible ? 1 : 0,
              // transform: plansVisible ? 'translateY(0)' : 'translateY(40px)',
              // transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
            }}
          >
            {plansLoading ? (
              <Box sx={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            ) : plansError ? (
              <Box sx={{ gridColumn: '1 / -1', textAlign: 'center', py: 8 }}>
                <Typography sx={{ color: '#ef4444', mb: 2 }}>{plansError}</Typography>
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </Box>
            ) : plans.length === 0 ? (
              <Box sx={{ gridColumn: '1 / -1', textAlign: 'center', py: 8 }}>
                <Typography sx={{ color: '#64748b' }}>No plans available at the moment.</Typography>
              </Box>
            ) : (
              plans.map((plan, planIndex) => {
              return (
                <Box
                  key={plan.name}
                  sx={{
                    position: 'relative',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(147, 197, 253, 0.25)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    borderRadius: '1.5rem',
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'visible',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    opacity: plansVisible ? 1 : 0,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 25px 50px -10px rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  {/* Plan Badge (Your Plan / Most Popular / Best Value!) */}
                  {userPlan && userPlan.subscription && userPlan.subscription.planName === plan.name ? (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '-0.75rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#10B981',
                        color: '#FFFFFF',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        zIndex: '999999 !important',
                      }}
                    >
                      YOUR PLAN
                    </Box>
                  ) : plan.badge ? (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '-0.75rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: plan.badge.toLowerCase().includes('popular')
                          ? 'linear-gradient(90deg, #22D3EE 0%, #3B82F6 100%)'
                          : 'linear-gradient(90deg, #34D399 0%, #10B981 100%)',
                        color: '#FFFFFF',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        zIndex: '999999 !important',
                      }}
                    >
                      {plan.badge.toUpperCase().replace(/!/g, '')}
                    </Box>
                  ) : null}
                  {/* Content wrapper with relative positioning */}
                  <Box
                    sx={{
                      position: 'relative',
                      zIndex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                    }}
                  >

                  {/* Plan Name - Pro gets cyan accent */}
                  <Typography
                    sx={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: plan.name?.toLowerCase() === 'pro' ? '#00D1FF' : '#FFFFFF',
                      marginBottom: '0.5rem',
                      fontFamily: 'inherit',
                    }}
                  >
                    {plan.name}
                  </Typography>

                  {/* Price: actual (strikethrough) + discounted */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'baseline',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {plan.actualPrice && plan.actualPrice > plan.price && (
                      <Typography
                        component="span"
                        sx={{
                          fontSize: '1.25rem',
                          fontWeight: 600,
                          color: 'rgba(255,255,255,0.5)',
                          textDecoration: 'line-through',
                          fontFamily: 'inherit',
                        }}
                      >
                        ${plan.actualPrice}
                      </Typography>
                    )}
                    <Typography
                      sx={{
                        fontSize: '2.5rem',
                        fontWeight: 800,
                        color: '#FFFFFF',
                        fontFamily: 'inherit',
                        letterSpacing: '-0.02em',
                        lineHeight: 1.1,
                      }}
                    >
                      ${plan.price}
                    </Typography>
                    {plan.actualPrice && plan.actualPrice > plan.price && (
                      <Box
                        component="span"
                        sx={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#FFFFFF',
                          backgroundColor: '#4ADE80',
                          padding: '0.25rem 0.625rem',
                          borderRadius: '9999px',
                          fontFamily: 'inherit',
                        }}
                      >
                        Save ${plan.actualPrice - plan.price}
                      </Box>
                    )}
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '0.75rem',
                      color: 'rgba(255,255,255,0.5)',
                      marginBottom: '0.5rem',
                      fontFamily: 'inherit',
                    }}
                  >
                    One-time · AUD
                  </Typography>
                  {plan.description && (
                    <Typography
                      sx={{
                        fontSize: '0.8125rem',
                        color: 'rgba(255,255,255,0.7)',
                        marginBottom: '1.5rem',
                        fontFamily: 'inherit',
                      }}
                    >
                      {plan.description}
                    </Typography>
                  )}

                  {/* Features List */}
                  <Box
                    sx={{
                      flex: 1,
                      marginBottom: '2rem',
                    }}
                  >
                    {(plan.features || [])
                      .filter((feature) => {
                        const text = String(feature?.text || '').toLowerCase().trim();
                        if (text === 'no. of jobs we apply') return false;
                        if (text.startsWith('job search by our team')) return false;
                        return true;
                      })
                      .map((feature, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '0.75rem',
                        }}
                      >
                        {feature.included ? (
                          <CheckCircleIcon
                            sx={{
                              color: '#60A5FA',
                              fontSize: '1.25rem',
                              marginRight: '0.75rem',
                            }}
                          />
                        ) : (
                          <RadioButtonUncheckedIcon
                            sx={{
                              color: 'rgba(255,255,255,0.4)',
                              fontSize: '1.25rem',
                              marginRight: '0.75rem',
                            }}
                          />
                        )}
                        <Typography
                          sx={{
                            fontSize: '0.875rem',
                            color: feature.included ? '#FFFFFF' : 'rgba(255,255,255,0.6)',
                            fontFamily: 'inherit',
                          }}
                        >
                          {feature.text}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* Get Started Button */}
                  {(() => {
                    const isUserPlan = userPlan && userPlan.subscription && userPlan.subscription.planName === plan.name;
                    const hasActivePlan = userPlan && userPlan.subscription && userPlan.subscription.status === 'active';
                    const isDisabled = processingPayment || hasActivePlan;
                    
                    // Determine button colors based on plan state
                    const getButtonColors = () => {
                      if (isUserPlan) {
                        return {
                          bg: '#10B981',
                          color: '#FFFFFF',
                          border: '1px solid #10B981',
                          hoverBg: '#059669',
                          hoverColor: '#FFFFFF'
                        };
                      }
                      // Glassmorphism style for all plans
                      return {
                        bg: 'rgba(255,255,255,0.15)',
                        color: '#FFFFFF',
                        border: '1px solid rgba(255,255,255,0.4)',
                        hoverBg: 'rgba(255,255,255,0.25)',
                        hoverColor: '#FFFFFF'
                      };
                    };
                    
                    const colors = getButtonColors();
                    
                    return (
                      <Box
                        component="button"
                        onClick={() => !isDisabled && handleGetStarted(plan)}
                        disabled={isDisabled}
                        sx={{
                          padding: '0.75rem 1.5rem',
                          borderRadius: '9999px',
                          border: colors.border,
                          backgroundColor: colors.bg,
                          color: colors.color,
                          fontSize: '1rem',
                          fontWeight: 600,
                          cursor: isDisabled ? 'not-allowed' : 'pointer',
                          fontFamily: 'inherit',
                          transition: 'all 0.3s ease',
                          opacity: isDisabled ? 0.6 : 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.02em',
                          '&:hover': {
                            backgroundColor: isDisabled ? colors.bg : colors.hoverBg,
                            color: colors.hoverColor,
                            transform: isDisabled ? 'none' : 'scale(1.02)',
                          },
                        }}
                      >
                        {processingPayment && processingPlan === plan.name ? (
                          <>
                            <CircularProgress size={16} sx={{ color: 'inherit' }} />
                            Processing...
                          </>
                        ) : isUserPlan ? (
                          'Your Plan'
                        ) : hasActivePlan ? (
                          'Already Have Plan'
                        ) : (
                          'GET STARTED →'
                        )}
                      </Box>
                    );
                  })()}
                  {/* Dev: Test Payment button - bypasses Stripe for full flow testing */}
                  {isDevFakePaymentEnabled && userPlan?.subscription?.status !== 'active' && (
                    <MuiButton
                      size="small"
                      variant="outlined"
                      onClick={() => handleDevFakePayment(plan)}
                      disabled={processingPayment || !isAuthenticated}
                      sx={{
                        mt: 1,
                        fontSize: '0.75rem',
                        borderColor: '#94a3b8',
                        color: '#64748b',
                        '&:hover': { borderColor: '#64748b', bgcolor: 'rgba(100,116,139,0.04)' },
                      }}
                    >
                      {processingPayment && processingPlan === plan.name ? '...' : 'Test Payment (Dev)'}
                    </MuiButton>
                  )}
                  </Box>
                </Box>
              );
              })
            )}
          </Box>
        </Container>
      </Box>

      {/* Compare Plans Table Section */}
      <Box
        sx={{
          backgroundColor: '#FFFFFF',
          paddingY: { xs: '4rem', md: '5rem' },
          paddingX: { xs: '1.5rem', md: '2rem' },
        }}
      >
        <Container maxWidth="lg">
          {/* Title */}
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              fontWeight: 700,
              color: '#111827',
              textAlign: 'center',
              marginBottom: '2rem',
              fontFamily: 'inherit',
            }}
          >
            Package Features Comparison
          </Typography>

          {/* Comparison Table Card - Dark navy gradient */}
          <Box
            sx={{
              background: 'linear-gradient(180deg, #1e3a8a 0%, #2563eb 100%)',
              borderRadius: '1.5rem',
              padding: { xs: '1.5rem', md: '2rem' },
              boxShadow: '0 4px 24px rgba(30,58,138,0.3)',
              overflowX: 'auto',
            }}
          >
            <Box
              ref={tableRef}
              sx={{
                opacity: tableVisible ? 1 : 0,
                transform: tableVisible ? 'translateY(0)' : 'translateY(40px)',
                transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
              }}
            >
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table
                sx={{
                  minWidth: 560,
                  '& .MuiTableCell-root': {
                    borderBottom: '1px solid rgba(255,255,255,0.15)',
                    padding: { xs: '0.875rem 0.625rem', md: '1rem 0.875rem' },
                    fontFamily: 'inherit',
                    verticalAlign: 'middle',
                    whiteSpace: 'nowrap',
                    color: '#FFFFFF',
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.05em', paddingLeft: 0, borderBottom: '1px solid rgba(255,255,255,0.2)', width: '22%', whiteSpace: 'nowrap' }}>
                      Feature
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, fontWeight: 600, color: '#FFFFFF', width: '19%', whiteSpace: 'nowrap' }}>
                      Starter
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, fontWeight: 600, color: '#FFFFFF', width: '19%', whiteSpace: 'nowrap' }}>
                      Standard
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, fontWeight: 600, color: '#FFFFFF', width: '19%', whiteSpace: 'nowrap' }}>
                      Pro
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, fontWeight: 600, color: '#FFFFFF', width: '19%', whiteSpace: 'nowrap' }}>
                      Premium
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, fontWeight: 500, color: '#FFFFFF', paddingLeft: 0, maxWidth: 180, whiteSpace: { xs: 'normal', md: 'nowrap' } }}>No. of Jobs We Apply</TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, color: '#FFFFFF', lineHeight: 1.4 }}>100 Jobs</TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, color: '#FFFFFF', lineHeight: 1.4 }}>175 Jobs</TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, color: '#FFFFFF', lineHeight: 1.4 }}>250 Jobs</TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, color: '#FFFFFF', lineHeight: 1.4 }}>350 Jobs</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, fontWeight: 500, color: '#FFFFFF', paddingLeft: 0, maxWidth: 180, whiteSpace: { xs: 'normal', md: 'nowrap' } }}>Job search by our team</TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, color: '#FFFFFF', lineHeight: 1.4 }}>0 Jobs<Box component="small" sx={{ display: 'block', opacity: 0.85, fontSize: '0.75rem' }}>*Add-Ons available</Box></TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, color: '#FFFFFF', lineHeight: 1.4 }}>90 Jobs</TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, color: '#FFFFFF', lineHeight: 1.4 }}>190 Jobs</TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, color: '#FFFFFF', lineHeight: 1.4 }}>350 Jobs</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, fontWeight: 500, color: '#FFFFFF', paddingLeft: 0 }}>Human Assistant</TableCell>
                    <TableCell align="center"><CheckCircleIcon sx={{ color: '#4ADE80', fontSize: '1.25rem' }} /></TableCell>
                    <TableCell align="center"><CheckCircleIcon sx={{ color: '#4ADE80', fontSize: '1.25rem' }} /></TableCell>
                    <TableCell align="center"><CheckCircleIcon sx={{ color: '#4ADE80', fontSize: '1.25rem' }} /></TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, color: '#FFFFFF' }}>Dedicated</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, fontWeight: 500, color: '#FFFFFF', paddingLeft: 0 }}>Cover Letters</TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, color: '#FFFFFF' }}>Standard</TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, color: '#FFFFFF' }}>Custom</TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, color: '#FFFFFF' }}>Custom</TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, color: '#FFFFFF' }}>Custom</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, fontWeight: 500, color: '#FFFFFF', paddingLeft: 0 }}>Resume (ATS-Aligned)</TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, color: '#FFFFFF' }}>Add-on</TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, color: '#FFFFFF' }}>Tailored Per Job</TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, color: '#FFFFFF' }}>Tailored Per Job</TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, color: '#FFFFFF' }}>Tailored Per Job</TableCell>
                  </TableRow>
                  {/* <TableRow>
                    <TableCell sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, fontWeight: 500, color: '#FFFFFF', paddingLeft: 0 }}>LinkedIn Optimisation</TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, color: '#FFFFFF' }}>Add-on</TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, color: '#FFFFFF' }}>Add-on</TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, color: '#FFFFFF' }}>Add-on</TableCell>
                    <TableCell align="center"><CheckCircleIcon sx={{ color: '#4ADE80', fontSize: '1.25rem' }} /></TableCell>
                  </TableRow> */}
                  <TableRow>
                    <TableCell sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, fontWeight: 500, color: '#FFFFFF', paddingLeft: 0 }}>Priority Processing</TableCell>
                    <TableCell align="center"><Box component="span" sx={{ color: '#EF4444', fontSize: '1.25rem', fontWeight: 700 }}>✕</Box></TableCell>
                    <TableCell align="center"><Box component="span" sx={{ color: '#EF4444', fontSize: '1.25rem', fontWeight: 700 }}>✕</Box></TableCell>
                    <TableCell align="center"><Box component="span" sx={{ color: '#EF4444', fontSize: '1.25rem', fontWeight: 700 }}>✕</Box></TableCell>
                    <TableCell align="center"><CheckCircleIcon sx={{ color: '#4ADE80', fontSize: '1.25rem' }} /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, fontWeight: 500, color: '#FFFFFF', paddingLeft: 0 }}>Real-Time Updates</TableCell>
                    <TableCell align="center"><CheckCircleIcon sx={{ color: '#4ADE80', fontSize: '1.25rem' }} /></TableCell>
                    <TableCell align="center"><CheckCircleIcon sx={{ color: '#4ADE80', fontSize: '1.25rem' }} /></TableCell>
                    <TableCell align="center"><CheckCircleIcon sx={{ color: '#4ADE80', fontSize: '1.25rem' }} /></TableCell>
                    <TableCell align="center"><CheckCircleIcon sx={{ color: '#4ADE80', fontSize: '1.25rem' }} /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, fontWeight: 500, color: '#FFFFFF', paddingLeft: 0 }}>Interview prep</TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, color: '#FFFFFF' }}>Add-on</TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, color: '#FFFFFF' }}>Add-on</TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, color: '#FFFFFF' }}>1 Session</TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, color: '#FFFFFF' }}>3 Sessions</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            </Box>
          </Box>

          <Typography
            sx={{
              fontSize: '0.8125rem',
              color: '#6B7280',
              textAlign: 'center',
              marginTop: '1rem',
              fontFamily: 'inherit',
            }}
          >
            *Add-Ons available
          </Typography>
        </Container>
      </Box>

      <Box
        sx={{
          background: 'linear-gradient(180deg, #09316f 0%, #115ace 100%)',
          paddingY: { xs: '4rem', md: '5rem' },
          paddingX: { xs: '1.5rem', md: '2rem' },
        }}
      >
        <Container maxWidth="lg">
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              fontWeight: 700,
              color: '#FFFFFF',
              textAlign: 'center',
              marginBottom: '0.75rem',
              fontFamily: 'inherit',
            }}
          >
            Optional Add-Ons (One-Time · AUD)
          </Typography>
          <Typography
            sx={{
              fontSize: '1rem',
              color: 'rgba(255,255,255,0.8)',
              textAlign: 'center',
              marginBottom: '2.5rem',
              fontFamily: 'inherit',
            }}
          >
            Enhance your package with these one-time add-ons.
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: '1.25rem',
              '& > *:nth-of-type(4)': { gridColumn: { md: 'span 1' } },
            }}
          >
            {PRICING_ADDONS.map((addon) => {
              const owned = hasPurchasedAddon(addon.storageName);
              const busy = processingPayment && processingAddonCode === addon.planCode;
              return (
              <Box
                key={addon.planCode}
                sx={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: 140,
                }}
              >
                <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#FFFFFF', fontFamily: 'inherit', marginBottom: '0.5rem' }}>
                  {addon.name}
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.75)', fontFamily: 'inherit', marginBottom: '1rem', lineHeight: 1.5, flex: 1 }}>
                  {addon.desc}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap', marginTop: 'auto' }}>
                  <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, color: '#FFFFFF', fontFamily: 'inherit' }}>
                    ${addon.priceAud} AUD
                  </Typography>
                  <Button
                    variant="secondary"
                    disabled={owned || busy || userPlanLoading}
                    onClick={() => handlePurchaseAddon(addon)}
                  >
                    {owned ? 'Purchased' : busy ? 'Processing…' : 'Buy add-on'}
                  </Button>
                </Box>
              </Box>
            );})}
          </Box>
        </Container>
      </Box>

      {/* Frequently Asked Questions Section */}
      <Box
        ref={faqRef}
        sx={{
          backgroundColor: '#F8FAFC',
          paddingY: { xs: '4rem', md: '6rem' },
          paddingX: { xs: '1.5rem', md: '2rem' },
        }}
      >
        <Container maxWidth="lg">
          {/* Title */}
          <Typography
            component="h2"
            sx={{
              textAlign: 'center',
              fontSize: { xs: '1.5rem', md: '2rem' },
              fontWeight: 700,
              color: '#111827',
              fontFamily: 'inherit',
              marginBottom: { xs: '2rem', md: '3rem' },
              opacity: faqVisible ? 1 : 0,
              transform: faqVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
            }}
          >
            Frequently Asked Questions
          </Typography>

          {/* FAQ Items */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              maxWidth: '720px',
              marginX: 'auto',
            }}
          >
            {[
  {
    question: 'What do we do?',
    answer:
      'We professionally manage and submit job applications on your behalf, aligned with your resume and role preferences. Once you provide your details, our dedicated human team prepares and submits each application manually, including customised cover letters.',
  },
  {
    question: 'Do we guarantee jobs?',
    answer:
      'We do not guarantee interviews or job offers, as hiring decisions are made solely by employers. What we do guarantee is a structured, transparent, and professionally managed application process.',
  },
  {
    question: 'Where do we apply?',
    answer:
      'Applications are submitted via your selected channels, including company career pages, leading job platforms such as Seek and LinkedIn, and any direct application links you provide.',
  },
  {
    question: 'How is this different from a recruitment agency?',
    answer:
      'We work for you, not for employers. Agencies often match candidates to employers (and they typically represent companies, not you). Our sole focus is on getting you in front of as many relevant doors as possible. Think of us as your personal application team, not a head-hunter.',
  },
  {
    question: 'Can you see progress?',
    answer:
      'You will have access to a live tracking dashboard that logs every application submitted on your behalf. This allows you to monitor where and when each submission has been made.',
  },
  {
    question: 'How does pricing and cancellation work?',
    answer:
      'After purchase and submission of your details, our team promptly begins preparing and submitting applications on your behalf.\n\nAs the service involves immediate time and resource allocation, refunds cannot be provided once work has commenced.\n\nCancellations requested prior to service initiation are eligible for a full refund. Once applications are being processed or submitted, the service is non-refundable.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'We collect only the information necessary to manage and submit job applications on your behalf, including your resume, contact details, and role preferences.\n\nYour information is stored securely and used solely for the purpose of facilitating job applications through the channels you authorise. We do not sell, rent, or share your personal information with any third parties outside our internal team, except where required to submit applications as directed by you.\n\nIn accordance with the Australian Privacy Act, you have the right to access, update, or request deletion of your personal information at any time. Requests can be made by contacting our team directly.',
  },
]
.map((faq, index) => (
              <Box
                key={index}
                sx={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '1rem',
                  border: '1px solid #E5E7EB',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                }}
              >
                {/* Question Header */}
                <Box
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: { xs: '1.25rem 1.25rem', md: '1.5rem 1.75rem' },
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: '1rem', md: '1.125rem' },
                      fontWeight: 500,
                      color: '#111827',
                      fontFamily: 'inherit',
                      flex: 1,
                      paddingRight: '1rem',
                    }}
                  >
                    {faq.question}
                  </Typography>
                  <KeyboardArrowDownIcon
                    sx={{
                      color: '#6B7280',
                      fontSize: '1.5rem',
                      transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: expandedFaq === index ? 'rotate(180deg)' : 'rotate(0deg)',
                      flexShrink: 0,
                    }}
                  />
                </Box>

                {/* Answer Content - always in DOM for smooth height transition */}
                <Box
                  sx={{
                    maxHeight: expandedFaq === index ? '800px' : 0,
                    overflow: 'hidden',
                    transition: 'max-height 0.35s ease-out, border-top 0.25s ease-out',
                    borderTop: expandedFaq === index ? '1px solid #E5E7EB' : '1px solid transparent',
                  }}
                >
                  <Typography
                    component="div"
                    sx={{
                      fontSize: { xs: '0.9375rem', md: '1rem' },
                      color: '#374151',
                      fontFamily: 'inherit',
                      lineHeight: 1.7,
                      paddingTop: { xs: '1rem', md: '1.25rem' },
                      paddingBottom: { xs: '1.25rem', md: '1.5rem' },
                      paddingX: { xs: '1.25rem', md: '1.75rem' },
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {faq.answer}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      </Box>
    </MainLayout>
  );
}
