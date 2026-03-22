'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, useMediaQuery, useTheme, Drawer } from '@mui/material';
import { useSelector } from 'react-redux';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(650));
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const isHome = pathname === '/';
  const isPricing = pathname === '/pricing';
  const isAbout = pathname === '/about-us';
  const isPrivacyPolicy = pathname === '/privacy-policy';
  const isTermsOfService = pathname === '/terms-of-service';
  const isPaymentPolicy = pathname === '/payment-policy';
  const isBlogsList = pathname === '/blogs';
  const isBlogPost =
    typeof pathname === 'string' &&
    pathname.startsWith('/blogs/') &&
    pathname !== '/blogs';
  const shouldBlendLikeHero =
    isHome ||
    isPricing ||
    isAbout ||
    isPrivacyPolicy ||
    isTermsOfService ||
    isPaymentPolicy ||
    isBlogsList ||
    isBlogPost;

  useEffect(() => {
    if (!shouldBlendLikeHero) {
      setScrolled(true);
      return;
    }
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [shouldBlendLikeHero]);

  const showHeaderBg = shouldBlendLikeHero ? scrolled : true;

  const navLinks = [
    { href: '/about-us', label: 'About Us' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/#how-works', label: 'How It Works' },
    { href: '#connect', label: 'Connect' },
  ];

  const isActiveLink = (href) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        // Keep header visually blended with hero:
        // - no background tint at top
        // - only blur behind the header after scroll
        background: showHeaderBg
          ? 'linear-gradient(180deg, rgba(9,49,111,0.28) 0%, rgba(17,90,206,0.28) 100%)'
          : 'transparent',
        backdropFilter: showHeaderBg ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: showHeaderBg ? 'blur(16px)' : 'none',
        borderBottom: 'none',
        padding: '5px',
        transition: 'background 0.25s ease, border-color 0.25s ease',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          [theme.breakpoints.up('lg')]: {
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            gap: '1rem',
          },
        }}
      >
        {/* Box 1 - Left: Logo */}
        <Link
          href="/"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexShrink: 0,
          }}
        >
          <Box
            component="img"
            src="/afm_logo_white.png"
            alt="Apply For Me"
            sx={{ width: { xs: 48, sm: 56 }, height: { xs: 48, sm: 56 }, objectFit: 'contain', display: 'block' }}
          />
          <Box
            component="span"
            sx={{
              color: '#FFFFFF',
              fontSize: isMobile ? '1rem' : '1.125rem',
              fontWeight: 500,
              fontFamily: 'inherit',
              display: 'inline-flex',
              alignItems: 'baseline',
              gap: '0.25rem',
            }}
          >
            <Box component="span" sx={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 500 }}>
              Apply
            </Box>
            <Box component="span" sx={{ fontFamily: '"PP Editorial New", "Times New Roman", serif', fontStyle: 'italic', fontWeight: 400 }}>
              for
            </Box>
            <Box component="span" sx={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 500 }}>
              Me
            </Box>
          </Box>
        </Link>

        {/* Box 2 - Center: Nav buttons (desktop only) */}
        <Box
          sx={{
            display: { xs: 'none', lg: 'flex' },
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: '9999px',
              padding: '0.25rem',
              display: 'flex',
              gap: '0.25rem',
            }}
          >
            {navLinks.map((link) => {
              const isHowItWorks = link.label === 'How It Works';
              const isActive = !isHowItWorks && (isActiveLink(link.href) || (link.href === '/#how-works' && pathname === '/'));
              const isConnect = link.label === 'Connect';
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ textDecoration: 'none' }}
                >
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-block',
                      padding: '0.5rem 1.125rem',
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: isConnect ? 'rgba(255,255,255,0.9)' : (isActive ? '#FFFFFF' : 'rgba(255,255,255,0.85)'),
                      background: isConnect ? 'transparent' : (isActive ? 'rgba(255,255,255,0.12)' : 'transparent'),
                      border: isConnect ? '1px solid transparent' : (isActive ? '1px solid rgba(255,255,255,0.25)' : '1px solid transparent'),
                      transition: 'all 0.15s ease',
                      '&:hover': {
                        background: isConnect ? 'transparent' : (isActive ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.18)'),
                      },
                    }}
                  >
                    {link.label}
                  </Box>
                </Link>
              );
            })}
          </Box>
        </Box>

        {/* Box 3 - Right: Login/Dashboard (desktop) or Mobile menu button */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', minWidth: 0 }}>
          <Box
            sx={{
              display: { xs: 'none', lg: 'block' },
            }}
          >
            <Link
              href={isAuthenticated ? (user?.isEmployee ? '/employee/dashboard' : '/dashboard') : '/login'}
              style={{ textDecoration: 'none' }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#fff',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  padding: '0.5rem 1.25rem',
                  borderRadius: '9999px',
                  border: '1px solid rgba(255,255,255,0.6)',
                  background: 'transparent',
                  transition: 'background 0.15s',
                  '&:hover': { background: 'rgba(255,255,255,0.12)' },
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                {isAuthenticated ? 'Dashboard' : 'Login'}
              </Box>
            </Link>
          </Box>

          {/* Mobile Menu Button */}
          <Box
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            sx={{
              display: { xs: 'block', lg: 'none' },
              color: '#FFFFFF',
              cursor: 'pointer',
            }}
          >
            <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </Box>
        </Box>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': {
            width: 280,
            background: '#0A2540',
            backdropFilter: 'blur(20px)',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: '#fff', textDecoration: 'none', padding: '0.75rem' }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={isAuthenticated ? (user?.isEmployee ? '/employee/dashboard' : '/dashboard') : '/login'}
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#fff', textDecoration: 'none', padding: '0.75rem', marginTop: '1rem' }}
          >
            {isAuthenticated ? 'Dashboard' : 'Login'}
          </Link>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Header;
