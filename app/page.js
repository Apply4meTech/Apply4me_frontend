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
import MainLayout from '../components/layouts/MainLayout';

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
                fontSize: { xs: '1rem', md: '1.25rem' },
                color: '#FFFFFF',
                maxWidth: '42rem',
                margin: '0 auto 3rem',
                lineHeight: 1.6,
                opacity: 0.9,
                fontFamily: 'inherit',
              }}
            >
              The premium concierge service that applies to jobs for you. Reclaim your time and accelerate your career with expert-led applications.
            </Typography>

            {/* CTA Buttons */}
            <Box
              sx={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginBottom: '4rem',
              }}
            >
              <Button variant="primary">Start Free Trial</Button>
              <Button variant="secondary">Book Strategy Call</Button>
            </Box>

            {/* Social Proof */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
              }}
            >
              {/* Avatar Icons */}
              <Box
                sx={{
                  display: 'flex',
                  gap: '-0.5rem',
                  marginRight: '0.5rem',
                }}
              >
                {[1, 2, 3].map((index) => (
                  <Box
                    key={index}
                    sx={{
                      width: { xs: '2rem', md: '2.5rem' },
                      height: { xs: '2rem', md: '2.5rem' },
                      borderRadius: '50%',
                      backgroundColor: index === 1 ? '#60A5FA' : '#FFFFFF',
                      border: '0.125rem solid #FFFFFF',
                      marginLeft: index > 1 ? '-0.5rem' : '0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {index === 1 && (
                      <Box
                        sx={{
                          width: '60%',
                          height: '60%',
                          backgroundColor: '#FFFFFF',
                          borderRadius: '50%',
                        }}
                      />
                    )}
                  </Box>
                ))}
              </Box>
              <Typography
                component="span"
                sx={{
                  color: '#FFFFFF',
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  fontFamily: 'inherit',
                }}
              >
                Trusted by 2,000+ Job Seekers
              </Typography>
            </Box>
          </Container>

        </Box>

        <Box sx={{  minHeight: '100vh',
          background: '#F1F2F4',
          display: 'flex',
          flexDirection: 'column',}}>

       
        <JobSearchingCard />

        {/* Statistics Section */}
        <StatisticsSection />
        </Box>

        <Box sx={{  minHeight: '100vh',
          background: '#F1F2F4',
          display: 'flex',
          flexDirection: 'column',}}>
            <SixStepCards />
          </Box>

        {/* ROI Calculator Section */}
        <ROICalculator />

        {/* Success Stories Section */}
        <SuccessStories />

        {/* CTA Section */}
        <CTASection />

      </Box>
    </MainLayout>
  );
}
