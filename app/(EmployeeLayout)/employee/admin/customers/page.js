'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
  MenuItem,
  IconButton,
  Avatar,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Link from 'next/link';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';
import CustomerOnboardingDetail from '../../../../../components/employee/CustomerOnboardingDetail';

const getApiBase = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
  return url.endsWith('/api') ? url.slice(0, -4) : url;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [onboardingFilter, setOnboardingFilter] = useState('');
  const [journeyFilter, setJourneyFilter] = useState('');
  const [purchaseFilter, setPurchaseFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [fullProfile, setFullProfile] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        return;
      }
      const params = new URLSearchParams({
        page: String(page + 1),
        limit: String(rowsPerPage),
      });
      if (search.trim()) params.set('search', search.trim());
      if (onboardingFilter) params.set('onboarding', onboardingFilter);
      if (journeyFilter) params.set('journey', journeyFilter);
      if (purchaseFilter) params.set('purchase', purchaseFilter);

      const res = await fetch(`${getApiBase()}/api/employee/customers?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setCustomers(data.customers || []);
        setTotal(data.pagination?.total ?? 0);
      } else {
        setError(data.error || 'Failed to load customers');
      }
    } catch {
      setError('Failed to load customers');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, search, onboardingFilter, journeyFilter, purchaseFilter]);

  const journeyChipSx = (status) => {
    const map = {
      converted: { bgcolor: '#dcfce7', color: '#16a34a' },
      onboarded_unpaid: { bgcolor: '#fef3c7', color: '#b45309' },
      paid_incomplete_onboarding: { bgcolor: '#e0e7ff', color: '#4338ca' },
      incomplete: { bgcolor: '#fee2e2', color: '#dc2626' },
    };
    return map[status] || { bgcolor: '#f1f5f9', color: '#64748b' };
  };

  const formatTokenBalance = (c) => {
    if (c.planQuota?.limit != null) {
      const remaining = c.jobTokenBalance ?? c.planQuota.remaining ?? 0;
      return `${remaining} / ${c.planQuota.limit}`;
    }
    if (c.jobTokenBalance != null) return String(c.jobTokenBalance);
    return '—';
  };

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleViewDetails = async (customer) => {
    setSelectedCustomer(customer);
    setDetailOpen(true);
    setFullProfile(null);
    setRecentApplications([]);
    setDetailError('');
    setDetailLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${getApiBase()}/api/employee/customers/${customer.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.user) {
        setFullProfile(data.user);
        setRecentApplications(data.recentApplications || []);
      } else {
        setDetailError(data.error || 'Failed to load profile');
      }
    } catch {
      setDetailError('Failed to load profile');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedCustomer(null);
    setFullProfile(null);
    setDetailError('');
  };

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString('en-AU', { year: 'numeric', month: 'short', day: 'numeric' })
      : '—';

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a' }}>
          Customers
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={fetchCustomers}
          disabled={loading}
          sx={{ textTransform: 'none', color: '#64748b' }}
        >
          Refresh
        </Button>
      </Box>

      <Typography sx={{ color: '#64748b', fontSize: '0.875rem', mb: 3 }}>
        View every field customers submit during onboarding — personal details, documents, employment history, compliance, and consent. Track job activity, plan tokens, and who completed signup and purchase.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', mb: 2 }}>
        <Box sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap', bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <TextField
            size="small"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 260, bgcolor: 'white', '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
          <TextField
            select
            size="small"
            label="Onboarding"
            value={onboardingFilter}
            onChange={(e) => {
              setOnboardingFilter(e.target.value);
              setPage(0);
            }}
            sx={{ minWidth: 160, bgcolor: 'white', '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="complete">Complete</MenuItem>
            <MenuItem value="incomplete">Incomplete</MenuItem>
          </TextField>
          <TextField
            select
            size="small"
            label="Signup & purchase"
            value={journeyFilter}
            onChange={(e) => {
              setJourneyFilter(e.target.value);
              setPage(0);
            }}
            sx={{ minWidth: 200, bgcolor: 'white', '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          >
            <MenuItem value="">All journeys</MenuItem>
            <MenuItem value="converted">Onboarded & purchased</MenuItem>
            <MenuItem value="onboarded_unpaid">Onboarded, no purchase</MenuItem>
            <MenuItem value="incomplete">Signup incomplete</MenuItem>
            <MenuItem value="paid_incomplete_onboarding">Paid, onboarding incomplete</MenuItem>
          </TextField>
          <TextField
            select
            size="small"
            label="Payment"
            value={purchaseFilter}
            onChange={(e) => {
              setPurchaseFilter(e.target.value);
              setPage(0);
            }}
            sx={{ minWidth: 140, bgcolor: 'white', '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="paid">Purchased</MenuItem>
            <MenuItem value="unpaid">Not purchased</MenuItem>
          </TextField>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8fafc' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Plan</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Journey</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Onboarding</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">Jobs given by cx</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">Jobs applied</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">Jobs pending</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">Job token balance</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Joined</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} sx={{ textAlign: 'center', py: 6, color: '#64748b' }}>
                        No customers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    customers.map((c) => (
                      <TableRow key={c.id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: '#2463eb', fontSize: '0.8rem' }}>
                              {(c.fullName || c.name || 'U').charAt(0).toUpperCase()}
                            </Avatar>
                            <Link
                              href={`/employee/customers/${c.id}`}
                              style={{ color: '#2463eb', textDecoration: 'none', fontWeight: 500 }}
                            >
                              {c.fullName || c.name || '—'}
                            </Link>
                          </Box>
                        </TableCell>
                        <TableCell>{c.email}</TableCell>
                        <TableCell>
                          {c.subscription?.planName ? (
                            <Chip label={c.subscription.planName} size="small" sx={{ bgcolor: '#eff6ff', color: '#2463eb' }} />
                          ) : (
                            '—'
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={c.journeyLabel || '—'}
                            size="small"
                            sx={journeyChipSx(c.journeyStatus)}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={c.isOnboardingComplete ? 'Complete' : 'Incomplete'}
                            size="small"
                            sx={{
                              bgcolor: c.isOnboardingComplete ? '#dcfce7' : '#fee2e2',
                              color: c.isOnboardingComplete ? '#16a34a' : '#dc2626',
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">{c.jobsGivenByCustomer ?? 0}</TableCell>
                        <TableCell align="center">{c.jobsApplied ?? 0}</TableCell>
                        <TableCell align="center">{c.jobsPending ?? 0}</TableCell>
                        <TableCell align="center" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                          {formatTokenBalance(c)}
                        </TableCell>
                        <TableCell>{formatDate(c.createdAt)}</TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<VisibilityIcon />}
                            onClick={() => handleViewDetails(c)}
                            sx={{ textTransform: 'none', borderRadius: '8px' }}
                          >
                            Full profile
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={total}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[10, 25, 50]}
            />
          </>
        )}
      </Paper>

      <Dialog
        open={detailOpen}
        onClose={handleCloseDetail}
        maxWidth="md"
        fullWidth
        scroll="paper"
        PaperProps={{ sx: { borderRadius: '12px' } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {selectedCustomer?.fullName || selectedCustomer?.name || 'Customer'}
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>{selectedCustomer?.email}</Typography>
          </Box>
          <IconButton onClick={handleCloseDetail} aria-label="close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {detailLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          )}
          {detailError && <Alert severity="error">{detailError}</Alert>}
          {!detailLoading && !detailError && fullProfile && (
            <CustomerOnboardingDetail user={fullProfile} recentApplications={recentApplications} />
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDetail} sx={{ textTransform: 'none' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
