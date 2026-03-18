'use client';

import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, Paper, Link } from '@mui/material';
import { useRouter } from 'next/navigation';

const getApiBase = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
  return url.endsWith('/api') ? url.slice(0, -4) : url;
};

export default function AffiliateLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${getApiBase()}/api/affiliate/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      if (data.token && data.affiliate) {
        localStorage.setItem('affiliateToken', data.token);
        localStorage.setItem('affiliate', JSON.stringify(data.affiliate));
        router.push('/affiliate/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Paper sx={{ p: 4, maxWidth: 400, width: '100%', borderRadius: '12px' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#0f172a' }}>
          Affiliate Login
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField fullWidth type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required sx={{ mb: 2 }} />
          <TextField fullWidth type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} required sx={{ mb: 3 }} />
          <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ py: 1.5, bgcolor: '#2463eb', '&:hover': { bgcolor: '#1d4ed8' } }}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <Typography sx={{ mt: 2, fontSize: '0.875rem', color: '#64748b', textAlign: 'center' }}>
          New affiliate?{' '}
          <Link href="/affiliate/register" sx={{ color: '#2463eb', fontWeight: 600 }}>Register</Link>
        </Typography>
      </Paper>
    </Box>
  );
}
