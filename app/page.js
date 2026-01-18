'use client';

import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Button from '../components/Button';
import JobSearchingCard from '../components/landingPageComponents/jobSearchingcCard/JobSearchingCard';
import StatisticsSection from '../components/landingPageComponents/StatisticsSection/StatisticsSection';
import SixStepCards from '../components/landingPageComponents/6stepCards/6stepCards';
import ROICalculator from '../components/landingPageComponents/ROICalculator/ROICalculator';
import SuccessStories from '../components/landingPageComponents/SuccessStories/SuccessStories';
import CTASection from '../components/landingPageComponents/CTASection/CTASection';

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#EDF2F7',
        display: 'flex',
        flexDirection: 'column',
      }}
    >

      {/* Hero Section with Blue Gradient Background */}
      <Box
        component="main"
        sx={{
          position: 'relative',
          padding: { xs: '6rem 1rem', sm: '6rem 2.5rem', md: '6rem 2.5rem' },
          paddingBottom: { xs: '8rem', md: '8rem' },
          textAlign: 'center',
          backgroundColor: '#1E293B',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Background Gradients */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '75%',
            height: '100%',
            background: 'radial-gradient(circle at top right, rgba(37, 99, 235, 0.25), transparent 60%)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '50%',
            height: '50%',
            background: 'radial-gradient(circle at bottom left, rgba(30, 58, 138, 0.3), transparent 60%)',
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 10 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', padding: { xs: '0 1rem', sm: '0' } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: '2.25rem', md: '3rem', lg: '3.75rem' },
                  fontWeight: 900,
                  color: '#FFFFFF',
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                  fontFamily: 'inherit',
                }}
              >
                Land Interviews Without{' '}
                <Box
                  component="span"
                  sx={{
                    display: { xs: 'block', md: 'inline' },
                    background: 'linear-gradient(135deg, #93C5FD 0%, #FFFFFF 50%, #BFDBFE 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Applying Yourself
                </Box>
              </Typography>

              {/* Description */}
              <Typography
                component="p"
                sx={{
                  fontSize: { xs: '1.125rem', md: '1.25rem' },
                  color: '#CBD5E1',
                  maxWidth: '42rem',
                  margin: '0 auto',
                  lineHeight: 1.75,
                  fontWeight: 300,
                  fontFamily: 'inherit',
                }}
              >
                The premium concierge service that applies to jobs for you. Reclaim your time and accelerate your career with expert-led applications.
              </Typography>
            </Box>

            {/* CTA Buttons */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: '1rem',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '1rem',
              }}
            >
              <Button 
                variant="primary"
                sx={{
                  minWidth: { xs: '100%', sm: '12.5rem' },
                  fontSize: '1rem',
                  fontWeight: 700,
                  padding: '1rem 2rem',
                }}
              >
                Start Free Trial
              </Button>
              <Button 
                variant="secondary"
                sx={{
                  minWidth: { xs: '100%', sm: '12.5rem' },
                  fontSize: '1rem',
                  fontWeight: 700,
                  padding: '1rem 2rem',
                }}
              >
                Book Strategy Call
              </Button>
            </Box>

            {/* Social Proof */}
            <Box
              sx={{
                marginTop: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: { xs: '0.875rem', md: '0.875rem' },
                color: '#94A3B8',
              }}
            >
              {/* Avatar Icons */}
              <Box
                sx={{
                  display: 'flex',
                  marginRight: '0.5rem',
                  '& > *:not(:first-of-type)': {
                    marginLeft: '-0.5rem',
                  },
                }}
              >
                {[1, 2, 3].map((index) => (
                  <Box
                    key={index}
                    sx={{
                      width: '2rem',
                      height: '2rem',
                      borderRadius: '50%',
                      backgroundColor: '#D1D5DB',
                      border: '0.125rem solid #1E293B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  />
                ))}
              </Box>
              <Typography
                component="span"
                sx={{
                  color: '#94A3B8',
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                }}
              >
                Trusted by 2,000+ Job Seekers
              </Typography>
            </Box>
          </Box>
        </Container>

      </Box>

      <Box sx={{
        background: '#EDF2F7',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <JobSearchingCard />

        {/* Statistics Section */}
        <StatisticsSection />
      </Box>

      <Box sx={{
        background: '#EDF2F7',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <SixStepCards />
      </Box>

      {/* ROI Calculator Section */}
      <ROICalculator />

      {/* Success Stories Section */}
      <SuccessStories />

      {/* CTA Section */}
      <CTASection />

    </Box>
  );
}
