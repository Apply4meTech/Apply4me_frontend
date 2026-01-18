'use client';

import React from 'react';
import { styled } from '@mui/material/styles';

const StyledButton = styled('button')(({ variant, fullWidth }) => ({
  fontFamily: 'inherit',
  fontWeight: 500,
  fontSize: '1rem',
  lineHeight: 1.5,
  padding: '0.75rem 1.5rem',
  borderRadius: '0.5rem',
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
    borderRadius: '0.75rem',
    fontWeight: 700,
    fontSize: '0.875rem',
    padding: '0.625rem 1.25rem',
    boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
    '&:hover': {
      filter: 'brightness(1.1)',
      boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.3)',
    },
  }),
  ...(variant === 'secondary' && {
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    border: '0.0625rem solid #FFFFFF',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      transform: 'translateY(-0.0625rem)',
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

