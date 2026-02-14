'use client';

import React from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';

export default function AboutUs() {
  return (
      <Box
        sx={{
          minHeight: '100vh',
          py: { xs: 4, md: 6 },
          backgroundColor: '#f8fafc',
          fontFamily: '"Manrope", sans-serif',
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              backgroundColor: 'white',
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#1E293B',
                mb: 3,
              }}
            >
              About Us
            </Typography>

            <Typography sx={{ mb: 2, lineHeight: 1.75, color: '#334155' }}>
              We started ApplyForMe for one simple reason. Job searching today is exhausting. Between work, study, and daily life, most people do not have the time or energy to apply to dozens of jobs every week. Applications get delayed, opportunities get missed, and the whole process becomes overwhelming. We wanted to build something that genuinely helps.
            </Typography>

            <Typography
              component="h2"
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#1E293B',
                mt: 3,
                mb: 1,
              }}
            >
              Our Story
            </Typography>
            <Typography sx={{ mb: 2, lineHeight: 1.75, color: '#334155' }}>
              ApplyForMe was created to support job seekers who are capable and motivated but simply do not have the time to keep up with constant applications. We saw friends, classmates, and professionals spending hours every day applying online with little response. The biggest barrier was not talent. It was consistency. So we built a service that handles the application process for you. Not with bots. Not with automation spam. But with real people who understand how job applications actually work.
            </Typography>

            <Typography
              component="h2"
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#1E293B',
                mt: 3,
                mb: 1,
              }}
            >
              What We Do
            </Typography>
            <Typography sx={{ mb: 1, lineHeight: 1.75, color: '#334155' }}>
              When you join ApplyForMe, you are assigned a real human assistant who manages your applications based on your goals, experience, and preferences. We help by
            </Typography>
            <Box component="ul" sx={{ pl: 3, mb: 2, '& li': { mb: 0.5 } }}>
              <li><Typography component="span" sx={{ lineHeight: 1.75, color: '#334155' }}>Submitting applications consistently</Typography></li>
              <li><Typography component="span" sx={{ lineHeight: 1.75, color: '#334155' }}>Targeting roles that match your profile</Typography></li>
              <li><Typography component="span" sx={{ lineHeight: 1.75, color: '#334155' }}>Keeping your job search organised</Typography></li>
              <li><Typography component="span" sx={{ lineHeight: 1.75, color: '#334155' }}>Saving you hours every week</Typography></li>
            </Box>
            <Typography sx={{ mb: 2, lineHeight: 1.75, color: '#334155' }}>
              You focus on preparing for interviews and moving forward. We handle the repetitive application work behind the scenes.
            </Typography>

            <Typography
              component="h2"
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#1E293B',
                mt: 3,
                mb: 1,
              }}
            >
              Who We Help
            </Typography>
            <Typography sx={{ mb: 1, lineHeight: 1.75, color: '#334155' }}>
              We work with job seekers across Australia, including
            </Typography>
            <Box component="ul" sx={{ pl: 3, mb: 2, '& li': { mb: 0.5 } }}>
              <li><Typography component="span" sx={{ lineHeight: 1.75, color: '#334155' }}>Students and graduates</Typography></li>
              <li><Typography component="span" sx={{ lineHeight: 1.75, color: '#334155' }}>Skilled migrants</Typography></li>
              <li><Typography component="span" sx={{ lineHeight: 1.75, color: '#334155' }}>Professionals changing roles</Typography></li>
              <li><Typography component="span" sx={{ lineHeight: 1.75, color: '#334155' }}>Anyone actively searching for work</Typography></li>
            </Box>
            <Typography sx={{ mb: 2, lineHeight: 1.75, color: '#334155' }}>
              Whether you are applying for your first job or your next step, we are here to support the process.
            </Typography>

            <Typography
              component="h2"
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#1E293B',
                mt: 3,
                mb: 1,
              }}
            >
              Our Approach
            </Typography>
            <Typography sx={{ mb: 1, lineHeight: 1.75, color: '#334155' }}>
              We believe job searching should feel supported, not overwhelming. That means
            </Typography>
            <Box component="ul" sx={{ pl: 3, mb: 2, '& li': { mb: 0.5 } }}>
              <li><Typography component="span" sx={{ lineHeight: 1.75, color: '#334155' }}>Clear pricing</Typography></li>
              <li><Typography component="span" sx={{ lineHeight: 1.75, color: '#334155' }}>Real human support</Typography></li>
              <li><Typography component="span" sx={{ lineHeight: 1.75, color: '#334155' }}>Honest expectations</Typography></li>
              <li><Typography component="span" sx={{ lineHeight: 1.75, color: '#334155' }}>No unrealistic promises</Typography></li>
            </Box>
            <Typography sx={{ mb: 2, lineHeight: 1.75, color: '#334155' }}>
              We do not guarantee jobs or interviews because no service can. What we do guarantee is that your applications are being sent out consistently and professionally, which is often the hardest part of the process.
            </Typography>

            <Typography
              component="h2"
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#1E293B',
                mt: 3,
                mb: 1,
              }}
            >
              Why ApplyForMe
            </Typography>
            <Typography sx={{ mb: 3, lineHeight: 1.75, color: '#334155' }}>
              Sometimes the biggest difference in a job search is not talent. It is consistency. We help you stay consistent and keep momentum in your job search.
            </Typography>

            <Typography
              sx={{
                fontWeight: 700,
                color: '#1E293B',
                fontSize: '1.125rem',
              }}
            >
              ApplyForMe
            </Typography>
            <Typography sx={{ color: '#64748b', fontStyle: 'italic' }}>
              Career support for job seekers who want momentum.
            </Typography>
          </Paper>
        </Container>
      </Box>
  );
}
