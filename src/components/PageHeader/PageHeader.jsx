import React from 'react';
import { Box, Typography, Button, Breadcrumbs, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function PageHeader({ title, subtitle, breadcrumbs = [], actions }) {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        mb: 3,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: 2,
      }}
    >
      <Box>
        {breadcrumbs.length > 0 && (
          <Breadcrumbs
            separator={<i className="bi bi-chevron-right" style={{ fontSize: '0.75rem', color: '#9ca3af' }}></i>}
            sx={{ mb: 0.5, '& .MuiBreadcrumbs-separator': { mx: 0.5 } }}
          >
            {breadcrumbs.map((crumb, idx) => (
              <Link
                key={idx}
                underline="hover"
                color={idx === breadcrumbs.length - 1 ? 'text.primary' : 'text.secondary'}
                sx={{
                  cursor: crumb.path ? 'pointer' : 'default',
                  fontSize: '0.8125rem',
                  fontWeight: idx === breadcrumbs.length - 1 ? 600 : 400,
                }}
                onClick={() => crumb.path && navigate(crumb.path)}
              >
                {crumb.label}
              </Link>
            ))}
          </Breadcrumbs>
        )}
        <Typography variant="h2" sx={{ fontWeight: 700, color: 'text.primary' }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {actions && <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>{actions}</Box>}
    </Box>
  );
}
