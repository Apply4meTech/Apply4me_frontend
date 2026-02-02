'use client';

import { Suspense } from 'react';
import ResetPassword from '../../components/auth/ResetPassword';

function ResetPasswordFallback() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f8fafc' }}>
      <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Loading…</span>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPassword />
    </Suspense>
  );
}

