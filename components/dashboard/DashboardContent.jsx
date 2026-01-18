'use client';

import React from 'react';
import { Box, Typography, Paper, Grid, Avatar, Chip } from '@mui/material';
import { useSelector } from 'react-redux';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WorkIcon from '@mui/icons-material/Work';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';

export default function DashboardContent() {
  const { user } = useSelector((state) => state.auth);

  const stats = [
    { label: 'Total Applications', value: '0', icon: <WorkIcon />, color: '#2463eb' },
    { label: 'Interviews', value: '0', icon: <CheckCircleIcon />, color: '#22c55e' },
    { label: 'Pending', value: '0', icon: <PendingIcon />, color: '#f59e0b' },
  ];

  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
          Welcome back, {user?.name?.split(' ')[0] || 'User'}!
        </Typography>
        <Typography sx={{ color: '#64748b', fontSize: '1rem' }}>
          Here&apos;s an overview of your job application journey.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={4} key={stat.label}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  bgcolor: `${stat.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: stat.color,
                }}
              >
                {stat.icon}
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.875rem', color: '#64748b', mb: 0.5 }}>
                  {stat.label}
                </Typography>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>
                  {stat.value}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* User Profile Card */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
        }}
      >
        <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', mb: 3 }}>
          Your Profile
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {/* Avatar Section */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: '#2463eb',
                fontSize: '2.5rem',
                fontWeight: 700,
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
            <Chip 
              label="Active" 
              size="small" 
              sx={{ 
                bgcolor: '#dcfce7', 
                color: '#16a34a',
                fontWeight: 600,
              }} 
            />
          </Box>

          {/* User Details */}
          <Box sx={{ flex: 1 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <PersonIcon sx={{ color: '#64748b' }} />
                  <Box>
                    <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Full Name
                    </Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>
                      {user?.name || 'Not provided'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <EmailIcon sx={{ color: '#64748b' }} />
                  <Box>
                    <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Email Address
                    </Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>
                      {user?.email || 'Not provided'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <CalendarTodayIcon sx={{ color: '#64748b' }} />
                  <Box>
                    <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Member Since
                    </Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Just now'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <WorkIcon sx={{ color: '#64748b' }} />
                  <Box>
                    <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      User ID
                    </Typography>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', fontFamily: 'monospace' }}>
                      {user?.id || 'N/A'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
