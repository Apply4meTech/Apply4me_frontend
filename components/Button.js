'use client';

import React from 'react';
import { styled } from '@mui/material/styles';

const StyledButton = styled('button')(({ variant, fullWidth }) => ({
  fontFamily: 'inherit',
  fontWeight: 700,
  fontSize: '1rem',
  lineHeight: 1.5,
  padding: '1rem 2rem',
  borderRadius: '0.75rem',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  width: fullWidth ? '100%' : 'auto',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  textDecoration: 'none',
  ...(variant === 'primary' && {
    background: 'linear-gradient(135deg, #2563EB 0%, #1E3A8A 100%)',
    color: '#FFFFFF',
    border: '1px solid transparent',
    boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3), 0 4px 6px -2px rgba(37, 99, 235, 0.2)',
    '&:hover': {
      filter: 'brightness(110%)',
      transform: 'scale(1.02)',
    },
  }),
  ...(variant === 'secondary' && {
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(4px)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      transform: 'scale(1.02)',
    },
  }),
}));

export default function Button({ 
  children, 
  variant = 'primary', 
  onClick, 
  type = 'button',
  fullWidth = false,
  ...props 
}) {
  return (
    <StyledButton
      variant={variant}
      onClick={onClick}
      type={type}
      fullWidth={fullWidth}
      {...props}
    >
      {children}
    </StyledButton>
  );
}

