'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link as MuiLink,
  CircularProgress,
  Alert,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import YourAddonsSection from '../../../../components/dashboard/YourAddonsSection';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
const getApiUrl = () => {
  const url = API_URL;
  return url.endsWith('/api') ? url.slice(0, -4) : url;
};

export default function PlanPage() {
  const [supportDialogOpen, setSupportDialogOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [planData, setPlanData] = useState(null);
  const { token } = useSelector((state) => state.auth);

  // Fetch user's current plan
  useEffect(() => {
    const fetchMyPlan = async () => {
      if (!token) {
        setError('Please login to view your plan');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${getApiUrl()}/api/users/my-plan`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch plan information');
        }

        if (data.success) {
          setPlanData(data.data);
        } else {
          setError(data.error || 'Failed to load plan information');
        }
      } catch (err) {
        console.error('Error fetching plan:', err);
        setError(err.message || 'Failed to load plan information');
      } finally {
        setLoading(false);
      }
    };

    fetchMyPlan();
  }, [token]);

  const handleOpenSupportDialog = () => {
    setSupportDialogOpen(true);
  };

  const handleCloseSupportDialog = () => {
    setSupportDialogOpen(false);
    setQuery('');
  };

  const handleSubmitQuery = () => {
    // Static implementation - will be replaced with API call later
    console.log('Support query submitted:', query);
    alert('Your query has been submitted. We will get back to you soon!');
    handleCloseSupportDialog();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
            My Plan
          </Typography>
        </Box>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </Box>
    );
  }

  const purchasedAddons = planData?.purchasedAddons || [];
  const hasSubscriptionPlan = !!(planData?.plan && planData?.subscription?.planName);

  if (!hasSubscriptionPlan) {
    return (
      <Box>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
            My Plan
          </Typography>
          <Typography sx={{ color: '#64748b', fontSize: '1rem' }}>
            View your current subscription plan and benefits.
          </Typography>
        </Box>

        <YourAddonsSection purchasedAddons={purchasedAddons} />

        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            textAlign: 'center',
          }}
        >
          <Typography sx={{ color: '#64748b', mb: 3, fontSize: '1.125rem' }}>
            {purchasedAddons.length > 0
              ? 'You do not have an active subscription plan yet. Your add-ons above stay on your account — choose a plan to unlock full job application services.'
              : "You don't have an active plan yet."}
          </Typography>
          <Button
            component={Link}
            href="/pricing"
            variant="contained"
            sx={{
              bgcolor: '#2463eb',
              color: 'white',
              px: 4,
              py: 1.5,
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#1e40af',
              },
            }}
          >
            Browse Plans
          </Button>
        </Paper>
      </Box>
    );
  }

  const { plan, subscription, payment } = planData;
  const features = plan.features || [];
  const billingPeriodText = subscription.billingPeriod === 'monthly' ? 'mo' : 
                            subscription.billingPeriod === 'quarterly' ? 'quarter' :
                            subscription.billingPeriod === 'onetime' ? 'one-time' : '';

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
          My Plan
        </Typography>
        <Typography sx={{ color: '#64748b', fontSize: '1rem' }}>
          View your current subscription plan and benefits.
        </Typography>
      </Box>

      <YourAddonsSection purchasedAddons={purchasedAddons} />

      {subscription.status === 'expired' && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Your plan has expired. Please renew to continue using the service.
        </Alert>
      )}

      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* Plan Chosen Details */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            sx={{ 
              fontSize: '0.875rem', 
              color: '#64748b', 
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              mb: 1,
            }}
          >
            Plan Chosen
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography 
              sx={{ 
                fontSize: '3rem', 
                fontWeight: 700, 
                color: '#0f172a',
              }}
            >
              ${plan.price}
            </Typography>
            {billingPeriodText && (
              <Typography 
                sx={{ 
                  fontSize: '1.25rem', 
                  color: '#64748b',
                }}
              >
                /{billingPeriodText}
              </Typography>
            )}
          </Box>
          <Typography 
            sx={{ 
              fontSize: '1.5rem', 
              fontWeight: 600, 
              color: '#0f172a',
              mt: 1,
            }}
          >
            {plan.name} Plan
          </Typography>
          {plan.description && (
            <Typography sx={{ color: '#64748b', mt: 1, fontSize: '0.875rem' }}>
              {plan.description}
            </Typography>
          )}
          {subscription.startDate && (
            <Typography sx={{ color: '#64748b', mt: 2, fontSize: '0.875rem' }}>
              Started: {new Date(subscription.startDate).toLocaleDateString()}
            </Typography>
          )}
          {subscription.endDate && (
            <Typography sx={{ color: '#64748b', mt: 0.5, fontSize: '0.875rem' }}>
              {subscription.status === 'expired' ? 'Expired' : 'Expires'}: {new Date(subscription.endDate).toLocaleDateString()}
            </Typography>
          )}
        </Box>

        <Box sx={{ height: '1px', bgcolor: '#e2e8f0', my: 4 }} />

        {/* Plan Benefits */}
        {features.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography 
              sx={{ 
                fontSize: '1.25rem', 
                fontWeight: 700, 
                color: '#0f172a',
                mb: 3,
              }}
            >
              Plan Benefits
            </Typography>
            <List sx={{ p: 0 }}>
              {features.filter(f => f.included).map((feature, index) => (
                <ListItem 
                  key={index}
                  sx={{ 
                    px: 0,
                    py: 1.5,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CheckCircleIcon sx={{ color: '#2463eb', fontSize: '1.5rem' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={feature.text}
                    primaryTypographyProps={{
                      fontSize: '1rem',
                      color: '#0f172a',
                      fontWeight: 500,
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        <Box sx={{ height: '1px', bgcolor: '#e2e8f0', my: 4 }} />

        {/* Contact Support Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            onClick={handleOpenSupportDialog}
            sx={{
              bgcolor: '#2463eb',
              color: 'white',
              px: 4,
              py: 1.5,
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#1e40af',
              },
            }}
          >
            Contact Support
          </Button>
        </Box>

        {/* More Plans Link */}
        <Box>
          <MuiLink
            component={Link}
            href="/pricing"
            sx={{
              color: '#2463eb',
              fontSize: '1rem',
              fontWeight: 500,
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            More Plans →
          </MuiLink>
        </Box>
      </Paper>

      {/* Contact Support Dialog */}
      <Dialog
        open={supportDialogOpen}
        onClose={handleCloseSupportDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, color: '#0f172a', pb: 1 }}>
          Contact Support
        </DialogTitle>
        <DialogContent>
          <Typography 
            sx={{ 
              fontSize: '0.875rem', 
              color: '#64748b', 
              mb: 2,
            }}
          >
            Query
          </Typography>
          <TextField
            autoFocus
            multiline
            rows={6}
            fullWidth
            placeholder="Enter your query or question..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCloseSupportDialog}
            sx={{
              color: '#64748b',
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitQuery}
            variant="contained"
            disabled={!query.trim()}
            sx={{
              bgcolor: '#2463eb',
              color: 'white',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              '&:hover': {
                bgcolor: '#1e40af',
              },
              '&.Mui-disabled': {
                bgcolor: '#cbd5e1',
                color: '#94a3b8',
              },
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

