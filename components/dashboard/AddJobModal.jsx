'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Tabs,
  Tab,
  Typography,
  Alert,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LinkIcon from '@mui/icons-material/Link';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
const getApiUrl = () => {
  const url = API_URL;
  return url.endsWith('/api') ? url.slice(0, -4) : url;
};

// Platform options
const PLATFORM_OPTIONS = [
  { value: 'custom', label: 'Custom / Manual Entry' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'indeed', label: 'Indeed' },
  { value: 'glassdoor', label: 'Glassdoor' },
  { value: 'monster', label: 'Monster' },
  { value: 'ziprecruiter', label: 'ZipRecruiter' },
  { value: 'careerbuilder', label: 'CareerBuilder' },
  { value: 'dice', label: 'Dice' },
  { value: 'stackoverflow', label: 'Stack Overflow' },
  { value: 'github', label: 'GitHub Jobs' },
  { value: 'wellfound', label: 'Wellfound (AngelList)' },
  { value: 'remote.co', label: 'Remote.co' },
  { value: 'weworkremotely', label: 'We Work Remotely' },
  { value: 'company_website', label: 'Company Website' },
];

// Utility function to detect platform from URL (client-side)
function detectPlatformFromUrl(url) {
  if (!url || typeof url !== 'string') {
    return 'custom';
  }

  const urlLower = url.toLowerCase();

  if (urlLower.includes('linkedin.com/jobs') || urlLower.includes('linkedin.com/job')) {
    return 'linkedin';
  }
  if (urlLower.includes('indeed.com') || urlLower.includes('indeed.co')) {
    return 'indeed';
  }
  if (urlLower.includes('glassdoor.com')) {
    return 'glassdoor';
  }
  if (urlLower.includes('monster.com')) {
    return 'monster';
  }
  if (urlLower.includes('ziprecruiter.com')) {
    return 'ziprecruiter';
  }
  if (urlLower.includes('careerbuilder.com')) {
    return 'careerbuilder';
  }
  if (urlLower.includes('dice.com')) {
    return 'dice';
  }
  if (urlLower.includes('stackoverflow.com/jobs')) {
    return 'stackoverflow';
  }
  if (urlLower.includes('jobs.github.com')) {
    return 'github';
  }
  if (urlLower.includes('angel.co') || urlLower.includes('wellfound.com')) {
    return 'wellfound';
  }
  if (urlLower.includes('remote.co')) {
    return 'remote.co';
  }
  if (urlLower.includes('weworkremotely.com')) {
    return 'weworkremotely';
  }
  if (urlLower.includes('/careers/') || urlLower.includes('/jobs/') || urlLower.includes('/job/')) {
    return 'company_website';
  }

  return 'custom';
}

