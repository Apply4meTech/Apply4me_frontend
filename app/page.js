'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '../components/Button';
import JobSearchingCard from '../components/landingPageComponents/jobSearchingcCard/JobSearchingCard';
import SixStepCards from '../components/landingPageComponents/6stepCards/6stepCards';
import ROICalculator from '../components/landingPageComponents/ROICalculator/ROICalculator';
import CTASection from '../components/landingPageComponents/CTASection/CTASection';
import HowWeAreDifferent from '../components/landingPageComponents/HowWeAreDifferent/HowWeAreDifferent';
import TrustedBy from '../components/landingPageComponents/TrustedBy/TrustedBy';
import MainLayout from '../components/layouts/MainLayout';

export default function Home() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const router = useRouter();
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    setHeroVisible(true);
  }, []);

  const handleDashboardClick = () => {
    router.push(user?.isEmployee ? '/employee/dashboard' : '/dashboard');
  };

  return (
    <MainLayout>
      <Box
        sx={{
          minHeight: '100vh',
          marginTop: { xs: '-64px', md: '-72px' },
          paddingTop: { xs: '64px', md: '72px' },
          background: 'radial-gradient(ellipse 80% 80% at 50% 0%, #2c5fdb 0%, #1e3a8a 50%, #0f172a 100%)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          component="main"
          sx={{
            position: 'relative',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: { xs: '4rem 1.5rem 6rem', md: '6rem 2rem 8rem' },
          }}
        >
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3.25rem', lg: '3.5rem' },
                fontWeight: 800,
                color: '#FFFFFF',
                lineHeight: 1.12,
                letterSpacing: '-0.02em',
                marginBottom: '1.25rem',
                fontFamily: 'inherit',
                maxWidth: '800px',
                mx: 'auto',
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s',
              }}
            >
              Stop Spending Hours{' '}
              <Box component="span" sx={{ color: '#F5C518' }}>
                Applying to Jobs
              </Box>{' '}
              — We Apply for You.
            </Typography>

            <Typography
              component="p"
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem' },
                color: 'rgba(255,255,255,0.85)',
                maxWidth: '600px',
                margin: '0 auto 2.5rem',
                lineHeight: 1.65,
                fontFamily: 'inherit',
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.8s ease-out 0.3s, transform 0.8s ease-out 0.3s',
              }}
            >
              Delegate the repetitive work of job applications to our expert team so you can focus on preparation, interviews, and your life outside job search.
            </Typography>

            {/* CTA Buttons - Glassmorphism container */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.8s ease-out 0.4s, transform 0.8s ease-out 0.4s',
              }}
            >
              <Box
                sx={{
                  background: 'rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: '9999px',
                  padding: '0.375rem',
                  display: 'inline-flex',
                  gap: '0.5rem',
                }}
              >
                {isAuthenticated ? (
                  <Button
                    variant="primary"
                    onClick={handleDashboardClick}
                    sx={{
                      background: '#fff !important',
                      color: '#2563EB !important',
                      py: 1.25,
                      px: 3,
                      borderRadius: '9999px',
                      fontWeight: 600,
                      fontSize: '1rem',
                      '&:hover': { background: '#f0f4ff !important' },
                    }}
                  >
                    Dashboard
                  </Button>
                ) : (
                  <>
                    <Link href="/signup" style={{ textDecoration: 'none' }}>
                      <Button
                        sx={{
                          background: '#fff !important',
                          color: '#2563EB !important',
                          py: 1.25,
                          px: 3,
                          borderRadius: '9999px',
                          fontWeight: 600,
                          fontSize: '1rem',
                          '&:hover': { background: '#f0f4ff !important' },
                        }}
                      >
                        Start Application
                      </Button>
                    </Link>
                    <Link href="/pricing" style={{ textDecoration: 'none' }}>
                      <Button
                        sx={{
                          background: '#fff !important',
                          color: '#2563EB !important',
                          py: 1.25,
                          px: 3,
                          borderRadius: '9999px',
                          fontWeight: 600,
                          fontSize: '1rem',
                          '&:hover': { background: '#f0f4ff !important' },
                        }}
                      >
                        View Pricing →
                      </Button>
                    </Link>
                  </>
                )}
              </Box>
            </Box>
          </Container>
        </Box>

        <Box sx={{ background: '#000', position: 'relative', zIndex: 1 }}>
          <JobSearchingCard />
        </Box>

        <Box id="how-works" sx={{ background: '#fff', position: 'relative', zIndex: 1 }}>
          <SixStepCards />
        </Box>

        <Box id="roi-calculator" sx={{ background: '#000' }}>
          <ROICalculator />
        </Box>

        <Box sx={{ background: '#fff' }}>
          <HowWeAreDifferent />
        </Box>

        <Box sx={{ background: '#fff' }}>
          <TrustedBy />
        </Box>

        <CTASection />
      </Box>
    </MainLayout>
  );
}
