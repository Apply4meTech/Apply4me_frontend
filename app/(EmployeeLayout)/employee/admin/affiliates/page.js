'use client';

import React, { useState, useEffect } from 'react';
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
  Button,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';

const getApiBase = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
  return url.endsWith('/api') ? url.slice(0, -4) : url;
};

export default function AffiliatesPage() {
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [markingId, setMarkingId] = useState(null);

  useEffect(() => {
    fetchAffiliates();
  }, []);

  const fetchAffiliates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        return;
      }
      const res = await fetch(`${getApiBase()}/api/employee/affiliates`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setAffiliates(data.data || []);
      else setError(data.error || 'Failed to load');
    } catch {
      setError('Failed to load affiliates');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPaid = async (id) => {
    try {
      setMarkingId(id);
      const token = localStorage.getItem('token');
      const res = await fetch(`${getApiBase()}/api/employee/affiliates/${id}/mark-paid`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) fetchAffiliates();
      else setError(data.error || 'Failed to mark as paid');
    } catch {
      setError('Failed to update');
    } finally {
      setMarkingId(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 3 }}>
        Affiliates
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}

      <Paper sx={{ borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Referral Code</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Total Clicks</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Successful Closures</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Total Commission</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {affiliates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} sx={{ textAlign: 'center', py: 6, color: '#64748b' }}>
                    No affiliates yet
                  </TableCell>
                </TableRow>
              ) : (
                affiliates.map((aff) => (
                  <TableRow key={aff.id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                    <TableCell>{aff.name}</TableCell>
                    <TableCell>{aff.email}</TableCell>
                    <TableCell sx={{ fontFamily: 'monospace' }}>{aff.referralCode}</TableCell>
                    <TableCell>{aff.totalClicks}</TableCell>
                    <TableCell>{aff.totalSuccessfulClosures}</TableCell>
                    <TableCell>${aff.totalCommission?.toFixed(2) ?? '0.00'}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        icon={aff.commissionStatus === 'Paid' ? <CheckCircleIcon /> : <PendingIcon />}
                        label={aff.commissionStatus}
                        sx={{
                          bgcolor: aff.commissionStatus === 'Paid' ? '#dcfce7' : '#fef3c7',
                          color: aff.commissionStatus === 'Paid' ? '#16a34a' : '#d97706',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {aff.unpaidAmount > 0 && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleMarkPaid(aff.id)}
                          disabled={markingId === aff.id}
                          sx={{ textTransform: 'none' }}
                        >
                          {markingId === aff.id ? '...' : 'Mark Paid'}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
