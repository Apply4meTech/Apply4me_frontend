'use client';

import { Box } from '@mui/material';

export default function AffiliateLayout({ children }) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {children}
    </Box>
  );
}
