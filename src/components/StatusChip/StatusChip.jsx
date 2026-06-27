import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { getStatusColor, getStatusBgColor } from '../../utils/helpers';

export default function StatusChip({ status, size = 'small' }) {
  return (
    <Chip
      label={status}
      size={size}
      sx={{
        backgroundColor: getStatusBgColor(status),
        color: getStatusColor(status),
        fontWeight: 600,
        fontSize: '0.75rem',
        borderRadius: '8px',
        border: `1px solid ${getStatusColor(status)}20`,
        '& .MuiChip-label': {
          px: 1.5,
        },
      }}
    />
  );
}
