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
    image: '/hw_1.png',
  },
  {
    number: 2,
    title: 'Select Roles to Apply For',
    description: "Provide job links you're interested in or let us shortlist opportunities that fit your criteria — you stay in control.",
    gradient: 'linear-gradient(180deg, #f5c518 0%, #e8a80a 50%, #d4940a 100%)',
    titleColor: '#1e3a8a',
    textColor: 'rgba(30,58,138,0.9)',
    image: '/hw_2.png',
  },
  {
    number: 3,
    title: 'We Apply for You',
    description: 'Our team manually submits each application using your details. You can track progress and stay updated.',
    gradient: 'linear-gradient(180deg, #4b6be0 0%, #6b5bdb 50%, #5a4dbf 100%)',
    titleColor: '#F5C518',
    textColor: 'rgba(255,255,255,0.9)',
    image: '/hw_3.png',
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
              <Box
                sx={{
                  mt: 'auto',
                  pt: 2,
                  borderRadius: '16px',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {step.number === 1 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 12,
                      left: 0,
                      right: 0,
                      zIndex: 2,
                      height: '100%',
                      pointerEvents: 'none',
                    }}
                  >
                    {[
                      { text: 'Jessica F.', left: '28%', top: 8 },
                      { text: '$160k Annual', left: '35%', top: 44 },
                      { text: 'I want a role in graphics', left: '14%', top: 80 },
                    ].map((item) => (
                      <Box
                        key={item.text}
                        sx={{
                          position: 'absolute',
                          left: item.left,
                          top: item.top,
                          background: 'rgba(255,255,255,0.18)',
                          border: '1px solid rgba(255,255,255,0.35)',
                          backdropFilter: 'blur(8px)',
                          WebkitBackdropFilter: 'blur(8px)',
                          borderRadius: '9999px',
                          px: 1.25,
                          py: 0.55,
                          color: '#FFFFFF',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.text}
                      </Box>
                    ))}
                  </Box>
                )}
                <Box
                  component="img"
                  src={step.image}
                  alt={`${step.title} illustration`}
                  sx={{
                    width: '100%',
                    height: { xs: 170, md: 185 },
                    objectFit: 'contain',
                    objectPosition: step.number === 1 ? 'right center' : 'center',
                    display: 'block',
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
