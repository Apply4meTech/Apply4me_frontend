'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Box, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material';
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

export default function Pricing() {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [processingPlan, setProcessingPlan] = useState(null);
  const [stripePromise, setStripePromise] = useState(null);
  
  // Redux and Router
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

  // Handle payment initiation
  const handleGetStarted = async (plan) => {
    // Check if user is authenticated
    if (!isAuthenticated || !token) {
      router.push('/login?redirect=/pricing');
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

      // Redirect to payment page with payment intent details
      router.push(`/payment/checkout?payment_intent=${paymentIntentId}&client_secret=${encodeURIComponent(clientSecret)}`);

    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('Failed to initiate payment. Please try again.');
      setProcessingPayment(false);
      setProcessingPlan(null);
    }
  };

  const plans = [
    {
      name: 'Starter',
      price: 89,
      actualPrice: 119,
      description: '100 Job Applications',
      features: [
        { text: '100 Job Applications', included: true },
        { text: 'Human Assistant', included: true },
        { text: 'Standard cover letter (role-adjusted)', included: true },
        { text: 'Real-time progress updates', included: true },
      ],
      isPopular: false,
      badge: null,
    },
    {
      name: 'Standard',
      price: 149,
      actualPrice: 199,
      description: '175 Job Applications',
      features: [
        { text: '175 Job Applications', included: true },
        { text: 'Human Assistant', included: true },
        { text: 'Custom cover letters', included: true },
        { text: 'Resume created by us, ATS-aligned', included: true },
        { text: 'Real-time progress updates', included: true },
      ],
      isPopular: false,
      badge: null,
    },
    {
      name: 'Pro',
      price: 229,
      actualPrice: 299,
      description: '250 Job Applications',
      features: [
        { text: '250 Job Applications', included: true },
        { text: 'Human Assistant', included: true },
        { text: 'Custom cover letters', included: true },
        { text: 'Resume created by us for every job', included: true },
        { text: 'Real-time progress updates', included: true },
        { text: '1 Interview prep included + add-on', included: true },
      ],
      isPopular: true,
      badge: 'Most Popular',
    },
    {
      name: 'Premium',
      price: 329,
      actualPrice: 399,
      description: '350 Job Applications',
      features: [
        { text: '350 Job Applications', included: true },
        { text: 'Dedicated Human Assistant', included: true },
        { text: 'Custom cover letters', included: true },
        { text: 'Resume created by us for every job', included: true },
        { text: 'LinkedIn Profile Optimisation', included: true },
        { text: 'Priority Processing', included: true },
        { text: 'Real-time progress updates', included: true },
        { text: '3 Interview prep included + add-on', included: true },
      ],
      isPopular: false,
      badge: 'Best Value',
    },
  ];

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
            {plans.map((plan, planIndex) => {
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
                  {/* Plan Badge (Most Popular / Best Value) */}
                  {plan.badge && (
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
                  )}
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
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '0.8125rem',
                      color: '#64748B',
                      marginBottom: '0.5rem',
                      fontFamily: 'inherit',
                    }}
                  >
                    One-time · AUD
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
                  <Box
                    component="button"
                    onClick={() => handleGetStarted(plan)}
                    disabled={processingPayment}
                    sx={{
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.5rem',
                      border: plan.isPopular ? 'none' : '1px solid #2563EB',
                      backgroundColor: plan.isPopular ? '#2563EB' : '#FFFFFF',
                      color: '#FFFFFF',
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: processingPayment ? 'not-allowed' : 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.3s ease',
                      opacity: processingPayment ? 0.7 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      '&:hover': {
                        backgroundColor: processingPayment 
                          ? (plan.isPopular ? '#2563EB' : '#FFFFFF')
                          : (plan.isPopular ? '#1E3A8A' : '#2563EB'),
                        color: '#FFFFFF',
                        transform: processingPayment ? 'none' : 'scale(1.02)',
                      },
                      ...(plan.isPopular
                        ? {}
                        : {
                            color: '#2563EB',
                            '&:hover': {
                              color: '#FFFFFF',
                            },
                          }),
                    }}
                  >
                    {processingPayment && processingPlan === plan.name ? (
                      <>
                        <CircularProgress size={16} sx={{ color: 'inherit' }} />
                        Processing...
                      </>
                    ) : (
                      'Get Started'
                    )}
                  </Box>
                  </Box>
                </Box>
              );
            })}
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
            <TableContainer>
              <Table
                sx={{
                  minWidth: 560,
                  '& .MuiTableCell-root': {
                    borderBottom: '1px solid #E2E8F0',
                    padding: { xs: '0.875rem 0.625rem', md: '1rem 0.875rem' },
                    fontFamily: 'inherit',
                    verticalAlign: 'middle',
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', paddingLeft: 0, borderBottom: '1px solid #E2E8F0', width: '22%' }}>
                      Feature
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, fontWeight: 600, color: '#1E293B', width: '19%' }}>
                      Starter
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, fontWeight: 600, color: '#1E293B', width: '19%' }}>
                      Standard
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, fontWeight: 600, color: '#2563EB', width: '19%' }}>
                      Pro
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, fontWeight: 600, color: '#1E293B', width: '19%' }}>
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
