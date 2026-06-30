import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Tabs, Tab, TextField, Button,
  Avatar, Switch, FormControlLabel, Divider, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Select, MenuItem, FormControl,
  InputLabel, IconButton, Radio, RadioGroup, FormLabel
} from '@mui/material';
import PageHeader from '../../components/PageHeader/PageHeader';
import { useAppContext } from '../../store/AppContext';
import { getInitials } from '../../utils/helpers';


export default function Settings() {
  const [tab, setTab] = useState(0);
  const { state } = useAppContext();
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    loginAlerts: true,
    reportReady: true,
    newTelecaller: false,
    dailySummary: true,
    weeklyReport: true,
    failedLogins: true,
    systemUpdates: false,
  });

  const [themeChoice, setThemeChoice] = useState('light');
  const [accentColor, setAccentColor] = useState('#0343a8');

  const tabItems = [
    { label: 'Profile', icon: <i className="bi bi-person" style={{ fontSize: '1.05rem' }}></i> },
    { label: 'Password', icon: <i className="bi bi-key" style={{ fontSize: '1.05rem' }}></i> },
    { label: 'Notifications', icon: <i className="bi bi-bell" style={{ fontSize: '1.05rem' }}></i> },
    { label: 'Theme', icon: <i className="bi bi-palette" style={{ fontSize: '1.05rem' }}></i> },
  ];

  return (
    <Box>
      <PageHeader
        title="Settings"
        subtitle="Manage your account preferences and system settings"
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Settings' }]}
      />

      <Grid container spacing={3}>
        {/* Sidebar Tabs */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent sx={{ p: 1 }}>
              <Tabs
                orientation="vertical"
                value={tab}
                onChange={(e, v) => setTab(v)}
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none', fontWeight: 500, fontSize: '0.875rem',
                    justifyContent: 'flex-start', px: 2, py: 1.5, minHeight: 48,
                    borderRadius: 2, mb: 0.5,
                  },
                  '& .Mui-selected': { color: '#0343a8', backgroundColor: '#eaf4ff' },
                  '& .MuiTabs-indicator': { display: 'none' },
                }}
              >
                {tabItems.map((item) => (
                  <Tab
                    key={item.label}
                    label={item.label}
                    icon={item.icon}
                    iconPosition="start"
                    sx={{ gap: 1.5 }}
                  />
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </Grid>

        {/* Content */}
        <Grid size={{ xs: 12, md: 9 }}>
          {/* Profile Settings */}
          {tab === 0 && (
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Profile Settings</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                  <Box sx={{ position: 'relative' }}>
                    <Avatar sx={{ width: 80, height: 80, fontSize: '1.75rem', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>
                      {getInitials(state.user.name)}
                    </Avatar>
                    <IconButton size="small" sx={{
                      position: 'absolute', bottom: 0, right: 0,
                      backgroundColor: '#0343a8', color: '#fff',
                      '&:hover': { backgroundColor: '#022d71' },
                      width: 28, height: 28,
                    }}>
                      <i className="bi bi-camera" style={{ fontSize: '0.85rem' }}></i>
                    </IconButton>
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>{state.user.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{state.user.role}</Typography>
                  </Box>
                </Box>
                <Grid container spacing={2.5}>
                  <Grid size={6}><TextField fullWidth label="Full Name" defaultValue={state.user.name} /></Grid>
                  <Grid size={6}><TextField fullWidth label="Email" defaultValue={state.user.email} type="email" /></Grid>
                  <Grid size={6}><TextField fullWidth label="Phone" defaultValue="+91 98765 43210" /></Grid>
                  <Grid size={6}><TextField fullWidth label="Role" defaultValue={state.user.role} disabled /></Grid>
                  <Grid size={6}><TextField fullWidth label="Department" defaultValue="Administration" /></Grid>
                  <Grid size={6}><TextField fullWidth label="Location" defaultValue="Mumbai, India" /></Grid>
                  <Grid size={12}>
                    <TextField fullWidth label="Bio" multiline rows={3} defaultValue="Senior Administrator managing telecalling operations across multiple departments." />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="contained" startIcon={<i className="bi bi-save"></i>}
                    sx={{ background: 'linear-gradient(135deg, #0343a8, #0454cc)', px: 4 }}>
                    Save Changes
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Password */}
          {tab === 1 && (
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Change Password</Typography>
                <Box sx={{ maxWidth: 480 }}>
                  <Grid container spacing={2.5}>
                    <Grid size={12}><TextField fullWidth label="Current Password" type="password" /></Grid>
                    <Grid size={12}><TextField fullWidth label="New Password" type="password" /></Grid>
                    <Grid size={12}><TextField fullWidth label="Confirm New Password" type="password" /></Grid>
                  </Grid>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Password must contain:</Typography>
                    {['At least 8 characters', 'One uppercase letter', 'One number', 'One special character'].map((rule) => (
                      <Typography key={rule} variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.3 }}>
                        • {rule}
                      </Typography>
                    ))}
                  </Box>
                  <Box sx={{ mt: 3 }}>
                    <Button variant="contained" startIcon={<i className="bi bi-key-fill"></i>}
                      sx={{ background: 'linear-gradient(135deg, #0343a8, #0454cc)', px: 4 }}>
                      Update Password
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Notifications */}
          {tab === 2 && (
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Notification Preferences</Typography>
                {[
                  { key: 'emailAlerts', label: 'Email Alerts', desc: 'Receive important notifications via email' },
                  { key: 'loginAlerts', label: 'Login Alerts', desc: 'Get notified about suspicious login activity' },
                  { key: 'reportReady', label: 'Report Ready', desc: 'Notify when scheduled reports are generated' },
                  { key: 'newTelecaller', label: 'New Telecaller Added', desc: 'Alert when a new telecaller joins' },
                  { key: 'dailySummary', label: 'Daily Summary', desc: 'Receive daily performance summary' },
                  { key: 'weeklyReport', label: 'Weekly Report', desc: 'Get weekly comprehensive report' },
                  { key: 'failedLogins', label: 'Failed Login Alerts', desc: 'Alert on multiple failed login attempts' },
                  { key: 'systemUpdates', label: 'System Updates', desc: 'Notifications about system maintenance' },
                ].map((item, idx) => (
                  <React.Fragment key={item.key}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5 }}>
                      <Box>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.label}</Typography>
                        <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                      </Box>
                      <Switch
                        checked={notifications[item.key]}
                        onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': { color: '#0343a8' },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#0343a8' },
                        }}
                      />
                    </Box>
                    {idx < 7 && <Divider />}
                  </React.Fragment>
                ))}
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="contained" startIcon={<i className="bi bi-save"></i>}
                    sx={{ background: 'linear-gradient(135deg, #0343a8, #0454cc)', px: 4 }}>
                    Save Preferences
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Theme */}
          {tab === 3 && (
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Theme Settings</Typography>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Appearance</Typography>
                  <Grid container spacing={2}>
                    {['light', 'dark'].map((mode) => (
                      <Grid size={{ xs: 6, sm: 4 }} key={mode}>
                        <Box
                          onClick={() => setThemeChoice(mode)}
                          sx={{
                            p: 2, borderRadius: 3, cursor: 'pointer',
                            border: themeChoice === mode ? '2px solid #0343a8' : '2px solid #e5e7eb',
                            backgroundColor: mode === 'dark' ? '#1a1a2e' : '#ffffff',
                            transition: 'all 0.2s ease',
                            '&:hover': { borderColor: '#0343a8' },
                          }}
                        >
                          <Box sx={{
                            height: 60, borderRadius: 2, mb: 1.5,
                            backgroundColor: mode === 'dark' ? '#2d2d44' : '#f5f7fa',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <Box sx={{
                              width: 40, height: 8, borderRadius: 4,
                              backgroundColor: mode === 'dark' ? '#4a4a6a' : '#e5e7eb',
                            }} />
                          </Box>
                          <Typography sx={{
                            textAlign: 'center', fontWeight: 600, fontSize: '0.875rem',
                            color: mode === 'dark' ? '#ffffff' : 'text.primary',
                            textTransform: 'capitalize',
                          }}>
                            {mode} Mode
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Accent Color</Typography>
                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    {['#0343a8', '#6366f1', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'].map((color) => (
                      <Box
                        key={color}
                        onClick={() => setAccentColor(color)}
                        sx={{
                          width: 40, height: 40, borderRadius: 2,
                          backgroundColor: color, cursor: 'pointer',
                          border: accentColor === color ? '3px solid #1a1a2e' : '3px solid transparent',
                          outline: accentColor === color ? '2px solid #ffffff' : 'none',
                          transition: 'all 0.2s ease',
                          '&:hover': { transform: 'scale(1.1)' },
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="contained" startIcon={<i className="bi bi-save"></i>}
                    sx={{ background: 'linear-gradient(135deg, #0343a8, #0454cc)', px: 4 }}>
                    Save Theme
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
