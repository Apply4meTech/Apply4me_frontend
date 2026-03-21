'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';

const cards = [
  {
    title: 'Not a Recruitment Agency',
    tags: ['We work exclusively for you', 'Not for employers', 'No placement guarantees'],
  },
  {
    title: 'Not an AI Tool',
    tags: ['No bots', 'No bulk submissions', 'No shortcuts'],
  },
  {
    title: 'Built for the Australian Market',
    tags: ['Local job boards', 'Local roles', 'Australia-specific job expertise'],
  },
];

export default function HowWeAreDifferent() {
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
        backgroundColor: '#fff',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          component="h2"
          sx={{
            fontSize: { xs: '1.75rem', md: '2.25rem' },
            fontWeight: 700,
            color: '#111',
            textAlign: 'center',
            marginBottom: 3,
            fontFamily: 'inherit',
          }}
        >
          Why We're Different
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 2,
            alignItems: 'stretch',
          }}
        >
          {cards.map((card, index) => (
            <Box
              key={card.title}
              sx={{
                // Match the landing page gradient colors (vertical shade)
                background: 'linear-gradient(180deg, #09316f 0%, #115ace 100%)',
                borderRadius: '32px',
                padding: 2.5,
                boxShadow: '0 14px 44px rgba(37,99,235,0.18)',
                border: '1px solid rgba(255,255,255,0.18)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(30px)',
                transition: `opacity 0.6s ease-out ${0.1 + index * 0.1}s, transform 0.6s ease-out ${0.1 + index * 0.1}s`,
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography
                  sx={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    textAlign: 'center',
                    fontFamily: 'inherit',
                    lineHeight: 1.3,
                    maxWidth: '100%',
                  }}
                >
                  {card.title}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.75,
                  width: '100%',
                }}
              >
                {card.tags.map((tag) => (
                  <Box
                    key={tag}
                    sx={{
                      // Glassy + lighter pill backgrounds
                      background: 'rgba(255,255,255,0.10)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '1px solid rgba(147,197,253,0.32)',
                      borderRadius: '50px',
                      padding: '0.5rem 1.25rem',
                      color: 'rgba(255,255,255,0.95)',
                      fontSize: '0.875rem',
                      width: 'fit-content',
                      fontFamily: 'inherit',
                      boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.06)',
                    }}
                  >
                    {tag}
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
