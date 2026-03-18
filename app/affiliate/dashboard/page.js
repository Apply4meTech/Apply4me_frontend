'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Button, CircularProgress, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LogoutIcon from '@mui/icons-material/Logout';
import MouseIcon from '@mui/icons-material/Mouse';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const getApiBase = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
  return url.endsWith('/api') ? url.slice(0, -4) : url;
};

export default function AffiliateDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('affiliateToken');
    if (!token) {
      router.replace('/affiliate/login');
      return;
    }
    fetch(`${getApiBase()}/api/affiliate/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((d) => {
        if (d.success) setData(d.data);
        else setError(d.error || 'Failed to load');
      })
      .catch(() => setError('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('affiliateToken');
    localStorage.removeItem('affiliate');
    router.replace('/affiliate/login');
  };

  const handleCopyLink = () => {
    if (data?.referralLink) {
      navigator.clipboard.writeText(data.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', p: { xs: 2, md: 4 } }}>
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a' }}>
            Affiliate Dashboard
          </Typography>
          <Button startIcon={<LogoutIcon />} onClick={handleLogout} sx={{ color: '#64748b' }}>
            Logout
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Paper sx={{ p: 3, mb: 3, borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <Typography sx={{ fontSize: '0.875rem', color: '#64748b', mb: 1 }}>Your Referral Link</Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography sx={{ flex: 1, fontSize: '0.875rem', wordBreak: 'break-all', fontFamily: 'monospace' }}>
              {data?.referralLink || '—'}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              startIcon={<ContentCopyIcon />}
              onClick={handleCopyLink}
              sx={{ flexShrink: 0 }}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </Box>
        </Paper>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 3, borderRadius: '12px', border: '1px solid #e2e8f0', height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <MouseIcon sx={{ color: '#2463eb' }} />
                <Typography sx={{ fontSize: '0.875rem', color: '#64748b' }}>Total Clicks</Typography>
              </Box>
              <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a' }}>
                {data?.totalClicks ?? 0}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 3, borderRadius: '12px', border: '1px solid #e2e8f0', height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CheckCircleIcon sx={{ color: '#16a34a' }} />
                <Typography sx={{ fontSize: '0.875rem', color: '#64748b' }}>Successful Closures</Typography>
              </Box>
              <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a' }}>
                {data?.totalSuccessfulClosures ?? 0}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 3, borderRadius: '12px', border: '1px solid #e2e8f0', height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <AttachMoneyIcon sx={{ color: '#f59e0b' }} />
                <Typography sx={{ fontSize: '0.875rem', color: '#64748b' }}>Total Commission</Typography>
              </Box>
              <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a' }}>
                ${(data?.totalCommission ?? 0).toFixed(2)}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#64748b', mt: 0.5 }}>
                Unpaid: ${(data?.unpaidCommission ?? 0).toFixed(2)}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
