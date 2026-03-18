'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Divider,
  Link as MuiLink,
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DescriptionIcon from '@mui/icons-material/Description';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import LinkIcon from '@mui/icons-material/Link';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Avatar from '@mui/material/Avatar';

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
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch customer profile');
      }
      if (data.success && data.user) {
        setUser(data.user);
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

  const InfoRow = ({ icon, label, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
      {icon}
      <Box>
        <Typography sx={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {label}
        </Typography>
        <Typography sx={{ fontSize: '0.875rem', color: '#0f172a', fontWeight: 500 }}>
          {value || '—'}
        </Typography>
      </Box>
    </Box>
  );

  const DocumentCard = ({ title, doc, variant = 'default' }) => (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        bgcolor: variant === 'ats' ? '#f0fdf4' : 'white',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>
          {title}
        </Typography>
        {variant === 'ats' && (
          <Chip label="ATS Optimized" size="small" sx={{ bgcolor: '#dcfce7', color: '#16a34a', fontSize: '0.7rem' }} />
        )}
      </Box>
      {doc?.url ? (
        <Button
          size="small"
          variant="outlined"
          startIcon={<VisibilityIcon />}
          onClick={() => window.open(doc.url, '_blank')}
          sx={{
            textTransform: 'none',
            borderColor: '#2463eb',
            color: '#2463eb',
            '&:hover': { borderColor: '#1d4ed8', bgcolor: '#eff6ff' },
          }}
        >
          View / Download
        </Button>
      ) : (
        <Typography sx={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>
          No document uploaded
        </Typography>
      )}
    </Paper>
  );

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
          mb: 3,
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
              Customer Profile (View Only)
            </Typography>
            {user.subscription?.planName && (
              <Chip
                label={user.subscription.planName}
                size="small"
                sx={{ mt: 1, bgcolor: '#eff6ff', color: '#2463eb', fontSize: '0.75rem' }}
              />
            )}
          </Box>
        </Box>

        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', mb: 2 }}>
          Contact & Personal Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <InfoRow icon={<EmailIcon sx={{ color: '#64748b', fontSize: '1.25rem' }} />} label="Email" value={user.email} />
            <InfoRow icon={<PhoneIcon sx={{ color: '#64748b', fontSize: '1.25rem' }} />} label="Phone" value={user.phone ? `${user.phoneCode || ''} ${user.phone}`.trim() : null} />
            <InfoRow icon={<PersonIcon sx={{ color: '#64748b', fontSize: '1.25rem' }} />} label="Address" value={user.address} />
            <InfoRow icon={<WorkIcon sx={{ color: '#64748b', fontSize: '1.25rem' }} />} label="Country of Work" value={user.countryOfWork} />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoRow icon={<WorkIcon sx={{ color: '#64748b', fontSize: '1.25rem' }} />} label="Primary Job Titles" value={user.primaryJobTitles?.join(', ')} />
            <InfoRow icon={<WorkIcon sx={{ color: '#64748b', fontSize: '1.25rem' }} />} label="Skills" value={user.skills?.join(', ')} />
            <InfoRow icon={<WorkIcon sx={{ color: '#64748b', fontSize: '1.25rem' }} />} label="Seniority Level" value={user.seniorityLevel} />
            <InfoRow icon={<WorkIcon sx={{ color: '#64748b', fontSize: '1.25rem' }} />} label="Work Location" value={user.workLocation} />
          </Grid>
        </Grid>

        {(user.portfolioWebsite || user.github || user.linkedinProfile || user.personalBlog) && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', mb: 2 }}>
              Links
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {user.portfolioWebsite && (
                <MuiLink href={user.portfolioWebsite} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#2463eb', textDecoration: 'none', fontSize: '0.875rem' }}>
                  <LinkIcon fontSize="small" /> Portfolio
                </MuiLink>
              )}
              {user.linkedinProfile && (
                <MuiLink href={user.linkedinProfile} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#2463eb', textDecoration: 'none', fontSize: '0.875rem' }}>
                  <LinkIcon fontSize="small" /> LinkedIn
                </MuiLink>
              )}
              {user.github && (
                <MuiLink href={user.github} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#2463eb', textDecoration: 'none', fontSize: '0.875rem' }}>
                  <LinkIcon fontSize="small" /> GitHub
                </MuiLink>
              )}
              {user.personalBlog && (
                <MuiLink href={user.personalBlog} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#2463eb', textDecoration: 'none', fontSize: '0.875rem' }}>
                  <LinkIcon fontSize="small" /> Blog
                </MuiLink>
              )}
            </Box>
          </>
        )}
      </Paper>

      <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', mb: 2 }}>
        Resume & Cover Letter
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <DocumentCard title="Resume" doc={user.resume} />
        </Grid>
        <Grid item xs={12} md={4}>
          <DocumentCard title="ATS Optimized Resume" doc={user.atsResume} variant="ats" />
        </Grid>
        <Grid item xs={12} md={4}>
          <DocumentCard title="Cover Letter" doc={user.coverLetter} />
        </Grid>
      </Grid>
    </Box>
  );
}
