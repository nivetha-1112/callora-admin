import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Typography, Divider, useMediaQuery, useTheme, IconButton
} from '@mui/material';
import { useAppContext } from '../../store/AppContext';

const SIDEBAR_WIDTH = 270;

const menuItems = [
  { text: 'Dashboard', iconClass: 'bi bi-speedometer2', path: '/' },
  { text: 'Manager', iconClass: 'bi bi-person-badge', path: '/managers' },
  { text: 'Telecaller', iconClass: 'bi bi-headset', path: '/telecallers' },
  { text: 'Logout report', iconClass: 'bi bi-shield-lock', path: '/logout-report' },
  { text: 'Reports', iconClass: 'bi bi-bar-chart-line', path: '/reports' },
  { text: 'Settings', iconClass: 'bi bi-gear', path: '/settings' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { state, dispatch } = useAppContext();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      dispatch({ type: 'CLOSE_MOBILE_SIDEBAR' });
    }
  };

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #0343a8 0%, #022d71 100%)',
        color: '#ffffff',
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          px: 3,
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)',
          }}
        >
          <i className="bi bi-telephone-fill" style={{ fontSize: '1.25rem', color: '#ffffff' }}></i>
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', color: '#fff', lineHeight: 1.2 }}>
            TeleCall
          </Typography>
          <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Admin Panel
          </Typography>
        </Box>
        {isMobile && (
          <IconButton
            onClick={() => dispatch({ type: 'CLOSE_MOBILE_SIDEBAR' })}
            sx={{ ml: 'auto', color: '#ffffff' }}
          >
            <i className="bi bi-x-lg" style={{ fontSize: '1.2rem', color: '#ffffff' }}></i>
          </IconButton>
        )}
      </Box>

      {/* Menu */}
      <List sx={{ flex: 1, px: 1.5, py: 2 }}>
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  px: 2,
                  py: 1.2,
                  color: '#ffffff',
                  backgroundColor: active ? 'rgba(255,255,255,0.18)' : 'transparent',
                  backdropFilter: active ? 'blur(10px)' : 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    transform: 'translateX(4px)',
                  },
                  '& .MuiListItemIcon-root': {
                    color: '#ffffff',
                    minWidth: 40,
                    transition: 'color 0.2s ease',
                  },
                  '&:hover .MuiListItemIcon-root': {
                    color: '#ffffff',
                  },
                }}
              >
                <ListItemIcon>
                  <i className={item.iconClass} style={{ fontSize: '1.2rem', color: '#ffffff' }}></i>
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: active ? 600 : 500,
                    fontSize: '0.875rem',
                  }}
                />
                {active && (
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: '#4ade80',
                      boxShadow: '0 0 8px rgba(74,222,128,0.6)',
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Footer */}
      <Box
        sx={{
          px: 3,
          py: 2,
          borderTop: '1px solid rgba(255,255,255,0.1)',
          textAlign: 'center',
        }}
      >
        <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>
          TeleCall Admin v2.0
        </Typography>
        <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', mt: 0.3 }}>
          © 2026 All rights reserved
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: SIDEBAR_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: SIDEBAR_WIDTH,
              boxSizing: 'border-box',
              border: 'none',
              boxShadow: '4px 0 24px rgba(3,76,174,0.08)',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={state.sidebarMobileOpen}
          onClose={() => dispatch({ type: 'CLOSE_MOBILE_SIDEBAR' })}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: SIDEBAR_WIDTH,
              boxSizing: 'border-box',
              border: 'none',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
}

export { SIDEBAR_WIDTH };
