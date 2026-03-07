'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '../components/Button';
import JobSearchingCard from '../components/landingPageComponents/jobSearchingcCard/JobSearchingCard';
import StatisticsSection from '../components/landingPageComponents/StatisticsSection/StatisticsSection';
import SixStepCards from '../components/landingPageComponents/6stepCards/6stepCards';
import ROICalculator from '../components/landingPageComponents/ROICalculator/ROICalculator';
import SuccessStories from '../components/landingPageComponents/SuccessStories/SuccessStories';
import CTASection from '../components/landingPageComponents/CTASection/CTASection';
import MainLayout from '../components/layouts/MainLayout';

// comment

export default function Home() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const router = useRouter();
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    // Handle smooth scroll to success stories section
    const hash = window.location.hash;
    if (hash === '#success-stories') {
      setTimeout(() => {
        const element = document.getElementById('success-stories');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }

    // Trigger hero animation on mount
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
          backgroundColor: '#1E293B',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          component="main"
          sx={{
            position: 'relative',
            padding: { xs: '3rem 1.5rem', md: '5rem 2rem' },
            paddingBottom: { xs: '8rem', md: '12rem' },
            textAlign: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Gradient overlay matching About Us */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle at top right, rgba(37,99,235,0.25), transparent 60%)',
              pointerEvents: 'none',
            }}
          />
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem', lg: '3.75rem' },
                fontWeight: 900,
                color: '#FFFFFF',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                marginBottom: '1.5rem',
                fontFamily: 'inherit',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
              }}
            >
              Stop spending hours {""}
              <Box
                component="span"
                sx={{
                  color: '#60A5FA',
                }}
              >
                applying to jobs.
              </Box>
            </Typography>

            {/* Description */}
            <Typography
              component="p"
              sx={{
                fontSize: { xs: '1rem', md: '1.25rem' },
                color: '#FFFFFF',
                maxWidth: '42rem',
                margin: '0 auto 3rem',
                lineHeight: 1.6,
                opacity: heroVisible ? 0.9 : 0,
                fontFamily: 'inherit',
                transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s',
              }}
            >
              We handle your job applications manually using real people so you can focus on interviews preparation and life.
            </Typography>

            
            <Box
              sx={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginBottom: '4rem',
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.8s ease-out 0.4s, transform 0.8s ease-out 0.4s',
              }}
            >
              {isAuthenticated ? (
                <Button 
                  variant="primary" 
                  onClick={handleDashboardClick}
                  sx={{
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.4)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Link href="/signup" style={{ textDecoration: 'none' }}>
                    <Button 
                      variant="primary"
                      sx={{
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.4)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Start Application
                    </Button>
                  </Link>
                  <Link href="/pricing" style={{ textDecoration: 'none' }}>
                  <Button 
                    variant="secondary"
                    sx={{
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    View Pricing
                  </Button>
                  </Link>
                </>
              )}
            </Box>

            {/* Social Proof */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.8s ease-out 0.6s, transform 0.8s ease-out 0.6s',
              }}
            >
              
              <Typography
                component="span"
                sx={{
                  color: '#FFFFFF',
                  fontSize: "22px",
                  fontFamily: 'inherit',
                }}
              >
                Built for Australian job seekers.
              </Typography>
            </Box>
          </Container>

        </Box>

        <Box sx={{  
          background: '#F1F2F4',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 1,
        }}>
          <JobSearchingCard />
          {/* <StatisticsSection /> */}
        </Box>

        <Box sx={{  
          background: '#F1F2F4',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <SixStepCards />
        </Box>

        {/* ROI Calculator Section */}
        <Box id="roi-calculator">
          <ROICalculator />
        </Box>

        {/* Success Stories Section */}
        <Box id="success-stories">
          <SuccessStories />
        </Box>

        {/* CTA Section */}
        <CTASection />

      </Box>
    </MainLayout>
  );
}
