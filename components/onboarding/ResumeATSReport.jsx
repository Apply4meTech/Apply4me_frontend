'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  LinearProgress,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { updateUser } from '../../store/authSlice';
import stripeService from '../../utils/stripeService';
const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
  return url.endsWith('/api') ? url.slice(0, -4) : url;
};
const API_URL = getApiUrl();

const ATS_PLANS = ['Standard', 'Pro', 'Premium'];

const getScoreColor = (score) => {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
};

const getScoreLabel = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Needs Improvement';
};

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'high': return 'error';
    case 'medium': return 'warning';
    case 'low': return 'info';
    default: return 'default';
  }
};

export default function ResumeATSReport({ resumeUploaded, onOptimizeComplete }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [userPlan, setUserPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(true);
  const [addonProcessing, setAddonProcessing] = useState(false);

  const hasATSPlan = ATS_PLANS.includes(userPlan?.subscription?.planName);
  const hasResumeAddon = userPlan?.purchasedAddons?.some(a => a.name === 'resume_rewrite');
  const hasATSAccess = hasATSPlan || hasResumeAddon;

  useEffect(() => {
    const fetchPlan = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/api/users/my-plan`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success && data.data) {
          setUserPlan(data.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setPlanLoading(false);
      }
    };
    fetchPlan();
  }, [token]);

  useEffect(() => {
    if (resumeUploaded) {
      const timer = setTimeout(() => fetchATSReport(), 3000);
      return () => clearTimeout(timer);
    }
  }, [resumeUploaded]);

  const fetchATSReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${API_URL}/api/resume/report`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (response.ok && data.success) {
        const hasValidData = data.report && data.report.score != null;
        if (hasValidData) setReport(data.report);
        else if (data.canAnalyze) await triggerAnalysis();
        else throw new Error(data.error || 'Failed to fetch ATS report');
      } else if (response.status === 404 && data.canAnalyze) {
        await triggerAnalysis();
      } else {
        throw new Error(data.error || 'Failed to fetch ATS report');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const triggerAnalysis = async (force = false) => {
    try {
      setRefreshing(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const url = force ? `${API_URL}/api/resume/analyze?force=true` : `${API_URL}/api/resume/analyze`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setReport(data.report);
        setError(null);
      } else throw new Error(data.error || 'Failed to analyze resume');
    } catch (err) {
      setError(err.message);
    } finally {
      setRefreshing(false);
    }
  };

  const handleOptimize = async () => {
    try {
      setOptimizing(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${API_URL}/api/resume/optimize`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (response.ok && data.success) {
        await fetchATSReport();
        if (onOptimizeComplete) onOptimizeComplete(data);
      } else throw new Error(data.error || 'Failed to optimize resume');
    } catch (err) {
      setError(err.message);
    } finally {
      setOptimizing(false);
    }
  };

  const handleDownloadOptimized = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${API_URL}/api/resume/optimized/download`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (response.ok && data.success) window.open(data.downloadUrl, '_blank');
      else throw new Error(data.error || 'Failed to get download URL');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddonPurchase = async () => {
    if (!token) return;
    setAddonProcessing(true);
    try {
      const orderData = {
        amount: 39,
        customerInfo: { name: user?.name || 'User', email: user?.email },
        planName: 'ATS_ADDON',
        billingPeriod: 'onetime',
        isAddon: true,
      };
      const result = await stripeService.createPaymentIntent(orderData, token);
      if (!result.success) throw new Error(result.message || 'Failed to create payment');
      const paymentIntentId = result.data?.payment_intent_id || result.data?.id;
      const clientSecret = result.client_secret || result.data?.client_secret;
      if (!paymentIntentId || !clientSecret) throw new Error('Payment initialization failed');
      router.push(`/payment/checkout?payment_intent=${paymentIntentId}&client_secret=${encodeURIComponent(clientSecret)}&return_to=onboarding`);
    } catch (err) {
      alert(err.message || 'Failed to start payment');
    } finally {
      setAddonProcessing(false);
    }
  };

  const handleDevFakeAddon = async () => {
    if (!token) return;
    setAddonProcessing(true);
    try {
      const res = await fetch(`${API_URL}/api/payments/stripe/dev-fake-payment`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ planName: 'ATS_ADDON', isAddon: true }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Dev fake add-on failed');
      const newAddons = [...(userPlan?.purchasedAddons || []), { name: 'resume_rewrite', purchasedAt: new Date() }];
      dispatch(updateUser({ purchasedAddons: newAddons }));
      setUserPlan(prev => ({ ...prev, purchasedAddons: newAddons }));
      setDetailsOpen(false);
    } catch (err) {
      alert(err.message || 'Failed');
    } finally {
      setAddonProcessing(false);
    }
  };

  const isDevFakeEnabled = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_ENABLE_DEV_FAKE_PAYMENT === 'true';

  if (loading && !report) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2, color: '#64748b' }}>Analyzing your resume for ATS compatibility...</Typography>
      </Box>
    );
  }

  if (error && !report) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
        <Button size="small" onClick={triggerAnalysis} sx={{ mt: 1 }} disabled={refreshing}>
          {refreshing ? <CircularProgress size={16} /> : 'Try Again'}
        </Button>
      </Alert>
    );
  }

  if (!report) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography sx={{ color: '#64748b', mb: 2 }}>No ATS analysis available. Click below to analyze.</Typography>
        <Button variant="contained" onClick={triggerAnalysis} disabled={refreshing} startIcon={refreshing ? <CircularProgress size={16} /> : <RefreshIcon />}>
          Analyze Resume
        </Button>
      </Box>
    );
  }

  const { score, summary, recommendations = [], strengths = [], weaknesses = [], optimizedResumeDetails, optimizationScore } = report;

  return (
    <Box sx={{ mt: 3 }}>
      {/* Compact ATS Score Card */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          bgcolor: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: getScoreColor(score),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: '1.25rem',
            }}
          >
            {score}
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.875rem', color: '#64748b' }}>ATS Score</Typography>
            <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>{getScoreLabel(score)}</Typography>
          </Box>
        </Box>
        <Button
          variant="outlined"
          size="small"
          startIcon={<VisibilityIcon />}
          onClick={() => setDetailsOpen(true)}
          sx={{ textTransform: 'none', borderRadius: '8px' }}
        >
          View full details
        </Button>
      </Box>

      {/* Full Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.25rem' }}>ATS Resume Report</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  bgcolor: getScoreColor(score),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '1.5rem',
                }}
              >
                {score}
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: '1.125rem' }}>{getScoreLabel(score)}</Typography>
                <Typography sx={{ fontSize: '0.875rem', color: '#64748b' }}>{summary || 'ATS analysis completed'}</Typography>
              </Box>
            </Box>
            <LinearProgress variant="determinate" value={score} sx={{ height: 8, borderRadius: 4, bgcolor: '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: getScoreColor(score), borderRadius: 4 } }} />
          </Box>

          {hasATSAccess ? (
            <>
              {optimizationScore && optimizedResumeDetails && (
                <Box sx={{ mb: 3, p: 2, bgcolor: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CheckCircleIcon sx={{ color: '#10b981' }} />
                    <Typography sx={{ fontWeight: 600 }}>Optimized Score: {optimizationScore}</Typography>
                    <Chip label={`+${optimizationScore - score}`} size="small" sx={{ bgcolor: '#10b981', color: 'white' }} />
                  </Box>
                  <Button variant="contained" size="small" startIcon={<DownloadIcon />} onClick={handleDownloadOptimized} sx={{ mt: 1, bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}>
                    Download Optimized Resume
                  </Button>
                </Box>
              )}

              {!optimizationScore && (
                <Box sx={{ mb: 3, p: 2, border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                      <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Create ATS-Friendly Resume</Typography>
                      <Typography sx={{ fontSize: '0.875rem', color: '#64748b' }}>AI will optimize your resume for better ATS compatibility</Typography>
                    </Box>
                    <Button variant="contained" onClick={handleOptimize} disabled={optimizing} startIcon={optimizing ? <CircularProgress size={16} /> : <AutoFixHighIcon />} sx={{ bgcolor: '#2463eb', '&:hover': { bgcolor: '#1d4ed8' } }}>
                      {optimizing ? 'Optimizing...' : 'Optimize Resume'}
                    </Button>
                  </Box>
                </Box>
              )}

              {strengths.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CheckCircleIcon sx={{ color: '#10b981', fontSize: 20 }} /> Strengths
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {strengths.map((s, i) => (
                      <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                        <CheckCircleIcon sx={{ color: '#10b981', fontSize: 18, mt: 0.3 }} />
                        <Typography sx={{ fontSize: '0.875rem' }}>{s}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {recommendations.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <WarningIcon sx={{ color: '#f59e0b', fontSize: 20 }} /> Recommendations
                  </Typography>
                  {recommendations.slice(0, 5).map((rec, i) => (
                    <Accordion key={i} sx={{ boxShadow: 'none', border: '1px solid #e2e8f0', borderRadius: '8px', mb: 0.5 }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Chip label={rec.severity} size="small" color={getSeverityColor(rec.severity)} sx={{ mr: 1 }} />
                        <Typography sx={{ fontSize: '0.875rem' }}>{rec.issue}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography sx={{ fontSize: '0.8125rem', color: '#64748b' }}><strong>Suggestion:</strong> {rec.suggestion}</Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              )}

              {weaknesses.length > 0 && (
                <Box>
                  <Typography sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ErrorIcon sx={{ color: '#ef4444', fontSize: 20 }} /> Areas for Improvement
                  </Typography>
                  {weaknesses.slice(0, 3).map((w, i) => (
                    <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', mb: 0.5 }}>
                      <ErrorIcon sx={{ color: '#ef4444', fontSize: 18, mt: 0.3 }} />
                      <Typography sx={{ fontSize: '0.875rem' }}>{w}</Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <TrendingUpIcon sx={{ fontSize: 48, color: '#2463eb', mb: 2 }} />
              <Typography sx={{ fontWeight: 600, fontSize: '1.125rem', mb: 1 }}>Unlock ATS Resume Optimization</Typography>
              <Typography sx={{ color: '#64748b', mb: 2, maxWidth: 400, mx: 'auto' }}>
                Get detailed recommendations and create an ATS-optimized resume. Add the Custom Resume Rewrite add-on or upgrade your plan.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                <Button variant="contained" onClick={handleAddonPurchase} disabled={addonProcessing} sx={{ bgcolor: '#2463eb', px: 3 }}>
                  {addonProcessing ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Add ATS Resume Rewrite — $39 AUD'}
                </Button>
                <Button variant="outlined" onClick={() => { setDetailsOpen(false); router.push('/pricing'); }} sx={{ textTransform: 'none' }}>
                  Upgrade Plan (Standard, Pro, Premium)
                </Button>
                {isDevFakeEnabled && (
                  <Button variant="text" size="small" onClick={handleDevFakeAddon} disabled={addonProcessing} sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                    Test Add-on (Dev)
                  </Button>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <Button size="small" onClick={() => triggerAnalysis(true)} disabled={refreshing} startIcon={refreshing ? <CircularProgress size={14} /> : <RefreshIcon />} sx={{ mt: 1, color: '#64748b', fontSize: '0.75rem' }}>
        {refreshing ? 'Re-analyzing...' : 'Re-analyze'}
      </Button>

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
}
