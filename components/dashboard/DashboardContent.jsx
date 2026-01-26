'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link as MuiLink,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useSelector } from 'react-redux';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
const getApiUrl = () => {
  const url = API_URL;
  return url.endsWith('/api') ? url.slice(0, -4) : url;
};

export default function DashboardContent() {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalJobsApplied: 0,
    accountManagerName: 'Not Assigned',
    applications: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required');
        }

        const response = await fetch(`${getApiUrl()}/api/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch dashboard data');
        }

        if (data.success) {
          setDashboardData(data.data);
        } else {
          throw new Error(data.error || 'Failed to fetch dashboard data');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status) => {
    const statusMap = {
      'applied': { bg: '#eff6ff', color: '#2463eb' },
      'response': { bg: '#dcfce7', color: '#16a34a' },
      'interview': { bg: '#dcfce7', color: '#16a34a' },
      'rejected': { bg: '#fee2e2', color: '#dc2626' },
      'pending': { bg: '#fef3c7', color: '#d97706' },
      'assigned': { bg: '#f3e8ff', color: '#9333ea' }
    };
    return statusMap[status] || { bg: '#f1f5f9', color: '#64748b' };
  };

  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
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
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  const { totalJobsApplied, accountManagerName, applications } = dashboardData;

  return (
    <Box>
      {/* Top Section with Greeting and Summary Boxes */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 3 }}>
        {/* Left Side - Greeting and Summary Boxes */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 3 }}>
            Hi {user?.name || 'User'}
          </Typography>
          
          <Grid container spacing={2}>
            {/* Total Jobs Applied Box */}
            <Grid item xs={12} sm={6} md={5}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  bgcolor: 'white',
                }}
              >
                <Typography sx={{ fontSize: '0.875rem', color: '#64748b', mb: 1 }}>
                  Total Jobs Applied
                </Typography>
                <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a' }}>
                  {totalJobsApplied}
                </Typography>
              </Paper>
            </Grid>

            {/* Account Manager Box */}
            <Grid item xs={12} sm={6} md={5}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  bgcolor: 'white',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <PersonIcon sx={{ color: '#64748b', fontSize: '1.25rem' }} />
                  <Typography sx={{ fontSize: '0.875rem', color: '#64748b' }}>
                    Account Manager
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a' }}>
                  {accountManagerName}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Job Applications Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>
                  Job name
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>
                  Link
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>
                  Date
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>
                  Source
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.length === 0 ? (
                // Empty state
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <WorkIcon sx={{ fontSize: '3rem', color: '#cbd5e1' }} />
                      <Typography sx={{ color: '#64748b', fontSize: '1rem' }}>
                        No job applications yet
                      </Typography>
                      <Typography sx={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                        Your job applications will appear here
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((application) => {
                  const statusColors = getStatusColor(application.status);
                  return (
                    <TableRow key={application.id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                      <TableCell sx={{ color: '#0f172a', fontSize: '0.875rem' }}>
                        {application.jobName}
                      </TableCell>
                      <TableCell>
                        <MuiLink
                          href={application.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: '#2463eb',
                            fontSize: '0.875rem',
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' },
                          }}
                        >
                          View Job
                        </MuiLink>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={formatStatus(application.status)}
                          size="small"
                          sx={{
                            bgcolor: statusColors.bg,
                            color: statusColors.color,
                            fontWeight: 500,
                            fontSize: '0.75rem',
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                        {new Date(application.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </TableCell>
                      <TableCell sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                        {application.source}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
