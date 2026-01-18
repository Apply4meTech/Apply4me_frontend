'use client';

import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const steps = [
  {
    number: 1,
    title: 'Profile Analysis',
    description: 'We audit your experience and career goals to identify your perfect role fit.',
  },
  {
    number: 2,
    title: 'Asset Optimization',
    description: 'Expert writers revamp your resume, cover letter, and LinkedIn profile.',
  },
  {
    number: 3,
    title: 'Strategic Targeting',
    description: 'We identify high-probability opportunities aligned with your criteria.',
  },
  {
    number: 4,
    title: 'Application Management',
    description: 'Our team manually applies to jobs daily, tailoring every submission.',
  },
  {
    number: 5,
    title: 'Interview Prep',
    description: 'Mock interviews and coaching sessions to ensure you ace the meeting.',
  },
  {
    number: 6,
    title: 'Salary Negotiation',
    description: 'We help you negotiate the best possible compensation package.',
  },
];

export default function SixStepCards() {
  return (
    <Box
      sx={{
        padding: { xs: '3rem 1.5rem', md: '5rem 2rem' },
      }}
    >
      <Container maxWidth="lg">
        {/* Heading */}
        <Typography
          component="h2"
          sx={{
            fontSize: { xs: '1.875rem', md: '2.25rem' },
            fontWeight: 700,
            color: '#1F2937',
            textAlign: 'center',
            marginBottom: '1rem',
            fontFamily: 'inherit',
          }}
        >
          How We Get You Hired
        </Typography>

        {/* Subtitle */}
        <Typography
          component="p"
          sx={{
            fontSize: '1.125rem',
            color: '#6B7280',
            textAlign: 'center',
            maxWidth: '42rem',
            margin: '0 auto 3rem',
            lineHeight: 1.75,
            fontFamily: 'inherit',
          }}
        >
          Our proven 6-step process takes you from application to offer letter without the stress.
        </Typography>

        {/* Cards Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: { xs: '1.5rem', md: '2rem' },
          }}
        >
          {steps.map((step) => (
            <Box
              key={step.number}
              sx={{
                backgroundColor: '#FFFFFF',
                borderRadius: '1rem',
                padding: { xs: '1.5rem', md: '2rem' },
                boxShadow: '0 0.125rem 0.5rem rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-0.25rem)',
                  boxShadow: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.15)',
                },
              }}
            >
              {/* Numbered Blue Square */}
              <Box
                sx={{
                  width: { xs: '2.5rem', md: '3rem' },
                  height: { xs: '2.5rem', md: '3rem' },
                  backgroundColor: '#3B82F6',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                    fontWeight: 700,
                    color: '#FFFFFF',
                    fontFamily: 'inherit',
                  }}
                >
                  {step.number}
                </Typography>
              </Box>

              {/* Title */}
              <Typography
                component="h3"
                sx={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#1F2937',
                  fontFamily: 'inherit',
                  marginTop: '0.5rem',
                }}
              >
                {step.title}
              </Typography>

              {/* Description */}
              <Typography
                component="p"
                sx={{
                  fontSize: '1.125rem',
                  color: '#6B7280',
                  lineHeight: 1.75,
                  fontFamily: 'inherit',
                }}
              >
                {step.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
