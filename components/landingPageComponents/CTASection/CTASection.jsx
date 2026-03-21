'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import Link from 'next/link';

export default function CTASection() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => ref.current && observer.unobserve(ref.current);
  }, []);

  return (
    <Box
      ref={ref}
      sx={{
        background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
        padding: { xs: '4rem 1.5rem', md: '5rem 2rem' },
        textAlign: 'center',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          component="h2"
          sx={{
            fontSize: { xs: '2rem', md: '3rem' },
            fontWeight: 700,
            color: '#FFFFFF',
            marginBottom: 1,
            fontFamily: 'inherit',
            lineHeight: 1.2,
          }}
        >
          Stop Applying. Start Delegating.
        </Typography>

        <Typography
          component="p"
          sx={{
            fontSize: '1.125rem',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: 2.25,
            fontFamily: 'inherit',
            lineHeight: 1.75,
            maxWidth: 560,
            mx: 'auto',
          }}
        >
          Let our team handle your applications with accuracy and purpose so you can focus on preparing for interviews and securing your next role.
        </Typography>

        <Link href="/signup" style={{ textDecoration: 'none' }}>
          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              border: '2px solid rgba(255,255,255,0.8)',
              background: 'transparent',
              color: '#fff',
              borderRadius: '9999px',
              padding: '1rem 2.5rem',
              fontSize: '1rem',
              fontWeight: 600,
              fontFamily: 'inherit',
              cursor: 'pointer',
              transition: 'all 0.15s',
              '&:hover': {
                background: 'rgba(255,255,255,0.15)',
                borderColor: '#fff',
              },
            }}
          >
            Start Your Application
          </Box>
        </Link>
      </Container>
    </Box>
  );
}
