import React from 'react';
import { Box, Card, CardContent, Typography, Avatar } from '@mui/material';

export default function StatCard({ title, value, change, trend, iconClass, color, delay = 0 }) {
  const isUp = trend === 'up';

  return (
    <Card
      className="animate-fade-in-up"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        animationDelay: `${delay * 0.06}s`,
        opacity: 0,
        animationFillMode: 'forwards',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '4px',
          height: '100%',
          backgroundColor: color || '#034cae',
          borderRadius: '4px 0 0 4px',
        },
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontWeight: 500,
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                mb: 1,
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: 'text.primary',
                fontSize: { xs: '1.5rem', md: '1.75rem' },
                lineHeight: 1,
                mb: 1,
              }}
            >
              {value}
            </Typography>
            {change && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <i 
                  className={isUp ? 'bi bi-arrow-up-short' : 'bi bi-arrow-down-short'} 
                  style={{ 
                    fontSize: '1.1rem', 
                    color: isUp ? '#10b981' : '#ef4444',
                    fontWeight: 'bold'
                  }}
                ></i>
                <Typography
                  variant="caption"
                  sx={{
                    color: isUp ? '#10b981' : '#ef4444',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                  }}
                >
                  {change}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                  vs last month
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              backgroundColor: '#f8fafc',
              color: '#475569',
              border: '1px solid #e2e8f0',
              borderRadius: 3,
            }}
          >
            <i className={iconClass} style={{ fontSize: '1.25rem', color: '#475569' }}></i>
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
}
