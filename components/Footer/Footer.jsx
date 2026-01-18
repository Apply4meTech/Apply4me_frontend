'use client';

import React from 'react';
import { Box, Container, Typography, useMediaQuery, useTheme } from '@mui/material';
import Link from 'next/link';

export default function Footer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(650));

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#FFFFFF',
        padding: { xs: '2rem 1.5rem', md: '2.5rem 2rem' },
        borderTop: '0.0625rem solid #E5E7EB',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'center', md: 'center' },
            justifyContent: 'space-between',
            gap: { xs: '1.5rem', md: '2rem' },
          }}
        >
          {/* Left Side - Logo */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <Box
              sx={{
                width: { xs: '2rem', md: '2.5rem' },
                height: { xs: '2rem', md: '2.5rem' },
                backgroundColor: '#60A5FA',
                borderRadius: '0.375rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  width: '60%',
                  height: '60%',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '0.125rem',
                }}
              />
            </Box>
            <Box
              component="span"
              sx={{
                color: '#1F2937',
                fontSize: isMobile ? '0.875rem' : { xs: '1rem', md: '1.25rem' },
                fontWeight: 600,
                letterSpacing: '0.05em',
                fontFamily: 'inherit',
              }}
            >
              APPLY FOR ME
            </Box>
          </Box>

          {/* Center - Copyright */}
          <Typography
            component="p"
            sx={{
              fontSize: isMobile ? '0.75rem' : { xs: '0.875rem', md: '1rem' },
              color: '#374151',
              fontFamily: 'inherit',
              textAlign: { xs: 'center', md: 'center' },
            }}
          >
            ©2026 Apply For Me Inc. All rights reserved.
          </Typography>

          {/* Right Side - Social Media Icons */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
            }}
          >
            {/* Twitter Icon */}
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#374151',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                transition: 'opacity 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <svg
                width="1.5rem"
                height="1.5rem"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>

            {/* LinkedIn Icon */}
            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#374151',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                transition: 'opacity 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <svg
                width="1.5rem"
                height="1.5rem"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

