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
                background: 'linear-gradient(180deg, #2d52b0 0%, #1e3a8a 100%)',
                borderRadius: '32px',
                padding: 2.5,
                boxShadow: '0 8px 32px rgba(30,58,138,0.25)',
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
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: '#93C5FD',
                    flexShrink: 0,
                  }}
                />
                <Typography
                  sx={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    textAlign: 'right',
                    fontFamily: 'inherit',
                    lineHeight: 1.3,
                    maxWidth: '80%',
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
                      background: 'rgba(15,23,42,0.5)',
                      border: '1px solid rgba(147,197,253,0.4)',
                      borderRadius: '50px',
                      padding: '0.5rem 1.25rem',
                      color: '#fff',
                      fontSize: '0.875rem',
                      width: 'fit-content',
                      fontFamily: 'inherit',
                      boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.2)',
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
