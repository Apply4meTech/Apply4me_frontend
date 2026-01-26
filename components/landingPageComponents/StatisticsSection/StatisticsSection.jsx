'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, Container } from '@mui/material';
import StatCard from '../../StatCard';

export default function StatisticsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <Box
      sx={{
        padding: { xs: '2rem 1.5rem', md: '2rem 2rem' },
        paddingTop: { xs: '1rem', md: '2rem' },
        marginTop: { xs: '0', md: '0' },
      }}
    >
      <Container maxWidth="lg">
        <Box
          ref={ref}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: '1.5rem', md: '2rem' },
            flexWrap: 'wrap',
          }}
        >
          {[
            { number: '500+', title: 'Clients Hired', description: 'At top Fortune 500 companies' },
            { number: '35%', title: 'Avg Salary Increase', description: 'Negotiated by our experts' },
            { number: '90%', title: 'Interview Rate', description: 'Within the first 30 days' },
          ].map((stat, index) => (
            <Box
              key={index}
              sx={{
                flex: { xs: '1 1 100%', sm: '1 1 calc(33.333% - 1.33rem)' },
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
                transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
                transitionDelay: `${index * 0.15}s`,
              }}
            >
              <StatCard
                number={stat.number}
                title={stat.title}
                description={stat.description}
              />
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

