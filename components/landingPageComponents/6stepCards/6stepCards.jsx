'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';

const steps = [
  {
    number: 1,
    title: 'Tell Us About You',
    description: 'Share your experience, target roles, preferences and resume through our onboarding form.',
    gradient: 'linear-gradient(180deg, #4b6be0 0%, #6b5bdb 50%, #5a4dbf 100%)',
    titleColor: '#F5C518',
    textColor: 'rgba(255,255,255,0.9)',
    mock: (
      <Box sx={{ mt: 'auto', pt: 2 }}>
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
          <Box sx={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '9999px', px: 2, py: 0.75, fontSize: '0.8125rem', color: '#fff' }}>👤 Jessica F.</Box>
          <Box sx={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '9999px', px: 2, py: 0.75, fontSize: '0.8125rem', color: '#fff' }}>💰 $160K Annually</Box>
        </Box>
        <Box sx={{ background: 'rgba(255,255,255,0.15)', borderRadius: '12px', p: 1.5, color: 'rgba(255,255,255,0.9)', fontSize: '0.8125rem' }}>I want a role in graphic design...</Box>
      </Box>
    ),
  },
  {
    number: 2,
    title: 'Select Roles to Apply For',
    description: "Provide job links you're interested in or let us shortlist opportunities that fit your criteria — you stay in control.",
    gradient: 'linear-gradient(180deg, #f5c518 0%, #e8a80a 50%, #d4940a 100%)',
    titleColor: '#1e3a8a',
    textColor: 'rgba(30,58,138,0.9)',
    mock: (
      <Box sx={{ mt: 'auto', pt: 2, display: 'flex', gap: 1 }}>
        <Box sx={{ background: 'rgba(255,255,255,0.5)', borderRadius: '12px', p: 1.5, flex: 1, color: '#1e3a8a', fontSize: '0.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <strong>Product Designer</strong><br />Adobe · Full-Time
        </Box>
        <Box sx={{ background: 'rgba(255,255,255,0.5)', borderRadius: '12px', p: 1.5, flex: 1, color: '#1e3a8a', fontSize: '0.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <strong>Software Engineer</strong><br />Google · Full-Time
        </Box>
      </Box>
    ),
  },
  {
    number: 3,
    title: 'We Apply for You',
    description: 'Our team manually submits each application using your details. You can track progress and stay updated.',
    gradient: 'linear-gradient(180deg, #4b6be0 0%, #6b5bdb 50%, #5a4dbf 100%)',
    titleColor: '#F5C518',
    textColor: 'rgba(255,255,255,0.9)',
    mock: (
      <Box sx={{ mt: 'auto', pt: 2 }}>
        <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
          <Box sx={{ background: 'rgba(255,255,255,0.2)', borderRadius: '9999px', px: 1.5, py: 0.5, fontSize: '0.75rem', color: '#fff' }}>Saved (9)</Box>
          <Box sx={{ background: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.45)', borderRadius: '9999px', px: 1.5, py: 0.5, fontSize: '0.75rem', fontWeight: 600, color: '#fff' }}>Applied (22)</Box>
          <Box sx={{ background: 'rgba(255,255,255,0.2)', borderRadius: '9999px', px: 1.5, py: 0.5, fontSize: '0.75rem', color: '#fff' }}>Interviews (6)</Box>
        </Box>
        <Box sx={{ background: 'rgba(255,255,255,0.15)', borderRadius: '12px', p: 1.25, display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
          <span style={{ fontSize: '0.8125rem', color: '#fff' }}>🔍 Software Engineer — Google</span>
          <Box sx={{ background: 'rgba(255,255,255,0.2)', borderRadius: '9999px', px: 1, py: 0.25, fontSize: '0.6875rem', color: '#fff' }}>$200K+</Box>
        </Box>
        <Box sx={{ background: 'rgba(255,255,255,0.15)', borderRadius: '12px', p: 1.25, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8125rem', color: '#fff' }}>🎨 Product Designer — Adobe</span>
          <Box sx={{ background: 'rgba(255,255,255,0.2)', borderRadius: '9999px', px: 1, py: 0.25, fontSize: '0.6875rem', color: '#fff' }}>$160K+</Box>
        </Box>
      </Box>
    ),
  },
];

const logos = [
  { src: 'https://cdn.simpleicons.org/google/4285F4', top: '15%', left: '8%' },
  { src: 'https://cdn.simpleicons.org/apple/000000', top: '25%', right: '12%' },
  { src: 'https://cdn.simpleicons.org/behance/1769FF', top: '60%', left: '5%' },
  { src: 'https://cdn.simpleicons.org/github/181717', top: '70%', right: '8%' },
  { src: 'https://cdn.simpleicons.org/mcdonalds/FBC817', top: '40%', left: '15%' },
  { src: 'https://cdn.simpleicons.org/atlassian/0052CC', top: '50%', right: '18%' },
];

export default function SixStepCards() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => ref.current && observer.unobserve(ref.current);
  }, []);

  return (
    <Box
      ref={ref}
      sx={{
        padding: { xs: '4rem 1.5rem', md: '5rem 2rem' },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Floating logos */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.08,
        }}
      >
        {logos.map((logo, i) => (
          <Box
            key={i}
            component="img"
            src={logo.src}
            alt=""
            sx={{
              position: 'absolute',
              width: 48,
              height: 48,
              borderRadius: '50%',
              objectFit: 'contain',
              background: '#fff',
              p: 0.75,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              top: logo.top,
              ...(logo.left && { left: logo.left }),
              ...(logo.right && { right: logo.right }),
            }}
          />
        ))}
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: '1.875rem', md: '2.5rem' },
              fontWeight: 700,
              color: '#111',
              marginBottom: 1,
              fontFamily: 'inherit',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
            }}
          >
            How Our Service Works
          </Typography>
          <Typography
            component="p"
            sx={{
              fontSize: '1.0625rem',
              color: '#6b7280',
              maxWidth: 560,
              mx: 'auto',
              lineHeight: 1.7,
              fontFamily: 'inherit',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s ease-out 0.1s, transform 0.6s ease-out 0.1s',
            }}
          >
            We don't use bots or shortcuts — we manually submit tailored applications on your behalf. Most job seekers fail to get responses because applications are rushed and generic. Our approach is strategic, accurate, and professional.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 2,
          }}
        >
          {steps.map((step, index) => (
            <Box
              key={step.number}
              sx={{
                background: step.gradient,
                borderRadius: '2rem',
                padding: 2,
                minHeight: 380,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(30px)',
                transition: `opacity 0.6s ease-out ${0.1 + index * 0.1}s, transform 0.6s ease-out ${0.1 + index * 0.1}s`,
              }}
            >
              <Typography
                component="h3"
                sx={{
                  fontSize: '1.375rem',
                  fontWeight: 700,
                  color: step.titleColor,
                  fontFamily: 'inherit',
                  mb: 1,
                }}
              >
                {step.number}. {step.title}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  color: step.textColor,
                  lineHeight: 1.75,
                  fontFamily: 'inherit',
                }}
              >
                {step.description}
              </Typography>
              {step.mock}
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
