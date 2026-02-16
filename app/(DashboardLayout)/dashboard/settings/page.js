'use client';

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

export default function SettingsPage() {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
          Settings
        </Typography>
        <Typography sx={{ color: '#64748b', fontSize: '1rem' }}>
          Manage your account settings and preferences.
        </Typography>
      </Box>

      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <SettingsIcon sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
        <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
          Settings coming soon
        </Typography>
        <Typography sx={{ color: '#94a3b8' }}>
          Account settings and preferences will be available here.
        </Typography>
      </Paper>
    </Box>
  );
}








