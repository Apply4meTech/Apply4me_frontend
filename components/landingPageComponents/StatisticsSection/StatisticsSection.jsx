'use client';

import React from 'react';
import { Box, Container } from '@mui/material';
import StatCard from '../../StatCard';

export default function StatisticsSection() {
  return (
    <Box
      sx={{
        padding: { xs: '4rem 1.5rem', md: '3rem 2rem' },
        paddingTop: { xs: '0', md: '4rem' },
        marginTop: { xs: '4rem', md: '3rem' },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: '1.5rem', md: '2rem' },
            flexWrap: 'wrap',
          }}
        >
          <StatCard
            number="500+"
            title="Clients Hired"
            description="At top Fortune 500 companies"
          />
          <StatCard
            number="35%"
            title="Avg Salary Increase"
            description="Negotiated by our experts"
          />
          <StatCard
            number="90%"
            title="Interview Rate"
            description="Within the first 30 days"
          />
        </Box>
      </Container>
    </Box>
  );
}

