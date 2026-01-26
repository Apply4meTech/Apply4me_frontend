'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Box, Container, Typography, Button, Grid, Paper, useMediaQuery, useTheme } from '@mui/material';
import {
  ArrowForward,
  Visibility,
  Flag,
  SmartToy,
  Schedule,
  Verified,
  Search,
  Group,
  SupportAgent,
  EditDocument,
  QueryStats,
} from '@mui/icons-material';
import Link from 'next/link';
import CompanyLogos from '../CompanyLogos';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

export default function AboutUs() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(650));
  
  // Animation refs
  const [heroRef, heroVisible] = useScrollAnimation();
  const [originRef, originVisible] = useScrollAnimation();
  const [missionRef, missionVisible] = useScrollAnimation();
  const [valuesRef, valuesVisible] = useScrollAnimation();
  const [processRef, processVisible] = useScrollAnimation();
  const [logosRef, logosVisible] = useScrollAnimation();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#EDF2F7',
        overflowX: 'hidden',
        fontFamily: 'var(--font-manrope), "Manrope", "Roboto", sans-serif',
      }}
    >
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}
      >
        {/* Hero Section */}
        <Box
          sx={{
            width: '100%',
            backgroundColor: '#1E293B',
            paddingTop: { xs: '5rem', md: '5rem' },
            paddingBottom: { xs: '10rem', md: '10rem' },
            paddingX: { xs: '1rem', sm: '2.5rem' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Gradient overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100%',
              height: '100%',
              background:
                'radial-gradient(circle at top right, rgba(37,99,235,0.25), transparent 60%)',
            }}
          />

          <Box
            ref={heroRef}
            sx={{
              maxWidth: '1000px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem',
              textAlign: 'center',
              position: 'relative',
              zIndex: 10,
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', px: 1 }}>
              <Typography
                component="h1"
                sx={{
                  fontSize: isMobile ? '1.75rem' : { xs: '2.25rem', md: '3rem', lg: '3.75rem' },
                  fontWeight: 900,
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                  color: '#FFFFFF',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              >
                Built by Job Seekers, <br />
                <Box
                  component="span"
                  sx={{
                    background:
                      'linear-gradient(135deg, rgba(147, 197, 253, 1) 0%, rgba(255, 255, 255, 1) 50%, rgba(191, 219, 254, 1) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  For Job Seekers
                </Box>
              </Typography>
              <Typography
                sx={{
                  color: '#CBD5E1',
                  fontSize: isMobile ? '0.875rem' : { xs: '1.125rem', md: '1.25rem' },
                  maxWidth: '672px',
                  mx: 'auto',
                  lineHeight: 1.75,
                  fontWeight: 300,
                }}
              >
                We're on a mission to fix the broken recruiting process, one
                application at a time. Reclaim your time and sanity.
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'center',
                alignItems: 'center',
                gap: '1rem',
                mt: 1,
              }}
            >
              <Button
                component={Link}
                href="/signup"
                sx={{
                  width: { xs: '100%', sm: 'auto' },
                  px: 4,
                  py: 1.75,
                  borderRadius: '12px',
                  backgroundColor: '#2563EB',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '1rem',
                  textTransform: 'none',
                  boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.3)',
                  '&:hover': {
                    backgroundColor: '#1E3A8A',
                  },
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                Start Application
                <ArrowForward sx={{ fontSize: '1rem' }} />
              </Button>
              <Button
                component={Link}
                href="/#success-stories"
                variant="outlined"
                sx={{
                  width: { xs: '100%', sm: 'auto' },
                  px: 4,
                  py: 1.75,
                  borderRadius: '12px',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '1rem',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                View Success Stories
                <Visibility sx={{ fontSize: '1rem' }} />
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Glass Card Section - Our Origin */}
        <Box
          ref={originRef}
          sx={{
            width: '100%',
            px: { xs: 1, sm: 1.5, md: 2.5 },
            mt: { xs: '-6rem', md: '-6rem' },
            zIndex: 20,
            mb: { xs: 5, md: 5 },
            position: 'relative',
            maxWidth: '1000px',
            mx: 'auto',
            opacity: originVisible ? 1 : 0,
            transform: originVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
          }}
        >
          <Paper
            elevation={0}
            sx={{
              background: 'rgba(255, 255, 255, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              borderRadius: isMobile ? '16px' : '24px',
              p: isMobile ? 2.5 : { xs: 4, md: 6 },
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 20px 40px -10px rgba(30, 41, 59, 0.08)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'rgba(255, 255, 255, 0.5)',
            }}
          >
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
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '1.5rem',
                position: 'relative',
                zIndex: 10,
              }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: '#2563EB',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontSize: '0.75rem',
                  backgroundColor: '#EFF6FF',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '9999px',
                  border: '1px solid #DBEAFE',
                }}
              >
                Our Origin
              </Box>
              <Typography
                component="h2"
                sx={{
                  fontSize: { xs: '1.875rem', md: '2.25rem' },
                  fontWeight: 700,
                  color: '#1E293B',
                }}
              >
                The Application Process is Broken
              </Typography>
              <Box
                sx={{
                  color: '#0F172A',
                  opacity: 0.8,
                  fontSize: '1.125rem',
                  lineHeight: 1.75,
                  maxWidth: '768px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <Typography sx={{ fontSize: isMobile ? '0.875rem' : '1.125rem', lineHeight: 1.75 }}>
                  It started with a simple frustration: spending hours entering
                  the same resume data into antiquated applicant tracking
                  systems, only to be ghosted. We realized that the most
                  talented professionals were being buried under busy work.
                </Typography>
                <Typography sx={{ fontSize: isMobile ? '0.875rem' : '1.125rem', lineHeight: 1.75 }}>
                  <Box component="strong" sx={{ fontWeight: 700 }}>
                    APPLY FOR ME
                  </Box>{' '}
                  was born out of the belief that your skills should get you the
                  job, not your ability to navigate form fields. We built the
                  service we wished we had—a dedicated team to handle the grunt
                  work so you can focus on the interviews.
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Mission & Vision Cards */}
        <Box
          ref={missionRef}
          sx={{
            width: '100%',
            px: isMobile ? 2 : { xs: 1, sm: 1.5, md: 2.5 },
            mb: isMobile ? 4 : { xs: 6, md: 6 },
            maxWidth: '1200px',
            mx: 'auto',
            opacity: missionVisible ? 1 : 0,
            transform: missionVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: isMobile ? '1.25rem' : '2rem',
            }}
          >
            <Paper
              elevation={0}
              sx={{
                background: 'rgba(255, 255, 255, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                borderRadius: isMobile ? '12px' : '16px',
                p: isMobile ? 2.5 : { xs: 4, md: 5 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                borderLeft: '4px solid #2563EB',
                boxShadow: '0 20px 40px -10px rgba(30, 41, 59, 0.08)',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <Box
                sx={{
                  backgroundColor: '#EFF6FF',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                }}
              >
                <Flag sx={{ color: '#2563EB', fontSize: '1.5rem' }} />
              </Box>
              <Typography
                component="h3"
                sx={{
                  fontSize: isMobile ? '1.125rem' : '1.5rem',
                  fontWeight: 700,
                  color: '#1E293B',
                  mb: 1,
                }}
              >
                Our Mission
              </Typography>
              <Typography
                sx={{
                  color: '#0F172A',
                  opacity: 0.7,
                  lineHeight: 1.75,
                  fontSize: isMobile ? '0.875rem' : '1.125rem',
                }}
              >
                To democratize access to career opportunities by removing the
                repetitive friction of the job search. We empower professionals
                to reclaim their time and mental energy.
              </Typography>
            </Paper>
            <Paper
              elevation={0}
              sx={{
                background: 'rgba(255, 255, 255, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                borderRadius: isMobile ? '12px' : '16px',
                p: isMobile ? 2.5 : { xs: 4, md: 5 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                borderLeft: '4px solid #1E3A8A',
                boxShadow: '0 20px 40px -10px rgba(30, 41, 59, 0.08)',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <Box
                sx={{
                  backgroundColor: '#F1F5F9',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                }}
              >
                <Visibility sx={{ color: '#1E293B', fontSize: '1.5rem' }} />
              </Box>
              <Typography
                component="h3"
                sx={{
                  fontSize: isMobile ? '1.125rem' : '1.5rem',
                  fontWeight: 700,
                  color: '#1E293B',
                  mb: 1,
                }}
              >
                Our Vision
              </Typography>
              <Typography
                sx={{
                  color: '#0F172A',
                  opacity: 0.7,
                  lineHeight: 1.75,
                  fontSize: isMobile ? '0.875rem' : '1.125rem',
                }}
              >
                We envision a world where hiring is human again. A future
                where talent finds opportunity seamlessly, without the barriers
                of black-box algorithms and tedious portals.
              </Typography>
            </Paper>
          </Box>
        </Box>

        {/* Core Beliefs Section */}
        <Box
          sx={{
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            py: isMobile ? 4 : { xs: 6, md: 6 },
            px: isMobile ? 2 : { xs: 1, sm: 1.5, md: 2.5 },
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundColor: '#EDF2F7',
              zIndex: -1,
            }}
          />
          <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
            <Box sx={{ textAlign: 'center', mb: isMobile ? 4 : 8 }}>
              <Typography
                component="h2"
                sx={{
                  fontSize: isMobile ? '1.375rem' : { xs: '1.875rem', md: '2.25rem' },
                  fontWeight: 700,
                  color: '#1E293B',
                  mb: 1,
                }}
              >
                Our Core Beliefs
              </Typography>
              <Typography
                sx={{
                  color: '#64748B',
                  fontSize: isMobile ? '0.875rem' : '1.125rem',
                  maxWidth: '672px',
                  mx: 'auto',
                }}
              >
                The values that drive every application we send on your behalf.
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(12, 1fr)' },
                gap: isMobile ? '1.5rem' : '1rem',
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: isMobile ? '8px' : '12px',
                  p: isMobile ? 2.5 : 4,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  border: '1px solid #F1F5F9',
                  transition: 'box-shadow 0.3s',
                  '&:hover': {
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  },
                  height: '100%',
                  gridColumn: { xs: 'span 12', md: 'span 8' },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 3,
                    alignItems: 'flex-start',
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: 'rgba(37, 99, 235, 0.1)',
                      p: 1.5,
                      borderRadius: '8px',
                      flexShrink: 0,
                    }}
                  >
                    <SmartToy sx={{ color: '#2563EB', fontSize: '1.875rem' }} />
                  </Box>
                  <Box>
                    <Typography
                      component="h3"
                      sx={{
                        fontSize: isMobile ? '1rem' : '1.25rem',
                        fontWeight: 700,
                        color: '#1E293B',
                        mb: 1,
                      }}
                    >
                      Humans do applications better than bots
                    </Typography>
                    <Typography
                      sx={{
                        color: '#475569',
                        lineHeight: 1.75,
                        fontSize: isMobile ? '0.8125rem' : 'inherit',
                      }}
                    >
                      Mass spamming resume blasts gets you blacklisted.
                      Thoughtful, tailored applications submitted by real
                      humans get you hired. We believe in the power of the
                      personal touch.
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  p: 4,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  border: '1px solid #F1F5F9',
                  transition: 'box-shadow 0.3s',
                  '&:hover': {
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  gridColumn: { xs: 'span 12', md: 'span 4' },
                }}
              >
                <Box
                  sx={{
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    p: 1.5,
                    borderRadius: '8px',
                    width: 'fit-content',
                  }}
                >
                  <Schedule sx={{ color: '#2563EB', fontSize: '1.875rem' }} />
                </Box>
                <Typography
                  component="h3"
                  sx={{
                    fontSize: isMobile ? '1rem' : '1.25rem',
                    fontWeight: 700,
                    color: '#1E293B',
                  }}
                >
                  Your time is valuable
                </Typography>
                <Typography
                  sx={{
                    color: '#475569',
                    lineHeight: 1.75,
                    fontSize: isMobile ? '0.8125rem' : 'inherit',
                  }}
                >
                  You should be prepping for interviews and negotiating
                  offers, not copy-pasting your work history.
                </Typography>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  p: 4,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  border: '1px solid #F1F5F9',
                  transition: 'box-shadow 0.3s',
                  '&:hover': {
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  gridColumn: { xs: 'span 12', md: 'span 4' },
                }}
              >
                <Box
                  sx={{
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    p: 1.5,
                    borderRadius: '8px',
                    width: 'fit-content',
                  }}
                >
                  <Verified sx={{ color: '#2563EB', fontSize: '1.875rem' }} />
                </Box>
                <Typography
                  component="h3"
                  sx={{
                    fontSize: isMobile ? '1rem' : '1.25rem',
                    fontWeight: 700,
                    color: '#1E293B',
                  }}
                >
                  Quality over quantity
                </Typography>
                <Typography
                  sx={{
                    color: '#475569',
                    lineHeight: 1.75,
                    fontSize: isMobile ? '0.8125rem' : 'inherit',
                  }}
                >
                  We don't play the numbers game blindly. Targeted
                  applications to roles you actually want yield better
                  results.
                </Typography>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  p: 4,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  border: '1px solid #F1F5F9',
                  transition: 'box-shadow 0.3s',
                  '&:hover': {
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  gridColumn: { xs: 'span 12', md: 'span 4' },
                }}
              >
                <Box
                  sx={{
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    p: 1.5,
                    borderRadius: '8px',
                    width: 'fit-content',
                  }}
                >
                  <Search sx={{ color: '#2563EB', fontSize: '1.875rem' }} />
                </Box>
                <Typography
                  component="h3"
                  sx={{
                    fontSize: isMobile ? '1rem' : '1.25rem',
                    fontWeight: 700,
                    color: '#1E293B',
                  }}
                >
                  Transparency matters
                </Typography>
                <Typography
                  sx={{
                    color: '#475569',
                    lineHeight: 1.75,
                    fontSize: isMobile ? '0.8125rem' : 'inherit',
                  }}
                >
                  No black boxes. You see every job we find, every application
                  we submit, and every login we create.
                </Typography>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  p: 4,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  border: '1px solid #F1F5F9',
                  transition: 'box-shadow 0.3s',
                  '&:hover': {
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  gridColumn: { xs: 'span 12', md: 'span 4' },
                }}
              >
                <Box
                  sx={{
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    p: 1.5,
                    borderRadius: '8px',
                    width: 'fit-content',
                  }}
                >
                  <Group sx={{ color: '#2563EB', fontSize: '1.875rem' }} />
                </Box>
                <Typography
                  component="h3"
                  sx={{
                    fontSize: isMobile ? '1rem' : '1.25rem',
                    fontWeight: 700,
                    color: '#1E293B',
                  }}
                >
                  No one hunts alone
                </Typography>
                <Typography
                  sx={{
                    color: '#475569',
                    lineHeight: 1.75,
                    fontSize: isMobile ? '0.8125rem' : 'inherit',
                  }}
                >
                  Job searching is isolating. We provide the team, the
                  support, and the strategy to keep you moving forward.
                </Typography>
              </Paper>
            </Box>
          </Box>
        </Box>

        {/* What Makes Us Different Section */}
        <Box
          sx={{
            width: '100%',
            px: isMobile ? 2 : { xs: 1, sm: 1.5, md: 2.5 },
            py: isMobile ? 4 : { xs: 6, md: 6 },
            maxWidth: '1200px',
            mx: 'auto',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              gap: isMobile ? 4 : { xs: 6, md: 8, lg: 10 },
            }}
          >
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Typography
                component="h2"
                sx={{
                  fontSize: isMobile ? '1.375rem' : { xs: '1.875rem', md: '2.25rem' },
                  fontWeight: 700,
                  color: '#1E293B',
                }}
              >
                What Makes Us Different
              </Typography>
              <Typography
                sx={{
                  fontSize: isMobile ? '0.875rem' : '1.125rem',
                  color: '#475569',
                }}
              >
                We aren't just another automated tool. We are a managed service
                that combines technology with human expertise.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box
                    sx={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background:
                        'linear-gradient(135deg, #2563EB 0%, #1E3A8A 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.3)',
                    }}
                  >
                    <SupportAgent sx={{ color: '#FFFFFF', fontSize: '1.5rem' }} />
                  </Box>
                  <Box>
                    <Typography
                      component="h4"
                      sx={{
                        fontSize: isMobile ? '1rem' : '1.25rem',
                        fontWeight: 700,
                        color: '#1E293B',
                        mb: 0.5,
                      }}
                    >
                      Real Trained Human Assistants
                    </Typography>
                    <Typography sx={{ color: '#475569', fontSize: isMobile ? '0.8125rem' : 'inherit' }}>
                      Every account is assigned a dedicated US-based job search
                      assistant who learns your preferences.
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box
                    sx={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}
                  >
                    <EditDocument sx={{ color: '#2563EB', fontSize: '1.5rem' }} />
                  </Box>
                  <Box>
                    <Typography
                      component="h4"
                      sx={{
                        fontSize: isMobile ? '1rem' : '1.25rem',
                        fontWeight: 700,
                        color: '#1E293B',
                        mb: 0.5,
                      }}
                    >
                      Tailored Applications
                    </Typography>
                    <Typography sx={{ color: '#475569', fontSize: isMobile ? '0.8125rem' : 'inherit' }}>
                      We don't just autofill. We customize responses to "Why do
                      you want to work here?" questions based on your profile.
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box
                    sx={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}
                  >
                    <QueryStats sx={{ color: '#2563EB', fontSize: '1.5rem' }} />
                  </Box>
                  <Box>
                    <Typography
                      component="h4"
                      sx={{
                        fontSize: isMobile ? '1rem' : '1.25rem',
                        fontWeight: 700,
                        color: '#1E293B',
                        mb: 0.5,
                      }}
                    >
                      Data-Driven Strategy
                    </Typography>
                    <Typography sx={{ color: '#475569', fontSize: isMobile ? '0.8125rem' : 'inherit' }}>
                      We analyze which resume versions are performing best and
                      pivot your strategy in real-time.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box sx={{ flex: 1, width: '100%' }}>
              <Paper
                elevation={0}
                sx={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(30px)',
                  WebkitBackdropFilter: 'blur(30px)',
                  borderRadius: '16px',
                  p: { xs: 1, md: 2 },
                  transform: 'rotate(2deg)',
                  transition: 'transform 0.5s',
                  '&:hover': {
                    transform: 'rotate(0deg)',
                  },
                  boxShadow: '0 20px 40px -10px rgba(30, 41, 59, 0.08)',
                }}
              >
                <Box
                  sx={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid #E2E8F0',
                    aspectRatio: '4/3',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'radial-gradient(circle at center, #EDF2F7, transparent)',
                    }}
                  />
                  <Box
                    sx={{
                      zIndex: 10,
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.5,
                        backgroundColor: '#FFFFFF',
                        px: 2,
                        py: 1,
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        border: '1px solid #F1F5F9',
                        mb: 1,
                        animation: 'bounce 1s infinite',
                        '@keyframes bounce': {
                          '0%, 100%': {
                            transform: 'translateY(0)',
                          },
                          '50%': {
                            transform: 'translateY(-10px)',
                          },
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#10B981',
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: '0.875rem',
                          fontWeight: 700,
                          color: '#334155',
                        }}
                      >
                        Interview Scheduled
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.5,
                        backgroundColor: '#FFFFFF',
                        px: 2,
                        py: 1,
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        border: '1px solid #F1F5F9',
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                          '0%, 100%': {
                            opacity: 1,
                          },
                          '50%': {
                            opacity: 0.7,
                          },
                        },
                      }}
                    >
                      <ArrowForward sx={{ color: '#2563EB', fontSize: '0.875rem' }} />
                      <Typography
                        sx={{
                          fontSize: '0.875rem',
                          fontWeight: 700,
                          color: '#334155',
                        }}
                      >
                        Application Sent
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Box>
        </Box>

        {/* Trusted By Section */}
        <Box
          ref={logosRef}
          sx={{
            width: '100%',
            px: { xs: 1, sm: 1.5, md: 2.5 },
            mb: { xs: 6, md: 6 },
            maxWidth: '1200px',
            mx: 'auto',
            opacity: logosVisible ? 1 : 0,
            transform: logosVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              component="h2"
              sx={{
                fontSize: isMobile ? '1.375rem' : '1.875rem',
                fontWeight: 700,
                color: '#1E293B',
              }}
            >
              Trusted by Hundreds of Professionals
            </Typography>
            <Link
              href="/#success-stories"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: '#2563EB',
                fontWeight: 700,
                marginTop: '1rem',
                textDecoration: 'none',
              }}
            >
              View Success Stories
              <ArrowForward sx={{ fontSize: '0.875rem' }} />
            </Link>
          </Box>
          <CompanyLogos title="Our Clients Get Hired At" />
        </Box>

        {/* Final CTA Section */}
        <Box
          sx={{
            width: '100%',
            backgroundColor: '#1E293B',
            py: isMobile ? 4 : { xs: 6, md: 6 },
            px: isMobile ? 2 : { xs: 1, sm: 1.5, md: 2.5 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at center, rgba(37,99,235,0.15), transparent 70%)',
            }}
          />
          <Box
            sx={{
              position: 'relative',
              zIndex: 10,
              maxWidth: '768px',
            }}
          >
            <Typography
              component="h2"
              sx={{
                fontSize: isMobile ? '1.75rem' : { xs: '2.25rem', md: '3rem' },
                fontWeight: 900,
                color: '#FFFFFF',
                mb: 3,
                letterSpacing: '-0.02em',
              }}
            >
              Let us handle your job search
            </Typography>
            <Typography
              sx={{
                color: '#CBD5E1',
                fontSize: isMobile ? '0.875rem' : '1.125rem',
                mb: 4,
                maxWidth: '576px',
                mx: 'auto',
              }}
            >
              Stop applying. Start interviewing. Join the platform that puts
              job seekers first.
            </Typography>
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
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.3s',
              }}
            >
              Start Application
            </Button>
            <Typography
              sx={{
                mt: 3,
                color: '#64748B',
                fontSize: '0.875rem',
              }}
            >
              30-day interview guarantee on Pro plans.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
