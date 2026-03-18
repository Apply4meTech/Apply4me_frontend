'use client';

import { Suspense } from 'react';
import Signup from '../../components/auth/Signup';
import { Box, CircularProgress } from '@mui/material';

export default function SignupPage() {
  return (
    <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><CircularProgress /></Box>}>
      <Signup />
    </Suspense>
  );
}