export default function AddJobModal({ open, onClose, onSuccess }) {
  const [tabValue, setTabValue] = useState(0); // 0 = URL, 1 = Custom
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // URL submission form
  const [urlForm, setUrlForm] = useState({
    title: '',
    company: '',
    location: '',
    jobUrl: '',
    platform: 'custom',
  });

  // Custom job form
  const [customForm, setCustomForm] = useState({
    title: '',
    company: '',
    location: '',
    jobUrl: '',
    platform: 'custom',
    description: '',
    salary: '',
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError(null);
    setSuccess(false);
  };

  const handleUrlFormChange = (e) => {
    const { name, value } = e.target;
    if (name === 'jobUrl') {
      setUrlForm((prev) => ({
        ...prev,
        jobUrl: value,
        platform: detectPlatformFromUrl(value),
      }));
    } else {
      setUrlForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCustomFormChange = (e) => {
    const { name, value } = e.target;
    setCustomForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      if (!urlForm.jobUrl.trim()) {
        throw new Error('Please enter a job URL');
      }

      if (!urlForm.title.trim() || !urlForm.company.trim()) {
        throw new Error('Title and Company are required');
      }

      const response = await fetch(`${getApiUrl()}/api/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: urlForm.title.trim(),
          company: urlForm.company.trim(),
          location: urlForm.location.trim() || undefined,
          jobUrl: urlForm.jobUrl.trim(),
          platform: urlForm.platform,
          submissionSource: 'dashboard_url',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit job');
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        handleClose();
      }, 1500);
    } catch (err) {
      console.error('Error submitting job URL:', err);
      setError(err.message || 'Failed to submit job URL');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      if (!customForm.title.trim() || !customForm.company.trim()) {
        throw new Error('Title and Company are required');
      }

      const jobData = {
        title: customForm.title.trim(),
        company: customForm.company.trim(),
        location: customForm.location.trim() || undefined,
        platform: customForm.platform,
        metadata: {},
        submissionSource: 'dashboard_manual',
      };

      // Only include jobUrl if provided
      if (customForm.jobUrl.trim()) {
        jobData.jobUrl = customForm.jobUrl.trim();
      }

      // Add metadata if provided
      if (customForm.description.trim()) {
        jobData.metadata.description = customForm.description.trim();
      }
      if (customForm.salary.trim()) {
        jobData.metadata.salary = customForm.salary.trim();
      }

      const response = await fetch(`${getApiUrl()}/api/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(jobData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create job');
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        handleClose();
      }, 1500);
    } catch (err) {
      console.error('Error creating custom job:', err);
      setError(err.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTabValue(0);
    setError(null);
    setSuccess(false);
    setLoading(false);
    setUrlForm({ title: '', company: '', location: '', jobUrl: '', platform: 'custom' });
    setCustomForm({
      title: '',
      company: '',
      location: '',
      jobUrl: '',
      platform: 'custom',
      description: '',
      salary: '',
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AddIcon />
          <Typography variant="h6">Add New Job</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab
              icon={<LinkIcon />}
              iconPosition="start"
              label="Submit Job URL"
              sx={{ textTransform: 'none' }}
            />
            <Tab
              icon={<AddIcon />}
              iconPosition="start"
              label="Custom Job"
              sx={{ textTransform: 'none' }}
            />
          </Tabs>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Job added successfully!
          </Alert>
        )}

        {/* URL Submission Tab */}
        {tabValue === 0 && (
          <Box component="form" onSubmit={handleUrlSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Job URL"
              name="jobUrl"
              placeholder="https://linkedin.com/jobs/view/123456 or any job board URL"
              value={urlForm.jobUrl}
              onChange={handleUrlFormChange}
              required
              sx={{ mb: 2 }}
              helperText="Paste any job URL from LinkedIn, Indeed, Glassdoor, or any job board"
            />

            <TextField
              fullWidth
              label="Job Title"
              name="title"
              value={urlForm.title}
              onChange={handleUrlFormChange}
              required
              sx={{ mb: 2 }}
              placeholder="e.g., Senior Software Engineer"
            />

            <TextField
              fullWidth
              label="Company"
              name="company"
              value={urlForm.company}
              onChange={handleUrlFormChange}
              required
              sx={{ mb: 2 }}
              placeholder="e.g., Tech Corp"
            />

            <TextField
              fullWidth
              label="Location (Optional)"
              name="location"
              value={urlForm.location}
              onChange={handleUrlFormChange}
              sx={{ mb: 2 }}
              placeholder="e.g., San Francisco, CA or Remote"
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Platform</InputLabel>
              <Select
                name="platform"
                value={urlForm.platform}
                onChange={handleUrlFormChange}
                label="Platform"
              >
                {PLATFORM_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Note:</strong> The platform will be auto-detected from the URL.
                You can manually change it if needed.
              </Typography>
            </Alert>

            <DialogActions sx={{ px: 0, pb: 0 }}>
              <Button onClick={handleClose} disabled={loading}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading || !urlForm.jobUrl.trim() || !urlForm.title.trim() || !urlForm.company.trim()}
                startIcon={loading ? <CircularProgress size={16} /> : <AddIcon />}
              >
                {loading ? 'Submitting...' : 'Submit Job'}
              </Button>
            </DialogActions>
          </Box>
        )}

        {/* Custom Job Tab */}
        {tabValue === 1 && (
          <Box component="form" onSubmit={handleCustomSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Job Title"
              name="title"
              value={customForm.title}
              onChange={handleCustomFormChange}
              required
              sx={{ mb: 2 }}
              placeholder="e.g., Senior Software Engineer"
            />

            <TextField
              fullWidth
              label="Company"
              name="company"
              value={customForm.company}
              onChange={handleCustomFormChange}
              required
              sx={{ mb: 2 }}
              placeholder="e.g., Tech Corp"
            />

            <TextField
              fullWidth
              label="Location"
              name="location"
              value={customForm.location}
              onChange={handleCustomFormChange}
              sx={{ mb: 2 }}
              placeholder="e.g., San Francisco, CA or Remote"
            />

            <TextField
              fullWidth
              label="Job URL (Optional)"
              name="jobUrl"
              value={customForm.jobUrl}
              onChange={handleCustomFormChange}
              sx={{ mb: 2 }}
              placeholder="https://..."
              helperText="Optional: Add a link to the job posting if available"
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Platform</InputLabel>
              <Select
                name="platform"
                value={customForm.platform}
                onChange={handleCustomFormChange}
                label="Platform"
              >
                {PLATFORM_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Description (Optional)"
              name="description"
              value={customForm.description}
              onChange={handleCustomFormChange}
              multiline
              rows={3}
              sx={{ mb: 2 }}
              placeholder="Job description or notes..."
            />

            <TextField
              fullWidth
              label="Salary (Optional)"
              name="salary"
              value={customForm.salary}
              onChange={handleCustomFormChange}
              sx={{ mb: 2 }}
              placeholder="e.g., $120k - $150k"
            />

            <DialogActions sx={{ px: 0, pb: 0 }}>
              <Button onClick={handleClose} disabled={loading}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading || !customForm.title.trim() || !customForm.company.trim()}
                startIcon={loading ? <CircularProgress size={16} /> : <AddIcon />}
              >
                {loading ? 'Creating...' : 'Create Job'}
              </Button>
            </DialogActions>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

