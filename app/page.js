'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Dialog, DialogContent, Button as MuiButton } from '@mui/material';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '../components/Button';
import JobSearchingCard from '../components/landingPageComponents/jobSearchingcCard/JobSearchingCard';
import SixStepCards from '../components/landingPageComponents/6stepCards/6stepCards';
import ROICalculator from '../components/landingPageComponents/ROICalculator/ROICalculator';
import SuccessStories from '../components/landingPageComponents/SuccessStories/SuccessStories';
import CTASection from '../components/landingPageComponents/CTASection/CTASection';
import MainLayout from '../components/layouts/MainLayout';

export default function Home() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const router = useRouter();
  const [heroVisible, setHeroVisible] = useState(false);
  const [comingSoonOpen, setComingSoonOpen] = useState(true);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#success-stories') {
      setTimeout(() => {
        const element = document.getElementById('success-stories');
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
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
              Stop spending hours {''}
              <Box component="span" sx={{ color: '#60A5FA' }}>
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

      {/* Coming Soon Popup Overlay */}
      <Dialog
        open={comingSoonOpen}
        onClose={() => setComingSoonOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '24px',
            p: 0,
            maxWidth: 460,
            mx: 2,
            overflow: 'hidden',
            boxShadow: '0 32px 64px -12px rgba(37, 99, 235, 0.25), 0 0 0 1px rgba(255,255,255,0.05)',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
            border: '1px solid rgba(96, 165, 250, 0.2)',
          }
        }}
        BackdropProps={{
          sx: { bgcolor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)' }
        }}
      >
        <DialogContent sx={{ p: 4, pt: 5 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
              boxShadow: '0 0 40px rgba(59, 130, 246, 0.4)',
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                '50%': { opacity: 0.9, transform: 'scale(1.05)' },
              }
            }}
          >
            <Box sx={{ fontSize: '2rem' }}>🚀</Box>
          </Box>
          <Typography
            sx={{
              fontSize: '2.25rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #60a5fa 0%, #93c5fd 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1.5,
              letterSpacing: '-0.02em',
            }}
          >
            Something Big Is Coming
          </Typography>
          <Typography sx={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.7, mb: 3 }}>
            We're building something that will transform how you land your dream job.
            <br />
            <Box component="span" sx={{ color: '#60a5fa', fontWeight: 600 }}>
              Get ready to stop applying—and start getting hired.
            </Box>
          </Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.95rem', mb: 3 }}>
            We'll notify you the moment we're live. You won't want to miss it.
          </Typography>
          <MuiButton
            variant="contained"
            onClick={() => setComingSoonOpen(false)}
            fullWidth
            sx={{
              py: 1.75,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '1rem',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                boxShadow: '0 6px 20px rgba(37, 99, 235, 0.5)',
              }
            }}
          >
            I'm Excited — Let's Go!
          </MuiButton>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
