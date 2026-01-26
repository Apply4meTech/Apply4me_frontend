'use client';

import React, { useState } from 'react';
import { Box, Typography, TextField, Button, InputAdornment, IconButton, CircularProgress, Alert } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { setLoading, loginSuccess, loginFailure, clearError } from '../../../store/authSlice';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

const loginSchema = yup.object().shape({
  email: yup.string().email('Please enter a valid email address').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export default function EmployeeLoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error: authError } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (values) => {
    dispatch(clearError());
    dispatch(setLoading(true));
    try {
      const response = await fetch(`${API_URL}/auth/employee/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Login failed');
      }
      
      if (data.success && data.token) {
        dispatch(loginSuccess({ token: data.token, user: { ...data.user, isEmployee: true } }));
        router.push('/employee/dashboard');
      } else {
        throw new Error(data.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      dispatch(loginFailure(err.message));
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f8fafc', p: 2 }}>
      <Box sx={{ maxWidth: 440, width: '100%', bgcolor: 'white', p: 4, borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
            Employee Login
          </Typography>
          <Typography sx={{ color: '#64748b', fontSize: '1rem' }}>
            Enter your credentials to access your dashboard.
          </Typography>
        </Box>

        {authError && (
          <Alert severity="error" onClose={() => dispatch(clearError())} sx={{ borderRadius: '8px', mb: 2 }}>
            {authError}
          </Alert>
        )}
        
        <Formik initialValues={{ email: '', password: '' }} validationSchema={loginSchema} onSubmit={handleLogin}>
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <Form>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography component="label" htmlFor="email" sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#111318' }}>
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
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        height: '48px',
                        bgcolor: 'white',
                        '& fieldset': { borderColor: touched.email && errors.email ? '#ef4444' : '#e2e8f0' },
                        '&:hover fieldset': { borderColor: touched.email && errors.email ? '#ef4444' : '#2463eb' },
                        '&.Mui-focused fieldset': { borderColor: touched.email && errors.email ? '#ef4444' : '#2463eb', borderWidth: '1px' },
                      },
                      '& .MuiOutlinedInput-input': {
                        padding: '12px 16px',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      },
                      '& .MuiFormHelperText-root': { color: '#ef4444', marginLeft: 0, marginTop: '4px', fontSize: '0.75rem' },
                    }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography component="label" htmlFor="password" sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#111318' }}>
                    Password
                  </Typography>
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
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: '#616e89', '&:hover': { color: '#2463eb' } }}>
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        height: '48px',
                        bgcolor: 'white',
                        '& fieldset': { borderColor: touched.password && errors.password ? '#ef4444' : '#e2e8f0' },
                        '&:hover fieldset': { borderColor: touched.password && errors.password ? '#ef4444' : '#2463eb' },
                        '&.Mui-focused fieldset': { borderColor: touched.password && errors.password ? '#ef4444' : '#2463eb', borderWidth: '1px' },
                      },
                      '& .MuiOutlinedInput-input': {
                        padding: '12px 16px',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      },
                      '& .MuiFormHelperText-root': { color: '#ef4444', marginLeft: 0, marginTop: '4px', fontSize: '0.75rem' },
                    }}
                  />
                </Box>
                
                <Button 
                  type="submit" 
                  variant="contained" 
                  fullWidth 
                  disabled={loading}
                  sx={{ 
                    mt: 1,
                    py: 1.5, 
                    bgcolor: '#2463eb', 
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1rem',
                    borderRadius: '8px',
                    textTransform: 'none',
                    '&:hover': { bgcolor: '#1d4ed8' },
                    '&:disabled': { bgcolor: '#93c5fd', color: 'white' },
                  }}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Log In'}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
}

