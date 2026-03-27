'use client';

import React from 'react';
import { Box, Typography, Paper, Stack, Chip } from '@mui/material';
import ExtensionIcon from '@mui/icons-material/Extension';
import Link from 'next/link';
import { getAddonDisplayLabel } from '../../utils/addonCatalog';

/**
 * Lists purchased one-time add-ons by friendly name (from addon catalog).
 * @param {{ purchasedAddons?: Array<{ name: string, purchasedAt?: string }>, loading?: boolean, sx?: object }} props
 */
export default function YourAddonsSection({ purchasedAddons = [], loading = false, sx = {} }) {
  if (loading) {
    return null;
  }

  const list = Array.isArray(purchasedAddons) ? purchasedAddons : [];

  if (list.length === 0) {
    return null;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        mb: 3,
        ...sx,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <ExtensionIcon sx={{ color: '#2463eb', fontSize: 22 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
          Your add-ons
        </Typography>
      </Box>
      <Typography sx={{ fontSize: '0.875rem', color: '#64748b', mb: 2 }}>
        One-time purchases on your account. Need more? See{' '}
        <Link href="/pricing" style={{ color: '#2463eb', fontWeight: 600 }}>
          pricing
        </Link>
        .
      </Typography>
      <Stack direction="column" spacing={1.25} alignItems="flex-start">
        {list.map((a) => {
          const key = `${a.name}-${a.purchasedAt || ''}`;
          const purchased =
            a.purchasedAt != null
              ? new Date(a.purchasedAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : null;
          return (
            <Box
              key={key}
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 1,
                width: '100%',
              }}
            >
              <Chip
                label={getAddonDisplayLabel(a.name)}
                sx={{
                  bgcolor: '#eff6ff',
                  color: '#1e40af',
                  fontWeight: 600,
                  border: '1px solid #bfdbfe',
                  height: 'auto',
                  py: 0.5,
                  '& .MuiChip-label': { whiteSpace: 'normal', lineHeight: 1.35 },
                }}
              />
              {purchased && (
                <Typography component="span" sx={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
                  Purchased {purchased}
                </Typography>
              )}
            </Box>
          );
        })}
      </Stack>
    </Paper>
  );
}
