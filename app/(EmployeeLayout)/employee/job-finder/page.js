'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Card,
  CardContent,
  CardActions,
  Link as MuiLink,
  MenuItem,
  Pagination,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const getApiBase = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
  return url.endsWith('/api') ? url.slice(0, -4) : url;
};

const EXPERIENCE_OPTIONS = [
  { value: '', label: 'Any experience' },
  { value: '0', label: '0–2 years (Junior)' },
  { value: '3', label: '3–5 years (Mid)' },
  { value: '6', label: '6+ years (Senior)' },
];

export default function JobFinderPage() {
  const [filters, setFilters] = useState({
    jobTitle: '',
    skills: '',
    experience: '',
    location: '',
  });
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [provider, setProvider] = useState('');

  const fetchJobs = async (searchFilters, pageNum = 1) => {
    try {
      setLoading(true);
      setError('');
      setWarning('');
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const params = new URLSearchParams({
        page: String(pageNum),
        ...(searchFilters.jobTitle && { jobTitle: searchFilters.jobTitle }),
        ...(searchFilters.skills && { skills: searchFilters.skills }),
        ...(searchFilters.experience && { experience: searchFilters.experience }),
        ...(searchFilters.location && { location: searchFilters.location }),
      });

      const res = await fetch(`${getApiBase()}/api/employee/job-scraper/search?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Search failed');
      }

      setJobs(data.data?.jobs || []);
      setTotal(data.data?.pagination?.total || 0);
      setPage(pageNum);
      setProvider(data.data?.provider || '');
      setWarning(data.data?.warning || '');
      setAppliedFilters(searchFilters);
    } catch (err) {
      setError(err.message || 'Failed to search jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    if (!filters.jobTitle.trim() && !filters.skills.trim()) {
      setError('Enter a job title or skills to search');
      return;
    }
    fetchJobs(filters, 1);
  };

  const handlePageChange = (_, newPage) => {
    if (appliedFilters) fetchJobs(appliedFilters, newPage);
  };

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString('en-AU', { year: 'numeric', month: 'short', day: 'numeric' })
      : null;

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
        Job Finder
      </Typography>
      <Typography sx={{ color: '#64748b', fontSize: '0.875rem', mb: 3 }}>
        Search external job listings by title, skills, and experience. Results come from the configured job scraper API.
      </Typography>

      <Grid container spacing={3}>
        {/* Left: filters */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper
            component="form"
            onSubmit={handleSearch}
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              position: { md: 'sticky' },
              top: 88,
            }}
          >
            <Typography sx={{ fontWeight: 600, color: '#0f172a', mb: 2, fontSize: '0.95rem' }}>
              Search filters
            </Typography>

            <TextField
              fullWidth
              size="small"
              label="Job title"
              placeholder="e.g. Software Engineer"
              value={filters.jobTitle}
              onChange={(e) => setFilters((f) => ({ ...f, jobTitle: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              size="small"
              label="Skills"
              placeholder="e.g. React, Node.js, AWS"
              value={filters.skills}
              onChange={(e) => setFilters((f) => ({ ...f, skills: e.target.value }))}
              helperText="Comma-separated"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              select
              size="small"
              label="Experience"
              value={filters.experience}
              onChange={(e) => setFilters((f) => ({ ...f, experience: e.target.value }))}
              sx={{ mb: 2 }}
            >
              {EXPERIENCE_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              size="small"
              label="Location (optional)"
              placeholder="e.g. Sydney"
              value={filters.location}
              onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
              sx={{ mb: 2 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SearchIcon />}
              sx={{ textTransform: 'none', borderRadius: '8px', py: 1.25 }}
            >
              Search jobs
            </Button>

            {provider && (
              <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8', mt: 2, textAlign: 'center' }}>
                Source: {provider}
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Right: results */}
        <Grid item xs={12} md={8} lg={9}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          {warning && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {warning}
            </Alert>
          )}
          {appliedFilters && !loading && jobs.length > 0 && provider && (
            <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', mb: 2 }}>
              Results via {provider}
            </Typography>
          )}

          {!appliedFilters && !loading && (
            <Paper
              elevation={0}
              sx={{
                p: 6,
                textAlign: 'center',
                borderRadius: '12px',
                border: '1px dashed #cbd5e1',
                bgcolor: '#f8fafc',
              }}
            >
              <WorkOutlineIcon sx={{ fontSize: 48, color: '#94a3b8', mb: 2 }} />
              <Typography sx={{ color: '#64748b' }}>
                Use the filters on the left to find jobs matching your criteria.
              </Typography>
            </Paper>
          )}

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          )}

          {!loading && appliedFilters && jobs.length === 0 && (
            <Paper elevation={0} sx={{ p: 4, borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <Typography sx={{ color: '#64748b', textAlign: 'center' }}>No jobs found. Try different filters.</Typography>
            </Paper>
          )}

          {!loading && jobs.length > 0 && (
            <>
              <Typography sx={{ fontSize: '0.875rem', color: '#64748b', mb: 2 }}>
                {total > 0 ? `About ${total} results` : `${jobs.length} results`}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {jobs.map((job) => (
                  <Card
                    key={job.id}
                    elevation={0}
                    sx={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                  >
                    <CardContent sx={{ pb: 1 }}>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'flex-start', mb: 1 }}>
                        <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: '1rem', flex: 1 }}>
                          {job.title}
                        </Typography>
                        {job.isRemote && (
                          <Chip label="Remote" size="small" sx={{ bgcolor: '#eff6ff', color: '#2463eb' }} />
                        )}
                        {job.employmentType && (
                          <Chip label={job.employmentType} size="small" variant="outlined" />
                        )}
                      </Box>
                      <Typography sx={{ fontSize: '0.875rem', color: '#475569', mb: 0.5 }}>
                        {job.company}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                        <LocationOnOutlinedIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                        <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>{job.location}</Typography>
                      </Box>
                      {job.salary && (
                        <Typography sx={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 500, mb: 1 }}>
                          {job.salary}
                        </Typography>
                      )}
                      {job.description && (
                        <Typography
                          sx={{
                            fontSize: '0.8rem',
                            color: '#64748b',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {job.description.replace(/<[^>]+>/g, '').slice(0, 400)}
                        </Typography>
                      )}
                      {job.postedAt && (
                        <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8', mt: 1 }}>
                          Posted {formatDate(job.postedAt)}
                        </Typography>
                      )}
                    </CardContent>
                    {job.jobUrl && (
                      <>
                        <Divider />
                        <CardActions sx={{ px: 2, py: 1.5 }}>
                          <Button
                            size="small"
                            component={MuiLink}
                            href={job.jobUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            endIcon={<OpenInNewIcon />}
                            sx={{ textTransform: 'none' }}
                          >
                            View job
                          </Button>
                        </CardActions>
                      </>
                    )}
                  </Card>
                ))}
              </Box>
              {total > 10 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination
                    count={Math.ceil(total / 10)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
