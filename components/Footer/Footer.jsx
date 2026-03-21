'use client';

import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Link from 'next/link';

const linkSx = {
  color: '#3b5bdb',
  textDecoration: 'none',
  fontSize: '0.9375rem',
  fontFamily: 'inherit',
  transition: 'color 0.2s ease',
  display: 'block',
  '&:hover': { color: '#1e3a8a' },
};

const sectionHeadingSx = {
  fontSize: '0.8125rem',
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#9ca3af',
  marginBottom: '1rem',
  fontFamily: 'inherit',
};

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#fff',
        borderTop: '1px solid #e5e7eb',
        paddingTop: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
        paddingBottom: { xs: '1.5rem', sm: '2rem' },
        paddingLeft: { xs: '1.25rem', sm: '1.5rem' },
        paddingRight: { xs: '1.25rem', sm: '1.5rem' },
      }}
    >
      <Container maxWidth="lg" disableGutters>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'minmax(200px, 1.2fr) minmax(100px, 1fr) minmax(100px, 1fr) minmax(120px, auto)',
            },
            gap: { xs: '1.75rem', md: '0 2rem', lg: '0 3rem' },
            alignItems: { xs: 'stretch', md: 'flex-start' },
            marginBottom: { xs: '2rem', md: '2.5rem' },
          }}
        >
          {/* Brand */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Box component="span" sx={{ fontSize: '1.25rem' }}>🚀</Box>
              <Typography
                component="span"
                sx={{
                  color: '#111827',
                  fontSize: { xs: '1.125rem', sm: '1.25rem' },
                  fontWeight: 500,
                  fontFamily: 'inherit',
                }}
              >
                Apply <em style={{ fontStyle: 'italic', fontWeight: 400 }}>For</em> Me
              </Typography>
            </Link>
            <Typography sx={{ fontSize: '0.9375rem', color: '#6b7280', lineHeight: 1.5, fontFamily: 'inherit' }}>
              Your job applications, handled with care.
            </Typography>
          </Box>

          {/* Company */}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography component="span" sx={sectionHeadingSx}>Company</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <Link href="/about-us" style={linkSx}>About Us</Link>
              <Link href="/blogs" style={linkSx}>Blogs</Link>
              <Link href="/pricing" style={linkSx}>Pricing</Link>
            </Box>
          </Box>

          {/* Legal */}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography component="span" sx={sectionHeadingSx}>Legal</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <Link href="/privacy-policy" style={linkSx}>Privacy Policy</Link>
              <Link href="/terms-of-service" style={linkSx}>Terms of Service</Link>
              <Link href="/payment-policy" style={linkSx}>Payment Policy</Link>
            </Box>
          </Box>

          {/* Connect */}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography component="span" sx={sectionHeadingSx}>Connect</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ color: '#374151', textDecoration: 'none' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </Link>
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="X" style={{ color: '#374151', textDecoration: 'none' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: '#374151', textDecoration: 'none' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </Link>
            </Box>
          </Box>
        </Box>

        <Box sx={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem', textAlign: 'center' }}>
          <Typography sx={{ fontSize: '0.9375rem', color: '#9ca3af', fontFamily: 'inherit' }}>
            © 2026 Apply For Me. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
