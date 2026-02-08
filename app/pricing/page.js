'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Box, Container, Typography, ToggleButton, ToggleButtonGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
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
import razorpayService from '../../utils/razorpayService';

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [processingPlan, setProcessingPlan] = useState(null);
  
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

  const handleBillingChange = (event, newPeriod) => {
    if (newPeriod !== null) {
      setBillingPeriod(newPeriod);
    }
  };

  // Load Razorpay SDK on component mount
  useEffect(() => {
    razorpayService.loadRazorpaySDK().catch((error) => {
      console.error('Failed to load Razorpay SDK:', error);
    });
  }, []);

  // Handle payment initiation
  const handleGetStarted = async (plan) => {
    // Check if user is authenticated
    if (!isAuthenticated || !token) {
      router.push('/login?redirect=/pricing');
      return;
    }

    setProcessingPayment(true);
    setProcessingPlan(plan.name);

    try {
      const price = billingPeriod === 'monthly' ? plan.monthlyPrice : plan.quarterlyPrice;
      
      // Prepare order data
      const orderData = {
        amount: price,
        customerInfo: {
          name: user.name || 'User',
          email: user.email,
          phone: user.phone || ''
        },
        planName: plan.name,
        billingPeriod: billingPeriod
      };

      // Create Razorpay order
      const orderResult = await razorpayService.createOrder(orderData, token);

      if (!orderResult.success) {
        alert(orderResult.message || 'Failed to create order. Please try again.');
        setProcessingPayment(false);
        setProcessingPlan(null);
        return;
      }

      // Load Razorpay SDK if not already loaded
      await razorpayService.loadRazorpaySDK();

      // Initialize Razorpay payment
      const options = {
        key: orderResult.key_id,
        amount: orderResult.data.amount,
        currency: orderResult.data.currency,
        name: 'ApplyForMe',
        description: `${plan.name} Plan - ${billingPeriod === 'monthly' ? 'Monthly' : 'Quarterly'} Subscription`,
        order_id: orderResult.data.order_id,
        handler: async function (response) {
          // Verify payment on backend
          try {
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            };

            const verifyResult = await razorpayService.verifyPayment(verificationData, token);

            if (verifyResult.success) {
              // Redirect to success page
              router.push(verifyResult.redirect_url || '/payment/success');
            } else {
              // Redirect to failure page
              router.push('/payment/failure');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            router.push('/payment/failure');
          } finally {
            setProcessingPayment(false);
            setProcessingPlan(null);
          }
        },
        prefill: {
          name: user.name || '',
          email: user.email || '',
          contact: user.phone || ''
        },
        theme: {
          color: '#2563EB'
        },
        modal: {
          ondismiss: function() {
            setProcessingPayment(false);
            setProcessingPlan(null);
          }
        }
      };

      // Open Razorpay checkout
      const rzp = await razorpayService.initializeRazorpay(options);
      rzp.open();

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
      monthlyPrice: 99,
      quarterlyPrice: 79,
      description: 'For passive job seekers.',
      features: [
        { text: '50 Applications/mo', included: true },
        { text: 'Resume Review', included: true },
        { text: 'Weekly Reporting', included: true },
        { text: 'Cover Letter Writing', included: false },
      ],
      isPopular: false,
    },
    {
      name: 'Standard',
      monthlyPrice: 199,
      quarterlyPrice: 159,
      description: 'For active job hunting',
      features: [
        { text: '150 Applications/mo', included: true },
        { text: 'Resume Optimization', included: true },
        { text: 'Cover Letter Writing', included: true },
        { text: 'LinkedIn Audit', included: true },
      ],
      isPopular: false,
    },
    {
      name: 'Pro',
      monthlyPrice: 299,
      quarterlyPrice: 239,
      description: 'Maximum acceleration',
      features: [
        { text: '300 Applications/mo', included: true },
        { text: 'Full Resume Rewrite', included: true },
        { text: 'Custom Cover Letters', included: true },
        { text: 'LinkedIn Overhaul', included: true },
        { text: 'Interview Prep Guide', included: true },
      ],
      isPopular: true,
    },
    {
      name: 'Premium',
      monthlyPrice: 499,
      quarterlyPrice: 399,
      description: 'Executive concierge.',
      features: [
        { text: 'Unlimited Applications', included: true },
        { text: 'Priority Processing', included: true },
        { text: '1:1 Career Coaching', included: true },
        { text: 'Salary Negotiation', included: true },
      ],
      isPopular: false,
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
                Choose the plan that fits your goals. Start landing interviews this week.
              </Typography>
            </Box>

            {/* Billing Toggle */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '2rem',
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s',
              }}
            >
              <ToggleButtonGroup
                value={billingPeriod}
                exclusive
                onChange={handleBillingChange}
                sx={{
                  backgroundColor: 'rgba(15, 23, 42, 0.5)',
                  borderRadius: '0.75rem',
                  padding: '0.25rem',
                  border: 'none',
                  '& .MuiToggleButton-root': {
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    fontSize: '1rem',
                    fontWeight: 500,
                    textTransform: 'none',
                    borderRadius: '0.5rem',
                    '&.Mui-selected': {
                      backgroundColor: '#1E3A8A',
                      color: '#FFFFFF',
                      '&:hover': {
                        backgroundColor: '#1E3A8A',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  },
                }}
              >
                <ToggleButton value="monthly">Monthly</ToggleButton>
                <ToggleButton value="quarterly">
                  Quarterly{' '}
                  <Box
                    component="span"
                    sx={{
                      marginLeft: '0.5rem',
                      backgroundColor: '#2563EB',
                      color: '#FFFFFF',
                      padding: '0.125rem 0.5rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    Save 20%
                  </Box>
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
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
              const price = billingPeriod === 'monthly' ? plan.monthlyPrice : plan.quarterlyPrice;
              
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
                  {/* Most Popular Badge - positioned relative to main card */}
                  {plan.isPopular && (
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
                      MOST POPULAR
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

                  {/* Price */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'baseline',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '2.5rem',
                        fontWeight: 700,
                        color: '#1E293B',
                        fontFamily: 'inherit',
                      }}
                    >
                      ${price}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '1rem',
                        color: '#64748B',
                        marginLeft: '0.25rem',
                        fontFamily: 'inherit',
                      }}
                    >
                      /mo
                    </Typography>
                  </Box>

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
            Compare Plans
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
                  minWidth: 600,
                  '& .MuiTableCell-root': {
                    borderBottom: '1px solid #E2E8F0',
                    padding: { xs: '1rem 0.75rem', md: '1.25rem 1rem' },
                    fontFamily: 'inherit',
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontSize: { xs: '0.75rem', md: '0.875rem' },
                        fontWeight: 600,
                        color: '#94A3B8',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        paddingLeft: 0,
                        borderBottom: '1px solid #E2E8F0',
                      }}
                    >
                      Features
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: { xs: '0.875rem', md: '1rem' },
                        fontWeight: 600,
                        color: '#1E293B',
                      }}
                    >
                      Starter
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: { xs: '0.875rem', md: '1rem' },
                        fontWeight: 600,
                        color: '#1E293B',
                      }}
                    >
                      Standard
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: { xs: '0.875rem', md: '1rem' },
                        fontWeight: 600,
                        color: '#2563EB',
                      }}
                    >
                      Pro
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: { xs: '0.875rem', md: '1rem' },
                        fontWeight: 600,
                        color: '#1E293B',
                      }}
                    >
                      Premium
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Monthly Applications */}
                  <TableRow>
                    <TableCell
                      sx={{
                        fontSize: { xs: '0.875rem', md: '1rem' },
                        color: '#1E293B',
                        paddingLeft: 0,
                      }}
                    >
                      Monthly Applications
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, color: '#1E293B' }}>
                      50
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, color: '#1E293B' }}>
                      150
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, color: '#2563EB', fontWeight: 600 }}>
                      300
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, color: '#2563EB', fontWeight: 600 }}>
                      Unlimited
                    </TableCell>
                  </TableRow>

                  {/* Resume Review */}
                  <TableRow>
                    <TableCell
                      sx={{
                        fontSize: { xs: '0.875rem', md: '1rem' },
                        color: '#1E293B',
                        paddingLeft: 0,
                      }}
                    >
                      Resume Review
                    </TableCell>
                    <TableCell align="center">
                      <CheckCircleIcon sx={{ color: '#2563EB', fontSize: '1.25rem' }} />
                    </TableCell>
                    <TableCell align="center">
                      <CheckCircleIcon sx={{ color: '#2563EB', fontSize: '1.25rem' }} />
                    </TableCell>
                    <TableCell align="center">
                      <CheckCircleIcon sx={{ color: '#2563EB', fontSize: '1.25rem' }} />
                    </TableCell>
                    <TableCell align="center">
                      <CheckCircleIcon sx={{ color: '#2563EB', fontSize: '1.25rem' }} />
                    </TableCell>
                  </TableRow>

                  {/* Full Resume Rewrite */}
                  <TableRow>
                    <TableCell
                      sx={{
                        fontSize: { xs: '0.875rem', md: '1rem' },
                        color: '#1E293B',
                        paddingLeft: 0,
                      }}
                    >
                      Full Resume Rewrite
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ color: '#94A3B8', fontSize: '1.25rem' }}>—</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ color: '#94A3B8', fontSize: '1.25rem' }}>—</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <CheckCircleIcon sx={{ color: '#2563EB', fontSize: '1.25rem' }} />
                    </TableCell>
                    <TableCell align="center">
                      <CheckCircleIcon sx={{ color: '#2563EB', fontSize: '1.25rem' }} />
                    </TableCell>
                  </TableRow>

                  {/* Custom Cover Letters */}
                  <TableRow>
                    <TableCell
                      sx={{
                        fontSize: { xs: '0.875rem', md: '1rem' },
                        color: '#1E293B',
                        paddingLeft: 0,
                      }}
                    >
                      Custom Cover Letters
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ color: '#94A3B8', fontSize: '1.25rem' }}>—</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <CheckCircleIcon sx={{ color: '#2563EB', fontSize: '1.25rem' }} />
                    </TableCell>
                    <TableCell align="center">
                      <CheckCircleIcon sx={{ color: '#2563EB', fontSize: '1.25rem' }} />
                    </TableCell>
                    <TableCell align="center">
                      <CheckCircleIcon sx={{ color: '#2563EB', fontSize: '1.25rem' }} />
                    </TableCell>
                  </TableRow>

                  {/* LinkedIn Optimization */}
                  <TableRow>
                    <TableCell
                      sx={{
                        fontSize: { xs: '0.875rem', md: '1rem' },
                        color: '#1E293B',
                        paddingLeft: 0,
                      }}
                    >
                      LinkedIn Optimization
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ color: '#94A3B8', fontSize: '1.25rem' }}>—</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <CheckCircleIcon sx={{ color: '#2563EB', fontSize: '1.25rem' }} />
                    </TableCell>
                    <TableCell align="center">
                      <CheckCircleIcon sx={{ color: '#2563EB', fontSize: '1.25rem' }} />
                    </TableCell>
                    <TableCell align="center">
                      <CheckCircleIcon sx={{ color: '#2563EB', fontSize: '1.25rem' }} />
                    </TableCell>
                  </TableRow>

                  {/* Interview Prep Guide */}
                  <TableRow>
                    <TableCell
                      sx={{
                        fontSize: { xs: '0.875rem', md: '1rem' },
                        color: '#1E293B',
                        paddingLeft: 0,
                      }}
                    >
                      Interview Prep Guide
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ color: '#94A3B8', fontSize: '1.25rem' }}>—</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ color: '#94A3B8', fontSize: '1.25rem' }}>—</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <CheckCircleIcon sx={{ color: '#2563EB', fontSize: '1.25rem' }} />
                    </TableCell>
                    <TableCell align="center">
                      <CheckCircleIcon sx={{ color: '#2563EB', fontSize: '1.25rem' }} />
                    </TableCell>
                  </TableRow>

                  {/* 1:1 Coaching Sessions */}
                  <TableRow>
                    <TableCell
                      sx={{
                        fontSize: { xs: '0.875rem', md: '1rem' },
                        color: '#1E293B',
                        paddingLeft: 0,
                      }}
                    >
                      1:1 Coaching Sessions
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ color: '#94A3B8', fontSize: '1.25rem' }}>—</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ color: '#94A3B8', fontSize: '1.25rem' }}>—</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ color: '#94A3B8', fontSize: '1.25rem' }}>—</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <CheckCircleIcon sx={{ color: '#2563EB', fontSize: '1.25rem' }} />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            </Box>
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
                question: 'How does the interview guarantee work?',
                answer:
                  'Our interview guarantee ensures that if you don\'t receive any interview requests within 90 days of starting your subscription, we\'ll continue working with you for free until you land your first interview. We track all applications and provide full transparency on the process.',
              },
              {
                question: 'Can I pause or cancel my subscription?',
                answer:
                  'Yes, you can pause or cancel your subscription at any time with no penalties. Simply go to your account settings and choose to pause (which will freeze your application count) or cancel (which will stop at the end of your current billing period). Your data and applications remain accessible even after cancellation.',
              },
              {
                question: 'Do you write custom cover letters for every job?',
                answer:
                  'Yes! For Standard, Pro, and Premium plans, we write unique, tailored cover letters for each job application. Our team researches the company, analyzes the job description, and highlights your relevant experience to create compelling, personalized cover letters that increase your chances of getting noticed.',
              },
              {
                question: 'Is my data safe with you?',
                answer:
                  'Absolutely. We take data security seriously. All your personal information, resumes, and application data are encrypted and stored securely. We never share your information with third parties and comply with GDPR and other privacy regulations. You can read our full privacy policy for complete details.',
              },
            ].map((faq, index) => (
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

                {/* Answer Content */}
                <Box
                  sx={{
                    maxHeight: expandedFaq === index ? '500px' : '0',
                    overflow: 'hidden',
                    transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), padding 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    paddingX: expandedFaq === index ? { xs: '1rem', md: '1.75rem' } : 0,
                    paddingBottom: expandedFaq === index ? { xs: '1.25rem', md: '1.5rem' } : 0,
                    borderTop: expandedFaq === index ? '1px solid #E2E8F0' : 'none',
                    opacity: expandedFaq === index ? 1 : 0,
                    transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), padding 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, border-top 0.3s ease',
                  }}
                >
                  {expandedFaq === index && (
                    <Box
                      sx={{
                        animation: 'fadeInDown 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        '@keyframes fadeInDown': {
                          from: {
                            opacity: 0,
                            transform: 'translateY(-10px)',
                          },
                          to: {
                            opacity: 1,
                            transform: 'translateY(0)',
                          },
                        },
                      }}
                    >
                    <Typography
                      sx={{
                        fontSize: { xs: '0.9375rem', md: '1rem' },
                        color: '#64748B',
                        fontFamily: 'inherit',
                        lineHeight: 1.7,
                        paddingTop: { xs: '1rem', md: '1.25rem' },
                      }}
                    >
                      {faq.answer}
                    </Typography>
                    </Box>
                  )}
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
            >
              Start your free trial
            </Button>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
}
