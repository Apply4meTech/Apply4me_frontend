'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
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
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <Box
      ref={ref}
      sx={{
        backgroundColor: '#0F172A',
        padding: { xs: '4rem 1.5rem', md: '6rem 2rem' },
        textAlign: 'center',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
      }}
    >
      <Container maxWidth="lg">
        {/* Headline */}
        <Typography
          component="h2"
          sx={{
            fontSize: { xs: '2.25rem', md: '2.5rem' },
            fontWeight: 900,
            color: '#FFFFFF',
            marginBottom: '1.5rem',
            fontFamily: 'inherit',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s',
          }}
        >
          Stop Applying. Start Delegating.
        </Typography>

        {/* Description */}
        <Typography
          component="p"
          sx={{
            fontSize: '1.125rem',
            color: '#FFFFFF',
            marginBottom: '2.5rem',
            fontFamily: 'inherit',
            lineHeight: 1.75,
            maxWidth: '42rem',
            margin: '0 auto 2.5rem',
            opacity: isVisible ? 0.9 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.8s ease-out 0.4s, transform 0.8s ease-out 0.4s',
          }}
        >
          Join thousands of professionals who have accelerated their careers with our premium service.
        </Typography>

        {/* CTA Button */}
        <Box
          sx={{
            marginBottom: '1rem',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
            transition: 'opacity 0.8s ease-out 0.6s, transform 0.8s ease-out 0.6s',
          }}
        >
          <Button
            component={Link}
            href="/signup"
            sx={{
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              fontSize: '1.125rem',
              fontWeight: 700,
              py: 2,
              px: 5,
              borderRadius: '12px',
              boxShadow: '0 20px 40px -10px rgba(37, 99, 235, 0.5)',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#1E3A8A',
                transform: 'scale(1.08)',
                boxShadow: '0 25px 50px -10px rgba(37, 99, 235, 0.6)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Start Application
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

