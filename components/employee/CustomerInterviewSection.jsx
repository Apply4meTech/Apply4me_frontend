'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import InterviewReport from '../dashboard/InterviewReport';

const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
  return url.endsWith('/api') ? url.slice(0, -4) : url;
};

const formatDate = (value) => {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return '—';
  }
};

export default function CustomerInterviewSection({ customerId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [quota, setQuota] = useState(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);

  useEffect(() => {
    if (customerId) fetchInterviews();
  }, [customerId]);

  const fetchInterviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${getApiUrl()}/api/employee/customers/${customerId}/interviews`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load interviews');
      setInterviews(data.data || []);
      setQuota(data.quota || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openReport = async (interviewId) => {
    setReportOpen(true);
    setReportLoading(true);
    setSelectedInterview(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${getApiUrl()}/api/employee/customers/${customerId}/interviews/${interviewId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load report');
      setSelectedInterview(data.data);
    } catch (err) {
      setError(err.message);
      setReportOpen(false);
    } finally {
      setReportLoading(false);
    }
  };

  const getStatusChip = (status) => {
    const map = {
      completed: { label: 'Completed', color: 'success' },
      in_progress: { label: 'In Progress', color: 'warning' },
      abandoned: { label: 'Abandoned', color: 'default' }
    };
    const cfg = map[status] || map.in_progress;
    return <Chip label={cfg.label} color={cfg.color} size="small" />;
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
          Interview Prep Reports
        </Typography>
        {quota?.eligible && (
          <Chip
            label={`Sessions used: ${quota.display}`}
            size="small"
            sx={{ bgcolor: '#eff6ff', color: '#2463eb', fontWeight: 600 }}
          />
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress size={28} />
        </Box>
      ) : interviews.length === 0 ? (
        <Typography sx={{ color: '#64748b', fontSize: '0.875rem' }}>
          No interview sessions yet.
        </Typography>
      ) : (
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '8px' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Score</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {interviews.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.jobRole || item.jobDescription?.slice(0, 40) || '—'}</TableCell>
                  <TableCell>{formatDate(item.createdAt)}</TableCell>
                  <TableCell>{getStatusChip(item.status)}</TableCell>
                  <TableCell>
                    {item.overallScore != null ? `${item.overallScore}/10` : '—'}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => openReport(item.id)}
                      disabled={item.status !== 'completed'}
                      sx={{ textTransform: 'none', color: '#2463eb' }}
                    >
                      View Report
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={reportOpen} onClose={() => setReportOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Interview Report
          <IconButton onClick={() => setReportOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {reportLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : selectedInterview ? (
            <InterviewReport interview={selectedInterview} />
          ) : null}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
