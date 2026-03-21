'use client';

import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const companies = [
  { name: 'Atlassian', src: 'https://cdn.simpleicons.org/atlassian/0052CC' },
  { name: 'Canva', src: 'https://cdn.simpleicons.org/canva/00C4CC' },
  { name: 'Afterpay', src: 'https://cdn.simpleicons.org/afterpay/00A9E0' },
  { name: 'Xero', src: 'https://cdn.simpleicons.org/xero/13B5EA' },
];

export default function TrustedBy() {
  return (
    <Box
      sx={{
        padding: { xs: '3rem 1.5rem', md: '3rem 2rem' },
        backgroundColor: '#fff',
        borderTop: '1px solid #e5e7eb',
        textAlign: 'center',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          sx={{
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: '#374151',
            marginBottom: 1.75,
            fontFamily: 'inherit',
          }}
        >
          Trusted by Job Seekers Who Get Hired At:
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: { xs: 2, md: 3 },
            flexWrap: 'wrap',
          }}
        >
          {companies.map((company) => (
            <Box
              key={company.name}
              component="img"
              src={company.src}
              alt={company.name}
              sx={{
                height: 36,
                opacity: 0.7,
                filter: 'grayscale(20%)',
              }}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
}
