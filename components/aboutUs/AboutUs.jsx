'use client';

import React from 'react';
import { Box, Container, Typography } from '@mui/material';

export default function AboutUs() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'inherit',
        marginTop: { xs: '-64px', md: '-72px' },
        paddingTop: { xs: '64px', md: '72px' },
        background: 'linear-gradient(180deg, #09316f 0%, #115ace 100%)',
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          background: 'transparent',
          py: { xs: 6, md: 8 },
          px: { xs: 1.5, md: 2 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700,
              color: '#FFFFFF',
              mb: 1,
            }}
          >
            About ApplyForMe
          </Typography>
          <Typography
            sx={{
              fontWeight: 600,
              color: '#F5C518',
              mb: 2,
              fontSize: { xs: '1.1rem', md: '1.25rem' },
            }}
          >
            Stop Applying. Start Delegating.
          </Typography>
          <Typography sx={{ mb: 2, lineHeight: 1.75, color: 'rgba(255,255,255,0.9)', fontSize: '1rem' }}>
            ApplyForMe started with a simple realisation: Modern job searching feels like a full-time job. Between work, study, family, and daily responsibilities, keeping up with dozens of applications every week is exhausting. Talented, capable people miss opportunities not because they lack skill, but because they lack time and consistency.
          </Typography>
          <Typography sx={{ lineHeight: 1.75, color: 'rgba(255,255,255,0.9)', fontSize: '1rem' }}>
            We built ApplyForMe to solve that problem properly.
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: '#FFFFFF',
          py: { xs: 4, md: 6 },
          px: { xs: 1.5, md: 2 },
        }}
      >
        <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
          {/* Our Story */}
          <Typography
            component="h2"
            sx={{
              fontWeight: 800,
              color: '#111827',
              mt: 3,
              mb: 1.5,
              fontSize: { xs: '1.8rem', md: '2.2rem' },
            }}
          >
            Our Story
          </Typography>
          <Typography sx={{ mb: 2, lineHeight: 1.75, color: '#1f2937', fontSize: '1rem' }}>
            ApplyForMe was born from real frustration. We saw students, professionals, and skilled migrants spending hours every evening submitting applications online, often with little response. The process felt repetitive, draining, and discouraging.
          </Typography>
          <Typography sx={{ mb: 1, lineHeight: 1.75, color: '#1f2937', fontSize: '1rem' }}>
            The biggest barrier was not talent. It was consistency. And consistency is difficult when life does not pause for job hunting.
          </Typography>
          <Typography sx={{ mb: 2, lineHeight: 1.75, color: '#1f2937', fontSize: '1rem' }}>
            That is when the idea became clear: What if someone could manage the repetitive application process with care, structure, and real human attention? ApplyForMe was created to provide exactly that.
          </Typography>
          <Typography sx={{ mb: 1, lineHeight: 1.75, color: '#1f2937', fontSize: '1rem' }}>
            Not bots. Not automation spam. Not mass submissions.
          </Typography>
          <Typography sx={{ mb: 3, lineHeight: 1.75, color: '#1f2937', fontSize: '1rem' }}>
            Real people. Real applications. Real consistency.
          </Typography>

          {/* What We Do + Who We Support cards */}
          <Box
            sx={{
              backgroundColor: '#F3F4F6',
              borderRadius: '1rem',
              p: { xs: 1.5, md: 2 },
              mb: 3,
              width: '100vw',
              ml: 'calc(50% - 50vw)',
              mr: 'calc(50% - 50vw)',
              px: { xs: 2, md: 4 },
            }}
          >
            <Box
              sx={{
                maxWidth: '1100px',
                mx: 'auto',
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: { xs: 2, md: 3 },
              }}
            >
              <Box
                sx={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '1rem',
                  p: { xs: 2, md: 2.5 },
                }}
              >
              <Typography component="h3" sx={{ fontWeight: 700, color: '#111827', mb: 1, fontSize: '1.25rem' }}>
                What We Do
              </Typography>
              <Typography sx={{ mb: 1, lineHeight: 1.75, color: '#1f2937', fontSize: '1rem' }}>
                When you join ApplyForMe, you are supported by a real human assistant who manages your applications based on your goals, experience, and preferences. We help by:
              </Typography>
              <Box sx={{ mb: 2 }}>
                {[
                  'Submitting applications consistently',
                  'Targeting roles aligned with your profile',
                  'Keeping your job search organised',
                  'Saving you hours every week',
                ].map((point) => (
                  <Box key={point} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                    <Box component="span" sx={{ color: '#22C55E', fontWeight: 700, lineHeight: 1.6 }}>
                      ✓
                    </Box>
                    <Typography sx={{ color: '#1f2937', fontSize: '1rem', lineHeight: 1.75 }}>
                      {point}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Typography sx={{ lineHeight: 1.75, color: '#1f2937', fontSize: '1rem' }}>
                You focus on preparing for interviews and progressing confidently in your career. We handle the repetitive work behind the scenes.
              </Typography>
              </Box>

              <Box
                sx={{
                  background: 'linear-gradient(180deg, #09316f 0%, #115ace 100%)',
                  borderRadius: '1rem',
                  p: { xs: 2, md: 2.5 },
                }}
              >
              <Typography component="h3" sx={{ fontWeight: 700, color: '#FFFFFF', mb: 1, fontSize: '1.25rem' }}>
                Who We Support
              </Typography>
              <Typography sx={{ mb: 1, lineHeight: 1.75, color: 'rgba(255,255,255,0.9)', fontSize: '1rem' }}>
                We work with job seekers across Australia, including:
              </Typography>
              <Box sx={{ mb: 2 }}>
                {[
                  'Students and recent graduates',
                  'Skilled migrants',
                  'Professionals changing careers',
                  'Anyone actively searching for work',
                ].map((point) => (
                  <Box key={point} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                    <Box component="span" sx={{ color: '#22C55E', fontWeight: 700, lineHeight: 1.6 }}>
                      ✓
                    </Box>
                    <Typography sx={{ color: '#FFFFFF', fontSize: '1rem', lineHeight: 1.75 }}>
                      {point}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Typography sx={{ lineHeight: 1.75, color: 'rgba(255,255,255,0.9)', fontSize: '1rem' }}>
                Whether you are applying for your first role or your next step, we support the process with structure and momentum.
              </Typography>
              </Box>
            </Box>
          </Box>

          {/* Our Approach */}
          <Typography
            component="h2"
            sx={{
              fontWeight: 700,
              color: '#111827',
              mt: 3,
              mb: 1,
              fontSize: '1.25rem',
            }}
          >
            Our Approach
          </Typography>
          <Typography sx={{ mb: 1, lineHeight: 1.75, color: '#1f2937', fontSize: '1rem' }}>
            We believe job searching should feel supported, not overwhelming. That means:
          </Typography>
          <Box sx={{ mb: 2 }}>
            {[
              'Clear, transparent pricing',
              'Real human assistance',
              'Honest expectations',
              'No unrealistic promises',
            ].map((point) => (
              <Box key={point} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                <Box component="span" sx={{ color: '#22C55E', fontWeight: 700, lineHeight: 1.6 }}>
                  ✓
                </Box>
                <Typography sx={{ color: '#1f2937', fontSize: '1rem', lineHeight: 1.75 }}>
                  {point}
                </Typography>
              </Box>
            ))}
          </Box>
          <Typography sx={{ mb: 2, lineHeight: 1.75, color: '#1f2937', fontSize: '1rem' }}>
            We do not guarantee jobs or interviews because no legitimate service can. What we do guarantee is consistent, professional application submission. In today&apos;s market, consistency is often the difference.
          </Typography>

          {/* Meet the Founders */}
          <Typography
            component="h2"
            sx={{
              fontWeight: 700,
              color: '#111827',
              mt: 3,
              mb: 1,
              fontSize: '1.25rem',
            }}
          >
            Meet the Founders
          </Typography>
          <Typography sx={{ mb: 2, lineHeight: 1.75, color: '#1f2937', fontSize: '1rem' }}>
            ApplyForMe was founded by Sneha Achunala and Ojus Madan, two individuals who experienced firsthand how demanding and repetitive modern job searching can be. Having navigated the challenges of online applications, limited responses, and the pressure to stay consistent, they recognised a simple truth: The hardest part of job searching is not ability. It is maintaining momentum.
          </Typography>
          <Typography sx={{ mb: 2, lineHeight: 1.75, color: '#1f2937', fontSize: '1rem' }}>
            Sneha and Ojus created ApplyForMe to remove the most draining part of the process, repetitive application submission, so job seekers can focus on what truly matters: preparing for interviews and progressing in their careers. Their vision was not to build automation or shortcuts, but to build a structured, human-supported system that helps people stay consistent even when life gets busy.
          </Typography>
          <Typography sx={{ mb: 3, lineHeight: 1.75, color: '#1f2937', fontSize: '1rem' }}>
            Today, ApplyForMe supports job seekers across Australia with a clear mission: Make job searching more manageable. Make consistency easier. Help capable people move forward with confidence.
          </Typography>

          {/* Footer */}
          <Typography
            sx={{
              fontWeight: 700,
              color: '#111827',
              fontSize: '1.125rem',
            }}
          >
            ApplyForMe
          </Typography>
          <Typography sx={{ color: '#64748b', fontStyle: 'italic' }}>
            Career support for job seekers who want momentum.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
