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
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  CircularProgress,
  Alert,
  Link as MuiLink,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WorkIcon from '@mui/icons-material/Work';
import DescriptionIcon from '@mui/icons-material/Description';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
const getApiUrl = () => {
  const url = API_URL;
  return url.endsWith('/api') ? url.slice(0, -4) : url;
};

export default function ApplicationsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({
    status: 'all',
    platform: 'all',
    search: ''
  });
  const [stats, setStats] = useState({
    statusCounts: {},
    platforms: []
  });

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [filters, pagination.page]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${getApiUrl()}/api/applications/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.platform !== 'all' && { platform: filters.platform }),
        ...(filters.search && { search: filters.search })
      });

      const response = await fetch(`${getApiUrl()}/api/applications?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch applications');
      }

      if (data.success) {
        setApplications(data.data.applications);
        setPagination(data.data.pagination);
      } else {
        throw new Error(data.error || 'Failed to fetch applications');
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 on filter change
  };

  const handlePageChange = (event, value) => {
    setPagination(prev => ({ ...prev, page: value }));
  };

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

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
          Applications
        </Typography>
        <Typography sx={{ color: '#64748b', fontSize: '1rem' }}>
          View and manage your job applications.
        </Typography>
      </Box>

      {/* Filters */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <TextField
            fullWidth
            placeholder="Search by job title, company, or location..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#64748b' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />
          <FormControl sx={{ minWidth: { xs: '100%', md: 200 } }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => handleFilterChange('status', e.target.value)}
              sx={{ borderRadius: '8px' }}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="assigned">Assigned</MenuItem>
              <MenuItem value="applied">Applied</MenuItem>
              <MenuItem value="response">Response</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: { xs: '100%', md: 200 } }}>
            <InputLabel>Platform</InputLabel>
            <Select
              value={filters.platform}
              label="Platform"
              onChange={(e) => handleFilterChange('platform', e.target.value)}
              sx={{ borderRadius: '8px' }}
            >
              <MenuItem value="all">All Platforms</MenuItem>
              {stats.platforms.map((platform) => (
                <MenuItem key={platform} value={platform}>
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Applications Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8fafc' }}>
                    <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>
                      Job Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>
                      Company
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>
                      Location
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>
                      Link
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>
                      Uploaded Files
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>
                      Source
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>
                      Date
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} sx={{ textAlign: 'center', py: 6 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                          <WorkIcon sx={{ fontSize: '3rem', color: '#cbd5e1' }} />
                          <Typography sx={{ color: '#64748b', fontSize: '1rem' }}>
                            No applications found
                          </Typography>
                          <Typography sx={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                            {filters.search || filters.status !== 'all' || filters.platform !== 'all'
                              ? 'Try adjusting your filters'
                              : 'Your job applications will appear here'}
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
                          <TableCell sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                            {application.company}
                          </TableCell>
                          <TableCell sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                            {application.location || 'N/A'}
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
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                              {application.files?.resume && (
                                <Tooltip 
                                  title={
                                    application.files.resume.type === 'optimized' 
                                      ? `ATS Optimized Resume: ${application.files.resume.fileName}` 
                                      : application.files.resume.type === 'original'
                                      ? `Original Resume: ${application.files.resume.fileName}`
                                      : `Resume: ${application.files.resume.fileName}`
                                  } 
                                  arrow
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <IconButton
                                      size="small"
                                      onClick={() => window.open(application.files.resume.url, '_blank')}
                                      sx={{
                                        color: application.files.resume.type === 'optimized' ? '#16a34a' : '#2463eb',
                                        '&:hover': { 
                                          bgcolor: application.files.resume.type === 'optimized' ? '#dcfce7' : '#eff6ff' 
                                        },
                                      }}
                                    >
                                      <DescriptionIcon fontSize="small" />
                                    </IconButton>
                                    {application.files.resume.type === 'optimized' && (
                                      <Chip 
                                        label="ATS" 
                                        size="small" 
                                        sx={{ 
                                          height: 18, 
                                          fontSize: '0.6rem',
                                          bgcolor: '#16a34a',
                                          color: 'white',
                                          fontWeight: 600,
                                          '& .MuiChip-label': {
                                            px: 0.75
                                          }
                                        }} 
                                      />
                                    )}
                                  </Box>
                                </Tooltip>
                              )}
                              {application.files?.coverLetter && (
                                <Tooltip title={`Cover Letter: ${application.files.coverLetter.fileName}`} arrow>
                                  <IconButton
                                    size="small"
                                    onClick={() => window.open(application.files.coverLetter.url, '_blank')}
                                    sx={{
                                      color: '#16a34a',
                                      '&:hover': { bgcolor: '#dcfce7' },
                                    }}
                                  >
                                    <PictureAsPdfIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                              {application.files?.screenshotProof && (
                                <Tooltip title={`Screenshot Proof: ${application.files.screenshotProof.fileName}`} arrow>
                                  <IconButton
                                    size="small"
                                    onClick={() => window.open(application.files.screenshotProof.url, '_blank')}
                                    sx={{
                                      color: '#f59e0b',
                                      '&:hover': { bgcolor: '#fef3c7' },
                                    }}
                                  >
                                    <ImageIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                              {(!application.files?.resume && !application.files?.coverLetter && !application.files?.screenshotProof) && (
                                <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem', fontStyle: 'italic' }}>
                                  No files
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                            {application.source}
                          </TableCell>
                          <TableCell sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                            {new Date(application.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <Pagination
                  count={pagination.totalPages}
                  page={pagination.page}
                  onChange={handlePageChange}
                  color="primary"
                  shape="rounded"
                />
              </Box>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
}

