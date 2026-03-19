'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Box, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Button as MuiButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ROICalculator from '@/components/landingPageComponents/ROICalculator/ROICalculator';
import Button from '@/components/Button';
import MainLayout from '../../components/layouts/MainLayout';
import CompanyLogos from '../../components/CompanyLogos';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import stripeService from '../../utils/stripeService';
import planService from '../../utils/planService';
import Link from 'next/link';

export default function Pricing() {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [processingPlan, setProcessingPlan] = useState(null);
  const [stripePromise, setStripePromise] = useState(null);
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [plansError, setPlansError] = useState(null);
  const [userPlan, setUserPlan] = useState(null);
  const [userPlanLoading, setUserPlanLoading] = useState(false);
  
  const { token, user, isAuthenticated } = useSelector((state) => state.auth);
  const router = useRouter();
  
  // Animation refs
  const [heroRef, heroVisible] = useScrollAnimation();
  const [plansRef, plansVisible] = useScrollAnimation();
  const [tableRef, tableVisible] = useScrollAnimation();
  const [roiRef, roiVisible] = useScrollAnimation();
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
          // Check if plan is active (not expired)
          const subscription = data.data.subscription;
          if (subscription) {
            const now = new Date();
            const isExpired = subscription.endDate && new Date(subscription.endDate) < now;
            if (!isExpired && subscription.status === 'active') {
              setUserPlan(data.data);
            }
          }
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

    // Check if user already has an active plan
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
      const price = plan.price;
      
      // Prepare order data (one-time payment)
      const orderData = {
        amount: price,
        customerInfo: {
          name: user.name || 'User',
          email: user.email,
          phone: user.phone || ''
        },
        planName: plan.name,
        billingPeriod: 'onetime'
      };

      // Create Stripe payment intent
      const paymentIntentResult = await stripeService.createPaymentIntent(orderData, token);

      if (!paymentIntentResult.success) {
        alert(paymentIntentResult.message || 'Failed to create payment intent. Please try again.');
        setProcessingPayment(false);
        setProcessingPlan(null);
        return;
      }

      const paymentIntentId = paymentIntentResult.data.payment_intent_id;
      const clientSecret = paymentIntentResult.client_secret;

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


  return (
    <MainLayout>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          overflowX: 'hidden',
        }}
      >
        {/* Hero Section with Dark Blue Background */}
        <Box
          sx={{
            backgroundColor: '#1E293B',
            paddingTop: { xs: '5rem', md: '5rem' },
            paddingBottom: { xs: '10rem', md: '10rem' },
            paddingX: { xs: '1rem', sm: '2.5rem' },
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Gradient overlay matching About Us */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100%',
              height: '100%',
              background:
                'radial-gradient(circle at top right, rgba(37,99,235,0.25), transparent 60%)',
            }}
          />
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 10 }}>
            <Box
              ref={heroRef}
              sx={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
              }}
            >
              {/* Headline */}
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
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              >
                Invest in Your{' '}
                <Box component="span" sx={{ color: '#60A5FA' }}>
                  Career Acceleration.
                </Box>
              </Typography>

              
              <Typography
                component="p"
                sx={{
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  color: '#CBD5E1',
                  textAlign: 'center',
                  marginBottom: '3rem',
                  opacity: 0.9,
                  fontFamily: 'inherit',
                  maxWidth: '48rem',
                  marginX: 'auto',
                  lineHeight: 1.75,
                  fontWeight: 300,
                }}
              >
                One-time payment (AUD). Choose the plan that fits your goals. Start landing interviews sooner.
              </Typography>
            </Box>

            <Typography
              sx={{
                fontSize: { xs: '0.875rem', md: '1rem' },
                color: '#94A3B8',
                textAlign: 'center',
                marginBottom: '2rem',
                fontFamily: 'inherit',
              }}
            >
              AUD · One-time payment
            </Typography>
          </Container>
        </Box>

      {/* Pricing Plans Section - Cards overlapping the hero section */}
      <Box
        sx={{
          background: '#EDF2F7',
          paddingTop: 0,
          paddingBottom: { xs: '1rem', md: '2rem' },
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
                mt: { xs: '-2rem', md: '-4rem' },
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
              marginTop: { xs: '-4rem', md: '-6rem' },
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
                    background: 'rgba(255, 255, 255, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(30px)',
                    WebkitBackdropFilter: 'blur(30px)',
                    borderRadius: '1rem',
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'visible',
                    boxShadow: '0 20px 40px -10px rgba(30, 41, 59, 0.08)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    opacity: plansVisible ? 1 : 0,
                    // transform: plansVisible ? 'translateY(0)' : 'translateY(40px)',
                    // animation: plansVisible ? `fadeInUp 0.6s ease-out ${planIndex * 0.1}s both` : 'none',
                    // '@keyframes fadeInUp': {
                    //   from: {
                    //     opacity: 0,
                    //     transform: 'translateY(40px)',
                    //   },
                    //   to: {
                    //     opacity: 1,
                    //     transform: 'translateY(0)',
                    //   },
                    // },
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 25px 50px -10px rgba(30, 41, 59, 0.12)',
                    },
                  }}
                >
                  {/* Decorative blur circle effect */}
                  <Box
                    sx={{
                      position: 'absolute',
                      right: '-80px',
                      top: '-80px',
                      width: '256px',
                      height: '256px',
                      backgroundColor: 'rgba(37, 99, 235, 0.1)',
                      filter: 'blur(64px)',
                      borderRadius: '50%',
                      pointerEvents: 'none',
                    }}
                  />
                  {/* Plan Badge (Your Plan / Most Popular / Best Value) */}
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
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3), 0 2px 4px -1px rgba(16, 185, 129, 0.2)',
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
                        backgroundColor: '#2563EB',
                        color: '#FFFFFF',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        zIndex: '999999 !important',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.3), 0 2px 4px -1px rgba(37, 99, 235, 0.2)',
                        '&:hover': {
                          transform: 'translateX(-50%) translateY(-2px)',
                          boxShadow: '0 8px 12px -2px rgba(37, 99, 235, 0.4), 0 4px 6px -1px rgba(37, 99, 235, 0.3)',
                          backgroundColor: '#1E3A8A',
                        },
                      }}
                    >
                      {plan.badge.toUpperCase()}
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

                  {/* Plan Name */}
                  <Typography
                    sx={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: plan.isPopular ? '#2563EB' : '#1E293B',
                      marginBottom: '0.5rem',
                      fontFamily: 'inherit',
                    }}
                  >
                    {plan.name}
                  </Typography>

                  {/* Price: actual (strikethrough) + discounted — eye-catching */}
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
                          fontSize: '1.375rem',
                          fontWeight: 600,
                          color: '#94A3B8',
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
                        color: '#1E293B',
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
                          backgroundColor: '#10B981',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '0.375rem',
                          fontFamily: 'inherit',
                        }}
                      >
                        Save ${plan.actualPrice - plan.price}
                      </Box>
                    )}
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '0.8125rem',
                      color: '#64748B',
                      marginBottom: '0.5rem',
                      fontFamily: 'inherit',
                    }}
                  >
                    {plan.billingPeriod === 'onetime' ? 'One-time' : plan.billingPeriod.charAt(0).toUpperCase() + plan.billingPeriod.slice(1)} · {plan.currency || 'AUD'}
                  </Typography>

                  {/* Description */}
                  <Typography
                    sx={{
                      fontSize: '0.875rem',
                      color: '#64748B',
                      marginBottom: '1.5rem',
                      fontFamily: 'inherit',
                    }}
                  >
                    {plan.description}
                  </Typography>

                  {/* Features List */}
                  <Box
                    sx={{
                      flex: 1,
                      marginBottom: '2rem',
                    }}
                  >
                    {plan.features.map((feature, index) => (
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
                              color: '#2563EB',
                              fontSize: '1.25rem',
                              marginRight: '0.75rem',
                            }}
                          />
                        ) : (
                          <RadioButtonUncheckedIcon
                            sx={{
                              color: '#94A3B8',
                              fontSize: '1.25rem',
                              marginRight: '0.75rem',
                            }}
                          />
                        )}
                        <Typography
                          sx={{
                            fontSize: '0.875rem',
                            color: feature.included ? '#1E293B' : '#94A3B8',
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
                      if (plan.isPopular) {
                        return {
                          bg: '#2563EB',
                          color: '#FFFFFF',
                          border: 'none',
                          hoverBg: '#1E3A8A',
                          hoverColor: '#FFFFFF'
                        };
                      }
                      // Non-popular plan (white background)
                      return {
                        bg: '#FFFFFF',
                        color: '#2563EB',
                        border: '1px solid #2563EB',
                        hoverBg: '#2563EB',
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
                          borderRadius: '0.5rem',
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
                          'Get Started'
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

      <Box 
        ref={roiRef}
        sx={{
          padding: { sm: '0rem', md: '0rem 3rem' },
          backgroundColor: '#EDF2F7',
          opacity: roiVisible ? 1 : 0,
          transform: roiVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
        }}
      >
        <ROICalculator/>
      </Box>

      {/* Compare Plans Table Section */}
      <Box
        sx={{
          backgroundColor: '#EDF2F7',
          paddingY: { xs: '0rem', md: '0rem' },
          paddingX: { xs: '1.5rem', md: '2rem' },
        }}
      >
        <Container maxWidth="lg">
          {/* Title */}
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700,
              color: '#1E293B',
              textAlign: 'center',
              marginBottom: '3rem',
              fontFamily: 'inherit',
            }}
          >
            Package Features Comparison
          </Typography>

          {/* Comparison Table Card */}
          <Box
            sx={{
              backgroundColor: '#FFFFFF',
              borderRadius: '1rem',
              padding: { xs: '1.5rem', md: '2rem' },
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
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
                    borderBottom: '1px solid #E2E8F0',
                    padding: { xs: '0.875rem 0.625rem', md: '1rem 0.875rem' },
                    fontFamily: 'inherit',
                    verticalAlign: 'middle',
                    whiteSpace: 'nowrap',
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', paddingLeft: 0, borderBottom: '1px solid #E2E8F0', width: '22%', whiteSpace: 'nowrap' }}>
                      Feature
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, fontWeight: 600, color: '#1E293B', width: '19%', whiteSpace: 'nowrap' }}>
                      Starter
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, fontWeight: 600, color: '#1E293B', width: '19%', whiteSpace: 'nowrap' }}>
                      Standard
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, fontWeight: 600, color: '#2563EB', width: '19%', whiteSpace: 'nowrap' }}>
                      Pro
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, fontWeight: 600, color: '#1E293B', width: '19%', whiteSpace: 'nowrap' }}>
                      Premium
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, fontWeight: 500, color: '#1E293B', paddingLeft: 0, maxWidth: 160 }}>
                      Job search (who applies)
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, color: '#1E293B', lineHeight: 1.4 }}>
                      You (100)
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, color: '#1E293B', lineHeight: 1.4 }}>
                      50% us / 50% you
                      <Box component="span" sx={{ display: 'block', fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>(175)</Box>
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, color: '#2563EB', lineHeight: 1.4 }}>
                      75% us / 25% you
                      <Box component="span" sx={{ display: 'block', fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>(250)</Box>
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, color: '#1E293B', lineHeight: 1.4 }}>
                      100% us
                      <Box component="span" sx={{ display: 'block', fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>(350)</Box>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, fontWeight: 500, color: '#1E293B', paddingLeft: 0 }}>Human Assistant</TableCell>
                    <TableCell align="center"><CheckCircleIcon sx={{ color: '#2563EB', fontSize: '1.25rem' }} /></TableCell>
                    <TableCell align="center"><CheckCircleIcon sx={{ color: '#2563EB', fontSize: '1.25rem' }} /></TableCell>
                    <TableCell align="center"><CheckCircleIcon sx={{ color: '#2563EB', fontSize: '1.25rem' }} /></TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' } }}>Dedicated</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, fontWeight: 500, color: '#1E293B', paddingLeft: 0 }}>Cover Letters</TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' } }}>Standard</TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' } }}>Custom</TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' } }}>Custom</TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' } }}>Custom</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, fontWeight: 500, color: '#1E293B', paddingLeft: 0 }}>Resume (ATS-aligned)</TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' } }}>Review only (add-on)</TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' } }}>We create</TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' } }}>We create</TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' } }}>We create</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, fontWeight: 500, color: '#1E293B', paddingLeft: 0 }}>LinkedIn optimisation</TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' } }}>Add-on</TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' } }}>Add-on</TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' } }}>Add-on</TableCell>
                    <TableCell align="center"><CheckCircleIcon sx={{ color: '#2563EB', fontSize: '1.25rem' }} /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, fontWeight: 500, color: '#1E293B', paddingLeft: 0 }}>Priority processing</TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' } }}>—</TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' } }}>—</TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' } }}>Add-on</TableCell>
                    <TableCell align="center"><CheckCircleIcon sx={{ color: '#2563EB', fontSize: '1.25rem' }} /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, fontWeight: 500, color: '#1E293B', paddingLeft: 0 }}>Real-time updates</TableCell>
                    <TableCell align="center"><CheckCircleIcon sx={{ color: '#2563EB', fontSize: '1.25rem' }} /></TableCell>
                    <TableCell align="center"><CheckCircleIcon sx={{ color: '#2563EB', fontSize: '1.25rem' }} /></TableCell>
                    <TableCell align="center"><CheckCircleIcon sx={{ color: '#2563EB', fontSize: '1.25rem' }} /></TableCell>
                    <TableCell align="center"><CheckCircleIcon sx={{ color: '#2563EB', fontSize: '1.25rem' }} /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' }, fontWeight: 500, color: '#1E293B', paddingLeft: 0 }}>Interview prep</TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' } }}>Add-on</TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' } }}>Add-on</TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' } }}>1 + add-on</TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.8125rem', md: '0.9375rem' } }}>3 + add-on</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            </Box>
          </Box>

          {/* Optional Add-Ons Section */}
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              fontWeight: 700,
              color: '#1E293B',
              textAlign: 'center',
              marginTop: '4rem',
              marginBottom: '1.5rem',
              fontFamily: 'inherit',
            }}
          >
            Optional Add-Ons (One-Time · AUD)
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '0.9375rem', md: '1rem' },
              color: '#64748B',
              textAlign: 'center',
              marginBottom: '2rem',
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
              marginBottom: '3rem',
            }}
          >
            {[
              { name: 'Job Search by Our Team', desc: 'We search and shortlist relevant jobs based on role & location', price: 59 },
              { name: 'Custom Resume Rewrite (ATS-Optimised)', desc: 'Complete resume rewrite with keyword optimisation', price: 39 },
              { name: 'LinkedIn Profile Optimisation', desc: 'Headline, summary & recruiter keyword optimisation', price: 49 },
              { name: 'Interview Prep', desc: 'Preparation session for your interviews', price: 20 },
              { name: 'Priority Processing Upgrade', desc: 'Faster handling vs standard queue', price: 49 },
            ].map((addon) => (
              <Box
                key={addon.name}
                sx={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '0.75rem',
                  padding: '1.25rem',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.06)',
                }}
              >
                <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#1E293B', fontFamily: 'inherit', marginBottom: '0.5rem' }}>
                  {addon.name}
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: '#64748B', fontFamily: 'inherit', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                  {addon.desc}
                </Typography>
                <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#2563EB', fontFamily: 'inherit' }}>
                  ${addon.price} AUD
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      <Box sx={{padding:{sm:'0rem', md:'3rem'}, backgroundColor:'#EDF2F7'}}>
        <Container maxWidth="lg">
          <Box
            ref={logosRef}
            sx={{
              opacity: logosVisible ? 1 : 0,
              transform: logosVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
            }}
          >
            <Typography
              component="h3"
              sx={{
                textAlign: 'center',
                fontSize: { xs: '0.875rem', md: '1.125rem' },
                fontWeight: 700,
                color: '#64748B',
                fontFamily: 'inherit',
                marginBottom: { xs: '2rem', md: '3rem' },
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              OUR CLIENTS GET HIRED AT
            </Typography>
            <CompanyLogos title="Our Clients Get Hired At" />
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
              color: '#1E293B',
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
              maxWidth: '800px',
              marginX: 'auto',
            }}
          >
            {[
  {
    question: 'What exactly do you do?',
    answer:
      'We apply to jobs on your behalf using your resume and preferences. You give us the details, and our human team submits each application (cover letters included). It’s 100% manual – we’re here to handle the busywork of your job search.',
  },
  {
    question: 'Do you guarantee I’ll get a job?',
    answer:
      'No. We can’t promise interviews or job offers – no honest service can. What we guarantee is a structured, transparent application process. We focus on making high-quality submissions, but ultimately hiring decisions are out of our control.',
  },
  {
    question: 'Where do you apply?',
    answer:
      'We use your chosen methods: company websites, major job boards (like Seek, LinkedIn, etc.), and any direct links you provide. Our service is tailored to the Australian market, so we know where Australian employers post roles.',
  },
  {
    question: 'How is this different from a recruitment agency?',
    answer:
      'We work for you, not for employers. Agencies often match candidates to employers (and they typically represent companies, not you). Our sole focus is on getting you in front of as many relevant doors as possible. Think of us as your personal application team, not a headhunter.',
  },
  {
    question: 'Can I see proof of applications?',
    answer:
      'Yes! You get access to a live dashboard where every submitted application is logged. You’ll know exactly where and when we applied on your behalf. No mysteries, no “hidden” applications – complete transparency.',
  },
  {
    question: 'How does pricing and cancellation work?',
    answer:
      'Each package is a one-time payment. We have no recurring fees. Once you purchase, we start the process (after you submit your info). Because our team immediately begins handling your applications, we do not offer refunds after we’ve started the service. If you change your mind before we begin, we can cancel and refund you. But once applications are in progress, it’s non-refundable.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Absolutely. We take your privacy seriously. We collect only the information needed to apply for jobs (your resume, contact info, preferences). This data is stored securely and used only for the purpose of job applications. We do not sell or share your personal info with anyone outside our team. You have full rights under the Australian Privacy Act – you can access, correct, or delete your data at any time (just let us know).',
  },
]
.map((faq, index) => (
              <Box
                key={index}
                sx={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '0.75rem',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  },
                }}
              >
                {/* Question Header */}
                <Box
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: { xs: '1.25rem 1rem', md: '1.5rem 1.75rem' },
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: '1rem', md: '1.125rem' },
                      fontWeight: 600,
                      color: '#1E293B',
                      fontFamily: 'inherit',
                      flex: 1,
                      paddingRight: '1rem',
                    }}
                  >
                    {faq.question}
                  </Typography>
                  <KeyboardArrowDownIcon
                    sx={{
                      color: '#1E293B',
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
                    borderTop: expandedFaq === index ? '1px solid #E2E8F0' : '1px solid transparent',
                  }}
                >
                  <Typography
                    component="div"
                    sx={{
                      fontSize: { xs: '0.9375rem', md: '1rem' },
                      color: '#64748B',
                      fontFamily: 'inherit',
                      lineHeight: 1.7,
                      paddingTop: { xs: '1rem', md: '1.25rem' },
                      paddingBottom: { xs: '1.25rem', md: '1.5rem' },
                      paddingX: { xs: '1rem', md: '1.75rem' },
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

      {/* let us handle  */}
       {/* Final CTA Section */}
       <Box
          sx={{
            width: '100%',
            backgroundColor: '#1E293B',
            py: { xs: 6, md: 6 },
            px: { xs: 1, sm: 1.5, md: 2.5 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at center, rgba(37,99,235,0.15), transparent 70%)',
            }}
          />
          <Box
            sx={{
              position: 'relative',
              zIndex: 10,
              maxWidth: '768px',
            }}
          >
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: '2.25rem', md: '3rem' },
                fontWeight: 900,
                color: '#FFFFFF',
                mb: 3,
                letterSpacing: '-0.02em',
              }}
            >
              Ready to delegate your job search?
            </Typography>
            <Typography
              sx={{
                color: '#CBD5E1',
                fontSize: '1.125rem',
                mb: 4,
                maxWidth: '576px',
                mx: 'auto',
              }}
            >
              Let us handle the applications so you can focus on interviews.
            </Typography>
            <Button
              sx={{
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                fontSize: '1.125rem',
                fontWeight: 700,
                py: 2,
                px: 5,
                borderRadius: '12px',
                boxShadow: '0 20px 40px -10px rgba(37, 99, 235, 0.5)',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#1E3A8A',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.3s',
              }}
              onClick={() => router.push('/signup')}
            >
              Sign up Now
            </Button>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
}
