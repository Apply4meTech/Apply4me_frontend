'use client';

import React from 'react';
import { Chip, Tooltip, LinearProgress, Box, Typography } from '@mui/material';

/**
 * Shows plan usage e.g. 24/90 with optional progress bar.
 * @param {{ planQuota?: { display?: string, used?: number, limit?: number|null, percentUsed?: number|null, planName?: string|null, isAtLimit?: boolean }|null, size?: 'small'|'medium', showProgress?: boolean }} props
 */
export default function PlanQuotaChip({ planQuota, size = 'small', showProgress = false }) {
  if (!planQuota) {
    return (
      <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>—</Typography>
    );
  }

  const { display, used, limit, percentUsed, planName, isAtLimit } = planQuota;
  const label = display || (limit != null ? `${used}/${limit}` : String(used ?? 0));
  const tooltip = planName
    ? `${planName} plan · ${used} of ${limit ?? '∞'} total tokens used · AFM ${planQuota.afmUsed ?? 0}/${planQuota.afmLimit ?? '∞'} · CX ${planQuota.customerProvidedUsed ?? 0}/${planQuota.customerProvidedLimit ?? '∞'}`
    : `${used} jobs submitted`;

  const chip = (
    <Chip
      label={label}
      size={size}
      sx={{
        fontWeight: 700,
        bgcolor: isAtLimit ? '#fee2e2' : '#f0fdf4',
        color: isAtLimit ? '#dc2626' : '#16a34a',
        border: isAtLimit ? '1px solid #fecaca' : '1px solid #bbf7d0',
      }}
    />
  );

  if (!showProgress) {
    return (
      <Tooltip
        title={tooltip}
      >
        {chip}
      </Tooltip>
    );
  }

  return (
    <Box sx={{ minWidth: 100 }}>
      <Tooltip title={tooltip}>{chip}</Tooltip>
      {limit != null && limit > 0 && (
        <LinearProgress
          variant="determinate"
          value={percentUsed ?? 0}
          sx={{
            mt: 0.5,
            height: 4,
            borderRadius: 2,
            bgcolor: '#e2e8f0',
            '& .MuiLinearProgress-bar': {
              bgcolor: isAtLimit ? '#dc2626' : '#16a34a',
            },
          }}
        />
      )}
    </Box>
  );
}
