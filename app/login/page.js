'use client';

import { Suspense } from 'react';
import Login from '../../components/auth/Login';
import { Box, CircularProgress } from '@mui/material';

function LoginFallback() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <CircularProgress />
    </Box>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <Login />
    </Suspense>
  );
}
