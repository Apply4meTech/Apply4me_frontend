'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';

const testimonials = [
  {
    id: 1,
    quote: "I got 5 interviews in the first week without lifting a finger. The salary negotiation help alone paid for the service 10x over.",
    name: "Sarah Jenkins",
    title: "Product Manager at TechCo",
    avatarColor: "#F5E6D3",
  },
  {
    id: 2,
    quote: "Honestly, I was skeptical. But after they revamped my resume and started applying, my inbox exploded. Best investment ever.",
    name: "Michael T.",
    title: "Senior Developer",
    avatarColor: "#D1FAE5",
  },
  {
    id: 3,
    quote: "The team at APPLY FOR ME are wizards. They understood exactly what I wanted and found roles I wouldn't have found myself.",
    name: "Elena Rodriguez",
    title: "Marketing Director",
    avatarColor: "#1F2937",
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
          component="h2"
          sx={{
            fontSize: { xs: '1.875rem', md: '2.25rem' },
            fontWeight: 700,
            color: '#1F2937',
            textAlign: 'center',
            marginBottom: { xs: '2rem', md: '3rem' },
            fontFamily: 'inherit',
          }}
        >
          Success Stories
        </Typography>

        {/* Slider Container */}
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
                minWidth: { xs: '85%', sm: '70%', md: 'calc(33.333% - 1.33rem)', lg: 'calc(33.333% - 1.33rem)' },
                maxWidth: { xs: '85%', sm: '70%', md: 'calc(33.333% - 1.33rem)', lg: 'calc(33.333% - 1.33rem)' },
                width: { md: 'calc(33.333% - 1.33rem)' },
                scrollSnapAlign: { xs: 'start', md: 'none' },
                flexShrink: 0,
                backgroundColor: '#FFFFFF',
                borderRadius: '1rem',
                padding: { xs: '1.5rem', md: '2rem' },
                boxShadow: '0 0.125rem 0.5rem rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              {/* Star Rating */}
              <Box
                sx={{
                  display: 'flex',
                  gap: '0.25rem',
                }}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    width="1.25rem"
                    height="1.25rem"
                    viewBox="0 0 24 24"
                    fill="#FBBF24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                ))}
              </Box>

              {/* Testimonial Quote */}
              <Typography
                component="p"
                sx={{
                  fontSize: '1.125rem',
                  color: '#374151',
                  fontStyle: 'italic',
                  lineHeight: 1.75,
                  fontFamily: 'inherit',
                  flex: 1,
                }}
              >
                "{testimonial.quote}"
              </Typography>

              {/* Reviewer Info */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginTop: '0.5rem',
                }}
              >
                {/* Avatar */}
                <Box
                  sx={{
                    width: { xs: '2.5rem', md: '3rem' },
                    height: { xs: '2.5rem', md: '3rem' },
                    borderRadius: '50%',
                    backgroundColor: testimonial.avatarColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {testimonial.avatarColor === '#1F2937' ? (
                    <svg
                      width="60%"
                      height="60%"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                        fill="#FFFFFF"
                      />
                      <path
                        d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z"
                        fill="#FFFFFF"
                      />
                    </svg>
                  ) : (
                    <Box
                      sx={{
                        width: '60%',
                        height: '60%',
                        borderRadius: '50%',
                        backgroundColor: testimonial.avatarColor === '#F5E6D3' ? '#D97706' : '#059669',
                        opacity: 0.3,
                      }}
                    />
                  )}
                </Box>

                {/* Name and Title */}
                <Box>
                  <Typography
                    component="div"
                    sx={{
                      fontSize: { xs: '0.875rem', md: '1rem' },
                      fontWeight: 700,
                      color: '#1F2937',
                      fontFamily: 'inherit',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {testimonial.name}
                  </Typography>
                  <Typography
                    component="div"
                    sx={{
                      fontSize: { xs: '0.75rem', md: '0.875rem' },
                      color: '#6B7280',
                      fontFamily: 'inherit',
                    }}
                  >
                    {testimonial.title}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

