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
    <MainLayout>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #1E3A8A 0%, #0F172A 100%)',
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
          }}
        >
          <Container maxWidth="lg">
            
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem', lg: '5.5rem' },
                fontWeight: 700,
                color: '#FFFFFF',
                lineHeight: 1.1,
                marginBottom: '1.5rem',
                fontFamily: 'inherit',
              }}
            >
              Land Interviews Without{' '}
              <Box
                component="span"
                sx={{
                  color: '#60A5FA',
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
