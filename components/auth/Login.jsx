'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, InputAdornment, IconButton, Link as MuiLink, useMediaQuery, useTheme, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { setLoading, loginSuccess, loginFailure, clearError } from '../../store/authSlice';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;


const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required'),
});


const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
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
    '&:hover fieldset': { borderColor: hasError ? '#ef4444' : '#2463eb' },
    '&.Mui-focused fieldset': { borderColor: hasError ? '#ef4444' : '#2463eb', borderWidth: '1px' },
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

export default function Login() {
  const theme = useTheme();
  const isMobileOrTablet = useMediaQuery('(max-width:900px)');
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error: authError } = useSelector((state) => state.auth);
  
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState(null);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);

  // Prevent body scroll on real mobile so the form stays fixed like in inspector
  useEffect(() => {
    if (!isMobileOrTablet) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isMobileOrTablet]);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleForgotPasswordOpen = () => {
    setForgotPasswordOpen(true);
    setForgotPasswordError(null);
    setForgotPasswordSuccess(false);
  };

  const handleForgotPasswordClose = () => {
    setForgotPasswordOpen(false);
    setForgotPasswordError(null);
    setForgotPasswordSuccess(false);
  };

  const handleForgotPassword = async (values) => {
    setForgotPasswordLoading(true);
    setForgotPasswordError(null);
    setForgotPasswordSuccess(false);
    
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: values.email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send password reset email. Please try again.');
      }
      
      if (data.success) {
        setForgotPasswordSuccess(true);
      } else {
        throw new Error(data.error || 'Failed to send password reset email. Please try again.');
      }
    } catch (err) {
      setForgotPasswordError(err.message);
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleLogin = async (values) => {
    dispatch(clearError());
    dispatch(setLoading(true));
    
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: values.email, password: values.password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }
      
      if (data.success && data.token) {
        dispatch(loginSuccess({ token: data.token, user: data.user }));
        // Check if onboarding is complete
        const isOnboardingComplete = data.user?.isOnboardingComplete ?? false;
        if (isOnboardingComplete) {
          router.push('/dashboard');
        } else {
          router.push('/onboarding');
        }
      } else {
        throw new Error(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      dispatch(loginFailure(err.message));
    }
  };

  // Mobile/Tablet View - Card with gradient background (fixed viewport so no page scroll on real mobile)
  const mobileView = isMobileOrTablet ? (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          minHeight: '100dvh', // real mobile: use dynamic viewport so no extra scroll (fallback: 100vh)
          bgcolor: '#1E293B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: { xs: 2, sm: 3 },
          fontFamily: '"Manrope", sans-serif',
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
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
            gap: 3,
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
              Log In
            </Typography>
            <Typography sx={{ color: '#64748b', fontSize: '1rem', mt: 0.5, fontFamily: '"Manrope", sans-serif' }}>
              Enter your credentials to access your dashboard.
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
            initialValues={{ email: '', password: '' }}
            validationSchema={loginSchema}
            onSubmit={handleLogin}
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
              <Form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                    placeholder="Enter your email"
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
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography
                      component="label"
                      htmlFor="password"
                      sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#111318', fontFamily: '"Manrope", sans-serif' }}
                    >
                      Password
                    </Typography>
                    <MuiLink
                      component="button"
                      type="button"
                      onClick={handleForgotPasswordOpen}
                      sx={{
                        color: '#2463eb',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        textDecoration: 'none',
                        fontFamily: '"Manrope", sans-serif',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        '&:hover': { color: '#1d4ed8' },
                      }}
                    >
                      Forgot Password?
                    </MuiLink>
                  </Box>
                  <TextField
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && !!errors.password}
                    helperText={touched.password && errors.password}
                    fullWidth
                    size="small"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleTogglePassword}
                            edge="end"
                            size="small"
                            sx={{ color: '#616e89', '&:hover': { color: '#2463eb' } }}
                          >
                            {showPassword ? <VisibilityOffIcon sx={{ fontSize: 20 }} /> : <VisibilityIcon sx={{ fontSize: 20 }} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={getTextFieldStyles(touched.password && !!errors.password, 'small')}
                  />
                </Box>

                {/* Submit Button */}
                <Button
                  type="submit"
                  fullWidth
                  disabled={loading}
                  sx={{
                    mt: 1,
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
                  {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Log In'}
                </Button>
              </Form>
            )}
          </Formik>

          {/* Footer */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontSize: '0.875rem', color: '#64748b' }}>
              Don&apos;t have an account?{' '}
              <Link href="/signup" style={{ color: '#2463eb', fontWeight: 700, textDecoration: 'none' }}>
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    ) : null;

  // Desktop View - Split screen layout
  const desktopView = !isMobileOrTablet ? (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        flexDirection: 'row',
        fontFamily: '"Manrope", sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Left Panel: Branding & Value Prop */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '41.666667%',
          bgcolor: '#1E293B',
          p: '48px',
          justifyContent: 'space-between',
          position: 'relative',
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

        {/* Logo Area */}
        <Box sx={{ position: 'relative', zIndex: 10 }}>
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
            }}
          >
            <LogoIcon color="white" size={30} />
            <Typography
              sx={{
                color: 'white',
                fontSize: '1.25rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
              }}
            >
              APPLY FOR ME
            </Typography>
          </Link>
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            maxWidth: '28rem',
          }}
        >
          <Typography
            component="h1"
            sx={{
              color: 'white',
              fontSize: { lg: '2.5rem', xl: '3rem' },
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: '-0.025em',
            }}
          >
            Welcome Back to APPLY FOR ME
          </Typography>
          <Typography
            sx={{
              color: '#cbd5e1',
              fontSize: '1.125rem',
              fontWeight: 500,
              lineHeight: 1.6,
            }}
          >
            Relax. Our human assistants are working on your next career move while you sleep.
          </Typography>

          {/* Testimonial / Social Proof Pill */}
          {/* <Box
            sx={{
              mt: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(12px)',
              p: 2,
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              width: 'fit-content',
            }}
          >
            <Box sx={{ display: 'flex' }}>
              <Box
                component="img"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXfQ3UIBomz_nNZSTs_RaKB-PvHoMirbdeO9vWSulltQJbItXxlods1SMQB58ttuQC0kMs0jusmRUie_UK4wXojMMWwDVMHm2rdvdszjcQM_BQRLJcD6m5RV5m6Qxo26Rk0ZK4vSOuaPe79wbYMpswhdnkcRhJIT6RwfhbeQeIfRNF9zgeBP2pIdtMLD4lhYu3Qb3djvffifRn6ay8xWfyB6J0TArh5YKTZbI3TvsPZ90fzUKXRiyCnauUTQ6tv4DeSdgUph_TlVI"
                alt="User avatar 1"
                sx={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid #1E293B', objectFit: 'cover' }}
              />
              <Box
                component="img"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4EyPi8Cp8vfUBQiix4J3tPIWin_MDL-DGeQM5xs-IwavRCjsSpZM85jHlNsahliauutIYc2ioZ2SLU03-7A3mRZ83wMbf4RvJwF9xxAv-7SzGPnFkiydn4kA1TlvsKUAr-xGhmg-L5xWMMNrvtKFWNoQoSmVNZLFZunK1DtuDOrEnZ8hs7VmMSL013tCe_Io2Y3Kvrv5_Wzont9IlK0GFocsQ51vLvPADD9gJ_GGhHEsWnwxdJ5dciBkm7HVAxEoL0Z5pXa8KoDc"
                alt="User avatar 2"
                sx={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid #1E293B', objectFit: 'cover', ml: '-12px' }}
              />
              <Box
                component="img"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuASVA_syhtQiSRiFL-2A2gCbJ58H2dkqpFbVcDrXu8pxqagmXFK5s2bp4IELRDUr362sLn3oC6_Vt2sCCH70TXHWr_7p7Td5LmXQWIvjErmeV8reP3SSaV2p-FmCtmb_pz5fK6JQdLSk3cpP9p79bSQQZyh0qDJG_0koHa4v6vzl7kj_o9dfjkJZtBROb-SLExvPIQE4EdhRTXg0X5WrkcjIW5rvaSwDoZ5TGN8wtcmT9I_VneZM4HLhcIfggQ1ET_3FnQrutlAde8"
                alt="User avatar 3"
                sx={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid #1E293B', objectFit: 'cover', ml: '-12px' }}
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ color: 'white', fontSize: '0.875rem', fontWeight: 700 }}>
                10k+ Careers Launched
              </Typography>
              <Typography sx={{ color: '#cbd5e1', fontSize: '0.75rem' }}>
                Join the top 1% of applicants
              </Typography>
            </Box>
          </Box> */}
        </Box>

        {/* Footer Copy */}
        <Box sx={{ position: 'relative', zIndex: 10 }}>
          <Typography sx={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            © 2026 Apply For Me
          </Typography>
        </Box>
      </Box>

      {/* Right Panel: Login Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: '96px',
          bgcolor: 'white',
          overflowY: 'auto',
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
              Log In
            </Typography>
            <Typography sx={{ color: '#64748b', fontSize: '1rem' }}>
              Enter your credentials to access your dashboard.
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
            initialValues={{ email: '', password: '' }}
            validationSchema={loginSchema}
            onSubmit={handleLogin}
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
              <Form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                    placeholder="Enter your email"
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
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography
                      component="label"
                      htmlFor="password-desktop"
                      sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#111318' }}
                    >
                      Password
                    </Typography>
                    <MuiLink
                      component="button"
                      type="button"
                      onClick={handleForgotPasswordOpen}
                      sx={{
                        color: '#2463eb',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        textDecoration: 'none',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        '&:hover': { color: '#1d4ed8' },
                      }}
                    >
                      Forgot Password?
                    </MuiLink>
                  </Box>
                  <TextField
                    id="password-desktop"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && !!errors.password}
                    helperText={touched.password && errors.password}
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleTogglePassword}
                            edge="end"
                            sx={{ color: '#616e89', '&:hover': { color: '#2463eb' } }}
                          >
                            {showPassword ? <VisibilityOffIcon sx={{ fontSize: 24 }} /> : <VisibilityIcon sx={{ fontSize: 24 }} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={getTextFieldStyles(touched.password && !!errors.password)}
                  />
                </Box>

                {/* Primary Button */}
                <Button
                  type="submit"
                  fullWidth
                  disabled={loading}
                  sx={{
                    mt: 1,
                    bgcolor: '#2463eb',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1rem',
                    height: '48px',
                    borderRadius: '8px',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    textTransform: 'none',
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: '#1d4ed8' },
                    '&:active': { transform: 'scale(0.98)' },
                    '&:disabled': { bgcolor: '#93c5fd', color: 'white' },
                  }}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Log In'}
                </Button>
              </Form>
            )}
          </Formik>

          {/* Footer Sign Up Link */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#64748b' }}>
              Don&apos;t have an account?{' '}
              <Link href="/signup" style={{ color: '#2463eb', fontWeight: 700, textDecoration: 'none' }}>
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
    ) : null;

  return (
    <>
      {mobileView}
      {desktopView}

      {/* Forgot Password Dialog */}
      <Dialog 
        open={forgotPasswordOpen} 
        onClose={handleForgotPasswordClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            fontFamily: '"Manrope", sans-serif',
          }
        }}
      >
        <DialogTitle sx={{ 
          fontSize: '1.5rem', 
          fontWeight: 700, 
          color: '#111318',
          fontFamily: '"Manrope", sans-serif',
          pb: 1
        }}>
          Forgot Password?
        </DialogTitle>
        <DialogContent>
          {forgotPasswordSuccess ? (
            <Box sx={{ py: 2 }}>
              <Alert severity="success" sx={{ borderRadius: '8px', mb: 2 }}>
                If an account with that email exists, a password reset link has been sent to your email.
              </Alert>
              <Typography sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                Please check your email and click on the reset link to create a new password.
              </Typography>
            </Box>
          ) : (
            <Formik
              initialValues={{ email: '' }}
              validationSchema={forgotPasswordSchema}
              onSubmit={handleForgotPassword}
            >
              {({ values, errors, touched, handleChange, handleBlur }) => (
                <Form style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '8px' }}>
                  <Typography sx={{ color: '#64748b', fontSize: '0.875rem', mb: 1 }}>
                    Enter your email address and we'll send you a link to reset your password.
                  </Typography>
                  
                  <TextField
                    id="forgot-email"
                    name="email"
                    type="email"
                    label="Email Address"
                    placeholder="Enter your email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                    fullWidth
                    sx={getTextFieldStyles(touched.email && !!errors.email)}
                  />

                  {forgotPasswordError && (
                    <Alert severity="error" sx={{ borderRadius: '8px' }}>
                      {forgotPasswordError}
                    </Alert>
                  )}

                  <DialogActions sx={{ px: 0, pt: 2 }}>
                    <Button
                      onClick={handleForgotPasswordClose}
                      sx={{
                        color: '#64748b',
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': { bgcolor: '#f1f5f9' },
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={forgotPasswordLoading}
                      sx={{
                        bgcolor: '#2463eb',
                        color: 'white',
                        fontWeight: 700,
                        textTransform: 'none',
                        borderRadius: '8px',
                        px: 3,
                        '&:hover': { bgcolor: '#1d4ed8' },
                        '&:disabled': { bgcolor: '#93c5fd', color: 'white' },
                      }}
                    >
                      {forgotPasswordLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Send Reset Link'}
                    </Button>
                  </DialogActions>
                </Form>
              )}
            </Formik>
          )}
        </DialogContent>
        {forgotPasswordSuccess && (
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={handleForgotPasswordClose}
              fullWidth
              sx={{
                bgcolor: '#2463eb',
                color: 'white',
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: '8px',
                '&:hover': { bgcolor: '#1d4ed8' },
              }}
            >
              Close
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
}
