'use client';

import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, Paper, Link } from '@mui/material';
import { useRouter } from 'next/navigation';

const getApiBase = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
  return url.endsWith('/api') ? url.slice(0, -4) : url;
};

export default function AffiliateRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${getApiBase()}/api/affiliate/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
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

  //testing comments

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Paper sx={{ p: 4, maxWidth: 400, width: '100%', borderRadius: '12px' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#0f172a' }}>
          Affiliate Registration
        </Typography>
        <Typography sx={{ color: '#64748b', mb: 3, fontSize: '0.875rem' }}>
          Register as an HR influencer to earn commission on referrals.
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Name" value={name} onChange={(e) => setName(e.target.value)} required sx={{ mb: 2 }} />
          <TextField fullWidth type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required sx={{ mb: 2 }} />
          <TextField fullWidth type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} sx={{ mb: 3 }} />
          <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ py: 1.5, bgcolor: '#2463eb', '&:hover': { bgcolor: '#1d4ed8' } }}>
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>
        <Typography sx={{ mt: 2, fontSize: '0.875rem', color: '#64748b', textAlign: 'center' }}>
          Already have an account?{' '}
          <Link href="/affiliate/login" sx={{ color: '#2463eb', fontWeight: 600 }}>Login</Link>
        </Typography>
      </Paper>
    </Box>
  );
}
