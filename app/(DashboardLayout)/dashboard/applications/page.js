'use client';

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';

export default function ApplicationsPage() {
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

      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <WorkIcon sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
        <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
          No applications yet
        </Typography>
        <Typography sx={{ color: '#94a3b8' }}>
          Your job applications will appear here once you start applying.
        </Typography>
      </Paper>
    </Box>
  );
}


