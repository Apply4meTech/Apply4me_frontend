'use client';

import React from 'react';
import { Box, Typography, TextField, Button, Checkbox, FormHelperText, useMediaQuery, CircularProgress, Alert } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { setLoading, loginSuccess, loginFailure, clearError } from '../../store/authSlice';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Validation schema
const signupSchema = yup.object().shape({
  name: yup
    .string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  agreeTerms: yup
    .boolean()
    .oneOf([true], 'You must agree to the Terms of Service and Privacy Policy'),
});

// Logo SVG Component
const LogoIcon = ({ color = '#2463eb', size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6H16V4C16 2.89 15.11 2 14 2H10C8.89 2 8 2.89 8 4V6H4C2.89 6 2 6.89 2 8V19C2 20.11 2.89 21 4 21H20C21.11 21 22 20.11 22 19V8C22 6.89 21.11 6 20 6ZM10 4H14V6H10V4ZM20 19H4V8H20V19Z" fill={color}/>
    <path d="M12 10C10.34 10 9 11.34 9 13C9 14.66 10.34 16 12 16C13.66 16 15 14.66 15 13C15 11.34 13.66 10 12 10ZM12 14.5C11.17 14.5 10.5 13.83 10.5 13C10.5 12.17 11.17 11.5 12 11.5C12.83 11.5 13.5 12.17 13.5 13C13.5 13.83 12.83 14.5 12 14.5Z" fill={color}/>
  </svg>
);

// Reusable TextField styles
const getTextFieldStyles = (hasError, size = 'default') => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    height: size === 'small' ? 'auto' : '48px',
    bgcolor: 'white',
    '& fieldset': { borderColor: hasError ? '#ef4444' : '#e2e8f0' },
    '&:hover fieldset': { borderColor: hasError ? '#ef4444' : '#2a63ea' },
    '&.Mui-focused fieldset': { borderColor: hasError ? '#ef4444' : '#2a63ea', borderWidth: '1px' },
  },
  '& .MuiOutlinedInput-input': {
    padding: size === 'small' ? '10px 14px' : '12px 16px',
    fontSize: '0.875rem',
    fontWeight: size === 'small' ? 400 : 500,
    fontFamily: '"Manrope", sans-serif',
    '&::placeholder': { color: '#94a3b8', opacity: 1 },
  },
  '& .MuiFormHelperText-root': { color: '#ef4444', marginLeft: 0, marginTop: '4px', fontSize: '0.75rem' },
});

