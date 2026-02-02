'use client';

import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Link from 'next/link';

const linkSx = {
  color: '#6B7280',
  textDecoration: 'none',
  fontSize: '0.875rem',
  fontFamily: 'inherit',
  transition: 'color 0.2s ease',
  display: 'block',
  '&:hover': { color: '#111827' },
};

const sectionHeadingSx = {
  fontSize: '0.6875rem',
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#9CA3AF',
  marginBottom: '1rem',
  fontFamily: 'inherit',
};

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#FAFBFC',
        borderTop: '1px solid #E5E7EB',
        paddingTop: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
        paddingBottom: { xs: '1.5rem', sm: '2rem' },
        paddingLeft: { xs: '1.25rem', sm: '1.5rem' },
        paddingRight: { xs: '1.25rem', sm: '1.5rem' },
      }}
    >
      <Container maxWidth="lg" disableGutters>
          {/* Main footer grid: mobile single column left-aligned, desktop 4-col */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'minmax(200px, 1.2fr) minmax(100px, 1fr) minmax(100px, 1fr) minmax(120px, auto)',
            },
            gap: { xs: '1.75rem', md: '0 2rem', lg: '0 3rem' },
            alignItems: { xs: 'stretch', md: 'flex-start' },
            justifyContent: { xs: 'flex-start', md: 'space-between' },
            textAlign: { xs: 'left', md: 'left' },
            marginBottom: { xs: '2rem', md: '2.5rem' },
          }}
        >
          {/* Brand block */}
          <Box
            sx={{
              gridColumn: { xs: '1', md: 'auto' },
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'flex-start', md: 'flex-start' },
              gap: '0.75rem',
            }}
          >
            <Link
              href="/"
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.625rem' }}
            >
              <Box
                sx={{
                  width: { xs: 36, sm: 40 },
                  height: { xs: 36, sm: 40 },
                  backgroundColor: '#2563EB',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 1px 3px rgba(37, 99, 235, 0.25)',
                }}
              >
                <Box
                  sx={{
                    width: '55%',
                    height: '55%',
                    backgroundColor: '#fff',
                    borderRadius: '4px',
                  }}
                />
              </Box>
              <Typography
                component="span"
                sx={{
                  color: '#111827',
                  fontSize: { xs: '1.125rem', sm: '1.25rem' },
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  fontFamily: 'inherit',
                }}
              >
                APPLY FOR ME
              </Typography>
            </Link>
            <Typography
              sx={{
                fontSize: '0.8125rem',
                color: '#6B7280',
                width: { xs: '100%', md: 'auto' },
                maxWidth: { xs: '100%', md: 220 },
                lineHeight: 1.5,
                fontFamily: 'inherit',
              }}
            >
              Your job applications, handled with care.
            </Typography>
          </Box>

          {/* Company links */}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography component="span" sx={sectionHeadingSx}>
              Company
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <Link href="/about-us" className="footer-link" style={linkSx}>About Us</Link>
              <Link href="/pricing" className="footer-link" style={linkSx}>Pricing</Link>
              <Link href="/success-stories" className="footer-link" style={linkSx}>Success Stories</Link>
            </Box>
          </Box>

          {/* Legal links */}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography component="span" sx={sectionHeadingSx}>
              Legal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <Link href="/privacy-policy" className="footer-link" style={linkSx}>Privacy Policy</Link>
              <Link href="/terms-of-service" className="footer-link" style={linkSx}>Terms of Service</Link>
              <Link href="/payment-policy" className="footer-link" style={linkSx}>Payment Policy</Link>
            </Box>
          </Box>

          {/* Connect */}
          <Box
            sx={{
              gridColumn: { xs: '1', md: 'auto' },
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'flex-start', md: 'flex-start' },
              gap: '1rem',
            }}
          >
            <Typography component="span" sx={sectionHeadingSx}>
              Connect
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                style={{ color: '#6B7280', textDecoration: 'none', display: 'flex', transition: 'color 0.2s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#111827'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#6B7280'; }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                style={{ color: '#6B7280', textDecoration: 'none', display: 'flex', transition: 'color 0.2s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#111827'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#6B7280'; }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </Link>
            </Box>
          </Box>
        </Box>

        {/* Bottom bar */}
        <Box
          sx={{
            borderTop: '1px solid #E5E7EB',
            paddingTop: { xs: '1.25rem', sm: '1.5rem' },
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: '0.75rem',
            textAlign: 'left',
          }}
        >
          <Typography
            sx={{
              fontSize: '0.8125rem',
              color: '#9CA3AF',
              fontFamily: 'inherit',
            }}
          >
            © {new Date().getFullYear()} Apply For Me Inc. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
