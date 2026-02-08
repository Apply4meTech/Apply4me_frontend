'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, InputAdornment, IconButton, useMediaQuery, CircularProgress, Alert } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Formik, Form } from 'formik';
import * as yup from 'yup';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Validation schema
const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
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

export default function ResetPassword() {
  const isMobileOrTablet = useMediaQuery('(max-width:900px)');
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      setError('Invalid or missing reset token. Please request a new password reset.');
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleResetPassword = async (values) => {
    if (!token) {
      setError('Invalid or missing reset token. Please request a new password reset.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token: token,
          password: values.password 
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password. Please try again.');
      }
      
      if (data.success) {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        throw new Error(data.error || 'Failed to reset password. Please try again.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Mobile/Tablet View
  const mobileView = isMobileOrTablet ? (
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
            Reset Password
          </Typography>
          <Typography sx={{ color: '#64748b', fontSize: '1rem', mt: 0.5, fontFamily: '"Manrope", sans-serif' }}>
            Enter your new password below.
          </Typography>
        </Box>

        {/* Success Alert */}
        {success && (
          <Alert severity="success" sx={{ borderRadius: '8px' }}>
            Password reset successfully! Redirecting to login...
          </Alert>
        )}

        {/* Error Alert */}
        {error && !success && (
          <Alert severity="error" sx={{ borderRadius: '8px' }}>
            {error}
          </Alert>
        )}

        {/* Formik Form */}
        {!success && token && (
          <Formik
            initialValues={{ password: '', confirmPassword: '' }}
            validationSchema={resetPasswordSchema}
            onSubmit={handleResetPassword}
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
              <Form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Password Field */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography
                    component="label"
                    htmlFor="password"
                    sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#111318', fontFamily: '"Manrope", sans-serif' }}
                  >
                    New Password
                  </Typography>
                  <TextField
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your new password"
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

                {/* Confirm Password Field */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography
                    component="label"
                    htmlFor="confirmPassword"
                    sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#111318', fontFamily: '"Manrope", sans-serif' }}
                  >
                    Confirm Password
                  </Typography>
                  <TextField
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your new password"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.confirmPassword && !!errors.confirmPassword}
                    helperText={touched.confirmPassword && errors.confirmPassword}
                    fullWidth
                    size="small"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleToggleConfirmPassword}
                            edge="end"
                            size="small"
                            sx={{ color: '#616e89', '&:hover': { color: '#2463eb' } }}
                          >
                            {showConfirmPassword ? <VisibilityOffIcon sx={{ fontSize: 20 }} /> : <VisibilityIcon sx={{ fontSize: 20 }} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={getTextFieldStyles(touched.confirmPassword && !!errors.confirmPassword, 'small')}
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
                  {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Reset Password'}
                </Button>
              </Form>
            )}
          </Formik>
        )}

        {/* Footer */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontSize: '0.875rem', color: '#64748b' }}>
            Remember your password?{' '}
            <Link href="/login" style={{ color: '#2463eb', fontWeight: 700, textDecoration: 'none' }}>
              Log In
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  ) : null;

  // Desktop View
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
      {/* Left Panel: Branding */}
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
            Reset Your Password
          </Typography>
          <Typography
            sx={{
              color: '#cbd5e1',
              fontSize: '1.125rem',
              fontWeight: 500,
              lineHeight: 1.6,
            }}
          >
            Enter your new password to regain access to your account.
          </Typography>
        </Box>

        {/* Footer Copy */}
        <Box sx={{ position: 'relative', zIndex: 10 }}>
          <Typography sx={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            © 2026 Apply For Me 
          </Typography>
        </Box>
      </Box>

      {/* Right Panel: Reset Password Form */}
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
              Reset Password
            </Typography>
            <Typography sx={{ color: '#64748b', fontSize: '1rem' }}>
              Enter your new password below.
            </Typography>
          </Box>

          {/* Success Alert */}
          {success && (
            <Alert severity="success" sx={{ borderRadius: '8px' }}>
              Password reset successfully! Redirecting to login...
            </Alert>
          )}

          {/* Error Alert */}
          {error && !success && (
            <Alert severity="error" sx={{ borderRadius: '8px' }}>
              {error}
            </Alert>
          )}

          {/* Formik Form */}
          {!success && token && (
            <Formik
              initialValues={{ password: '', confirmPassword: '' }}
              validationSchema={resetPasswordSchema}
              onSubmit={handleResetPassword}
            >
              {({ values, errors, touched, handleChange, handleBlur }) => (
                <Form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Password Field */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                    <Typography
                      component="label"
                      htmlFor="password-desktop"
                      sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#111318' }}
                    >
                      New Password
                    </Typography>
                    <TextField
                      id="password-desktop"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your new password"
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

                  {/* Confirm Password Field */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                    <Typography
                      component="label"
                      htmlFor="confirmPassword-desktop"
                      sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#111318' }}
                    >
                      Confirm Password
                    </Typography>
                    <TextField
                      id="confirmPassword-desktop"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your new password"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.confirmPassword && !!errors.confirmPassword}
                      helperText={touched.confirmPassword && errors.confirmPassword}
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleToggleConfirmPassword}
                              edge="end"
                              sx={{ color: '#616e89', '&:hover': { color: '#2463eb' } }}
                            >
                              {showConfirmPassword ? <VisibilityOffIcon sx={{ fontSize: 24 }} /> : <VisibilityIcon sx={{ fontSize: 24 }} />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={getTextFieldStyles(touched.confirmPassword && !!errors.confirmPassword)}
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
                    {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Reset Password'}
                  </Button>
                </Form>
              )}
            </Formik>
          )}

          {/* Footer */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#64748b' }}>
              Remember your password?{' '}
              <Link href="/login" style={{ color: '#2463eb', fontWeight: 700, textDecoration: 'none' }}>
                Log In
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
    </>
  );
}

