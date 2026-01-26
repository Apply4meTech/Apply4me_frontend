'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

// Top Australian companies with logo URLs
// Using Simple Icons CDN for consistent SVG logos
const australianCompanies = [
  { name: 'Atlassian', logoUrl: 'https://cdn.simpleicons.org/atlassian/0052CC' },
  { name: 'Canva', logoUrl: 'https://cdn.simpleicons.org/canva/00C4CC' },
  { name: 'Afterpay', logoUrl: 'https://cdn.simpleicons.org/afterpay/00A9E0' },
  { name: 'Xero', logoUrl: 'https://cdn.simpleicons.org/xero/13B5EA' },
];

export default function CompanyLogos({ title = 'Our Clients Get Hired At', variant = 'default' }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: { xs: 3, sm: 4, md: 5, lg: 6 },
        opacity: 0.7,
        filter: 'grayscale(100%)',
        transition: 'all 0.5s ease',
        '&:hover': {
          opacity: 1,
        },
        '&:hover > *': {
          opacity: 1,
          filter: 'grayscale(0%)',
        },
      }}
    >
      {australianCompanies.map((company, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: { xs: '100px', sm: '120px', md: '140px' },
            height: { xs: '50px', sm: '60px', md: '70px' },
            padding: { xs: '0.5rem 1rem', md: '0.75rem 1.5rem' },
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            '&:hover': {
              opacity: 1,
              filter: 'grayscale(0%)',
              transform: 'scale(1.1) translateY(-2px)',
            },
          }}
        >
          <Box
            component="img"
            src={company.logoUrl}
            alt={company.name}
            sx={{
              maxWidth: '100%',
              maxHeight: '100%',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              filter: variant === 'dark' ? 'brightness(0) invert(1)' : 'none',
            }}
            onError={(e) => {
              // Fallback to text if image fails to load
              e.target.style.display = 'none';
              const parent = e.target.parentElement;
              if (parent) {
                const textFallback = document.createElement('div');
                textFallback.textContent = company.name;
                textFallback.style.cssText = `
                  font-weight: 700;
                  font-size: 0.875rem;
                  color: ${variant === 'dark' ? '#FFFFFF' : '#1E293B'};
                  text-align: center;
                  white-space: nowrap;
                `;
                parent.appendChild(textFallback);
              }
            }}
          />
        </Box>
      ))}
    </Box>
  );
}
