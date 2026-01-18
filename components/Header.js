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
        backgroundColor: 'rgba(30, 41, 59, 0.9)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: { xs: '1rem', md: '1rem 2.5rem' },
          width: '100%',
        }}
      >
        {/* Logo - Left Side */}
        <Link
          href="/"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              width: '32px',
              height: '32px',
              color: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              className="w-full h-full"
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z"
                fill="currentColor"
                fillRule="evenodd"
              />
              <path
                clipRule="evenodd"
                d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z"
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
          </Box>
          <Box
            component="h2"
            sx={{
              color: '#FFFFFF',
              fontSize: '1.25rem',
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: '0.025em',
            }}
          >
            APPLY FOR ME
          </Box>
        </Link>

        {/* Right Side - Navigation + Button (Desktop) / Hamburger (Mobile) */}
        <Box
          sx={{
            display: { xs: 'none', lg: 'flex' },
            alignItems: 'center',
            flex: 1,
            justifyContent: 'flex-end',
            gap: '2rem',
          }}
        >
          {/* Navigation Links */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '2.25rem',
            }}
          >
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: index === 0 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  fontSize: index === 0 ? '1rem' : '0.875rem',
                  fontWeight: index === 0 ? 700 : 500,
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  if (index !== 0) e.target.style.color = '#2563EB';
                }}
                onMouseLeave={(e) => {
                  if (index !== 0) e.target.style.color = 'rgba(255, 255, 255, 0.7)';
                }}
              >
                {link.label}
              </Link>
            ))}
          </Box>

          {/* CTA Button */}
          <Button variant="primary">Get Started</Button>
        </Box>

        {/* Mobile Menu Button */}
        <Box
          onClick={toggleMobileMenu}
          sx={{
            display: { xs: 'block', lg: 'none' },
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
                Get Started
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Header;

