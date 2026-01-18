'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Box, Container } from '@mui/material';
import Button from './Button';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navLinks = [
    { href: '/about-us', label: 'About Us' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/success-stories', label: 'Success Stories' },
    { href: '/login', label: 'Login' },
  ];

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(0.625rem)',
        borderBottom: '0.0625rem solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: { xs: 'space-between', md: 'space-between' },
          padding: { xs: '1rem 1.5rem', md: '1.5rem 2rem' },
        }}
      >
        {/* Logo - Left Side */}
        <Link
          href="/"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            flexShrink: 0,
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
              color: '#FFFFFF',
              fontSize: { xs: '1rem', md: '1.25rem' },
              fontWeight: 600,
              letterSpacing: '0.05em',
            }}
          >
            APPLY FOR ME
          </Box>
        </Link>

        {/* Right Side - Navigation + Button (Desktop) / Hamburger (Mobile) */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 0, md: '2rem' },
            flexShrink: 0,
          }}
        >
          {/* Navigation Links - Desktop Only */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: '2rem',
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: 400,
                  transition: 'opacity 0.3s ease',
                }}
                onMouseEnter={(e) => (e.target.style.opacity = '0.7')}
                onMouseLeave={(e) => (e.target.style.opacity = '1')}
              >
                {link.label}
              </Link>
            ))}
          </Box>

          {/* CTA Button - Desktop Only */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Button variant="primary">Start Free Trial</Button>
          </Box>

          {/* Mobile Menu Button */}
          <Box
            onClick={toggleMobileMenu}
            sx={{
              display: { xs: 'block', md: 'none' },
              color: '#FFFFFF',
              cursor: 'pointer',
            }}
          >
            <svg
              width="1.5rem"
              height="1.5rem"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </Box>
        </Box>
      </Container>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <Box
          sx={{
            display: { xs: 'block', md: 'none' },
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            borderTop: '0.0625rem solid rgba(255, 255, 255, 0.1)',
            padding: '1.5rem',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              maxWidth: 'lg',
              margin: '0 auto',
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: 400,
                  transition: 'opacity 0.3s ease',
                }}
                onMouseEnter={(e) => (e.target.style.opacity = '0.7')}
                onMouseLeave={(e) => (e.target.style.opacity = '1')}
              >
                {link.label}
              </Link>
            ))}
            <Box sx={{ marginTop: '0.5rem' }}>
              <Button variant="primary" fullWidth>
                Start Free Trial
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Header;

