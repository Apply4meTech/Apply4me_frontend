'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Avatar,
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CustomerOnboardingDetail from '../../../../../components/employee/CustomerOnboardingDetail';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
const getApiUrl = () => {
  const url = API_URL;
  return url.endsWith('/api') ? url.slice(0, -4) : url;
};

export default function CustomerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.userId;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);

  useEffect(() => {
    if (userId) {
      fetchCustomerProfile();
    }
  }, [userId]);

  const fetchCustomerProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
      const response = await fetch(`${getApiUrl()}/api/employee/customers/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch customer profile');
      }
      if (data.success && data.user) {
        setUser(data.user);
        setRecentApplications(data.recentApplications || []);
      } else {
        throw new Error('Invalid response');
      }
    } catch (err) {
      console.error('Error fetching customer profile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => router.push('/employee/dashboard');

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !user) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2, textTransform: 'none' }}>
          Back to Dashboard
        </Button>
        <Alert severity="error">{error || 'Customer not found'}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
        sx={{ mb: 3, textTransform: 'none', color: '#64748b', '&:hover': { color: '#2463eb', bgcolor: '#eff6ff' } }}
      >
        Back to Dashboard
      </Button>

      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4, pb: 3, borderBottom: '1px solid #e2e8f0' }}>
          <Avatar
            src={user.profilePicture?.url}
            sx={{ width: 72, height: 72, bgcolor: '#2463eb', fontSize: '1.5rem' }}
          >
            {(user.fullName || user.name || 'U').charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
              {user.fullName || user.name || 'Customer'}
            </Typography>
            <Typography sx={{ color: '#64748b', fontSize: '0.875rem' }}>
              Full onboarding profile (view only)
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
              {user.planQuota?.display && (
                <Chip
                  label={`Plan: ${user.planQuota.display}`}
                  size="small"
                  sx={{
                    bgcolor: user.planQuota.isAtLimit ? '#fee2e2' : '#f0fdf4',
                    color: user.planQuota.isAtLimit ? '#dc2626' : '#16a34a',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                />
              )}
              {user.subscription?.planName && (
                <Chip
                  label={user.subscription.planName}
                  size="small"
                  sx={{ bgcolor: '#eff6ff', color: '#2463eb', fontSize: '0.75rem' }}
                />
              )}
              <Chip
                label={user.isOnboardingComplete ? 'Onboarding complete' : 'Onboarding incomplete'}
                size="small"
                sx={{
                  bgcolor: user.isOnboardingComplete ? '#dcfce7' : '#fee2e2',
                  color: user.isOnboardingComplete ? '#16a34a' : '#dc2626',
                  fontSize: '0.75rem',
                }}
              />
            </Box>
          </Box>
        </Box>

        <CustomerOnboardingDetail user={user} recentApplications={recentApplications} />
      </Paper>
    </Box>
  );
}
