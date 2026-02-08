'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import CompanyLogos from '../../CompanyLogos';

const testimonials = [
  {
    id: 1,
    title: "Not a recruitment agency",
    points: ["We work for you", "Not employers", "No placement promises"],
  },
  {
    id: 2,
    title: "Not an AI apply tool",
    points: ["No bots", "No mass submissions", "No shortcuts"],
  },
  {
    id: 3,
    title: "Built for Australia",
    points: ["Local job boards", "Local roles", "Australian market focus"],
  },
];


export default function SuccessStories() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Auto-scroll functionality
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const cardWidth = container.offsetWidth;
      const scrollPosition = container.scrollLeft;
      const newIndex = Math.round(scrollPosition / cardWidth);
      setCurrentIndex(newIndex);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Touch/Mouse drag handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const scrollToCard = (index) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const cardWidth = container.offsetWidth;
    container.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth',
    });
  };

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
        padding: { xs: '3rem 1.5rem', md: '5rem 2rem' },
        backgroundColor: '#EDF2F7',
      }}
    >
      <Container maxWidth="lg">
        {/* Heading */}
        <Typography
          ref={headingRef}
          component="h2"
          sx={{
            fontSize: { xs: '1.875rem', md: '2.25rem' },
            fontWeight: 700,
            color: '#1F2937',
            textAlign: 'center',
            marginBottom: { xs: '2rem', md: '3rem' },
            fontFamily: 'inherit',
            opacity: headingVisible ? 1 : 0,
            transform: headingVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
          }}
        >
          How We Are Different
        </Typography>

        {/* Slider Container */}
        <Box
          ref={cardsRef}
          sx={{
            opacity: cardsVisible ? 1 : 0,
            transform: cardsVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.6s ease-out 0.2s, transform 0.6s ease-out 0.2s',
          }}
        >
          <Box
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            sx={{
              display: 'flex',
              overflowX: { xs: 'auto', md: 'visible' },
              scrollSnapType: { xs: 'x mandatory', md: 'none' },
              scrollBehavior: 'smooth',
              gap: { xs: '1.5rem', md: '2rem' },
              paddingBottom: { xs: '1rem', md: '0' },
              cursor: { xs: isDragging ? 'grabbing' : 'grab', md: 'default' },
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
          {testimonials.map((testimonial) => (
  <Box
    key={testimonial.id}
    sx={{
      minWidth: {
        xs: "85%",
        sm: "70%",
        md: "calc(33.333% - 1.33rem)",
      },
      flexShrink: 0,
      backgroundColor: "#FFFFFF",
      borderRadius: "1.25rem",
      padding: { xs: "1.75rem", md: "2.25rem" },
      boxShadow: "0 0.25rem 1rem rgba(0,0,0,0.08)",
      transition: "all 0.35s ease",
      scrollSnapAlign: { xs: "start", md: "none" },

      "&:hover": {
        transform: "translateY(-8px)",
        boxShadow: "0 0.75rem 2rem rgba(0,0,0,0.12)",
      },
    }}
  >
    {/* Title */}
    <Typography
      sx={{
        fontSize: { xs: "1.25rem", md: "1.4rem" },
        fontWeight: 800,
        color: "#111827",
        marginBottom: "1.25rem",
      }}
    >
      {testimonial.title}
    </Typography>

    {/* Bullet Points */}
    <Box
      component="ul"
      sx={{
        paddingLeft: "1.25rem",
        margin: 0,
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}
    >
      {testimonial.points.map((point, i) => (
        <Typography
          key={i}
          component="li"
          sx={{
            fontSize: "1rem",
            color: "#374151",
            lineHeight: 1.6,
          }}
        >
          {point}
        </Typography>
      ))}
    </Box>
  </Box>
))}

          </Box>
        </Box>

        {/* Company Logos Section */}
        <Box sx={{ mt: { xs: '4rem', md: '5rem' } }}>
          <Typography
            component="h3"
            sx={{
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              fontWeight: 700,
              color: '#1F2937',
              textAlign: 'center',
              marginBottom: { xs: '2rem', md: '3rem' },
              fontFamily: 'inherit',
            }}
          >
            Our Clients Get Hired At
          </Typography>
          <CompanyLogos title="Our Clients Get Hired At" />
        </Box>
      </Container>
    </Box>
  );
}

