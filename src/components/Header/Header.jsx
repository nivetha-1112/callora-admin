import React, { useState } from 'react';
import {
  AppBar, Toolbar, IconButton, Typography, Badge, Avatar, Box,
  Menu, MenuItem, ListItemIcon, ListItemText, Divider, InputBase, Tooltip,
  useMediaQuery, useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../store/AppContext';
import { getInitials } from '../../utils/helpers';

export default function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchor, setNotifAnchor] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);

  const unreadCount = state.notifications.filter((n) => !n.read).length;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        color: 'text.primary',
        zIndex: (theme) => theme.zIndex.drawer - 1,
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 3 }, minHeight: '68px !important', gap: 1 }}>
        {isMobile && (
          <IconButton
            edge="start"
            onClick={() => dispatch({ type: 'TOGGLE_MOBILE_SIDEBAR' })}
            sx={{ color: 'text.primary' }}
          >
            <i className="bi bi-list" style={{ fontSize: '1.4rem' }}></i>
          </IconButton>
        )}

        {/* Search */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: searchFocused ? '#eaf4ff' : '#f5f7fa',
            borderRadius: 2.5,
            px: 2,
            py: 0.5,
            flex: 1,
            maxWidth: { xs: '100%', sm: 400 },
            border: searchFocused ? '1px solid #034cae30' : '1px solid transparent',
            transition: 'all 0.3s ease',
          }}
        >
          <i className="bi bi-search" style={{ color: '#6b7280', fontSize: '1.05rem', marginRight: '10px' }}></i>
          <InputBase
            placeholder="Search anything..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            sx={{
              flex: 1,
              fontSize: '0.875rem',
              '& input::placeholder': { color: '#9ca3af', opacity: 1 },
            }}
          />
        </Box>

        <Box sx={{ flex: 1 }} />

        {/* Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title="Toggle Fullscreen">
            <IconButton
              sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'flex' } }}
              onClick={() => {
                if (!document.fullscreenElement) document.documentElement.requestFullscreen();
                else document.exitFullscreen();
              }}
            >
              <i className="bi bi-fullscreen" style={{ fontSize: '1.1rem' }}></i>
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton
              onClick={(e) => setNotifAnchor(e.currentTarget)}
              sx={{ color: 'text.secondary' }}
            >
              <Badge badgeContent={unreadCount} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', minWidth: 18, height: 18 } }}>
                <i className="bi bi-bell" style={{ fontSize: '1.15rem' }}></i>
              </Badge>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={notifAnchor}
            open={Boolean(notifAnchor)}
            onClose={() => setNotifAnchor(null)}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: { mt: 1.5, borderRadius: 3, boxShadow: '0 10px 40px rgba(0,0,0,0.12)', width: 340, maxHeight: 400 },
            }}
          >
            <Box sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid #e5e7eb' }}>
              <Typography variant="h6" sx={{ fontSize: '0.9375rem' }}>Notifications</Typography>
            </Box>
            {state.notifications.map((notif) => (
              <MenuItem
                key={notif.id}
                onClick={() => {
                  dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notif.id });
                  setNotifAnchor(null);
                }}
                sx={{
                  py: 1.5,
                  px: 2.5,
                  backgroundColor: notif.read ? 'transparent' : '#eaf4ff40',
                  '&:hover': { backgroundColor: '#f5f7fa' },
                }}
              >
                <Box>
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: notif.read ? 400 : 600 }}>
                    {notif.title}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.3 }}>
                    {notif.message}
                  </Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: '#9ca3af', mt: 0.5 }}>
                    {notif.time}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Menu>

          <Divider orientation="vertical" flexItem sx={{ mx: 1, display: { xs: 'none', sm: 'block' } }} />

          {/* User Profile */}
          <Box
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              px: 1,
              py: 0.5,
              borderRadius: 2,
              transition: 'all 0.2s ease',
              '&:hover': { backgroundColor: '#f5f7fa' },
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                background: 'linear-gradient(135deg, #034cae, #6366f1)',
                fontSize: '0.8rem',
                fontWeight: 700,
              }}
            >
              {getInitials(state.user.name)}
            </Avatar>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, lineHeight: 1.2 }}>
                {state.user.name}
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', lineHeight: 1.2 }}>
                {state.user.role}
              </Typography>
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'block' }, ml: 0.5, mt: 0.3 }}>
              <i className="bi bi-chevron-down" style={{ fontSize: '0.8rem', color: '#6b7280' }}></i>
            </Box>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: { mt: 1.5, borderRadius: 3, boxShadow: '0 10px 40px rgba(0,0,0,0.12)', minWidth: 200 },
            }}
          >
            <MenuItem onClick={() => { navigate('/settings'); setAnchorEl(null); }}>
              <ListItemIcon><i className="bi bi-person" style={{ fontSize: '1.1rem', color: '#475569' }}></i></ListItemIcon>
              <ListItemText>My Profile</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => { navigate('/settings'); setAnchorEl(null); }}>
              <ListItemIcon><i className="bi bi-gear" style={{ fontSize: '1.1rem', color: '#475569' }}></i></ListItemIcon>
              <ListItemText>Settings</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => setAnchorEl(null)} sx={{ color: 'error.main' }}>
              <ListItemIcon><i className="bi bi-box-arrow-right" style={{ fontSize: '1.1rem', color: '#ef4444' }}></i></ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
