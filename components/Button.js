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
    backgroundColor: '#3B82F6',
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#2563EB',
      transform: 'translateY(-0.0625rem)',
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

