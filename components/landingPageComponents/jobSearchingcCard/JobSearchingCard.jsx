'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';

export default function JobSearchingCard() {
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
    <Container maxWidth="lg">
      <Box
        ref={ref}
        sx={{
          position: 'relative',
          marginTop: { xs: '-4rem', md: '-6rem' },
          zIndex: 20,
          opacity: isVisible ? 1 : 0,
          // transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
          // transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
        }}
      >
        <Box
          sx={{
            background: 'rgba(255, 255, 255, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            borderRadius: { xs: '1rem', md: '1.5rem' },
            padding: { xs: '2rem', md: '3rem', lg: '4rem' },
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 40px -10px rgba(30, 41, 59, 0.08)',
            zIndex: 2,
          }}
        >
          {/* Decorative blur circle effect */}
          <Box
            sx={{
              position: 'absolute',
              right: '-80px',
              top: '-80px',
              width: '256px',
              height: '256px',
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
              filter: 'blur(64px)',
              borderRadius: '50%',
              pointerEvents: 'none',
            }}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', lg: 'row' },
              gap: { xs: '2rem', lg: '3rem' },
              alignItems: { xs: 'flex-start', lg: 'center' },
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Left Side - Text Content */}
            <Box sx={{ flex: 1 }}>
              <Typography
                component="h2"
                sx={{
                  fontSize: { xs: '1.875rem', md: '2.25rem' },
                  fontWeight: 700,
                  color: '#000000',
                  marginBottom: '1.5rem',
                  fontFamily: 'inherit',
                  lineHeight: 1.2,
                }}
              >
                Job Searching is a Full-Time Job
              </Typography>

              <Typography
                component="p"
                sx={{
                  fontSize: '1.125rem',
                  color: '#000000',
                  lineHeight: 1.75,
                  fontFamily: 'inherit',
                }}
              >
                It takes the average professional between{' '}
                <Box
                  component="span"
                  sx={{
                    color: '#3B82F6',
                    fontWeight: 600,
                  }}
                >
                  80 to 120 hours
                </Box>{' '}
                to land a new role. Stop spending your evenings and weekends filling out repetitive forms.
              </Typography>
            </Box>

            {/* Right Side - Average Time Spent Card */}
            <Box
              sx={{
                backgroundColor: '#FFFFFF',
                border: '0.125rem solid #EF4444',
                borderRadius: '1rem',
                padding: { xs: '1.5rem', md: '2rem' },
                minWidth: { xs: '100%', lg: '18rem' },
                maxWidth: { xs: '100%', lg: '20rem' },
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateX(0) scale(1)' : 'translateX(30px) scale(0.95)',
                transition: 'opacity 0.8s ease-out 0.3s, transform 0.8s ease-out 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px) scale(1.02)',
                  boxShadow: '0 12px 24px -8px rgba(239, 68, 68, 0.3)',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1rem',
                }}
              >
                {/* Hourglass Icon */}
                <Box
                  sx={{
                    width: { xs: '2rem', md: '2.5rem' },
                    height: { xs: '2rem', md: '2.5rem' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 2H18V4L14 8C14 10 16 11 16 12C16 13 14 14 14 16L18 20V22H6V20L10 16C10 14 8 13 8 12C8 11 10 10 10 8L6 4V2Z"
                      fill="#EF4444"
                    />
                  </svg>
                </Box>
                <Box>
                    <Typography
                      component="div"
                      sx={{
                        fontSize: '0.875rem',
                        color: '#000000',
                        fontFamily: 'inherit',
                        marginBottom: '0.25rem',
                        fontWeight: 600,
                      }}
                    >
                      Average Time Spent
                    </Typography>
                    <Typography
                      component="div"
                      sx={{
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        color: '#000000',
                        fontFamily: 'inherit',
                      }}
                    >
                      100+ Hours
                    </Typography>
                </Box>
              </Box>

              {/* Progress Bar */}
              <Box sx={{ marginTop: '1rem' }}>
                <Box
                  sx={{
                    width: '100%',
                    height: '0.5rem',
                    backgroundColor: '#F3F4F6',
                    borderRadius: '0.25rem',
                    overflow: 'hidden',
                    marginBottom: '0.5rem',
                  }}
                >
                  <Box
                    sx={{
                      width: '65%',
                      height: '100%',
                      backgroundColor: '#EF4444',
                      borderRadius: '0.25rem',
                    }}
                  />
                </Box>
                <Typography
                  component="div"
                  sx={{
                    fontSize: '0.75rem',
                    color: '#9CA3AF',
                    fontFamily: 'inherit',
                  }}
                >
                  Time lost on applications
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
