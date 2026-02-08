'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';

const steps = [
  {
    number: 1,
    title: 'Share your details',
    description:
      'Tell us about your experience, the roles you are targeting, and where you want to work. Upload your resume and preferences through our onboarding form.',
    bgColor: '#EFF6FF', // pastel blue
  },
  {
    number: 2,
    title: 'Choose jobs to apply for',
    description:
      'Share job links you like or let us help shortlist suitable roles based on your criteria. You stay in control of what we apply to.',
    bgColor: '#ECFDF3', // pastel green
  },
  {
    number: 3,
    title: 'We submit applications for you',
    description:
      'Our team manually applies to each role using your information. You can track progress and see what has been applied to.',
    bgColor: '#FFF7ED', // pastel orange
  },
];


export default function SixStepCards() {
  const [headingVisible, setHeadingVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const headingRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    const headingObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeadingVisible(true);
          headingObserver.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const cardsObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCardsVisible(true);
          cardsObserver.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (headingRef.current) headingObserver.observe(headingRef.current);
    if (cardsRef.current) cardsObserver.observe(cardsRef.current);

    return () => {
      if (headingRef.current) headingObserver.unobserve(headingRef.current);
      if (cardsRef.current) cardsObserver.unobserve(cardsRef.current);
    };
  }, []);

  return (
    <Box
      sx={{
        padding: { xs: '2rem 1.5rem', md: '3rem 2rem' },
        paddingTop: { xs: '1rem', md: '2rem' },
        marginTop:'50px'
      }}
    >
      <Container maxWidth="lg">
        {/* Heading */}
        <Box ref={headingRef}>
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: '1.875rem', md: '2.25rem' },
              fontWeight: 700,
              color: '#1F2937',
              textAlign: 'center',
              marginBottom: '1rem',
              fontFamily: 'inherit',
              opacity: headingVisible ? 1 : 0,
              transform: headingVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
            }}
          >
            How ApplyForMe Works
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
              opacity: headingVisible ? 1 : 0,
              transform: headingVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s ease-out 0.2s, transform 0.6s ease-out 0.2s',
            }}
          >
Most job applications fail because they are rushed or generic.
 We use real people to submit applications carefully and accurately on your behalf.
          </Typography>
        </Box>

        {/* Cards Grid */}
        <Box
          ref={cardsRef}
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
          {steps.map((step, index) => (
            <Box
              key={step.number}
              sx={{
                backgroundColor: step.bgColor,
                borderRadius: '1rem',
                padding: { xs: '1.5rem', md: '2rem' },
                boxShadow: '0 0.125rem 0.5rem rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                transition: 'transform 0.4s ease, box-shadow 0.4s ease, opacity 0.4s ease',
                opacity: cardsVisible ? 1 : 0,
                transform: cardsVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
                transitionDelay: `${index * 0.1}s`,
                '&:hover': {
                  transform: 'translateY(-0.5rem) scale(1.02)',
                  boxShadow: '0 0.5rem 1.5rem rgba(0, 0, 0, 0.15)',
                },
              }}
            >

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
                {step.number}. {step.title}
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