export default function Signup() {
  const isMobileOrTablet = useMediaQuery('(max-width:900px)');
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error: authError } = useSelector((state) => state.auth);

  const handleSignup = async (values) => {
    dispatch(clearError());
    dispatch(setLoading(true));
    
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Signup failed. Please try again.');
      }
      
      if (data.success && data.token) {
        dispatch(loginSuccess({ token: data.token, user: data.user }));
        // New users always go to onboarding
        router.push('/onboarding');
      } else {
        throw new Error(data.message || 'Signup failed. Please try again.');
      }
    } catch (err) {
      dispatch(loginFailure(err.message));
    }
  };

  // Mobile/Tablet View - Card with gradient background
  if (isMobileOrTablet) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          width: '100%',
          bgcolor: '#1E293B',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: { xs: 2, sm: 3 },
          fontFamily: '"Manrope", sans-serif',
          overflow: 'hidden',
        }}
      >
        {/* Decorative abstract circles */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            opacity: 0.1,
            pointerEvents: 'none',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '-10%',
              left: '-10%',
              width: '50%',
              height: '50%',
              borderRadius: '50%',
              bgcolor: 'white',
              filter: 'blur(48px)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '40%',
              right: '-10%',
              width: '40%',
              height: '40%',
              borderRadius: '50%',
              bgcolor: '#2463eb',
              filter: 'blur(48px)',
            }}
          />
        </Box>

        {/* Card */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            maxWidth: '440px',
            bgcolor: 'white',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            p: { xs: 3, sm: 4 },
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
            fontFamily: '"Manrope", sans-serif',
            '& *': { fontFamily: 'inherit' },
          }}
        >
          {/* Logo */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LogoIcon color="#2463eb" size={36} />
                <Typography
                  sx={{
                    color: '#0f172a',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                    fontFamily: '"Manrope", sans-serif',
                  }}
                >
                  APPLY FOR ME
                </Typography>
              </Box>
            </Link>
          </Box>

          {/* Form Header */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              component="h2"
              sx={{
                color: '#111318',
                fontSize: '1.875rem',
                fontWeight: 700,
                letterSpacing: '-0.025em',
                fontFamily: '"Manrope", sans-serif',
              }}
            >
              Create your account
            </Typography>
            <Typography sx={{ color: '#64748b', fontSize: '1rem', mt: 0.5, fontFamily: '"Manrope", sans-serif' }}>
              Join thousands of job seekers saving time today.
            </Typography>
          </Box>

          {/* Error Alert */}
          {authError && (
            <Alert severity="error" onClose={() => dispatch(clearError())} sx={{ borderRadius: '8px' }}>
              {authError}
            </Alert>
          )}

          {/* Formik Form */}
          <Formik
            initialValues={{ name: '', email: '', password: '', agreeTerms: false }}
            validationSchema={signupSchema}
            onSubmit={handleSignup}
          >
            {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
              <Form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Full Name Field */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography
                    component="label"
                    htmlFor="name"
                    sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#111318', fontFamily: '"Manrope", sans-serif' }}
                  >
                    Full Name
                  </Typography>
                  <TextField
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Sarah Jenkins"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                    fullWidth
                    size="small"
                    sx={getTextFieldStyles(touched.name && !!errors.name, 'small')}
                  />
                </Box>

                {/* Email Field */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography
                    component="label"
                    htmlFor="email"
                    sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#111318', fontFamily: '"Manrope", sans-serif' }}
                  >
                    Email Address
                  </Typography>
                  <TextField
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@company.com"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                    fullWidth
                    size="small"
                    sx={getTextFieldStyles(touched.email && !!errors.email, 'small')}
                  />
                </Box>

                {/* Password Field */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography
                    component="label"
                    htmlFor="password"
                    sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#111318', fontFamily: '"Manrope", sans-serif' }}
                  >
                    Password
                  </Typography>
                  <TextField
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && !!errors.password}
                    helperText={touched.password && errors.password}
                    fullWidth
                    size="small"
                    sx={getTextFieldStyles(touched.password && !!errors.password, 'small')}
                  />
                </Box>

                {/* Terms Checkbox */}
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox
                      id="agreeTerms"
                      name="agreeTerms"
                      checked={values.agreeTerms}
                      onChange={(e) => setFieldValue('agreeTerms', e.target.checked)}
                      onBlur={handleBlur}
                      sx={{
                        color: touched.agreeTerms && errors.agreeTerms ? '#ef4444' : '#cbd5e1',
                        padding: '0',
                        marginRight: '8px',
                        '&.Mui-checked': { color: '#2a63ea' },
                      }}
                    />
                    <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>
                      I agree to the{' '}
                      <Link href="/terms-of-service" style={{ fontWeight: 700, color: '#2a63ea', textDecoration: 'none' }}>
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy-policy" style={{ fontWeight: 700, color: '#2a63ea', textDecoration: 'none' }}>
                        Privacy Policy
                      </Link>
                    </Typography>
                  </Box>
                  {touched.agreeTerms && errors.agreeTerms && (
                    <FormHelperText sx={{ color: '#ef4444', marginLeft: '28px', marginTop: '4px', fontSize: '0.7rem' }}>
                      {errors.agreeTerms}
                    </FormHelperText>
                  )}
                </Box>

                {/* Submit Button */}
                <Button
                  type="submit"
                  fullWidth
                  disabled={loading}
                  sx={{
                    mt: 0.5,
                    bgcolor: '#2463eb',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    height: '44px',
                    borderRadius: '8px',
                    textTransform: 'none',
                    '&:hover': { bgcolor: '#1d4ed8' },
                    '&:active': { transform: 'scale(0.98)' },
                    '&:disabled': { bgcolor: '#93c5fd', color: 'white' },
                  }}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Create Account'}
                </Button>
              </Form>
            )}
          </Formik>

          {/* Footer */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontSize: '0.875rem', color: '#64748b' }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: '#2463eb', fontWeight: 700, textDecoration: 'none' }}>
                Log In
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  // Desktop View - Split screen layout
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden',
        fontFamily: '"Manrope", sans-serif',
      }}
    >
      {/* Left Panel: Value Proposition */}
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          width: '41.666667%',
          flexDirection: 'column',
          justifyContent: 'space-between',
          bgcolor: '#1E293B',
          p: '64px',
          overflow: 'hidden',
        }}
      >
        {/* Decorative Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            mr: '-80px',
            mt: '-80px',
            width: '384px',
            height: '384px',
            bgcolor: 'rgba(42, 99, 234, 0.2)',
            borderRadius: '50%',
            filter: 'blur(48px)',
            opacity: 0.5,
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            ml: '-80px',
            mb: '-80px',
            width: '320px',
            height: '320px',
            bgcolor: 'rgba(96, 165, 250, 0.1)',
            borderRadius: '50%',
            filter: 'blur(48px)',
            opacity: 0.3,
            pointerEvents: 'none',
          }}
        />

        {/* Top Content */}
        <Box sx={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
          {/* Branding */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'white',
              textDecoration: 'none',
            }}
          >
            <LogoIcon color="white" size={32} />
            <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.025em', color: 'white' }}>
              APPLY FOR ME
            </Typography>
          </Link>

          {/* Hero Text */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography
              component="h1"
              sx={{
                color: 'white',
                fontSize: { lg: '3rem' },
                fontWeight: 900,
                lineHeight: 1.2,
                letterSpacing: '-0.025em',
              }}
            >
              Your Personal Jobsmith Starts Here
            </Typography>
            <Typography
              sx={{
                color: '#cbd5e1',
                fontSize: '1.125rem',
                fontWeight: 400,
                lineHeight: 1.6,
                maxWidth: '28rem',
              }}
            >
              Stop scrolling, start interviewing. Let our experts handle the tedious applications while you prepare for success.
            </Typography>
          </Box>

          {/* Glass Stats */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
                borderRadius: '12px',
                p: 2.5,
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'background-color 0.2s',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.15)' },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#bfdbfe', mb: 0.5 }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>check_circle</span>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Interviews
                </Typography>
              </Box>
              <Typography sx={{ color: 'white', fontSize: '1.875rem', fontWeight: 700 }}>500+</Typography>
              <Typography sx={{ color: '#cbd5e1', fontSize: '0.875rem' }}>Secured this month</Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
                borderRadius: '12px',
                p: 2.5,
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'background-color 0.2s',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.15)' },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#a7f3d0', mb: 0.5 }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>schedule</span>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Time Saved
                </Typography>
              </Box>
              <Typography sx={{ color: 'white', fontSize: '1.875rem', fontWeight: 700 }}>40h</Typography>
              <Typography sx={{ color: '#cbd5e1', fontSize: '0.875rem' }}>Per candidate</Typography>
            </Box>
          </Box>
        </Box>

        {/* Bottom Content: Testimonial */}
        <Box sx={{ position: 'relative', zIndex: 10, mt: 5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 2,
              p: 2.5,
              borderRadius: '12px',
              bgcolor: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid #334155',
              backdropFilter: 'blur(4px)',
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                border: '2px solid #475569',
                flexShrink: 0,
                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBtnH8rqaEMp5-i-yGj7ux26aY5oUM_G60Ml8YC_BpZS96g_hDiMeuqjbLv8auGRlIgP7aH4dwnL3dKOZg_RDmogi8PDrGcI0Uk9aUVDN0uNok8HUB5qneQmPziMZ4vtBkBKIk-qIjGv8jnaP0-s-5PVgTi9q4W0Lqzpw0j9Eag_liV1gmDeJF4_uYvKw45957DXmesNSmit-DMzR-UcWDPk3TnoWILF4s4GHvkQnpFE4jTs5YXrt-NHc7M-LCaY1mMofdm3DdvcT8")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography sx={{ color: '#f1f5f9', fontSize: '0.875rem', fontStyle: 'italic', fontWeight: 500 }}>
                &quot;I saved 40 hours of applying in just one week. The quality of matches was surprisingly accurate.&quot;
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <Typography sx={{ color: 'white', fontSize: '0.75rem', fontWeight: 700 }}>Sarah</Typography>
                <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#64748b' }} />
                <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>Product Manager</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Right Panel: Sign Up Form */}
      <Box
        sx={{
          width: '58.333333%',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'white',
          overflowY: 'auto',
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 10,
          }}
        >
          <Box sx={{ width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Form Header */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography
                component="h2"
                sx={{
                  color: '#111318',
                  fontSize: '1.875rem',
                  fontWeight: 700,
                  letterSpacing: '-0.025em',
                }}
              >
                Create your account
              </Typography>
              <Typography sx={{ color: '#64748b', fontSize: '1rem' }}>
                Join thousands of job seekers saving time today.
              </Typography>
            </Box>

            {/* Error Alert */}
            {authError && (
              <Alert severity="error" onClose={() => dispatch(clearError())} sx={{ borderRadius: '8px' }}>
                {authError}
              </Alert>
            )}

            {/* Formik Form */}
            <Formik
              initialValues={{ name: '', email: '', password: '', agreeTerms: false }}
              validationSchema={signupSchema}
              onSubmit={handleSignup}
            >
              {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
                <Form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Full Name Field */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                    <Typography
                      component="label"
                      htmlFor="name-desktop"
                      sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#111318' }}
                    >
                      Full Name
                    </Typography>
                    <TextField
                      id="name-desktop"
                      name="name"
                      type="text"
                      placeholder="Sarah Jenkins"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.name && !!errors.name}
                      helperText={touched.name && errors.name}
                      fullWidth
                      sx={getTextFieldStyles(touched.name && !!errors.name)}
                    />
                  </Box>

                  {/* Email Field */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                    <Typography
                      component="label"
                      htmlFor="email-desktop"
                      sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#111318' }}
                    >
                      Email Address
                    </Typography>
                    <TextField
                      id="email-desktop"
                      name="email"
                      type="email"
                      placeholder="name@company.com"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && !!errors.email}
                      helperText={touched.email && errors.email}
                      fullWidth
                      sx={getTextFieldStyles(touched.email && !!errors.email)}
                    />
                  </Box>

                  {/* Password Field */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                    <Typography
                      component="label"
                      htmlFor="password-desktop"
                      sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#111318' }}
                    >
                      Password
                    </Typography>
                    <TextField
                      id="password-desktop"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.password && !!errors.password}
                      helperText={touched.password && errors.password}
                      fullWidth
                      sx={getTextFieldStyles(touched.password && !!errors.password)}
                    />
                  </Box>

                  {/* Terms Checkbox */}
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <Checkbox
                        id="agreeTerms-desktop"
                        name="agreeTerms"
                        checked={values.agreeTerms}
                        onChange={(e) => setFieldValue('agreeTerms', e.target.checked)}
                        onBlur={handleBlur}
                        sx={{
                          color: touched.agreeTerms && errors.agreeTerms ? '#ef4444' : '#cbd5e1',
                          padding: '0',
                          marginRight: '8px',
                          '&.Mui-checked': { color: '#2a63ea' },
                        }}
                      />
                      <Typography sx={{ fontSize: '0.875rem', color: '#64748b' }}>
                        I agree to the{' '}
                        <Link href="/terms-of-service" style={{ fontWeight: 700, color: '#2a63ea', textDecoration: 'none' }}>
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy-policy" style={{ fontWeight: 700, color: '#2a63ea', textDecoration: 'none' }}>
                          Privacy Policy
                        </Link>
                      </Typography>
                    </Box>
                    {touched.agreeTerms && errors.agreeTerms && (
                      <FormHelperText sx={{ color: '#ef4444', marginLeft: '28px', marginTop: '4px', fontSize: '0.75rem' }}>
                        {errors.agreeTerms}
                      </FormHelperText>
                    )}
                  </Box>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    fullWidth
                    disabled={loading}
                    sx={{
                      mt: 1,
                      height: '48px',
                      borderRadius: '8px',
                      bgcolor: '#2a63ea',
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: 700,
                      textTransform: 'none',
                      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                      transition: 'all 0.2s',
                      '&:hover': { bgcolor: '#1d4ed8' },
                      '&:active': { transform: 'scale(0.98)' },
                      '&:disabled': { bgcolor: '#93c5fd', color: 'white' },
                    }}
                  >
                    {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Create Account'}
                  </Button>
                </Form>
              )}
            </Formik>

            {/* Footer */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, textAlign: 'center' }}>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#64748b' }}>
                Already have an account?{' '}
                <Link href="/login" style={{ fontWeight: 700, color: '#2a63ea', textDecoration: 'none' }}>
                  Log In
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Simple Footer Info */}
        <Box sx={{ py: 3, textAlign: 'center' }}>
          <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            © 2026 Apply For Me Inc. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
